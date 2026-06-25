const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

class MockQuery {
  constructor(promise) {
    this.promise = promise;
    this.sortOptions = null;
    this.limitCount = null;
    this.selectOptions = null;
    this.populateOptions = [];
  }

  sort(options) {
    this.sortOptions = options;
    return this;
  }

  limit(count) {
    this.limitCount = count;
    return this;
  }

  select(fields) {
    this.selectOptions = fields;
    return this;
  }

  populate(field, fields) {
    this.populateOptions.push({ field, fields });
    return this;
  }

  async then(onFulfilled, onRejected) {
    try {
      let results = await this.promise;

      // Apply sort
      if (this.sortOptions) {
        results.sort((a, b) => {
          for (let key in this.sortOptions) {
            const order = this.sortOptions[key];
            if (a[key] < b[key]) return order === -1 ? 1 : -1;
            if (a[key] > b[key]) return order === -1 ? -1 : 1;
          }
          return 0;
        });
      }

      // Apply limit
      if (this.limitCount !== null) {
        results = results.slice(0, this.limitCount);
      }

      // Apply select (exclude fields like password)
      if (this.selectOptions) {
        const fields = this.selectOptions.split(' ');
        results = results.map(item => {
          const newItem = { ...item };
          fields.forEach(f => {
            if (f.startsWith('-')) {
              delete newItem[f.substring(1)];
            }
          });
          return newItem;
        });
      }

      // Apply populate
      if (this.populateOptions.length > 0) {
        results = results.map(item => {
          this.populateOptions.forEach(opt => {
            if (item.populate) {
              item.populate(opt.field, opt.fields);
            }
          });
          return item;
        });
      }

      return onFulfilled(results);
    } catch (err) {
      if (onRejected) {
        return onRejected(err);
      }
      throw err;
    }
  }
}

class MockSingleQuery {
  constructor(promise) {
    this.promise = promise;
    this.selectOptions = null;
    this.populateOptions = [];
  }

  select(fields) {
    this.selectOptions = fields;
    return this;
  }

  populate(field, fields) {
    this.populateOptions.push({ field, fields });
    return this;
  }

  async then(onFulfilled, onRejected) {
    try {
      const item = await this.promise;
      if (!item) return onFulfilled(null);

      // Create a shallow copy to prevent modifying cached mock data objects
      let result = { ...item };

      // Apply select
      if (this.selectOptions) {
        const fields = this.selectOptions.split(' ');
        fields.forEach(f => {
          if (f.startsWith('-')) {
            delete result[f.substring(1)];
          }
        });
      }

      // Apply populate
      if (this.populateOptions.length > 0) {
        this.populateOptions.forEach(opt => {
          if (item.populate) {
            item.populate(opt.field, opt.fields);
          }
        });
        // populate modifies the wrapped object which we return
        result = item;
      }

      return onFulfilled(result);
    } catch (err) {
      if (onRejected) {
        return onRejected(err);
      }
      throw err;
    }
  }
}

class MockModel {
  constructor(modelName, defaultData = []) {
    this.modelName = modelName.toLowerCase();
    this.filePath = path.join(DATA_DIR, `${this.modelName}.json`);
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify(defaultData, null, 2));
    }
  }

  _read() {
    try {
      const data = fs.readFileSync(this.filePath, 'utf-8');
      return JSON.parse(data);
    } catch (err) {
      return [];
    }
  }

  _write(data) {
    fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2));
  }

  find(query = {}) {
    const promise = (async () => {
      let items = this._read();
      
      // Simple query filtering
      return items.filter(item => {
        for (let key in query) {
          if (query[key] && typeof query[key] === 'object') {
            // Handle $ne, $ne: 'cancelled', etc.
            if (query[key].$ne !== undefined && item[key] === query[key].$ne) {
              return false;
            }
          } else if (item[key] !== query[key]) {
            return false;
          }
        }
        return true;
      }).map(item => this._wrap(item));
    })();

    return new MockQuery(promise);
  }

  findOne(query = {}) {
    const promise = (async () => {
      const items = await this.find(query);
      return items[0] || null;
    })();

    return new MockSingleQuery(promise);
  }

  findById(id) {
    return this.findOne({ _id: id.toString() });
  }

  async create(data) {
    const items = this._read();
    const newItem = {
      _id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...data
    };
    items.push(newItem);
    this._write(items);
    return this._wrap(newItem);
  }

  async insertMany(arr) {
    const items = this._read();
    const newItems = arr.map(data => ({
      _id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...data
    }));
    items.push(...newItems);
    this._write(items);
    return newItems.map(item => this._wrap(item));
  }

  async countDocuments(query = {}) {
    const items = await this.find(query);
    return items.length;
  }

  async deleteMany() {
    this._write([]);
    return { deletedCount: 0 };
  }

  _wrap(item) {
    if (!item) return null;
    const model = this;
    return {
      ...item,
      save: async function() {
        const items = model._read();
        const index = items.findIndex(i => i._id === this._id);
        this.updatedAt = new Date().toISOString();
        if (index !== -1) {
          items[index] = { ...this };
        } else {
          items.push({ ...this });
        }
        model._write(items);
        return this;
      },
      populate: function(field, fields) {
        // Mock populate by reading from referenced file
        if (field === 'user') {
          try {
            const usersFile = path.join(DATA_DIR, 'user.json');
            if (fs.existsSync(usersFile)) {
              const users = JSON.parse(fs.readFileSync(usersFile, 'utf-8'));
              const userObj = users.find(u => u._id === this.user);
              if (userObj) {
                const selectedFields = fields.split(' ');
                const populatedUser = {};
                selectedFields.forEach(f => {
                  populatedUser[f] = userObj[f];
                });
                this.user = populatedUser;
              }
            }
          } catch (e) {
            console.error('Populate failed', e);
          }
        }
        return this;
      },
      sort: function() {
        return this; // mock sorting
      },
      limit: function() {
        return this; // mock limit
      }
    };
  }
}

module.exports = MockModel;

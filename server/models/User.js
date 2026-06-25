const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: 6,
    },
    phone: {
      type: String,
      required: [true, 'Please add a phone number'],
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
  },
  {
    timestamps: true,
  }
);

// Encrypt password using bcrypt
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const UserMongoose = mongoose.model('User', userSchema);

let mockUser = null;
function getUserModel() {
  if (global.useMockDb) {
    if (!mockUser) {
      const MockModel = require('./dbMock');
      class MockUserModel extends MockModel {
        async create(data) {
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(data.password, salt);
          return super.create({ ...data, password: hashedPassword });
        }

        _wrap(item) {
          const wrapped = super._wrap(item);
          if (wrapped) {
            wrapped.matchPassword = async function(enteredPassword) {
              return await bcrypt.compare(enteredPassword, this.password);
            };
          }
          return wrapped;
        }
      }
      mockUser = new MockUserModel('User');
    }
    return mockUser;
  } else {
    return UserMongoose;
  }
}

module.exports = global.useMockDb ? new Proxy({}, {
  get: function(target, prop, receiver) {
    const model = getUserModel();
    return Reflect.get(model, prop, receiver);
  }
}) : UserMongoose;

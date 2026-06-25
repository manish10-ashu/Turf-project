import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { adminAPI, pricingAPI } from '../services/api';
import SectionHeading from '../components/ui/SectionHeading';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { useSettings } from "../context/SettingsContext";
import { 
  Trophy, 
  Users, 
  DollarSign, 
  MessageSquare, 
  Star, 
  Calendar, 
  Check, 
  X,
  Mail
} from 'lucide-react';

const AdminDashboard = () => {
  const { reload, updateSettingsLocal } = useSettings();
  const { user, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  

  const [activeTab, setActiveTab] = useState('bookings');
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [pricing, setPricing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState([]);
  const [settings, setSettings] = useState({
  turfName: '',
  whatsappNumber: '',
  contactNumber: '',
  address: '',
  upiId: '',
  email: '',
  gallery: []
});

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      navigate('/');
    }
  }, [user, authLoading, navigate]);
   const fetchPricing = async () => {
  try {
    const { data } = await pricingAPI.getPricing();

    if (data.success) {
      setPricing(data.pricing);
    }
  } catch (err) {
    console.error(err);
  }
};
  const fetchData = async () => {
    setLoading(true);
    try {
      const statsRes = await adminAPI.getStats();
      const bookingsRes = await adminAPI.getAllBookings();
      const usersRes = await adminAPI.getAllUsers();
      const reviewsRes = await adminAPI.getAllReviews();
      const contactsRes = await adminAPI.getAllContacts();
      const settingsRes = await adminAPI.getSettings();

      if (statsRes.data.success) setStats(statsRes.data.stats);
      if (bookingsRes.data.success) setBookings(bookingsRes.data.bookings);
      if (usersRes.data.success) setUsers(usersRes.data.users);
      if (reviewsRes.data.success) setReviews(reviewsRes.data.reviews);
      if (contactsRes.data.success) setContacts(contactsRes.data.contacts);
      if (settingsRes.data.success) {
  setSettings(settingsRes.data.settings);
}
    } catch (err) {
      console.error('Failed to load admin dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchData();
         fetchPricing();
    }
  }, [user]);

  const handleDeleteAllBookings = async () => {
  const confirmDelete = window.confirm(
    'Are you sure? This will delete ALL booking history.'
  );

  if (!confirmDelete) return;

  try {
    const { data } = await adminAPI.deleteAllBookings();

    if (data.success) {
      setBookings([]);
      alert('All bookings deleted successfully');
    }
  } catch (err) {
    alert('Failed to delete bookings');
  }
};

 const handleUpdateBookingStatus = async (id, status) => {
  try {
    const { data } = await adminAPI.updateBookingStatus(id, status);

    if (data.success) {

      if (data.whatsappUrl) {
        window.open(data.whatsappUrl, '_blank');
      }

      setBookings(prev =>
        prev.map(b =>
          b._id === id
            ? { ...b, status: data.booking.status }
            : b
        )
      );

      const statsRes = await adminAPI.getStats();

      if (statsRes.data.success) {
        setStats(statsRes.data.stats);
      }
    }
  } catch (err) {
    alert('Failed to update booking status');
  }
};

  const handleApproveReview = async (id, isApproved) => {
    try {
      const { data } = await adminAPI.approveReview(id, isApproved);
      if (data.success) {
        setReviews(prev => prev.map(r => r._id === id ? { ...r, isApproved: data.review.isApproved } : r));
      }
    } catch (err) {
      alert('Failed to update review status');
    }
  };

  const handleMarkContactRead = async (id) => {
    try {
      const { data } = await adminAPI.markContactAsRead(id);
      if (data.success) {
        setContacts(prev => prev.map(c => c._id === id ? { ...c, isRead: true } : c));
      }
    } catch (err) {
      alert('Failed to update message status');
    }
  };

  const handleSavePricing = async () => {
  try {
    for (const slot of pricing) {
      await pricingAPI.updatePricing(slot);
    }

    alert("Pricing updated successfully");
  } catch (err) {
    console.error(err);
    alert("Failed to update pricing");
  }
};
  const handleSaveSettings = async () => {
  try {
    const { data } = await adminAPI.updateSettings(settings);

    if (data.success) {
      alert('Settings saved successfully');
    }
  } catch (err) {
    alert('Failed to save settings');
  }
  
await reload();
};

  if (authLoading || !user || user.role !== 'admin') {
    return <div className="text-center py-40">Authenticating admin access...</div>;
  }
    console.log("PRICING:", pricing);
  return (
    <div className="pt-40 md:pt-32 min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors pb-12 overflow-y-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <SectionHeading title="System Management" subtitle="Admin Panel" />

        {/* Stats Cards Grid */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card hoverEffect={false} className="p-6 flex items-center justify-between">
              <div>
                <span className="text-sm font-semibold text-slate-500 block mb-1">Total Revenue</span>
                <span className="text-3xl font-black font-display text-slate-900 dark:text-white">₹{stats.totalRevenue}</span>
              </div>
              <div className="p-4 bg-emerald-500/10 text-brand-emerald rounded-2xl">
                <DollarSign className="h-6 w-6" />
              </div>
            </Card>

            <Card hoverEffect={false} className="p-6 flex items-center justify-between">
              <div>
                <span className="text-sm font-semibold text-slate-500 block mb-1">Total Bookings</span>
                <span className="text-3xl font-black font-display text-slate-900 dark:text-white">{stats.totalBookings}</span>
              </div>
              <div className="p-4 bg-blue-500/10 text-blue-500 rounded-2xl">
                <Calendar className="h-6 w-6" />
              </div>
            </Card>

            <Card hoverEffect={false} className="p-6 flex items-center justify-between">
              <div>
                <span className="text-sm font-semibold text-slate-500 block mb-1">Registered Players</span>
                <span className="text-3xl font-black font-display text-slate-900 dark:text-white">{stats.totalUsers}</span>
              </div>
              <div className="p-4 bg-purple-500/10 text-purple-500 rounded-2xl">
                <Users className="h-6 w-6" />
              </div>
            </Card>

            <Card hoverEffect={false} className="p-6 flex items-center justify-between">
              <div>
                <span className="text-sm font-semibold text-slate-500 block mb-1">Pending Reviews</span>
                <span className="text-3xl font-black font-display text-slate-900 dark:text-white">{stats.pendingReviews}</span>
              </div>
              <div className="p-4 bg-amber-500/10 text-brand-amber rounded-2xl">
                <Star className="h-6 w-6" />
              </div>
            </Card>
          </div>
        )}

        {/* Tab Buttons */}
       <div className="flex overflow-x-auto whitespace-nowrap border-b border-slate-200 dark:border-slate-800 mb-8 space-x-6">
          {['bookings', 'users', 'reviews', 'messages','settings'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 px-1 shrink-0 font-bold text-sm border-b-2 uppercase tracking-wider transition-colors focus:outline-none ${
                activeTab === tab
                  ? 'border-brand-emerald text-brand-emerald'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
       
       <div className="flex justify-center my-6">
              <Button
              variant="danger"
                onClick={handleDeleteAllBookings}
                    >
    Clear All Booking History
  </Button>
</div>
        {/* Tab Content Panels */}
        {loading ? (
          <div className="text-center py-20 text-slate-500" >Loading details...</div>
        ) : (
          <div className="space-y-6" >
            {/* Bookings Tab */}

            {activeTab === 'bookings' && (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <Card key={booking._id} hoverEffect={false} className="p-4 border border-slate-100 dark:border-slate-800/60">
                    <div className="flex flex-col gap-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-slate-950 dark:text-white">{booking.user?.name || 'Guest'}</p>
                          <p className="text-xs text-slate-500">{booking.user?.phone}</p>
                        </div>
                        <Badge variant={
                          booking.status === 'confirmed' ? 'success' : 
                          booking.status === 'pending' ? 'warning' : 'danger'
                        }>
                          {booking.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-slate-500">Sport:</span> {booking.sport}
                        </div>
                        <div>
                          <span className="text-slate-500">Date:</span> {booking.date}
                        </div>
                        <div>
                          <span className="text-slate-500">Time:</span> {booking.timeSlot}
                        </div>
                        <div className="font-bold text-brand-emerald">
                          ₹{booking.totalPrice}
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2 mt-2">
                        {booking.status === 'pending' && (
                        <>
                          <Button variant="primary" size="sm" onClick={() =>
                            handleUpdateBookingStatus(booking._id, 'confirmed')
                          }>
                            Confirm
                          </Button>
                          <Button variant="danger" size="sm" onClick={() =>
                            handleUpdateBookingStatus(booking._id, 'cancelled')
                          }>
                            Reject
                          </Button>
                        </>
                      )}
                      {booking.status === 'confirmed' && (
                        <Button variant="danger" size="sm" onClick={() =>
                          handleUpdateBookingStatus(booking._id, 'cancelled')
                        }>
                          Cancel
                        </Button>
                      )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <Card hoverEffect={false} className="p-6 border border-slate-100 dark:border-slate-800/60">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[700px] text-left border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 pb-3 text-slate-500 font-bold">
                        <th className="py-3 px-4">Name</th>
                        <th className="py-3 px-4">Email</th>
                        <th className="py-3 px-4">Phone</th>
                        <th className="py-3 px-4">Role</th>
                        <th className="py-3 px-4">Registered Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u._id} className="border-b border-slate-100 dark:border-slate-900/60">
                          <td className="py-3.5 px-4 font-bold text-slate-950 dark:text-white">{u.name}</td>
                          <td className="py-3.5 px-4">{u.email}</td>
                          <td className="py-3.5 px-4">{u.phone}</td>
                          <td className="py-3.5 px-4">
                            <Badge variant={u.role === 'admin' ? 'warning' : 'secondary'}>{u.role}</Badge>
                          </td>
                          <td className="py-3.5 px-4 text-xs text-slate-500">
                            {new Date(u.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reviews.map((r) => (
                  <Card key={r._id} hoverEffect={false} className="p-6 flex flex-col justify-between relative">
                    <div className="absolute top-4 right-4">
                      <Badge variant={r.isApproved ? 'success' : 'danger'}>
                        {r.isApproved ? 'Approved' : 'Pending'}
                      </Badge>
                    </div>

                    <div>
                      <div className="flex space-x-1 text-brand-amber mb-4">
                        {[...Array(r.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-current" />
                        ))}
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 italic mb-4">"{r.comment}"</p>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">- {r.name}</h4>
                    </div>

                    <div className="flex justify-end space-x-2 border-t border-slate-100 dark:border-slate-800/60 pt-4 mt-4">
                      {r.isApproved ? (
                        <Button variant="danger" size="sm" onClick={() => handleApproveReview(r._id, false)}>
                          Deactivate
                        </Button>
                      ) : (
                        <Button variant="primary" size="sm" onClick={() => handleApproveReview(r._id, true)}>
                          Approve
                        </Button>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* Messages Tab */}
            {activeTab === 'messages' && (
              <div className="space-y-4">
                {contacts.map((c) => (
                  <Card key={c._id} hoverEffect={false} className="p-6 border border-slate-100 dark:border-slate-800/60">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="text-base font-bold text-slate-950 dark:text-white flex items-center space-x-2">
                          <span>{c.subject}</span>
                          {!c.isRead && <Badge variant="warning">New</Badge>}
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          From: {c.name} ({c.email}) | Phone: {c.phone}
                        </p>
                      </div>
                      <span className="text-xs text-slate-400">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 bg-white/30 dark:bg-slate-900/30 p-4 rounded-xl mb-4">
                      {c.message}
                    </p>

                    {!c.isRead && (
                      <div className="flex justify-end">
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          className="flex items-center space-x-1" 
                          onClick={() => handleMarkContactRead(c._id)}
                        >
                          <Check className="h-4 w-4" />
                          <span>Mark as Read</span>
                        </Button>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            )}
                {activeTab === 'settings' && (
                <Card hoverEffect={false} className="p-6">
    
                <h2 className="text-xl font-bold mb-6">Owner Settings</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <input
                className="border p-3 rounded-lg"
                placeholder="Turf Name"
                value={settings.turfName}
                 onChange={(e) =>
                setSettings({ ...settings, turfName: e.target.value })
               }
              />
            <input
             className="border p-3 rounded-lg"
             placeholder="Hero Title"
             value={settings.heroTitle}
             onChange={(e) =>
              setSettings({ ...settings, heroTitle: e.target.value })
             }
            />
            <input
               className="border p-3 rounded-lg"
                placeholder="Hero Subtitle"
                value={settings.heroSubtitle}
                onChange={(e) =>
                  setSettings({ ...settings, heroSubtitle: e.target.value })
                 }
             />
             <textarea
                 className="border p-3 rounded-lg w-full"
                 rows={3}
                 placeholder="Hero Description"
                 value={settings.heroDescription}
                 onChange={(e) =>
                 setSettings({ ...settings, heroDescription: e.target.value })
                  }
             />
            <input 
             className="border p-3 rounded-lg"
             placeholder="WhatsApp Number"
             value={settings.whatsappNumber}
             onChange={(e) =>
             setSettings({ ...settings, whatsappNumber: e.target.value })
             }
             />

            <input
              className="border p-3 rounded-lg"
              placeholder="Contact Number"
              value={settings.contactNumber}
              onChange={(e) =>
              setSettings({ ...settings, contactNumber: e.target.value })
              }
             />

              <input
              className="border p-3 rounded-lg"
               placeholder="UPI ID"
              value={settings.upiId}
              onChange={(e) =>
              setSettings({ ...settings, upiId: e.target.value })
               }
               />

              </div>
              <input
                   className="border p-3 rounded-lg w-full mt-4"
                   placeholder="Email"
                   value={settings.email}
                    onChange={(e) =>
                    setSettings({ ...settings, email: e.target.value })
                    }
                  />
                 <button
                type="button"
                onClick={() =>
                 setSettings((prev) => ({
                 ...prev,
                gallery: [...(prev.gallery || []), ""]
                }))
                }
                 className="bg-green-500 text-white px-4 py-2 rounded mt-4 mb-2"
                  >
                   + Add Gallery Image
                 </button>
                 {settings.gallery?.map((img, index) => (
                <div key={index} className="flex gap-2 mt-2">
    
                 {/* Image input */}
                 <input
                className="border p-2 w-full"
                   placeholder={`Image URL ${index + 1}`}
                   value={img}
                   onChange={(e) => {
                   const updated = [...settings.gallery];
                   updated[index] = e.target.value;
                   setSettings({ ...settings, gallery: updated });
                   }}
                   />

                  {/* DELETE BUTTON (PUT HERE) */}
                <button
                 type="button"
                onClick={() => {
                const updated = settings.gallery.filter((_, i) => i !== index);
                 setSettings({ ...settings, gallery: updated });
                  }}
                className="bg-red-500 text-white px-3 rounded"
                   >
                Delete
               </button>

                 </div>
              ))}
             <textarea
                className="border p-3 rounded-lg w-full mt-4"
                rows={3}
                 placeholder="Address"
                 value={settings.address}
                 onChange={(e) =>
                setSettings({ ...settings, address: e.target.value })
                  }
                 />
                 <hr className="my-8" />

<h3 className="text-xl font-bold mb-4">
  Pricing Management
</h3>

<div className="space-y-3">
  {pricing.map((slot, index) => (
    <div
      key={slot._id}
      className="border rounded-lg p-4"
    >
      <p className="font-semibold mb-2">
        {slot.timeSlot}
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="number"
          value={slot.weekdayPrice}
          onChange={(e) => {
            const updated = [...pricing];
            updated[index].weekdayPrice =
              Number(e.target.value);
            setPricing(updated);
          }}
          className="border p-2 rounded-lg"
          placeholder="Weekday Price"
        />

        <input
          type="number"
          value={slot.weekendPrice}
          onChange={(e) => {
            const updated = [...pricing];
            updated[index].weekendPrice =
              Number(e.target.value);
            setPricing(updated);
          }}
         className="border p-2 rounded-lg w-full"
          placeholder="Weekend Price"
        />
      </div>
      <div className="mt-3">
  <label className="flex items-center gap-2">
    <input
      type="checkbox"
      checked={slot.isAvailable}
      onChange={(e) => {
        const updated = [...pricing];
        updated[index].isAvailable = e.target.checked;
        setPricing(updated);
      }}
    />
    Available for Booking
  </label>
</div>
    </div>
  ))}
</div>
         <div className="mt-4">
         <Button onClick={handleSavePricing}>
            Save Pricing
         </Button>
         </div>


        <div className="mt-6 flex justify-center">
  
          <Button onClick={handleSaveSettings}>
            Save Settings
          </Button>
         </div>    

                  </Card>

                  )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

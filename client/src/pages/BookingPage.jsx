import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { bookingAPI } from '../services/api';
import SectionHeading from '../components/ui/SectionHeading';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Calendar, Users, Trophy, DollarSign, CheckCircle2, Clock } from 'lucide-react';

const BookingPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [sport, setSport] = useState('Football');
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  
  // Booking modal state
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [players, setPlayers] = useState(10);
  const [bookingLoading, setBookingLoading] = useState(false);
  
  // Success state
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Helper to format Date to YYYY-MM-DD local
  const formatDateString = (date) => {
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - (offset * 60 * 1000));
    return localDate.toISOString().split('T')[0];
  };

  useEffect(() => {
    const fetchSlots = async () => {
      setLoading(true);
      try {
        const dateStr = formatDateString(selectedDate);
        const { data } = await bookingAPI.getSlots(dateStr);
        if (data.success) {
          setSlots(data.slots);
        }
      } catch (err) {
        console.error('Failed to load slots', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSlots();
  }, [selectedDate]);

  const handleSlotSelect = (slot) => {
    if (!user) {
      // Redirect to login if guest tries to book
      navigate('/login?redirect=booking');
      return;
    }
    setSelectedSlot(slot);
    setIsBookModalOpen(true);
  };

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    if (!selectedSlot) return;

    setBookingLoading(true);
    try {
      const dateStr = formatDateString(selectedDate);
      const bookingData = {
        date: dateStr,
        timeSlot: selectedSlot.timeSlot,
        players,
        sport,
        totalPrice: selectedSlot.price
      };

  const { data } = await bookingAPI.createBooking(bookingData);

if (data.success) {

  setConfirmedBooking(data.booking);
  setIsBookModalOpen(false);
  setIsSuccessOpen(true);

  setSlots(prev => prev.map(s =>
    s.timeSlot === selectedSlot.timeSlot
      ? { ...s, available: false }
      : s
  ));
}
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to book slot. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="pt-40 md:pt-32 min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <SectionHeading title="Book a Playing Slot" subtitle="Reserve Court" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar & Sport Filter */}
          <div className="lg:col-span-1 space-y-6">
            <Card hoverEffect={false} className="p-6">
              <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white mb-4 flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-brand-emerald" />
                <span>1. Select Date</span>
              </h3>
              
              <div className="flex justify-center bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-100 dark:border-slate-800">
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  minDate={new Date()}
                  inline
                />
              </div>
            </Card>

            <Card hoverEffect={false} className="p-6">
              <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white mb-4 flex items-center space-x-2">
                <Trophy className="h-5 w-5 text-brand-emerald" />
                <span>2. Select Sport</span>
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setSport('Football')}
                  className={`py-3 rounded-full text-sm font-bold border transition-all duration-300 ${
                    sport === 'Football'
                      ? 'bg-brand-emerald text-white border-brand-emerald shadow-lg shadow-brand-emerald/20'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Football
                </button>
                <button
                  onClick={() => setSport('Cricket')}
                  className={`py-3 rounded-full text-sm font-bold border transition-all duration-300 ${
                    sport === 'Cricket'
                      ? 'bg-brand-emerald text-white border-brand-emerald shadow-lg shadow-brand-emerald/20'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Box Cricket
                </button>
              </div>
            </Card>
          </div>

          {/* Slots Availability Grid */}
          <div className="lg:col-span-2">
            <Card hoverEffect={false} className="p-6 h-full">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-brand-emerald" />
                  <span>3. Choose Time Slot</span>
                </h3>
                <span className="text-sm font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                  {formatDateString(selectedDate)}
                </span>
              </div>

              {loading ? (
                <div className="text-center py-24 text-slate-500">Loading available slots...</div>
              ) : slots.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {slots.map((slot, idx) => (
                    <button
                      key={idx}
                      disabled={!slot.isAvailable}
                      onClick={() => handleSlotSelect(slot)}
                      className={`relative flex items-center justify-between p-4 rounded-2xl border text-left transition-all duration-300 ${
                        slot.available
                          ? 'border-emerald-200 bg-emerald-500/5 hover:bg-emerald-500/10 hover:border-brand-emerald cursor-pointer group'
                          : 'border-slate-200 dark:border-slate-800/80 bg-slate-100/50 dark:bg-slate-900/40 opacity-40 cursor-not-allowed'
                      }`}
                    >
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white text-sm">
                          {slot.timeSlot}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {slot.isavailable ? 'Available' : 'Booked'}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className={`font-black text-sm ${slot.available ? 'text-brand-emerald' : 'text-slate-400'}`}>
                          ₹{slot.price}
                        </p>
                        {slot.isPopular && slot.available && (
                          <span className="text-[9px] font-bold text-brand-amber bg-brand-amber/10 border border-brand-amber/20 px-2 py-0.5 rounded-full inline-block mt-0.5">
                            Peak
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-24 text-slate-500">
                  No slots configured for this day.
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>

      {/* Booking Dialog Modal */}
      <Modal
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
        title="Confirm Slot Reservation"
      >
        {selectedSlot && (
          <form onSubmit={handleConfirmBooking} className="space-y-5">
            <div className="bg-brand-emerald/5 border border-brand-emerald/10 rounded-2xl p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Date</span>
                <span className="font-bold text-slate-900 dark:text-white">{formatDateString(selectedDate)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Time Slot</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedSlot.timeSlot}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Sport</span>
                <span className="font-bold text-slate-900 dark:text-white">{sport}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Total Price</span>
                <span className="font-bold text-brand-emerald">₹{selectedSlot.price}</span>
              </div>
            </div>

            <Input
              label="Approximate Number of Players"
              type="number"
              min="1"
              max="30"
              value={players}
              onChange={(e) => setPlayers(parseInt(e.target.value))}
              required
            />

            <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <Button variant="secondary" onClick={() => setIsBookModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" loading={bookingLoading}>
                Confirm Booking
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Success Dialog Modal */}
       <Modal
         isOpen={isSuccessOpen}
        onClose={() => setIsSuccessOpen(false)}
        title="Booking Request Sent!"
         >
        {confirmedBooking && (
          <div className="text-center py-6 space-y-6">
            <div className="flex items-center justify-center">
              <CheckCircle2 className="h-16 w-16 text-brand-emerald animate-bounce" />
            </div>
            
            <div className="space-y-2">
              <h4 className="text-2xl font-black font-display text-slate-900 dark:text-white">⏳ Awaiting Owner Approval</h4>
            <p className="text-sm text-slate-500">
                 Please pay ₹200 advance and send the payment screenshot on WhatsApp.
                 Your booking will be confirmed after payment verification by the owner.
                 </p>
                 <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg">
                 <p className="font-bold">Advance Payment: ₹200</p>
                 <p>UPI ID: manish@upi</p>
                 </div>
                <p className="text-sm font-medium text-brand-emerald">
                Check "My Bookings" for status updates.
                 </p>

           <Button
                 onClick={() => {
                 const message = `Hello,
  
                 I have paid ₹200 advance.
                 Booking Details:
                 Sport: ${confirmedBooking.sport}
                 Date: ${confirmedBooking.date}
                 Time: ${confirmedBooking.timeSlot}

                 I am attaching the payment screenshot for verification.`;

                 window.open(
                   `https://wa.me/917900380160?text=${encodeURIComponent(message)}`,
                   '_blank'
                         );
                  }}
>
                 Send Screenshot on WhatsApp
                  </Button>

                 </div>

            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 p-5 rounded-2xl max-w-sm mx-auto text-left space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Booking ID</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{confirmedBooking._id}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Sport</span>
                <span className="font-bold text-slate-900 dark:text-white">{confirmedBooking.sport}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Date</span>
                <span className="font-bold text-slate-900 dark:text-white">{confirmedBooking.date}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Time Slot</span>
                <span className="font-bold text-slate-900 dark:text-white">{confirmedBooking.timeSlot}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Price Paid</span>
                <span className="font-bold text-brand-emerald">₹{confirmedBooking.totalPrice}</span>
              </div>
            </div>

            <Button variant="primary" onClick={() => setIsSuccessOpen(false)} className="px-8">
              Done
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default BookingPage;

import React, { useEffect, useState } from 'react';
import { bookingAPI } from '../services/api';
import SectionHeading from '../components/ui/SectionHeading';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const { data } = await bookingAPI.getMyBookings();

        if (data.success) {
          setBookings(data.bookings);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, []);

  return (
    <div className="pt-40 md:pt-32 min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-5xl mx-auto px-4 py-12">

        <SectionHeading
          title="My Bookings"
          subtitle="Track your booking requests"
        />

        {loading ? (
          <div className="text-center py-20">
            Loading bookings...
          </div>
        ) : bookings.length === 0 ? (
          <Card className="p-8 text-center">
            <h3 className="text-xl font-bold mb-2">
              No bookings found
            </h3>
            <p className="text-slate-500">
              Your bookings will appear here.
            </p>
          </Card>
        ) : (
          <div className="grid gap-6">
            {bookings.map((booking) => (
              <Card
                key={booking._id}
                className="p-6 border border-slate-100 dark:border-slate-800"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold">
                      {booking.sport}
                    </h3>

                    <p className="text-slate-500 text-sm">
                      Booking ID: {booking._id}
                    </p>
                  </div>

                  <Badge
                    variant={
                      booking.status === 'confirmed'
                        ? 'success'
                        : booking.status === 'pending'
                        ? 'warning'
                        : 'danger'
                    }
                  >
                    {booking.status}
                  </Badge>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p>
                      <strong>Date:</strong> {booking.date}
                    </p>

                    <p>
                      <strong>Time:</strong> {booking.timeSlot}
                    </p>
                  </div>

                  <div>
                    <p>
                      <strong>Players:</strong> {booking.players}
                    </p>

                    <p>
                      <strong>Price:</strong> ₹{booking.totalPrice}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
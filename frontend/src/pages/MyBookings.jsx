import { useState, useEffect } from 'react';
import { bookingService } from '../services/bookingService';
import { Clock, MapPin, XCircle, Info, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const res = await bookingService.getMyBookings();
      setBookings(res.data);
    } catch (err) {
      toast.error('Failed to load your bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;

    try {
      await bookingService.cancelBooking(id);
      toast.success('Booking cancelled');
      fetchBookings();
    } catch (err) {
      toast.error('Failed to cancel booking');
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'PENDING': return 'status-pending';
      case 'APPROVED': return 'status-approved';
      case 'REJECTED': return 'status-rejected';
      case 'CANCELLED': return 'status-cancelled';
      default: return '';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="animate-spin text-primary-500" size={40} />
        <p className="text-slate-500 font-medium">Loading your schedule...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">My Bookings</h1>
        <p className="text-slate-500">Track and manage your resource reservations</p>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200">
                <th className="p-4 font-semibold text-slate-600">Resource</th>
                <th className="p-4 font-semibold text-slate-600">Schedule</th>
                <th className="p-4 font-semibold text-slate-600">Purpose</th>
                <th className="p-4 font-semibold text-slate-600">Status</th>
                <th className="p-4 font-semibold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <AnimatePresence>
                {bookings.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-12 text-center text-slate-400">
                      <div className="flex flex-col items-center gap-2">
                        <Info size={40} className="text-slate-200" />
                        <p>No bookings found. Try requesting one!</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  bookings.map((booking, idx) => (
                    <motion.tr 
                      key={booking.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="hover:bg-slate-50/50 transition-colors group"
                    >
                      <td className="p-4">
                        <div className="font-semibold text-slate-800">{booking.resourceName}</div>
                        <div className="text-xs text-slate-500 flex items-center gap-1">
                          <MapPin size={12} /> {booking.resourceLocation}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm font-medium text-slate-700">{booking.bookingDate}</div>
                        <div className="text-xs text-slate-500 flex items-center gap-1">
                          <Clock size={12} /> {booking.startTime.substring(0, 5)} - {booking.endTime.substring(0, 5)}
                        </div>
                      </td>
                      <td className="p-4 text-sm text-slate-600 italic">
                        "{booking.purpose}"
                      </td>
                      <td className="p-4">
                        <div className={`status-badge ${getStatusClass(booking.status)}`}>
                          {booking.status}
                        </div>
                        {booking.status === 'REJECTED' && booking.rejectionReason && (
                          <div className="mt-1 text-[10px] text-rose-500 max-w-[150px] leading-tight">
                            Reason: {booking.rejectionReason}
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        {(booking.status === 'PENDING' || booking.status === 'APPROVED') && (
                          <button 
                            onClick={() => handleCancel(booking.id)}
                            className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                            title="Cancel Booking"
                          >
                            <XCircle size={18} />
                          </button>
                        )}
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MyBookings;

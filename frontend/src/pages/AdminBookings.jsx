import { useState, useEffect } from 'react';
import { bookingService } from '../services/bookingService';
import { CheckCircle, XCircle, Filter, Search, User, Loader2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: '', bookingDate: '' });
  
  const [rejectId, setRejectId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const fetchAllBookings = async () => {
    setLoading(true);
    try {
      const res = await bookingService.getAllBookings(filters);
      setBookings(res.data);
    } catch (err) {
      toast.error('Failed to load system bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllBookings();
  }, [filters]);

  const handleApprove = async (id) => {
    try {
      await bookingService.updateStatus(id, { status: 'APPROVED' });
      toast.success('Booking approved');
      fetchAllBookings();
    } catch (err) {
      toast.error('Failed to approve booking');
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }

    try {
      await bookingService.updateStatus(rejectId, { 
        status: 'REJECTED', 
        rejectionReason 
      });
      toast.success('Booking rejected');
      setRejectId(null);
      setRejectionReason('');
      fetchAllBookings();
    } catch (err) {
      toast.error('Failed to reject booking');
    }
  };

  const statusOptions = ['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'];

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Admin Control Hub</h1>
          <p className="text-slate-500">Manage all campus resource requests</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 p-4 glass-card rounded-xl">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-slate-400" />
            <select 
              className="bg-transparent text-sm font-semibold outline-none text-slate-700"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <option value="">All Statuses</option>
              {statusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
          <div className="h-6 w-px bg-slate-200 hidden md:block"></div>
          <div className="flex items-center gap-2">
            <Search size={16} className="text-slate-400" />
            <input 
              type="date"
              className="bg-transparent text-sm font-semibold outline-none text-slate-700"
              value={filters.bookingDate}
              onChange={(e) => setFilters({ ...filters, bookingDate: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden min-h-[400px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-20 gap-4">
            <Loader2 className="animate-spin text-primary-500" size={40} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200">
                  <th className="p-4 font-semibold text-slate-600">Requester</th>
                  <th className="p-4 font-semibold text-slate-600">Resource & Time</th>
                  <th className="p-4 font-semibold text-slate-600">Status</th>
                  <th className="p-4 font-semibold text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {bookings.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-20 text-center text-slate-400 italic">No bookings match the filters</td>
                  </tr>
                ) : (
                  bookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-slate-50/30 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-xs">
                            {booking.requestedByName.charAt(0)}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-800">{booking.requestedByName}</div>
                            <div className="text-[10px] text-slate-500">{booking.requestedByEmail}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-medium text-slate-700">{booking.resourceName}</div>
                        <div className="text-xs text-slate-500">{booking.bookingDate} | {booking.startTime.substring(0, 5)} - {booking.endTime.substring(0, 5)}</div>
                      </td>
                      <td className="p-4">
                        <span className={`status-badge text-[10px] ${
                          booking.status === 'PENDING' ? 'status-pending' :
                          booking.status === 'APPROVED' ? 'status-approved' :
                          booking.status === 'REJECTED' ? 'status-rejected' : 'status-cancelled'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="p-4">
                        {booking.status === 'PENDING' ? (
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => handleApprove(booking.id)}
                              className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors"
                              title="Approve"
                            >
                              <CheckCircle size={18} />
                            </button>
                            <button 
                              onClick={() => setRejectId(booking.id)}
                              className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Reject"
                            >
                              <XCircle size={18} />
                            </button>
                          </div>
                        ) : (
                          <span className="text-slate-300 text-xs italic">Processed</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Reject Modal */}
      <AnimatePresence>
        {rejectId && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md border border-slate-200"
            >
              <div className="flex items-center gap-3 mb-4 text-rose-600">
                <AlertCircle size={24} />
                <h3 className="text-xl font-bold">Reject Booking Request</h3>
              </div>
              <p className="text-slate-500 text-sm mb-4">Please provide a brief reason for rejecting this request. This will be visible to the user.</p>
              <textarea 
                className="w-full p-3 rounded-xl border border-slate-200 focus:border-rose-300 focus:ring-4 focus:ring-rose-500/10 outline-none transition-all resize-none mb-6"
                rows="4"
                placeholder="Ex: The requested room is undergoing maintenance..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              />
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setRejectId(null)}
                  className="py-2.5 rounded-xl border border-slate-200 font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleReject}
                  className="py-2.5 rounded-xl bg-rose-600 text-white font-semibold hover:bg-rose-700 shadow-lg shadow-rose-600/20 transition-colors"
                >
                  Submit Rejection
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminBookings;

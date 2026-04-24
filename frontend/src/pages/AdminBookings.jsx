import { useState, useEffect, useCallback } from 'react';
import { bookingService } from '../services/bookingService';
import { CheckCircle, XCircle, Filter, Search, Loader2, AlertCircle, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import './AdminBookings.css';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: '', bookingDate: '' });
  
  const [rejectId, setRejectId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const fetchAllBookings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await bookingService.getAllBookings(filters);
      setBookings(res.data);
    } catch (err) {
      toast.error('Failed to load system bookings');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchAllBookings();
  }, [fetchAllBookings]);

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
    <div className="admin-bookings-container">
      <div className="admin-bookings-header">
        <div className="header-title-group">
          <h1>Admin Control Hub</h1>
          <p>Manage and review all campus resource requests</p>
        </div>

        {/* Filters */}
        <div className="admin-filters-bar">
          <div className="filter-group">
            <Filter size={18} className="filter-icon" />
            <select 
              className="admin-select"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <option value="">All Statuses</option>
              {statusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
          <div className="filter-divider"></div>
          <div className="filter-group">
            <Calendar size={18} className="filter-icon" />
            <input 
              type="date"
              className="admin-date-input"
              value={filters.bookingDate}
              onChange={(e) => setFilters({ ...filters, bookingDate: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div className="admin-bookings-card">
        {loading ? (
          <div className="admin-loader-container">
            <Loader2 className="loader-spinner" size={48} />
            <p>Fetching booking records...</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Requester</th>
                  <th>Resource & Time</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.length === 0 ? (
                  <tr>
                    <td colSpan="4">
                      <div className="admin-empty-state">
                        <Search size={64} className="empty-icon" />
                        <p>No bookings found matching your criteria</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  bookings.map((booking) => (
                    <motion.tr 
                      key={booking.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <td>
                        <div className="requester-info">
                          <div className="requester-avatar">
                            {booking.requestedByName.charAt(0).toUpperCase()}
                          </div>
                          <div className="requester-details">
                            <span className="name">{booking.requestedByName}</span>
                            <span className="email">{booking.requestedByEmail}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="resource-info">
                          <span className="resource-name">{booking.resourceName}</span>
                          <span className="time-slot">
                            {booking.bookingDate} | {booking.startTime.substring(0, 5)} - {booking.endTime.substring(0, 5)}
                          </span>
                        </div>
                      </td>
                      <td>
                        <span className={`status-badge ${
                          booking.status === 'PENDING' ? 'status-pending' :
                          booking.status === 'APPROVED' ? 'status-approved' :
                          booking.status === 'REJECTED' ? 'status-rejected' : 'status-cancelled'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                      <td>
                        {booking.status === 'PENDING' ? (
                          <div className="action-buttons">
                            <button 
                              onClick={() => handleApprove(booking.id)}
                              className="btn-icon btn-approve"
                              title="Approve Booking"
                            >
                              <CheckCircle size={20} />
                            </button>
                            <button 
                              onClick={() => setRejectId(booking.id)}
                              className="btn-icon btn-reject"
                              title="Reject Booking"
                            >
                              <XCircle size={20} />
                            </button>
                          </div>
                        ) : (
                          <span className="processed-text">
                            {booking.status === 'CANCELLED' ? 'Cancelled by User' : 'Processed'}
                          </span>
                        )}
                      </td>
                    </motion.tr>
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
          <div className="modal-overlay">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="reject-modal"
            >
              <div className="modal-header">
                <AlertCircle size={28} />
                <h3>Reject Request</h3>
              </div>
              <div className="modal-body">
                <p>Please provide a reason for rejecting this booking. This reason will be shared with the requester.</p>
                <textarea 
                  className="modal-textarea"
                  rows="4"
                  placeholder="Reason for rejection..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                />
              </div>
              <div className="modal-actions">
                <button 
                  onClick={() => {
                    setRejectId(null);
                    setRejectionReason('');
                  }}
                  className="btn-modal btn-cancel"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleReject}
                  className="btn-modal btn-submit-reject"
                >
                  Confirm Rejection
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

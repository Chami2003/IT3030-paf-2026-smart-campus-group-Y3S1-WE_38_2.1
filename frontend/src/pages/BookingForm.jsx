import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Users, FileText, ArrowRight } from 'lucide-react';
import { bookingService, resourceService } from '../services/bookingService';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import './BookingForm.css';

const BookingForm = () => {
  const navigate = useNavigate();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    resourceId: '',
    bookingDate: '',
    startTime: '',
    endTime: '',
    purpose: '',
    expectedAttendees: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    resourceService.getAllResources()
      .then(res => setResources(res.data))
      .catch(() => {
        setResources([
          { id: 1, name: 'Main Conference Room', location: 'Block A' },
          { id: 2, name: 'Tech Lab 1', location: 'Building B' },
          { id: 3, name: 'Seminar Hall', location: 'Level 4' }
        ]);
      });
  }, []);

  const validateModel = () => {
    const newErrors = {};
    if (!formData.resourceId) newErrors.resourceId = 'Resource is required';
    if (!formData.bookingDate) newErrors.bookingDate = 'Date is required';
    if (!formData.startTime) newErrors.startTime = 'Start time is required';
    if (!formData.endTime) newErrors.endTime = 'End time is required';
    if (!formData.purpose.trim()) newErrors.purpose = 'Purpose is required';
    
    if (formData.startTime && formData.endTime) {
      if (formData.endTime <= formData.startTime) {
        newErrors.endTime = 'End time must be after start time';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateModel()) return;

    setLoading(true);
    try {
      await bookingService.createBooking({
        ...formData,
        resourceId: parseInt(formData.resourceId)
      });
      toast.success('Booking request submitted successfully!');
      navigate('/bookings/my');
    } catch (err) {
      if (err.response?.status === 409) {
        toast.error('Scheduling conflict detected! Please choose a different time.');
      } else {
        toast.error(err.response?.data?.message || 'Failed to submit booking request.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booking-container">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="booking-card"
      >
        <div className="booking-header">
          <div className="booking-icon-wrapper">
            <Calendar size={28} />
          </div>
          <div>
            <h1>New Resource Booking</h1>
            <p>Reserve a campus resource for your event</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="booking-form">
          <div className="form-grid">
            {/* Resource Selection */}
            <div className="form-group full-width">
              <label className="form-label">
                <FileText size={16} /> Select Resource
              </label>
              <select
                className={`form-select ${errors.resourceId ? 'input-error' : ''}`}
                value={formData.resourceId}
                onChange={(e) => setFormData({ ...formData, resourceId: e.target.value })}
              >
                <option value="">Choose a resource...</option>
                {resources.map(r => (
                  <option key={r.id} value={r.id}>{r.name} ({r.location})</option>
                ))}
              </select>
              {errors.resourceId && <p className="form-error">{errors.resourceId}</p>}
            </div>

            {/* Date Selection */}
            <div className="form-group">
              <label className="form-label">
                <Calendar size={16} /> Booking Date
              </label>
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                className={`form-input ${errors.bookingDate ? 'input-error' : ''}`}
                value={formData.bookingDate}
                onChange={(e) => setFormData({ ...formData, bookingDate: e.target.value })}
              />
              {errors.bookingDate && <p className="form-error">{errors.bookingDate}</p>}
            </div>

            {/* Attendees */}
            <div className="form-group">
              <label className="form-label">
                <Users size={16} /> Attendees (Optional)
              </label>
              <input
                type="number"
                placeholder="Ex: 10"
                className="form-input"
                value={formData.expectedAttendees}
                onChange={(e) => setFormData({ ...formData, expectedAttendees: e.target.value })}
              />
            </div>

            {/* Start Time */}
            <div className="form-group">
              <label className="form-label">
                <Clock size={16} /> Start Time
              </label>
              <input
                type="time"
                className={`form-input ${errors.startTime ? 'input-error' : ''}`}
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              />
              {errors.startTime && <p className="form-error">{errors.startTime}</p>}
            </div>

            {/* End Time */}
            <div className="form-group">
              <label className="form-label">
                <Clock size={16} /> End Time
              </label>
              <input
                type="time"
                className={`form-input ${errors.endTime ? 'input-error' : ''}`}
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              />
              {errors.endTime && <p className="form-error">{errors.endTime}</p>}
            </div>
          </div>

          {/* Purpose */}
          <div className="form-group">
            <label className="form-label">
              <FileText size={16} /> Purpose of Booking
            </label>
            <textarea
              rows="3"
              placeholder="Briefly describe the event..."
              className={`form-textarea ${errors.purpose ? 'input-error' : ''}`}
              value={formData.purpose}
              onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
            />
            {errors.purpose && <p className="form-error">{errors.purpose}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="submit-button"
          >
            {loading ? 'Submitting Request...' : (
              <>
                Request Booking <ArrowRight size={20} className="button-icon" />
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default BookingForm;

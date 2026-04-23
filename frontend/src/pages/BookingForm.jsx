import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Users, FileText, ArrowRight } from 'lucide-react';
import { bookingService, resourceService } from '../services/bookingService';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

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
    // Mock resources if API not ready
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
      navigate('/my-bookings');
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
    <div className="max-w-2xl mx-auto py-8 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8 rounded-2xl"
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-primary-100 text-primary-600 rounded-xl">
            <Calendar size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">New Resource Booking</h1>
            <p className="text-slate-500 text-sm">Reserve a campus resource for your event</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Resource Selection */}
            <div className="space-y-2 col-span-full">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <FileText size={16} /> Select Resource
              </label>
              <select
                className={`w-full p-3 rounded-xl bg-slate-50 border transition-all outline-none focus:ring-2 focus:ring-primary-500/20 ${
                  errors.resourceId ? 'border-rose-300 bg-rose-50' : 'border-slate-200 focus:border-primary-500'
                }`}
                value={formData.resourceId}
                onChange={(e) => setFormData({ ...formData, resourceId: e.target.value })}
              >
                <option value="">Choose a resource...</option>
                {resources.map(r => (
                  <option key={r.id} value={r.id}>{r.name} ({r.location})</option>
                ))}
              </select>
              {errors.resourceId && <p className="text-xs text-rose-500">{errors.resourceId}</p>}
            </div>

            {/* Date Selection */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Calendar size={16} /> Booking Date
              </label>
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                className={`w-full p-3 rounded-xl bg-slate-50 border transition-all outline-none focus:ring-2 focus:ring-primary-500/20 ${
                  errors.bookingDate ? 'border-rose-300 bg-rose-50' : 'border-slate-200 focus:border-primary-500'
                }`}
                value={formData.bookingDate}
                onChange={(e) => setFormData({ ...formData, bookingDate: e.target.value })}
              />
              {errors.bookingDate && <p className="text-xs text-rose-500">{errors.bookingDate}</p>}
            </div>

            {/* Start Time */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Clock size={16} /> Start Time
              </label>
              <input
                type="time"
                className={`w-full p-3 rounded-xl bg-slate-50 border transition-all outline-none focus:ring-2 focus:ring-primary-500/20 ${
                  errors.startTime ? 'border-rose-300 bg-rose-50' : 'border-slate-200 focus:border-primary-500'
                }`}
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              />
              {errors.startTime && <p className="text-xs text-rose-500">{errors.startTime}</p>}
            </div>

            {/* End Time */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Clock size={16} /> End Time
              </label>
              <input
                type="time"
                className={`w-full p-3 rounded-xl bg-slate-50 border transition-all outline-none focus:ring-2 focus:ring-primary-500/20 ${
                  errors.endTime ? 'border-rose-300 bg-rose-50' : 'border-slate-200 focus:border-primary-500'
                }`}
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              />
              {errors.endTime && <p className="text-xs text-rose-500">{errors.endTime}</p>}
            </div>

            {/* Attendees */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Users size={16} /> Attendees (Optional)
              </label>
              <input
                type="number"
                placeholder="Ex: 10"
                className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 transition-all outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                value={formData.expectedAttendees}
                onChange={(e) => setFormData({ ...formData, expectedAttendees: e.target.value })}
              />
            </div>
          </div>

          {/* Purpose */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <FileText size={16} /> Purpose of Booking
            </label>
            <textarea
              rows="3"
              placeholder="Briefly describe the event..."
              className={`w-full p-3 rounded-xl bg-slate-50 border transition-all outline-none focus:ring-2 focus:ring-primary-500/20 ${
                errors.purpose ? 'border-rose-300 bg-rose-50' : 'border-slate-200 focus:border-primary-500'
              }`}
              value={formData.purpose}
              onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
            />
            {errors.purpose && <p className="text-xs text-rose-500">{errors.purpose}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-lg shadow-primary-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {loading ? 'Submitting Request...' : (
              <>
                Request Booking <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default BookingForm;

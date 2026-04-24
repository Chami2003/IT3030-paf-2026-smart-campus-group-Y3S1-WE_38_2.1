import React, { useState, useEffect } from 'react';
import { resourceAPI } from '../services/api';
import './ResourceCatalogue.css';

/**
 * ResourceForm component — Modal form for creating and editing resources.
 * Features client-side validation mirroring the backend @Valid constraints,
 * styled with the dark dashboard theme.
 */
const ResourceForm = ({ resource, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'LECTURE_HALL',
    capacity: 10,
    location: '',
    status: 'ACTIVE',
    availabilityWindows: '08:00-17:00',
    available: true
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  /** Pre-fill form when editing an existing resource */
  useEffect(() => {
    if (resource) {
      setFormData({
        name: resource.name || '',
        type: resource.type || 'LECTURE_HALL',
        capacity: resource.capacity || 10,
        location: resource.location || '',
        status: resource.status || 'ACTIVE',
        availabilityWindows: resource.availabilityWindows || '08:00-17:00',
        available: resource.available !== undefined ? resource.available : true
      });
    }
  }, [resource]);

  /** Handle input changes */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  /** Client-side validation */
  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.availabilityWindows.trim()) newErrors.availabilityWindows = 'Availability windows are required';
    if (formData.capacity < 1) newErrors.capacity = 'Capacity must be at least 1';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /** Submit the form — create or update via the API */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      if (resource?.id) {
        await resourceAPI.updateResource(resource.id, formData);
      } else {
        await resourceAPI.createResource(formData);
      }
      onSave();
    } catch (err) {
      console.error('Error saving resource:', err);
      if (err.response && err.response.data && typeof err.response.data === 'object') {
        setErrors(err.response.data);
      } else {
        setErrors({ general: 'Failed to save resource. Please try again.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{resource ? '✏️ Edit Resource' : '✨ Add New Facility'}</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '-1rem', marginBottom: '1.5rem' }}>
          Fill in the details below to {resource ? 'update this' : 'add a new'} facility or equipment resource.
        </p>

        {errors.general && <div className="error-banner">{errors.general}</div>}

        <form onSubmit={handleSubmit}>
          {/* Row 1: Name, Type, Status */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">🏢</span> Facility Name
              </label>
              <input
                type="text"
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter facility name"
              />
              {errors.name && <div className="error-message">{errors.name}</div>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">⚙️</span> Resource Type
              </label>
              <select
                name="type"
                className="form-control"
                value={formData.type}
                onChange={handleChange}
              >
                <option value="LECTURE_HALL">Lecture Hall</option>
                <option value="LAB">Laboratory</option>
                <option value="MEETING_ROOM">Meeting Room</option>
                <option value="EQUIPMENT">Equipment</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">⚡</span> Status
              </label>
              <select
                name="status"
                className="form-control"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="ACTIVE">Active</option>
                <option value="OUT_OF_SERVICE">Out of Service</option>
              </select>
            </div>
          </div>

          {/* Row 2: Capacity, Location */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">👥</span> Capacity
              </label>
              <input
                type="number"
                name="capacity"
                className="form-control"
                value={formData.capacity}
                onChange={handleChange}
                min="1"
              />
              {errors.capacity && <div className="error-message">{errors.capacity}</div>}
            </div>
            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">📍</span> Location
              </label>
              <input
                type="text"
                name="location"
                className="form-control"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Block A, 3rd Floor"
              />
              {errors.location && <div className="error-message">{errors.location}</div>}
            </div>
          </div>

          {/* Row 3: Availability Windows */}
          <div className="form-group">
            <label className="form-label">
              <span className="label-icon">🕐</span> Availability Windows
            </label>
            <input
              type="text"
              name="availabilityWindows"
              className="form-control"
              value={formData.availabilityWindows}
              onChange={handleChange}
              placeholder="e.g. 08:00 AM - 05:00 PM"
            />
            {errors.availabilityWindows && <div className="error-message">{errors.availabilityWindows}</div>}
          </div>

          {/* Buttons */}
          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="btn-submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : (resource ? 'Update Resource' : 'Add Resource')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResourceForm;

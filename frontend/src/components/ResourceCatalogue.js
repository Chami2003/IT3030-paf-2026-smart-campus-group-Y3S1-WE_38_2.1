import React, { useState, useEffect } from 'react';
import { resourceAPI } from '../services/api';
import ResourceForm from './ResourceForm';
import './ResourceCatalogue.css';

/**
 * ResourceCatalogue component — Module A: Facilities & Assets Catalogue.
 * Displays a professional dark-themed dashboard with:
 * - Banner header with page title
 * - Search & filter section (by type, capacity, location)
 * - Data table listing all resources
 * - Modal form for adding/editing resources
 */
const ResourceCatalogue = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search / filter state
  const [filterType, setFilterType] = useState('');
  const [filterCapacity, setFilterCapacity] = useState('');
  const [filterLocation, setFilterLocation] = useState('');

  // Modal state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentResource, setCurrentResource] = useState(null);

  useEffect(() => {
    fetchResources();
  }, []);

  /** Fetch all resources from the backend */
  const fetchResources = async () => {
    setLoading(true);
    try {
      const response = await resourceAPI.getAllResources();
      setResources(response.data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch resources:', err);
      setError('Failed to load resources. Ensure the backend is running on port 8080.');
    } finally {
      setLoading(false);
    }
  };

  /** Search resources using the backend search endpoint */
  const handleSearch = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterType) params.type = filterType;
      if (filterCapacity) params.capacity = parseInt(filterCapacity);
      if (filterLocation) params.location = filterLocation;

      const response = await resourceAPI.searchResources(params);
      setResources(response.data);
      setError(null);
    } catch (err) {
      console.error('Search failed:', err);
      setError('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /** Reset all filters and reload full list */
  const handleReset = () => {
    setFilterType('');
    setFilterCapacity('');
    setFilterLocation('');
    fetchResources();
  };

  /** Open modal for adding a new resource */
  const handleAdd = () => {
    setCurrentResource(null);
    setIsFormOpen(true);
  };

  /** Open modal for editing an existing resource */
  const handleEdit = (resource) => {
    setCurrentResource(resource);
    setIsFormOpen(true);
  };

  /** Delete a resource after confirmation */
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      try {
        await resourceAPI.deleteResource(id);
        fetchResources();
      } catch (err) {
        console.error('Delete failed:', err);
        alert('Failed to delete resource.');
      }
    }
  };

  /** Callback after form save — close modal & refresh */
  const handleSave = () => {
    setIsFormOpen(false);
    fetchResources();
  };

  /** Format type string for display */
  const formatType = (type) => {
    if (!type) return '';
    return type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  };

  return (
    <div className="catalogue-container">

      {/* ── Banner ── */}
      <div className="page-banner">
        <div>
          <h1>Facilities Catalogue</h1>
          <p>Browse and search available campus facilities and assets.</p>
        </div>
        <span className="badge-view">Admin View</span>
      </div>

      {/* ── Search & Filter ── */}
      <div className="search-section">
        <h3 className="search-section-title">🔍 Search & Filter Facilities</h3>
        <div className="search-row">
          <div className="search-field">
            <label>Resource Type</label>
            <select
              className="filter-select"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="">All Types</option>
              <option value="LECTURE_HALL">Lecture Hall</option>
              <option value="LAB">Laboratory</option>
              <option value="MEETING_ROOM">Meeting Room</option>
              <option value="EQUIPMENT">Equipment</option>
            </select>
          </div>
          <div className="search-field">
            <label>Minimum Capacity</label>
            <input
              type="number"
              className="search-input"
              placeholder="e.g. 20"
              value={filterCapacity}
              onChange={(e) => setFilterCapacity(e.target.value)}
              min="0"
            />
          </div>
          <div className="search-field">
            <label>Location</label>
            <input
              type="text"
              className="search-input"
              placeholder="e.g. Block A"
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
            />
          </div>
          <button className="search-btn" onClick={handleSearch}>Search</button>
          <button className="reset-btn" onClick={handleReset}>Reset</button>
        </div>
      </div>

      {/* ── Actions Row ── */}
      <div className="catalogue-header">
        <h2 className="section-title" style={{ border: 'none', margin: 0, padding: 0 }}>
          Available Facilities
        </h2>
        <button className="add-btn" onClick={handleAdd}>
          ✨ New Resource
        </button>
      </div>

      {/* ── Error Banner ── */}
      {error && <div className="error-banner">{error}</div>}

      {/* ── Table ── */}
      {loading ? (
        <div className="loading-spinner">Loading resources...</div>
      ) : resources.length === 0 ? (
        <div className="empty-state">
          <h3>No resources found</h3>
          <p>Try adjusting your search filters or add a new resource.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="resource-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Capacity</th>
                <th>Location</th>
                <th>Availability</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {resources.map(resource => (
                <tr key={resource.id}>
                  <td style={{ fontWeight: 600 }}>{resource.name}</td>
                  <td>{formatType(resource.type)}</td>
                  <td>{resource.capacity}</td>
                  <td>{resource.location}</td>
                  <td>{resource.availabilityWindows || '—'}</td>
                  <td>
                    <span className={`status-badge ${resource.status === 'ACTIVE' ? 'status-active' : 'status-outofservice'}`}>
                      {resource.status === 'ACTIVE' ? 'ACTIVE' : 'Out of Service'}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button className="action-btn edit-btn" onClick={() => handleEdit(resource)}>Edit</button>
                      <button className="action-btn delete-btn" onClick={() => handleDelete(resource.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Modal ── */}
      {isFormOpen && (
        <ResourceForm
          resource={currentResource}
          onClose={() => setIsFormOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default ResourceCatalogue;

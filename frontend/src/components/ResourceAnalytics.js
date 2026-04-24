import React, { useState, useEffect } from 'react';
import { resourceAPI } from '../services/api';
import './ResourceAnalytics.css';

/**
 * ResourceAnalytics component — Admin dashboard with usage analytics.
 * Displays summary cards, a bar chart of resource distribution by type,
 * and a donut chart showing Active vs Out-of-Service status breakdown.
 * All data is fetched from the existing GET /api/resources endpoint.
 */
const ResourceAnalytics = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  /** Fetch all resources from the backend */
  const fetchData = async () => {
    try {
      const response = await resourceAPI.getAllResources();
      setResources(response.data);
    } catch (err) {
      console.error('Failed to load analytics data:', err);
    } finally {
      setLoading(false);
    }
  };

  // ── Derived analytics data ──
  const totalResources = resources.length;
  const activeCount = resources.filter(r => r.status === 'ACTIVE').length;
  const outOfServiceCount = resources.filter(r => r.status === 'OUT_OF_SERVICE').length;

  // Count resources by type
  const typeCounts = resources.reduce((acc, r) => {
    const type = r.type || 'UNKNOWN';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  // Map types to display labels and bar colours
  const typeConfig = {
    LECTURE_HALL:  { label: 'Lecture Hall',  color: 'bar-blue' },
    LAB:          { label: 'Laboratory',    color: 'bar-green' },
    MEETING_ROOM: { label: 'Meeting Room',  color: 'bar-purple' },
    EQUIPMENT:    { label: 'Equipment',     color: 'bar-gold' },
  };

  const maxTypeCount = Math.max(...Object.values(typeCounts), 1);

  // Unique types for counting the card
  const uniqueTypes = Object.keys(typeCounts).length;

  // Donut chart calculations (SVG circle)
  const donutRadius = 54;
  const donutCircumference = 2 * Math.PI * donutRadius;
  const activePercent = totalResources > 0 ? (activeCount / totalResources) : 0;
  const activeStroke = donutCircumference * activePercent;
  const inactiveStroke = donutCircumference * (1 - activePercent);

  if (loading) {
    return <div className="loading-spinner">Loading analytics...</div>;
  }

  return (
    <div className="analytics-container">

      {/* ── Banner ── */}
      <div className="page-banner">
        <div>
          <h1>📊 Resource Analytics</h1>
          <p>Overview of campus facilities and assets usage metrics.</p>
        </div>
        <span className="badge-view">Dashboard</span>
      </div>

      {/* ── Summary Cards ── */}
      <div className="summary-cards">
        <div className="summary-card">
          <div className="card-icon blue">🏢</div>
          <div className="card-info">
            <h4>Total Resources</h4>
            <div className="card-value blue">{totalResources}</div>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-icon green">✅</div>
          <div className="card-info">
            <h4>Available Now</h4>
            <div className="card-value green">{activeCount}</div>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-icon red">🔧</div>
          <div className="card-info">
            <h4>Out of Service</h4>
            <div className="card-value red">{outOfServiceCount}</div>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-icon purple">📦</div>
          <div className="card-info">
            <h4>Resource Types</h4>
            <div className="card-value purple">{uniqueTypes}</div>
          </div>
        </div>
      </div>

      {/* ── Charts ── */}
      <div className="charts-grid">

        {/* Bar Chart — Distribution by Type */}
        <div className="chart-card">
          <h3>Resources by Type</h3>
          <p className="chart-subtitle">Distribution of campus resources across categories</p>
          <div className="bar-chart">
            {Object.entries(typeCounts).map(([type, count]) => {
              const config = typeConfig[type] || { label: type, color: 'bar-cyan' };
              const widthPercent = Math.max((count / maxTypeCount) * 100, 8);
              return (
                <div className="bar-row" key={type}>
                  <span className="bar-label">{config.label}</span>
                  <div className="bar-track">
                    <div
                      className={`bar-fill ${config.color}`}
                      style={{ width: `${widthPercent}%` }}
                    >
                      {count}
                    </div>
                  </div>
                  <span className="bar-count">{count}</span>
                </div>
              );
            })}
            {Object.keys(typeCounts).length === 0 && (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>
                No resources yet. Add some from the Facility Catalogue.
              </p>
            )}
          </div>
        </div>

        {/* Donut Chart — Active vs Out of Service */}
        <div className="chart-card">
          <h3>Status Breakdown</h3>
          <p className="chart-subtitle">Active vs Out-of-Service resources</p>
          <div className="status-chart">
            <div className="donut-wrapper">
              <svg width="140" height="140" viewBox="0 0 140 140">
                {/* Background circle */}
                <circle
                  cx="70" cy="70" r={donutRadius}
                  fill="none"
                  stroke="var(--bg-input)"
                  strokeWidth="14"
                />
                {/* Active segment (green) */}
                {totalResources > 0 && (
                  <circle
                    cx="70" cy="70" r={donutRadius}
                    fill="none"
                    stroke="var(--accent-green)"
                    strokeWidth="14"
                    strokeDasharray={`${activeStroke} ${donutCircumference - activeStroke}`}
                    strokeLinecap="round"
                  />
                )}
                {/* Out-of-Service segment (red) */}
                {totalResources > 0 && outOfServiceCount > 0 && (
                  <circle
                    cx="70" cy="70" r={donutRadius}
                    fill="none"
                    stroke="var(--accent-red)"
                    strokeWidth="14"
                    strokeDasharray={`${inactiveStroke} ${donutCircumference - inactiveStroke}`}
                    strokeDashoffset={`-${activeStroke}`}
                    strokeLinecap="round"
                  />
                )}
              </svg>
              <div className="donut-center">
                <div className="donut-total">{totalResources}</div>
                <div className="donut-label">Total</div>
              </div>
            </div>

            <div className="status-legend">
              <div className="legend-item">
                <span className="legend-dot green"></span>
                <span className="legend-text">
                  Active <strong>{activeCount}</strong>
                </span>
              </div>
              <div className="legend-item">
                <span className="legend-dot red"></span>
                <span className="legend-text">
                  Out of Service <strong>{outOfServiceCount}</strong>
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ── Maintenance Alerts ── */}
      {outOfServiceCount > 0 ? (
        <div className="alerts-section">
          <div className="alerts-header">
            <span className="alerts-main-icon">🚨</span>
            <div>
              <h3>Urgent Maintenance Required</h3>
              <p>{outOfServiceCount} resource{outOfServiceCount > 1 ? 's' : ''} currently out of service and requiring attention.</p>
            </div>
          </div>
          <div className="alerts-grid">
            {resources
              .filter(r => r.status === 'OUT_OF_SERVICE')
              .map(resource => (
                <div className="alert-card" key={resource.id}>
                  <div className="alert-card-header">
                    <h4>{resource.name}</h4>
                    <span className="alert-tag">⚠️ Needs Repair</span>
                  </div>
                  <div className="alert-card-body">
                    <p><strong>Type:</strong> {(resource.type || '').replace(/_/g, ' ')}</p>
                    <p><strong>Location:</strong> {resource.location}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ) : (
        <div className="alerts-section all-clear">
          <span className="alerts-main-icon">✨</span>
          <div>
            <h3>All systems operational</h3>
            <p>No resources are currently out of service.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourceAnalytics;

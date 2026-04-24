import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiSearch, FiTrash2 } from 'react-icons/fi';

const TechnicianDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');

  // Selected Ticket Data
  const [comments, setComments] = useState([]);
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('Comments');
  const [newComment, setNewComment] = useState('');
  const [updateStatus, setUpdateStatus] = useState('');
  const [updating, setUpdating] = useState(false);

  // Mock Current User for Technician
  const currentUser = { name: 'Kasun Dissanayake', role: 'Technician' };

  useEffect(() => {
    const fetchAssignedTickets = async () => {
      try {
        const response = await axios.get('http://localhost:8082/api/tickets');
        // Filter tickets (mock: assigned to TECH-001 or just show all for demo purposes)
        setTickets(response.data);
      } catch (error) {
        console.error('Error fetching tickets:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAssignedTickets();
  }, []);

  useEffect(() => {
    if (selectedTicket) {
      setUpdateStatus(selectedTicket.status);
      fetchComments(selectedTicket.id);
      fetchHistory(selectedTicket.id);
    }
  }, [selectedTicket]);

  const fetchComments = async (id) => {
    try {
      const response = await axios.get(`http://localhost:8082/api/tickets/${id}/comments`);
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const fetchHistory = async (id) => {
    try {
      const response = await axios.get(`http://localhost:8082/api/tickets/${id}/history`);
      setHistory(response.data);
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedTicket) return;
    setUpdating(true);
    try {
      const updatedData = { ...selectedTicket, status: updateStatus, assignedTechnicianId: 'TECH-001' };
      await axios.put(`http://localhost:8082/api/tickets/${selectedTicket.id}`, updatedData);
      
      setTickets(tickets.map(t => t.id === selectedTicket.id ? { ...t, status: updateStatus } : t));
      setSelectedTicket({ ...selectedTicket, status: updateStatus });
      fetchHistory(selectedTicket.id);
      alert('Status updated successfully!');
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status.');
    } finally {
      setUpdating(false);
    }
  };

  const handleAddComment = async () => {
    if (newComment.trim() && selectedTicket) {
      try {
        const response = await axios.post(`http://localhost:8082/api/tickets/${selectedTicket.id}/comments`, {
          authorName: currentUser.name,
          authorRole: currentUser.role,
          content: newComment
        });
        setComments([...comments, response.data]);
        setNewComment('');
      } catch (error) {
        console.error("Error adding comment", error);
        alert("Failed to add comment");
      }
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      try {
        await axios.delete(`http://localhost:8082/api/tickets/comments/${commentId}?currentUser=${currentUser.name}&currentRole=${currentUser.role}`);
        setComments(comments.filter(c => c.id !== commentId));
      } catch (error) {
        console.error("Error deleting comment", error);
        alert("Failed to delete comment.");
      }
    }
  };

  const formatId = (id) => `TKT-2026-${String(id).padStart(3, '0')}`;

  const formatDateTime = (isoString) => {
    if (!isoString) return '';
    const d = new Date(isoString);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ' ' +
           d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusStyle = (status) => {
    const base = { padding: '4px 8px', borderRadius: '12px', fontSize: '10px', fontWeight: 'bold', display: 'inline-block' };
    switch(status?.toUpperCase()) {
      case 'OPEN': return { ...base, backgroundColor: '#e0e7ff', color: '#4338ca' };
      case 'IN_PROGRESS': return { ...base, backgroundColor: '#fef3c7', color: '#d97706' };
      case 'RESOLVED': return { ...base, backgroundColor: '#dcfce7', color: '#15803d' };
      case 'CLOSED': return { ...base, backgroundColor: '#e5e7eb', color: '#4b5563' };
      case 'REJECTED': return { ...base, backgroundColor: '#ffe4e6', color: '#e11d48' };
      default: return { ...base, backgroundColor: '#f3f4f6', color: '#6b7280' };
    }
  };

  const getPriorityStyle = (priority) => {
    const base = { padding: '2px 8px', borderRadius: '12px', fontSize: '10px', fontWeight: 'bold', display: 'inline-block' };
    switch(priority?.toUpperCase()) {
      case 'HIGH': return { ...base, backgroundColor: '#ffe4e6', color: '#e11d48' };
      case 'MEDIUM': return { ...base, backgroundColor: '#fef3c7', color: '#d97706' };
      case 'LOW': return { ...base, backgroundColor: '#dcfce7', color: '#15803d' };
      default: return { ...base, backgroundColor: '#f3f4f6', color: '#6b7280' };
    }
  };

  const getAvatar = (name) => `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=f3f4f6&color=374151&bold=true`;

  const filteredTickets = tickets.filter(t => {
    const matchesSearch = t.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = filterPriority === 'All' || t.priority?.toUpperCase() === filterPriority.toUpperCase();
    const matchesStatus = filterStatus === 'All' || t.status?.toUpperCase() === filterStatus.toUpperCase();
    return matchesSearch && matchesPriority && matchesStatus;
  });

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading dashboard...</div>;

  return (
    <div style={{ width: '100%', boxSizing: 'border-box', margin: '0', padding: '20px', fontFamily: 'Inter, system-ui, sans-serif', backgroundColor: '#ffffff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Header */}
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ margin: '0 0 20px 0', fontSize: '20px', color: '#111827', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: '#d1d5db' }}>←</span> Tickets Assigned to Me
        </h1>

        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', borderBottom: '1px solid #e5e7eb', paddingBottom: '20px' }}>
          <div style={{ position: 'relative', width: '300px' }}>
            <FiSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} size={16} />
            <input 
                type="text" 
                placeholder="Search tickets..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: '100%', padding: '8px 10px 8px 36px', borderRadius: '6px', border: '1px solid #d1d5db', outline: 'none', fontSize: '13px', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: '600', color: '#374151' }}>Status</span>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #d1d5db', outline: 'none', fontSize: '13px', backgroundColor: 'white' }}>
              <option value="All">All</option>
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: '600', color: '#374151' }}>Priority</span>
            <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)} style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #d1d5db', outline: 'none', fontSize: '13px', backgroundColor: 'white' }}>
              <option value="All">All</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Split View */}
      <div style={{ display: 'flex', gap: '20px', flex: 1, overflow: 'hidden' }}>
        
        {/* Left Pane - Ticket List */}
        <div style={{ width: '320px', borderRight: '1px solid #e5e7eb', paddingRight: '10px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {filteredTickets.map(ticket => {
            const isSelected = selectedTicket?.id === ticket.id;
            return (
              <div 
                key={ticket.id} 
                onClick={() => setSelectedTicket(ticket)}
                style={{ 
                  padding: '16px', 
                  borderRadius: '8px', 
                  cursor: 'pointer',
                  backgroundColor: isSelected ? '#eff6ff' : 'white',
                  borderLeft: isSelected ? '4px solid #2563eb' : '4px solid transparent',
                  borderTop: '1px solid #f3f4f6',
                  borderRight: '1px solid #f3f4f6',
                  borderBottom: '1px solid #f3f4f6',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>{formatId(ticket.id)}</div>
                <div style={{ fontSize: '13px', color: '#374151', marginBottom: '12px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ticket.title}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{...getPriorityStyle(ticket.priority), textTransform: 'uppercase'}}>{ticket.priority || 'LOW'}</span>
                  <span style={{ color: '#d1d5db', fontSize: '12px' }}>•</span>
                  <span style={{ fontSize: '11px', fontWeight: '600', color: '#4b5563' }}>{ticket.status?.replace('_', ' ') || 'OPEN'}</span>
                </div>
              </div>
            );
          })}
          {filteredTickets.length === 0 && <div style={{ fontSize: '13px', color: '#6b7280', textAlign: 'center', marginTop: '20px' }}>No tickets found.</div>}
        </div>

        {/* Right Pane - Details */}
        <div style={{ flex: 1, paddingLeft: '10px', overflowY: 'auto' }}>
          {selectedTicket ? (
            <div>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '16px', fontWeight: '700', color: '#111827' }}>{formatId(selectedTicket.id)}</span>
                  <span style={getStatusStyle(selectedTicket.status)}>{selectedTicket.status}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '11px', fontWeight: '600', color: '#4b5563', marginBottom: '4px' }}>Update Status</span>
                    <select 
                      value={updateStatus} 
                      onChange={(e) => setUpdateStatus(e.target.value)} 
                      style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #d1d5db', outline: 'none', fontSize: '13px', minWidth: '150px' }}
                    >
                      <option value="OPEN">OPEN</option>
                      <option value="IN_PROGRESS">IN_PROGRESS</option>
                      <option value="RESOLVED">RESOLVED</option>
                      <option value="CLOSED">CLOSED</option>
                      <option value="REJECTED">REJECTED</option>
                    </select>
                  </div>
                  <button 
                    onClick={handleUpdateStatus} 
                    disabled={updating || updateStatus === selectedTicket.status}
                    style={{ 
                      padding: '8px 24px', backgroundColor: updateStatus === selectedTicket.status ? '#93c5fd' : '#2563eb', color: 'white', 
                      border: 'none', borderRadius: '6px', cursor: updateStatus === selectedTicket.status ? 'not-allowed' : 'pointer', fontSize: '14px', fontWeight: '600', marginTop: '18px' 
                    }}
                  >
                    Update
                  </button>
                </div>
              </div>

              {/* Title */}
              <h2 style={{ fontSize: '24px', color: '#111827', margin: '0 0 24px 0' }}>{selectedTicket.title}</h2>

              {/* Grid Details */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
                <div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Category</div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>{selectedTicket.category || 'Hardware'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Priority</div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>{selectedTicket.priority}</div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Resource</div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>{selectedTicket.location}</div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Reported By</div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>{history.length > 0 ? history[0].changedBy : 'Nimasha Perera'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Contact</div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>{selectedTicket.contactDetails}</div>
                </div>
              </div>

              {/* Tabs */}
              <div style={{ display: 'flex', gap: '32px', borderBottom: '1px solid #e5e7eb', marginBottom: '24px' }}>
                {['Details', `Attachments (${selectedTicket.attachmentUrls?.length || 0})`, `Comments (${comments.length})`, 'History'].map(tab => {
                  const tabName = tab.split(' ')[0];
                  const isActive = activeTab === tabName;
                  return (
                    <div 
                      key={tab} 
                      onClick={() => setActiveTab(tabName)}
                      style={{ 
                        paddingBottom: '12px', fontSize: '14px', fontWeight: isActive ? '600' : '500', 
                        color: isActive ? '#2563eb' : '#4b5563', cursor: 'pointer',
                        borderBottom: isActive ? '2px solid #2563eb' : '2px solid transparent',
                        marginBottom: '-1px'
                      }}
                    >
                      {tab}
                    </div>
                  );
                })}
              </div>

              {/* Tab Content */}
              <div>
                {activeTab === 'Details' && (
                  <div style={{ fontSize: '14px', color: '#374151', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                    {selectedTicket.description}
                  </div>
                )}

                {activeTab === 'Attachments' && (
                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    {selectedTicket.attachmentUrls?.length > 0 ? selectedTicket.attachmentUrls.map((url, i) => (
                      <img key={i} src={`http://localhost:8082${url}`} alt="Attachment" style={{ width: '120px', height: '90px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e5e7eb' }} />
                    )) : <div style={{ color: '#6b7280', fontSize: '14px' }}>No attachments</div>}
                  </div>
                )}

                {activeTab === 'History' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {history.map((h, i) => (
                      <div key={i} style={{ fontSize: '13px', color: '#374151' }}>
                        <strong>{h.changedBy}</strong> {h.actionDescription} <span style={{ color: '#9ca3af', marginLeft: '8px' }}>{formatDateTime(h.timestamp)}</span>
                      </div>
                    ))}
                    {history.length === 0 && <div style={{ color: '#6b7280', fontSize: '14px' }}>No history available</div>}
                  </div>
                )}

                {activeTab === 'Comments' && (
                  <div>
                    {/* Comments List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '32px' }}>
                      {comments.map((comment, index) => (
                          <div key={comment.id}>
                              <div style={{ display: 'flex', gap: '16px' }}>
                                  <img src={getAvatar(comment.authorName)} alt="Avatar" style={{ width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0 }} />
                                  <div style={{ flex: 1 }}>
                                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                          <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>
                                              {comment.authorName} <span style={{ color: '#6b7280', fontWeight: '400' }}>({comment.authorRole})</span>
                                          </div>
                                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                              <span style={{ fontSize: '12px', color: '#6b7280' }}>{formatDateTime(comment.createdAt)}</span>
                                              {(comment.authorName === currentUser.name || currentUser.role === 'Admin') && (
                                                  <FiTrash2 size={14} color="#dc2626" style={{ cursor: 'pointer' }} onClick={() => handleDeleteComment(comment.id)} />
                                              )}
                                          </div>
                                      </div>
                                      <div style={{ fontSize: '14px', color: '#374151', lineHeight: '1.5' }}>
                                          {comment.content}
                                      </div>
                                  </div>
                              </div>
                              {index < comments.length - 1 && <div style={{ height: '1px', backgroundColor: '#f3f4f6', marginTop: '24px' }} />}
                          </div>
                      ))}
                      {comments.length === 0 && <div style={{ color: '#6b7280', fontSize: '14px' }}>No comments yet.</div>}
                    </div>

                    {/* Add Comment */}
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                      <input
                          type="text"
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Add a comment..."
                          onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                          style={{ flex: 1, padding: '12px 16px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', fontSize: '14px' }}
                      />
                      <button
                          onClick={handleAddComment}
                          style={{ padding: '12px 24px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}
                      >
                          Send
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#9ca3af', fontSize: '15px' }}>
              Select a ticket from the left menu to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TechnicianDashboard;
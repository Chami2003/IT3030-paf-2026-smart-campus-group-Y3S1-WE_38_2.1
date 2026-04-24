import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiArrowLeft, FiChevronDown, FiEdit2, FiTrash2, FiUser } from 'react-icons/fi';

const TicketDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [ticket, setTicket] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    
    // Mock User Session
    const [currentUser, setCurrentUser] = useState({ name: 'Alice', role: 'User' });
    const mockUsers = [
        { name: 'Alice', role: 'User' },
        { name: 'Bob', role: 'Technician' },
        { name: 'Charlie', role: 'Admin' }
    ];

    // Editing comment state
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editCommentContent, setEditCommentContent] = useState('');

    // Actions Modal State
    const [showActionsModal, setShowActionsModal] = useState(false);
    const [updateStatus, setUpdateStatus] = useState('');
    const [resolutionNotes, setResolutionNotes] = useState('');
    const [rejectionReason, setRejectionReason] = useState('');

    const fetchTicket = async () => {
        try {
            const response = await axios.get(`http://localhost:8082/api/tickets/${id}`);
            setTicket(response.data);
            setUpdateStatus(response.data.status);
            setResolutionNotes(response.data.resolutionNotes || '');
            setRejectionReason(response.data.rejectionReason || '');
        } catch (error) {
            console.error('Error fetching ticket:', error);
        }
    };

    const fetchComments = async () => {
        try {
            const response = await axios.get(`http://localhost:8082/api/tickets/${id}/comments`);
            setComments(response.data);
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    const fetchHistory = async () => {
        try {
            const response = await axios.get(`http://localhost:8082/api/tickets/${id}/history`);
            setHistory(response.data);
        } catch (error) {
            console.error('Error fetching history:', error);
        }
    };

    useEffect(() => {
        setLoading(true);
        Promise.all([fetchTicket(), fetchComments(), fetchHistory()]).finally(() => setLoading(false));
    }, [id]);

    const handleAddComment = async () => {
        if (newComment.trim()) {
            try {
                const response = await axios.post(`http://localhost:8082/api/tickets/${id}/comments`, {
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

    const handleEditComment = async (commentId) => {
        if (editCommentContent.trim()) {
            try {
                const response = await axios.put(`http://localhost:8082/api/tickets/comments/${commentId}?currentUser=${currentUser.name}`, {
                    content: editCommentContent
                });
                setComments(comments.map(c => c.id === commentId ? response.data : c));
                setEditingCommentId(null);
                setEditCommentContent('');
            } catch (error) {
                console.error("Error editing comment", error);
                alert("Failed to edit comment.");
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

    const handleUpdateTicket = async () => {
        try {
            const updatedTicket = {
                ...ticket,
                status: updateStatus,
                resolutionNotes: resolutionNotes,
                rejectionReason: updateStatus === 'REJECTED' ? rejectionReason : ''
            };
            
            const response = await axios.put(`http://localhost:8082/api/tickets/${id}`, updatedTicket);
            setTicket(response.data);
            fetchHistory();
            setShowActionsModal(false);
            alert("Ticket updated successfully!");
        } catch (error) {
            console.error("Error updating ticket", error);
            alert("Failed to update ticket.");
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
        const base = { padding: '4px 12px', borderRadius: '16px', fontSize: '11px', fontWeight: 'bold', display: 'inline-block' };
        switch(status?.toUpperCase()) {
            case 'OPEN': return { ...base, backgroundColor: '#e0e7ff', color: '#4338ca' };
            case 'IN_PROGRESS': return { ...base, backgroundColor: '#fef3c7', color: '#d97706' };
            case 'RESOLVED': return { ...base, backgroundColor: '#dcfce7', color: '#15803d' };
            case 'CLOSED': return { ...base, backgroundColor: '#e5e7eb', color: '#4b5563' };
            case 'REJECTED': return { ...base, backgroundColor: '#ffe4e6', color: '#e11d48' };
            default: return { ...base, backgroundColor: '#f3f4f6', color: '#6b7280' };
        }
    };

    if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading ticket details...</div>;
    if (!ticket) return <div style={{ padding: '40px', textAlign: 'center' }}>Ticket not found.</div>;

    const statuses = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];
    const currentStatusIndex = statuses.indexOf(ticket.status);

    const cardStyle = { backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e5e7eb', padding: '24px', marginBottom: '20px' };
    const labelStyle = { color: '#6b7280', fontSize: '13px', fontWeight: '500', width: '120px', flexShrink: 0 };
    const valueStyle = { color: '#111827', fontSize: '14px', fontWeight: '500' };

    const getAvatar = (name) => `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=f3f4f6&color=374151&bold=true`;

    return (
        <div style={{ width: '100%', boxSizing: 'border-box', margin: '0', padding: '30px', fontFamily: 'Inter, system-ui, sans-serif', backgroundColor: '#fafafa', minHeight: '100vh' }}>
            
            {/* Mock User Selector (Hidden in production, useful for dev) */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px', alignItems: 'center', gap: '10px', fontSize: '12px' }}>
                <span style={{ color: '#6b7280' }}>Simulate User:</span>
                <select 
                    value={currentUser.name} 
                    onChange={(e) => setCurrentUser(mockUsers.find(u => u.name === e.target.value))}
                    style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #d1d5db' }}
                >
                    {mockUsers.map(u => <option key={u.name} value={u.name}>{u.name} ({u.role})</option>)}
                </select>
            </div>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#4b5563' }}>
                        <FiArrowLeft size={24} />
                    </button>
                    <h1 style={{ margin: 0, fontSize: '24px', color: '#111827' }}>Ticket Details</h1>
                </div>
                {(currentUser.role === 'Technician' || currentUser.role === 'Admin') && (
                    <button 
                        onClick={() => setShowActionsModal(true)}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#2563eb', color: 'white', padding: '10px 20px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}
                    >
                        Actions <FiChevronDown />
                    </button>
                )}
            </div>

            {/* Two Column Layout */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '20px' }}>
                
                {/* LEFT COLUMN */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    
                    {/* Main Details Card */}
                    <div style={cardStyle}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                            <span style={{ fontSize: '14px', fontWeight: '700', color: '#374151' }}>{formatId(ticket.id)}</span>
                            <span style={getStatusStyle(ticket.status)}>{ticket.status}</span>
                        </div>
                        <h2 style={{ margin: '0 0 24px 0', fontSize: '22px', color: '#111827' }}>{ticket.title}</h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ display: 'flex' }}>
                                <div style={labelStyle}>Category</div>
                                <div style={{ ...valueStyle, color: '#2563eb' }}>{ticket.category || 'Hardware'}</div>
                                <div style={{ ...labelStyle, width: 'auto', marginLeft: '40px', marginRight: '10px' }}>
                                    <span style={{ backgroundColor: '#ffe4e6', color: '#e11d48', padding: '2px 6px', borderRadius: '4px' }}>Priority :</span>
                                </div>
                                <div style={valueStyle}>{ticket.priority}</div>
                            </div>
                            <div style={{ display: 'flex' }}>
                                <div style={labelStyle}>Resource</div>
                                <div style={valueStyle}>{ticket.location}</div>
                            </div>
                            <div style={{ display: 'flex' }}>
                                <div style={labelStyle}>Created By</div>
                                <div style={valueStyle}>{history.length > 0 ? history[0].changedBy : 'Unknown'}</div>
                            </div>
                            <div style={{ display: 'flex' }}>
                                <div style={labelStyle}>Created At</div>
                                <div style={valueStyle}>{formatDateTime(ticket.createdAt)}</div>
                            </div>
                            <div style={{ display: 'flex' }}>
                                <div style={labelStyle}>Contact</div>
                                <div style={valueStyle}>{ticket.contactDetails}</div>
                            </div>
                            <div style={{ display: 'flex', marginTop: '8px' }}>
                                <div style={labelStyle}>Description :</div>
                                <div style={{ ...valueStyle, lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>
                                    {ticket.description}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Attachments Card */}
                    <div style={cardStyle}>
                        <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', color: '#111827' }}>Attachments ({ticket.attachmentUrls ? ticket.attachmentUrls.length : 0})</h3>
                        {ticket.attachmentUrls && ticket.attachmentUrls.length > 0 ? (
                            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                                {ticket.attachmentUrls.map((url, index) => (
                                    <img
                                        key={index}
                                        src={`http://localhost:8082${url}`}
                                        alt={`Attachment ${index + 1}`}
                                        style={{ width: '140px', height: '100px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e5e7eb', cursor: 'pointer' }}
                                        onClick={() => window.open(`http://localhost:8082${url}`, '_blank')}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div style={{ color: '#6b7280', fontSize: '14px' }}>No attachments</div>
                        )}
                    </div>
                </div>

                {/* RIGHT COLUMN */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    
                    {/* Status Workflow Card */}
                    <div style={cardStyle}>
                        <h3 style={{ margin: '0 0 24px 0', fontSize: '16px', color: '#111827' }}>Status Workflow</h3>
                        
                        {ticket.status === 'REJECTED' ? (
                             <div style={{ padding: '16px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px' }}>
                                <h4 style={{ margin: '0 0 8px 0', color: '#dc2626' }}>Ticket Rejected</h4>
                                <p style={{ margin: 0, fontSize: '14px', color: '#7f1d1d' }}>{ticket.rejectionReason}</p>
                             </div>
                        ) : (
                            <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
                                <div style={{ position: 'absolute', top: '16px', left: '10%', right: '10%', height: '2px', backgroundColor: '#e5e7eb', zIndex: 0 }} />
                                {statuses.map((status, index) => {
                                    const isActive = index <= currentStatusIndex;
                                    const isCurrent = index === currentStatusIndex;
                                    return (
                                        <div key={status} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1 }}>
                                            <div style={{ 
                                                width: '32px', height: '32px', borderRadius: '50%', 
                                                backgroundColor: isActive ? '#2563eb' : '#f3f4f6',
                                                color: isActive ? 'white' : '#9ca3af',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontSize: '14px', fontWeight: 'bold',
                                                border: isActive ? '2px solid white' : '2px solid #e5e7eb',
                                                boxShadow: isActive ? '0 0 0 2px #2563eb' : 'none',
                                                marginBottom: '12px'
                                            }}>
                                                {index + 1}
                                            </div>
                                            <div style={{ fontSize: '11px', fontWeight: '700', color: isCurrent ? '#2563eb' : '#4b5563', textAlign: 'center' }}>
                                                {status}
                                            </div>
                                            {isCurrent && ticket.createdAt && (
                                                <div style={{ fontSize: '10px', color: '#6b7280', marginTop: '4px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                                                    {formatDateTime(status === 'OPEN' ? ticket.createdAt : (status === 'RESOLVED' || status === 'CLOSED' ? ticket.resolvedAt : ticket.firstRespondedAt))}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Assigned To Card */}
                    <div style={cardStyle}>
                        <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#111827' }}>Assigned To</h3>
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                            <img src={getAvatar("Technician")} alt="Tech Avatar" style={{ width: '48px', height: '48px', borderRadius: '50%' }} />
                            <div>
                                <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827', marginBottom: '4px' }}>System Technician</div>
                                <div style={{ fontSize: '12px', color: '#6b7280' }}>Auto Assigned</div>
                            </div>
                        </div>
                    </div>

                    {/* Resolution Notes Card */}
                    <div style={cardStyle}>
                        <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#111827' }}>Resolution Notes</h3>
                        <div style={{ fontSize: '14px', color: ticket.resolutionNotes ? '#111827' : '#9ca3af', lineHeight: '1.5' }}>
                            {ticket.resolutionNotes || '--'}
                        </div>
                    </div>
                </div>
            </div>

            {/* Comments Section */}
            <div style={{ ...cardStyle, marginTop: '20px' }}>
                <h3 style={{ margin: '0 0 24px 0', fontSize: '16px', color: '#111827' }}>Comments ({comments.length})</h3>
                
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
                                            {(comment.authorName === currentUser.name || currentUser.role === 'Admin') && !editingCommentId && (
                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                    {comment.authorName === currentUser.name && (
                                                        <FiEdit2 size={14} color="#2563eb" style={{ cursor: 'pointer' }} onClick={() => { setEditingCommentId(comment.id); setEditCommentContent(comment.content); }} />
                                                    )}
                                                    <FiTrash2 size={14} color="#dc2626" style={{ cursor: 'pointer' }} onClick={() => handleDeleteComment(comment.id)} />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {editingCommentId === comment.id ? (
                                        <div style={{ marginTop: '8px' }}>
                                            <textarea 
                                                value={editCommentContent} 
                                                onChange={(e) => setEditCommentContent(e.target.value)} 
                                                style={{ width: '100%', minHeight: '60px', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', marginBottom: '8px', outline: 'none' }}
                                            />
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button onClick={() => handleEditComment(comment.id)} style={{ padding: '6px 16px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' }}>Save</button>
                                                <button onClick={() => setEditingCommentId(null)} style={{ padding: '6px 16px', backgroundColor: '#e5e7eb', color: '#4b5563', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' }}>Cancel</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div style={{ fontSize: '14px', color: '#374151', lineHeight: '1.5' }}>
                                            {comment.content}
                                        </div>
                                    )}
                                </div>
                            </div>
                            {index < comments.length - 1 && <div style={{ height: '1px', backgroundColor: '#f3f4f6', marginTop: '24px' }} />}
                        </div>
                    ))}
                </div>

                {/* Add Comment Input */}
                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                    <img src={getAvatar(currentUser.name)} alt="Your Avatar" style={{ width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Add a comment..."
                            style={{ width: '100%', minHeight: '80px', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', fontSize: '14px', boxSizing: 'border-box', marginBottom: '12px', resize: 'vertical' }}
                        />
                        <button
                            onClick={handleAddComment}
                            style={{ padding: '8px 24px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}
                        >
                            Post Comment
                        </button>
                    </div>
                </div>
            </div>

            {/* Actions Modal */}
            {showActionsModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', width: '400px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
                        <h2 style={{ margin: '0 0 20px 0', fontSize: '20px' }}>Update Ticket Actions</h2>
                        
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>Status:</label>
                            <select value={updateStatus} onChange={(e) => setUpdateStatus(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', outline: 'none' }}>
                                <option value="OPEN">OPEN</option>
                                <option value="IN_PROGRESS">IN_PROGRESS</option>
                                <option value="RESOLVED">RESOLVED</option>
                                <option value="CLOSED">CLOSED</option>
                                <option value="REJECTED">REJECTED</option>
                            </select>
                        </div>

                        {updateStatus === 'REJECTED' ? (
                            <div style={{ marginBottom: '24px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>Rejection Reason:</label>
                                <textarea value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} style={{ width: '100%', minHeight: '80px', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', outline: 'none' }} />
                            </div>
                        ) : (
                            <div style={{ marginBottom: '24px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>Resolution Notes:</label>
                                <textarea value={resolutionNotes} onChange={(e) => setResolutionNotes(e.target.value)} style={{ width: '100%', minHeight: '80px', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', outline: 'none' }} />
                            </div>
                        )}

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                            <button onClick={() => setShowActionsModal(false)} style={{ padding: '10px 16px', backgroundColor: '#e5e7eb', color: '#4b5563', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}>Cancel</button>
                            <button onClick={handleUpdateTicket} style={{ padding: '10px 16px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}>Update Ticket</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TicketDetails;
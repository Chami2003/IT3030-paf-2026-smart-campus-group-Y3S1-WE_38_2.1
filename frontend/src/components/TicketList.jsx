import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TicketList = () => {
    const [tickets, setTickets] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [newStatus, setNewStatus] = useState('');
    const [notes, setNotes] = useState('');

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        try {
            const response = await axios.get('http://localhost:8082/api/tickets');
            setTickets(response.data);
        } catch (error) {
            console.error("Error fetching tickets:", error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure?")) {
            try {
                await axios.delete(`http://localhost:8082/api/tickets/${id}`);
                alert("Ticket Deleted!");
                fetchTickets();
            } catch (error) {
                alert("Failed to delete.");
            }
        }
    };

    const handleEditClick = (ticket) => {
        setSelectedTicket(ticket);
        setNewStatus(ticket.status || 'OPEN');
        setNotes(ticket.resolutionNotes || '');
    };

    const handleUpdate = async () => {
        try {
            const updatedData = {
                ...selectedTicket,
                status: newStatus,
                resolutionNotes: notes,
                assignedTechnicianId: "TECH-001" 
            };
            await axios.put(`http://localhost:8082/api/tickets/${selectedTicket.id}`, updatedData);
            alert("Ticket Updated!");
            setSelectedTicket(null);
            fetchTickets();
        } catch (error) {
            alert("Update Failed.");
        }
    };

    const getPriorityStyle = (priority) => {
        switch (priority) {
            case 'HIGH': return { backgroundColor: '#d9534f', color: 'white', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold' };
            case 'MEDIUM': return { backgroundColor: '#f0ad4e', color: 'black', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold' };
            case 'LOW': return { backgroundColor: '#5cb85c', color: 'white', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold' };
            default: return { backgroundColor: '#eee', padding: '4px 8px', borderRadius: '4px' };
        }
    };

    const filteredTickets = tickets.filter(t => {
        const title = t.title ? t.title.toLowerCase() : "";
        const search = searchTerm ? searchTerm.toLowerCase() : "";
        return title.includes(search);
    });

    return (
        <div style={{ padding: '20px', width: '95%', margin: 'auto', fontFamily: 'Arial, sans-serif' }}>
            <h2 style={{ textAlign: 'center', color: '#333' }}>Smart Campus Operations - Ticket Management</h2>
            
            <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                <input 
                    type="text" 
                    placeholder="Search by Title..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ width: '60%', padding: '12px', borderRadius: '25px', border: '1px solid #ccc', outline: 'none' }}
                />
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <thead>
                    <tr style={{ backgroundColor: '#333', color: 'white' }}>
                        <th style={{ padding: '12px', textAlign: 'left' }}>Title</th>
                        <th style={{ padding: '12px', textAlign: 'left' }}>Priority</th>
                        {/* --- අලුතින් එකතු කළ Column එක --- */}
                        <th style={{ padding: '12px', textAlign: 'left' }}>Images</th>
                        <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
                        <th style={{ padding: '12px', textAlign: 'center' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredTickets.length > 0 ? (
                        filteredTickets.map(ticket => (
                            <tr key={ticket.id} style={{ borderBottom: '1px solid #ddd' }}>
                                <td style={{ padding: '12px' }}>{ticket.title || "No Title"}</td>
                                <td style={{ padding: '12px' }}>
                                    <span style={getPriorityStyle(ticket.priority)}>
                                        {ticket.priority || "LOW"}
                                    </span>
                                </td>
                                
                                {/* --- පින්තූර පෙන්වන කොටස --- */}
                                <td style={{ padding: '12px' }}>
                                    <div style={{ display: 'flex', gap: '5px' }}>
                                        {ticket.attachmentUrls && ticket.attachmentUrls.length > 0 ? (
                                            ticket.attachmentUrls.map((url, index) => (
                                                <img 
                                                    key={index} 
                                                    src={`http://localhost:8082${url}`} 
                                                    alt="attachment" 
                                                    style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover', cursor: 'pointer', border: '1px solid #ddd' }} 
                                                    onClick={() => window.open(`http://localhost:8082${url}`, '_blank')}
                                                    title="Click to view full image"
                                                />
                                            ))
                                        ) : (
                                            <span style={{ color: '#ccc', fontSize: '12px' }}>No Images</span>
                                        )}
                                    </div>
                                </td>

                                <td style={{ padding: '12px', fontWeight: 'bold', color: ticket.status === 'RESOLVED' ? '#28a745' : '#007bff' }}>
                                    {ticket.status}
                                </td>
                                <td style={{ padding: '12px', textAlign: 'center' }}>
                                    <button onClick={() => handleEditClick(ticket)} style={{ marginRight: '8px', backgroundColor: '#007bff', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>Update</button>
                                    <button onClick={() => handleDelete(ticket.id)} style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" style={{ padding: '20px', textAlign: 'center', color: '#888' }}>No tickets found.</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* --- UPDATE MODAL (Popup) --- */}
            {selectedTicket && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', width: '450px', boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }}>
                        <h3 style={{ marginTop: 0 }}>Update Ticket: <span style={{ color: '#007bff' }}>{selectedTicket.title}</span></h3>
                        
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Change Status:</label>
                        <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '20px', borderRadius: '4px', border: '1px solid #ccc' }}>
                            <option value="OPEN">Open</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="RESOLVED">Resolved</option>
                            <option value="CLOSED">Closed</option>
                        </select>

                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Resolution Notes:</label>
                        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} style={{ width: '100%', height: '100px', marginBottom: '20px', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} placeholder="Detail the solution provided..." />
                        
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                            <button onClick={() => setSelectedTicket(null)} style={{ backgroundColor: '#6c757d', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
                            <button onClick={handleUpdate} style={{ backgroundColor: '#28a745', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Save Changes</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TicketList;
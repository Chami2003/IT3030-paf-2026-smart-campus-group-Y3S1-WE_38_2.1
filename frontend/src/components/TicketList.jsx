import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TicketList = () => {
    const [tickets, setTickets] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

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

    // Ticket එකක් Delete කරන function එක (Requirement 4)
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this ticket?")) {
            try {
                await axios.delete(`http://localhost:8082/api/tickets/${id}`);
                alert("Ticket deleted successfully!");
                fetchTickets(); // List එක refresh කරන්න
            } catch (error) {
                console.error("Error deleting ticket:", error);
                alert("Failed to delete ticket.");
            }
        }
    };

    const getPriorityStyle = (priority) => {
        switch (priority) {
            case 'HIGH': return { color: 'white', backgroundColor: '#d9534f', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold' };
            case 'MEDIUM': return { color: 'black', backgroundColor: '#f0ad4e', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold' };
            case 'LOW': return { color: 'white', backgroundColor: '#5cb85c', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold' };
            default: return { backgroundColor: '#eee', padding: '4px 8px', borderRadius: '4px' };
        }
    };

    // Null check එක සහිතව Search filter එක (Crash වීම වැළැක්වීමට)
    const filteredTickets = tickets.filter(ticket => {
        const title = ticket.title ? ticket.title.toLowerCase() : "";
        const category = ticket.category ? ticket.category.toLowerCase() : "";
        const search = searchTerm.toLowerCase();
        return title.includes(search) || category.includes(search);
    });

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', width: '90%', margin: 'auto' }}>
            <h2 style={{ textAlign: 'center', color: '#333' }}>All Maintenance Tickets</h2>

            <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                <input 
                    type="text" 
                    placeholder="Search by Title or Category..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ width: '60%', padding: '12px', borderRadius: '25px', border: '1px solid #ddd', outline: 'none', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}
                />
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>
                <thead>
                    <tr style={{ backgroundColor: '#007bff', color: 'white' }}>
                        <th style={{ padding: '15px', textAlign: 'left' }}>Title</th>
                        <th style={{ padding: '15px', textAlign: 'left' }}>Category</th>
                        <th style={{ padding: '15px', textAlign: 'left' }}>Location</th>
                        <th style={{ padding: '15px', textAlign: 'left' }}>Priority</th>
                        <th style={{ padding: '15px', textAlign: 'left' }}>Status</th>
                        <th style={{ padding: '15px', textAlign: 'center' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredTickets.length > 0 ? (
                        filteredTickets.map(ticket => (
                            <tr key={ticket.id} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '12px' }}>{ticket.title || 'N/A'}</td>
                                <td style={{ padding: '12px' }}>{ticket.category}</td>
                                <td style={{ padding: '12px' }}>{ticket.location}</td>
                                <td style={{ padding: '12px' }}>
                                    <span style={getPriorityStyle(ticket.priority)}>
                                        {ticket.priority}
                                    </span>
                                </td>
                                <td style={{ padding: '12px', fontWeight: 'bold', color: ticket.status === 'OPEN' ? 'blue' : 'orange' }}>
                                    {ticket.status}
                                </td>
                                <td style={{ padding: '12px', textAlign: 'center' }}>
                                    <button 
                                        onClick={() => handleDelete(ticket.id)}
                                        style={{ backgroundColor: '#ff4d4d', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" style={{ padding: '20px', textAlign: 'center', color: '#999' }}>No tickets found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default TicketList;
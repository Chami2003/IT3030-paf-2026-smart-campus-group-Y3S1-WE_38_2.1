import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiSearch, FiPlus, FiChevronRight } from 'react-icons/fi';
import StatCards from './StatCards';

const TicketList = () => {
    const [tickets, setTickets] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [filterPriority, setFilterPriority] = useState('All');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const response = await axios.get('http://localhost:8082/api/tickets');
                setTickets(response.data);
            } catch (error) {
                console.error("Error fetching tickets:", error);
            }
        };
        fetchTickets();
    }, []);

    const getStatusStyle = (status) => {
        const base = { padding: '6px 14px', borderRadius: '16px', fontSize: '11px', fontWeight: 'bold', display: 'inline-block' };
        switch(status?.toUpperCase()) {
            case 'OPEN': return { ...base, backgroundColor: '#e0e7ff', color: '#4338ca' }; // Light blue, deep blue text
            case 'IN_PROGRESS': return { ...base, backgroundColor: '#fef3c7', color: '#d97706' }; // Light orange, deep orange text
            case 'RESOLVED': return { ...base, backgroundColor: '#dcfce7', color: '#15803d' }; // Light green, deep green text
            case 'CLOSED': return { ...base, backgroundColor: '#e5e7eb', color: '#4b5563' }; // Light gray, dark gray text
            case 'REJECTED': return { ...base, backgroundColor: '#ffe4e6', color: '#e11d48' }; // Light red, deep red text
            default: return { ...base, backgroundColor: '#f3f4f6', color: '#6b7280' };
        }
    };

    const getPriorityStyle = (priority) => {
        const base = { padding: '6px 14px', borderRadius: '16px', fontSize: '11px', fontWeight: 'bold', display: 'inline-block' };
        switch(priority?.toUpperCase()) {
            case 'HIGH': return { ...base, backgroundColor: '#ffe4e6', color: '#e11d48' }; // Light red, deep red text
            case 'MEDIUM': return { ...base, backgroundColor: '#fef3c7', color: '#d97706' }; // Light orange, deep orange text
            case 'LOW': return { ...base, backgroundColor: '#dcfce7', color: '#15803d' }; // Light green, deep green text
            default: return { ...base, backgroundColor: '#f3f4f6', color: '#6b7280' };
        }
    };

    const formatId = (id) => `TKT-2026-${String(id).padStart(3, '0')}`;

    const formatDateTime = (isoString) => {
        if (!isoString) return { date: 'N/A', time: '' };
        const d = new Date(isoString);
        const date = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
        const time = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        return { date, time };
    };

    const filteredTickets = tickets.filter(t => {
        const subject = t.title ? t.title.toLowerCase() : "";
        const search = searchTerm ? searchTerm.toLowerCase() : "";
        const matchesSearch = subject.includes(search);
        const matchesPriority = filterPriority === 'All' || t.priority?.toUpperCase() === filterPriority.toUpperCase();
        const matchesStatus = filterStatus === 'All' || t.status?.toUpperCase() === filterStatus.toUpperCase();
        
        return matchesSearch && matchesPriority && matchesStatus;
    });

    const thStyle = { padding: '16px 20px', textAlign: 'left', fontSize: '11px', fontWeight: 'bold', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' };
    const tdStyle = { padding: '16px 20px', fontSize: '14px', color: '#111827', verticalAlign: 'middle' };

    return (
        <div style={{ width: '100%', boxSizing: 'border-box', margin: '0', padding: '30px', fontFamily: 'Inter, system-ui, sans-serif', backgroundColor: '#fafafa', minHeight: '100vh' }}>
            
            <StatCards />

            {/* Top Navigation / Filters */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                
                {/* Search Bar */}
                <div style={{ position: 'relative', width: '300px' }}>
                    <FiSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} size={18} />
                    <input 
                        type="text" 
                        placeholder="Search tickets..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ 
                            width: '100%', 
                            padding: '10px 10px 10px 38px', 
                            borderRadius: '8px', 
                            border: '1px solid #d1d5db', 
                            outline: 'none',
                            fontSize: '14px',
                            boxSizing: 'border-box',
                            backgroundColor: '#f9fafb',
                            color: '#111827'
                        }}
                    />
                </div>

                {/* Filters & Create Button */}
                <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>Status</span>
                        <select 
                            value={filterStatus} 
                            onChange={(e) => setFilterStatus(e.target.value)} 
                            style={{ 
                                padding: '8px 12px', 
                                borderRadius: '8px', 
                                border: '1px solid #d1d5db', 
                                outline: 'none', 
                                fontSize: '14px', 
                                color: '#111827', 
                                cursor: 'pointer', 
                                backgroundColor: '#f9fafb' 
                            }}
                        >
                            <option value="All">All</option>
                            <option value="OPEN">Open</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="RESOLVED">Resolved</option>
                            <option value="CLOSED">Closed</option>
                            <option value="REJECTED">Rejected</option>
                        </select>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>Priority</span>
                        <select 
                            value={filterPriority} 
                            onChange={(e) => setFilterPriority(e.target.value)} 
                            style={{ 
                                padding: '8px 12px', 
                                borderRadius: '8px', 
                                border: '1px solid #d1d5db', 
                                outline: 'none', 
                                fontSize: '14px', 
                                color: '#111827', 
                                cursor: 'pointer', 
                                backgroundColor: '#f9fafb' 
                            }}
                        >
                            <option value="All">All</option>
                            <option value="HIGH">High</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="LOW">Low</option>
                        </select>
                    </div>

                    <Link to="/create" style={{ textDecoration: 'none' }}>
                        <button style={{ 
                            display: 'flex', alignItems: 'center', gap: '8px', 
                            backgroundColor: '#2563eb', color: 'white', 
                            padding: '10px 20px', borderRadius: '6px', 
                            border: 'none', cursor: 'pointer', 
                            fontSize: '14px', fontWeight: '600',
                            transition: 'background-color 0.2s'
                        }}>
                            <FiPlus size={18} /> Create Ticket
                        </button>
                    </Link>
                </div>
            </div>

            {/* Ticket Table */}
            <div style={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid #e5e7eb', backgroundColor: '#ffffff' }}>
                            <th style={thStyle}>Ticket ID</th>
                            <th style={thStyle}>Category</th>
                            <th style={thStyle}>Subject</th>
                            <th style={thStyle}>Priority</th>
                            <th style={thStyle}>Status</th>
                            <th style={thStyle}>Created At</th>
                            <th style={{...thStyle, width: '40px'}}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTickets.length > 0 ? (
                            filteredTickets.map(ticket => {
                                const { date, time } = formatDateTime(ticket.createdAt);
                                return (
                                    <tr 
                                        key={ticket.id} 
                                        onClick={() => navigate(`/ticket/${ticket.id}`)}
                                        style={{ 
                                            borderBottom: '1px solid #f3f4f6', 
                                            cursor: 'pointer',
                                            transition: 'background-color 0.15s'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                    >
                                        <td style={{ ...tdStyle, fontWeight: '700' }}>
                                            {formatId(ticket.id)}
                                        </td>
                                        <td style={{ ...tdStyle, color: '#2563eb', fontWeight: '600' }}>
                                            {ticket.category || "General"}
                                        </td>
                                        <td style={{ ...tdStyle, maxWidth: '250px' }}>
                                            <div style={{ fontWeight: '600', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {ticket.title || "No Subject"}
                                            </div>
                                            <div style={{ fontSize: '13px', color: '#6b7280', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {ticket.location || "No Location"}
                                            </div>
                                        </td>
                                        <td style={tdStyle}>
                                            <span style={getPriorityStyle(ticket.priority)}>
                                                {ticket.priority?.toUpperCase() || "LOW"}
                                            </span>
                                        </td>
                                        <td style={tdStyle}>
                                            <span style={getStatusStyle(ticket.status)}>
                                                {ticket.status?.replace('_', ' ') || "OPEN"}
                                            </span>
                                        </td>
                                        <td style={tdStyle}>
                                            <div style={{ fontWeight: '500', marginBottom: '2px', color: '#374151' }}>{date}</div>
                                            <div style={{ fontSize: '12px', color: '#6b7280' }}>{time}</div>
                                        </td>
                                        <td style={{ padding: '16px 20px', color: '#9ca3af', textAlign: 'right' }}>
                                            <FiChevronRight size={20} />
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="7" style={{ padding: '40px', textAlign: 'center', color: '#6b7280', fontSize: '14px' }}>
                                    No tickets found matching your search criteria.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

        </div>
    );
};

export default TicketList;
import React, { useState } from 'react';
import axios from 'axios';

const TicketForm = () => {
    // Form එකේ අලුත් requirements වලට අනුව states
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('IT'); // Default 'IT'
    const [priority, setPriority] = useState('LOW'); // Default 'LOW'
    const [location, setLocation] = useState('');
    const [contactDetails, setContactDetails] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            // Backend එකට යවන data object එක
            const ticketData = {
                title,
                description,
                category,
                priority,
                location,
                contactDetails,
                status: 'OPEN'
            };

            const response = await axios.post('http://localhost:8082/api/tickets', ticketData);

            alert("Ticket Submitted Successfully!");
            
            // Form එක clear කිරීම
            setTitle('');
            setDescription('');
            setLocation('');
            setContactDetails('');
            setCategory('IT');
            setPriority('LOW');

        } catch (error) {
            console.error("Error submitting ticket:", error);
            alert("Failed to submit ticket. Make sure the backend is running on port 8082.");
        }
    };

    const inputStyle = { width: '100%', padding: '8px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ccc' };

    return (
        <div style={{ maxWidth: '500px', margin: '20px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '10px', backgroundColor: '#f9f9f9', fontFamily: 'Arial, sans-serif' }}>
            <h2 style={{ textAlign: 'center', color: '#333' }}>Create New Incident Ticket</h2>
            
            <form onSubmit={handleSubmit}>
                <label>Ticket Title:</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required style={inputStyle} placeholder="e.g. Broken Projector" />

                <label>Category:</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} style={inputStyle}>
                    <option value="IT">IT Support</option>
                    <option value="ELECTRICAL">Electrical</option>
                    <option value="MAINTENANCE">General Maintenance</option>
                    <option value="FURNITURE">Furniture</option>
                </select>

                <label>Priority Level:</label>
                <select value={priority} onChange={(e) => setPriority(e.target.value)} style={inputStyle}>
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                </select>

                <label>Location (Specific Resource/Room):</label>
                <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} required style={inputStyle} placeholder="e.g. Lab 04 / Faculty Lobby" />

                <label>Contact Details:</label>
                <input type="text" value={contactDetails} onChange={(e) => setContactDetails(e.target.value)} required style={inputStyle} placeholder="Email or Phone Number" />

                <label>Detailed Description:</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} required style={{ ...inputStyle, height: '80px' }} placeholder="Explain the issue in detail..." />

                <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}>
                    Submit Ticket
                </button>
            </form>
        </div>
    );
};

export default TicketForm;
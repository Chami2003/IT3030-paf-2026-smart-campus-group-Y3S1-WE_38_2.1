import React, { useState } from 'react';
import axios from 'axios';

const TicketForm = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('IT'); 
    const [priority, setPriority] = useState('LOW'); 
    const [location, setLocation] = useState('');
    const [contactDetails, setContactDetails] = useState('');
    
    // පින්තූර තබා ගැනීමට state එකක්
    const [selectedFiles, setSelectedFiles] = useState([]);

    // පින්තූර තෝරන විට ක්‍රියාත්මක වන function එක
    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 3) {
            alert("Maximum 3 images allowed!");
            e.target.value = null; // Input එක clear කරන්න
            setSelectedFiles([]);
            return;
        }
        setSelectedFiles(files);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // පින්තූර සහ දත්ත යැවීමට FormData භාවිතා කරයි
        const data = new FormData();
        
        const ticketData = {
            title,
            description,
            category,
            priority,
            location,
            contactDetails,
            status: 'OPEN'
        };

        // Ticket දත්ත JSON කොටසක් ලෙස එකතු කිරීම
        data.append("ticket", new Blob([JSON.stringify(ticketData)], { type: "application/json" }));
        
        // තෝරාගත් පින්තූර එකින් එක එකතු කිරීම
        selectedFiles.forEach((file) => {
            data.append("images", file);
        });

        try {
            const response = await axios.post('http://localhost:8082/api/tickets', data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            alert("Ticket Submitted Successfully with Attachments!");
            
            // Form එක clear කිරීම
            setTitle('');
            setDescription('');
            setLocation('');
            setContactDetails('');
            setCategory('IT');
            setPriority('LOW');
            setSelectedFiles([]);
            document.getElementById('fileInput').value = null; // File input එක reset කිරීම

        } catch (error) {
            console.error("Error submitting ticket:", error);
            alert("Failed to submit ticket. Check backend logs.");
        }
    };

    const inputStyle = { width: '100%', padding: '8px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' };

    return (
        <div style={{ maxWidth: '500px', margin: '20px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '10px', backgroundColor: '#f9f9f9', fontFamily: 'Arial, sans-serif' }}>
            <h2 style={{ textAlign: 'center', color: '#333' }}>Create New Incident Ticket</h2>
            
            <form onSubmit={handleSubmit}>
                <label>Ticket Title:</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required style={inputStyle} placeholder="e.g. Broken Projector" />

                <div style={{ display: 'flex', gap: '10px' }}>
                    <div style={{ flex: 1 }}>
                        <label>Category:</label>
                        <select value={category} onChange={(e) => setCategory(e.target.value)} style={inputStyle}>
                            <option value="IT">IT Support</option>
                            <option value="ELECTRICAL">Electrical</option>
                            <option value="MAINTENANCE">General Maintenance</option>
                            <option value="FURNITURE">Furniture</option>
                        </select>
                    </div>
                    <div style={{ flex: 1 }}>
                        <label>Priority Level:</label>
                        <select value={priority} onChange={(e) => setPriority(e.target.value)} style={inputStyle}>
                            <option value="LOW">Low</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="HIGH">High</option>
                        </select>
                    </div>
                </div>

                <label>Location:</label>
                <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} required style={inputStyle} placeholder="e.g. Lab 04" />

                <label>Contact Details:</label>
                <input type="text" value={contactDetails} onChange={(e) => setContactDetails(e.target.value)} required style={inputStyle} placeholder="Email or Phone" />

                <label>Detailed Description:</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} required style={{ ...inputStyle, height: '80px' }} placeholder="Explain the issue..." />

                {/* --- Image Upload Section --- */}
                <label style={{ fontWeight: 'bold', color: '#555' }}>Attachments (Max 3 Images):</label>
                <input 
                    id="fileInput"
                    type="file" 
                    multiple 
                    accept="image/*" 
                    onChange={handleFileChange}
                    style={{ ...inputStyle, padding: '5px' }}
                />
                {selectedFiles.length > 0 && <p style={{ fontSize: '12px', color: 'green' }}>{selectedFiles.length} images selected.</p>}

                <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', marginTop: '10px' }}>
                    Submit Ticket
                </button>
            </form>
        </div>
    );
};

export default TicketForm;
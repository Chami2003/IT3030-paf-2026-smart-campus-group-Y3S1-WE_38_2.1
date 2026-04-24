import React, { useState, useRef } from 'react';
import axios from 'axios';
import { FiUploadCloud, FiX } from 'react-icons/fi';

const TicketForm = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('Hardware'); 
    const [priority, setPriority] = useState('High'); 
    const [location, setLocation] = useState('');
    const [contactDetails, setContactDetails] = useState('');
    
    // Validation Errors State
    const [validationErrors, setValidationErrors] = useState('');
    
    // File state
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    
    const fileInputRef = useRef(null);

    const handleFiles = (files) => {
        const validImageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
        
        if (selectedFiles.length + validImageFiles.length > 3) {
            alert("You can upload a maximum of 3 images only.");
            return;
        }

        const oversizedFiles = validImageFiles.filter(file => file.size > 5 * 1024 * 1024);
        if (oversizedFiles.length > 0) {
            alert("Each image must be less than 5MB.");
            return;
        }

        setSelectedFiles(prev => [...prev, ...validImageFiles].slice(0, 3));
    };

    const handleFileSelect = (e) => {
        handleFiles(e.target.files);
        // Reset input so the same file can be selected again if removed
        e.target.value = null;
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        handleFiles(e.dataTransfer.files);
    };

    const removeFile = (indexToRemove) => {
        setSelectedFiles(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setValidationErrors('');
        
        const data = new FormData();
        const ticketData = {
            title,
            description,
            category: category.toUpperCase(),
            priority: priority.toUpperCase(),
            location,
            contactDetails,
            status: 'OPEN'
        };

        data.append("ticket", new Blob([JSON.stringify(ticketData)], { type: "application/json" }));
        
        selectedFiles.forEach((file) => {
            data.append("images", file);
        });

        try {
            await axios.post('http://localhost:8082/api/tickets', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            alert("Incident Ticket Submitted Successfully!");
            
            setTitle('');
            setDescription('');
            setLocation('');
            setContactDetails('');
            setCategory('Hardware');
            setPriority('High');
            setSelectedFiles([]);
            setValidationErrors('');

        } catch (error) {
            console.error("Error submitting ticket:", error);
            if (error.response && error.response.data && error.response.status === 400) {
                const data = error.response.data;
                if (data.errors && Array.isArray(data.errors)) {
                    const messages = data.errors.map(err => err.defaultMessage).join(', ');
                    setValidationErrors(messages);
                } else if (data.message) {
                    setValidationErrors(data.message);
                } else {
                    setValidationErrors("Validation failed. Please check your inputs.");
                }
            } else {
                alert("Failed to submit incident ticket. Please try again.");
            }
        }
    };

    const handleCancel = () => {
        // Reset form
        setTitle('');
        setDescription('');
        setLocation('');
        setContactDetails('');
        setCategory('Hardware');
        setPriority('High');
        setSelectedFiles([]);
        setValidationErrors('');
    };

    const labelStyle = { display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.025em' };
    const requiredAsterisk = <span style={{ color: '#ef4444' }}>*</span>;
    const inputStyle = { 
        width: '100%', 
        padding: '12px 14px', 
        borderRadius: '8px', 
        border: '1px solid #d1d5db', 
        boxSizing: 'border-box',
        fontSize: '14px',
        outline: 'none',
        transition: 'all 0.2s ease',
        backgroundColor: '#f9fafb',
        color: '#111827'
    };

    const submitButtonStyle = { 
        padding: '12px 28px', 
        backgroundColor: '#2563eb', 
        color: '#fff', 
        border: 'none', 
        borderRadius: '8px', 
        cursor: 'pointer', 
        fontSize: '14px', 
        fontWeight: '600',
        boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)',
        transition: 'all 0.2s ease'
    };

    const cancelButtonStyle = { 
        padding: '12px 28px', 
        backgroundColor: '#fff', 
        color: '#4b5563', 
        border: '1px solid #d1d5db', 
        borderRadius: '8px', 
        cursor: 'pointer', 
        fontSize: '14px', 
        fontWeight: '600',
        transition: 'all 0.2s ease'
    };

    return (
        <div style={{ width: '100%', boxSizing: 'border-box', margin: '0', padding: '40px', backgroundColor: '#fff', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', fontFamily: 'Inter, system-ui, sans-serif' }}>
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ margin: '0 0 8px 0', fontSize: '24px', color: '#111827', fontWeight: '700' }}>Create Incident Ticket</h1>
                <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>Please provide details about the maintenance or incident issue.</p>
            </div>

            {validationErrors && (
                <div style={{ padding: '12px', marginBottom: '20px', backgroundColor: '#fef2f2', color: '#b91c1c', borderRadius: '6px', border: '1px solid #f87171' }}>
                    <strong>Error:</strong> {validationErrors}
                </div>
            )}
            
            <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                    
                    {/* Left Column */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div>
                            <label style={labelStyle}>Category {requiredAsterisk}</label>
                            <select value={category} onChange={(e) => setCategory(e.target.value)} style={inputStyle}>
                                <option value="Hardware">Hardware</option>
                                <option value="Software">Software</option>
                                <option value="Network">Network</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div>
                            <label style={labelStyle}>Resource / Location {requiredAsterisk}</label>
                            <input 
                                type="text" 
                                value={location} 
                                onChange={(e) => setLocation(e.target.value)} 
                                required 
                                style={inputStyle} 
                                placeholder="e.g. Lab 1" 
                            />
                        </div>

                        <div>
                            <label style={labelStyle}>Priority {requiredAsterisk}</label>
                            <div style={{ position: 'relative' }}>
                                <select value={priority} onChange={(e) => setPriority(e.target.value)} style={{...inputStyle, paddingLeft: '32px'}}>
                                    <option value="High">High</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Low">Low</option>
                                </select>
                                <div style={{ 
                                    position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
                                    width: '8px', height: '8px', borderRadius: '50%',
                                    backgroundColor: priority === 'High' ? '#ef4444' : priority === 'Medium' ? '#f59e0b' : '#10b981'
                                }} />
                            </div>
                        </div>

                        <div>
                            <label style={labelStyle}>Subject {requiredAsterisk}</label>
                            <input 
                                type="text" 
                                value={title} 
                                onChange={(e) => setTitle(e.target.value)} 
                                required 
                                style={inputStyle} 
                                placeholder="Brief summary of the incident" 
                            />
                        </div>

                        <div>
                            <label style={labelStyle}>Description {requiredAsterisk}</label>
                            <textarea 
                                value={description} 
                                onChange={(e) => setDescription(e.target.value)} 
                                required 
                                style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }} 
                                placeholder="Detailed description of the issue..." 
                            />
                        </div>

                        <div>
                            <label style={labelStyle}>Preferred Contact {requiredAsterisk}</label>
                            <input 
                                type="text" 
                                value={contactDetails} 
                                onChange={(e) => setContactDetails(e.target.value)} 
                                required 
                                style={inputStyle} 
                                placeholder="Email or Phone number" 
                            />
                        </div>
                    </div>

                    {/* Right Column */}
                    <div>
                        <label style={{...labelStyle, marginBottom: '12px'}}>Attachments <span style={{color: '#6b7280', fontWeight: 'normal', textTransform: 'none'}}>(Max 3 images)</span></label>
                        
                        <div 
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current.click()}
                            style={{
                                border: isDragging ? '2px dashed #2563eb' : '2px dashed #d1d5db',
                                borderRadius: '12px',
                                padding: '60px 20px',
                                textAlign: 'center',
                                backgroundColor: isDragging ? '#eff6ff' : '#f9fafb',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                marginBottom: '24px'
                            }}
                        >
                            <input 
                                type="file" 
                                multiple 
                                accept="image/png, image/jpeg" 
                                onChange={handleFileSelect}
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                            />
                            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>
                                <div style={{ backgroundColor: '#e0e7ff', padding: '16px', borderRadius: '50%', color: '#2563eb' }}>
                                    <FiUploadCloud size={32} />
                                </div>
                            </div>
                            <p style={{ margin: '0 0 5px 0', fontSize: '15px', color: '#111827', fontWeight: '600' }}>
                                Click to upload <span style={{fontWeight: 'normal', color: '#4b5563'}}>or drag and drop</span>
                            </p>
                            <p style={{ margin: 0, fontSize: '13px', color: '#6b7280' }}>
                                PNG, JPG up to 5MB
                            </p>
                        </div>

                        {/* Image Previews */}
                        {selectedFiles.length > 0 && (
                            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                                {selectedFiles.map((file, index) => (
                                    <div key={index} style={{ width: '100px' }}>
                                        <div style={{ position: 'relative', width: '100px', height: '100px', marginBottom: '8px' }}>
                                            <img 
                                                src={URL.createObjectURL(file)} 
                                                alt={`preview ${index}`} 
                                                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px', border: '1px solid #e5e7eb' }} 
                                            />
                                            <button 
                                                type="button"
                                                onClick={(e) => { e.stopPropagation(); removeFile(index); }} 
                                                style={{ 
                                                    position: 'absolute', top: '-8px', right: '-8px', 
                                                    backgroundColor: '#111827', color: 'white', 
                                                    border: 'none', borderRadius: '50%', 
                                                    width: '24px', height: '24px', 
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                                }}
                                            >
                                                <FiX size={14} />
                                            </button>
                                        </div>
                                        <div style={{ fontSize: '12px', color: '#374151', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: '600' }}>
                                            {file.name}
                                        </div>
                                        <div style={{ fontSize: '11px', color: '#6b7280' }}>
                                            {(file.size / (1024 * 1024)).toFixed(1)} MB
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>

                {/* Bottom Buttons */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '48px', borderTop: '1px solid #f3f4f6', paddingTop: '32px' }}>
                    <button 
                        type="button" 
                        onClick={handleCancel}
                        style={cancelButtonStyle}
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit" 
                        style={submitButtonStyle}
                    >
                        Submit Ticket
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TicketForm;
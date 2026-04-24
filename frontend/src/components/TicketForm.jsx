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

    const labelStyle = { display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#1a1a2e', fontSize: '14px' };
    const requiredAsterisk = <span style={{ color: '#d9534f' }}>*</span>;
    const inputStyle = { 
        width: '100%', 
        padding: '10px 12px', 
        borderRadius: '6px', 
        border: '1px solid #d1d5db', 
        boxSizing: 'border-box',
        fontSize: '14px',
        outline: 'none',
        transition: 'border-color 0.2s'
    };

    return (
        <div style={{ width: '100%', boxSizing: 'border-box', margin: '0', padding: '30px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', fontFamily: 'Inter, system-ui, sans-serif' }}>
            {validationErrors && (
                <div style={{ padding: '12px', marginBottom: '20px', backgroundColor: '#fef2f2', color: '#b91c1c', borderRadius: '6px', border: '1px solid #f87171' }}>
                    <strong>Error:</strong> {validationErrors}
                </div>
            )}
            
            <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                    
                    {/* Left Column */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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
                                <select value={priority} onChange={(e) => setPriority(e.target.value)} style={{...inputStyle, paddingLeft: '25px'}}>
                                    <option value="High">High</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Low">Low</option>
                                </select>
                                <div style={{ 
                                    position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)',
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
                                style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }} 
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
                        <label style={{...labelStyle, marginBottom: '10px'}}>Attachments <span style={{color: '#6b7280', fontWeight: 'normal'}}>(Max 3 images)</span></label>
                        
                        <div 
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current.click()}
                            style={{
                                border: isDragging ? '2px dashed #3b82f6' : '2px dashed #d1d5db',
                                borderRadius: '8px',
                                padding: '40px 20px',
                                textAlign: 'center',
                                backgroundColor: isDragging ? '#eff6ff' : '#f9fafb',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                marginBottom: '20px'
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
                                <div style={{ backgroundColor: '#e0e7ff', padding: '12px', borderRadius: '50%', color: '#4f46e5' }}>
                                    <FiUploadCloud size={24} />
                                </div>
                            </div>
                            <p style={{ margin: '0 0 5px 0', fontSize: '14px', color: '#374151', fontWeight: '500' }}>
                                Click to upload <span style={{fontWeight: 'normal'}}>or drag and drop</span>
                            </p>
                            <p style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>
                                PNG, JPG up to 5MB
                            </p>
                        </div>

                        {/* Image Previews */}
                        {selectedFiles.length > 0 && (
                            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                                {selectedFiles.map((file, index) => (
                                    <div key={index} style={{ width: '100px' }}>
                                        <div style={{ position: 'relative', width: '100px', height: '100px', marginBottom: '5px' }}>
                                            <img 
                                                src={URL.createObjectURL(file)} 
                                                alt={`preview ${index}`} 
                                                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e5e7eb' }} 
                                            />
                                            <button 
                                                type="button"
                                                onClick={(e) => { e.stopPropagation(); removeFile(index); }} 
                                                style={{ 
                                                    position: 'absolute', top: '-8px', right: '-8px', 
                                                    backgroundColor: '#1f2937', color: 'white', 
                                                    border: 'none', borderRadius: '50%', 
                                                    width: '24px', height: '24px', 
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                                }}
                                            >
                                                <FiX size={14} />
                                            </button>
                                        </div>
                                        <div style={{ fontSize: '12px', color: '#374151', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: '500' }}>
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
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px', marginTop: '40px', borderTop: '1px solid #e5e7eb', paddingTop: '20px' }}>
                    <button 
                        type="button" 
                        onClick={handleCancel}
                        style={{ 
                            padding: '10px 24px', 
                            backgroundColor: '#fff', 
                            color: '#374151', 
                            border: '1px solid #d1d5db', 
                            borderRadius: '6px', 
                            cursor: 'pointer', 
                            fontSize: '14px', 
                            fontWeight: '600' 
                        }}
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit" 
                        style={{ 
                            padding: '10px 24px', 
                            backgroundColor: '#2563eb', 
                            color: '#fff', 
                            border: 'none', 
                            borderRadius: '6px', 
                            cursor: 'pointer', 
                            fontSize: '14px', 
                            fontWeight: '600' 
                        }}
                    >
                        Submit Ticket
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TicketForm;
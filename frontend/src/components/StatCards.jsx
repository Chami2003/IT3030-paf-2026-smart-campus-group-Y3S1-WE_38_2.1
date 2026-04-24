import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiLayers, FiClock, FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';

const StatCards = () => {
    const [stats, setStats] = useState({
        totalTickets: 0,
        pendingTickets: 0,
        resolvedTickets: 0,
        criticalTickets: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get('http://localhost:8082/api/tickets/stats');
                setStats(response.data);
            } catch (error) {
                console.error("Error fetching ticket stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
        // Optional: refresh every 30 seconds
        const interval = setInterval(fetchStats, 30000);
        return () => clearInterval(interval);
    }, []);

    const cards = [
        {
            title: 'Total Tickets',
            value: stats.totalTickets,
            icon: <FiLayers size={24} />,
            color: '#3b82f6',
            bgColor: '#eff6ff'
        },
        {
            title: 'Pending Action',
            value: stats.pendingTickets,
            icon: <FiClock size={24} />,
            color: '#f59e0b',
            bgColor: '#fffbeb'
        },
        {
            title: 'Resolved/Closed',
            value: stats.resolvedTickets,
            icon: <FiCheckCircle size={24} />,
            color: '#10b981',
            bgColor: '#ecfdf5'
        },
        {
            title: 'Critical Priority',
            value: stats.criticalTickets,
            icon: <FiAlertTriangle size={24} />,
            color: '#ef4444',
            bgColor: '#fef2f2'
        }
    ];

    if (loading) {
        return <div style={{ height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280' }}>Loading statistics...</div>;
    }

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
            {cards.map((card, index) => (
                <div 
                    key={index}
                    style={{
                        backgroundColor: '#fff',
                        borderRadius: '12px',
                        padding: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '20px',
                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)',
                        border: '1px solid #f3f4f6'
                    }}
                >
                    <div style={{
                        backgroundColor: card.bgColor,
                        color: card.color,
                        width: '56px',
                        height: '56px',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                    }}>
                        {card.icon}
                    </div>
                    <div>
                        <div style={{ fontSize: '13px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
                            {card.title}
                        </div>
                        <div style={{ fontSize: '28px', fontWeight: '700', color: '#111827', lineHeight: '1' }}>
                            {card.value}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default StatCards;

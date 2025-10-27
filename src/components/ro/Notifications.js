import React, { useState, useEffect } from 'react';
import './notifications.css';
import RONewNavbar from './RONewNavbar';
import { Link, useNavigate } from 'react-router-dom';
import vidyalogo2 from '../vidyalogo2.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faBars, faHome, faUser } from '@fortawesome/free-solid-svg-icons';
import './ronewnavbar.css';

export default function Notifications({ user, onLogout }) {
    const [notifications, setNotifications] = useState([]);
    const [notificationCount, setNotificationCount] = useState(0);
    const [expandedIndex, setExpandedIndex] = useState(null);
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(null);
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [showAbout, setShowAbout] = useState(false);


    // Fetch user details on mount if not provided as a prop
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            setCurrentUser(storedUser);
        }
    }, []);


    // Fetch notification count for the logged-in RO
    useEffect(() => {
        if (currentUser && currentUser.role === "RO") {
            const fetchNotificationCount = async () => {
                try {
                    const response = await fetch(`http://localhost:5000/api/notifications/count?roUsername=${currentUser.username}`);
                    const data = await response.json();
                    setNotificationCount(data.count);
                } catch (error) {
                    console.error('Error fetching notification count:', error);
                }
            };

            fetchNotificationCount();

            const interval = setInterval(fetchNotificationCount, 10000); // Poll every 10 sec
            return () => clearInterval(interval);
        }
    }, [currentUser]);

    useEffect(() => {
        if (currentUser && currentUser.role === "RO") {
            const fetchNotifications = async () => {
                try {
                    const response = await fetch(`http://localhost:5000/api/notifications?roUsername=${currentUser.username}`);
                    const data = await response.json();
                    setNotifications(data);
                    setNotificationCount(data.filter((notif) => !notif.isRead).length);
                } catch (error) {
                    console.error('Error fetching notifications:', error);
                }
            };

            fetchNotifications();
        }
    }, [currentUser]);


    // Mark notification as read
    const markAsRead = async (id, index) => {
        if (notifications[index].isRead) {
            toggleExpand(index); // 🔥 Directly expand if already read
            return;
        }

        try {
            await fetch(`http://localhost:5000/api/notifications/${id}/read`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
            });

            setNotifications((prevNotifications) =>
                prevNotifications.map((notif) =>
                    notif._id === id ? { ...notif, isRead: true } : notif
                )
            );

            setNotificationCount((prev) => Math.max(prev - 1, 0));
            toggleExpand(index); // 🔥 Expand after marking as read
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };



    const toggleExpand = (index) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    const formatDate = (dateString) => {
        const options = { day: '2-digit', month: 'long', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-GB', options);
    };

    return (
        <>
            <div className="homnavbar-container">
                <img src={vidyalogo2} alt="VIT Logo" className="homlogo" />

                <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
                    <div className="sidebar-content">
                        {currentUser && (
                            <>
                                <img
                                    src={`data:image/jpeg;base64,${currentUser.image}`}
                                    alt={`${currentUser.name}'s avatar`}
                                    className="sidebar-profile-image"
                                />
                                <h3>{currentUser.name}</h3>
                                <button className="sidebar-btn" onClick={() => navigate('/')}>
                                    <FontAwesomeIcon icon={faHome} /> Home
                                </button>
                                <button className="sidebar-btn" onClick={() => setShowAbout(true)}>
                                    <FontAwesomeIcon icon={faUser} /> About Me
                                </button>
                                <button className="sidebar-btn" onClick={() => {
                                    localStorage.removeItem('user');
                                    sessionStorage.removeItem('user');
                                    navigate('/', { replace: true });
                                    window.location.reload();
                                }}>
                                    <FontAwesomeIcon icon={faSignOutAlt} /> Logout
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {showAbout && currentUser && (
                    <div className="modal-backdrop" onClick={() => setShowAbout(false)}>
                        <div className="aboutme-modal" onClick={(e) => e.stopPropagation()}>
                            <span className="close-btn" onClick={() => setShowAbout(false)}>&times;</span>
                            <div className="aboutme-content">
                                <img
                                    src={`data:image/jpeg;base64,${currentUser.image}`}
                                    alt="Profile"
                                    className="profile-image"
                                />
                                <h2>{currentUser.name}</h2>
                                <div className="details-container">
                                    <span className="label">Username:</span>
                                    <span className="value">{currentUser.username}</span>

                                    <span className="label">Email:</span>
                                    <span className="value">{currentUser.email}</span>

                                    <span className="label">Department:</span>
                                    <span className="value">{currentUser.department}</span>

                                    <span className="label">Designation:</span>
                                    <span className="value">{currentUser.designation}</span>

                                    <span className="label">Employee Code:</span>
                                    <span className="value">{currentUser.employeeCode}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="main">
                    <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="profile-toggle1-btn">
                        <FontAwesomeIcon icon={faBars} />
                    </button>
                    {isSidebarOpen && <div className="backdrop" onClick={() => setSidebarOpen(false)}></div>}
                </div>
            </div>
            <div className="notifications-page">
                <h2 className="notifications-heading">Notifications</h2>
                {notifications.length === 0 ? (
                    <p className="no-notifications">No new notifications</p>
                ) : (
                    notifications.map((notif, index) => {
                        const messageParts = notif.message.split(" has submitted");
                        const teacherName = messageParts[0] || "Unknown Teacher";

                        return (
                            <div
                                key={notif._id}
                                className={`notification-card ${notif.isRead ? 'read' : 'unread'}`}
                                onClick={() => {
                                    if (!notif.isRead) {
                                        markAsRead(notif._id, index);
                                    } else {
                                        toggleExpand(index);
                                    }
                                }}

                            >
                                <p className="notification-title">📢 A Faculty Member Has Submitted a Form</p>
                                {expandedIndex === index && (
                                    <div className="notification-message">
                                        <p>
                                            <strong>{teacherName}</strong> has submitted their form on{' '}
                                            <span className="notification-date">{formatDate(notif.createdAt)}</span>.
                                        </p>
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </>
    );
}

import React, { useState, useEffect } from 'react';
import '../ro/notifications.css';
import { Link, useNavigate } from 'react-router-dom';
import vidyalogo2 from '../vidyalogo2.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { faSignOutAlt, faBars, faHome, faUser } from '@fortawesome/free-solid-svg-icons';


export default function TeacherNotifications() {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [expandedIndex, setExpandedIndex] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [showAbout, setShowAbout] = useState(false);

    const navigate = useNavigate();



    // 🧠 Fetch user from local storage
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            setCurrentUser(storedUser);
        }
    }, []);

    // 🔁 Fetch notifications
    useEffect(() => {
        const fetchNotifications = async () => {
            if (!currentUser) return;

            try {
                const response = await fetch(`http://localhost:5000/api/teacher-alerts/${currentUser.username}`);
                const data = await response.json();
                setNotifications(data);
                setUnreadCount(data.filter((notif) => !notif.read).length);
            } catch (err) {
                console.error("Failed to fetch teacher notifications", err);
            }
        };

        fetchNotifications();
        const interval = setInterval(fetchNotifications, 10000); // Optional polling
        return () => clearInterval(interval);
    }, [currentUser]);

    // ✅ Mark one as read
    const markAsRead = async (id, index) => {
        if (notifications[index].read) {
            toggleExpand(index);
            return;
        }

        try {
            await fetch(`http://localhost:5000/api/teacher-alerts/mark-read/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const updatedNotifications = [...notifications];
            updatedNotifications[index].read = true;
            setNotifications(updatedNotifications);
            setUnreadCount((prev) => Math.max(prev - 1, 0));
            toggleExpand(index);
        } catch (err) {
            console.error("Failed to mark as read", err);
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

                <div className="main">
                    <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="profile-toggle1-btn">
                        <FontAwesomeIcon icon={faBars} />
                    </button>
                    {isSidebarOpen && <div className="backdrop" onClick={() => setSidebarOpen(false)}></div>}
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

            <div className="notifications-page">
                <h2 className="notifications-heading">Notifications</h2>
                {notifications.length === 0 ? (
                    <p className="no-notifications">No new notifications</p>
                ) : (
                    notifications.map((notif, index) => (
                        <div
                            key={notif._id}
                            className={`notification-card ${notif.read ? 'read' : 'unread'}`}
                            onClick={() => markAsRead(notif._id, index)}
                        >
                            <p className="notification-title">📢 Review Completed by RO</p>
                            {expandedIndex === index && (
                                <div className="notification-message">
                                    <p>
                                        {notif.message}
                                        <br />
                                        <span className="notification-date">{formatDate(notif.createdAt)}</span>
                                    </p>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </>
    );
}

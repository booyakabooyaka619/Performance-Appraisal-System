import React, { useState, useEffect } from "react";
import vidyalogo2 from '../../vidyalogo2.jpg';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faBars, faHome, faUser, faBell, faClipboardCheck } from '@fortawesome/free-solid-svg-icons'; // Added Home and User icons

export default function ROBucketNavbar({ user, onLogout }) {
    const [currentUser, setCurrentUser] = useState(user);
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [notificationCount, setNotificationCount] = useState(0);
    const [showAbout, setShowAbout] = useState(false);


    const navigate = useNavigate();

    useEffect(() => {
        const fetchNotificationCount = async () => {
            try {
                if (!currentUser || currentUser.role !== "RO") return; // Ensure only ROs fetch notification count

                const response = await fetch(`http://localhost:5000/api/notifications/count?roUsername=${currentUser.username}`);
                const data = await response.json();
                setNotificationCount(data.count);
            } catch (error) {
                console.error('Error fetching notification count:', error);
            }
        };

        fetchNotificationCount();

        // Poll every 10 seconds to check for new notifications
        const interval = setInterval(fetchNotificationCount, 10000);
        return () => clearInterval(interval);
    }, [currentUser]); // Depend on currentUser so it updates when user logs in



    useEffect(() => {
        if (!user) {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                setCurrentUser(JSON.parse(storedUser));
            }
        } else {
            setCurrentUser(user);
        }
    }, [user]);

    useEffect(() => {
        // Add event listener to close sidebar when clicked outside
        const handleClickOutside = (event) => {
            if (isSidebarOpen && !event.target.closest('.sidebar') && !event.target.closest('.profile-toggle-btn')) {
                setSidebarOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [isSidebarOpen]);

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        sessionStorage.removeItem('user');
        navigate('/', { replace: true });
        window.location.reload();
    };

    return (
        <div className="container">
            <img src={vidyalogo2} alt="Description" className="logo" />
            <div className="x-container">
                <div className="bucket-container">
                    <button className="but" id="but1" onClick={() => navigate("/ROAI1")}>Academic Involvement</button>
                    <button className="but" id="but2" onClick={() => navigate("/ROSD1")}>Student Development</button>
                    <button className="but" id="but3" onClick={() => navigate("/ROAB1")}>Administrative</button>
                    <button className="but" id="but4" onClick={() => navigate("/RORB1")}>Research</button>
                    <button className="but" id="but5" onClick={() => navigate("/ROCB1")}>Consultancy</button>
                    <button className="but" id="but6" onClick={() => navigate("/ROPDB1")}>Product Development</button>

                    {/* Hamburger icon to toggle sidebar */}
                    <button className="profile-toggle-btn" onClick={toggleSidebar}>
                        <FontAwesomeIcon icon={faBars} /> {/* Hamburger icon */}
                    </button>
                </div>
            </div>

            {/* Sidebar */}
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
                            <Link to="/professorhome" className="sidebar-btn" style={{ textDecoration: 'none' }}>
                                <FontAwesomeIcon icon={faClipboardCheck} /> Submissions
                            </Link>

                            <button className="sidebar-btn" onClick={() => setShowAbout(true)}>
                                <FontAwesomeIcon icon={faUser} /> About Me
                            </button>
                            <Link to="/ROnotifications" className="sidebar-btn1" style={{ textDecoration: 'none' }}>
                                <div className="notification-container">
                                    <FontAwesomeIcon icon={faBell} className="notification-icon" />
                                    {notificationCount > 0 && <span className="notification-badge">{notificationCount}</span>}
                                </div>
                                Notifications
                            </Link>


                            <button className="sidebar-btn" onClick={handleLogout}>
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
                <button onClick={toggleSidebar} className="profile-toggle-btn">
                    <FontAwesomeIcon icon={faBars} />
                </button>
                {/* Close sidebar if clicked outside */}
                {isSidebarOpen && <div className="backdrop" onClick={toggleSidebar}></div>}
            </div>
        </div>
    );
}

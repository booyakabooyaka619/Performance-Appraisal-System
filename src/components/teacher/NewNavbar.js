import React, { useState, useEffect } from "react";
import vidyalogo2 from '../vidyalogo2.jpg';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faBars, faHome, faUser, faBell } from '@fortawesome/free-solid-svg-icons';
import './newnavbar.css';

export default function NewNavbar({ user, onLogout }) {
    const [currentUser, setCurrentUser] = useState(user);
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [notificationCount, setNotificationCount] = useState(0);
    const [showAbout, setShowAbout] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchTeacherNotificationCount = async (empCode) => {
            try {
                const response = await fetch(`http://localhost:5000/api/teacher-alerts/count?employeeCode=${empCode}`);
                const data = await response.json();
                setNotificationCount(data.count);
            } catch (error) {
                console.error("Error fetching teacher notification count:", error);
            }
        };

        const storedUser = user || JSON.parse(localStorage.getItem("user"));
        if (storedUser?.employeeCode) {
            setCurrentUser(storedUser);
            fetchTeacherNotificationCount(storedUser.employeeCode);
        }

        const interval = setInterval(() => {
            const storedUser = user || JSON.parse(localStorage.getItem("user"));
            if (storedUser?.employeeCode) {
                fetchTeacherNotificationCount(storedUser.employeeCode);
            }
        }, 10000);

        return () => clearInterval(interval);
    }, [user]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                isSidebarOpen &&
                !event.target.closest('.sidebar') &&
                !event.target.closest('.profile-toggle-btn')
            ) {
                setSidebarOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [isSidebarOpen]);

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    const handleLogout = () => {
        localStorage.clear();
        sessionStorage.clear();
        navigate('/', { replace: true });
        window.location.reload();
    };


    return (
        <div className="homnavbar-container">
            <img src={vidyalogo2} alt="VIT Logo" className="homlogo" />

            <div className="homcontents">
                <Link to="/" className="homsubcontent">Home</Link>
                <Link to="/summary" className="homsubcontent">Summary</Link>
                <Link to="/faculty-table" state={{ user }} className="homsubcontent">Scorecard</Link>
                <Link to="/guidelines" className="homsubcontent">Guidelines</Link>
            </div>

            <div className="square1" onClick={toggleSidebar}>
                <img
                    src={`data:image/jpeg;base64,${user?.image || ''}`}
                    alt={`${user?.name || 'User'}'s avatar`}
                    className="small-profile-image1 profile-toggle-btn"
                />
            </div>

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

                            {/* <button className="sidebar-btn" onClick={() => {
                                navigate('/');
                                window.location.reload();
                            }}>
                                <FontAwesomeIcon icon={faHome} /> Home
                            </button> */}

                            <button className="sidebar-btn" onClick={() => setShowAbout(true)}>
                                <FontAwesomeIcon icon={faUser} /> About Me
                            </button>

                            <Link to="/teachernotifications" className="sidebar-btn1" style={{ textDecoration: 'none' }}>
                                <div className="notification-container">
                                    <FontAwesomeIcon icon={faBell} className="notification-icon" />
                                    {notificationCount > 0 && (
                                        <span className="notification-badge">{notificationCount}</span>
                                    )}
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
        </div>
    );
}

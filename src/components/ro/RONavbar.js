import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import vidyalogo2 from '../vidyalogo2.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import '../teacher/newnavbar.css';
import { faBars, faHome, faUser, faBell, faBook } from '@fortawesome/free-solid-svg-icons'; // Added Home and User icons
import './ronewnavbar.css'


export default function RONavbar({ user, onLogout, teacher }) {
    // const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(null);
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [notificationCount, setNotificationCount] = useState(0);
    const [showAbout, setShowAbout] = useState(false);



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


    // Fetch user details on mount if not provided as a prop
    useEffect(() => {
        if (!user) {
            const storedUser = localStorage.getItem('user');
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
            if (isSidebarOpen && !event.target.closest('.sidebar') && !event.target.closest('.profile-toggle1-btn')) {
                setSidebarOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [isSidebarOpen]);

    // Toggle modal visibility
    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    // Logout function
    const handleLogout = () => {
        localStorage.removeItem('user');
        sessionStorage.removeItem('user');
        navigate('/', { replace: true });
        window.location.reload();
    };

    return (
        <div className="homnavbar-container">
            <img src={vidyalogo2} alt="VIT Logo" className="homlogo" />

            <div className="homcontents">
                <Link
                    to="/professorhome"
                    state={{ teacherName: teacher?.name, teacherDepartment: teacher?.department }}
                    className="homsubcontent"
                >
                    Submissions
                </Link>
                {/* <Link to="/faculty-table" state={{ user: currentUser }} className="homsubcontent">
                    Scorecard
                </Link> */}
                {/* <Link to="/" className="homsubcontent">Pending</Link> */}
                <Link to="/summarytable" className="homsubcontent">Summary</Link>
                <Link to="/ROguidelines" className="homsubcontent">Guidelines</Link>
            </div>

            {/* Profile Image and Modal */}
            {/* <div className="square1" onClick={toggleSidebar}>
                {currentUser?.image ? (
                    <img
                        src={`data:image/jpeg;base64,${currentUser.image}`}
                        alt={`${currentUser.name}'s avatar`}
                        className="small-profile-image1"
                    />
                ) : (
                    <img
                        src="/default-avatar.png"
                        alt="Default Avatar"
                        className="small-profile-image1"
                    />
                )}
            </div> */}

            {/* {showModal && currentUser && (
                <div className="modal-backdrop" onClick={toggleModal}>
                    <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-content">
                            {currentUser.image && (
                                <img
                                    src={`data:image/jpeg;base64,${currentUser.image}`}
                                    alt={`${currentUser.name}'s full profile`}
                                    className="full-profile-image1"
                                />
                            )}
                            <h3>{currentUser.name || 'User'}</h3>
                            <p>Username: {currentUser.username || 'N/A'}</p>
                            <button className="about-btn" onClick={() => navigate('/about-me')}>
                                About Me
                            </button>
                            <button className="logout-btn" onClick={handleLogout}>
                                <FontAwesomeIcon icon={faSignOutAlt} /> Logout
                            </button>
                        </div>
                    </div>
                </div>
            )} */}

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
                            {/* <button className="sidebar-btn" onClick={() => navigate('/notifications')}>
                                <FontAwesomeIcon icon={faBell} /> Notifications
                            </button> */}

                            <Link to="/ROnotifications" className="sidebar-btn1" style={{ textDecoration: 'none' }}>
                                <div className="notification-container">
                                    <FontAwesomeIcon icon={faBell} className="notification-icon" />
                                    {notificationCount > 0 && <span className="notification-badge">{notificationCount}</span>}
                                </div>
                                Notifications
                            </Link>
                            {/* <button className="sidebar-btn" onClick={() => navigate('/ROguidelines')}>
                                <FontAwesomeIcon icon={faBook} /> Guidelines
                            </button> */}
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
                <button onClick={toggleSidebar} className="profile-toggle1-btn">
                    <FontAwesomeIcon icon={faBars} />
                </button>
                {/* Close sidebar if clicked outside */}
                {isSidebarOpen && <div className="backdrop" onClick={toggleSidebar}></div>}
            </div>
        </div>
    );
}

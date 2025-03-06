import React, { useState } from 'react';
import vidyalogo from './vidyalogo.jpg';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

export default function Navbar({ user, onLogout }) {
    const [showModal, setShowModal] = useState(false); // State to control modal visibility
    const navigate = useNavigate();

    // Toggle modal visibility
    const toggleModal = () => {
        setShowModal(!showModal);
    };

    // Logout function
    const handleLogout = () => {
        onLogout(); // Perform logout action
        navigate('/'); // Redirect to login page
    };

    return (
        <div className="container">
            <img src={vidyalogo} alt="Description" className="logo" />
            <div className="x-container">
                <div className="bucket-container">
                    <button className="but" id="but1">
                        <Link className='navlink' to="/buckets/Bucket 1/Bucket1">Academic Involvement</Link>
                    </button>
                    <button className="but" id="but2">
                        <Link className='navlink' to="/buckets/Bucket 2/Bucket2">Student Development</Link>
                    </button>
                    <button className="but" id="but3">
                        <Link className='navlink' to="/buckets/Bucket 3/Bucket3">Administrative</Link>
                    </button>
                    <button className="but" id="but4">
                        <Link className='navlink' to="/buckets/Bucket 4/Bucket4">Research</Link>
                    </button>
                    <button className="but" id="but5">
                        <Link className='navlink' to="/buckets/Bucket 5/Bucket5">Consultancy</Link>
                    </button>
                    <button className="but" id="but6">
                        <Link className='navlink' to="/buckets/Bucket 6/Bucket6">Product Development</Link>
                    </button>
                    <div className="square" onClick={toggleModal}>
                        {user && (
                            <>
                                <img
                                    src={`data:image/jpeg;base64,${user.image}`}
                                    alt={`${user.name}'s avatar`}
                                    className="small-profile-image"
                                />
                                <p className="user-name">{user.name}</p>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {showModal && (
                <div className="modal-backdrop" onClick={toggleModal}>
                    <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-content">
                            {user && (
                                <>
                                    <img
                                        src={`data:image/jpeg;base64,${user.image}`}
                                        alt={`${user.name}'s full profile`}
                                        className="full-profile-image"
                                    />
                                    <h3>{user.name}</h3>
                                    <p>Username: {user.username}</p>
                                    <button className="about-btn" onClick={() => navigate('/about-me')}>
                                        About Me
                                    </button>
                                    <button className="logout-btn" onClick={handleLogout}>
                                        <FontAwesomeIcon icon={faSignOutAlt} /> Logout
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

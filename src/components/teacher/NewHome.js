import React, { useState } from 'react';
import './newhome.css';
import vidyalogo from '../vidyalogo.jpg';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

export default function NewHome({ user, onLogout }) {
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

    // Handle navigation to Home.js on clicking Academic Involvement
    const handleAcademicInvolvementClick = () => {
        navigate('/home'); // Redirect to Home.js
    };

    return (
        <div>
            <div className="homnavbar-container">
                <img src={vidyalogo} alt="Description" className="homlogo" />
                <div className="homcontents">
                    <div className="homsubcontent">Home</div>
                    <div className="homsubcontent">Scorecard</div>
                    <div className="homsubcontent">Summary</div>
                    <div className="homsubcontent">Guidelines</div>
                </div>
                <div className="square1" onClick={toggleModal}>
                    {user && (
                        <img
                            src={`data:image/jpeg;base64,${user.image}`}
                            alt={`${user.name}'s avatar`}
                            className="small-profile-image1"
                        />
                    )}
                </div>
            </div>
            <div className="hombucket-container">
                <div className="hombucket1" onClick={handleAcademicInvolvementClick}>Academic Involvement</div>
                <div className="hombucket2">Student Development</div>
                <div className="hombucket3">Administrative Bucket</div>
                <div className="hombucket4">Research Bucket</div>
                <div className="hombucket5">Consultancy and Corporate Training Bucket</div>
                <div className="hombucket6">Product Development Bucket</div>
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
                                        className="full-profile-image1"
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

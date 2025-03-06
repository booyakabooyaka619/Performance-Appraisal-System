import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

export default function Bucket4() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Perform actions with form data (e.g., send to a server)
        console.log('Form submitted:', formData);
    };

    return (
        <>
            <div className='bt-container'>
                <h2 style={{ backgroundColor: '#f15b4c', color: 'white' }}>Research Form</h2>
                <form onSubmit={handleSubmit} className='form-container'>
                    <div className='form-group'>
                        <label>
                            First Name:
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                            />
                        </label>
                    </div>

                    <div className='form-group'>
                        <label>
                            Last Name:
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleInputChange}
                            />
                        </label>
                    </div>

                    <div className='form-group'>
                        <label>
                            Email:
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                            />
                        </label>
                    </div>

                    <div className='form-group'>
                        <label>
                            Password:
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                            />
                        </label>
                    </div>

                    <div className='form-group'>
                        <label>
                            Confirm Password:
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                            />
                        </label>
                    </div>

                    <button type="submit" className='submit-btn'>Submit</button>
                </form>
            </div>
            <div className="y-container">
                <ul className="list-group">
                    <li className="list-group-item">First item</li>
                    <li className="list-group-item">Second item</li>
                    <li className="list-group-item">Third item</li>
                    <li className="list-group-item">Fourth item</li>
                    <li className="list-group-item">Fifth item</li>
                    <li className="list-group-item">Sixth item</li>
                    <li className="list-group-item">Seventh item</li>
                    <li className="list-group-item">Eighth item</li>
                </ul>
                <button className="logout">
                    <FontAwesomeIcon icon={faSignOutAlt} /> Logout
                </button>
            </div>
        </>
    );
}

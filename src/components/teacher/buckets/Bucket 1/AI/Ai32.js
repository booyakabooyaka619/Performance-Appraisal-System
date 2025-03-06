import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import Bucket1 from '../Bucket1';


export default function Ai32() {
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/submit-form', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            console.log('Form submitted:', data);
        } catch (err) {
            console.error('Error submitting form:', err);
        }
    };


    return (
        <>

            <Bucket1 />

            <div className='bt-container'>
                <h2 style={{ backgroundColor: '#537c78', color: 'white' }}>AI-3.2 BSA- Industrial Visit</h2>
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
                {/* <button className="logout">
                    <FontAwesomeIcon icon={faSignOutAlt} /> Logout
                </button> */}

            </div>

        </>
    );
}

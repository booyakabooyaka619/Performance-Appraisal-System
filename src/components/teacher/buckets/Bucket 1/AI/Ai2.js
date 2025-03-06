import React, { useState } from 'react';
import Bucket1 from '../Bucket1';


export default function Ai2() {
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
                <h2 style={{ backgroundColor: '#537c78', color: 'white' }}>AI-2 Courses Taught (during PA evaluation period)</h2>
                <form onSubmit={handleSubmit} className='form-container'>
                    <div className='form-group'>
                        <label className='label1'>
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
                        <label className='label1'>
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
                        <label className='label1'>
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
                        <label className='label1'>
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
                        <label className='label1'>
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

        </>
    );
}

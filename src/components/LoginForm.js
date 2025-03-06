import React, { useState } from 'react';

const LoginForm = ({ onLogin }) => {
    const [formData, setFormData] = useState({ username: '', password: '', role: 'Teacher' });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if (response.ok) {
                onLogin(data); // Call the login handler with user data
                setMessage(`Welcome, ${data.name} (${data.employeeCode})`); // Display employee code
            } else {
                setMessage(data.message || 'Login failed');
            }
        } catch (error) {
            setMessage('Error logging in');
        }
    };

    return (
        <div className="Lform-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div className="Lform-group">
                    <label className="Lform-label">Username:</label>
                    <input
                        type="text"
                        name="username"
                        className="form-control"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="Lform-group">
                    <label className="Lform-label">Password:</label>
                    <input
                        type="password"
                        name="password"
                        className="form-control"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="Lform-group">
                    <label className="Lform-label">Role:</label>
                    <div className="radio-group">
                        <label>
                            <input
                                type="radio"
                                name="role"
                                value="Teacher"
                                checked={formData.role === 'Teacher'}
                                onChange={handleChange}
                            />
                            Teacher
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="role"
                                value="RO"
                                checked={formData.role === 'RO'}
                                onChange={handleChange}
                            />
                            RO
                        </label>
                    </div>
                </div>
                <button type="submit" className="Lform-btn">Login</button>
            </form>
            {message && <p className="text-danger">{message}</p>}
        </div>
    );
};

export default LoginForm;

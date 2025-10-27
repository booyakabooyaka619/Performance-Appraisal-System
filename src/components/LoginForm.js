import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const LoginForm = ({ onLogin }) => {
    const [formData, setFormData] = useState({ username: '', password: '', role: 'Teacher' });
    const [message, setMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('user', JSON.stringify(data)); // Save full user data
                localStorage.setItem('userId', data._id); // Store userId separately
                localStorage.setItem('username', data.username); // ✅ Store username separately
                onLogin(data);
                setMessage(`Welcome, ${data.name} (${data.employeeCode})`);
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
                    <div className="input-icon-container">
                        <FontAwesomeIcon icon={faUser} className="input-icon1" />
                        <input
                            type="text"
                            name="username"
                            className="form-control"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="Lform-group">
                    <label className="Lform-label">Password:</label>
                    <div className="input-icon-container">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            className="form-control"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        <FontAwesomeIcon icon={faLock} className="input-icon1" />
                        <FontAwesomeIcon
                            icon={showPassword ? faEyeSlash : faEye}
                            className="input-icon2"
                            onClick={() => setShowPassword(!showPassword)}
                        />
                    </div>
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

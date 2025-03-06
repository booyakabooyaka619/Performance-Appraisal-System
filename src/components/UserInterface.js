// UserInterface.js
import React, { useState, useEffect } from 'react';
import LoginForm from './LoginForm';
import Home from './teacher/Home';
import FacultyTable from './teacher/FacultyTable';
import ROInterface from './ro/ROInterface';


const UserInterface = ({ onLogout }) => {
    const [user, setUser] = useState(null);

    // Check localStorage for existing user data when the component mounts
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);


    const handleLogin = (data) => {
        setUser({ ...data, showFacultyTable: true }); // Initially show FacultyTable after login
        localStorage.setItem('user', JSON.stringify({ ...data, showFacultyTable: true }));
    };


    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('user'); // Remove user data from localStorage on logout
        onLogout(); // Call the logout function passed from App
    };


    const handleProceedToForms = () => {
        setUser((prevUser) => ({ ...prevUser, showFacultyTable: false }));
        localStorage.setItem('user', JSON.stringify({ ...user, showFacultyTable: false }));
    };


    // Change the renderInterface method to conditionally render Home after FacultyTable
    const renderInterface = () => {
        if (!user) {
            return <LoginForm onLogin={handleLogin} />;
        }
        if (user.role === 'Teacher') {
            // Check if the user has gone past FacultyTable
            if (user.showFacultyTable === false) {
                return <Home user={user} onLogout={handleLogout} />;
            } else {
                return <Home user={user} onProceedToForms={handleProceedToForms} onLogout={handleLogout} />;
            }
        } else if (user.role === 'RO') {
            return <ROInterface user={user} onLogout={handleLogout} />;
        }
    };



    return <div>{renderInterface()}</div>;
};

export default UserInterface;

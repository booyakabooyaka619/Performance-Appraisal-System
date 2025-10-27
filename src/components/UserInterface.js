import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import LoginForm from './LoginForm';
import ROInterface from './ro/ROInterface';
import NewHome from './teacher/NewHome';

const UserInterface = ({ onLogout }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // ✅ New state to track authentication check
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            console.log("Logged in User Data:", parsedUser);
            console.log("Stored username in localStorage:", localStorage.getItem('username'));
        } else {
            navigate("/"); // Redirect to login if no user found
        }
        setTimeout(() => setLoading(false), 500); // ✅ Add delay to prevent flicker
    }, [navigate]);

    useEffect(() => {
        const handleUnload = (event) => {
            if (event.type === "beforeunload") {
                if (performance.navigation.type !== 1) {
                    localStorage.removeItem("user");
                    localStorage.removeItem("authToken");
                    localStorage.removeItem("username");
                }
            }
        };

        window.addEventListener("beforeunload", handleUnload);
        return () => {
            window.removeEventListener("beforeunload", handleUnload);
        };
    }, []);

    const handleLogin = (data) => {
        setUser({ ...data, showFacultyTable: true });
        localStorage.setItem('user', JSON.stringify({ ...data, showFacultyTable: true }));
        localStorage.setItem('username', data.username);
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('username');
        onLogout();
        navigate("/login");
    };

    const handleProceedToForms = () => {
        setUser((prevUser) => ({ ...prevUser, showFacultyTable: false }));
        localStorage.setItem('user', JSON.stringify({ ...user, showFacultyTable: false }));
    };

    if (loading) {
        return <div className="spinner"></div>;
        // ✅ Show a loader instead of flickering login page
    }

    const renderInterface = () => {
        if (!user) return <LoginForm onLogin={handleLogin} />;
        if (user.role === 'Teacher') {
            return user.showFacultyTable === false
                ? <NewHome user={user} onLogout={handleLogout} />
                : <NewHome user={user} onProceedToForms={handleProceedToForms} onLogout={handleLogout} />;
        }
        if (user.role === 'RO') {
            return <ROInterface user={user} onLogout={handleLogout} />;
        }
    };

    return <div>{renderInterface()}</div>;
};

export default UserInterface;

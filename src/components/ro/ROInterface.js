import React from 'react';

const ROInterface = ({ onLogout }) => {
    return (
        <div>
            <h1>Welcome, RO</h1>
            {/* Add a logout button that triggers the onLogout function */}
            <button onClick={onLogout}>Logout</button>
        </div>
    );
};

export default ROInterface;

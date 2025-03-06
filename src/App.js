// App.js
import React from 'react';
import UserInterface from './components/UserInterface'; // Import the new UserInterface component
import './components/teacher/buckets/Bucket 1/AI/ai.css';
import './components/login.css';
import './App.css';

const App = () => {
  const handleLogout = () => {
    // You can handle additional logout functionality here if needed
    console.log("User logged out");
  };

  return (
    <div>
      <UserInterface onLogout={handleLogout} /> {/* Use UserInterface component */}
    </div>
  );
};

export default App;

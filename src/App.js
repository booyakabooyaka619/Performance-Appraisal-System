import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import UserInterface from './components/UserInterface';
import NewHome from './components/teacher/NewHome';
import FacultyTable from './components/teacher/FacultyTable';
import Summary from './components/teacher/Summary';
import Guidelines from './components/teacher/Guidelines';
import Ai1 from './components/teacher/buckets/Bucket 1/AI/Ai1';
import Ai2 from './components/teacher/buckets/Bucket 1/AI/Ai2';
import Ai31 from './components/teacher/buckets/Bucket 1/AI/Ai31';
import Ai32 from './components/teacher/buckets/Bucket 1/AI/Ai32';
import Ai33 from './components/teacher/buckets/Bucket 1/AI/Ai33';
import Ai34 from './components/teacher/buckets/Bucket 1/AI/Ai34';
import Ai4 from './components/teacher/buckets/Bucket 1/AI/Ai4';
import Ai5 from './components/teacher/buckets/Bucket 1/AI/Ai5';
import Ai6 from './components/teacher/buckets/Bucket 1/AI/Ai6';
import Ai7 from './components/teacher/buckets/Bucket 1/AI/Ai7';
import Ai8 from './components/teacher/buckets/Bucket 1/AI/Ai8';
import Ai9 from './components/teacher/buckets/Bucket 1/AI/Ai9';
import Ai10 from './components/teacher/buckets/Bucket 1/AI/Ai10';
import Ai11 from './components/teacher/buckets/Bucket 1/AI/Ai11';
import Ai12 from './components/teacher/buckets/Bucket 1/AI/Ai12';
import Ai13 from './components/teacher/buckets/Bucket 1/AI/Ai13';
import Ai14 from './components/teacher/buckets/Bucket 1/AI/Ai14';
import './components/teacher/buckets/Bucket 1/AI/ai.css';
import './components/login.css';
import './App.css';
import Sd1 from './components/teacher/buckets/Bucket 2/SD/Sd1';
import Sd2 from './components/teacher/buckets/Bucket 2/SD/Sd2';
import Sd3 from './components/teacher/buckets/Bucket 2/SD/Sd3';
import Sd4 from './components/teacher/buckets/Bucket 2/SD/Sd4';
import Sd5 from './components/teacher/buckets/Bucket 2/SD/Sd5';
import Ab1 from './components/teacher/buckets/Bucket 3/AB/Ab1'
import Ab2 from './components/teacher/buckets/Bucket 3/AB/Ab2'
import Ab3 from './components/teacher/buckets/Bucket 3/AB/Ab3'
import Ab4 from './components/teacher/buckets/Bucket 3/AB/Ab4'
import Ab5 from './components/teacher/buckets/Bucket 3/AB/Ab5'
import Ab6 from './components/teacher/buckets/Bucket 3/AB/Ab6'
import Ab7 from './components/teacher/buckets/Bucket 3/AB/Ab7'
import Ab8 from './components/teacher/buckets/Bucket 3/AB/Ab8'
import Ab9 from './components/teacher/buckets/Bucket 3/AB/Ab9'
import Rb1 from './components/teacher/buckets/Bucket 4/RB/Rb1'
import Rb2 from './components/teacher/buckets/Bucket 4/RB/Rb2'
import Rb3 from './components/teacher/buckets/Bucket 4/RB/Rb3'
import Rb4 from './components/teacher/buckets/Bucket 4/RB/Rb4'
import Rb5 from './components/teacher/buckets/Bucket 4/RB/Rb5'
import Rb6 from './components/teacher/buckets/Bucket 4/RB/Rb6'
import Rb7 from './components/teacher/buckets/Bucket 4/RB/Rb7'
import Rb8 from './components/teacher/buckets/Bucket 4/RB/Rb8'
import Rb9 from './components/teacher/buckets/Bucket 4/RB/Rb9'
import Rb10 from './components/teacher/buckets/Bucket 4/RB/Rb10'
import Rb11 from './components/teacher/buckets/Bucket 4/RB/Rb11'
import Rb12 from './components/teacher/buckets/Bucket 4/RB/Rb12'
import Cb1 from './components/teacher/buckets/Bucket 5/CB/Cb1'
import Cb2 from './components/teacher/buckets/Bucket 5/CB/Cb2'
import Cb3 from './components/teacher/buckets/Bucket 5/CB/Cb3'
import Pdb1 from './components/teacher/buckets/Bucket 6/PDB/Pdb1';
import Pdb2 from './components/teacher/buckets/Bucket 6/PDB/Pdb2';
import ProfHome from './components/ro/ProfHome';
import ROGuidelines from './components/ro/ROGuidelines';
import ROAI1 from './components/ro/ROBuckets/ROBucket1/ROAI/ROAI1';
import ROAI2 from './components/ro/ROBuckets/ROBucket1/ROAI/ROAI2';
import ROAI31 from './components/ro/ROBuckets/ROBucket1/ROAI/ROAI31';
import ROAI32 from './components/ro/ROBuckets/ROBucket1/ROAI/ROAI32';
import ROAI33 from './components/ro/ROBuckets/ROBucket1/ROAI/ROAI33';
import ROAI34 from './components/ro/ROBuckets/ROBucket1/ROAI/ROAI34';
import ROAI4 from './components/ro/ROBuckets/ROBucket1/ROAI/ROAI4';
import ROAI5 from './components/ro/ROBuckets/ROBucket1/ROAI/ROAI5';
import ROAI6 from './components/ro/ROBuckets/ROBucket1/ROAI/ROAI6';
import ROAI7 from './components/ro/ROBuckets/ROBucket1/ROAI/ROAI7';
import ROAI8 from './components/ro/ROBuckets/ROBucket1/ROAI/ROAI8';
import ROAI9 from './components/ro/ROBuckets/ROBucket1/ROAI/ROAI9';
import ROAI10 from './components/ro/ROBuckets/ROBucket1/ROAI/ROAI10';
import ROAI11 from './components/ro/ROBuckets/ROBucket1/ROAI/ROAI11';
import ROAI12 from './components/ro/ROBuckets/ROBucket1/ROAI/ROAI12';
import ROAI13 from './components/ro/ROBuckets/ROBucket1/ROAI/ROAI13';
import ROAI14 from './components/ro/ROBuckets/ROBucket1/ROAI/ROAI14';
import Notifications from './components/ro/Notifications'
import TeacherNotifications from './components/teacher/TeacherNotifications';
import SummaryTable from './components/ro/SummaryTable';
import ROSD1 from './components/ro/ROBuckets/ROBucket2/ROSD/ROSD1';
import ROSD2 from './components/ro/ROBuckets/ROBucket2/ROSD/ROSD2';
import ROSD3 from './components/ro/ROBuckets/ROBucket2/ROSD/ROSD3';
import ROSD4 from './components/ro/ROBuckets/ROBucket2/ROSD/ROSD4';
import ROSD5 from './components/ro/ROBuckets/ROBucket2/ROSD/ROSD5';
import ROAB1 from './components/ro/ROBuckets/ROBucket3/ROAB/ROAB1';
import ROAB2 from './components/ro/ROBuckets/ROBucket3/ROAB/ROAB2';
import ROAB3 from './components/ro/ROBuckets/ROBucket3/ROAB/ROAB3';
import ROAB4 from './components/ro/ROBuckets/ROBucket3/ROAB/ROAB4';
import ROAB5 from './components/ro/ROBuckets/ROBucket3/ROAB/ROAB5';
import ROAB6 from './components/ro/ROBuckets/ROBucket3/ROAB/ROAB6';
import ROAB7 from './components/ro/ROBuckets/ROBucket3/ROAB/ROAB7';
import ROAB8 from './components/ro/ROBuckets/ROBucket3/ROAB/ROAB8';
import ROAB9 from './components/ro/ROBuckets/ROBucket3/ROAB/ROAB9';
import RORB1 from './components/ro/ROBuckets/ROBucket4/RORB/RORB1';
import RORB2 from './components/ro/ROBuckets/ROBucket4/RORB/RORB2';
import RORB3 from './components/ro/ROBuckets/ROBucket4/RORB/RORB3';
import RORB4 from './components/ro/ROBuckets/ROBucket4/RORB/RORB4';
import RORB5 from './components/ro/ROBuckets/ROBucket4/RORB/RORB5';
import RORB6 from './components/ro/ROBuckets/ROBucket4/RORB/RORB6';
import RORB7 from './components/ro/ROBuckets/ROBucket4/RORB/RORB7';
import RORB8 from './components/ro/ROBuckets/ROBucket4/RORB/RORB8';
import RORB9 from './components/ro/ROBuckets/ROBucket4/RORB/RORB9';
import RORB10 from './components/ro/ROBuckets/ROBucket4/RORB/RORB10';
import RORB11 from './components/ro/ROBuckets/ROBucket4/RORB/RORB11';
import RORB12 from './components/ro/ROBuckets/ROBucket4/RORB/RORB12';
import ROCB1 from './components/ro/ROBuckets/ROBucket5/ROCB/ROCB1';
import ROCB2 from './components/ro/ROBuckets/ROBucket5/ROCB/ROCB2';
import ROCB3 from './components/ro/ROBuckets/ROBucket5/ROCB/ROCB3';
import ROPDB1 from './components/ro/ROBuckets/ROBucket6/ROPDB/ROPDB1';
import ROPDB2 from './components/ro/ROBuckets/ROBucket6/ROPDB/ROPDB2';
import Visualizations from './components/teacher/Visualizations'; // adjust the path as needed


const App = () => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });


  // Load user from localStorage on page load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
    localStorage.setItem('user', JSON.stringify(loggedInUser)); // Save user in local storage
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <Routes>
      <Route path="/" element={<UserInterface onLogin={handleLogin} />} />
      <Route path="/newhome" element={<NewHome user={user} onLogout={handleLogout} />} />
      <Route path="/home" element={<NewHome user={user} onLogout={handleLogout} />} />
      <Route path="/faculty-table" element={<FacultyTable user={user} onLogout={handleLogout} />} />
      <Route path="/summary" element={<Summary user={user} onLogout={handleLogout} />} />
      <Route path="/guidelines" element={<Guidelines user={user} onLogout={handleLogout} />} />
      <Route path="/AI/Ai1" element={<Ai1 user={user} onLogout={handleLogout} />} />
      <Route path="/AI/Ai2" element={<Ai2 user={user} onLogout={handleLogout} />} />
      <Route path="/AI/Ai31" element={<Ai31 user={user} onLogout={handleLogout} />} />
      <Route path="/AI/Ai32" element={<Ai32 user={user} onLogout={handleLogout} />} />
      <Route path="/AI/Ai33" element={<Ai33 user={user} onLogout={handleLogout} />} />
      <Route path="/AI/Ai34" element={<Ai34 user={user} onLogout={handleLogout} />} />
      <Route path="/AI/Ai4" element={<Ai4 user={user} onLogout={handleLogout} />} />
      <Route path="/AI/Ai5" element={<Ai5 user={user} onLogout={handleLogout} />} />
      <Route path="/AI/Ai6" element={<Ai6 user={user} onLogout={handleLogout} />} />
      <Route path="/AI/Ai7" element={<Ai7 user={user} onLogout={handleLogout} />} />
      <Route path="/AI/Ai8" element={<Ai8 user={user} onLogout={handleLogout} />} />
      <Route path="/AI/Ai9" element={<Ai9 user={user} onLogout={handleLogout} />} />
      <Route path="/AI/Ai10" element={<Ai10 user={user} onLogout={handleLogout} />} />
      <Route path="/AI/Ai11" element={<Ai11 user={user} onLogout={handleLogout} />} />
      <Route path="/AI/Ai12" element={<Ai12 user={user} onLogout={handleLogout} />} />
      <Route path="/AI/Ai13" element={<Ai13 user={user} onLogout={handleLogout} />} />
      <Route path="/AI/Ai14" element={<Ai14 user={user} onLogout={handleLogout} />} />
      <Route path="/SD/Sd1" element={<Sd1 user={user} onLogout={handleLogout} />} />
      <Route path="/SD/Sd2" element={<Sd2 user={user} onLogout={handleLogout} />} />
      <Route path="/SD/Sd3" element={<Sd3 user={user} onLogout={handleLogout} />} />
      <Route path="/SD/Sd4" element={<Sd4 user={user} onLogout={handleLogout} />} />
      <Route path="/SD/Sd5" element={<Sd5 user={user} onLogout={handleLogout} />} />
      <Route path="/AB/Ab1" element={<Ab1 user={user} onLogout={handleLogout} />} />
      <Route path="/AB/Ab2" element={<Ab2 user={user} onLogout={handleLogout} />} />
      <Route path="/AB/Ab3" element={<Ab3 user={user} onLogout={handleLogout} />} />
      <Route path="/AB/Ab4" element={<Ab4 user={user} onLogout={handleLogout} />} />
      <Route path="/AB/Ab5" element={<Ab5 user={user} onLogout={handleLogout} />} />
      <Route path="/AB/Ab6" element={<Ab6 user={user} onLogout={handleLogout} />} />
      <Route path="/AB/Ab7" element={<Ab7 user={user} onLogout={handleLogout} />} />
      <Route path="/AB/Ab8" element={<Ab8 user={user} onLogout={handleLogout} />} />
      <Route path="/AB/Ab9" element={<Ab9 user={user} onLogout={handleLogout} />} />
      <Route path="/RB/Rb1" element={<Rb1 user={user} onLogout={handleLogout} />} />
      <Route path="/RB/Rb2" element={<Rb2 user={user} onLogout={handleLogout} />} />
      <Route path="/RB/Rb3" element={<Rb3 user={user} onLogout={handleLogout} />} />
      <Route path="/RB/Rb4" element={<Rb4 user={user} onLogout={handleLogout} />} />
      <Route path="/RB/Rb5" element={<Rb5 user={user} onLogout={handleLogout} />} />
      <Route path="/RB/Rb6" element={<Rb6 user={user} onLogout={handleLogout} />} />
      <Route path="/RB/Rb7" element={<Rb7 user={user} onLogout={handleLogout} />} />
      <Route path="/RB/Rb8" element={<Rb8 user={user} onLogout={handleLogout} />} />
      <Route path="/RB/Rb9" element={<Rb9 user={user} onLogout={handleLogout} />} />
      <Route path="/RB/Rb10" element={<Rb10 user={user} onLogout={handleLogout} />} />
      <Route path="/RB/Rb11" element={<Rb11 user={user} onLogout={handleLogout} />} />
      <Route path="/RB/Rb12" element={<Rb12 user={user} onLogout={handleLogout} />} />
      <Route path="/CB/Cb1" element={<Cb1 user={user} onLogout={handleLogout} />} />
      <Route path="/CB/Cb2" element={<Cb2 user={user} onLogout={handleLogout} />} />
      <Route path="/CB/Cb3" element={<Cb3 user={user} onLogout={handleLogout} />} />
      <Route path="/PDB/Pdb1" element={<Pdb1 user={user} onLogout={handleLogout} />} />
      <Route path="/PDB/Pdb2" element={<Pdb2 user={user} onLogout={handleLogout} />} />
      <Route path="/professorhome" element={<ProfHome user={user} onLogout={handleLogout} />} />
      <Route path="/ROguidelines" element={<ROGuidelines user={user} onLogout={handleLogout} />} />
      <Route path="/ROAI1" element={<ROAI1 user={user} onLogout={handleLogout} />} />
      <Route path="/ROAI2" element={<ROAI2 user={user} onLogout={handleLogout} />} />
      <Route path="/ROAI31" element={<ROAI31 user={user} onLogout={handleLogout} />} />
      <Route path="/ROAI32" element={<ROAI32 user={user} onLogout={handleLogout} />} />
      <Route path="/ROAI33" element={<ROAI33 user={user} onLogout={handleLogout} />} />
      <Route path="/ROAI34" element={<ROAI34 user={user} onLogout={handleLogout} />} />
      <Route path="/ROAI4" element={<ROAI4 user={user} onLogout={handleLogout} />} />
      <Route path="/ROAI5" element={<ROAI5 user={user} onLogout={handleLogout} />} />
      <Route path="/ROAI6" element={<ROAI6 user={user} onLogout={handleLogout} />} />
      <Route path="/ROAI7" element={<ROAI7 user={user} onLogout={handleLogout} />} />
      <Route path="/ROAI8" element={<ROAI8 user={user} onLogout={handleLogout} />} />
      <Route path="/ROAI9" element={<ROAI9 user={user} onLogout={handleLogout} />} />
      <Route path="/ROAI10" element={<ROAI10 user={user} onLogout={handleLogout} />} />
      <Route path="/ROAI11" element={<ROAI11 user={user} onLogout={handleLogout} />} />
      <Route path="/ROAI12" element={<ROAI12 user={user} onLogout={handleLogout} />} />
      <Route path="/ROAI13" element={<ROAI13 user={user} onLogout={handleLogout} />} />
      <Route path="/ROAI14" element={<ROAI14 user={user} onLogout={handleLogout} />} />
      <Route path="/ROnotifications" element={<Notifications user={user} onLogout={handleLogout} />} />
      <Route path="/teachernotifications" element={<TeacherNotifications user={user} onLogout={handleLogout} />} />
      <Route path="/summarytable" element={<SummaryTable user={user} onLogout={handleLogout} />} />
      <Route path="/ROSD1" element={<ROSD1 user={user} onLogout={handleLogout} />} />
      <Route path="/ROSD2" element={<ROSD2 user={user} onLogout={handleLogout} />} />
      <Route path="/ROSD3" element={<ROSD3 user={user} onLogout={handleLogout} />} />
      <Route path="/ROSD4" element={<ROSD4 user={user} onLogout={handleLogout} />} />
      <Route path="/ROSD5" element={<ROSD5 user={user} onLogout={handleLogout} />} />
      <Route path="/ROAB1" element={<ROAB1 user={user} onLogout={handleLogout} />} />
      <Route path="/ROAB2" element={<ROAB2 user={user} onLogout={handleLogout} />} />
      <Route path="/ROAB3" element={<ROAB3 user={user} onLogout={handleLogout} />} />
      <Route path="/ROAB4" element={<ROAB4 user={user} onLogout={handleLogout} />} />
      <Route path="/ROAB5" element={<ROAB5 user={user} onLogout={handleLogout} />} />
      <Route path="/ROAB6" element={<ROAB6 user={user} onLogout={handleLogout} />} />
      <Route path="/ROAB7" element={<ROAB7 user={user} onLogout={handleLogout} />} />
      <Route path="/ROAB8" element={<ROAB8 user={user} onLogout={handleLogout} />} />
      <Route path="/ROAB9" element={<ROAB9 user={user} onLogout={handleLogout} />} />
      <Route path="/RORB1" element={<RORB1 user={user} onLogout={handleLogout} />} />
      <Route path="/RORB2" element={<RORB2 user={user} onLogout={handleLogout} />} />
      <Route path="/RORB3" element={<RORB3 user={user} onLogout={handleLogout} />} />
      <Route path="/RORB4" element={<RORB4 user={user} onLogout={handleLogout} />} />
      <Route path="/RORB5" element={<RORB5 user={user} onLogout={handleLogout} />} />
      <Route path="/RORB6" element={<RORB6 user={user} onLogout={handleLogout} />} />
      <Route path="/RORB7" element={<RORB7 user={user} onLogout={handleLogout} />} />
      <Route path="/RORB8" element={<RORB8 user={user} onLogout={handleLogout} />} />
      <Route path="/RORB9" element={<RORB9 user={user} onLogout={handleLogout} />} />
      <Route path="/RORB10" element={<RORB10 user={user} onLogout={handleLogout} />} />
      <Route path="/RORB11" element={<RORB11 user={user} onLogout={handleLogout} />} />
      <Route path="/RORB12" element={<RORB12 user={user} onLogout={handleLogout} />} />
      <Route path="/ROCB1" element={<ROCB1 user={user} onLogout={handleLogout} />} />
      <Route path="/ROCB2" element={<ROCB2 user={user} onLogout={handleLogout} />} />
      <Route path="/ROCB3" element={<ROCB3 user={user} onLogout={handleLogout} />} />
      <Route path="/ROPDB1" element={<ROPDB1 user={user} onLogout={handleLogout} />} />
      <Route path="/ROPDB2" element={<ROPDB2 user={user} onLogout={handleLogout} />} />
      <Route path="/visualizations" element={<Visualizations />} />


    </Routes>
  );
};

export default App;

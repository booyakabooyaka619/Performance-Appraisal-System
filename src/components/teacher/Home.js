import React from 'react';
import Bucket1 from './buckets/Bucket 1/Bucket1';
import Bucket2 from './buckets/Bucket 2/Bucket2';
import Bucket3 from './buckets/Bucket 3/Bucket3';
import Bucket4 from './buckets/Bucket 4/Bucket4';
import Bucket5 from './buckets/Bucket 5/Bucket5';
import Bucket6 from './buckets/Bucket 6/Bucket6';
import Ai1 from './buckets/Bucket 1/AI/Ai1';
import Navbar from './Navbar';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Ai2 from './buckets/Bucket 1/AI/Ai2';
import Ai4 from './buckets/Bucket 1/AI/Ai4';
import Ai5 from './buckets/Bucket 1/AI/Ai5';
import Ai6 from './buckets/Bucket 1/AI/Ai6';
import Ai7 from './buckets/Bucket 1/AI/Ai7';
import Ai8 from './buckets/Bucket 1/AI/Ai8';
import Ai9 from './buckets/Bucket 1/AI/Ai9';
import Ai10 from './buckets/Bucket 1/AI/Ai10';
import Ai11 from './buckets/Bucket 1/AI/Ai11';
import Ai12 from './buckets/Bucket 1/AI/Ai12';
import Ai13 from './buckets/Bucket 1/AI/Ai13';
import Ai14 from './buckets/Bucket 1/AI/Ai14';
import Ai31 from './buckets/Bucket 1/AI/Ai31';
import Ai32 from './buckets/Bucket 1/AI/Ai32';
import Ai33 from './buckets/Bucket 1/AI/Ai33';
import Ai34 from './buckets/Bucket 1/AI/Ai34';

export default function Home({ user, onLogout }) { // Accept user as a prop
    return (
        <div>
            <Navbar user={user} onLogout={onLogout} /> {/* Pass user and onLogout */}
            <Routes>
                <Route path="/buckets/Bucket 1/Bucket1" element={<Bucket1 />} />
                <Route path="/buckets/Bucket 1/AI/Ai1" element={<Ai1 />} />
                <Route path="/buckets/Bucket 1/AI/Ai2" element={<Ai2 />} />
                <Route path="/buckets/Bucket 1/AI/Ai31" element={<Ai31 />} />
                <Route path="/buckets/Bucket 1/AI/Ai32" element={<Ai32 />} />
                <Route path="/buckets/Bucket 1/AI/Ai33" element={<Ai33 />} />
                <Route path="/buckets/Bucket 1/AI/Ai34" element={<Ai34 />} />
                <Route path="/buckets/Bucket 1/AI/Ai4" element={<Ai4 />} />
                <Route path="/buckets/Bucket 1/AI/Ai5" element={<Ai5 />} />
                <Route path="/buckets/Bucket 1/AI/Ai6" element={<Ai6 />} />
                <Route path="/buckets/Bucket 1/AI/Ai7" element={<Ai7 />} />
                <Route path="/buckets/Bucket 1/AI/Ai8" element={<Ai8 />} />
                <Route path="/buckets/Bucket 1/AI/Ai9" element={<Ai9 />} />
                <Route path="/buckets/Bucket 1/AI/Ai10" element={<Ai10 />} />
                <Route path="/buckets/Bucket 1/AI/Ai11" element={<Ai11 />} />
                <Route path="/buckets/Bucket 1/AI/Ai12" element={<Ai12 />} />
                <Route path="/buckets/Bucket 1/AI/Ai13" element={<Ai13 />} />
                <Route path="/buckets/Bucket 1/AI/Ai14" element={<Ai14 />} />
                <Route path="/buckets/Bucket 2/Bucket2" element={<Bucket2 />} />
                <Route path="/buckets/Bucket 3/Bucket3" element={<Bucket3 />} />
                <Route path="/buckets/Bucket 4/Bucket4" element={<Bucket4 />} />
                <Route path="/buckets/Bucket 5/Bucket5" element={<Bucket5 />} />
                <Route path="/buckets/Bucket 6/Bucket6" element={<Bucket6 />} />
            </Routes>
        </div>
    );
}

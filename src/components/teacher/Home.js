import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Bucket1 from './buckets/Bucket 1/Bucket1';
import Ai1 from './buckets/Bucket 1/AI/Ai1';
import Bucket2 from './buckets/Bucket 2/Bucket2';
import Bucket3 from './buckets/Bucket 3/Bucket3';
import Bucket4 from './buckets/Bucket 4/Bucket4';
import Bucket5 from './buckets/Bucket 5/Bucket5';
import Bucket6 from './buckets/Bucket 6/Bucket6';

export default function Home({ user, onLogout }) {
    const location = useLocation();

    return (
        <div>
            <Navbar user={user} onLogout={onLogout} />

            {/* If user lands on /home/bucket1/ai1, show Bucket1 and Ai1 together */}
            {location.pathname === "/home/bucket1/ai1" && (
                <div style={{ display: "flex" }}>
                    <Bucket1 />
                    <Ai1 />
                </div>
            )}

            <Routes>
                <Route path="/buckets/Bucket 1/Bucket1" element={<Bucket1 />} />
                <Route path="/buckets/Bucket 1/AI/Ai1" element={<Ai1 />} />
                <Route path="/buckets/Bucket 2/Bucket2" element={<Bucket2 />} />
                <Route path="/buckets/Bucket 3/Bucket3" element={<Bucket3 />} />
                <Route path="/buckets/Bucket 4/Bucket4" element={<Bucket4 />} />
                <Route path="/buckets/Bucket 5/Bucket5" element={<Bucket5 />} />
                <Route path="/buckets/Bucket 6/Bucket6" element={<Bucket6 />} />
            </Routes>
        </div>
    );
}

import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ROBucketNavbar from '../ROBucketNavbar';

export default function ROBucket1() {
    const location = useLocation();
    const navigate = useNavigate();

    // Extract the active path from the current location
    const [activeButton, setActiveButton] = useState(location.pathname);

    const handleButtonClick = (path) => {
        setActiveButton(path);
        navigate(path, { replace: true });
        // window.location.reload(); 
    };


    return (
        <div>
            <ROBucketNavbar />
            <div className="y-container">
                <ul className="list-group">
                    <button
                        className={`butt ${activeButton === "/ROPDB1" ? "active" : ""}`}
                        onClick={() => handleButtonClick("/ROPDB1")}
                    >
                        PDB 1
                    </button>
                    <button
                        className={`butt ${activeButton === "/ROPDB2" ? "active" : ""}`}
                        onClick={() => handleButtonClick("/ROPDB2")}
                    >
                        PDB 2
                    </button>
                </ul>
            </div>

        </div>
    );
}

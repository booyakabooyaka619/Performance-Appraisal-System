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
                        className={`butt ${activeButton === "/ROCB1" ? "active" : ""}`}
                        onClick={() => handleButtonClick("/ROCB1")}
                    >
                        CB 1
                    </button>
                    <button
                        className={`butt ${activeButton === "/ROCB2" ? "active" : ""}`}
                        onClick={() => handleButtonClick("/ROCB2")}
                    >
                        CB 2
                    </button>
                    <button
                        className={`butt ${activeButton === "/ROCB3" ? "active" : ""}`}
                        onClick={() => handleButtonClick("/ROCB3")}
                    >
                        CB 3
                    </button>
                </ul>
            </div>

        </div>
    );
}

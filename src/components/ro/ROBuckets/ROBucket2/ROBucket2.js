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
                        className={`butt ${activeButton === "/ROSD1" ? "active" : ""}`}
                        onClick={() => handleButtonClick("/ROSD1")}
                    >
                        SD 1
                    </button>
                    <button
                        className={`butt ${activeButton === "/ROSD2" ? "active" : ""}`}
                        onClick={() => handleButtonClick("/ROSD2")}
                    >
                        SD 2
                    </button>
                    <button
                        className={`butt ${activeButton === "/ROSD3" ? "active" : ""}`}
                        onClick={() => handleButtonClick("/ROSD3")}
                    >
                        SD 3
                    </button>
                    <button
                        className={`butt ${activeButton === "/ROSD4" ? "active" : ""}`}
                        onClick={() => handleButtonClick("/ROSD4")}
                    >
                        SD 4
                    </button>
                    <button
                        className={`butt ${activeButton === "/ROSD5" ? "active" : ""}`}
                        onClick={() => handleButtonClick("/ROSD5")}
                    >
                        SD 5
                    </button>
                </ul>
            </div>

        </div>
    );
}

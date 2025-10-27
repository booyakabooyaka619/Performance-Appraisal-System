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
                        className={`butt ${activeButton === "/ROAB1" ? "active" : ""}`}
                        onClick={() => handleButtonClick("/ROAB1")}
                    >
                        AB 1
                    </button>
                    <button
                        className={`butt ${activeButton === "/ROAB2" ? "active" : ""}`}
                        onClick={() => handleButtonClick("/ROAB2")}
                    >
                        AB 2
                    </button>
                    <button
                        className={`butt ${activeButton === "/ROAB3" ? "active" : ""}`}
                        onClick={() => handleButtonClick("/ROAB3")}
                    >
                        AB 3
                    </button>
                    <button
                        className={`butt ${activeButton === "/ROAB4" ? "active" : ""}`}
                        onClick={() => handleButtonClick("/ROAB4")}
                    >
                        AB 4
                    </button>
                    <button
                        className={`butt ${activeButton === "/ROAB5" ? "active" : ""}`}
                        onClick={() => handleButtonClick("/ROAB5")}
                    >
                        AB 5
                    </button>
                    <button
                        className={`butt ${activeButton === "/ROAB6" ? "active" : ""}`}
                        onClick={() => handleButtonClick("/ROAB6")}
                    >
                        AB 6
                    </button>
                    <button
                        className={`butt ${activeButton === "/ROAB7" ? "active" : ""}`}
                        onClick={() => handleButtonClick("/ROAB7")}
                    >
                        AB 7
                    </button>
                    <button
                        className={`butt ${activeButton === "/ROAB8" ? "active" : ""}`}
                        onClick={() => handleButtonClick("/ROAB8")}
                    >
                        AB 8
                    </button>
                    <button
                        className={`butt ${activeButton === "/ROAB9" ? "active" : ""}`}
                        onClick={() => handleButtonClick("/ROAB9")}
                    >
                        AB 9
                    </button>
                </ul>
            </div>

        </div>
    );
}

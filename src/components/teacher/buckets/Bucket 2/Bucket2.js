import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../../Navbar';

export default function Bucket2() {
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
            <Navbar />
            <div className="y-container">
                <ul className="list-group">
                    <button
                        className={`butt ${activeButton === "/SD/SD1" ? "active" : ""}`}
                        onClick={() => handleButtonClick("/SD/SD1")}
                    >
                        SD 1
                    </button>
                    <button
                        className={`butt ${activeButton === "/SD/SD2" ? "active" : ""}`}
                        onClick={() => handleButtonClick("/SD/SD2")}
                    >
                        SD 2
                    </button>
                    <button
                        className={`butt ${activeButton === "/SD/SD3" ? "active" : ""}`}
                        onClick={() => handleButtonClick("/SD/SD3")}
                    >
                        SD 3
                    </button>

                    <button
                        className={`butt ${activeButton === "/SD/SD4" ? "active" : ""}`}
                        onClick={() => handleButtonClick("/SD/SD4")}
                    >
                        SD 4
                    </button>
                    <button
                        className={`butt ${activeButton === "/SD/SD5" ? "active" : ""}`}
                        onClick={() => handleButtonClick("/SD/SD5")}
                    >
                        SD 5
                    </button>

                </ul>
            </div>
        </div>
    );
}

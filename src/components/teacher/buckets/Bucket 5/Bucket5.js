import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../../Navbar';

export default function Bucket5() {
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
                        className={`butt ${activeButton === "/CB/CB1" ? "active" : ""}`}
                        onClick={() => handleButtonClick("/CB/CB1")}
                    >
                        CB 1
                    </button>
                    <button
                        className={`butt ${activeButton === "/CB/CB2" ? "active" : ""}`}
                        onClick={() => handleButtonClick("/CB/CB2")}
                    >
                        CB 2
                    </button>
                    <button
                        className={`butt ${activeButton === "/CB/CB3" ? "active" : ""}`}
                        onClick={() => handleButtonClick("/CB/CB3")}
                    >
                        CB 3
                    </button>

                </ul>
            </div>
        </div>
    );
}

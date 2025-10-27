import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../../Navbar';

export default function Bucket4() {
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
                        className={`butt ${activeButton === "/RB/RB1" ? "active" : ""}`}
                        onClick={() => handleButtonClick("/RB/RB1")}
                    >
                        RB 1
                    </button>
                    <button
                        className={`butt ${activeButton === "/RB/RB2" ? "active" : ""}`}
                        onClick={() => handleButtonClick("/RB/RB2")}
                    >
                        RB 2
                    </button>
                    <button
                        className={`butt ${activeButton === "/RB/RB3" ? "active" : ""}`}
                        onClick={() => handleButtonClick("/RB/RB3")}
                    >
                        RB 3
                    </button>
                    <button
                        className={`butt ${activeButton === "/RB/RB4" ? "active" : ""}`}
                        onClick={() => handleButtonClick("/RB/RB4")}
                    >
                        RB 4
                    </button>
                    <button
                        className={`butt ${activeButton === "/RB/RB5" ? "active" : ""}`}
                        onClick={() => handleButtonClick("/RB/RB5")}
                    >
                        RB 5
                    </button>
                    <button
                        className={`butt ${activeButton === "/RB/RB6" ? "active" : ""}`}
                        onClick={() => handleButtonClick("/RB/RB6")}
                    >
                        RB 6
                    </button>
                    <button
                        className={`butt ${activeButton === "/RB/RB7" ? "active" : ""}`}
                        onClick={() => handleButtonClick("/RB/RB7")}
                    >
                        RB 7
                    </button>
                    <button
                        className={`butt ${activeButton === "/RB/RB8" ? "active" : ""}`}
                        onClick={() => handleButtonClick("/RB/RB8")}
                    >
                        RB 8
                    </button>
                    <button
                        className={`butt ${activeButton === "/RB/RB9" ? "active" : ""}`}
                        onClick={() => handleButtonClick("/RB/RB9")}
                    >
                        RB 9
                    </button>
                    <button
                        className={`butt ${activeButton === "/RB/RB10" ? "active" : ""}`}
                        onClick={() => handleButtonClick("/RB/RB10")}
                    >
                        RB 10
                    </button>
                    <button
                        className={`butt ${activeButton === "/RB/RB11" ? "active" : ""}`}
                        onClick={() => handleButtonClick("/RB/RB11")}
                    >
                        RB 11
                    </button>
                    <button
                        className={`butt ${activeButton === "/RB/RB12" ? "active" : ""}`}
                        onClick={() => handleButtonClick("/RB/RB12")}
                    >
                        RB 12
                    </button>
                </ul>
            </div>
        </div>
    );
}

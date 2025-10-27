import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../../Navbar';

export default function Bucket3() {
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
                        className={`butt ${activeButton === "/AB/AB1" ? "active" : ""}`}
                        onClick={() => handleButtonClick("/AB/AB1")}
                    >
                        AB 1
                    </button>
                    <button
                        className={`butt ${activeButton === "/AB/AB2" ? "active" : ""}`}
                        onClick={() => handleButtonClick("/AB/AB2")}
                    >
                        AB 2
                    </button>
                    <button
                        className={`butt ${activeButton === "/AB/AB3" ? "active" : ""}`}
                        onClick={() => handleButtonClick("/AB/AB3")}
                    >
                        AB 3
                    </button>
                    <button
                        className={`butt ${activeButton === "/AB/AB4" ? "active" : ""}`}
                        onClick={() => handleButtonClick("/AB/AB4")}
                    >
                        AB 4
                    </button>
                    <button
                        className={`butt ${activeButton === "/AB/AB5" ? "active" : ""}`}
                        onClick={() => handleButtonClick("/AB/AB5")}
                    >
                        AB 5
                    </button>
                    <button
                        className={`butt ${activeButton === "/AB/AB6" ? "active" : ""}`}
                        onClick={() => handleButtonClick("/AB/AB6")}
                    >
                        AB 6
                    </button>
                    <button
                        className={`butt ${activeButton === "/AB/AB7" ? "active" : ""}`}
                        onClick={() => handleButtonClick("/AB/AB7")}
                    >
                        AB 7
                    </button>
                    <button
                        className={`butt ${activeButton === "/AB/AB8" ? "active" : ""}`}
                        onClick={() => handleButtonClick("/AB/AB8")}
                    >
                        AB 8
                    </button>
                    <button
                        className={`butt ${activeButton === "/AB/AB9" ? "active" : ""}`}
                        onClick={() => handleButtonClick("/AB/AB9")}
                    >
                        AB 9
                    </button>
                </ul>
            </div>
        </div>
    );
}

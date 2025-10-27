import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../../Navbar';

export default function Bucket1() {
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
                        className={`butt ${activeButton === "/AI/AI1" ? "active" : ""}`}
                        onClick={() => handleButtonClick("/AI/AI1")}
                    >
                        AI 1
                    </button>
                    <button
                        className={`butt ${activeButton === "/AI/AI2" ? "active" : ""}`}
                        onClick={() => handleButtonClick("/AI/AI2")}
                    >
                        AI 2
                    </button>
                    <button
                        className={`butt ${activeButton === "/AI/AI31" ? "active" : ""}`}
                        onClick={() => handleButtonClick("/AI/AI31")}
                    >
                        AI 3.1
                    </button>
                    <button
                        className={`butt ${activeButton === "/AI/AI32" ? "active" : ""}`}
                        onClick={() => handleButtonClick("/AI/AI32")}
                    >
                        AI 3.2
                    </button>
                    <button
                        className={`butt ${activeButton === "/AI/AI33" ? "active" : ""}`}
                        onClick={() => handleButtonClick("/AI/AI33")}
                    >
                        AI 3.3
                    </button>
                    <button
                        className={`butt ${activeButton === "/AI/AI34" ? "active" : ""}`}
                        onClick={() => handleButtonClick("/AI/AI34")}
                    >
                        AI 3.4
                    </button>
                    <button
                        className={`butt ${activeButton === "/AI/AI4" ? "active" : ""}`}
                        onClick={() => handleButtonClick("/AI/AI4")}
                    >
                        AI 4
                    </button>
                    <button
                        className={`butt ${activeButton === "/AI/AI5" ? "active" : ""}`}
                        onClick={() => handleButtonClick("/AI/AI5")}
                    >
                        AI 5
                    </button>
                    <button
                        className={`butt ${activeButton === "/AI/AI6" ? "active" : ""}`}
                        onClick={() => handleButtonClick("/AI/AI6")}
                    >
                        AI 6
                    </button>
                    <button
                        className={`butt ${activeButton === "/AI/AI7" ? "active" : ""}`}
                        onClick={() => handleButtonClick("/AI/AI7")}
                    >
                        AI 7
                    </button>
                    <button
                        className={`butt ${activeButton === "/AI/AI8" ? "active" : ""}`}
                        onClick={() => handleButtonClick("/AI/AI8")}
                    >
                        AI 8
                    </button>
                    <button
                        className={`butt ${activeButton === "/AI/AI9" ? "active" : ""}`}
                        onClick={() => handleButtonClick("/AI/AI9")}
                    >
                        AI 9
                    </button>
                    <button
                        className={`butt ${activeButton === "/AI/AI10" ? "active" : ""}`}
                        onClick={() => handleButtonClick("/AI/AI10")}
                    >
                        AI 10
                    </button>
                    <button
                        className={`butt ${activeButton === "/AI/AI11" ? "active" : ""}`}
                        onClick={() => handleButtonClick("/AI/AI11")}
                    >
                        AI 11
                    </button>
                    <button
                        className={`butt ${activeButton === "/AI/AI12" ? "active" : ""}`}
                        onClick={() => handleButtonClick("/AI/AI12")}
                    >
                        AI 12
                    </button>
                    <button
                        className={`butt ${activeButton === "/AI/AI13" ? "active" : ""}`}
                        onClick={() => handleButtonClick("/AI/AI13")}
                    >
                        AI 13
                    </button>
                    <button
                        className={`butt ${activeButton === "/AI/AI14" ? "active" : ""}`}
                        onClick={() => handleButtonClick("/AI/AI14")}
                    >
                        AI 14
                    </button>
                </ul>
            </div>
        </div>
    );
}

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
                        className={`butt ${activeButton === "/ROAI1" ? "active" : ""}`}
                        onClick={() => handleButtonClick("/ROAI1")}
                    >
                        AI 1
                    </button>
                    <button
                        className={`butt ${activeButton === "/ROAI2" ? "active" : ""}`}
                        onClick={() => handleButtonClick("/ROAI2")}
                    >
                        AI 2
                    </button>
                    <button
                        className={`butt ${activeButton === "/ROAI31" ? "active" : ""}`}
                        onClick={() => handleButtonClick("/ROAI31")}
                    >
                        AI 3.1
                    </button>
                    <button
                        className={`butt ${activeButton === "/ROAI32" ? "active" : ""}`}
                        onClick={() => handleButtonClick("/ROAI32")}
                    >
                        AI 3.2
                    </button>
                    <button
                        className={`butt ${activeButton === "/ROAI33" ? "active" : ""}`}
                        onClick={() => handleButtonClick("/ROAI33")}
                    >
                        AI 3.3
                    </button>
                    <button
                        className={`butt ${activeButton === "/ROAI34" ? "active" : ""}`}
                        onClick={() => handleButtonClick("/ROAI34")}
                    >
                        AI 3.4
                    </button>
                    <button
                        className={`butt ${activeButton === "/ROAI4" ? "active" : ""}`}
                        onClick={() => handleButtonClick("/ROAI4")}
                    >
                        AI 4
                    </button>
                    <button
                        className={`butt ${activeButton === "/ROAI5" ? "active" : ""}`}
                        onClick={() => handleButtonClick("/ROAI5")}
                    >
                        AI 5
                    </button>
                    <button
                        className={`butt ${activeButton === "/ROAI6" ? "active" : ""}`}
                        onClick={() => handleButtonClick("/ROAI6")}
                    >
                        AI 6
                    </button>
                    <button
                        className={`butt ${activeButton === "/ROAI7" ? "active" : ""}`}
                        onClick={() => handleButtonClick("/ROAI7")}
                    >
                        AI 7
                    </button>
                    <button
                        className={`butt ${activeButton === "/ROAI8" ? "active" : ""}`}
                        onClick={() => handleButtonClick("/ROAI8")}
                    >
                        AI 8
                    </button>
                    <button
                        className={`butt ${activeButton === "/ROAI9" ? "active" : ""}`}
                        onClick={() => handleButtonClick("/ROAI9")}
                    >
                        AI 9
                    </button>
                    <button
                        className={`butt ${activeButton === "/ROAI10" ? "active" : ""}`}
                        onClick={() => handleButtonClick("/ROAI10")}
                    >
                        AI 10
                    </button>
                    <button
                        className={`butt ${activeButton === "/ROAI11" ? "active" : ""}`}
                        onClick={() => handleButtonClick("/ROAI11")}
                    >
                        AI 11
                    </button>
                    <button
                        className={`butt ${activeButton === "/ROAI12" ? "active" : ""}`}
                        onClick={() => handleButtonClick("/ROAI12")}
                    >
                        AI 12
                    </button>
                    <button
                        className={`butt ${activeButton === "/ROAI13" ? "active" : ""}`}
                        onClick={() => handleButtonClick("/ROAI13")}
                    >
                        AI 13
                    </button>
                    <button
                        className={`butt ${activeButton === "/ROAI14" ? "active" : ""}`}
                        onClick={() => handleButtonClick("/ROAI14")}
                    >
                        AI 14
                    </button>
                </ul>
            </div>
        </div>
    );
}

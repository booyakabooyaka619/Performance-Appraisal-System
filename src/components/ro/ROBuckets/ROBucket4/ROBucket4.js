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
                        className={`butt ${activeButton === "/RORB1" ? "active" : ""}`}
                        onClick={() => handleButtonClick("/RORB1")}
                    >
                        RB 1
                    </button>
                    <button
                        className={`butt ${activeButton === "/RORB2" ? "active" : ""}`}
                        onClick={() => handleButtonClick("/RORB2")}
                    >
                        RB 2
                    </button>
                    <button
                        className={`butt ${activeButton === "/RORB3" ? "active" : ""}`}
                        onClick={() => handleButtonClick("/RORB3")}
                    >
                        RB 3
                    </button>
                    <button
                        className={`butt ${activeButton === "/RORB4" ? "active" : ""}`}
                        onClick={() => handleButtonClick("/RORB4")}
                    >
                        RB 4
                    </button>
                    <button
                        className={`butt ${activeButton === "/RORB5" ? "active" : ""}`}
                        onClick={() => handleButtonClick("/RORB5")}
                    >
                        RB 5
                    </button>
                    <button
                        className={`butt ${activeButton === "/RORB6" ? "active" : ""}`}
                        onClick={() => handleButtonClick("/RORB6")}
                    >
                        RB 6
                    </button>
                    <button
                        className={`butt ${activeButton === "/RORB7" ? "active" : ""}`}
                        onClick={() => handleButtonClick("/RORB7")}
                    >
                        RB 7
                    </button>
                    <button
                        className={`butt ${activeButton === "/RORB8" ? "active" : ""}`}
                        onClick={() => handleButtonClick("/RORB8")}
                    >
                        RB 8
                    </button>
                    <button
                        className={`butt ${activeButton === "/RORB9" ? "active" : ""}`}
                        onClick={() => handleButtonClick("/RORB9")}
                    >
                        RB 9
                    </button>
                    <button
                        className={`butt ${activeButton === "/RORB10" ? "active" : ""}`}
                        onClick={() => handleButtonClick("/RORB10")}
                    >
                        RB 10
                    </button>
                    <button
                        className={`butt ${activeButton === "/RORB11" ? "active" : ""}`}
                        onClick={() => handleButtonClick("/RORB11")}
                    >
                        RB 11
                    </button>
                    <button
                        className={`butt ${activeButton === "/RORB12" ? "active" : ""}`}
                        onClick={() => handleButtonClick("/RORB12")}
                    >
                        RB 12
                    </button>
                </ul>
            </div>

        </div>
    );
}

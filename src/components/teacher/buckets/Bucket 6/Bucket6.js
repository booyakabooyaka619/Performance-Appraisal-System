import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../../Navbar';

export default function Bucket6() {
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
                        className={`butt ${activeButton === "/PDB/PDB1" ? "active" : ""}`}
                        onClick={() => handleButtonClick("/PDB/PDB1")}
                    >
                        PDB 1
                    </button>
                    <button
                        className={`butt ${activeButton === "/PDB/PDB2" ? "active" : ""}`}
                        onClick={() => handleButtonClick("/PDB/PDB2")}
                    >
                        PDB 2
                    </button>

                </ul>
            </div>
        </div>
    );
}

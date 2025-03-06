// FacultyTable.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './faculty.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

const FacultyTable = ({ user, onLogout, onProceedToForms }) => {
    const navigate = useNavigate();
    const [designation, setDesignation] = useState("Professor");

    const thresholds = {
        Professor: [60, 60, 40, 40, 10, 10],
        "Associate Professor": [60, 60, 30, 30, 8, 8],
        "Assistant Professor": [60, 60, 20, 20, 5, 5]
    };

    const data = [
        { category: 'Academic Involvement', totalMarks: 2000, engg: 7091, mms: 5600 },
        { category: 'Student Development', totalMarks: 2000, engg: 2800, mms: 2800 },
        { category: 'Administrative Bucket', totalMarks: 800, engg: 2400, mms: 2400 },
        { category: 'Research Bucket', totalMarks: 800, engg: 1788, mms: 1788 },
        { category: 'Consultancy and Corporate Training Bucket', totalMarks: 800, engg: 1806, mms: 1806 },
        { category: 'Product Dev. Bucket', totalMarks: 800, engg: 1680, mms: 1680 }
    ];

    const handleDesignationChange = (event) => {
        setDesignation(event.target.value);
    };

    const totalMarks = data.reduce((sum, row) => sum + row.totalMarks, 0);
    const totalThresholdMarks = data.reduce((sum, row, index) => {
        const thresholdPercentage = thresholds[designation][index];
        return sum + (row.totalMarks * thresholdPercentage) / 100;
    }, 0);
    const totalEngg = data.reduce((sum, row) => sum + row.engg, 0);
    const totalMms = data.reduce((sum, row) => sum + row.mms, 0);

    // Logout function to clear user data from localStorage and redirect to login
    const handleLogout = () => {
        onLogout();
        navigate('/');
    };

    // Handle navigation to Home page
    const handleProceedToForms = () => {
        onProceedToForms();
    };


    return (
        <div className="faculty-container">
            <h1>Vidyalankar Institute of Technology</h1>
            <h2>Performance Appraisal</h2>

            {/* Logout Button */}
            <button onClick={handleLogout} className="logout-button">
                <FontAwesomeIcon icon={faSignOutAlt} />
            </button>

            <div className="faculty-details">
                <div>
                    <b>Faculty Name: </b> {user.name} {/* Display faculty name from user */}
                </div>
                <div>
                    <b>Department: </b> {user.department} {/* Display department from user */}
                </div>
                <div>
                    <b>Employee Code: </b> {user.employeeCode} {/* Display employee code from user */}
                </div>
                <div>
                    <b>Designation: </b>
                    <select value={designation} onChange={handleDesignationChange}>
                        <option value="Professor">Professor</option>
                        <option value="Associate Professor">Associate Professor</option>
                        <option value="Assistant Professor">Assistant Professor</option>
                    </select>
                </div>
            </div>

            <table className="score-table">
                <thead>
                    <tr>
                        <th rowSpan="3">Category No.</th>
                        <th rowSpan="3">Type of Category</th>
                        <th rowSpan="3" className="narrow-col">Total Marks</th>
                        <th colSpan="2">Maximum Marks with Bonus</th>
                        <th colSpan="5">
                            {designation}
                        </th>
                    </tr>
                    <tr>
                        <th rowSpan="2" className="medium-col">Engg</th>
                        <th rowSpan="2" className="medium-col">MMS</th>
                        <th colSpan="2" className="wide-col">Threshold</th>
                        <th rowSpan="2" className="medium-col">Self Score</th>
                        <th rowSpan="2" className="medium-col">Score After Review by RO</th>
                    </tr>
                    <tr>
                        <th className="narrow-col">%</th>
                        <th className="narrow-col">Marks</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, index) => {
                        const thresholdPercentage = thresholds[designation][index];
                        const thresholdMarks = (row.totalMarks * thresholdPercentage) / 100;

                        const categoryNumber = index === 2 ? '3A' :
                            index === 3 ? '3B' :
                                index === 4 ? '3C' :
                                    index === 5 ? '3D' :
                                        index + 1;

                        return (
                            <tr key={index}>
                                <td>{categoryNumber}</td>
                                <td>{row.category}</td>
                                <td>{row.totalMarks}</td>
                                <td>{row.engg}</td>
                                <td>{row.mms}</td>
                                <td>{thresholdPercentage}%</td>
                                <td>{thresholdMarks}</td>
                                <td>{/* Self Score */}</td>
                                <td>{/* Score After Review by RO */}</td>
                            </tr>
                        );
                    })}
                    <tr>
                        <td colSpan="2"><b>Total = 1+2+3A+3B+3C+3D</b></td>
                        <td><b>{totalMarks}</b></td>
                        <td><b>{totalEngg}</b></td>
                        <td><b>{totalMms}</b></td>
                        <td><b></b></td>
                        <td><b>{totalThresholdMarks}</b></td>
                        <td><b>{/* Total Self Score */}</b></td>
                        <td><b>{/* Total Score After Review */}</b></td>
                    </tr>
                </tbody>
            </table>

            {/* Proceed to Forms Button */}
            <button onClick={handleProceedToForms} className="proceed-button">
                Proceed to Forms
            </button>
        </div>
    );
};

export default FacultyTable;

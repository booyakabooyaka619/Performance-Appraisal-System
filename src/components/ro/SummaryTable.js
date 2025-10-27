import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import RONavbar from './RONavbar';
import '../teacher/faculty.css';

export default function SummaryTable({ user: propUser, onLogout }) {
    const navigate = useNavigate();
    const location = useLocation();

    // Extract all values from location.state or localStorage fallback
    const [teacherName, setTeacherName] = useState(location.state?.teacherName || localStorage.getItem("teacherName"));
    const [teacherDepartment, setTeacherDepartment] = useState(location.state?.teacherDepartment || localStorage.getItem("teacherDepartment"));
    const [employeeCode, setEmployeeCode] = useState(location.state?.employeeCode || localStorage.getItem("employeeCode"));
    const [designation, setDesignation] = useState(location.state?.designation || localStorage.getItem("designation"));
    const [totalAISelfScore, setTotalAISelfScore] = useState(0);
    const [totalAIReviewedScore, setTotalAIReviewedScore] = useState(0);

    const [totalSDSelfScore, setTotalSDSelfScore] = useState(0);
    const [totalSDReviewedScore, setTotalSDReviewedScore] = useState(0);

    const [totalABSelfScore, setTotalABSelfScore] = useState(0);
    const [totalABReviewedScore, setTotalABReviewedScore] = useState(0);

    const [totalRBSelfScore, setTotalRBSelfScore] = useState(0);
    const [totalRBReviewedScore, setTotalRBReviewedScore] = useState(0);

    const [totalCBSelfScore, setTotalCBSelfScore] = useState(0);
    const [totalCBReviewedScore, setTotalCBReviewedScore] = useState(0);

    const [totalPDBSelfScore, setTotalPDBSelfScore] = useState(0);
    const [totalPDBReviewedScore, setTotalPDBReviewedScore] = useState(0);

    const totalSelfScore = totalAISelfScore + totalSDSelfScore + totalABSelfScore + totalRBSelfScore + totalCBSelfScore + totalPDBSelfScore;
    const totalReviewedScore = totalAIReviewedScore + totalSDReviewedScore + totalABReviewedScore + totalRBReviewedScore + totalCBReviewedScore + totalPDBReviewedScore;


    useEffect(() => {
        setTotalAISelfScore(Number(localStorage.getItem("totalAISelfScore")) || 0);
        setTotalAIReviewedScore(Number(localStorage.getItem("totalAIReviewedScore")) || 0);

        setTotalSDSelfScore(Number(localStorage.getItem("totalSDSelfScore")) || 0);
        setTotalSDReviewedScore(Number(localStorage.getItem("totalSDReviewedScore")) || 0);

        setTotalABSelfScore(Number(localStorage.getItem("totalABSelfScore")) || 0);
        setTotalABReviewedScore(Number(localStorage.getItem("totalABReviewedScore")) || 0);

        setTotalRBSelfScore(Number(localStorage.getItem("totalRBSelfScore")) || 0);
        setTotalRBReviewedScore(Number(localStorage.getItem("totalRBReviewedScore")) || 0);

        setTotalCBSelfScore(Number(localStorage.getItem("totalCBSelfScore")) || 0);
        setTotalCBReviewedScore(Number(localStorage.getItem("totalCBReviewedScore")) || 0);

        setTotalPDBSelfScore(Number(localStorage.getItem("totalPDBSelfScore")) || 0);
        setTotalPDBReviewedScore(Number(localStorage.getItem("totalPDBReviewedScore")) || 0);
    }, []);

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

    const totalMarks = data.reduce((sum, row) => sum + row.totalMarks, 0);
    const totalThresholdMarks = data.reduce((sum, row, index) => {
        const thresholdPercentage = thresholds[designation]?.[index] || 0;
        return sum + (row.totalMarks * thresholdPercentage) / 100;
    }, 0);
    const totalEngg = data.reduce((sum, row) => sum + row.engg, 0);
    const totalMms = data.reduce((sum, row) => sum + row.mms, 0);

    return (
        <div className="faculty-container">
            <RONavbar
                user={propUser}
                onLogout={onLogout}
                teacher={{
                    name: teacherName,
                    department: teacherDepartment,
                    employeeCode
                }}
            />
            <div className="faculty-subcontainer">
                <div className="faculty-details">
                    <div><b>Faculty Name:</b> {teacherName || 'N/A'}</div>
                    <div><b>Department:</b> {teacherDepartment || 'N/A'}</div>
                    <div><b>Employee Code:</b> {employeeCode || 'N/A'}</div>
                    <div><b>Designation:</b> {designation || 'N/A'}</div>
                </div>

                <table className="score-table">
                    <thead>
                        <tr>
                            <th rowSpan="3">Category No.</th>
                            <th rowSpan="3">Type of Category</th>
                            <th rowSpan="3" className="narrow-col">Total Marks</th>
                            <th colSpan="2">Maximum Marks with Bonus</th>
                            <th colSpan="5">{designation}</th>
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
                            const thresholdPercentage = thresholds[designation]?.[index] || 0;
                            const thresholdMarks = (row.totalMarks * thresholdPercentage) / 100;

                            const categoryNumber = ['1', '2', '3A', '3B', '3C', '3D'][index];

                            return (
                                <tr key={index}>
                                    <td>{categoryNumber}</td>
                                    <td>{row.category}</td>
                                    <td>{row.totalMarks}</td>
                                    <td>{row.engg}</td>
                                    <td>{row.mms}</td>
                                    <td>{thresholdPercentage}%</td>
                                    <td>{thresholdMarks}</td>
                                    <td>
                                        {index === 0 ? totalAISelfScore :
                                            index === 1 ? totalSDSelfScore :
                                                index === 2 ? totalABSelfScore :
                                                    index === 3 ? totalRBSelfScore :
                                                        index === 4 ? totalCBSelfScore :
                                                            index === 5 ? totalPDBSelfScore : ''}
                                    </td>
                                    <td>
                                        {index === 0 ? totalAIReviewedScore :
                                            index === 1 ? totalSDReviewedScore :
                                                index === 2 ? totalABReviewedScore :
                                                    index === 3 ? totalRBReviewedScore :
                                                        index === 4 ? totalCBReviewedScore :
                                                            index === 5 ? totalPDBReviewedScore : ''}
                                    </td>
                                </tr>

                            );
                        })}
                        <tr>
                            <td colSpan="2"><b>Total = 1+2+3A+3B+3C+3D</b></td>
                            <td><b>{totalMarks}</b></td>
                            <td><b>{totalEngg}</b></td>
                            <td><b>{totalMms}</b></td>
                            <td></td>
                            <td><b>{totalThresholdMarks}</b></td>
                            <td><b>{totalSelfScore}</b></td>
                            <td><b>{totalReviewedScore}</b></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};


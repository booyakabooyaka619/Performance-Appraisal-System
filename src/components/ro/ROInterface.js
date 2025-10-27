import React, { useEffect, useState } from 'react';
import RONewNavbar from './RONewNavbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import './rointerface.css';

export default function ROInterface() {
    const [teachers, setTeachers] = useState([]);
    const [roDepartment, setRoDepartment] = useState('');
    const [loading, setLoading] = useState(true); // ✅ Track loading state
    const [dataFetched, setDataFetched] = useState(false);

    const roUsername = localStorage.getItem('username');

    useEffect(() => {
        if (!dataFetched && roUsername) {
            console.log('Fetching RO Dashboard Data...');
            fetchRODashboard();
            setDataFetched(true);

            // ✅ Auto-refresh every 10 seconds to update the status dynamically
            const interval = setInterval(fetchRODashboard, 10000);
            return () => clearInterval(interval); // Cleanup interval on unmount
        }
    }, [dataFetched, roUsername]);

    const fetchRODashboard = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/users/ro-dashboard?username=${roUsername}`);
            const data = await response.json();
            console.log('Fetched RO Dashboard Data:', data);

            setRoDepartment(data.roDepartment); // Set RO department
            setTeachers(
                data.teachers.map(teacher => ({
                    ...teacher,
                    status: teacher.status || 'Not Submitted' // Default status
                }))
            );

            setLoading(false); // ✅ Hide spinner after fetching data
        } catch (error) {
            console.error('Error fetching RO dashboard data:', error);
            setLoading(false); // ✅ Hide spinner even if there's an error
        }
    };

    return (
        <div>
            <RONewNavbar />
            <div className="container mt-4">
                {loading ? (
                    // ✅ Show loading spinner while fetching data
                    <div className="spinner"></div>
                ) : (
                    <>
                        <div className="department-title-container">
                            <h2 className="department-title">Department of {roDepartment}</h2>
                        </div>

                        <div className="row">
                            {teachers.map((teacher) => (
                                <div key={teacher.employeeCode} className="col-md-4 mb-4">
                                    <div className="teacher-card">
                                        <img
                                            src={`data:image/jpeg;base64,${teacher.image}`}
                                            className="teacher-image"
                                            alt={teacher.name}
                                        />
                                        <div className="teacher-card-body">
                                            <h5 className="teacher-card-title">{teacher.name}</h5>
                                            <p className="teacher-card-text">Employee Code: {teacher.employeeCode}</p>
                                            <p className="teacher-status">
                                                Status:
                                                <span className={teacher.status === 'Submitted' ? 'submitted' : 'not-submitted'}>
                                                    {teacher.status}
                                                </span>
                                            </p>

                                            {teacher.status === 'Submitted' && (
                                                <p className="teacher-status">
                                                    Review:
                                                    <span className={teacher.isReviewClickable ? 'submitted' : 'not-submitted'}>
                                                        {teacher.isReviewClickable ? 'Completed' : 'Pending'}
                                                    </span>
                                                </p>
                                            )}

                                            {/* 🚀 Review Button */}
                                            <Link
                                                to="/professorhome"
                                                state={{
                                                    teacherName: teacher.name,
                                                    teacherDepartment: teacher.department,
                                                    employeeCode: teacher.employeeCode,
                                                    designation: teacher.designation,
                                                    isReviewClickable: teacher.isReviewClickable // ✅ pass this too

                                                }}
                                            >
                                                <button className="review-button" disabled={teacher.status !== 'Submitted'}>
                                                    Review
                                                </button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

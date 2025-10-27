import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button } from 'react-bootstrap';
import '../../../../teacher/buckets/bucket.css';
import '../../../../teacher/buckets/Bucket 1/AI/ai.css';
import ROBucket2 from '../ROBucket2';

export default function ROSD4() {
    const [submittedForms, setSubmittedForms] = useState([]);
    const [teacherSD4Forms, setTeacherSD4Forms] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const user = JSON.parse(localStorage.getItem('user'));
    const teacherName = localStorage.getItem('teacherName');
    const teacherDepartment = localStorage.getItem('teacherDepartment');
    const employeeCode = localStorage.getItem('employeeCode');
    const [scoreByRO, setScoreByRO] = useState('');
    const [reviewByRO, setReviewByRO] = useState('');
    const [isReviewEditable, setIsReviewEditable] = useState(true); // Default: Unlocked
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isReviewClickable, setIsReviewClickable] = useState(false);
    const [showScoreInfoModal, setShowScoreInfoModal] = useState(false);


    useEffect(() => {
        fetchSubmittedForms();
    }, [user]);

    useEffect(() => {
        if (teacherName && teacherDepartment && employeeCode) {
            fetchTeacherSD4Form();
        }
    }, [teacherName, teacherDepartment, employeeCode]);

    useEffect(() => {
        const fetchReviewClickableStatus = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/reviews/teacher-review-status/${employeeCode}`);
                if (!response.ok) throw new Error('Failed to fetch review clickable status');
                const data = await response.json();
                setIsReviewClickable(data.isReviewClickable); // assuming backend returns { isReviewClickable: true/false }
            } catch (error) {
                console.error('Error fetching review clickable status:', error);
            }
        };

        if (teacherName && teacherDepartment) {
            fetchReviewClickableStatus();
        }
    }, [teacherName, teacherDepartment]);

    const fetchSubmittedForms = async () => {
        if (!user) return;
        try {
            const response = await fetch(`http://localhost:5000/api/sd4form/submissions?teacherName=${user.name}&teacherDepartment=${user.department}&formId=SD4`);
            if (!response.ok) throw new Error('Failed to fetch submitted forms');
            const result = await response.json();
            setSubmittedForms(result.reverse());
        } catch (error) {
            console.error('Error fetching submitted forms:', error);
        }
    };

    const fetchTeacherSD4Form = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/sd4form/submissions?teacherName=${teacherName}&teacherDepartment=${teacherDepartment}&employeeCode=${employeeCode}&formId=SD4`);
            if (!response.ok) throw new Error('Failed to fetch SD4 form');
            const result = await response.json();

            setTeacherSD4Forms(result.reverse());

            if (result.length > 0) {
                setScoreByRO(result[0]?.scoreByRO || '');
                setReviewByRO(result[0]?.reviewByRO || '');
                setIsReviewEditable(result[0]?.isReviewEditable || false);
            }
        } catch (error) {
            console.error('Error fetching teacher SD4 form:', error);
        }
    };

    useEffect(() => {
        if (teacherSD4Forms.length > 0) {
            const form = teacherSD4Forms[currentPage - 1]; // Get the current page form
            setScoreByRO(form?.scoreByRO || '');
            setReviewByRO(form?.reviewByRO || '');

            // If both fields are empty, allow editing; else, disable
            setIsReviewEditable(!form?.scoreByRO && !form?.reviewByRO);
        }
    }, [currentPage, teacherSD4Forms]);





    const editReview = async (formId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/sd4form/toggle-edit-review/${formId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(`Failed to enable editing: ${errorMessage}`);
            }

            // ✅ Unlock the review field when Edit Review is clicked
            setIsReviewEditable(true);
        } catch (error) {
            console.error('Error enabling review editing:', error);
        }
    };


    const submitReview = async (formId) => {
        if (!scoreByRO || isNaN(Number(scoreByRO))) {
            setErrorMessage('Score by RO is required and must be a valid number.');
            setShowErrorModal(true);
            return;
        }

        if (!reviewByRO.trim()) {
            setErrorMessage('Review by RO cannot be empty.');
            setShowErrorModal(true);
            return;
        }

        try {
            const payload = {
                scoreByRO: Number(scoreByRO),
                reviewByRO: reviewByRO.trim(),
            };

            const response = await fetch(`http://localhost:5000/api/sd4form/submit-review/${formId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                setErrorMessage(errorData.message || 'An error occurred');
                setShowErrorModal(true);
                return;
            }

            setIsReviewEditable(false);
            setShowSuccessModal(true);

            await fetchTeacherSD4Form();

        } catch (error) {
            console.error('Error submitting review:', error);
            setErrorMessage('Internal server error');
            setShowErrorModal(true);
        }
    };





    return (
        <>
            <ROBucket2 />
            <div className="bt-container">
                <h2 style={{ backgroundColor: '#7ba591' }}>SD-4 Student Feedback (during PA evaluation period)
                </h2>

                {/* Teacher SD4 Form Section */}
                <div className="submitted-forms-container">
                    <h4 style={{ textAlign: 'center', backgroundColor: '#2e4756', padding: '10px', borderRadius: '5px', color: 'white', fontSize: '18px', fontWeight: 'bold' }}>
                        {teacherSD4Forms.length > 0 ? `Reviewing submissions for ${teacherName} - Page ${currentPage} of ${teacherSD4Forms.length}`
                            : `Submission 0 of 0`}
                    </h4>

                    {teacherSD4Forms.length === 0 ? (
                        <p className='noprev'>No previous SD4 submissions found for the selected teacher.</p>
                    ) : (
                        <div className="submitted-form">


                            <table className="submitted-table" style={{ marginTop: '0' }}>
                                <tbody>

                                    <tr>
                                        <td><strong>Course Name:</strong></td>
                                        <td>{teacherSD4Forms[currentPage - 1]?.courseName}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Feedback:</strong></td>
                                        <td>{teacherSD4Forms[currentPage - 1]?.feedback}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Attendance (%):</strong></td>
                                        <td>{teacherSD4Forms[currentPage - 1]?.attendance}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Link Evidence:</strong></td>
                                        <td>{teacherSD4Forms[currentPage - 1]?.linkEvidence}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Self Score:</strong></td>
                                        <td>{teacherSD4Forms[currentPage - 1]?.score}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Evidence Link:</strong></td>
                                        <td>
                                            <a
                                                href={teacherSD4Forms[currentPage - 1]?.linkEvidence}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                {teacherSD4Forms[currentPage - 1]?.linkEvidence}
                                            </a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><strong>Score by RO:</strong></td>
                                        <td style={{ display: 'flex', gap: '10px' }}>
                                            <input
                                                type="number"
                                                value={scoreByRO}
                                                onChange={(e) => setScoreByRO(e.target.value)}
                                                className="form-control"
                                                style={{ paddingLeft: "20px", textAlign: "left", width: "120px", height: "50px" }}
                                                disabled={!isReviewEditable}
                                            />
                                            <Button className="score-info-button" onClick={() => setShowScoreInfoModal(true)}>
                                                View Score Calculation
                                            </Button>

                                            <Modal
                                                show={showScoreInfoModal}
                                                onHide={() => setShowScoreInfoModal(false)}
                                                centered
                                                dialogClassName="custom-score-modal"
                                            >
                                                <Modal.Header>
                                                    <Modal.Title>Score Calculation</Modal.Title>
                                                </Modal.Header>
                                                <Modal.Body>
                                                    <ul>
                                                        <li style={{ marginBottom: '20px' }}>
                                                            The score is calculated based on the feedback rating (0 to 4) and the course attendance percentage.
                                                        </li>
                                                        <li>
                                                            The score from the feedback is calculated as follows:
                                                            <ul>
                                                                <li>If feedback is ≥ 3.5, the score is <strong>300</strong></li>
                                                                <li>If feedback is ≥ 3.0 and less than 3.5, the score is <strong>210</strong></li>
                                                                <li>If feedback is ≥ 2.5 and less than 3.0, the score is <strong>150</strong></li>
                                                                <li>If feedback is less than 2.5, the score is <strong>0</strong></li>
                                                            </ul>
                                                        </li>
                                                        <li style={{ marginBottom: '20px' }}>
                                                            After determining the score from the feedback, the final score is calculated by multiplying the feedback score by the course attendance percentage divided by 100.
                                                        </li>
                                                        <li style={{ marginBottom: '20px' }}>
                                                            <strong>Example:</strong> If the feedback score is 3.2 and the attendance is 85%, the calculation is:
                                                            Feedback Score = 210, Attendance = 85%<br />
                                                            Then the Final Score = <code>210 × (85 / 100) = 178.5</code><br />
                                                            If the score ends with a .5, it will be rounded up to the next integer, resulting in a Final Score of <strong>179</strong>.
                                                        </li>
                                                        <li>
                                                            Higher feedback ratings and attendance percentages lead to higher final scores.
                                                        </li>
                                                    </ul>
                                                </Modal.Body>
                                                <Modal.Footer>
                                                    <Button variant="secondary" onClick={() => setShowScoreInfoModal(false)}>
                                                        Close
                                                    </Button>
                                                </Modal.Footer>
                                            </Modal>
                                        </td>

                                    </tr>
                                    <tr>
                                        <td><strong>Review by RO:</strong></td>
                                        <td>
                                            <textarea
                                                value={reviewByRO}
                                                onChange={(e) => setReviewByRO(e.target.value)}
                                                className="form-control"
                                                style={{ paddingLeft: "20px", textAlign: "left", height: "50px" }}
                                                disabled={!isReviewEditable}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan="2">
                                            {(!scoreByRO && !reviewByRO) ? (
                                                <button className="submit-review-btn" onClick={() => submitReview(teacherSD4Forms[currentPage - 1]._id)}>
                                                    Submit Review
                                                </button>
                                            ) : (
                                                <>
                                                    {isReviewEditable ? (
                                                        <button className="submit-review-btn" onClick={() => submitReview(teacherSD4Forms[currentPage - 1]._id)}>
                                                            Submit Review
                                                        </button>
                                                    ) : (
                                                        <Button
                                                            onClick={() => editReview(teacherSD4Forms[currentPage - 1]._id)}
                                                            disabled={isReviewClickable} // <-- This disables the button if review is locked
                                                            className="edit-review-btn"
                                                        >
                                                            Edit Review
                                                        </Button>
                                                    )}
                                                </>
                                            )}
                                        </td>
                                    </tr>

                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Pagination Controls */}
                <div className="pagination" style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
                    {teacherSD4Forms.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentPage(index + 1)}
                            className={`btn ${currentPage === index + 1 ? 'btn-success' : 'btn-outline-secondary'}`}
                            style={{ margin: '0 5px' }}>
                            {index + 1}
                        </button>
                    ))}
                </div>

                <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)} dialogClassName="top-modal">

                    <Modal.Header closeButton>
                        <Modal.Title>Success</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Review submitted successfully!</Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={() => setShowSuccessModal(false)}>
                            OK
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Modal show={showErrorModal} onHide={() => setShowErrorModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Error</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{errorMessage}</Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" onClick={() => setShowErrorModal(false)}>OK</Button>
                    </Modal.Footer>
                </Modal>

            </div>
        </>
    );
}

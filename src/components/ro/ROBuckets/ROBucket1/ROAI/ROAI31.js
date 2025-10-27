import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button } from 'react-bootstrap';
import '../../../../teacher/buckets/bucket.css';
import '../../../../teacher/buckets/Bucket 1/AI/ai.css';
import ROBucket1 from '../ROBucket1';

export default function ROAI31() {
    const [submittedForms, setSubmittedForms] = useState([]);
    const [teacherAI31Forms, setTeacherAI31Forms] = useState([]);
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
            fetchTeacherAI31Form();
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
            const response = await fetch(`http://localhost:5000/api/ai31form/submissions?teacherName=${user.name}&teacherDepartment=${user.department}&formId=AI31`);
            if (!response.ok) throw new Error('Failed to fetch submitted forms');
            const result = await response.json();
            setSubmittedForms(result.reverse());
        } catch (error) {
            console.error('Error fetching submitted forms:', error);
        }
    };

    const fetchTeacherAI31Form = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/ai31form/submissions?teacherName=${teacherName}&teacherDepartment=${teacherDepartment}&employeeCode=${employeeCode}&formId=AI31`);
            if (!response.ok) throw new Error('Failed to fetch AI31 form');
            const result = await response.json();

            setTeacherAI31Forms(result.reverse());

            if (result.length > 0) {
                setScoreByRO(result[0]?.scoreByRO || '');
                setReviewByRO(result[0]?.reviewByRO || '');
                setIsReviewEditable(result[0]?.isReviewEditable || false);
            }
        } catch (error) {
            console.error('Error fetching teacher AI31 form:', error);
        }
    };

    useEffect(() => {
        if (teacherAI31Forms.length > 0) {
            const form = teacherAI31Forms[currentPage - 1]; // Get the current page form
            setScoreByRO(form?.scoreByRO || '');
            setReviewByRO(form?.reviewByRO || '');

            // If both fields are empty, allow editing; else, disable
            setIsReviewEditable(!form?.scoreByRO && !form?.reviewByRO);
        }
    }, [currentPage, teacherAI31Forms]);





    const editReview = async (formId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/ai31form/toggle-edit-review/${formId}`, {
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

            const response = await fetch(`http://localhost:5000/api/ai31form/submit-review/${formId}`, {
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

            await fetchTeacherAI31Form();

        } catch (error) {
            console.error('Error submitting review:', error);
            setErrorMessage('Internal server error');
            setShowErrorModal(true);
        }
    };


    return (
        <>
            <ROBucket1 />
            <div className="bt-container">
                <h2 style={{ backgroundColor: '#537c78' }}>AI-3.1 BSA - Guest Lecture</h2>

                {/* Teacher AI31 Form Section */}
                <div className="submitted-forms-container">
                    <h4 style={{ textAlign: 'center', backgroundColor: '#2e4756', padding: '10px', borderRadius: '5px', color: 'white', fontSize: '18px', fontWeight: 'bold' }}>
                        {teacherAI31Forms.length > 0 ? `Reviewing submissions for ${teacherName} - Page ${currentPage} of ${teacherAI31Forms.length}`
                            : `Submission 0 of 0`}
                    </h4>

                    {teacherAI31Forms.length === 0 ? (
                        <p className='noprev'>No previous AI31 submissions found for the selected teacher.</p>
                    ) : (
                        <div className="submitted-form">
                            <table className="submitted-table" style={{ marginTop: '0' }}>
                                <tbody>
                                    <tr>
                                        <td><strong>Quality of Speaker:</strong></td>
                                        <td>{teacherAI31Forms[currentPage - 1]?.qualityOfSpeaker}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Feedback Received:</strong></td>
                                        <td>{teacherAI31Forms[currentPage - 1]?.feedbackReceived}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Number of Attendees:</strong></td>
                                        <td>{teacherAI31Forms[currentPage - 1]?.numberOfAttendees}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Number of Students:</strong></td>
                                        <td>{teacherAI31Forms[currentPage - 1]?.numberOfStudents}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Mapping to Objectives:</strong></td>
                                        <td>{teacherAI31Forms[currentPage - 1]?.mapping}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Self Score:</strong></td>
                                        <td>{teacherAI31Forms[currentPage - 1]?.score}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Evidence Link:</strong></td>
                                        <td>
                                            <a
                                                href={teacherAI31Forms[currentPage - 1]?.linkEvidence}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                {teacherAI31Forms[currentPage - 1]?.linkEvidence}
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
                                                            The score is calculated by multiplying three key values:
                                                            <br />
                                                            <strong>W1 (Quality of Speaker)</strong>, <strong>W2 (Feedback Weightage)</strong>, and <strong>W3 (Mapping)</strong>.
                                                        </li>
                                                        <li>
                                                            After calculating <code>W1 × W2 × W3</code>, the result is multiplied by a constant factor of <strong>75</strong> to get the final score.
                                                        </li>
                                                        <li style={{ marginBottom: '20px' }}>
                                                            <strong>W1 (Quality of Speaker):</strong><br />
                                                            - International/National VP and above / Unicorn Startup – CXO = 1.0<br />
                                                            - International/National Prof. & Above = 1.0<br />
                                                            - SME = 0.5<br />
                                                            - State = 0.5
                                                        </li>
                                                        <li style={{ marginBottom: '20px' }}>
                                                            <strong>W2 (Feedback Weightage):</strong><br />
                                                            If Feedback Received ≥ 2.5, then:<br />
                                                            <code>W2 = Attendees / Total Students</code><br />
                                                            Else: <code>W2 = 0</code>
                                                        </li>
                                                        <li style={{ marginBottom: '20px' }}>
                                                            <strong>W3 (Mapping):</strong><br />
                                                            - Strongly = 1.5<br />
                                                            - Moderately = 1.0<br />
                                                            - Neither = 0.0
                                                        </li>
                                                        <li style={{ marginBottom: '20px' }}>
                                                            <strong>Example:</strong><br />
                                                            Quality of Speaker = 1.0, Feedback = 2.8, Attendees = 78, Total Students = 78, Mapping = Strongly<br />
                                                            <code>W1 = 1.0, W2 = 78 / 78 = 1.0, W3 = 1.5</code><br />
                                                            Final Score = <code>1.0 × 1.0 × 1.5 × 75 = 112.5</code>
                                                        </li>
                                                        <li>
                                                            Higher values and positive feedback lead to higher scores.
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
                                                <button className="submit-review-btn" onClick={() => submitReview(teacherAI31Forms[currentPage - 1]._id)}>
                                                    Submit Review
                                                </button>
                                            ) : (
                                                <>
                                                    {isReviewEditable ? (
                                                        <button className="submit-review-btn" onClick={() => submitReview(teacherAI31Forms[currentPage - 1]._id)}>
                                                            Submit Review
                                                        </button>
                                                    ) : (
                                                        <Button
                                                            onClick={() => editReview(teacherAI31Forms[currentPage - 1]._id)}
                                                            disabled={isReviewClickable} // 🔒 Disable if review is completed
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
                    {teacherAI31Forms.map((_, index) => (
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

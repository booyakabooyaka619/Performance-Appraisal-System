import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button } from 'react-bootstrap';
import '../../../../teacher/buckets/bucket.css';
import '../../../../teacher/buckets/Bucket 1/AI/ai.css';
import ROBucket1 from '../ROBucket1';

export default function ROAI32() {
    const [submittedForms, setSubmittedForms] = useState([]);
    const [teacherAI32Forms, setTeacherAI32Forms] = useState([]);
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
            fetchTeacherAI32Form();
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
            const response = await fetch(`http://localhost:5000/api/ai32form/submissions?teacherName=${user.name}&teacherDepartment=${user.department}&formId=AI32`);
            if (!response.ok) throw new Error('Failed to fetch submitted forms');
            const result = await response.json();
            setSubmittedForms(result.reverse());
        } catch (error) {
            console.error('Error fetching submitted forms:', error);
        }
    };

    const fetchTeacherAI32Form = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/ai32form/submissions?teacherName=${teacherName}&teacherDepartment=${teacherDepartment}&employeeCode=${employeeCode}&formId=AI32`);
            if (!response.ok) throw new Error('Failed to fetch AI32 form');
            const result = await response.json();

            setTeacherAI32Forms(result.reverse());

            if (result.length > 0) {
                setScoreByRO(result[0]?.scoreByRO || '');
                setReviewByRO(result[0]?.reviewByRO || '');
                setIsReviewEditable(result[0]?.isReviewEditable || false);
            }
        } catch (error) {
            console.error('Error fetching teacher AI32 form:', error);
        }
    };

    useEffect(() => {
        if (teacherAI32Forms.length > 0) {
            const form = teacherAI32Forms[currentPage - 1]; // Get the current page form
            setScoreByRO(form?.scoreByRO || '');
            setReviewByRO(form?.reviewByRO || '');

            // If both fields are empty, allow editing; else, disable
            setIsReviewEditable(!form?.scoreByRO && !form?.reviewByRO);
        }
    }, [currentPage, teacherAI32Forms]);





    const editReview = async (formId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/ai32form/toggle-edit-review/${formId}`, {
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

            const response = await fetch(`http://localhost:5000/api/ai32form/submit-review/${formId}`, {
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

            await fetchTeacherAI32Form();

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
                <h2 style={{ backgroundColor: '#537c78' }}>AI-3.2 BSA - Industrial Visit</h2>

                {/* Teacher AI32 Form Section */}
                <div className="submitted-forms-container">
                    <h4 style={{ textAlign: 'center', backgroundColor: '#2e4756', padding: '10px', borderRadius: '5px', color: 'white', fontSize: '18px', fontWeight: 'bold' }}>
                        {teacherAI32Forms.length > 0 ? `Reviewing submissions for ${teacherName} - Page ${currentPage} of ${teacherAI32Forms.length}`
                            : `Submission 0 of 0`}
                    </h4>

                    {teacherAI32Forms.length === 0 ? (
                        <p className='noprev'>No previous AI32 submissions found for the selected teacher.</p>
                    ) : (
                        <div className="submitted-form">
                            <table className="submitted-table" style={{ marginTop: '0' }}>
                                <tbody>
                                    <tr>
                                        <td><strong>MOU for Placements Type:</strong></td>
                                        <td>{teacherAI32Forms[currentPage - 1]?.mouPlacementsType}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>MOU for Placements:</strong></td>
                                        <td>{teacherAI32Forms[currentPage - 1]?.mouPlacements}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>MOU for Internships:</strong></td>
                                        <td>{teacherAI32Forms[currentPage - 1]?.mouInternships}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Faculty’s Presence:</strong></td>
                                        <td>{teacherAI32Forms[currentPage - 1]?.facultyPresence}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Internships with Industry:</strong></td>
                                        <td>{teacherAI32Forms[currentPage - 1]?.internshipsWithIndustry}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Projects with Industry:</strong></td>
                                        <td>{teacherAI32Forms[currentPage - 1]?.projectsWithIndustry}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Feedback Received:</strong></td>
                                        <td>{teacherAI32Forms[currentPage - 1]?.feedbackReceived}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Number of Attendees:</strong></td>
                                        <td>{teacherAI32Forms[currentPage - 1]?.numberOfAttendees}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Total Students:</strong></td>
                                        <td>{teacherAI32Forms[currentPage - 1]?.numberOfStudents}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Mapping to Objectives:</strong></td>
                                        <td>{teacherAI32Forms[currentPage - 1]?.mapping}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Self Score:</strong></td>
                                        <td>{teacherAI32Forms[currentPage - 1]?.score}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Evidence Link:</strong></td>
                                        <td>
                                            <a
                                                href={teacherAI32Forms[currentPage - 1]?.linkEvidence}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                {teacherAI32Forms[currentPage - 1]?.linkEvidence}
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
                                                        <li style={{ marginBottom: '15px' }}>
                                                            The final score is calculated by multiplying the values associated with each selected option from the form.
                                                        </li>
                                                        <li style={{ marginBottom: '15px' }}>
                                                            The factors include:
                                                            <ul style={{ marginTop: '10px' }}>
                                                                <li><strong>MOU for Placements (Type)</strong>: Offline (1), Online (0.5)</li>
                                                                <li><strong>MOU for Placements</strong>: New MOU (1.5), None (1)</li>
                                                                <li><strong>MOU for Internships</strong>: New MOU (1.25), None (1)</li>
                                                                <li><strong>Faculty’s Presence</strong>: Present (1), Absent (0.3)</li>
                                                                <li><strong>Internships with Industry</strong>: Yes (1.2), No (1)</li>
                                                                <li><strong>Projects with Industry</strong>: Yes (1.1), No (1)</li>
                                                                <li>
                                                                    <strong>Feedback Score</strong>: If ≥ 2.5, contributes as
                                                                    <code> (Number of Attendees ÷ Number of Students) </code>, else 0
                                                                </li>
                                                                <li>
                                                                    <strong>Mapping</strong>:
                                                                    <ul>
                                                                        <li>Strongly to PO (1.5)</li>
                                                                        <li>Strongly to CO / Moderately to PO (1)</li>
                                                                        <li>Moderately to CO (0.8)</li>
                                                                        <li>Neither PO nor CO (0)</li>
                                                                    </ul>
                                                                </li>
                                                            </ul>
                                                        </li>
                                                        <li style={{ marginBottom: '20px' }}>
                                                            All these values are multiplied together, and then multiplied by <strong>75</strong> as a factor to get the final score.
                                                        </li>
                                                        <li style={{ marginBottom: '20px' }}>
                                                            <strong>Example:</strong> If the selected values are:<br />
                                                            MOU Type = 1, MOU Placements = 1.5, MOU Internships = 1.25,<br />
                                                            Faculty Presence = 1, Internships = 1.2, Projects = 1.1,<br />
                                                            Feedback = 3 (Attendees = 60, Students = 100 → 60/100 = 0.6),<br />
                                                            Mapping = 1.5<br /><br />
                                                            Then Score = <code>1 × 1.5 × 1.25 × 1 × 1.2 × 1.1 × 0.6 × 1.5 × 75 = 100.12</code>
                                                        </li>
                                                        <li>
                                                            Try to aim for higher values and feedback to increase your final score.
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
                                                <button className="submit-review-btn" onClick={() => submitReview(teacherAI32Forms[currentPage - 1]._id)}>
                                                    Submit Review
                                                </button>
                                            ) : (
                                                <>
                                                    {isReviewEditable ? (
                                                        <button className="submit-review-btn" onClick={() => submitReview(teacherAI32Forms[currentPage - 1]._id)}>
                                                            Submit Review
                                                        </button>
                                                    ) : (
                                                        <Button
                                                            onClick={() => editReview(teacherAI32Forms[currentPage - 1]._id)}
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
                    {teacherAI32Forms.map((_, index) => (
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

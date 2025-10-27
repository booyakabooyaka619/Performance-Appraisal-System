import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button } from 'react-bootstrap';
import '../../../../teacher/buckets/bucket.css';
import '../../../../teacher/buckets/Bucket 1/AI/ai.css';
import ROBucket1 from '../ROBucket1';

export default function ROAI12() {
    const [submittedForms, setSubmittedForms] = useState([]);
    const [teacherAI12Forms, setTeacherAI12Forms] = useState([]);
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
            fetchTeacherAI12Form();
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
            const response = await fetch(`http://localhost:5000/api/ai12form/submissions?teacherName=${user.name}&teacherDepartment=${user.department}&formId=AI12`);
            if (!response.ok) throw new Error('Failed to fetch submitted forms');
            const result = await response.json();
            setSubmittedForms(result.reverse());
        } catch (error) {
            console.error('Error fetching submitted forms:', error);
        }
    };

    const fetchTeacherAI12Form = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/ai12form/submissions?teacherName=${teacherName}&teacherDepartment=${teacherDepartment}&employeeCode=${employeeCode}&formId=AI12`);
            if (!response.ok) throw new Error('Failed to fetch AI12 form');
            const result = await response.json();

            setTeacherAI12Forms(result.reverse());

            if (result.length > 0) {
                setScoreByRO(result[0]?.scoreByRO || '');
                setReviewByRO(result[0]?.reviewByRO || '');
                setIsReviewEditable(result[0]?.isReviewEditable || false);
            }
        } catch (error) {
            console.error('Error fetching teacher AI12 form:', error);
        }
    };

    useEffect(() => {
        if (teacherAI12Forms.length > 0) {
            const form = teacherAI12Forms[currentPage - 1]; // Get the current page form
            setScoreByRO(form?.scoreByRO || '');
            setReviewByRO(form?.reviewByRO || '');

            // If both fields are empty, allow editing; else, disable
            setIsReviewEditable(!form?.scoreByRO && !form?.reviewByRO);
        }
    }, [currentPage, teacherAI12Forms]);





    const editReview = async (formId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/ai12form/toggle-edit-review/${formId}`, {
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

            const response = await fetch(`http://localhost:5000/api/ai12form/submit-review/${formId}`, {
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

            await fetchTeacherAI12Form();

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
                <h2 style={{ backgroundColor: '#537c78' }}>AI-12 Exam Related Work</h2>

                {/* Teacher AI12 Form Section */}
                <div className="submitted-forms-container">
                    <h4 style={{ textAlign: 'center', backgroundColor: '#2e4756', padding: '10px', borderRadius: '5px', color: 'white', fontSize: '18px', fontWeight: 'bold' }}>
                        {teacherAI12Forms.length > 0 ? `Reviewing submissions for ${teacherName} - Page ${currentPage} of ${teacherAI12Forms.length}`
                            : `Submission 0 of 0`}
                    </h4>

                    {teacherAI12Forms.length === 0 ? (
                        <p className='noprev'>No previous AI12 submissions found for the selected teacher.</p>
                    ) : (
                        <div className="submitted-form">
                            <table className="submitted-table" style={{ marginTop: '0' }}>
                                <tbody>
                                    <tr>
                                        <td><strong>Chief Conductor (50 marks):</strong></td>
                                        <td>{teacherAI12Forms[currentPage - 1]?.chiefConductor}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>CAP Incharge (50 marks):</strong></td>
                                        <td>{teacherAI12Forms[currentPage - 1]?.capIncharge}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Senior Supervisor (30 marks):</strong></td>
                                        <td>{teacherAI12Forms[currentPage - 1]?.seniorSupervisor}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Paper Setting (20 per course):</strong></td>
                                        <td>{teacherAI12Forms[currentPage - 1]?.paperSetting}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Paper Solutions (20 per course):</strong></td>
                                        <td>{teacherAI12Forms[currentPage - 1]?.paperSolutions}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Vigilance Squad Member (20 marks):</strong></td>
                                        <td>{teacherAI12Forms[currentPage - 1]?.vigilanceSquadMember}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Design of Curriculum (10 marks):</strong></td>
                                        <td>{teacherAI12Forms[currentPage - 1]?.designOfCurriculum}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Invigilation (05 per invigilation/max):</strong></td>
                                        <td>{teacherAI12Forms[currentPage - 1]?.invigilation}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Paper Assessment/ Moderation (10 marks):</strong></td>
                                        <td>{teacherAI12Forms[currentPage - 1]?.paperAssessmentModeration}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Self Score:</strong></td>
                                        <td>{teacherAI12Forms[currentPage - 1]?.score}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Evidence Link:</strong></td>
                                        <td>
                                            <a
                                                href={teacherAI12Forms[currentPage - 1]?.linkEvidence}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                {teacherAI12Forms[currentPage - 1]?.linkEvidence}
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
                                                            The score is calculated by summing up all the values entered in the following categories:
                                                            <br />
                                                            <strong>Chief Conductor, CAP Incharge, Senior Supervisor, Vigilance Squad Member, Design of Curriculum.</strong>
                                                        </li>
                                                        <li style={{ marginBottom: '20px' }}>
                                                            Additional fields have multipliers applied to each entry:
                                                            <br />
                                                            <strong>Paper Setting</strong> is multiplied by 20 per course,
                                                            <strong> Paper Solutions</strong> is multiplied by 20 per course,
                                                            <strong> Invigilation</strong> is multiplied by 5 per session, and
                                                            <strong> Paper Assessment/Moderation</strong> is multiplied by 10 per instance.
                                                        </li>
                                                        <li>
                                                            After summing all the values and applying respective multipliers, the final score is calculated.
                                                        </li>
                                                        <li style={{ marginBottom: '20px' }}>
                                                            <strong>Example:</strong> If the entered values are:<br />
                                                            Chief Conductor = 20, CAP Incharge = 15, Senior Supervisor = 10, Vigilance Squad Member = 5, Design of Curriculum = 5, <br />
                                                            Paper Setting = 2, Paper Solutions = 1, Invigilation = 3, Paper Assessment/Moderation = 2
                                                        </li>
                                                        <li style={{ marginBottom: '20px' }}>
                                                            Then Final Score =
                                                            <code> 20 + 15 + 10 + 5 + 5 + (2 × 20) + (1 × 20) + (3 × 5) + (2 × 10) = 20 + 15 + 10 + 5 + 5 + 40 + 20 + 15 + 20 = 150</code>
                                                        </li>
                                                        <li>
                                                            The maximum final score is capped at 100, so if the total exceeds 100, the final score will be 100.
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
                                                <button className="submit-review-btn" onClick={() => submitReview(teacherAI12Forms[currentPage - 1]._id)}>
                                                    Submit Review
                                                </button>
                                            ) : (
                                                <>
                                                    {isReviewEditable ? (
                                                        <button className="submit-review-btn" onClick={() => submitReview(teacherAI12Forms[currentPage - 1]._id)}>
                                                            Submit Review
                                                        </button>
                                                    ) : (
                                                        <Button
                                                            onClick={() => editReview(teacherAI12Forms[currentPage - 1]._id)}
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
                    {teacherAI12Forms.map((_, index) => (
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

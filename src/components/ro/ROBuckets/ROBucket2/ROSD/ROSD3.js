import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button } from 'react-bootstrap';
import '../../../../teacher/buckets/bucket.css';
import '../../../../teacher/buckets/Bucket 1/AI/ai.css';
import ROBucket2 from '../ROBucket2';

export default function ROSD3() {
    const [submittedForms, setSubmittedForms] = useState([]);
    const [teacherSD3Forms, setTeacherSD3Forms] = useState([]);
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
            fetchTeacherSD3Form();
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
            const response = await fetch(`http://localhost:5000/api/sd3form/submissions?teacherName=${user.name}&teacherDepartment=${user.department}&formId=SD3`);
            if (!response.ok) throw new Error('Failed to fetch submitted forms');
            const result = await response.json();
            setSubmittedForms(result.reverse());
        } catch (error) {
            console.error('Error fetching submitted forms:', error);
        }
    };

    const fetchTeacherSD3Form = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/sd3form/submissions?teacherName=${teacherName}&teacherDepartment=${teacherDepartment}&employeeCode=${employeeCode}&formId=SD3`);
            if (!response.ok) throw new Error('Failed to fetch SD3 form');
            const result = await response.json();

            setTeacherSD3Forms(result.reverse());

            if (result.length > 0) {
                setScoreByRO(result[0]?.scoreByRO || '');
                setReviewByRO(result[0]?.reviewByRO || '');
                setIsReviewEditable(result[0]?.isReviewEditable || false);
            }
        } catch (error) {
            console.error('Error fetching teacher SD3 form:', error);
        }
    };

    useEffect(() => {
        if (teacherSD3Forms.length > 0) {
            const form = teacherSD3Forms[currentPage - 1]; // Get the current page form
            setScoreByRO(form?.scoreByRO || '');
            setReviewByRO(form?.reviewByRO || '');

            // If both fields are empty, allow editing; else, disable
            setIsReviewEditable(!form?.scoreByRO && !form?.reviewByRO);
        }
    }, [currentPage, teacherSD3Forms]);





    const editReview = async (formId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/sd3form/toggle-edit-review/${formId}`, {
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

            const response = await fetch(`http://localhost:5000/api/sd3form/submit-review/${formId}`, {
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

            await fetchTeacherSD3Form();

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
                <h2 style={{ backgroundColor: '#7ba591' }}>SD-3 Course Result (preceding semester of PA evaluation)
                </h2>

                {/* Teacher SD3 Form Section */}
                <div className="submitted-forms-container">
                    <h4 style={{ textAlign: 'center', backgroundColor: '#2e4756', padding: '10px', borderRadius: '5px', color: 'white', fontSize: '18px', fontWeight: 'bold' }}>
                        {teacherSD3Forms.length > 0 ? `Reviewing submissions for ${teacherName} - Page ${currentPage} of ${teacherSD3Forms.length}`
                            : `Submission 0 of 0`}
                    </h4>

                    {teacherSD3Forms.length === 0 ? (
                        <p className='noprev'>No previous SD3 submissions found for the selected teacher.</p>
                    ) : (
                        <div className="submitted-form">


                            <table className="submitted-table" style={{ marginTop: '0' }}>
                                <tbody>
                                    <tr><td><strong>Course Name:</strong></td><td>{teacherSD3Forms[currentPage - 1]?.courseName}</td></tr>
                                    <tr><td><strong>100% Students:</strong></td><td>{teacherSD3Forms[currentPage - 1]?.students100}</td></tr>
                                    <tr><td><strong>90% - 99% Students:</strong></td><td>{teacherSD3Forms[currentPage - 1]?.students90to99}</td></tr>
                                    <tr><td><strong>80% - 89% Students:</strong></td><td>{teacherSD3Forms[currentPage - 1]?.students80to89}</td></tr>
                                    <tr><td><strong>70% - 79% Students:</strong></td><td>{teacherSD3Forms[currentPage - 1]?.students70to79}</td></tr>
                                    <tr><td><strong>60% - 69% Students:</strong></td><td>{teacherSD3Forms[currentPage - 1]?.students60to69}</td></tr>
                                    <tr><td><strong>Below 60% Students:</strong></td><td>{teacherSD3Forms[currentPage - 1]?.studentsBelow60}</td></tr>
                                    <tr>
                                        <td><strong>Self Score:</strong></td>
                                        <td>{teacherSD3Forms[currentPage - 1]?.score}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Evidence Link:</strong></td>
                                        <td>
                                            <a
                                                href={teacherSD3Forms[currentPage - 1]?.linkEvidence}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                {teacherSD3Forms[currentPage - 1]?.linkEvidence}
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
                                                            The score is calculated based on the number of students who scored within each of the following ranges:
                                                            100%, 90% - 99%, 80% - 89%, 70% - 79%, 60% - 69%, and below 60%.
                                                        </li>
                                                        <li>
                                                            Each category has a specific weightage:
                                                            <ul>
                                                                <li>Students who scored 100% contribute <strong>20 points</strong> each</li>
                                                                <li>Students who scored 90% - 99% contribute <strong>15 points</strong> each</li>
                                                                <li>Students who scored 80% - 89% contribute <strong>10 points</strong> each</li>
                                                                <li>Students who scored 70% - 79% contribute <strong>7 points</strong> each</li>
                                                                <li>Students who scored 60% - 69% contribute <strong>5 points</strong> each</li>
                                                                <li>Students who scored below 60% contribute <strong>0 points</strong> each</li>
                                                            </ul>
                                                        </li>
                                                        <li style={{ marginBottom: '20px' }}>
                                                            After summing up all the points from each category, the total score is capped at <strong>500 points</strong>.
                                                        </li>
                                                        <li style={{ marginBottom: '20px' }}>
                                                            <strong>Example:</strong> If the input values are:<br />
                                                            Students who scored 100% = 5, Students who scored 90% - 99% = 3, Students who scored 80% - 89% = 4,<br />
                                                            Students who scored 70% - 79% = 2, Students who scored 60% - 69% = 1, Students who scored below 60% = 0.
                                                        </li>
                                                        <li style={{ marginBottom: '20px' }}>
                                                            Then the total score will be:<br />
                                                            <code>5 × 20 + 3 × 15 + 4 × 10 + 2 × 7 + 1 × 5 + 0 × 0 = 175</code>
                                                        </li>
                                                        <li>
                                                            The final score will be displayed in the system, and the total score will never exceed 500.
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
                                                <button className="submit-review-btn" onClick={() => submitReview(teacherSD3Forms[currentPage - 1]._id)}>
                                                    Submit Review
                                                </button>
                                            ) : (
                                                <>
                                                    {isReviewEditable ? (
                                                        <button className="submit-review-btn" onClick={() => submitReview(teacherSD3Forms[currentPage - 1]._id)}>
                                                            Submit Review
                                                        </button>
                                                    ) : (
                                                        <Button
                                                            onClick={() => editReview(teacherSD3Forms[currentPage - 1]._id)}
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
                    {teacherSD3Forms.map((_, index) => (
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

import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button } from 'react-bootstrap';
import '../../../../teacher/buckets/bucket.css';
import '../../../../teacher/buckets/Bucket 1/AI/ai.css';
import ROBucket1 from '../ROBucket1';

export default function ROAI1() {
    const [submittedForms, setSubmittedForms] = useState([]);
    const [teacherAI1Forms, setTeacherAI1Forms] = useState([]); // New state for fetching AI1 form of a specific teacher
    const [currentPage, setCurrentPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    const user = JSON.parse(localStorage.getItem('user'));
    const teacherName = localStorage.getItem('teacherName');
    const teacherDepartment = localStorage.getItem('teacherDepartment');
    const employeeCode = localStorage.getItem('employeeCode');
    const [showCertificateModal, setShowCertificateModal] = useState(false);
    const [selectedCertificateUrl, setSelectedCertificateUrl] = useState('');

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
            fetchTeacherAI1Form();
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
            const response = await fetch(`http://localhost:5000/api/ai1form/submissions?teacherName=${user.name}&teacherDepartment=${user.department}&formId=AI1`);
            if (!response.ok) throw new Error('Failed to fetch submitted forms');
            const result = await response.json();
            setSubmittedForms(result.reverse());
        } catch (error) {
            console.error('Error fetching submitted forms:', error);
        }
    };

    const fetchTeacherAI1Form = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/ai1form/submissions?teacherName=${teacherName}&teacherDepartment=${teacherDepartment}&employeeCode=${employeeCode}&formId=AI1`);
            if (!response.ok) throw new Error('Failed to fetch AI1 form');
            const result = await response.json();
            setTeacherAI1Forms(result.reverse());
            if (result.length > 0) {
                setScoreByRO(result[0]?.scoreByRO || '');
                setReviewByRO(result[0]?.reviewByRO || '');
                setIsReviewEditable(result[0]?.isReviewEditable || false);
            }
        } catch (error) {
            console.error('Error fetching teacher AI1 form:', error);
        }
    };

    const handleViewCertificate = (certificateUrl) => {
        setSelectedCertificateUrl(`http://localhost:5000${certificateUrl}`);
        setShowCertificateModal(true);
    };

    useEffect(() => {
        if (teacherAI1Forms.length > 0) {
            const form = teacherAI1Forms[currentPage - 1]; // Get the current page form
            setScoreByRO(form?.scoreByRO || '');
            setReviewByRO(form?.reviewByRO || '');

            // If both fields are empty, allow editing; else, disable
            setIsReviewEditable(!form?.scoreByRO && !form?.reviewByRO);
        }
    }, [currentPage, teacherAI1Forms]);





    const editReview = async (formId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/ai1form/toggle-edit-review/${formId}`, {
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

            const response = await fetch(`http://localhost:5000/api/ai1form/submit-review/${formId}`, {
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

            await fetchTeacherAI1Form();

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
                <h2 style={{ backgroundColor: '#537c78' }}>AI-1 Certification for Courses Allotted</h2>

                {/* Teacher AI1 Form Section */}
                <div className="submitted-forms-container">
                    <h4 style={{ textAlign: 'center', backgroundColor: '#2e4756', padding: '10px', borderRadius: '5px', color: 'white', fontSize: '18px', fontWeight: 'bold' }}>
                        {teacherAI1Forms.length > 0 ? `Reviewing submissions for ${teacherName} - Page ${currentPage} of ${teacherAI1Forms.length}`
                            : `Submission 0 of 0`}
                    </h4>


                    {teacherAI1Forms.length === 0 ? (
                        <p className='noprev'>No previous AI1 submissions found for the selected teacher.</p>
                    ) : (
                        <div className="submitted-form">
                            <table className="submitted-table" style={{ marginTop: '0' }}>
                                <tbody>
                                    <tr>
                                        <td><strong>Hours:</strong></td>
                                        <td>{teacherAI1Forms[currentPage - 1]?.hours}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Platform:</strong></td>
                                        <td>{teacherAI1Forms[currentPage - 1]?.platform}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Assessment Outcome:</strong></td>
                                        <td>{teacherAI1Forms[currentPage - 1]?.assessmentOutcome}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Date of Certification:</strong></td>
                                        <td>{teacherAI1Forms[currentPage - 1]?.dateOfCertification}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Certificate:</strong></td>
                                        <td>
                                            {teacherAI1Forms[currentPage - 1]?.certificateUrl ? (
                                                <button
                                                    className="view-certificate-btn"
                                                    onClick={() => handleViewCertificate(teacherAI1Forms[currentPage - 1].certificateUrl)}
                                                >
                                                    View Certificate
                                                </button>
                                            ) : "No certificate uploaded"}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><strong>Self Score:</strong></td>
                                        <td>{teacherAI1Forms[currentPage - 1]?.score}</td>
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
                                                    <Modal.Title>Score Calculation Explanation</Modal.Title>
                                                </Modal.Header>
                                                <Modal.Body>
                                                    <ul>
                                                        <li><strong>Hours:</strong>
                                                            <ul>
                                                                <li>30+ → 1</li>
                                                                <li>20+ → 0.5</li>
                                                                <li>Below 20 → 0</li>
                                                            </ul>
                                                        </li>
                                                        <li><strong>Platform:</strong>
                                                            <ul>
                                                                <li>National Professor → 1.5</li>
                                                                <li>State Professor → 1</li>
                                                                <li>Other → 0.4</li>
                                                            </ul>
                                                        </li>
                                                        <li><strong>Assessment Outcome:</strong>
                                                            <ul>
                                                                <li>B or above → 1</li>
                                                                <li>Pass → 0.4</li>
                                                                <li>Audit → 0.2</li>
                                                                <li>Fail → 0</li>
                                                            </ul>
                                                        </li>
                                                        <li><strong>Date of Certification:</strong>
                                                            <ul>
                                                                <li>Within 2 years → 1</li>
                                                                <li>2 to 4 years → 0.75</li>
                                                                <li>4 to 6 years → 0.4</li>
                                                                <li>More than 6 years → 0</li>
                                                            </ul>
                                                        </li>
                                                    </ul>
                                                    <p><strong>Final Score = Product of All Factors × 100</strong></p>
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
                                                <button className="submit-review-btn" onClick={() => submitReview(teacherAI1Forms[currentPage - 1]._id)}>
                                                    Submit Review
                                                </button>
                                            ) : (
                                                <>
                                                    {isReviewEditable ? (
                                                        <button className="submit-review-btn" onClick={() => submitReview(teacherAI1Forms[currentPage - 1]._id)}>
                                                            Submit Review
                                                        </button>
                                                    ) : (
                                                        <Button
                                                            onClick={() => editReview(teacherAI1Forms[currentPage - 1]._id)}
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
                    {teacherAI1Forms.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentPage(index + 1)}
                            className={`btn ${currentPage === index + 1 ? 'btn-success' : 'btn-outline-secondary'}`}
                            style={{ margin: '0 5px' }}>
                            {index + 1}
                        </button>
                    ))}
                </div>

                {/* Success/Error Modal */}
                <Modal show={showModal} onHide={() => setShowModal(false)}>
                    <Modal.Body>{modalMessage}</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
                    </Modal.Footer>
                </Modal>
                <Modal
                    show={showCertificateModal}
                    onHide={() => setShowCertificateModal(false)}
                    size="xl"
                    centered
                    dialogClassName="custom-modal"
                >
                    <Modal.Header className="border-0">
                        <Button
                            variant="danger"
                            onClick={() => setShowCertificateModal(false)}
                            style={{ position: 'absolute', left: '10px', top: '10px', zIndex: 10 }}
                        >
                            Close
                        </Button>
                    </Modal.Header>
                    <Modal.Body className="d-flex justify-content-center align-items-center">
                        {selectedCertificateUrl ? (
                            <iframe
                                src={selectedCertificateUrl}
                                title="Certificate"
                                width="100%"
                                height="800px"  // Increased height
                                style={{ border: 'none' }}
                            ></iframe>
                        ) : (
                            <p>No certificate available.</p>
                        )}
                    </Modal.Body>
                </Modal>

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

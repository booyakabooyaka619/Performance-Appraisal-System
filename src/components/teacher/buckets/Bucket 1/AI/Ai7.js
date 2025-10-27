import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Modal } from 'react-bootstrap';
import './ai.css';
import Bucket1 from '../Bucket1';

export default function Ai7() {
    const [formData, setFormData] = useState({
        courseName: '', // Course Name (Text field)
        theoryNotes: '', // Quality factor for Theory Notes (0-1)
        eBook: '', // Quality factor for E-Book/Digital Content (0-1)
        resourceBook: '', // Quality factor for Resource Book/Lab Manual (0-1)
        aapValidation: '', // Quality factor for AAP validation (0-1)
        linkEvidence: ''
    });

    const [submittedForms, setSubmittedForms] = useState([]);
    const [score, setScore] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [isEditing, setIsEditing] = useState(false);
    const [editFormId, setEditFormId] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteFormId, setDeleteFormId] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false); // State for submission status
    const [reviewStatus, setReviewStatus] = useState(false);
    const [showScoreInfoModal, setShowScoreInfoModal] = useState(false);


    const user = JSON.parse(localStorage.getItem('user'));
    const employeeCode = user.employeeCode;


    useEffect(() => {
        fetchSubmittedForms();
    }, [user]);

    const fetchSubmittedForms = async () => {
        if (!user) return;
        try {
            const response = await fetch(`http://localhost:5000/api/ai7form/submissions?teacherName=${user.name}&teacherDepartment=${user.department}&formId=AI7`);
            if (!response.ok) throw new Error('Failed to fetch submitted forms');
            const result = await response.json();
            setSubmittedForms(result.reverse());
        } catch (error) {
            console.error('Error fetching submitted forms:', error);
        }
    };

    useEffect(() => {
        const fetchReviewStatus = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/reviews/teacher-review-status/${employeeCode}`);
                const data = await response.json();

                if (response.ok) {
                    setReviewStatus(data.isReviewClickable);
                } else {
                    console.error("Error fetching review status:", data.message);
                }
            } catch (error) {
                console.error("Error fetching review status:", error);
            }
        };

        fetchReviewStatus();
    }, [employeeCode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Calculate score based on formData
    const calculateScore = (formData) => {
        // Assign max marks for each factor
        const maxMarks = {
            theoryNotes: 40,
            eBook: 30,
            resourceBook: 20,
            aapValidation: 10
        };

        // Calculate score for each factor by multiplying input value with max marks
        const theoryNotesScore = parseFloat(formData.theoryNotes || 0) * maxMarks.theoryNotes;
        const eBookScore = parseFloat(formData.eBook || 0) * maxMarks.eBook;
        const resourceBookScore = parseFloat(formData.resourceBook || 0) * maxMarks.resourceBook;
        const aapValidationScore = parseFloat(formData.aapValidation || 0) * maxMarks.aapValidation;

        // Calculate total score
        const calculatedScore = theoryNotesScore + eBookScore + resourceBookScore + aapValidationScore;

        setScore(calculatedScore); // Update the score state
    };

    // Recalculate score when formData changes
    useEffect(() => {
        calculateScore(formData); // Recalculate the score whenever formData changes
    }, [formData]); // Trigger when any part of formData changes

    const fetchSubmissionStatus = async () => {
        if (!user || !user.name) {
            console.warn("User data is missing or incomplete");
            return;
        }

        const apiUrl = `http://localhost:5000/api/submitStatus?teacherName=${encodeURIComponent(user.name)}`;

        try {
            const response = await fetch(apiUrl);

            if (!response.ok) {
                if (response.status === 404) {
                    console.log("Teacher not found or no submission recorded");
                    setIsSubmitted(false);
                    return;
                }
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            setIsSubmitted(result.isSubmitted);
        } catch (error) {
            console.error("Error fetching submission status:", error);
        }
    };

    // Fetch submission status when the component mounts
    useEffect(() => {
        if (user?.name) {
            fetchSubmissionStatus();
        }
    }, [user?.name]); // Only re-run when `user.name` changes

    const handleConfirmSubmit = (e) => {
        e.preventDefault();
        if (!formData.courseName ||
            !formData.theoryNotes ||
            !formData.eBook ||
            !formData.resourceBook ||
            !formData.aapValidation ||
            !formData.linkEvidence
        ) {
            setModalMessage('All fields are required');
            setShowModal(true);
            return;
        }
        setShowConfirmModal(true);
    };

    const handleSubmit = async () => {
        try {
            const formId = "AI7";

            // Ensure user details are included
            const dataToSubmit = {
                ...formData,
                formId,
                teacherName: user?.name,
                teacherDepartment: user?.department,
                score
            };

            let response;

            if (isEditing) {
                response = await fetch(`http://localhost:5000/api/ai7form/${editFormId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dataToSubmit),
                });
            } else {
                response = await fetch('http://localhost:5000/api/ai7form', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dataToSubmit),
                });
            }

            const responseData = await response.json();
            console.log('API Response:', responseData);

            if (!response.ok) {
                throw new Error(`Failed to submit form: ${responseData.message || 'Unknown error'}`);
            }

            setFormData({
                courseName: '', // Course Name (Text field)
                theoryNotes: '', // Quality factor for Theory Notes (0-1)
                eBook: '', // Quality factor for E-Book/Digital Content (0-1)
                resourceBook: '', // Quality factor for Resource Book/Lab Manual (0-1)
                aapValidation: '', // Quality factor for AAP validation (0-1)
                linkEvidence: ''
            });

            setScore(0);
            setShowConfirmModal(false);
            setModalMessage('Form submitted successfully!');
            setShowModal(true);
            setShowForm(false);
            setCurrentPage(1);
            setIsEditing(false);  // Reset editing state
            setEditFormId(null);  // Clear the editFormId
            fetchSubmittedForms();

        } catch (error) {
            console.error('Error submitting form:', error);
            setModalMessage(`Error: ${error.message}`);
            setShowModal(true);
        }
    };



    const handleEdit = (form) => {
        setFormData({
            courseName: form.courseName,
            theoryNotes: form.theoryNotes,
            eBook: form.eBook,
            resourceBook: form.resourceBook,
            aapValidation: form.aapValidation,
            linkEvidence: form.linkEvidence
        });
        setShowForm(true);
        setIsEditing(true);
        setEditFormId(form._id); // Assuming you have a unique ID for each form submission
    };



    const handleDelete = async () => {
        try {
            // Delete the form
            const response = await fetch(`http://localhost:5000/api/ai7form/${deleteFormId}`, { method: 'DELETE' });

            if (!response.ok) throw new Error('Failed to delete form');

            // Update the state to remove the deleted form
            const updatedForms = submittedForms.filter(form => form._id !== deleteFormId);
            setSubmittedForms(updatedForms);

            // Check if the current page is empty after the deletion
            if (updatedForms.length === 0 || currentPage > updatedForms.length) {
                setCurrentPage(1);  // Reset to first page if no forms or current page exceeds total
            }

            setShowDeleteModal(false);
        } catch (error) {
            console.error('Error deleting form:', error);
        }
    };


    return (
        <>
            <Bucket1 />
            <div className="bt-container">
                <h2 style={{ backgroundColor: '#537c78' }}>AI-7  Contribution towards Learning Resources Development at Institute</h2>

                <div className="vertical-compartment-box"></div>

                {!showForm ? (
                    <>
                        <div className="submitted-forms-container">
                            <h4 style={{
                                textAlign: 'center',
                                backgroundColor: '#77aa79',
                                padding: '10px',
                                borderRadius: '5px',
                                color: 'white',
                                fontSize: '18px',
                                fontWeight: 'bold',
                                border: '2px solid rgb(120, 175, 126)',
                                marginBottom: '15px'
                            }}>
                                {submittedForms.length > 0 ? `Submission ${currentPage} of ${submittedForms.length}` : `Submission 0 of 0`}
                            </h4>

                            {submittedForms.length === 0 ? (
                                <p className="noprev">No previous submissions found.</p>
                            ) : (
                                <div className="submitted-form">
                                    <div className="edit-delete-cont">
                                        <button
                                            onClick={() => handleEdit(submittedForms[currentPage - 1])}
                                            className={`edit-btn ${isSubmitted ? "disabled-btn" : ""}`}
                                            disabled={isSubmitted}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => {
                                                setDeleteFormId(submittedForms[currentPage - 1]._id);
                                                setShowDeleteModal(true);
                                            }}
                                            className={`delete-btn ${isSubmitted ? "disabled-btn" : ""}`}
                                            disabled={isSubmitted}
                                        >
                                            Delete
                                        </button>
                                    </div>

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
                                                <li>
                                                    <strong>Theory Notes Score:</strong>
                                                    Quality factor (between 0 and 1) × 40 (Max Marks for Theory Notes).
                                                    <br />
                                                    <em>Example: If input is 0.8, score = 0.8 × 40 = 32</em>
                                                </li>
                                                <li>
                                                    <strong>E-Book Score:</strong>
                                                    Quality factor × 30 (Max Marks for E-Book).
                                                    <br />
                                                    <em>Example: If input is 1, score = 1 × 30 = 30</em>
                                                </li>
                                                <li>
                                                    <strong>Resource Book Score:</strong>
                                                    Quality factor × 20 (Max Marks for Resource Book).
                                                    <br />
                                                    <em>Example: If input is 0.5, score = 0.5 × 20 = 10</em>
                                                </li>
                                                <li>
                                                    <strong>AAP Validation Score:</strong>
                                                    Quality factor × 10 (Max Marks for AAP Validation).
                                                    <br />
                                                    <em>Example: If input is 1, score = 1 × 10 = 10</em>
                                                </li>
                                                <li>
                                                    <strong>Total Score:</strong>
                                                    Sum of all four individual scores.
                                                    <br />
                                                    <em>Example: 32 + 30 + 10 + 10 = 82</em>
                                                </li>
                                            </ul>
                                        </Modal.Body>
                                        <Modal.Footer>
                                            <Button variant="secondary" onClick={() => setShowScoreInfoModal(false)}>
                                                Close
                                            </Button>
                                        </Modal.Footer>
                                    </Modal>


                                    <table className="submitted-table">
                                        <tbody>
                                            <tr>
                                                <td><strong>Course Name:</strong></td>
                                                <td>{submittedForms[currentPage - 1]?.courseName}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Theory Notes Quality Factor (0-1):</strong></td>
                                                <td>{submittedForms[currentPage - 1]?.theoryNotes}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>E-Book Quality Factor (0-1):</strong></td>
                                                <td>{submittedForms[currentPage - 1]?.eBook}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Resource Book Quality Factor (0-1):</strong></td>
                                                <td>{submittedForms[currentPage - 1]?.resourceBook}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>AAP Validation Quality Factor (0-1):</strong></td>
                                                <td>{submittedForms[currentPage - 1]?.aapValidation}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Self Score:</strong></td>
                                                <td>{submittedForms[currentPage - 1]?.score}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Evidence Link:</strong></td>
                                                <td>
                                                    <a
                                                        href={submittedForms[currentPage - 1]?.linkEvidence}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        {submittedForms[currentPage - 1]?.linkEvidence}
                                                    </a>
                                                </td>
                                            </tr>
                                            {reviewStatus ? (
                                                // If review is complete, show finalized Score & Remark
                                                <>
                                                    <tr>
                                                        <td><strong>Score by RO:</strong></td>
                                                        <td>{submittedForms[currentPage - 1]?.scoreByRO ?? "Not Available"}</td>
                                                    </tr>
                                                    <tr>
                                                        <td><strong>Remark by RO:</strong></td>
                                                        <td>{submittedForms[currentPage - 1]?.reviewByRO ?? "Not Available"}</td>
                                                    </tr>
                                                </>
                                            ) : (
                                                // If review is not complete, show "Pending Review" and "No Remark"
                                                <>
                                                    <tr>
                                                        <td><strong>Score by RO:</strong></td>
                                                        <td className={submittedForms[currentPage - 1]?.roReview ? "status-green" : "status-red"}>
                                                            {submittedForms[currentPage - 1]?.roReview || "Pending Review"}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td><strong>Remark by RO:</strong></td>
                                                        <td className={submittedForms[currentPage - 1]?.roRemark ? "status-green" : "status-red"}>
                                                            {submittedForms[currentPage - 1]?.roRemark || "No Remark"}
                                                        </td>
                                                    </tr>
                                                </>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        <div className="pagination" style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
                            {submittedForms.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentPage(index + 1)}
                                    className={`btn ${currentPage === index + 1 ? 'btn-success' : 'btn-outline-secondary'}`}
                                    style={{ margin: '0 5px' }}>
                                    {index + 1}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => setShowForm(true)}
                            className={`custom-submit-btn ${isSubmitted ? "disabled-btn" : ""}`}
                            disabled={isSubmitted}
                        >
                            Submit a Form
                        </button>
                    </>
                ) : (
                    <form className='form-container' onSubmit={handleConfirmSubmit}>
                        <h4 className='newprev'>{isEditing ? "Edit Submission" : "New Form Submission"}</h4>

                        <div className="marks-container">
                            <div className="marks-item marks-item-header">Marks (M)</div>
                            <div className="marks-item marks-item-value">100</div>
                            <div className="marks-item marks-item-header">Maximum marks with bonus</div>
                            <div className="marks-item marks-item-value">100</div>
                            <div className="marks-item marks-item-header">Self Score</div>
                            <div className="marks-item marks-item-value">{score}</div> {/* Display calculated score */}
                        </div>

                        <div className="form-group">
                            <label className='label1'>Course Name
                                <input
                                    type="text"
                                    className='linkinput'
                                    name="courseName"
                                    value={formData.courseName}
                                    onChange={handleChange}
                                    required
                                />
                            </label>
                        </div>

                        <div className="form-group">
                            <label className='label1'>Theory Notes Quality Factor (0-1)
                                <input
                                    type="number"
                                    className='input-field'
                                    name="theoryNotes"
                                    value={formData.theoryNotes}
                                    onChange={handleChange}
                                    min="0"
                                    max="1"
                                    step="0.01"
                                    required
                                />
                            </label>
                        </div>

                        <div className="form-group">
                            <label className='label1'>E-Book Quality Factor (0-1)
                                <input
                                    type="number"
                                    className='input-field'
                                    name="eBook"
                                    value={formData.eBook}
                                    onChange={handleChange}
                                    min="0"
                                    max="1"
                                    step="0.01"
                                    required
                                />
                            </label>
                        </div>

                        <div className="form-group">
                            <label className='label1'>Resource Book Quality Factor (0-1)
                                <input
                                    type="number"
                                    className='input-field'
                                    name="resourceBook"
                                    value={formData.resourceBook}
                                    onChange={handleChange}
                                    min="0"
                                    max="1"
                                    step="0.01"
                                    required
                                />
                            </label>
                        </div>

                        <div className="form-group">
                            <label className='label1'>AAP Validation Quality Factor (0-1)
                                <input
                                    type="number"
                                    className='input-field'
                                    name="aapValidation"
                                    value={formData.aapValidation}
                                    onChange={handleChange}
                                    min="0"
                                    max="1"
                                    step="0.01"
                                    required
                                />
                            </label>
                        </div>

                        <div className='form-group'>
                            <label className='label1'>Evidence Link:
                                <input
                                    type="url"
                                    className='linkinput'
                                    name="linkEvidence"
                                    value={formData.linkEvidence}
                                    onChange={handleChange}
                                    pattern="https?://.*"
                                    title="Please enter a valid URL (e.g., http://example.com)"
                                />
                            </label>
                        </div>

                        <div className="button-container">
                            <button type="submit" className='submit-btn'>{isEditing ? "Save Changes" : "Submit"}</button>
                            <button
                                type="button"
                                className="cancel-btn"
                                onClick={() => {
                                    setShowForm(false);   // Hide the form
                                    setIsEditing(false);  // Exit edit mode
                                    setEditFormId(null);  // Clear the editing form ID
                                    setFormData({         // Reset form fields
                                        courseName: '', // Course Name (Text field)
                                        theoryNotes: '', // Quality factor for Theory Notes (0-1)
                                        eBook: '', // Quality factor for E-Book/Digital Content (0-1)
                                        resourceBook: '', // Quality factor for Resource Book/Lab Manual (0-1)
                                        aapValidation: '', // Quality factor for AAP validation (0-1)
                                        linkEvidence: ''
                                    });
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>


                )}

                <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
                    <Modal.Body>Are you sure you want to submit the form?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" onClick={() => setShowConfirmModal(false)}>Cancel</Button>
                        <Button variant="success" onClick={handleSubmit}>Yes, Submit</Button>
                    </Modal.Footer>
                </Modal>

                {/* Success/Error Modal */}
                <Modal show={showModal} onHide={() => setShowModal(false)}>
                    <Modal.Body>{modalMessage}</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                    <Modal.Body>Are you sure you want to delete this submission?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
                        <Button variant="danger" onClick={handleDelete}>Delete</Button>
                    </Modal.Footer>
                </Modal>

            </div>
        </>
    );
};

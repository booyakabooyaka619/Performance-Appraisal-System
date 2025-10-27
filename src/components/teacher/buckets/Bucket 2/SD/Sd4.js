import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Modal } from 'react-bootstrap';
import Bucket2 from '../Bucket2';

export default function Sd4() {
    const [formData, setFormData] = useState({
        courseName: '',
        feedback: '',
        attendance: '',
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
            const response = await fetch(`http://localhost:5000/api/sd4form/submissions?teacherName=${user.name}&teacherDepartment=${user.department}&formId=SD4`);
            if (!response.ok) throw new Error('Failed to fetch submitted forms');
            const result = await response.json();
            setSubmittedForms(result.reverse());
        } catch (error) {
            console.error('Error fetching submitted forms:', error);
        }
    };

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

    useEffect(() => {
        const { feedback, attendance } = formData;

        let scoreM = 0;
        let finalScore = 0;

        const f = parseFloat(feedback);
        const a = parseFloat(attendance);

        if (!isNaN(f) && !isNaN(a)) {
            if (f >= 3.5) scoreM = 300;
            else if (f >= 3.0) scoreM = 210;
            else if (f >= 2.5) scoreM = 150;
            else scoreM = 0;

            finalScore = scoreM * (a / 100);
            finalScore = Math.round(finalScore * 100) / 100;

            // If score ends with .5, round up to next integer
            const decimalPart = finalScore % 1;
            if (decimalPart === 0.5) {
                finalScore = Math.ceil(finalScore);
            }
        }

        setScore(finalScore);
    }, [formData.feedback, formData.attendance]);



    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleConfirmSubmit = (e) => {
        e.preventDefault();
        const { courseName, feedback, attendance, linkEvidence } = formData;

        if (!courseName || !feedback || !attendance || !linkEvidence) {
            setModalMessage('All fields are required');
            setShowModal(true);
            return;
        }

        setShowConfirmModal(true);
    };



    const handleSubmit = async () => {
        try {
            const formId = "SD4";

            // Ensure user details and score are included
            const dataToSubmit = {
                ...formData,
                formId,
                teacherName: user?.name,
                teacherDepartment: user?.department,
                score // Include calculated score
            };

            let response;

            if (isEditing) {
                response = await fetch(`http://localhost:5000/api/sd4form/${editFormId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dataToSubmit),
                });
            } else {
                response = await fetch('http://localhost:5000/api/sd4form', {
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

            // Reset form and state
            setFormData({
                courseName: '',
                feedback: '',
                attendance: '',
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
            feedback: form.feedback,
            attendance: form.attendance,
            linkEvidence: form.linkEvidence
        });
        setShowForm(true);
        setIsEditing(true);
        setEditFormId(form._id); // assuming each form has a unique _id
    };



    const handleDelete = async () => {
        try {
            // Delete the form
            const response = await fetch(`http://localhost:5000/api/sd4form/${deleteFormId}`, { method: 'DELETE' });

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
            <Bucket2 />
            <div className="bt-container">
                <h2 style={{ backgroundColor: '#7ba591' }}>SD-4 Student Feedback (during PA evaluation period)
                </h2>

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


                                    <table className="submitted-table">
                                        <tbody>
                                            <tr>
                                                <td><strong>Course Name:</strong></td>
                                                <td>{submittedForms[currentPage - 1]?.courseName}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Feedback:</strong></td>
                                                <td>{submittedForms[currentPage - 1]?.feedback}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Attendance (%):</strong></td>
                                                <td>{submittedForms[currentPage - 1]?.attendance}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Link Evidence:</strong></td>
                                                <td>{submittedForms[currentPage - 1]?.linkEvidence}</td>
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
                            {/* Create 6 compartments (after removing the review score compartment) */}
                            <div className="marks-item marks-item-header">Marks (M)</div>
                            <div className="marks-item marks-item-value">300</div>
                            <div className="marks-item marks-item-header">Maximum marks with bonus</div>
                            <div className="marks-item marks-item-value">300</div>
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
                                />
                            </label>
                        </div>

                        <div className="form-group">
                            <label className='label1'>Feedback (0 to 4)
                                <input
                                    type="number"
                                    className='linkinput'
                                    step="0.01"
                                    min="0"
                                    max="4"
                                    name="feedback"
                                    value={formData.feedback}
                                    onChange={handleChange}
                                />
                            </label>
                        </div>

                        <div className="form-group">
                            <label className='label1'>Course Attendance (%)
                                <input
                                    type="number"
                                    className='linkinput'
                                    name="attendance"
                                    value={formData.attendance}
                                    onChange={handleChange}
                                    min="0"
                                    max="100"
                                />
                            </label>
                        </div>

                        <div className="form-group">
                            <label className='label1'>Evidence Link
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

                        {/* <div className="form-group">
                            <label className='label1'>Score:
                                <input type="text" className='linkinput' value={score} disabled />
                            </label>
                        </div> */}


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
                                        courseName: '',
                                        feedback: '',
                                        attendance: '',
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

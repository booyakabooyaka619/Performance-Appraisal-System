import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Modal } from 'react-bootstrap';
import Bucket2 from '../Bucket2';

export default function Sd3() {
    const [formData, setFormData] = useState({
        courseName: '',
        students100: '',
        students90to99: '',
        students80to89: '',
        students70to79: '',
        students60to69: '',
        studentsBelow60: '',
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
            const response = await fetch(`http://localhost:5000/api/sd3form/submissions?teacherName=${user.name}&teacherDepartment=${user.department}&formId=SD3`);
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
        calculateScore();
    }, [
        formData.students100,
        formData.students90to99,
        formData.students80to89,
        formData.students70to79,
        formData.students60to69,
        formData.studentsBelow60
    ]);

    const calculateScore = () => {
        const {
            students100,
            students90to99,
            students80to89,
            students70to79,
            students60to69,
            studentsBelow60
        } = formData;

        const s100 = parseInt(students100) || 0;
        const s90 = parseInt(students90to99) || 0;
        const s80 = parseInt(students80to89) || 0;
        const s70 = parseInt(students70to79) || 0;
        const s60 = parseInt(students60to69) || 0;
        const sBelow60 = parseInt(studentsBelow60) || 0;

        let totalScore = (s100 * 20) + (s90 * 15) + (s80 * 10) + (s70 * 7) + (s60 * 5) + (sBelow60 * 0);

        if (totalScore > 500) {
            totalScore = 500;
        }

        setScore(totalScore);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleConfirmSubmit = (e) => {
        e.preventDefault();
        if (
            !formData.courseName ||
            !formData.students100 ||
            !formData.students90to99 ||
            !formData.students80to89 ||
            !formData.students70to79 ||
            !formData.students60to69 ||
            !formData.studentsBelow60 ||
            !formData.linkEvidence
        ) {
            setModalMessage('All fields are required');
            setShowModal(true);
            return;
        }

        calculateScore();
        setShowConfirmModal(true);
    };


    const handleSubmit = async () => {
        try {
            const formId = "SD3";

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
                response = await fetch(`http://localhost:5000/api/sd3form/${editFormId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dataToSubmit),
                });
            } else {
                response = await fetch('http://localhost:5000/api/sd3form', {
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
                students100: '',
                students90to99: '',
                students80to89: '',
                students70to79: '',
                students60to69: '',
                studentsBelow60: '',
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
            students100: form.students100,
            students90to99: form.students90to99,
            students80to89: form.students80to89,
            students70to79: form.students70to79,
            students60to69: form.students60to69,
            studentsBelow60: form.studentsBelow60,
            linkEvidence: form.linkEvidence
        });
        setShowForm(true);
        setIsEditing(true);
        setEditFormId(form._id);
    };


    const handleDelete = async () => {
        try {
            // Delete the form
            const response = await fetch(`http://localhost:5000/api/sd3form/${deleteFormId}`, { method: 'DELETE' });

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
                <h2 style={{ backgroundColor: '#7ba591' }}>SD-3 Course Result (preceding semester of PA evaluation)
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


                                    <table className="submitted-table">
                                        <tbody>
                                            <tr><td><strong>Course Name:</strong></td><td>{submittedForms[currentPage - 1]?.courseName}</td></tr>
                                            <tr><td><strong>100% Students:</strong></td><td>{submittedForms[currentPage - 1]?.students100}</td></tr>
                                            <tr><td><strong>90% - 99% Students:</strong></td><td>{submittedForms[currentPage - 1]?.students90to99}</td></tr>
                                            <tr><td><strong>80% - 89% Students:</strong></td><td>{submittedForms[currentPage - 1]?.students80to89}</td></tr>
                                            <tr><td><strong>70% - 79% Students:</strong></td><td>{submittedForms[currentPage - 1]?.students70to79}</td></tr>
                                            <tr><td><strong>60% - 69% Students:</strong></td><td>{submittedForms[currentPage - 1]?.students60to69}</td></tr>
                                            <tr><td><strong>Below 60% Students:</strong></td><td>{submittedForms[currentPage - 1]?.studentsBelow60}</td></tr>
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
                            <div className="marks-item marks-item-value">500</div>
                            <div className="marks-item marks-item-header">Maximum marks with bonus</div>
                            <div className="marks-item marks-item-value">500</div>
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
                            <label className='label1'>No. of students who scored 100%
                                <input
                                    type="number"
                                    className='linkinput'
                                    name="students100"
                                    value={formData.students100}
                                    onChange={handleChange}
                                    min="0"
                                />
                            </label>
                        </div>

                        <div className="form-group">
                            <label className='label1'>No. of students who scored 90% - 99%
                                <input
                                    type="number"
                                    className='linkinput'
                                    name="students90to99"
                                    value={formData.students90to99}
                                    onChange={handleChange}
                                    min="0"
                                />
                            </label>
                        </div>

                        <div className="form-group">
                            <label className='label1'>No. of students who scored 80% - 89%
                                <input
                                    type="number"
                                    className='linkinput'
                                    name="students80to89"
                                    value={formData.students80to89}
                                    onChange={handleChange}
                                    min="0"
                                />
                            </label>
                        </div>

                        <div className="form-group">
                            <label className='label1'>No. of students who scored 70% - 79%
                                <input
                                    type="number"
                                    className='linkinput'
                                    name="students70to79"
                                    value={formData.students70to79}
                                    onChange={handleChange}
                                    min="0"
                                />
                            </label>
                        </div>

                        <div className="form-group">
                            <label className='label1'>No. of students who scored 60% - 69%
                                <input
                                    type="number"
                                    className='linkinput'
                                    name="students60to69"
                                    value={formData.students60to69}
                                    onChange={handleChange}
                                    min="0"
                                />
                            </label>
                        </div>

                        <div className="form-group">
                            <label className='label1'>No. of students who scored below 60%
                                <input
                                    type="number"
                                    className='linkinput'
                                    name="studentsBelow60"
                                    value={formData.studentsBelow60}
                                    onChange={handleChange}
                                    min="0"
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
                                        students100: '',
                                        students90to99: '',
                                        students80to89: '',
                                        students70to79: '',
                                        students60to69: '',
                                        studentsBelow60: '',
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

import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button } from 'react-bootstrap';
import Bucket1 from '../Bucket1';

export default function Ai31() {
    const [formData, setFormData] = useState({
        qualityOfSpeaker: '',
        feedbackReceived: '',
        numberOfAttendees: '',
        numberOfStudents: '',
        mapping: '',
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
            const response = await fetch(`http://localhost:5000/api/ai31form/submissions?teacherName=${user.name}&teacherDepartment=${user.department}&formId=AI31`);
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


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Calculate score based on formData
    const calculateScore = () => {
        const factor = 75;  // Given constant multiplication factor

        // Extract values directly from formData
        let W1 = 0;
        let W3 = 0;

        // Determine W1 (Quality of Speaker)
        switch (formData.qualityOfSpeaker) {
            case "International/National VP and above / Unicorn Startup – CXO":
            case "International/National Prof. & Above":
                W1 = 1.0;
                break;
            case "SME":
            case "State":
                W1 = 0.5;
                break;
            default:
                W1 = 0; // No selection
        }

        // Determine W2 (Feedback Weightage)
        const attendees = parseInt(formData.numberOfAttendees) || 0;
        const totalStudents = parseInt(formData.numberOfStudents) || 1; // Avoid division by zero
        const W2 = parseFloat(formData.feedbackReceived) >= 2.5 ? (attendees / totalStudents) : 0;

        // Determine W3 (Mapping)
        switch (formData.mapping) {
            case "Strongly":
                W3 = 1.5;
                break;
            case "Moderately":
                W3 = 1.0;
                break;
            case "Neither":
                W3 = 0.0;
                break;
            default:
                W3 = 0; // No selection
        }

        // Calculate and return the final score
        return Math.round(W1 * W2 * W3 * factor);
    };

    // Recalculate score when formData changes
    useEffect(() => {
        const newScore = calculateScore();
        setScore(newScore);  // Update the score state
    }, [formData]);  // Runs every time formData changes



    const handleConfirmSubmit = (e) => {
        e.preventDefault();
        if (!formData.qualityOfSpeaker || !formData.feedbackReceived || !formData.numberOfAttendees || !formData.numberOfStudents || !formData.mapping || !formData.linkEvidence) {
            setModalMessage('All fields are required');
            setShowModal(true);
            return;
        }
        setShowConfirmModal(true);
    };

    const handleSubmit = async () => {
        try {
            const formId = "AI31";

            // Ensure user details are included
            const dataToSubmit = {
                ...formData,
                formId,
                teacherName: user?.name,  // Ensure teacherName is added
                teacherDepartment: user?.department,  // Ensure teacherDepartment is added
                score
            };

            let response;

            if (isEditing) {
                response = await fetch(`http://localhost:5000/api/ai31form/${editFormId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dataToSubmit),
                });
            } else {
                response = await fetch('http://localhost:5000/api/ai31form', {
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
                qualityOfSpeaker: '',
                feedbackReceived: '',
                numberOfAttendees: '',
                numberOfStudents: '',
                mapping: '',
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
            qualityOfSpeaker: form.qualityOfSpeaker,
            feedbackReceived: form.feedbackReceived,
            numberOfAttendees: form.numberOfAttendees,
            numberOfStudents: form.numberOfStudents,
            mapping: form.mapping,
            linkEvidence: form.linkEvidence
        });
        setShowForm(true);
        setIsEditing(true);
        setEditFormId(form._id); // Assuming you have a unique ID for each form submission
    };


    const handleDelete = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/ai31form/${deleteFormId}`, { method: 'DELETE' });

            if (!response.ok) throw new Error('Failed to delete form');

            const updatedForms = submittedForms.filter(form => form._id !== deleteFormId);
            setSubmittedForms(updatedForms);

            if (updatedForms.length === 0 || currentPage > updatedForms.length) {
                setCurrentPage(1);
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
                <h2 style={{ backgroundColor: '#537c78' }}>AI-3.1 BSA - Guest Lecture</h2>

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
                                <p className='noprev'>No previous submissions found.</p>
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


                                    <table className="submitted-table">
                                        <tbody>
                                            <tr>
                                                <td><strong>Quality of Speaker:</strong></td>
                                                <td>{submittedForms[currentPage - 1]?.qualityOfSpeaker}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Feedback Received:</strong></td>
                                                <td>{submittedForms[currentPage - 1]?.feedbackReceived}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Number of Attendees:</strong></td>
                                                <td>{submittedForms[currentPage - 1]?.numberOfAttendees}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Number of Students:</strong></td>
                                                <td>{submittedForms[currentPage - 1]?.numberOfStudents}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Mapping to Objectives:</strong></td>
                                                <td>{submittedForms[currentPage - 1]?.mapping}</td>
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
                            <div className="marks-item marks-item-value">75</div>
                            <div className="marks-item marks-item-header">Maximum marks with bonus</div>
                            <div className="marks-item marks-item-value">113</div>
                            <div className="marks-item marks-item-header">Self Score</div>
                            <div className="marks-item marks-item-value">{score}</div> {/* Display calculated score */}
                        </div>

                        <div className='form-group'>
                            <label className='label1'>Quality of Speaker:
                                <select name="qualityOfSpeaker" className="select-input" value={formData.qualityOfSpeaker} onChange={handleChange}>
                                    <option value="">Select</option>
                                    <option value="International/National VP and above / Unicorn Startup – CXO">International/National VP and above / Unicorn Startup – CXO</option>
                                    <option value="SME">SME</option>
                                    <option value="International/National Prof. & Above">International/National Prof. & Above</option>
                                    <option value="State">State</option>
                                </select>
                            </label>
                        </div>

                        <div className='form-group'>
                            <label className='label1'>Feedback Received:
                                <input
                                    type="number"
                                    name="feedbackReceived"
                                    value={formData.feedbackReceived}
                                    onChange={handleChange}
                                    min="0"
                                    max="4"
                                    step="0.01" // allows up to 2 decimal places
                                    required
                                    className="input-field"
                                />
                            </label>
                        </div>

                        <div className='form-group'>
                            <label className='label1'>Number of Attendees:
                                <input
                                    type="number"
                                    name="numberOfAttendees"
                                    value={formData.numberOfAttendees}
                                    onChange={handleChange}
                                    required
                                    className="input-field"
                                />
                            </label>
                        </div>

                        <div className='form-group'>
                            <label className='label1'>Number of Students:
                                <input
                                    type="number"
                                    name="numberOfStudents"
                                    value={formData.numberOfStudents}
                                    onChange={handleChange}
                                    required
                                    className="input-field"
                                />
                            </label>
                        </div>

                        <div className='form-group'>
                            <label className='label1'>Mapping to Objectives:
                                <select name="mapping" className="select-input" value={formData.mapping} onChange={handleChange}>
                                    <option value="">Select</option>
                                    <option value="Strongly">Strongly</option>
                                    <option value="Moderately">Moderately</option>
                                    <option value="Neither">Neither</option>
                                </select>
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
                                        qualityOfSpeaker: '',
                                        feedbackReceived: '',
                                        numberOfAttendees: '',
                                        numberOfStudents: '',
                                        mapping: '',
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

                <Modal show={showModal} onHide={() => setShowModal(false)}>
                    <Modal.Body>{modalMessage}</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                    <Modal.Body>Are you sure you want to delete this form?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
                        <Button variant="success" onClick={handleDelete}>Delete</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </>
    );
}

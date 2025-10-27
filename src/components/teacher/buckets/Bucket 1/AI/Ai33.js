import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button } from 'react-bootstrap';
import Bucket1 from '../Bucket1';

export default function Ai33() {
    const [formData, setFormData] = useState({
        typeOfEvent: '',
        awardsReceived: '',
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
            const response = await fetch(`http://localhost:5000/api/ai33form/submissions?teacherName=${user.name}&teacherDepartment=${user.department}&formId=AI33`);
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

    const calculateScore = () => {
        let E = 0; // Type of Event weight
        let A = 1; // Awards Received weight (default 1 for 'None')
        let F = 0; // Feedback score
        let M = 0; // Mapping weight

        const factor = 75; // Given multiplication factor

        // Determine E (Type of Event)
        switch (formData.typeOfEvent) {
            case "International (1.5)":
                E = 1.5;
                break;
            case "National (1.3)":
                E = 1.3;
                break;
            case "State Level (1.2)":
                E = 1.2;
                break;
            case "Intercollegiate (City Level) (1.1)":
                E = 1.1;
                break;
            case "Inter-Departmental (1.0)":
                E = 1.0;
                break;
            case "Within Class (0.5)":
                E = 0.5;
                break;
            default:
                E = 0;
        }

        // Determine A (Awards Received)
        switch (formData.awardsReceived) {
            case "International":
                A = 2.0;
                break;
            case "National":
                A = 1.8;
                break;
            case "State Level":
                A = 1.6;
                break;
            case "Intercollegiate (City Level)":
                A = 1.4; // Assuming awarded events get a boost
                break;
            case "None (1)":
            default:
                A = 1; // Default weight
        }

        // Determine F (Feedback-based score)
        const attendees = parseInt(formData.numberOfAttendees) || 0;
        const totalStudents = parseInt(formData.numberOfStudents) || 1; // Avoid division by zero
        const feedbackReceived = parseFloat(formData.feedbackReceived) || 0;

        if (feedbackReceived >= 2.5) {
            F = attendees / totalStudents;
        } else {
            F = 0;
        }

        // Determine M (Mapping)
        switch (formData.mapping) {
            case "Strongly to PO (1.5)":
                M = 1.5;
                break;
            case "Strongly to CO (1)":
            case "Moderately to PO (1)":
                M = 1.0;
                break;
            case "Moderately to CO (0.8)":
                M = 0.8;
                break;
            case "Neither mapping to PO or CO (0)":
            default:
                M = 0;
        }

        // Calculate final score and round to nearest integer
        return Math.round(E * A * F * M * factor);
    };


    useEffect(() => {
        setScore(calculateScore());
    }, [formData]); // Runs whenever formData changes

    const handleConfirmSubmit = (e) => {
        e.preventDefault();
        if (!formData.typeOfEvent || !formData.awardsReceived || !formData.feedbackReceived || !formData.numberOfAttendees || !formData.numberOfStudents || !formData.mapping || !formData.linkEvidence) {
            setModalMessage('All fields are required');
            setShowModal(true);
            return;
        }
        setShowConfirmModal(true);
    };

    const handleSubmit = async () => {
        try {
            const formId = "AI33";

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
                response = await fetch(`http://localhost:5000/api/ai33form/${editFormId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dataToSubmit),
                });
            } else {
                response = await fetch('http://localhost:5000/api/ai33form', {
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
                typeOfEvent: '',
                awardsReceived: '',
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
            typeOfEvent: form.typeOfEvent,
            awardsReceived: form.awardsReceived,
            feedbackReceived: form.feedbackReceived,
            numberOfAttendees: form.numberOfAttendees,
            numberOfStudents: form.numberOfStudents,
            mapping: form.mapping,
            linkEvidence: form.linkEvidence
        });
        setShowForm(true);
        setIsEditing(true);
        setEditFormId(form._id);
    };

    const handleDelete = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/ai33form/${deleteFormId}`, { method: 'DELETE' });

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
                <h2 style={{ backgroundColor: '#537c78' }}>AI-3.3 BSA - Co-curricular</h2>

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
                                                    The final score is calculated using the following formula:<br />
                                                    <code>Score = E × A × F × M × 75</code><br />
                                                    Where:
                                                    <ul>
                                                        <li><strong>E</strong> = Weight based on <em>Type of Event</em></li>
                                                        <li><strong>A</strong> = Weight based on <em>Awards Received</em></li>
                                                        <li><strong>F</strong> = Feedback score (calculated only if feedback ≥ 2.5)</li>
                                                        <li><strong>M</strong> = Weight based on <em>PO/CO Mapping</em></li>
                                                    </ul>
                                                </li>

                                                <li style={{ marginBottom: '20px' }}>
                                                    <strong>Feedback Score (F):</strong><br />
                                                    <code>F = Number of Attendees / Total Students</code> <br />
                                                    <span style={{ fontStyle: 'italic' }}>Only if feedback received ≥ 2.5. Otherwise, F = 0.</span>
                                                </li>

                                                <li>
                                                    <strong>Example:</strong><br />
                                                    Type of Event = International (1.5)<br />
                                                    Awards Received = National (1.8)<br />
                                                    Feedback Received = 3.0<br />
                                                    Number of Attendees = 90<br />
                                                    Total Students = 100<br />
                                                    Mapping = Strongly to PO (1.5)
                                                </li>

                                                <li style={{ marginBottom: '20px' }}>
                                                    <strong>Then:</strong><br />
                                                    <code>F = 90 / 100 = 0.9</code><br />
                                                    <code>Final Score = 1.5 × 1.8 × 0.9 × 1.5 × 75 = 273.375 ≈ 273</code>
                                                </li>

                                                <li>
                                                    A higher score can be achieved by selecting more impactful options and ensuring good feedback with high participation.
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
                                                <td><strong>Type of Event:</strong></td>
                                                <td>{submittedForms[currentPage - 1]?.typeOfEvent}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Awards Received:</strong></td>
                                                <td>{submittedForms[currentPage - 1]?.awardsReceived}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Feedback Received:</strong></td>
                                                <td>{submittedForms[currentPage - 1]?.feedbackReceived}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Number of Attendees (A):</strong></td>
                                                <td>{submittedForms[currentPage - 1]?.numberOfAttendees}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Total Students (T):</strong></td>
                                                <td>{submittedForms[currentPage - 1]?.numberOfStudents}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Mapping:</strong></td>
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
                            <div className="marks-item marks-item-header">Marks (M)</div>
                            <div className="marks-item marks-item-value">75</div>
                            <div className="marks-item marks-item-header">Maximum marks with bonus</div>
                            <div className="marks-item marks-item-value">338</div>
                            <div className="marks-item marks-item-header">Self Score</div>
                            <div className="marks-item marks-item-value">{score}</div> {/* Display calculated score */}
                        </div>

                        {/* Type of Event Dropdown */}
                        <div className='form-group'>
                            <label className='label1'>Type of Event:
                                <select name="typeOfEvent" className="select-input" value={formData.typeOfEvent} onChange={handleChange}>
                                    <option value="">Select</option>
                                    <option value="International (1.5)">International (1.5)</option>
                                    <option value="National (1.3)">National (1.3)</option>
                                    <option value="State Level (1.2)">State Level (1.2)</option>
                                    <option value="Intercollegiate (City Level) (1.1)">Intercollegiate (City Level) (1.1)</option>
                                    <option value="Inter-Departmental (1.0)">Inter-Departmental (1.0)</option>
                                    <option value="Within Class (0.5)">Within Class (0.5)</option>
                                </select>
                            </label>
                        </div>

                        {/* Awards Received Dropdown */}
                        <div className='form-group'>
                            <label className='label1'>Awards Received:
                                <select name="awardsReceived" className="select-input" value={formData.awardsReceived} onChange={handleChange}>
                                    <option value="">Select</option>
                                    <option value="International">International</option>
                                    <option value="National">National</option>
                                    <option value="State Level">State Level</option>
                                    <option value="Intercollegiate (City Level)">Intercollegiate (City Level)</option>
                                    <option value="None (1)">None (1)</option>
                                </select>
                            </label>
                        </div>

                        {/* Feedback Received (Number Field) */}
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

                        {/* Number of Attendees */}
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

                        {/* Total Students */}
                        <div className='form-group'>
                            <label className='label1'>Total Students:
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

                        {/* Mapping Dropdown */}
                        <div className='form-group'>
                            <label className='label1'>Mapping:
                                <select name="mapping" className="select-input" value={formData.mapping} onChange={handleChange}>
                                    <option value="">Select</option>
                                    <option value="Strongly to PO (1.5)">Strongly to PO (1.5)</option>
                                    <option value="Strongly to CO (1)">Strongly to CO (1)</option>
                                    <option value="Moderately to PO (1)">Moderately to PO (1)</option>
                                    <option value="Moderately to CO (0.8)">Moderately to CO (0.8)</option>
                                    <option value="Neither mapping to PO or CO (0)">Neither mapping to PO or CO (0)</option>
                                </select>
                            </label>
                        </div>

                        <div className="form-group">
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
                            {/* <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button> */}
                            <button
                                type="button"
                                className="cancel-btn"
                                onClick={() => {
                                    setShowForm(false);   // Hide the form
                                    setIsEditing(false);  // Exit edit mode
                                    setEditFormId(null);  // Clear the editing form ID
                                    setFormData({         // Reset form fields
                                        typeOfEvent: '',
                                        awardsReceived: '',
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

import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button } from 'react-bootstrap';
import Bucket3 from '../Bucket3';

export default function Ab4() {
    const [formData, setFormData] = useState({
        speakerCategory: '',
        eventLevel: '',
        position: '',
        duration: '',
        participation: '',
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
            const response = await fetch(`http://localhost:5000/api/ab4form/submissions?teacherName=${user.name}&teacherDepartment=${user.department}&formId=AB4`);
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

    useEffect(() => {
        const calculateScore = () => {
            const scoreMap = {
                speakerCategory: {
                    "100% speakers from 1.1 and 1.2 (1.75)": 1.75,
                    "75% (1.5)": 1.5,
                    "50% (1.25)": 1.25,
                    "Below 50% (1)": 1,
                },
                eventLevel: {
                    "International (1.5)": 1.5,
                    "National (1.25)": 1.25,
                    "State Level (1)": 1,
                    "City Level (0.8)": 0.8,
                    "Intra-collegiate (0.6)": 0.6,
                },
                position: {
                    "Convenor (1)": 1,
                    "Co-convenor (0.8)": 0.8,
                    "Organizing secretary (0.6)": 0.6,
                    "Member (0.4)": 0.4,
                },
                duration: {
                    "2 weeks (1.75)": 1.75,
                    "1 week (1.5)": 1.5,
                    "3 days (1)": 1,
                    "2 days (0.8)": 0.8,
                    "1 day (0.6)": 0.6,
                },
                participation: {
                    "National >50% (1.5)": 1.5,
                    "National >25% (1.3)": 1.3,
                    "State >50% (1.25)": 1.25,
                    "State >25% (1.1)": 1.1,
                    "University Level >50% (1)": 1,
                    "Intra-collegiate (0.8)": 0.8,
                }
            };

            const selectedScores = [
                scoreMap.speakerCategory[formData.speakerCategory] || 0,
                scoreMap.eventLevel[formData.eventLevel] || 0,
                scoreMap.position[formData.position] || 0,
                scoreMap.duration[formData.duration] || 0,
                scoreMap.participation[formData.participation] || 0
            ];

            const product = selectedScores.reduce((acc, score) => acc * score, 1);
            setScore(Math.round(product * 100)); // Adjusted multiplier
        };

        calculateScore();
    }, [formData]);



    const handleConfirmSubmit = (e) => {
        e.preventDefault();
        if (!formData.speakerCategory || !formData.eventLevel || !formData.position || !formData.duration || !formData.participation || !formData.linkEvidence) {
            setModalMessage('All fields are required');
            setShowModal(true);
            return;
        }
        setShowConfirmModal(true);
    };





    const handleSubmit = async () => {
        try {
            const formId = "AB4";

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
                response = await fetch(`http://localhost:5000/api/ab4form/${editFormId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dataToSubmit),
                });
            } else {
                response = await fetch('http://localhost:5000/api/ab4form', {
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
                speakerCategory: '',
                eventLevel: '',
                position: '',
                duration: '',
                participation: '',
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
            speakerCategory: form.speakerCategory,
            eventLevel: form.eventLevel,
            position: form.position,
            duration: form.duration,
            participation: form.participation,
            linkEvidence: form.linkEvidence
        });
        setShowForm(true);
        setIsEditing(true);
        setEditFormId(form._id);
    };




    const handleDelete = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/ab4form/${deleteFormId}`, { method: 'DELETE' });

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
            <Bucket3 />
            <div className="bt-container">
                <h2 style={{ backgroundColor: '#cc222b' }}>AB-4 Teaching-Learning Evaluation Technology Programmes
                </h2>

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
                                                    The score is calculated by multiplying the selected values from each category:
                                                    Speaker Category, Event Level, Position in Committee, Duration, and Participation Level.
                                                </li>
                                                <li>
                                                    After multiplying all the values, the result is multiplied by 100 to get the final score.
                                                </li>
                                                <li style={{ marginBottom: '20px' }}>
                                                    <strong>Example:</strong> If the selected values are:<br />
                                                    Speaker Category = 1.75, Event Level = 1.25, Position = 0.8, Duration = 1.5, Participation Level = 1.3
                                                </li>
                                                <li style={{ marginBottom: '20px' }}>
                                                    Then Final Score = <code>1.75 × 1.25 × 0.8 × 1.5 × 1.3 × 100 = 341.25</code>
                                                </li>
                                                <li>
                                                    Higher selections lead to higher scores.
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
                                            <tr><td><strong>Speaker Category:</strong></td><td>{submittedForms[currentPage - 1]?.speakerCategory}</td></tr>
                                            <tr><td><strong>Event Level:</strong></td><td>{submittedForms[currentPage - 1]?.eventLevel}</td></tr>
                                            <tr><td><strong>Position in Committee:</strong></td><td>{submittedForms[currentPage - 1]?.position}</td></tr>
                                            <tr><td><strong>Duration:</strong></td><td>{submittedForms[currentPage - 1]?.duration}</td></tr>
                                            <tr><td><strong>Participation Level:</strong></td><td>{submittedForms[currentPage - 1]?.participation}</td></tr>
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
                            <div className="marks-item marks-item-value">689</div>
                            <div className="marks-item marks-item-header">Self Score</div>
                            <div className="marks-item marks-item-value">{score}</div> {/* Display calculated score */}
                        </div>

                        <div className='form-group'>
                            <label>1.1 Industry Expert: International/National VP and above / Unicorn Startup – CXO <br />
                                1.2 (Top University: National / International) – Prof. and Above:
                                <select name="speakerCategory" value={formData.speakerCategory} onChange={handleChange} className="select-input">
                                    <option value="">Select</option>
                                    <option value="100% speakers from 1.1 and 1.2 (1.75)">100% from 1.1 and 1.2 (1.75)</option>
                                    <option value="75% (1.5)">75% (1.5)</option>
                                    <option value="50% (1.25)">50% (1.25)</option>
                                    <option value="Below 50% (1)">Below 50% (1)</option>
                                </select>
                            </label>
                        </div>

                        <div className='form-group'>
                            <label>Event Level:
                                <select name="eventLevel" value={formData.eventLevel} onChange={handleChange} className="select-input">
                                    <option value="">Select</option>
                                    <option value="International (1.5)">International (1.5)</option>
                                    <option value="National (1.25)">National (1.25)</option>
                                    <option value="State Level (1)">State Level (1)</option>
                                    <option value="City Level (0.8)">City Level (0.8)</option>
                                    <option value="Intra-collegiate (0.6)">Intra-collegiate (0.6)</option>
                                </select>
                            </label>
                        </div>

                        <div className='form-group'>
                            <label>Position in Committee:
                                <select name="position" value={formData.position} onChange={handleChange} className="select-input">
                                    <option value="">Select</option>
                                    <option value="Convenor (1)">Convenor (1)</option>
                                    <option value="Co-convenor (0.8)">Co-convenor (0.8)</option>
                                    <option value="Organizing secretary (0.6)">Organizing secretary (0.6)</option>
                                    <option value="Member (0.4)">Member (0.4)</option>
                                </select>
                            </label>
                        </div>

                        <div className='form-group'>
                            <label>Duration:
                                <select name="duration" value={formData.duration} onChange={handleChange} className="select-input">
                                    <option value="">Select</option>
                                    <option value="2 weeks (1.75)">2 weeks (1.75)</option>
                                    <option value="1 week (1.5)">1 week (1.5)</option>
                                    <option value="3 days (1)">3 days (1)</option>
                                    <option value="2 days (0.8)">2 days (0.8)</option>
                                    <option value="1 day (0.6)">1 day (0.6)</option>
                                </select>
                            </label>
                        </div>

                        <div className='form-group'>
                            <label>Participation Level:
                                <select name="participation" value={formData.participation} onChange={handleChange} className="select-input">
                                    <option value="">Select</option>
                                    <option value="National >50% (1.5)">National less than 50% (1.5)</option>
                                    <option value="National >25% (1.3)">National less than 25% (1.3)</option>
                                    <option value="State >50% (1.25)">State less than50% (1.25)</option>
                                    <option value="State >25% (1.1)">State less than 25% (1.1)</option>
                                    <option value="University Level >50% (1)">University Level less than 50% (1)</option>
                                    <option value="Intra-collegiate (0.8)">Intra-collegiate (0.8)</option>
                                </select>
                            </label>
                        </div>



                        {/* Evidence Link Input */}
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
                                        speakerCategory: '',
                                        eventLevel: '',
                                        position: '',
                                        duration: '',
                                        participation: '',
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

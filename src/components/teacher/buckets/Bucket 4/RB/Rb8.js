import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button } from 'react-bootstrap';
import Bucket4 from '../Bucket4';

export default function Rb8() {
    const [formData, setFormData] = useState({
        organisingAgency: '',
        speakerQuality: '',
        duration: '',
        modeOfConduct: '',
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
            const response = await fetch(`http://localhost:5000/api/rb8form/submissions?teacherName=${user.name}&teacherDepartment=${user.department}&formId=RB8`);
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
                organisingAgency: {
                    "Industry (1.75)": 1.75,
                    "IIT and Top Universities (1.5)": 1.5,
                    "State Government / AICTE and equivalent sponsored (1.25)": 1.25,
                    "ISTE / University / State College sponsored or equivalent etc (1)": 1
                },
                speakerQuality: {
                    "Industry Expert: International/National VP and above / Unicorn Startup – CXO (1.5)": 1.5,
                    "Top University: National / International – Prof. and Above (1.25)": 1.25
                },
                duration: {
                    "2 weeks (1.75)": 1.75,
                    "1 week (1.5)": 1.5,
                    "3 days (1)": 1,
                    "2 days (0.8)": 0.8,
                    "1 day (0.6)": 0.6
                },
                modeOfConduct: {
                    "Offline (1)": 1,
                    "Online (0.8)": 0.8
                }
            };

            const selectedScores = [
                scoreMap.organisingAgency[formData.organisingAgency] || 0,
                scoreMap.speakerQuality[formData.speakerQuality] || 0,
                scoreMap.duration[formData.duration] || 0,
                scoreMap.modeOfConduct[formData.modeOfConduct] || 0,
            ];

            const product = selectedScores.reduce((acc, score) => acc * score, 1);
            setScore(Math.round(product * 50)); // Final score based on weighted product
        };

        calculateScore();
    }, [formData]);


    const handleConfirmSubmit = (e) => {
        e.preventDefault();
        if (!formData.organisingAgency || !formData.speakerQuality || !formData.duration || !formData.modeOfConduct || !formData.linkEvidence) {
            setModalMessage('All fields are required');
            setShowModal(true);
            return;
        }
        setShowConfirmModal(true);
    };

    const handleSubmit = async () => {
        try {
            const formId = "RB8";

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
                response = await fetch(`http://localhost:5000/api/rb8form/${editFormId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dataToSubmit),
                });
            } else {
                response = await fetch('http://localhost:5000/api/rb8form', {
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
                organisingAgency: '',
                speakerQuality: '',
                duration: '',
                modeOfConduct: '',
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
            organisingAgency: form.organisingAgency,
            speakerQuality: form.speakerQuality,
            duration: form.duration,
            modeOfConduct: form.modeOfConduct,
            linkEvidence: form.linkEvidence
        });
        setShowForm(true);
        setIsEditing(true);
        setEditFormId(form._id);
    };


    const handleDelete = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/rb8form/${deleteFormId}`, { method: 'DELETE' });

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
            <Bucket4 />
            <div className="bt-container">
                <h2 style={{ backgroundColor: '#f15b4c ' }}>RB-8 Participation in STTPs/FDPs/ Workshops/ Seminars/ Symposiums/ Conferences/ Industrial Training
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
                                                    The score is calculated by multiplying the selected values from each of the following categories:
                                                    <strong> Organising Agency, Quality of Speaker, Duration,</strong> and <strong>Mode of Conduct</strong>.
                                                </li>
                                                <li>
                                                    After multiplying the values from all categories, the result is multiplied by <strong>50</strong> to get the final score.
                                                </li>
                                                <li style={{ marginBottom: '20px' }}>
                                                    <strong>Example:</strong> If the selected values are:<br />
                                                    Organising Agency = 1.75,<br />
                                                    Quality of Speaker = 1.5,<br />
                                                    Duration = 1.5,<br />
                                                    Mode of Conduct = 1
                                                </li>
                                                <li style={{ marginBottom: '20px' }}>
                                                    Then Final Score = <code>1.75 × 1.5 × 1.5 × 1 × 50 = 197</code>
                                                </li>
                                                <li>
                                                    Higher selections in each category lead to a higher score.
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
                                                <td><strong>Organising Agency:</strong></td>
                                                <td>{submittedForms[currentPage - 1]?.organisingAgency}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Quality of Speaker:</strong></td>
                                                <td>{submittedForms[currentPage - 1]?.speakerQuality}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Duration:</strong></td>
                                                <td>{submittedForms[currentPage - 1]?.duration}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Mode of Conduct:</strong></td>
                                                <td>{submittedForms[currentPage - 1]?.modeOfConduct}</td>
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
                            <div className="marks-item marks-item-value">50</div>
                            <div className="marks-item marks-item-header">Maximum marks with bonus</div>
                            <div className="marks-item marks-item-value">230</div>
                            <div className="marks-item marks-item-header">Self Score</div>
                            <div className="marks-item marks-item-value">{score}</div> {/* Display calculated score */}
                        </div>

                        <div className='form-group'>
                            <label className='label1'>Organising Agency:
                                <select name="organisingAgency" className="select-input" value={formData.organisingAgency} onChange={handleChange}>
                                    <option value="">Select</option>
                                    <option value="Industry (1.75)">Industry (1.75)</option>
                                    <option value="IIT and Top Universities (1.5)">IIT and Top Universities (1.5)</option>
                                    <option value="State Government / AICTE and equivalent sponsored (1.25)">State Government / AICTE and equivalent sponsored (1.25)</option>
                                    <option value="ISTE / University / State College sponsored or equivalent etc (1)">ISTE / University / State College sponsored or equivalent etc (1)</option>
                                </select>
                            </label>
                        </div>

                        {/* Quality of Speaker */}
                        <div className='form-group'>
                            <label className='label1'>Quality of Speaker:
                                <select name="speakerQuality" className="select-input" value={formData.speakerQuality} onChange={handleChange}>
                                    <option value="">Select</option>
                                    <option value="Industry Expert: International/National VP and above / Unicorn Startup – CXO (1.5)">Industry Expert: International/National VP and above / Unicorn Startup – CXO (1.5)</option>
                                    <option value="Top University: National / International – Prof. and Above (1.25)">Top University: National / International – Prof. and Above (1.25)</option>
                                </select>
                            </label>
                        </div>

                        {/* Duration */}
                        <div className='form-group'>
                            <label className='label1'>Duration:
                                <select name="duration" className="select-input" value={formData.duration} onChange={handleChange}>
                                    <option value="">Select</option>
                                    <option value="2 weeks (1.75)">2 weeks (1.75)</option>
                                    <option value="1 week (1.5)">1 week (1.5)</option>
                                    <option value="3 days (1)">3 days (1)</option>
                                    <option value="2 days (0.8)">2 days (0.8)</option>
                                    <option value="1 day (0.6)">1 day (0.6)</option>
                                </select>
                            </label>
                        </div>

                        {/* Mode of Conduct */}
                        <div className='form-group'>
                            <label className='label1'>Mode of Conduct:
                                <select name="modeOfConduct" className="select-input" value={formData.modeOfConduct} onChange={handleChange}>
                                    <option value="">Select</option>
                                    <option value="Offline (1)">Offline (1)</option>
                                    <option value="Online (0.8)">Online (0.8)</option>
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
                                        organisingAgency: '',
                                        speakerQuality: '',
                                        duration: '',
                                        modeOfConduct: '',
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

import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button } from 'react-bootstrap';
import Bucket4 from '../Bucket4';

export default function Rb2() {
    const [formData, setFormData] = useState({
        quality: '',
        impactFactor: '',
        level: '',
        authorship: '',
        reviewType: '',
        availability: '',
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
            const response = await fetch(`http://localhost:5000/api/rb2form/submissions?teacherName=${user.name}&teacherDepartment=${user.department}&formId=RB2`);
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
                quality: {
                    "Scopus/Web/ICI/ABDC/FT45 (1.5)": 1.5,
                    "UGC approved /ISBN/ISSN (0.9)": 0.9,
                    "None (0.5)": 0.5,
                },
                impactFactor: {
                    "Greater than 3 (1.25)": 1.25,
                    "Between 1 to 3 (1)": 1,
                    "Less than 1 (0.8)": 0.8,
                },
                level: {
                    "International (1.25)": 1.25,
                    "National (1)": 1,
                    "State Level (0.8)": 0.8,
                    "Any other (0)": 0,
                },
                authorship: {
                    "Author (1)": 1,
                    "Co-author (0.8)": 0.8,
                },
                reviewType: {
                    "Referred/Peer Review (1)": 1,
                    "Non-Referred (0.8)": 0.8,
                },
                availability: {
                    "Hardcopy journal (1.25)": 1.25,
                    "E-journal (1)": 1,
                },
            };

            const selectedScores = [
                scoreMap.quality[formData.quality] || 0,
                scoreMap.impactFactor[formData.impactFactor] || 0,
                scoreMap.level[formData.level] || 0,
                scoreMap.authorship[formData.authorship] || 0,
                scoreMap.reviewType[formData.reviewType] || 0,
                scoreMap.availability[formData.availability] || 0,
            ];

            // Don't calculate if any score is 0 (i.e., not selected)
            if (selectedScores.includes(0)) {
                setScore(0);
                return;
            }

            const total = selectedScores.reduce((acc, score) => acc * score, 1);
            setScore(Math.round(total * 100)); // Use 200 as multiplier
        };

        calculateScore();
    }, [formData]);



    const handleConfirmSubmit = (e) => {
        e.preventDefault();

        if (
            !formData.quality ||
            !formData.impactFactor ||
            !formData.level ||
            !formData.authorship ||
            !formData.reviewType ||
            !formData.availability ||
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
            const formId = "RB2";

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
                response = await fetch(`http://localhost:5000/api/rb2form/${editFormId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dataToSubmit),
                });
            } else {
                response = await fetch('http://localhost:5000/api/rb2form', {
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
                quality: '',
                impactFactor: '',
                level: '',
                authorship: '',
                reviewType: '',
                availability: '',
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
            quality: form.quality,
            impactFactor: form.impactFactor,
            level: form.level,
            authorship: form.authorship,
            reviewType: form.reviewType,
            availability: form.availability,
            linkEvidence: form.linkEvidence
        });
        setShowForm(true);
        setIsEditing(true);
        setEditFormId(form._id);
    };



    const handleDelete = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/rb2form/${deleteFormId}`, { method: 'DELETE' });

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
                <h2 style={{ backgroundColor: '#f15b4c ' }}>RB-2 Papers Publication in Journal
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
                                                <li style={{ marginBottom: '15px' }}>
                                                    The final score is calculated by multiplying the selected values from each of the following six categories:
                                                    <strong> Quality of Journal, Impact Factor, Level, Authorship, Type of Review, and Availability.</strong>
                                                </li>
                                                <li style={{ marginBottom: '15px' }}>
                                                    After multiplying all selected values together, the result is multiplied by <strong>100</strong> to get the final score.
                                                </li>
                                                <li style={{ marginBottom: '15px' }}>
                                                    <strong>Example:</strong><br />
                                                    If the selected values are:<br />
                                                    Quality = 1.5, Impact Factor = 1.25, Level = 1.25, Authorship = 1, Review Type = 1, Availability = 1.25
                                                </li>
                                                <li style={{ marginBottom: '15px' }}>
                                                    Then Final Score =<br />
                                                    <code>1.5 × 1.25 × 1.25 × 1 × 1 × 1.25 × 100 = 292.97</code>
                                                </li>
                                                <li>
                                                    Any unselected field (or a zero-rated selection like "Any other") will result in a score of 0.
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
                                            <tr><td><strong>Quality of Journal:</strong></td><td>{submittedForms[currentPage - 1]?.quality}</td></tr>
                                            <tr><td><strong>Impact Factor:</strong></td><td>{submittedForms[currentPage - 1]?.impactFactor}</td></tr>
                                            <tr><td><strong>Level:</strong></td><td>{submittedForms[currentPage - 1]?.level}</td></tr>
                                            <tr><td><strong>Authorship:</strong></td><td>{submittedForms[currentPage - 1]?.authorship}</td></tr>
                                            <tr><td><strong>Type of Review:</strong></td><td>{submittedForms[currentPage - 1]?.reviewType}</td></tr>
                                            <tr><td><strong>Availability:</strong></td><td>{submittedForms[currentPage - 1]?.availability}</td></tr>
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
                            <div className="marks-item marks-item-value">293</div>
                            <div className="marks-item marks-item-header">Self Score</div>
                            <div className="marks-item marks-item-value">{score}</div> {/* Display calculated score */}
                        </div>

                        <div className='form-group'>
                            <label className='label1'>Quality of the Journal:
                                <select name="quality" className="select-input" value={formData.quality} onChange={handleChange}>
                                    <option value="">Select</option>
                                    <option value="Scopus/Web/ICI/ABDC/FT45 (1.5)">Scopus/Web/ICI/ABDC/FT45 (1.5)</option>
                                    <option value="UGC approved /ISBN/ISSN (0.9)">UGC approved /ISBN/ISSN (0.9)</option>
                                    <option value="None (0.5)">None (0.5)</option>
                                </select>
                            </label>
                        </div>

                        <div className='form-group'>
                            <label className='label1'>Impact Factor:
                                <select name="impactFactor" className="select-input" value={formData.impactFactor} onChange={handleChange}>
                                    <option value="">Select</option>
                                    <option value="Greater than 3 (1.25)">Greater than 3 (1.25)</option>
                                    <option value="Between 1 to 3 (1)">Between 1 to 3 (1)</option>
                                    <option value="Less than 1 (0.8)">Less than 1 (0.8)</option>
                                </select>
                            </label>
                        </div>

                        <div className='form-group'>
                            <label className='label1'>Level:
                                <select name="level" className="select-input" value={formData.level} onChange={handleChange}>
                                    <option value="">Select</option>
                                    <option value="International (1.25)">International (1.25)</option>
                                    <option value="National (1)">National (1)</option>
                                    <option value="State Level (0.8)">State Level (0.8)</option>
                                    <option value="Any other (0)">Any other (0)</option>
                                </select>
                            </label>
                        </div>

                        <div className='form-group'>
                            <label className='label1'>Authorship:
                                <select name="authorship" className="select-input" value={formData.authorship} onChange={handleChange}>
                                    <option value="">Select</option>
                                    <option value="Author (1)">Author (1)</option>
                                    <option value="Co-author (0.8)">Co-author (0.8)</option>
                                </select>
                            </label>
                        </div>

                        <div className='form-group'>
                            <label className='label1'>Type of Review:
                                <select name="reviewType" className="select-input" value={formData.reviewType} onChange={handleChange}>
                                    <option value="">Select</option>
                                    <option value="Referred/Peer Review (1)">Referred/Peer Review (1)</option>
                                    <option value="Non-Referred (0.8)">Non-Referred (0.8)</option>
                                </select>
                            </label>
                        </div>

                        <div className='form-group'>
                            <label className='label1'>Availability:
                                <select name="availability" className="select-input" value={formData.availability} onChange={handleChange}>
                                    <option value="">Select</option>
                                    <option value="Hardcopy journal (1.25)">Hardcopy journal (1.25)</option>
                                    <option value="E-journal (1)">E-journal (1)</option>
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
                                        quality: '',
                                        impactFactor: '',
                                        level: '',
                                        authorship: '',
                                        reviewType: '',
                                        availability: '',
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

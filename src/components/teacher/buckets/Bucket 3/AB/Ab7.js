import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button } from 'react-bootstrap';
import Bucket3 from '../Bucket3';

export default function Ab7() {
    const [formData, setFormData] = useState({
        role1: '',
        role2: '',
        role3: '',
        role4: '',
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
            const response = await fetch(`http://localhost:5000/api/ab7form/submissions?teacherName=${user.name}&teacherDepartment=${user.department}&formId=AB7`);
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
                role1: {
                    "Three Roles (3)": 3,
                    "Two Roles (2)": 2,
                    "One Role (1)": 1,
                    "": 0,
                },
                role2: {
                    "Yes (0.5)": 0.5,
                    "No (0)": 0,
                    "": 0,
                },
                role3: {
                    "Yes (0.3)": 0.3,
                    "No (0)": 0,
                    "": 0,
                },
                role4: {
                    "Yes (0.2)": 0.2,
                    "No (0)": 0,
                    "": 0,
                },
            };

            const total =
                (scoreMap.role1[formData.role1] || 0) +
                (scoreMap.role2[formData.role2] || 0) +
                (scoreMap.role3[formData.role3] || 0) +
                (scoreMap.role4[formData.role4] || 0);

            const calculatedScore = total * 100;
            const finalScore = calculatedScore > 370 ? 370 : calculatedScore;

            setScore(finalScore);
        };

        calculateScore();
    }, [formData]);


    const handleConfirmSubmit = (e) => {
        e.preventDefault();
        if (!formData.role1 || !formData.role2 || !formData.role3 || !formData.role4 || !formData.linkEvidence) {
            setModalMessage('All fields are required');
            setShowModal(true);
            return;
        }
        setShowConfirmModal(true);
    };

    const handleSubmit = async () => {
        try {
            const formId = "AB7";

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
                response = await fetch(`http://localhost:5000/api/ab7form/${editFormId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dataToSubmit),
                });
            } else {
                response = await fetch('http://localhost:5000/api/ab7form', {
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
                role1: '',
                role2: '',
                role3: '',
                role4: '',
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
            role1: form.role1,
            role2: form.role2,
            role3: form.role3,
            role4: form.role4,
            linkEvidence: form.linkEvidence,
        });
        setShowForm(true);
        setIsEditing(true);
        setEditFormId(form._id);
    };


    const handleDelete = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/ab7form/${deleteFormId}`, { method: 'DELETE' });

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
                <h2 style={{ backgroundColor: '#cc222b' }}>AB-7 Institutional Governance Responsibilities
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
                                                    The score is calculated by adding the selected values from the following roles:
                                                    <ul style={{ marginTop: '10px' }}>
                                                        <li><strong>Role 1</strong> - Principal/CEO/VP/etc. (Max 3)</li>
                                                        <li><strong>Role 2</strong> - HOD/Controller of Exam (0.5 if Yes)</li>
                                                        <li><strong>Role 3</strong> - DAO/NBA/NAAC roles (0.3 if Yes)</li>
                                                        <li><strong>Role 4</strong> - Cluster mentor/Criterion Incharges (0.2 if Yes)</li>
                                                    </ul>
                                                </li>
                                                <li style={{ marginBottom: '20px' }}>
                                                    The total score is the sum of these values multiplied by 100.
                                                </li>
                                                <li style={{ marginBottom: '20px' }}>
                                                    If the total exceeds 370, it is capped at 370.
                                                </li>
                                                <li style={{ marginBottom: '20px' }}>
                                                    <strong>Example:</strong><br />
                                                    Role 1 = Three Roles (3)<br />
                                                    Role 2 = Yes (0.5)<br />
                                                    Role 3 = Yes (0.3)<br />
                                                    Role 4 = Yes (0.2)
                                                </li>
                                                <li style={{ marginBottom: '20px' }}>
                                                    Then Final Score = <code>(3 + 0.5 + 0.3 + 0.2) × 100 = 400</code><br />
                                                    Since 400 is greater than 370, the final score = <code>370</code>
                                                </li>
                                                <li>
                                                    More responsibilities/roles lead to higher scores.
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
                                                <td><strong>Role 1:</strong></td>
                                                <td>{submittedForms[currentPage - 1]?.role1}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Role 2:</strong></td>
                                                <td>{submittedForms[currentPage - 1]?.role2}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Role 3:</strong></td>
                                                <td>{submittedForms[currentPage - 1]?.role3}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Role 4:</strong></td>
                                                <td>{submittedForms[currentPage - 1]?.role4}</td>
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
                            <div className="marks-item marks-item-value">370</div>
                            <div className="marks-item marks-item-header">Self Score</div>
                            <div className="marks-item marks-item-value">{score}</div> {/* Display calculated score */}
                        </div>

                        <h5 className='exp-heading'>Type of Role</h5>

                        {/* Role 1 */}
                        <div className='form-group'>
                            <label className='label1'>Principal/CEO/VP/CAO/COO/Tech Advisor/Director IQAC/NAAC or NBA Institute level Convenor:
                                <select name="role1" className="select-input" value={formData.role1} onChange={handleChange}>
                                    <option value="">Select</option>
                                    <option value="Three Roles (3)">Three Roles (3)</option>
                                    <option value="Two Roles (2)">Two Roles (2)</option>
                                    <option value="One Role (1)">One Role (1)</option>
                                </select>
                            </label>
                        </div>

                        {/* Role 2 */}
                        <div className='form-group'>
                            <label className='label1'>HOD / Controller of Exam:
                                <select name="role2" className="select-input" value={formData.role2} onChange={handleChange}>
                                    <option value="">Select</option>
                                    <option value="Yes (0.5)">Yes (0.5)</option>
                                    <option value="No (0)">No (0)</option>
                                </select>
                            </label>
                        </div>

                        {/* Role 3 */}
                        <div className='form-group'>
                            <label className='label1'>DAO / Dept NBA Coordinator / NAAC AQAR Incharges / DCoE & OSDs:
                                <select name="role3" className="select-input" value={formData.role3} onChange={handleChange}>
                                    <option value="">Select</option>
                                    <option value="Yes (0.3)">Yes (0.3)</option>
                                    <option value="No (0)">No (0)</option>
                                </select>
                            </label>
                        </div>

                        {/* Role 4 */}
                        <div className='form-group'>
                            <label className='label1'>Cluster mentor / NAAC & NBA Criterion Incharges:
                                <select name="role4" className="select-input" value={formData.role4} onChange={handleChange}>
                                    <option value="">Select</option>
                                    <option value="Yes (0.2)">Yes (0.2)</option>
                                    <option value="No (0)">No (0)</option>
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
                                        role1: '',
                                        role2: '',
                                        role3: '',
                                        role4: '',
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

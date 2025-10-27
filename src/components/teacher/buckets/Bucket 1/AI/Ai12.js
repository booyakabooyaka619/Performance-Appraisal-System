import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button } from 'react-bootstrap';
import Bucket1 from '../Bucket1';

export default function Ai12() {
    const [formData, setFormData] = useState({
        chiefConductor: '',
        capIncharge: '',
        seniorSupervisor: '',
        paperSetting: '',
        paperSolutions: '',
        vigilanceSquadMember: '',
        designOfCurriculum: '',
        invigilation: '',
        paperAssessmentModeration: '',
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
            const response = await fetch(`http://localhost:5000/api/ai12form/submissions?teacherName=${user.name}&teacherDepartment=${user.department}&formId=AI12`);
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

    const calculateScore = (data) => {
        const totalScore =
            (parseInt(data.chiefConductor) || 0) +
            (parseInt(data.capIncharge) || 0) +
            (parseInt(data.seniorSupervisor) || 0) +
            (parseInt(data.vigilanceSquadMember) || 0) +
            (parseInt(data.designOfCurriculum) || 0) +
            // Apply multipliers for specific fields
            ((parseInt(data.paperSetting) || 0) * 20) +
            ((parseInt(data.paperSolutions) || 0) * 20) +
            ((parseInt(data.invigilation) || 0) * 5) +
            ((parseInt(data.paperAssessmentModeration) || 0) * 10);

        // Ensure the total score never exceeds 100
        return Math.min(totalScore, 100);
    };

    useEffect(() => {
        const newScore = calculateScore(formData);
        setScore(newScore);
    }, [formData]); // Run this effect when formData changes

    const handleConfirmSubmit = (e) => {
        e.preventDefault();

        // Ensure all fields have at least a default value (consider "0" as valid)
        const requiredFields = [
            'chiefConductor', 'capIncharge', 'seniorSupervisor',
            'paperSetting', 'paperSolutions', 'vigilanceSquadMember',
            'designOfCurriculum', 'invigilation', 'paperAssessmentModeration',
            'linkEvidence'
        ];

        const hasEmptyField = requiredFields.some(field => formData[field] === '' || formData[field] === null);

        if (hasEmptyField) {
            setModalMessage('All fields are required');
            setShowModal(true);
            return;
        }

        setShowConfirmModal(true);
    };


    const handleSubmit = async () => {
        try {
            const formId = "AI12";

            // ✅ No need to enforce non-empty values
            const dataToSubmit = {
                ...formData,
                formId,
                teacherName: user?.name,
                teacherDepartment: user?.department,
                score
            };

            let response;

            if (isEditing) {
                response = await fetch(`http://localhost:5000/api/ai12form/${editFormId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dataToSubmit),
                });
            } else {
                response = await fetch('http://localhost:5000/api/ai12form', {
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

            // Reset form after submission
            setFormData({
                chiefConductor: "",
                capIncharge: "",
                seniorSupervisor: "",
                paperSetting: "",
                paperSolutions: "",
                vigilanceSquadMember: "",
                designOfCurriculum: "",
                invigilation: "",
                paperAssessmentModeration: "",
                linkEvidence: ""
            });

            setScore(0);
            setShowConfirmModal(false);
            setModalMessage('Form submitted successfully!');
            setShowModal(true);
            setShowForm(false);
            setCurrentPage(1);
            setIsEditing(false);
            setEditFormId(null);
            fetchSubmittedForms();

        } catch (error) {
            console.error('Error submitting form:', error);
            setModalMessage(`Error: ${error.message}`);
            setShowModal(true);
        }
    };



    const handleEdit = (form) => {
        setFormData({
            chiefConductor: form.chiefConductor,
            capIncharge: form.capIncharge,
            seniorSupervisor: form.seniorSupervisor,
            paperSetting: form.paperSetting,
            paperSolutions: form.paperSolutions,
            vigilanceSquadMember: form.vigilanceSquadMember,
            designOfCurriculum: form.designOfCurriculum,
            invigilation: form.invigilation,
            paperAssessmentModeration: form.paperAssessmentModeration,
            linkEvidence: form.linkEvidence

        });
        setShowForm(true);
        setIsEditing(true);
        setEditFormId(form._id); // Assuming you have a unique ID for each form submission
    };


    const handleDelete = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/ai12form/${deleteFormId}`, { method: 'DELETE' });

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
                <h2 style={{ backgroundColor: '#537c78' }}>AI-12  Exam related work</h2>

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
                                                    The score is calculated by summing up all the values entered in the following categories:
                                                    <br />
                                                    <strong>Chief Conductor, CAP Incharge, Senior Supervisor, Vigilance Squad Member, Design of Curriculum.</strong>
                                                </li>
                                                <li style={{ marginBottom: '20px' }}>
                                                    Additional fields have multipliers applied to each entry:
                                                    <br />
                                                    <strong>Paper Setting</strong> is multiplied by 20 per course,
                                                    <strong> Paper Solutions</strong> is multiplied by 20 per course,
                                                    <strong> Invigilation</strong> is multiplied by 5 per session, and
                                                    <strong> Paper Assessment/Moderation</strong> is multiplied by 10 per instance.
                                                </li>
                                                <li>
                                                    After summing all the values and applying respective multipliers, the final score is calculated.
                                                </li>
                                                <li style={{ marginBottom: '20px' }}>
                                                    <strong>Example:</strong> If the entered values are:<br />
                                                    Chief Conductor = 20, CAP Incharge = 15, Senior Supervisor = 10, Vigilance Squad Member = 5, Design of Curriculum = 5, <br />
                                                    Paper Setting = 2, Paper Solutions = 1, Invigilation = 3, Paper Assessment/Moderation = 2
                                                </li>
                                                <li style={{ marginBottom: '20px' }}>
                                                    Then Final Score =
                                                    <code> 20 + 15 + 10 + 5 + 5 + (2 × 20) + (1 × 20) + (3 × 5) + (2 × 10) = 20 + 15 + 10 + 5 + 5 + 40 + 20 + 15 + 20 = 150</code>
                                                </li>
                                                <li>
                                                    The maximum final score is capped at 100, so if the total exceeds 100, the final score will be 100.
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
                                                <td><strong>Chief Conductor (50 marks):</strong></td>
                                                <td>{submittedForms[currentPage - 1]?.chiefConductor}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>CAP Incharge (50 marks):</strong></td>
                                                <td>{submittedForms[currentPage - 1]?.capIncharge}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Senior Supervisor (30 marks):</strong></td>
                                                <td>{submittedForms[currentPage - 1]?.seniorSupervisor}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Paper Setting (20 per course):</strong></td>
                                                <td>{submittedForms[currentPage - 1]?.paperSetting}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Paper Solutions (20 per course):</strong></td>
                                                <td>{submittedForms[currentPage - 1]?.paperSolutions}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Vigilance Squad Member (20 marks):</strong></td>
                                                <td>{submittedForms[currentPage - 1]?.vigilanceSquadMember}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Design of Curriculum (10 marks):</strong></td>
                                                <td>{submittedForms[currentPage - 1]?.designOfCurriculum}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Invigilation (05 per invigilation/max):</strong></td>
                                                <td>{submittedForms[currentPage - 1]?.invigilation}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Paper Assessment/ Moderation (10 marks):</strong></td>
                                                <td>{submittedForms[currentPage - 1]?.paperAssessmentModeration}</td>
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

                        <div className='form-group'>
                            <label className='label1'>Chief Conductor (50 marks):
                                <input
                                    type="number"
                                    name="chiefConductor"
                                    value={formData.chiefConductor}
                                    onChange={handleChange}
                                    min="0"
                                    max="50"
                                    step="1"
                                    required
                                    className="input-field"
                                />
                            </label>
                        </div>

                        <div className='form-group'>
                            <label className='label1'>CAP Incharge (50 marks):
                                <input
                                    type="number"
                                    name="capIncharge"
                                    value={formData.capIncharge}
                                    onChange={handleChange}
                                    min="0"
                                    max="50"
                                    step="1"
                                    required
                                    className="input-field"
                                />
                            </label>
                        </div>

                        <div className='form-group'>
                            <label className='label1'>Senior Supervisor (30 marks):
                                <input
                                    type="number"
                                    name="seniorSupervisor"
                                    value={formData.seniorSupervisor}
                                    onChange={handleChange}
                                    min="0"
                                    max="30"
                                    step="1"
                                    required
                                    className="input-field"
                                />
                            </label>
                        </div>

                        <div className='form-group'>
                            <label className='label1'>Paper Setting (20 per course):
                                <input
                                    type="number"
                                    name="paperSetting"
                                    value={formData.paperSetting}
                                    onChange={handleChange}
                                    step="1"
                                    required
                                    className="input-field"
                                />
                            </label>
                        </div>

                        <div className='form-group'>
                            <label className='label1'>Paper Solutions (20 per course):
                                <input
                                    type="number"
                                    name="paperSolutions"
                                    value={formData.paperSolutions}
                                    onChange={handleChange}
                                    step="1"
                                    required
                                    className="input-field"
                                />
                            </label>
                        </div>

                        <div className='form-group'>
                            <label className='label1'>Vigilance Squad Member (20 marks):
                                <input
                                    type="number"
                                    name="vigilanceSquadMember"
                                    value={formData.vigilanceSquadMember}
                                    onChange={handleChange}
                                    min="0"
                                    max="20"
                                    step="1"
                                    required
                                    className="input-field"
                                />
                            </label>
                        </div>

                        <div className='form-group'>
                            <label className='label1'>Design of Curriculum (10 marks):
                                <input
                                    type="number"
                                    name="designOfCurriculum"
                                    value={formData.designOfCurriculum}
                                    onChange={handleChange}
                                    min="0"
                                    max="10"
                                    step="1"
                                    required
                                    className="input-field"
                                />
                            </label>
                        </div>

                        <div className='form-group'>
                            <label className='label1'>Invigilation (05 per invigilation/max):
                                <input
                                    type="number"
                                    name="invigilation"
                                    value={formData.invigilation}
                                    onChange={handleChange}
                                    step="1"
                                    required
                                    className="input-field"
                                />
                            </label>
                        </div>

                        <div className='form-group'>
                            <label className='label1'>Paper Assessment/Moderation (10 marks):
                                <input
                                    type="number"
                                    name="paperAssessmentModeration"
                                    value={formData.paperAssessmentModeration}
                                    onChange={handleChange}
                                    step="1"
                                    required
                                    className="input-field"
                                />
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
                            <button
                                type="button"
                                className="cancel-btn"
                                onClick={() => {
                                    setShowForm(false);   // Hide the form
                                    setIsEditing(false);  // Exit edit mode
                                    setEditFormId(null);  // Clear the editing form ID
                                    setFormData({         // Reset form fields
                                        chiefConductor: '',
                                        capIncharge: '',
                                        seniorSupervisor: '',
                                        paperSetting: '',
                                        paperSolutions: '',
                                        vigilanceSquadMember: '',
                                        designOfCurriculum: '',
                                        invigilation: '',
                                        paperAssessmentModeration: '',
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

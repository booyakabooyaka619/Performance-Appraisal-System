import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button } from 'react-bootstrap';
import Bucket3 from '../Bucket3';

export default function Ab9() {
    const [formData, setFormData] = useState({
        instituteAward: '',
        radioTVPrograms: '',
        individualAward: '',
        expertTalks: '',
        careerCounseling: '',
        eminentGuests: '',
        otherWork: '',
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
            const response = await fetch(`http://localhost:5000/api/ab9form/submissions?teacherName=${user.name}&teacherDepartment=${user.department}&formId=AB9`);
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
            ((parseInt(data.instituteAward) || 0) * 75) +
            ((parseInt(data.radioTVPrograms) || 0) * 25) +
            ((parseInt(data.individualAward) || 0) * 25) +
            ((parseInt(data.expertTalks) || 0) * 25) +
            ((parseInt(data.careerCounseling) || 0) * 10) +
            ((parseInt(data.eminentGuests) || 0) * 50) +
            ((parseInt(data.otherWork) || 0) * 5);

        return Math.min(totalScore, 200);
    };

    useEffect(() => {
        const newScore = calculateScore(formData);
        setScore(newScore);
    }, [formData]);


    const handleConfirmSubmit = (e) => {
        e.preventDefault();

        const requiredFields = [
            'instituteAward', 'radioTVPrograms', 'individualAward',
            'expertTalks', 'careerCounseling', 'eminentGuests',
            'otherWork', 'linkEvidence'
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
            const formId = "AB9";

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
                response = await fetch(`http://localhost:5000/api/ab9form/${editFormId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dataToSubmit),
                });
            } else {
                response = await fetch('http://localhost:5000/api/ab9form', {
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
                instituteAward: '',
                radioTVPrograms: '',
                individualAward: '',
                expertTalks: '',
                careerCounseling: '',
                eminentGuests: '',
                otherWork: '',
                linkEvidence: ''
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
            instituteAward: form.instituteAward,
            radioTVPrograms: form.radioTVPrograms,
            individualAward: form.individualAward,
            expertTalks: form.expertTalks,
            careerCounseling: form.careerCounseling,
            eminentGuests: form.eminentGuests,
            otherWork: form.otherWork,
            linkEvidence: form.linkEvidence
        });
        setShowForm(true);
        setIsEditing(true);
        setEditFormId(form._id);
    };



    const handleDelete = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/ab9form/${deleteFormId}`, { method: 'DELETE' });

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
                <h2 style={{ backgroundColor: '#cc222b' }}>AB-9 Institute Branding Activities
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
                                                    The score is calculated by adding the values from each activity, where each activity has a fixed weight.
                                                    The maximum total score is capped at <strong>200</strong>.
                                                </li>
                                                <li style={{ marginBottom: '20px' }}>
                                                    <strong>Activity Weights:</strong>
                                                    <ul style={{ marginTop: '10px' }}>
                                                        <li>Awards for the Institute: 75 points (max 1 count)</li>
                                                        <li>Programs on radio/TV: 25 points per program</li>
                                                        <li>Individual Awards: 25 points per award</li>
                                                        <li>Expert Talks for NBA/NAAC: 25 points per talk</li>
                                                        <li>Career Counselling Sessions: 10 points per session</li>
                                                        <li>Eminent Guests Invited: 50 points per guest</li>
                                                        <li>Any Other Significant Work: 5 points per entry</li>
                                                    </ul>
                                                </li>
                                                <li style={{ marginBottom: '20px' }}>
                                                    <strong>Example:</strong> If the user enters:
                                                    <br />
                                                    Awards for Institute = 1,<br />
                                                    Radio/TV Programs = 2,<br />
                                                    Individual Awards = 1,<br />
                                                    Expert Talks = 1,<br />
                                                    Career Counseling = 2,<br />
                                                    Eminent Guests = 1,<br />
                                                    Other Work = 3
                                                </li>
                                                <li style={{ marginBottom: '20px' }}>
                                                    Then Final Score = <code>
                                                        (1×75) + (2×25) + (1×25) + (1×25) + (2×10) + (1×50) + (3×5) = 75 + 50 + 25 + 25 + 20 + 50 + 15 = 260
                                                    </code><br />
                                                    But since the maximum allowed score is 200, the final score will be <strong>200</strong>.
                                                </li>
                                                <li>
                                                    The final score reflects both the diversity and quantity of your professional contributions.
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
                                                <td><strong>Awards for the Institute (max 75):</strong></td>
                                                <td>{submittedForms[currentPage - 1]?.instituteAward}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Programs on radio / TV (25 per program):</strong></td>
                                                <td>{submittedForms[currentPage - 1]?.radioTVPrograms}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Individual Award (25 per award):</strong></td>
                                                <td>{submittedForms[currentPage - 1]?.individualAward}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Expert Talks (25 per talk):</strong></td>
                                                <td>{submittedForms[currentPage - 1]?.expertTalks}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Career Counselling Sessions (10 per session):</strong></td>
                                                <td>{submittedForms[currentPage - 1]?.careerCounseling}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Eminent Guests Invited (50 per guest):</strong></td>
                                                <td>{submittedForms[currentPage - 1]?.eminentGuests}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Other Significant Work (5 each):</strong></td>
                                                <td>{submittedForms[currentPage - 1]?.otherWork}</td>
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
                            <div className="marks-item marks-item-value">200</div>
                            <div className="marks-item marks-item-header">Self Score</div>
                            <div className="marks-item marks-item-value">{score}</div> {/* Display calculated score */}
                        </div>

                        <div className='form-group'>
                            <label className='label1'>Awards for the Institute (max 75):
                                <input
                                    type="number"
                                    name="instituteAward"
                                    value={formData.instituteAward}
                                    onChange={handleChange}
                                    min="0"
                                    max="1"
                                    step="1"
                                    required
                                    className="input-field"
                                />
                            </label>
                        </div>

                        <div className='form-group'>
                            <label className='label1'>Programs on radio / TV (25 per program):
                                <input
                                    type="number"
                                    name="radioTVPrograms"
                                    value={formData.radioTVPrograms}
                                    onChange={handleChange}
                                    min="0"
                                    step="1"
                                    required
                                    className="input-field"
                                />
                            </label>
                        </div>

                        <div className='form-group'>
                            <label className='label1'>Individual Award (25 per award):
                                <input
                                    type="number"
                                    name="individualAward"
                                    value={formData.individualAward}
                                    onChange={handleChange}
                                    min="0"
                                    step="1"
                                    required
                                    className="input-field"
                                />
                            </label>
                        </div>

                        <div className='form-group'>
                            <label className='label1'>Expert Talks for NBA/NAAC (25 per talk):
                                <input
                                    type="number"
                                    name="expertTalks"
                                    value={formData.expertTalks}
                                    onChange={handleChange}
                                    min="0"
                                    step="1"
                                    required
                                    className="input-field"
                                />
                            </label>
                        </div>

                        <div className='form-group'>
                            <label className='label1'>Career Counselling Sessions (10 per session):
                                <input
                                    type="number"
                                    name="careerCounseling"
                                    value={formData.careerCounseling}
                                    onChange={handleChange}
                                    min="0"
                                    step="1"
                                    required
                                    className="input-field"
                                />
                            </label>
                        </div>

                        <div className='form-group'>
                            <label className='label1'>Eminent Guests Invited (50 per guest):
                                <input
                                    type="number"
                                    name="eminentGuests"
                                    value={formData.eminentGuests}
                                    onChange={handleChange}
                                    min="0"
                                    step="1"
                                    required
                                    className="input-field"
                                />
                            </label>
                        </div>

                        <div className='form-group'>
                            <label className='label1'>Any Other Significant Work (5 each):
                                <input
                                    type="number"
                                    name="otherWork"
                                    value={formData.otherWork}
                                    onChange={handleChange}
                                    min="0"
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
                                        instituteAward: '',
                                        radioTVPrograms: '',
                                        individualAward: '',
                                        expertTalks: '',
                                        careerCounseling: '',
                                        eminentGuests: '',
                                        otherWork: '',
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

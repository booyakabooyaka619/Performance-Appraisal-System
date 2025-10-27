import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button } from 'react-bootstrap';
import Bucket1 from '../Bucket1';

export default function Ai1() {
    const [formData, setFormData] = useState({
        hours: '',
        platform: '',
        assessmentOutcome: '',
        dateOfCertification: '',
        certificate: null,
        score: ''
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
    const [showCertificateModal, setShowCertificateModal] = useState(false);
    const [selectedCertificateUrl, setSelectedCertificateUrl] = useState('');
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
            const response = await fetch(`http://localhost:5000/api/ai1form/submissions?teacherName=${user.name}&teacherDepartment=${user.department}&formId=AI1`);
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

    const handleViewCertificate = (certificateUrl) => {
        setSelectedCertificateUrl(`http://localhost:5000${certificateUrl}`);
        setShowCertificateModal(true);
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, certificate: e.target.files[0] });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        calculateScore({ ...formData, [name]: value });
    };

    const calculateScore = (data) => {
        const points = {
            hours: { '30+': 1, '20+': 0.5, 'below20': 0 },
            platform: { 'National Professor': 1.5, 'State Professor': 1, 'other': 0.4 },
            assessmentOutcome: { 'B or above': 1, 'pass': 0.4, 'audit': 0.2, 'fail': 0 },
            dateOfCertification: { '2 Years': 1, '2 to 4 Years': 0.75, '4 to 6': 0.4, 'More than 6 Years': 0 },
        };

        const calculatedScore =
            (points.hours[data.hours] || 0) *
            (points.platform[data.platform] || 0) *
            (points.assessmentOutcome[data.assessmentOutcome] || 0) *
            (points.dateOfCertification[data.dateOfCertification] || 0) *
            100;

        setScore(Math.round(calculatedScore));
    };

    const handleConfirmSubmit = (e) => {
        e.preventDefault();
        if (!formData.hours || !formData.platform || !formData.assessmentOutcome || !formData.dateOfCertification || !formData.certificate) {
            setModalMessage('All fields are required');
            setShowModal(true);
            return;
        }
        setShowConfirmModal(true);
    };

    const handleSubmit = async () => {
        const formDataToSend = new FormData();
        formDataToSend.append('teacherName', user.name);
        formDataToSend.append('teacherDepartment', user.department);
        formDataToSend.append('hours', formData.hours);
        formDataToSend.append('platform', formData.platform);
        formDataToSend.append('assessmentOutcome', formData.assessmentOutcome);
        formDataToSend.append('dateOfCertification', formData.dateOfCertification);
        formDataToSend.append('certificate', formData.certificate);
        formDataToSend.append('score', score);
        formDataToSend.append('formId', 'AI1');

        try {
            let response;
            if (isEditing) {
                response = await fetch(`http://localhost:5000/api/ai1form/${editFormId}`, {
                    method: 'PUT',
                    body: formDataToSend,
                });

                if (!response.ok) throw new Error('Failed to update form');

                setIsEditing(false);
                setEditFormId(null);
            } else {
                response = await fetch('http://localhost:5000/api/ai1form', {
                    method: 'POST',
                    body: formDataToSend,
                });

                if (!response.ok) throw new Error('Failed to submit form');
            }

            setFormData({ hours: '', platform: '', assessmentOutcome: '', dateOfCertification: '', certificate: null, score: '' });
            setScore(0);
            setShowConfirmModal(false);
            setModalMessage('Form submitted successfully!');
            setShowModal(true);
            setShowForm(false);
            setCurrentPage(1);
            fetchSubmittedForms();
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const handleEdit = (form) => {
        setFormData({
            ...form,
            certificate: form.certificateUrl
                ? { name: "Uploaded Certificate", url: form.certificateUrl }
                : null
        });
        setScore(form.score);
        setShowForm(true);
        setIsEditing(true);
        setEditFormId(form._id);
    };


    const handleDelete = async () => {
        try {
            // Delete the form
            const response = await fetch(`http://localhost:5000/api/ai1form/${deleteFormId}`, { method: 'DELETE' });

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
            <Bucket1 />
            <div className="bt-container">
                <h2 style={{ backgroundColor: '#537c78' }}>AI-1 Certification for Courses Allotted</h2>

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
                                            <Modal.Title>Score Calculation Explanation</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <ul>
                                                <li><strong>Hours:</strong>
                                                    <ul>
                                                        <li>30+ → 1</li>
                                                        <li>20+ → 0.5</li>
                                                        <li>Below 20 → 0</li>
                                                    </ul>
                                                </li>
                                                <li><strong>Platform:</strong>
                                                    <ul>
                                                        <li>National Professor → 1.5</li>
                                                        <li>State Professor → 1</li>
                                                        <li>Other → 0.4</li>
                                                    </ul>
                                                </li>
                                                <li><strong>Assessment Outcome:</strong>
                                                    <ul>
                                                        <li>B or above → 1</li>
                                                        <li>Pass → 0.4</li>
                                                        <li>Audit → 0.2</li>
                                                        <li>Fail → 0</li>
                                                    </ul>
                                                </li>
                                                <li><strong>Date of Certification:</strong>
                                                    <ul>
                                                        <li>Within 2 years → 1</li>
                                                        <li>2 to 4 years → 0.75</li>
                                                        <li>4 to 6 years → 0.4</li>
                                                        <li>More than 6 years → 0</li>
                                                    </ul>
                                                </li>
                                            </ul>
                                            <p><strong>Final Score = Product of All Factors × 100</strong></p>
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
                                                <td><strong>Hours:</strong></td>
                                                <td>{submittedForms[currentPage - 1]?.hours}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Platform:</strong></td>
                                                <td>{submittedForms[currentPage - 1]?.platform}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Assessment Outcome:</strong></td>
                                                <td>{submittedForms[currentPage - 1]?.assessmentOutcome}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Date of Certification:</strong></td>
                                                <td>{submittedForms[currentPage - 1]?.dateOfCertification}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Certificate:</strong></td>
                                                <td>
                                                    {submittedForms[currentPage - 1]?.certificateUrl ? (
                                                        <button
                                                            className="view-certificate-btn"
                                                            onClick={() => handleViewCertificate(submittedForms[currentPage - 1].certificateUrl)}
                                                        >
                                                            View Certificate
                                                        </button>
                                                    ) : "No certificate uploaded"}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td><strong>Self Score:</strong></td>
                                                <td>{submittedForms[currentPage - 1]?.score}</td>
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

                        {/* Pagination Controls (Page Numbers) */}
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
                            <div className="marks-item marks-item-value">100</div>
                            <div className="marks-item marks-item-header">Maximum marks with bonus</div>
                            <div className="marks-item marks-item-value">150</div>
                            <div className="marks-item marks-item-header">Self Score</div>
                            <div className="marks-item marks-item-value">{score.toFixed(2)}</div> {/* Display calculated score */}
                        </div>


                        <div className='form-group'>
                            <label className='label1'>Number of Hours:
                                <select name="hours" className="select-input" value={formData.hours} onChange={handleChange}>
                                    <option value="">Select</option>
                                    <option value="30+">30+</option>
                                    <option value="20+">20+</option>
                                    <option value="below20">Below 20</option>
                                </select>
                            </label>
                        </div>

                        <div className='form-group'>
                            <label className='label1'>Platform:
                                <select name="platform" className="select-input" value={formData.platform} onChange={handleChange}>
                                    <option value="">Select</option>
                                    <option value="National Professor">National Professor</option>
                                    <option value="State Professor">State Professor</option>
                                    <option value="other">Other</option>
                                </select>
                            </label>
                        </div>

                        <div className='form-group'>
                            <label className='label1'>Assessment Outcome:
                                <select name="assessmentOutcome" className="select-input" value={formData.assessmentOutcome} onChange={handleChange}>
                                    <option value="">Select</option>
                                    <option value="B or above">B or Above</option>
                                    <option value="pass">Pass</option>
                                    <option value="audit">Audit</option>
                                    <option value="fail">Fail</option>
                                </select>
                            </label>
                        </div>

                        <div className='form-group'>
                            <label className='label1'>Date of Certification:
                                <select name="dateOfCertification" className="select-input" value={formData.dateOfCertification} onChange={handleChange}>
                                    <option value="">Select</option>
                                    <option value="2 Years">2 Years</option>
                                    <option value="2 to 4 Years">2 to 4 Years</option>
                                    <option value="4 to 6">4 to 6</option>
                                    <option value="More than 6 Years">More than 6 Years</option>
                                </select>
                            </label>
                        </div>


                        <div className="form-group11">
                            <label className="label2">Upload Certificate:</label>

                            <button
                                type="button"
                                className="custom-file-upload"
                                onClick={() => document.getElementById('fileInput').click()}
                            >
                                Choose File
                            </button>

                            <span className="file-name">
                                {formData.certificate ? formData.certificate.name : "No file chosen"}
                            </span>

                            <input
                                type="file"
                                id="fileInput"
                                name="certificate"
                                accept="application/pdf"
                                onChange={handleFileChange}
                                className="hidden-file-input"
                            />
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
                                        hours: '',
                                        platform: '',
                                        assessmentOutcome: '',
                                        dateOfCertification: '',
                                        certificate: null,
                                        score: ''
                                    });
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                )}

                {/* Confirmation Modal Before Submission */}
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

                <Modal
                    show={showCertificateModal}
                    onHide={() => setShowCertificateModal(false)}
                    size="xl"
                    centered
                    dialogClassName="custom-modal"
                >
                    <Modal.Header className="border-0">
                        <Button
                            variant="danger"
                            onClick={() => setShowCertificateModal(false)}
                            style={{ position: 'absolute', right: '10px', top: '10px', zIndex: 10 }}
                        >
                            Close
                        </Button>
                    </Modal.Header>
                    <Modal.Body className="d-flex justify-content-center align-items-center">
                        {selectedCertificateUrl ? (
                            <iframe
                                src={selectedCertificateUrl}
                                title="Certificate"
                                width="100%"
                                height="800px"  // Increased height
                                style={{ border: 'none' }}
                            ></iframe>
                        ) : (
                            <p>No certificate available.</p>
                        )}
                    </Modal.Body>
                </Modal>

            </div>
        </>
    );
}

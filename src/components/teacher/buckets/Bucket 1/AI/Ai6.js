import React, { useState, useEffect, useCallback } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button } from 'react-bootstrap';
import Bucket1 from '../Bucket1';

export default function Ai6() {
    const [formData, setFormData] = useState({
        numStudentsInnovativeTLP: '',
        numStudentsEnrollment: '',
        qualityAssignments: '',
        qualityQuizzes: '',
        qualityExperiment: '',
        engagementActivities: '',
        slowLearnerActivities: '',
        advanceLearnerActivities: '',
        numAssessmentActivities: '',
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

    const fetchSubmittedForms = useCallback(async () => {
        if (!user) return;
        try {
            const response = await fetch(`http://localhost:5000/api/ai6form/submissions?teacherName=${user.name}&teacherDepartment=${user.department}&formId=AI6`);
            if (!response.ok) throw new Error('Failed to fetch submitted forms');
            const result = await response.json();
            setSubmittedForms(result.reverse());
        } catch (error) {
            console.error('Error fetching submitted forms:', error);
        }
    }, [user]); // Depend only on 'user' so it updates when user changes

    useEffect(() => {
        fetchSubmittedForms();
    }, [fetchSubmittedForms]); // Now ESLint won't complain




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
    const calculateScore = (formData) => {
        const numStudentsInnovativeTLP = formData.numStudentsInnovativeTLP || 0;
        const numStudentsEnrollment = formData.numStudentsEnrollment || 1; // Avoid division by zero
        const participantsScore = numStudentsInnovativeTLP / numStudentsEnrollment;

        // Ensure each value is within a valid range before continuing
        const qualityScores = [
            formData.qualityAssignments,
            formData.qualityQuizzes,
            formData.qualityExperiment,
            formData.engagementActivities,
            formData.slowLearnerActivities,
            formData.advanceLearnerActivities
        ].map(score => Math.min(1, Math.max(0, score)));  // Ensure scores are between 0 and 1

        const qualityScore = qualityScores.reduce((sum, score) => sum + score, 0) / qualityScores.length;
        const assessmentScore = (formData.numAssessmentActivities || 0) * 0.25;

        const mappingValues = {
            "Strongly to PO (1.5)": 1.5,
            "Strongly to CO (1)": 1,
            "Moderately to PO (1)": 1,
            "Moderately to CO (0.8)": 0.8,
            "Neither mapping to PO or CO (0)": 0
        };

        const mappingScore = mappingValues[formData.mapping] || 0;

        const weightage = participantsScore * qualityScore * assessmentScore * mappingScore;
        const finalScore = Math.round(weightage * 150);
        setScore(finalScore);
    };

    // Recalculate score when formData changes
    useEffect(() => {
        calculateScore(formData); // Recalculate the score whenever formData changes
    }, [formData]); // Trigger when any part of formData changes


    const handleConfirmSubmit = (e) => {
        e.preventDefault();
        if (!formData.numStudentsInnovativeTLP ||
            !formData.numStudentsEnrollment ||
            !formData.qualityAssignments ||
            !formData.qualityQuizzes ||
            !formData.qualityExperiment ||
            !formData.engagementActivities ||
            !formData.slowLearnerActivities ||
            !formData.advanceLearnerActivities ||
            !formData.numAssessmentActivities ||
            !formData.mapping ||
            !formData.linkEvidence) {
            setModalMessage('All fields are required');
            setShowModal(true);
            return;
        }
        setShowConfirmModal(true);
    };

    const handleSubmit = async () => {
        try {
            const formId = "AI6";

            // Ensure user details are included
            const dataToSubmit = {
                ...formData,
                formId,
                teacherName: user?.name,
                teacherDepartment: user?.department,
                score
            };

            let response;

            if (isEditing) {
                response = await fetch(`http://localhost:5000/api/ai6form/${editFormId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dataToSubmit),
                });
            } else {
                response = await fetch('http://localhost:5000/api/ai6form', {
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
                numStudentsInnovativeTLP: '',
                numStudentsEnrollment: '',
                qualityAssignments: '',
                qualityQuizzes: '',
                qualityExperiment: '',
                engagementActivities: '',
                slowLearnerActivities: '',
                advanceLearnerActivities: '',
                numAssessmentActivities: '',
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
            numStudentsInnovativeTLP: form.numStudentsInnovativeTLP,
            numStudentsEnrollment: form.numStudentsEnrollment,
            qualityAssignments: form.qualityAssignments,
            qualityQuizzes: form.qualityQuizzes,
            qualityExperiment: form.qualityExperiment,
            engagementActivities: form.engagementActivities,
            slowLearnerActivities: form.slowLearnerActivities,
            advanceLearnerActivities: form.advanceLearnerActivities,
            numAssessmentActivities: form.numAssessmentActivities,
            mapping: form.mapping,
            linkEvidence: form.linkEvidence
        });
        setShowForm(true);
        setIsEditing(true);
        setEditFormId(form._id);
    };



    const handleDelete = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/ai6form/${deleteFormId}`, { method: 'DELETE' });

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
                <h2 style={{ backgroundColor: '#537c78' }}>AI-6 Innovations in TLP (to measure engagement and Effectiveness and engagement outside the classroom)</h2>

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
                                                    The score is calculated based on the following criteria:
                                                    <ul>
                                                        <li>The number of students participating in Innovative TLP activities is divided by the total number of students enrolled in the course.</li>
                                                        <li>Quality scores are given for various activities (Assignments, Quizzes, Experiment, Engagement, Slow Learner Activities, and Advance Learner Activities). Each score is between 0 and 1, with higher scores representing better performance.</li>
                                                        <li>The assessment score is calculated by multiplying the number of assessment activities by a factor of 0.25.</li>
                                                        <li>Mapping score is based on the mapping type selected. The score varies as follows:
                                                            <ul>
                                                                <li>Strongly to PO: 1.5</li>
                                                                <li>Strongly to CO: 1</li>
                                                                <li>Moderately to PO: 1</li>
                                                                <li>Moderately to CO: 0.8</li>
                                                                <li>Not Mapped: 0</li>
                                                            </ul>
                                                        </li>
                                                    </ul>
                                                </li>
                                                <li>
                                                    <strong>Example:</strong> If the values are:
                                                    <br />
                                                    No. of Students Participating in Innovative TLP = 50, No. of Students Enrollment = 100
                                                    <br />
                                                    Quality of Assignments = 0.8, Quality of Quizzes = 0.9, Quality of Experiment = 1.0, Engagement Activities = 0.7, Slow Learner Activities = 0.6, Advance Learner Activities = 0.8
                                                    <br />
                                                    No. of Assessment Activities = 3
                                                    <br />
                                                    Mapping = Strongly to PO
                                                </li>
                                                <li style={{ marginBottom: '20px' }}>
                                                    Then Final Score =
                                                    <code>
                                                        (50 / 100) × ((0.8 + 0.9 + 1.0 + 0.7 + 0.6 + 0.8) / 6) × (3 × 0.25) × 1.5 × 150 = 135.0
                                                    </code>
                                                </li>
                                                <li>
                                                    Higher values in each category will result in a higher final score.
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
                                                <td><strong>No. of Students Participating in Innovative TLP Activities:</strong></td>
                                                <td>{submittedForms[currentPage - 1]?.numStudentsInnovativeTLP}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>No. of Students Enrollment for the Course:</strong></td>
                                                <td>{submittedForms[currentPage - 1]?.numStudentsEnrollment}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Quality of Assignments Score:</strong></td>
                                                <td>{submittedForms[currentPage - 1]?.qualityAssignments}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Quality of Quizzes/Tests Score:</strong></td>
                                                <td>{submittedForms[currentPage - 1]?.qualityQuizzes}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Quality of Experiment Conducted in Practical Score:</strong></td>
                                                <td>{submittedForms[currentPage - 1]?.qualityExperiment}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Activities for Engagement with Students Outside the Classroom Score:</strong></td>
                                                <td>{submittedForms[currentPage - 1]?.engagementActivities}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Activities for Slow Learners Score:</strong></td>
                                                <td>{submittedForms[currentPage - 1]?.slowLearnerActivities}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Activities for Advance Learners Score:</strong></td>
                                                <td>{submittedForms[currentPage - 1]?.advanceLearnerActivities}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>No. of Assessment Activities (0-4):</strong></td>
                                                <td>{submittedForms[currentPage - 1]?.numAssessmentActivities}</td>
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
                            <div className="marks-item marks-item-value">150</div>
                            <div className="marks-item marks-item-header">Maximum marks with bonus</div>
                            <div className="marks-item marks-item-value">225</div>
                            <div className="marks-item marks-item-header">Self Score</div>
                            <div className="marks-item marks-item-value">{score}</div> {/* Display calculated score */}
                        </div>

                        <h5 className='exp-heading'>No. of participants for Innovative TLP activity</h5>

                        <div className='form-group'>
                            <label className='label1'>No. of Students Participating in Innovative TLP Activities:
                                <input type="number" name="numStudentsInnovativeTLP" value={formData.numStudentsInnovativeTLP} onChange={handleChange} min="0" step="1" className="input-field" />
                            </label>
                        </div>

                        <div className='form-group'>
                            <label className='label1'>No. of Students Enrollment for the Course:
                                <input type="number" name="numStudentsEnrollment" value={formData.numStudentsEnrollment} onChange={handleChange} min="0" step="1" className="input-field" />
                            </label>
                        </div>

                        <hr className="section-divider" />

                        <h5 className='exp-heading'>Quality Score (Given by Cluster Mentor Between 0-1)</h5>

                        <div className='form-group'>
                            <label className='label1'>Quality of Assignments:
                                <input type="number" name="qualityAssignments" value={formData.qualityAssignments} onChange={handleChange} min="0" max="1" step="0.01" className="input-field" />
                            </label>
                        </div>

                        <div className='form-group'>
                            <label className='label1'>Quality of Quizzes/Tests:
                                <input type="number" name="qualityQuizzes" value={formData.qualityQuizzes} onChange={handleChange} min="0" max="1" step="0.01" className="input-field" />
                            </label>
                        </div>

                        <div className='form-group'>
                            <label className='label1'>Quality of Experiment Conducted in Practical:
                                <input type="number" name="qualityExperiment" value={formData.qualityExperiment} onChange={handleChange} min="0" max="1" step="0.01" className="input-field" />
                            </label>
                        </div>

                        <div className='form-group'>
                            <label className='label1'>Activities for Engagement with Students Outside the Classroom:
                                <input type="number" name="engagementActivities" value={formData.engagementActivities} onChange={handleChange} min="0" max="1" step="0.01" className="input-field" />
                            </label>
                        </div>

                        <div className='form-group'>
                            <label className='label1'>Activities for Slow Learners:
                                <input type="number" name="slowLearnerActivities" value={formData.slowLearnerActivities} onChange={handleChange} min="0" max="1" step="0.01" className="input-field" />
                            </label>
                        </div>

                        <div className='form-group'>
                            <label className='label1'>Activities for Advance Learners:
                                <input type="number" name="advanceLearnerActivities" value={formData.advanceLearnerActivities} onChange={handleChange} min="0" max="1" step="0.01" className="input-field" />
                            </label>
                        </div>

                        <hr className="section-divider" />

                        <h5 className='exp-heading'>Assessment Metric</h5>

                        <div className='form-group'>
                            <label className='label1'>No. of Assessment Activities (0-4):
                                <input type="number" name="numAssessmentActivities" value={formData.numAssessmentActivities} onChange={handleChange} min="0" max="4" step="1" className="input-field" />
                            </label>
                        </div>

                        <hr className="section-divider" />

                        <h5 className='exp-heading'>Mapping</h5>

                        <div className='form-group'>
                            <label className='label1'>Mapping:
                                <select
                                    name="mapping"
                                    className="select-input"
                                    value={formData.mapping}
                                    onChange={handleChange}
                                >
                                    <option value="">Select</option>
                                    <option value="Strongly to PO (1.5)">Strongly to PO (1.5)</option>
                                    <option value="Strongly to CO (1)">Strongly to CO (1)</option>
                                    <option value="Moderately to PO (1)">Moderately to PO (1)</option>
                                    <option value="Moderately to CO (0.8)">Moderately to CO (0.8)</option>
                                    <option value="Neither mapping to PO or CO (0)">Neither mapping to PO or CO (0)</option>
                                </select>
                            </label>
                        </div>


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
                                    setShowForm(false);
                                    setIsEditing(false);
                                    setEditFormId(null);
                                    setFormData({
                                        numStudentsInnovativeTLP: '',
                                        numStudentsEnrollment: '',
                                        qualityAssignments: '',
                                        qualityQuizzes: '',
                                        qualityExperiment: '',
                                        engagementActivities: '',
                                        slowLearnerActivities: '',
                                        advanceLearnerActivities: '',
                                        numAssessmentActivities: '',
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

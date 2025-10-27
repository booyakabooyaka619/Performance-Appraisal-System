import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button } from 'react-bootstrap';
import Bucket1 from '../Bucket1';

export default function Ai32() {
    const [formData, setFormData] = useState({
        mouPlacementsType: '',
        mouPlacements: '',
        mouInternships: '',
        facultyPresence: '',
        internshipsWithIndustry: '',
        projectsWithIndustry: '',
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
            const response = await fetch(`http://localhost:5000/api/ai32form/submissions?teacherName=${user.name}&teacherDepartment=${user.department}&formId=AI32`);
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
        const factor = 75; // Given multiplication factor

        // Extract and convert values from formData
        const W1 = formData.mouPlacementsType === "Offline (1)" ? 1 : 0.5;
        const W2 = formData.mouPlacements === "New MOU with Industry/Organisation for Placements (1.5)" ? 1.5 : 1;
        const W3 = formData.mouInternships === "New MOU with Industry/Organisation for Internship including last 6 months (1.25)" ? 1.25 : 1;
        const W4 = formData.facultyPresence === "Faculty’s presence (1)" ? 1 : 0.3;
        const W5 = formData.internshipsWithIndustry === "Internships during the P.A. Evaluation period" ? 1.2 : 1;
        const W6 = formData.projectsWithIndustry === "Projects during the semester" ? 1.1 : 1;

        // Feedback Weightage (W7)
        const feedback = parseFloat(formData.feedbackReceived);
        const attendees = parseFloat(formData.numberOfAttendees);
        const totalStudents = parseFloat(formData.numberOfStudents);
        const W7 = feedback >= 2.5 ? (attendees / totalStudents) : 0;

        // Mapping Weightage (W8)
        let W8 = 0;
        switch (formData.mapping) {
            case "Strongly to PO (1.5)": W8 = 1.5; break;
            case "Strongly to CO (1)": W8 = 1; break;
            case "Moderately to PO (1)": W8 = 1; break;
            case "Moderately to CO (0.8)": W8 = 0.8; break;
            case "Neither mapping to PO or CO (0)": W8 = 0; break;
            default: W8 = 0; // No selection
        }

        // Calculate Self Score
        return Math.round(W1 * W2 * W3 * W4 * W5 * W6 * W7 * W8 * factor);

    };

    useEffect(() => {
        setScore(calculateScore());
    }, [formData]); // Recalculates score whenever formData changes


    const handleConfirmSubmit = (e) => {
        e.preventDefault();
        if (!formData.mouPlacementsType || !formData.mouPlacements || !formData.mouInternships || !formData.facultyPresence || !formData.internshipsWithIndustry || !formData.projectsWithIndustry || !formData.feedbackReceived || !formData.numberOfAttendees || !formData.numberOfStudents || !formData.mapping || !formData.linkEvidence) {
            setModalMessage('All fields are required');
            setShowModal(true);
            return;
        }
        setShowConfirmModal(true);
    };

    const handleSubmit = async () => {
        try {
            const formId = "AI32";

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
                response = await fetch(`http://localhost:5000/api/ai32form/${editFormId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dataToSubmit),
                });
            } else {
                response = await fetch('http://localhost:5000/api/ai32form', {
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
                mouPlacementsType: '',
                mouPlacements: '',
                mouInternships: '',
                facultyPresence: '',
                internshipsWithIndustry: '',
                projectsWithIndustry: '',
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
            mouPlacementsType: form.mouPlacementsType,
            mouPlacements: form.mouPlacements,
            mouInternships: form.mouInternships,
            facultyPresence: form.facultyPresence,
            internshipsWithIndustry: form.internshipsWithIndustry,
            projectsWithIndustry: form.projectsWithIndustry,
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
            const response = await fetch(`http://localhost:5000/api/ai32form/${deleteFormId}`, { method: 'DELETE' });

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
                <h2 style={{ backgroundColor: '#537c78' }}>AI-3.2 BSA - Industrial Visit</h2>

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
                                                    The final score is calculated by multiplying the values associated with each selected option from the form.
                                                </li>
                                                <li style={{ marginBottom: '15px' }}>
                                                    The factors include:
                                                    <ul style={{ marginTop: '10px' }}>
                                                        <li><strong>MOU for Placements (Type)</strong>: Offline (1), Online (0.5)</li>
                                                        <li><strong>MOU for Placements</strong>: New MOU (1.5), None (1)</li>
                                                        <li><strong>MOU for Internships</strong>: New MOU (1.25), None (1)</li>
                                                        <li><strong>Faculty’s Presence</strong>: Present (1), Absent (0.3)</li>
                                                        <li><strong>Internships with Industry</strong>: Yes (1.2), No (1)</li>
                                                        <li><strong>Projects with Industry</strong>: Yes (1.1), No (1)</li>
                                                        <li>
                                                            <strong>Feedback Score</strong>: If ≥ 2.5, contributes as
                                                            <code> (Number of Attendees ÷ Number of Students) </code>, else 0
                                                        </li>
                                                        <li>
                                                            <strong>Mapping</strong>:
                                                            <ul>
                                                                <li>Strongly to PO (1.5)</li>
                                                                <li>Strongly to CO / Moderately to PO (1)</li>
                                                                <li>Moderately to CO (0.8)</li>
                                                                <li>Neither PO nor CO (0)</li>
                                                            </ul>
                                                        </li>
                                                    </ul>
                                                </li>
                                                <li style={{ marginBottom: '20px' }}>
                                                    All these values are multiplied together, and then multiplied by <strong>75</strong> as a factor to get the final score.
                                                </li>
                                                <li style={{ marginBottom: '20px' }}>
                                                    <strong>Example:</strong> If the selected values are:<br />
                                                    MOU Type = 1, MOU Placements = 1.5, MOU Internships = 1.25,<br />
                                                    Faculty Presence = 1, Internships = 1.2, Projects = 1.1,<br />
                                                    Feedback = 3 (Attendees = 60, Students = 100 → 60/100 = 0.6),<br />
                                                    Mapping = 1.5<br /><br />
                                                    Then Score = <code>1 × 1.5 × 1.25 × 1 × 1.2 × 1.1 × 0.6 × 1.5 × 75 = 100.12</code>
                                                </li>
                                                <li>
                                                    Try to aim for higher values and feedback to increase your final score.
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
                                                <td><strong>MOU for Placements Type:</strong></td>
                                                <td>{submittedForms[currentPage - 1]?.mouPlacementsType}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>MOU for Placements:</strong></td>
                                                <td>{submittedForms[currentPage - 1]?.mouPlacements}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>MOU for Internships:</strong></td>
                                                <td>{submittedForms[currentPage - 1]?.mouInternships}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Faculty’s Presence:</strong></td>
                                                <td>{submittedForms[currentPage - 1]?.facultyPresence}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Internships with Industry:</strong></td>
                                                <td>{submittedForms[currentPage - 1]?.internshipsWithIndustry}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Projects with Industry:</strong></td>
                                                <td>{submittedForms[currentPage - 1]?.projectsWithIndustry}</td>
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
                                                <td><strong>Total Students:</strong></td>
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
                            <div className="marks-item marks-item-header">Marks (M)</div>
                            <div className="marks-item marks-item-value">75</div>
                            <div className="marks-item marks-item-header">Maximum marks with bonus</div>
                            <div className="marks-item marks-item-value">278</div>
                            <div className="marks-item marks-item-header">Self Score</div>
                            <div className="marks-item marks-item-value">{score}</div> {/* Display calculated score */}
                        </div>

                        <div className='form-group'>
                            <label className='label1'>MOU for Placements (Type):
                                <select name="mouPlacementsType" className="select-input" value={formData.mouPlacementsType} onChange={handleChange}>
                                    <option value="">Select</option>
                                    <option value="Offline (1)">Offline (1)</option>
                                    <option value="Online (0.5)">Online (0.5)</option>
                                </select>
                            </label>
                        </div>

                        <div className='form-group'>
                            <label className='label1'>MOU for Placements:
                                <select name="mouPlacements" className="select-input" value={formData.mouPlacements} onChange={handleChange}>
                                    <option value="">Select</option>
                                    <option value="New MOU with Industry/Organisation for Placements (1.5)">New MOU with Industry/Organisation for Placements (1.5)</option>
                                    <option value="None (1)">None (1)</option>
                                </select>
                            </label>
                        </div>

                        <div className='form-group'>
                            <label className='label1'>MOU for Internships:
                                <select name="mouInternships" className="select-input" value={formData.mouInternships} onChange={handleChange}>
                                    <option value="">Select</option>
                                    <option value="New MOU with Industry/Organisation for Internship including last 6 months (1.25)">New MOU with Industry/Organisation for Internship including last 6 months (1.25)</option>
                                    <option value="None (1)">None (1)</option>
                                </select>
                            </label>
                        </div>

                        <div className='form-group'>
                            <label className='label1'>Faculty’s Presence:
                                <select name="facultyPresence" className="select-input" value={formData.facultyPresence} onChange={handleChange}>
                                    <option value="">Select</option>
                                    <option value="Faculty’s presence (1)">Faculty’s presence (1)</option>
                                    <option value="Faculty’s absence (0.3)">Faculty’s absence (0.3)</option>
                                </select>
                            </label>
                        </div>

                        <div className='form-group'>
                            <label className='label1'>Internships with Industry (last 6 months):
                                <select name="internshipsWithIndustry" className="select-input" value={formData.internshipsWithIndustry} onChange={handleChange}>
                                    <option value="">Select</option>
                                    <option value="Internships during the P.A. Evaluation period">Internships during the P.A. Evaluation period</option>
                                    <option value="None (1)">None (1)</option>
                                </select>
                            </label>
                        </div>

                        <div className='form-group'>
                            <label className='label1'>Projects with Industry (last 6 months):
                                <select name="projectsWithIndustry" className="select-input" value={formData.projectsWithIndustry} onChange={handleChange}>
                                    <option value="">Select</option>
                                    <option value="Projects during the semester">Projects during the semester</option>
                                    <option value="None (1)">None (1)</option>
                                </select>
                            </label>
                        </div>

                        <div className='form-group'>
                            <label className='label1'>Feedback Received (0 to 4):
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
                                        mouPlacementsType: '',
                                        mouPlacements: '',
                                        mouInternships: '',
                                        facultyPresence: '',
                                        internshipsWithIndustry: '',
                                        projectsWithIndustry: '',
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

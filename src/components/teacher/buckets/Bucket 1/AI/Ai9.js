import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button } from 'react-bootstrap';
import Bucket1 from '../Bucket1';

export default function Ai9() {
    const [formData, setFormData] = useState({
        numberOfProjects: '',
        industryProjects: '',
        liveProjects: '',
        participationInCompetitions: '',
        awards: '',
        publications: '',
        fundingReceived: '',
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
            const response = await fetch(`http://localhost:5000/api/ai9form/submissions?teacherName=${user.name}&teacherDepartment=${user.department}&formId=AI9`);
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

    // Calculate score based on formData
    const calculateScore = (formData) => {
        // Check if any required field is missing
        const requiredFields = [
            'numberOfProjects',
            'industryProjects',
            'liveProjects',
            'participationInCompetitions',
            'awards',
            'publications',
            'fundingReceived',
        ];

        const isIncomplete = requiredFields.some(field => !formData[field]);
        if (isIncomplete) {
            setScore(0);
            return;
        }

        let totalScore = 1;

        // No. of Projects Guided
        if (formData.numberOfProjects === "Three or more (1)") totalScore *= 1;
        else if (formData.numberOfProjects === "Two (0.8)") totalScore *= 0.8;
        else if (formData.numberOfProjects === "One (0.6)") totalScore *= 0.6;
        else if (formData.numberOfProjects === "None (0)") totalScore *= 0;

        // Industry Projects
        if (formData.industryProjects === "Three or more (1.2)") totalScore *= 1.2;
        else if (formData.industryProjects === "Two (1)") totalScore *= 1;
        else if (formData.industryProjects === "One (0.8)") totalScore *= 0.8;
        else if (formData.industryProjects === "None (0.5)") totalScore *= 0.5;

        // Live Projects
        if (formData.liveProjects === "Three or more (1.2)") totalScore *= 1.2;
        else if (formData.liveProjects === "Two (1)") totalScore *= 1;
        else if (formData.liveProjects === "One (0.8)") totalScore *= 0.8;
        else if (formData.liveProjects === "None (0.2)") totalScore *= 0.2;

        // Participation in Competitions
        if (formData.participationInCompetitions === "International (1.5)") totalScore *= 1.5;
        else if (formData.participationInCompetitions === "National: AICTE/IEEE sponsored (1.3)") totalScore *= 1.3;
        else if (formData.participationInCompetitions === "State College (1.2)") totalScore *= 1.2;
        else if (formData.participationInCompetitions === "Intercollegiate (City Level) (1.1)") totalScore *= 1.1;
        else if (formData.participationInCompetitions === "None (1)") totalScore *= 1;

        // Awards
        if (formData.awards === "International (2.0)") totalScore *= 2.0;
        else if (formData.awards === "National (1.8)") totalScore *= 1.8;
        else if (formData.awards === "State Level (1.6)") totalScore *= 1.6;
        else if (formData.awards === "Intercollegiate (City Level) (1.4)") totalScore *= 1.4;
        else if (formData.awards === "None (1)") totalScore *= 1;

        // Publications
        if (formData.publications === "Peer Reviewed Journal (1.75)") totalScore *= 1.75;
        else if (formData.publications === "Int. Conference (1.5)") totalScore *= 1.5;
        else if (formData.publications === "UGC Approved Journal (1.5)") totalScore *= 1.5;
        else if (formData.publications === "National Conference (1.25)") totalScore *= 1.25;
        else if (formData.publications === "Scholarly Term Paper (1)") totalScore *= 1;
        else if (formData.publications === "None (0.5)") totalScore *= 0.5;

        // Funding Received
        if (formData.fundingReceived === "Yes") totalScore *= 1.75;
        else if (formData.fundingReceived === "No") totalScore *= 1;

        totalScore *= 100;

        setScore(Math.round(totalScore));
    };


    // Recalculate score whenever formData changes
    useEffect(() => {
        calculateScore(formData); // Recalculate the score whenever formData changes
    }, [formData]); // Trigger when any part of formData changes


    const handleConfirmSubmit = (e) => {
        e.preventDefault();
        if (!formData.numberOfProjects || !formData.industryProjects || !formData.liveProjects || !formData.participationInCompetitions || !formData.awards || !formData.publications || !formData.fundingReceived || !formData.linkEvidence) {
            setModalMessage('All fields are required');
            setShowModal(true);
            return;
        }
        setShowConfirmModal(true);
    };

    const handleSubmit = async () => {
        try {
            const formId = "AI9";

            // Ensure user details are included
            const dataToSubmit = {
                ...formData,
                formId,
                teacherName: user?.name,  // Ensure teacherName is added
                teacherDepartment: user?.department, // Ensure teacherDepartment is added
                score
            };

            let response;

            if (isEditing) {
                response = await fetch(`http://localhost:5000/api/ai9form/${editFormId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dataToSubmit),
                });
            } else {
                response = await fetch('http://localhost:5000/api/ai9form', {
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
                numberOfProjects: '',
                industryProjects: '',
                liveProjects: '',
                participationInCompetitions: '',
                awards: '',
                publications: '',
                fundingReceived: '',
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
            numberOfProjects: form.numberOfProjects,
            industryProjects: form.industryProjects,
            liveProjects: form.liveProjects,
            participationInCompetitions: form.participationInCompetitions,
            awards: form.awards,
            publications: form.publications,
            fundingReceived: form.fundingReceived,
            linkEvidence: form.linkEvidence
        });
        setShowForm(true);
        setIsEditing(true);
        setEditFormId(form._id);
    };

    const handleDelete = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/ai9form/${deleteFormId}`, { method: 'DELETE' });

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
                <h2 style={{ backgroundColor: '#537c78' }}>AI-9 B.E. Projects Guided</h2>

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
                                                    Your final score is calculated by multiplying the selected values from each dropdown with a fixed factor of 100.
                                                </li>
                                                <li style={{ marginBottom: '20px' }}>
                                                    Example:<br />
                                                    If you select options with values: 1.0, 0.8, 1.2, 1.5, 1.0, 1.5, and 1.75,
                                                    then your final score =
                                                    <code> 1.0 × 0.8 × 1.2 × 1.5 × 1.0 × 1.5 × 1.75 × 100 = 378</code>
                                                </li>
                                                <li>
                                                    All dropdown values are multiplied together, and the result is finally multiplied by 100.
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
                                            <tr><td><strong>Number of Projects:</strong></td><td>{submittedForms[currentPage - 1]?.numberOfProjects}</td></tr>
                                            <tr><td><strong>Industry Projects:</strong></td><td>{submittedForms[currentPage - 1]?.industryProjects}</td></tr>
                                            <tr><td><strong>Live Projects:</strong></td><td>{submittedForms[currentPage - 1]?.liveProjects}</td></tr>
                                            <tr><td><strong>Participation in Competitions:</strong></td><td>{submittedForms[currentPage - 1]?.participationInCompetitions}</td></tr>
                                            <tr><td><strong>Awards:</strong></td><td>{submittedForms[currentPage - 1]?.awards}</td></tr>
                                            <tr><td><strong>Publications:</strong></td><td>{submittedForms[currentPage - 1]?.publications}</td></tr>
                                            <tr><td><strong>Funding Received:</strong></td><td>{submittedForms[currentPage - 1]?.fundingReceived}</td></tr>
                                            <tr>
                                                <td><strong>Self Score:</strong></td>
                                                <td>{submittedForms[currentPage - 1]?.score}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Evidence Link:</strong></td>
                                                <td>
                                                    <a href={submittedForms[currentPage - 1]?.linkEvidence} target="_blank" rel="noopener noreferrer">
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
                            <div className="marks-item marks-item-value">1323</div>
                            <div className="marks-item marks-item-header">Self Score</div>
                            <div className="marks-item marks-item-value">{score}</div> {/* Display calculated score */}
                        </div>

                        {/* Type of Event Dropdown */}
                        <div className='form-group'>
                            <label className='label1'>No. of Projects Guided:
                                <select name="numberOfProjects" className="select-input" value={formData.numberOfProjects} onChange={handleChange}>
                                    <option value="">Select</option>
                                    <option value="Three or more (1)">Three or more (1)</option>
                                    <option value="Two (0.8)">Two (0.8)</option>
                                    <option value="One (0.6)">One (0.6)</option>
                                    <option value="None (0)">None (0)</option>
                                </select>
                            </label>
                        </div>

                        <div className='form-group'>
                            <label className='label1'>Industry Projects:
                                <select name="industryProjects" className="select-input" value={formData.industryProjects} onChange={handleChange}>
                                    <option value="">Select</option>
                                    <option value="Three or more (1.2)">Three or more (1.2)</option>
                                    <option value="Two (1)">Two (1)</option>
                                    <option value="One (0.8)">One (0.8)</option>
                                    <option value="None (0.5)">None (0.5)</option>
                                </select>
                            </label>
                        </div>

                        <div className='form-group'>
                            <label className='label1'>Live Projects:
                                <select name="liveProjects" className="select-input" value={formData.liveProjects} onChange={handleChange}>
                                    <option value="">Select</option>
                                    <option value="Three or more (1.2)">Three or more (1.2)</option>
                                    <option value="Two (1)">Two (1)</option>
                                    <option value="One (0.8)">One (0.8)</option>
                                    <option value="None (0.2)">None (0.2)</option>
                                </select>
                            </label>
                        </div>

                        <div className='form-group'>
                            <label className='label1'>Participation in Competitions:
                                <select name="participationInCompetitions" className="select-input" value={formData.participationInCompetitions} onChange={handleChange}>
                                    <option value="">Select</option>
                                    <option value="International (1.5)">International (1.5)</option>
                                    <option value="National: AICTE/IEEE sponsored (1.3)">National: AICTE/IEEE sponsored (1.3)</option>
                                    <option value="State College (1.2)">State College (1.2)</option>
                                    <option value="Intercollegiate (City Level) (1.1)">Intercollegiate (City Level) (1.1)</option>
                                    <option value="None (1)">None (1)</option>
                                </select>
                            </label>
                        </div>

                        <div className='form-group'>
                            <label className='label1'>Awards:
                                <select name="awards" className="select-input" value={formData.awards} onChange={handleChange}>
                                    <option value="">Select</option>
                                    <option value="International (2.0)">International (2.0)</option>
                                    <option value="National (1.8)">National (1.8)</option>
                                    <option value="State Level (1.6)">State Level (1.6)</option>
                                    <option value="Intercollegiate (City Level) (1.4)">Intercollegiate (City Level) (1.4)</option>
                                    <option value="None (1)">None (1)</option>
                                </select>
                            </label>
                        </div>

                        <div className='form-group'>
                            <label className='label1'>Publications:
                                <select name="publications" className="select-input" value={formData.publications} onChange={handleChange}>
                                    <option value="">Select</option>
                                    <option value="Peer Reviewed Journal (1.75)">Peer Reviewed Journal (1.75)</option>
                                    <option value="Int. Conference (1.5)">Int. Conference (1.5)</option>
                                    <option value="UGC Approved Journal (1.5)">UGC Approved Journal (1.5)</option>
                                    <option value="National Conference (1.25)">National Conference (1.25)</option>
                                    <option value="Scholarly Term Paper (1)">Scholarly Term Paper (1)</option>
                                    <option value="None (0.5)">None (0.5)</option>
                                </select>
                            </label>
                        </div>

                        <div className='form-group'>
                            <label className='label1'>Funding Received:
                                <select name="fundingReceived" className="select-input" value={formData.fundingReceived} onChange={handleChange}>
                                    <option value="">Select</option>
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                </select>
                            </label>
                        </div>

                        <div className="form-group">
                            <label className='label1'>Evidence Link:
                                <input type="url" className='linkinput' name="linkEvidence" value={formData.linkEvidence} onChange={handleChange} pattern="https?://.*" title="Please enter a valid URL (e.g., http://example.com)" />
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
                                        numberOfProjects: '',
                                        industryProjects: '',
                                        liveProjects: '',
                                        participationInCompetitions: '',
                                        awards: '',
                                        publications: '',
                                        fundingReceived: '',
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

import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button } from 'react-bootstrap';
import Bucket1 from '../Bucket1';

export default function Ai8() {
    const [formData, setFormData] = useState({
        courseName: '',
        typeOfGuide: '',
        typeOfOrganisation: '',
        typeOfProject: '',
        publications: '',
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
            const response = await fetch(`http://localhost:5000/api/ai8form/submissions?teacherName=${user.name}&teacherDepartment=${user.department}&formId=AI8`);
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

        // Update the formData state
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    useEffect(() => {
        // Call calculateScore when formData changes
        calculateScore();
    }, [formData]);  // Dependency array ensures that calculateScore is called whenever formData changes

    const calculateScore = () => {
        const scoreMap = {
            typeOfGuide: {
                "Industry expert as Co-guide (1.5)": 1.5,
                "Faculty guided only (1)": 1,
            },
            typeOfOrganisation: {
                "MNC (1.5)": 1.5,
                "National (1.3)": 1.3,
                "SMEs (1.1)": 1.1,
                "None (1)": 1,
            },
            typeOfProject: {
                "Functional Project (1.0)": 1,
                "Non-functional Project (0.5)": 0.5,
            },
            publications: {
                "Peer Reviewed Journal (1.75)": 1.75,
                "Int. Conference (1.5)": 1.5,
                "UGC approved Journal (1.5)": 1.5,
                "National Conference (1.25)": 1.25,
                "None (1)": 1,
            },
            mapping: {
                "Strongly to PO (1.5)": 1.5,
                "Strongly to CO (1)": 1,
                "Moderately to PO (1)": 1,
                "Moderately to CO (0.8)": 0.8,
                "Neither mapping to PO or CO (0)": 0,
            },
        };

        // Get the score for each selected option
        const selectedScores = [
            scoreMap.typeOfGuide[formData.typeOfGuide] || 0,
            scoreMap.typeOfOrganisation[formData.typeOfOrganisation] || 0,
            scoreMap.typeOfProject[formData.typeOfProject] || 0,
            scoreMap.publications[formData.publications] || 0,
            scoreMap.mapping[formData.mapping] || 0,
        ];

        // Multiply the selected scores
        const product = selectedScores.reduce((acc, score) => acc * score, 1);

        // Multiply the result with the factor of 50
        const finalScore = Math.round(product * 50); // Round to the nearest integer

        // Update the score state
        setScore(finalScore);
    };


    const handleConfirmSubmit = (e) => {
        e.preventDefault();
        if (!formData.courseName || !formData.typeOfGuide || !formData.typeOfOrganisation || !formData.typeOfProject || !formData.publications || !formData.mapping || !formData.linkEvidence) {
            setModalMessage('All fields are required');
            setShowModal(true);
            return;
        }
        setShowConfirmModal(true);
    };

    const handleSubmit = async () => {
        try {
            const formId = "AI8";

            // Ensure user details are included
            const dataToSubmit = {
                ...formData,
                formId,
                teacherName: user?.name,  // Ensure teacherName is added
                teacherDepartment: user?.department,
                score
            };

            let response;

            if (isEditing) {
                response = await fetch(`http://localhost:5000/api/ai8form/${editFormId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dataToSubmit),
                });
            } else {
                response = await fetch('http://localhost:5000/api/ai8form', {
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
                courseName: '',
                typeOfGuide: '',
                typeOfOrganisation: '',
                typeOfProject: '',
                publications: '',
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
            courseName: form.courseName,
            typeOfGuide: form.typeOfGuide,
            typeOfOrganisation: form.typeOfOrganisation,
            typeOfProject: form.typeOfProject,
            publications: form.publications,
            mapping: form.mapping,
            linkEvidence: form.linkEvidence
        });
        setShowForm(true);
        setIsEditing(true);
        setEditFormId(form._id); // Assuming you have a unique ID for each form submission
    };


    const handleDelete = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/ai8form/${deleteFormId}`, { method: 'DELETE' });

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
                <h2 style={{ backgroundColor: '#537c78' }}>AI-8 Mini Project (Subject head)</h2>

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
                                                    Guide Type, Organization Type, Project Type, Publication, and Mapping.
                                                </li>
                                                <li>
                                                    After multiplying all the values, the result is multiplied by 10 to get the final score.
                                                </li>
                                                <li style={{ marginBottom: '20px' }}>
                                                    <strong>Example:</strong> If the selected values are:<br />
                                                    Guide Type = 1.5, Organization = 1.3, Project = 1.0, Publication = 1.75, Mapping = 1.5
                                                </li>
                                                <li style={{ marginBottom: '20px' }}>
                                                    Then Final Score = <code>1.5 × 1.3 × 1.0 × 1.75 × 1.5 × 10 = 51.18</code>
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
                                            <tr>
                                                <td><strong>Course Name:</strong></td>
                                                <td>{submittedForms[currentPage - 1]?.courseName}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Type of Guide:</strong></td>
                                                <td>{submittedForms[currentPage - 1]?.typeOfGuide}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Type of Organisation of Industry Co-guide:</strong></td>
                                                <td>{submittedForms[currentPage - 1]?.typeOfOrganisation}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Type of Project:</strong></td>
                                                <td>{submittedForms[currentPage - 1]?.typeOfProject}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Publications:</strong></td>
                                                <td>{submittedForms[currentPage - 1]?.publications}</td>
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
                            <div className="marks-item marks-item-value">50</div>
                            <div className="marks-item marks-item-header">Maximum marks with bonus</div>
                            <div className="marks-item marks-item-value">295</div>
                            <div className="marks-item marks-item-header">Self Score</div>
                            <div className="marks-item marks-item-value">{score}</div> {/* Display calculated score */}
                        </div>

                        <div className='form-group'>
                            <label className='label1'>Course Name:
                                <input type="text" name="courseName" value={formData.courseName} onChange={handleChange} required className="linkinput" />
                            </label>
                        </div>

                        <div className='form-group'>
                            <label className='label1'>Type of Guide:
                                <select name="typeOfGuide" className="select-input" value={formData.typeOfGuide} onChange={handleChange}>
                                    <option value="">Select</option>
                                    <option value="Industry expert as Co-guide (1.5)">Industry expert as Co-guide (1.5)</option>
                                    <option value="Faculty guided only (1)">Faculty guided only (1)</option>
                                </select>
                            </label>
                        </div>

                        <div className='form-group'>
                            <label className='label1'>Type of Organisation of Industry Co-guide:
                                <select name="typeOfOrganisation" className="select-input" value={formData.typeOfOrganisation} onChange={handleChange}>
                                    <option value="">Select</option>
                                    <option value="MNC (1.5)">MNC (1.5)</option>
                                    <option value="National (1.3)">National (1.3)</option>
                                    <option value="SMEs (1.1)">SMEs (1.1)</option>
                                    <option value="None (1)">None (1)</option>
                                </select>
                            </label>
                        </div>

                        <div className='form-group'>
                            <label className='label1'>Type of Project:
                                <select name="typeOfProject" className="select-input" value={formData.typeOfProject} onChange={handleChange}>
                                    <option value="">Select</option>
                                    <option value="Functional Project (1.0)">Functional Project (1.0)</option>
                                    <option value="Non-functional Project (0.5)">Non-functional Project (0.5)</option>
                                </select>
                            </label>
                        </div>

                        <div className='form-group'>
                            <label className='label1'>Publications:
                                <select name="publications" className="select-input" value={formData.publications} onChange={handleChange}>
                                    <option value="">Select</option>
                                    <option value="Peer Reviewed Journal (1.75)">Peer Reviewed Journal (1.75)</option>
                                    <option value="Int. Conference (1.5)">Int. Conference (1.5)</option>
                                    <option value="UGC approved Journal (1.5)">UGC approved Journal (1.5)</option>
                                    <option value="National Conference (1.25)">National Conference (1.25)</option>
                                    <option value="None (1)">None (1)</option>
                                </select>
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
                            <button
                                type="button"
                                className="cancel-btn"
                                onClick={() => {
                                    setShowForm(false);   // Hide the form
                                    setIsEditing(false);  // Exit edit mode
                                    setEditFormId(null);  // Clear the editing form ID
                                    setFormData({         // Reset form fields
                                        courseName: '',
                                        typeOfGuide: '',
                                        typeOfOrganisation: '',
                                        typeOfProject: '',
                                        publications: '',
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

import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import Bucket1 from '../Bucket1';

export default function Ai1() {
    const [formData, setFormData] = useState({
        hours: '',
        platform: '',
        assessmentOutcome: '',
        dateOfCertification: '',
        link: '',
    });

    const [score, setScore] = useState(0); // State to hold the calculated score
    const [showModal, setShowModal] = useState(false); // Control modal visibility
    const [modalMessage, setModalMessage] = useState(''); // Modal message
    const [formAlreadySubmitted, setFormAlreadySubmitted] = useState(false); // To check if form was already submitted
    const [confirmResubmit, setConfirmResubmit] = useState(false); // Confirm resubmission

    // Point values for each option
    const points = {
        hours: {
            '30+': 1,
            '20+': 0.5,
            'below20': 0,
        },
        platform: {
            'National Professor': 1.5,
            'State Professor': 1,
            'other': 0.4,
        },
        assessmentOutcome: {
            'B or above': 1,
            'pass': 0.4,
            'audit': 0.2,
            'fail': 0,
        },
        dateOfCertification: {
            '2 Years': 1,
            '2 to 4 Years': 0.75,
            '4 to 6': 0.4,
            'More than 6 Years': 0,
        },
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        calculateScore({ ...formData, [name]: value }); // Calculate score on change
    };

    const calculateScore = (data) => {
        const { hours, platform, assessmentOutcome, dateOfCertification } = data;

        // Get points for each selected option
        const hoursPoint = points.hours[hours] || 0;
        const platformPoint = points.platform[platform] || 0;
        const assessmentOutcomePoint = points.assessmentOutcome[assessmentOutcome] || 0;
        const dateOfCertificationPoint = points.dateOfCertification[dateOfCertification] || 0;

        // Calculate the score
        const calculatedScore = hoursPoint * platformPoint * assessmentOutcomePoint * dateOfCertificationPoint * 100;

        // Update score state
        setScore(calculatedScore);
    };

    const checkIfAlreadySubmitted = async (teacherName, teacherDepartment) => {
        try {
            const response = await fetch(`http://localhost:5000/api/form/check-submission?teacherName=${teacherName}&teacherDepartment=${teacherDepartment}`);
            const result = await response.json();
            setFormAlreadySubmitted(result.submitted); // Set the submission status based on the response
        } catch (error) {
            console.error('Error checking submission:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const user = JSON.parse(localStorage.getItem('user'));
        const dataToSend = {
            ...formData,
            teacherName: user.name,
            teacherDepartment: user.department,
        };

        // Check if all fields are filled
        if (!formData.hours || !formData.platform || !formData.assessmentOutcome || !formData.dateOfCertification || !formData.link) {
            setModalMessage('All fields are required');
            setShowModal(true);
            return;
        }

        // Check if the form was already submitted
        if (formAlreadySubmitted && !confirmResubmit) {
            setModalMessage('You have already submitted a response. Do you want to submit again?');
            setShowModal(true);
            return;
        }

        // Submit form logic
        try {
            const response = await fetch('http://localhost:5000/api/form', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend),
            });

            const result = await response.json();
            console.log(result);

            // After successful submission
            setFormAlreadySubmitted(true); // Mark form as submitted
            setConfirmResubmit(false); // Reset resubmission confirmation
            setModalMessage('Form submitted successfully!');
            setShowModal(true);

        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const handleModalConfirm = () => {
        setShowModal(false);
        setConfirmResubmit(true); // Allow resubmission
        handleSubmit(new Event('submit')); // Resubmit form
    };

    const handleModalClose = () => {
        setShowModal(false);
        setConfirmResubmit(false); // Don't allow resubmission
        window.location.reload(); // Refresh the page
    };

    // Use useEffect to check if the form is already submitted when component mounts
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            checkIfAlreadySubmitted(user.name, user.department);
        }
    }, []); // Run only on mount

    return (
        <>
            <Bucket1 />
            <div className='bt-container'>
                <h2>AI-1 Certification for Courses Allotted</h2>
                <div className="vertical-compartment-box">
                    {/* Create 8 compartments */}
                    <div className="compartment" style={{ width: '17%' }}>Marks (M)</div>
                    <div className="compartment" style={{ width: '10%' }}>100</div>
                    <div className="compartment" style={{ width: '25%' }}>Maximum marks with bonus</div>
                    <div className="compartment" style={{ width: '10%' }}>150</div>
                    <div className="compartment" style={{ width: '17%' }}>Self Score</div>
                    <div className="compartment" style={{ width: '10%' }}>{score.toFixed(2)}</div> {/* Display calculated score */}
                    <div className="compartment" style={{ width: '25%' }}>Score after review by RO</div>
                    <div className="compartment" style={{ width: '10%' }}></div>
                </div>
                <form className='form-container' onSubmit={handleSubmit}>
                    <div className='form-group'>
                        <label className='label1'>
                            Number of Hours:
                            <select name="hours" className="select-input" onChange={handleChange}>
                                <option value="">Select</option>
                                <option value="30+">30+</option>
                                <option value="20+">20+</option>
                                <option value="below20">Below 20</option>
                            </select>
                        </label>
                    </div>

                    <div className='form-group'>
                        <label className='label1'>
                            Platform:
                            <select name="platform" className="select-input" onChange={handleChange}>
                                <option value="">Select</option>
                                <option value="National Professor">Professor / Industry Expert of National / International repute</option>
                                <option value="State Professor">Professor from State college</option>
                                <option value="other">Any Other</option>
                            </select>
                        </label>
                    </div>

                    <div className='form-group'>
                        <label className='label1'>
                            Assessment Outcome:
                            <select name="assessmentOutcome" className="select-input" onChange={handleChange}>
                                <option value="">Select</option>
                                <option value="B or above">Grade B and above</option>
                                <option value="pass">Pass</option>
                                <option value="audit">Audit</option>
                                <option value="fail">Fail</option>
                            </select>
                        </label>
                    </div>

                    <div className='form-group'>
                        <label className='label1'>
                            Date of Certification:
                            <select name="dateOfCertification" className="select-input" onChange={handleChange}>
                                <option value="">Select</option>
                                <option value="2 Years">2 Years</option>
                                <option value="2 to 4 Years">2 to 4 Years</option>
                                <option value="4 to 6">4 to 6</option>
                                <option value="More than 6 Years">More than 6 Years</option>
                            </select>
                        </label>
                    </div>

                    <div className='form-group'>
                        <label className='label1'>
                            Link:
                            <input className='linkinput'
                                type="text"
                                name="link"
                                onChange={handleChange}
                            />
                        </label>
                    </div>

                    <button type="submit" className='submit-btn'>Submit</button>

                </form>
            </div>
            {/* Bootstrap Modal for feedback */}
            {/* Bootstrap Modal */}
            {showModal && (
                <>
                    <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Alert</h5>
                                    <button type="button" className="btn-close" onClick={handleModalClose}></button>
                                </div>
                                <div className="modal-body">
                                    <p>{modalMessage}</p>
                                </div>
                                <div className="modal-footer">
                                    {modalMessage === 'You have already submitted a response. Do you want to submit again?' ? (
                                        <>
                                            <button type="button" className="btn btn-secondary" onClick={handleModalClose}>No</button>
                                            <button type="button" className="btn btn-primary" onClick={handleModalConfirm}>Yes</button>
                                        </>
                                    ) : (
                                        <button type="button" className="btn btn-primary" onClick={handleModalClose}>OK</button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Modal backdrop */}
                    <div className="modal-backdrop fade show"></div>
                </>
            )}
        </>
    );
}
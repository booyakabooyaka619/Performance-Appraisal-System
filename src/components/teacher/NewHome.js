import React, { useState, useEffect } from 'react';
import './newhome.css';
import NewNavbar from './NewNavbar';
import { Link } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';

export default function NewHome({ user, onLogout }) {
    const [progress, setProgress] = useState(0);
    const [sdProgress, setSdProgress] = useState(0); // For SD
    const [abProgress, setAbProgress] = useState(0);
    const [rbProgress, setRbProgress] = useState(0);
    const [cbProgress, setCbProgress] = useState(0);
    const [pbProgress, setPbProgress] = useState(0);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false); // Track submission status
    const [isSubmitting, setIsSubmitting] = useState(false);


    // Fetch Academic Involvement progress dynamically
    const fetchProgress = async () => {
        if (!user) {
            console.log("User not found");
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/progress/academic-involvement/progress?teacherName=${user.name}`);
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const result = await response.json();
            console.log("Progress data:", result);
            setProgress(result.progressPercentage);

            const sdResponse = await fetch(`http://localhost:5000/api/progress/student-development/progress?teacherName=${user.name}`);
            if (!sdResponse.ok) throw new Error(`SD Progress error! Status: ${sdResponse.status}`);
            const sdResult = await sdResponse.json();
            console.log("SD Progress:", sdResult);
            setSdProgress(sdResult.progressPercentage); // use a separate state like setSdProgress

            const abResponse = await fetch(`http://localhost:5000/api/progress/administrative/progress?teacherName=${user.name}`);
            if (!abResponse.ok) throw new Error(`ADMIN Progress error! Status: ${abResponse.status}`);
            const abResult = await abResponse.json();
            console.log("ADMIN Progress:", abResult);
            setAbProgress(abResult.progressPercentage); // use a separate state like setSdProgress

            const rbResponse = await fetch(`http://localhost:5000/api/progress/research/progress?teacherName=${user.name}`);
            if (!rbResponse.ok) throw new Error(`RESEARCH Progress error! Status: ${rbResponse.status}`);
            const rbResult = await rbResponse.json();
            console.log("RESEARCH Progress:", rbResult);
            setRbProgress(rbResult.progressPercentage); // use a separate state like setSdProgress

            const cbResponse = await fetch(`http://localhost:5000/api/progress/consultancy/progress?teacherName=${user.name}`);
            if (!cbResponse.ok) throw new Error(`CONSULT Progress error! Status: ${cbResponse.status}`);
            const cbResult = await cbResponse.json();
            console.log("CONSULT Progress:", cbResult);
            setCbProgress(cbResult.progressPercentage); // use a separate state like setSdProgress

            const pbResponse = await fetch(`http://localhost:5000/api/progress/product-development/progress?teacherName=${user.name}`);
            if (!pbResponse.ok) throw new Error(`PROD Progress error! Status: ${pbResponse.status}`);
            const pbResult = await pbResponse.json();
            console.log("PROD Progress:", pbResult);
            setPbProgress(pbResult.progressPercentage); // use a separate state like setSdProgress
        } catch (error) {
            console.error('Error fetching progress:', error);
        }
    };

    // ✅ Fetch submission status from the backend
    const fetchSubmissionStatus = async () => {
        if (!user) return;

        try {
            const response = await fetch(`http://localhost:5000/api/submitStatus?teacherName=${encodeURIComponent(user.name)}`);

            if (!response.ok) {
                if (response.status === 404) {
                    console.log("Teacher not found or no submission recorded");
                    setIsSubmitted(false);
                    return;
                }
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            setIsSubmitted(result.isSubmitted); // Update state based on response
        } catch (error) {
            console.error("Error fetching submission status:", error);
        }
    };


    // Function to handle submission
    const handleFinalSubmit = async () => {
        setShowConfirmModal(false); // Close the confirmation modal
        setIsSubmitting(true); // Show spinner


        if (!user) {
            console.log("User data is missing");
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/submitStatus', {


                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: user.name,
                    department: user.department,
                    employeeCode: user.employeeCode,
                }),
            });

            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            // Notify RO about submission
            await fetch('http://localhost:5000/api/notifications/new', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: `${user.name} has submitted their form.`,
                    teacherUsername: user.username, // 🔥 Add this line
                }),
            });


            setIsSubmitted(true); // Mark form as submitted
            setModalMessage('Form submitted successfully!'); // Show success message
            setShowMessageModal(true); // Open success modal
        } catch (error) {
            console.error('Error submitting:', error);
            setModalMessage('Submission failed. Please try again.');
            setShowMessageModal(true);
        } finally {
            setIsSubmitting(false); // Hide spinner after all operations
        }
    };

    // ✅ Check status before proceeding to submit
    const handleProceedToSubmit = async () => {
        await fetchSubmissionStatus(); // Ensure we get the latest submission status

        if (isSubmitted) {
            setModalMessage('Form already submitted!'); // Show warning message
            setShowMessageModal(true);
        } else {
            setShowConfirmModal(true); // Show confirmation modal
        }
    };

    useEffect(() => {
        fetchProgress();
        fetchSubmissionStatus(); // Fetch the status when the component loads
    }, [user]);

    return (
        <div>
            {/* Navbar Component */}
            <NewNavbar user={user} onLogout={onLogout} />

            {/* Spinner Overlay */}
            {isSubmitting && (
                <div className="spinner-overlay">
                    <div className="spinner"></div>
                </div>
            )}

            {/* Buckets Section */}
            <div className="hombucket-container">
                <Link to="/AI/AI1" className="hombucket1">
                    <div className="progress-overlay" style={{ width: `${progress}%` }}></div>
                    <span className="bucket-text">Academic Involvement</span>
                </Link>

                <Link to="/SD/SD1" className="hombucket2">
                    <div className="sdprogress-overlay" style={{ width: `${sdProgress}%` }}></div>
                    <span className="bucket-text">Student Development</span>
                </Link>

                <Link to="/AB/AB1" className="hombucket3">
                    <div className="abprogress-overlay" style={{ width: `${abProgress}%` }}></div>
                    <span className="bucket-text">Administrative</span>
                </Link>

                <Link to="/RB/RB1" className="hombucket4">
                    <div className="rbprogress-overlay" style={{ width: `${rbProgress}%` }}></div>
                    <span className="bucket-text">Research</span>
                </Link>

                <Link to="/CB/CB1" className="hombucket5">
                    <div className="cbprogress-overlay" style={{ width: `${cbProgress}%` }}></div>
                    <span className="bucket-text">Consultancy and Corporate Training</span>
                </Link>

                <Link to="/PDB/PDB1" className="hombucket6">
                    <div className="pbprogress-overlay" style={{ width: `${pbProgress}%` }}></div>
                    <span className="bucket-text">Product Development</span>
                </Link>
            </div>

            {/* 🚀 Proceed to Submit Button */}
            <div className="submit-container">
                <button
                    className="submit-button"
                    disabled={progress < 100 || sdProgress < 100 || abProgress < 100 || pbProgress < 100 || cbProgress < 100 || pbProgress < 100}
                    onClick={handleProceedToSubmit}
                >
                    Proceed to Submit
                </button>
            </div>


            {/* ✅ Submission Confirmation Modal */}
            <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
                <Modal.Body>Are you sure you want to submit the form?</Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={() => setShowConfirmModal(false)}>Cancel</Button>
                    <Button variant="success" onClick={handleFinalSubmit}>Yes, Submit</Button>
                </Modal.Footer>
            </Modal>

            {/* ✅ Message Modal for Success or Already Submitted */}
            <Modal show={showMessageModal} onHide={() => setShowMessageModal(false)}>
                <Modal.Body>{modalMessage}</Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => setShowMessageModal(false)}>OK</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

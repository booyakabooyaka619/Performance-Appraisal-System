import React, { useEffect, useState, useCallback } from "react";
import { Button, Modal } from "react-bootstrap";
import "../teacher/summary.css";
import RONavbar from "./RONavbar";
import { useLocation } from "react-router-dom";
import { useNavigate } from 'react-router-dom';


export default function ProfHome({ user: propUser, onLogout }) {
    const location = useLocation();
    const [expandedBucket, setExpandedBucket] = useState(null);
    const [score, setScore] = useState({});

    const [submissionStatuses, setSubmissionStatuses] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [teacherName, setTeacherName] = useState(location.state?.teacherName || localStorage.getItem("teacherName"));
    const [teacherDepartment, setTeacherDepartment] = useState(location.state?.teacherDepartment || localStorage.getItem("teacherDepartment"));
    const [employeeCode, setEmployeeCode] = useState(location.state?.employeeCode || localStorage.getItem("employeeCode"));
    const [designation, setDesignation] = useState(location.state?.designation || localStorage.getItem("designation"));
    const [isReviewClickable, setIsReviewClickable] = useState(() => {
        const stored = localStorage.getItem("isReviewClickable");
        return stored === "true"; // safely convert to boolean
    });
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showAlreadySubmittedModal, setShowAlreadySubmittedModal] = useState(false);
    const [AIProgress, setAIProgress] = useState(0);
    const [AIInternalProgress, setAIInternalProgress] = useState(0);

    const [SDProgress, setSDProgress] = useState(0);
    const [SDInternalProgress, setSDInternalProgress] = useState(0);

    const [ABProgress, setABProgress] = useState(0);
    const [ABInternalProgress, setABInternalProgress] = useState(0);

    const [RBProgress, setRBProgress] = useState(0);
    const [RBInternalProgress, setRBInternalProgress] = useState(0);

    const [CBProgress, setCBProgress] = useState(0);
    const [CBInternalProgress, setCBInternalProgress] = useState(0);

    const [PDBProgress, setPDBProgress] = useState(0);
    const [PDBInternalProgress, setPDBInternalProgress] = useState(0);

    const [AIEvaluationStatus, setAIEvaluationStatus] = useState({});
    const [SDEvaluationStatus, setSDEvaluationStatus] = useState({});
    const [ABEvaluationStatus, setABEvaluationStatus] = useState({});
    const [RBEvaluationStatus, setRBEvaluationStatus] = useState({});
    const [CBEvaluationStatus, setCBEvaluationStatus] = useState({});
    const [PDBEvaluationStatus, setPDBEvaluationStatus] = useState({});


    const [internalProgress, setInternalProgress] = useState(0); // Hidden state for actual AIProgress
    const navigate = useNavigate();
    const totalAIMarks = 2000; // Sum of all marks (100 + 300 + 75 + 75 + 75)
    const totalSDMarks = 2000;
    const totalABMarks = 800;
    const totalRBMarks = 800;
    const totalCBMarks = 800;
    const totalPDBMarks = 800;

    const totalMaxAIMarks = 7091; // Sum of all max marks (150 + 300 + 113 + 278 + 338)
    const totalMaxSDMarks = 2800;
    const totalMaxABMarks = 2400;
    const totalMaxRBMarks = 1788;
    const totalMaxCBMarks = 1806;
    const totalMaxPDBMarks = 1680;

    const totalAISelfScore = (score?.AI1 || 0) + (score?.AI2 || 0) + (score?.AI31 || 0) + (score?.AI32 || 0) + (score?.AI33 || 0) + (score?.AI34 || 0) + (score?.AI4 || 0) + (score?.AI5 || 0) + (score?.AI6 || 0) + (score?.AI7 || 0) + (score?.AI8 || 0) + (score?.AI9 || 0) + (score?.AI10 || 0) + (score?.AI11 || 0) + (score?.AI12 || 0) + (score?.AI13 || 0) + (score?.AI14 || 0);

    const totalSDSelfScore =
        (score?.SD1 || 0) + (score?.SD2 || 0) + (score?.SD3 || 0) + (score?.SD4 || 0) + (score?.SD5 || 0);

    const totalABSelfScore =
        (score?.AB1 || 0) + (score?.AB2 || 0) + (score?.AB3 || 0) + (score?.AB4 || 0) + (score?.AB5 || 0) +
        (score?.AB6 || 0) + (score?.AB7 || 0) + (score?.AB8 || 0) + (score?.AB9 || 0);

    const totalRBSelfScore =
        (score?.RB1 || 0) + (score?.RB2 || 0) + (score?.RB3 || 0) + (score?.RB4 || 0) + (score?.RB5 || 0) +
        (score?.RB6 || 0) + (score?.RB7 || 0) + (score?.RB8 || 0) + (score?.RB9 || 0) + (score?.RB10 || 0) +
        (score?.RB11 || 0) + (score?.RB12 || 0);

    const totalCBSelfScore =
        (score?.CB1 || 0) + (score?.CB2 || 0) + (score?.CB3 || 0);

    const totalPDBSelfScore =
        (score?.PDB1 || 0) + (score?.PDB2 || 0);



    const totalAIReviewedScore =
        ((AIEvaluationStatus["AI1"] !== "Incomplete" && AIEvaluationStatus["AI1"] !== "N/A") ? (parseFloat(AIEvaluationStatus["AI1"]) || 0) : 0) +
        ((AIEvaluationStatus["AI2"] !== "Incomplete" && AIEvaluationStatus["AI2"] !== "N/A") ? (parseFloat(AIEvaluationStatus["AI2"]) || 0) : 0) +
        ((AIEvaluationStatus["AI31"] !== "Incomplete" && AIEvaluationStatus["AI31"] !== "N/A") ? (parseFloat(AIEvaluationStatus["AI31"]) || 0) : 0) +
        ((AIEvaluationStatus["AI32"] !== "Incomplete" && AIEvaluationStatus["AI32"] !== "N/A") ? (parseFloat(AIEvaluationStatus["AI32"]) || 0) : 0) +
        ((AIEvaluationStatus["AI33"] !== "Incomplete" && AIEvaluationStatus["AI33"] !== "N/A") ? (parseFloat(AIEvaluationStatus["AI33"]) || 0) : 0) +
        ((AIEvaluationStatus["AI34"] !== "Incomplete" && AIEvaluationStatus["AI34"] !== "N/A") ? (parseFloat(AIEvaluationStatus["AI34"]) || 0) : 0) +
        ((AIEvaluationStatus["AI4"] !== "Incomplete" && AIEvaluationStatus["AI4"] !== "N/A") ? (parseFloat(AIEvaluationStatus["AI4"]) || 0) : 0) +
        ((AIEvaluationStatus["AI5"] !== "Incomplete" && AIEvaluationStatus["AI5"] !== "N/A") ? (parseFloat(AIEvaluationStatus["AI5"]) || 0) : 0) +
        ((AIEvaluationStatus["AI6"] !== "Incomplete" && AIEvaluationStatus["AI6"] !== "N/A") ? (parseFloat(AIEvaluationStatus["AI6"]) || 0) : 0) +
        ((AIEvaluationStatus["AI7"] !== "Incomplete" && AIEvaluationStatus["AI7"] !== "N/A") ? (parseFloat(AIEvaluationStatus["AI7"]) || 0) : 0) +
        ((AIEvaluationStatus["AI8"] !== "Incomplete" && AIEvaluationStatus["AI8"] !== "N/A") ? (parseFloat(AIEvaluationStatus["AI8"]) || 0) : 0) +
        ((AIEvaluationStatus["AI9"] !== "Incomplete" && AIEvaluationStatus["AI9"] !== "N/A") ? (parseFloat(AIEvaluationStatus["AI9"]) || 0) : 0) +
        ((AIEvaluationStatus["AI10"] !== "Incomplete" && AIEvaluationStatus["AI10"] !== "N/A") ? (parseFloat(AIEvaluationStatus["AI10"]) || 0) : 0) +
        ((AIEvaluationStatus["AI11"] !== "Incomplete" && AIEvaluationStatus["AI11"] !== "N/A") ? (parseFloat(AIEvaluationStatus["AI11"]) || 0) : 0) +
        ((AIEvaluationStatus["AI12"] !== "Incomplete" && AIEvaluationStatus["AI12"] !== "N/A") ? (parseFloat(AIEvaluationStatus["AI12"]) || 0) : 0) +
        ((AIEvaluationStatus["AI13"] !== "Incomplete" && AIEvaluationStatus["AI13"] !== "N/A") ? (parseFloat(AIEvaluationStatus["AI13"]) || 0) : 0) +
        ((AIEvaluationStatus["AI14"] !== "Incomplete" && AIEvaluationStatus["AI14"] !== "N/A") ? (parseFloat(AIEvaluationStatus["AI14"]) || 0) : 0);


    const totalSDReviewedScore =
        ((SDEvaluationStatus["SD1"] !== "Incomplete" && SDEvaluationStatus["SD1"] !== "N/A") ? (parseFloat(SDEvaluationStatus["SD1"]) || 0) : 0) +
        ((SDEvaluationStatus["SD2"] !== "Incomplete" && SDEvaluationStatus["SD2"] !== "N/A") ? (parseFloat(SDEvaluationStatus["SD2"]) || 0) : 0) +
        ((SDEvaluationStatus["SD3"] !== "Incomplete" && SDEvaluationStatus["SD3"] !== "N/A") ? (parseFloat(SDEvaluationStatus["SD3"]) || 0) : 0) +
        ((SDEvaluationStatus["SD4"] !== "Incomplete" && SDEvaluationStatus["SD4"] !== "N/A") ? (parseFloat(SDEvaluationStatus["SD4"]) || 0) : 0) +
        ((SDEvaluationStatus["SD5"] !== "Incomplete" && SDEvaluationStatus["SD5"] !== "N/A") ? (parseFloat(SDEvaluationStatus["SD5"]) || 0) : 0);

    const totalABReviewedScore =
        Array.from({ length: 9 }, (_, i) => i + 1).reduce((sum, n) => {
            const key = `AB${n}`;
            return sum + ((ABEvaluationStatus[key] !== "Incomplete" && ABEvaluationStatus[key] !== "N/A") ? (parseFloat(ABEvaluationStatus[key]) || 0) : 0);
        }, 0);

    const totalRBReviewedScore =
        Array.from({ length: 12 }, (_, i) => i + 1).reduce((sum, n) => {
            const key = `RB${n}`;
            return sum + ((RBEvaluationStatus[key] !== "Incomplete" && RBEvaluationStatus[key] !== "N/A") ? (parseFloat(RBEvaluationStatus[key]) || 0) : 0);
        }, 0);

    const totalCBReviewedScore =
        Array.from({ length: 3 }, (_, i) => i + 1).reduce((sum, n) => {
            const key = `CB${n}`;
            return sum + ((CBEvaluationStatus[key] !== "Incomplete" && CBEvaluationStatus[key] !== "N/A") ? (parseFloat(CBEvaluationStatus[key]) || 0) : 0);
        }, 0);

    const totalPDBReviewedScore =
        Array.from({ length: 2 }, (_, i) => i + 1).reduce((sum, n) => {
            const key = `PDB${n}`;
            return sum + ((PDBEvaluationStatus[key] !== "Incomplete" && PDBEvaluationStatus[key] !== "N/A") ? (parseFloat(PDBEvaluationStatus[key]) || 0) : 0);
        }, 0);


    useEffect(() => {
        const hasAnyScore =
            totalAISelfScore > 0 || totalAIReviewedScore > 0 ||
            totalSDSelfScore > 0 || totalSDReviewedScore > 0 ||
            totalABSelfScore > 0 || totalABReviewedScore > 0 ||
            totalRBSelfScore > 0 || totalRBReviewedScore > 0 ||
            totalCBSelfScore > 0 || totalCBReviewedScore > 0 ||
            totalPDBSelfScore > 0 || totalPDBReviewedScore > 0;

        if (hasAnyScore) {
            const summaryData = {
                teacherName,
                totalAISelfScore,
                totalAIReviewedScore,
                totalSDSelfScore,
                totalSDReviewedScore,
                totalABSelfScore,
                totalABReviewedScore,
                totalRBSelfScore,
                totalRBReviewedScore,
                totalCBSelfScore,
                totalCBReviewedScore,
                totalPDBSelfScore,
                totalPDBReviewedScore
            };

            localStorage.setItem("totalAISelfScore", totalAISelfScore);
            localStorage.setItem("totalAIReviewedScore", totalAIReviewedScore);
            localStorage.setItem("totalSDSelfScore", totalSDSelfScore);
            localStorage.setItem("totalSDReviewedScore", totalSDReviewedScore);
            localStorage.setItem("totalABSelfScore", totalABSelfScore);
            localStorage.setItem("totalABReviewedScore", totalABReviewedScore);
            localStorage.setItem("totalRBSelfScore", totalRBSelfScore);
            localStorage.setItem("totalRBReviewedScore", totalRBReviewedScore);
            localStorage.setItem("totalCBSelfScore", totalCBSelfScore);
            localStorage.setItem("totalCBReviewedScore", totalCBReviewedScore);
            localStorage.setItem("totalPDBSelfScore", totalPDBSelfScore);
            localStorage.setItem("totalPDBReviewedScore", totalPDBReviewedScore);
        }
    }, [
        teacherName, employeeCode, designation,
        totalAISelfScore, totalAIReviewedScore,
        totalSDSelfScore, totalSDReviewedScore,
        totalABSelfScore, totalABReviewedScore,
        totalRBSelfScore, totalRBReviewedScore,
        totalCBSelfScore, totalCBReviewedScore,
        totalPDBSelfScore, totalPDBReviewedScore
    ]);

    const calculateAIProgress = () => {
        const totalForms = 17;
        let submittedCount = 0;
        Object.values(AIEvaluationStatus).forEach(status => {
            if (status !== "❌" && status !== "Incomplete" && status !== "N/A") {
                submittedCount++;
            }
        });
        return (submittedCount / totalForms) * 100;
    };

    const calculateSDProgress = () => {
        const totalForms = 5;
        let submittedCount = 0;
        Object.values(SDEvaluationStatus).forEach(status => {
            if (status !== "❌" && status !== "Incomplete" && status !== "N/A") {
                submittedCount++;
            }
        });
        return (submittedCount / totalForms) * 100;
    };

    const calculateABProgress = () => {
        const totalForms = 9;
        let submittedCount = 0;
        Object.values(ABEvaluationStatus).forEach(status => {
            if (status !== "❌" && status !== "Incomplete" && status !== "N/A") {
                submittedCount++;
            }
        });
        return (submittedCount / totalForms) * 100;
    };

    const calculateRBProgress = () => {
        const totalForms = 12;
        let submittedCount = 0;
        Object.values(RBEvaluationStatus).forEach(status => {
            if (status !== "❌" && status !== "Incomplete" && status !== "N/A") {
                submittedCount++;
            }
        });
        return (submittedCount / totalForms) * 100;
    };

    const calculateCBProgress = () => {
        const totalForms = 3;
        let submittedCount = 0;
        Object.values(CBEvaluationStatus).forEach(status => {
            if (status !== "❌" && status !== "Incomplete" && status !== "N/A") {
                submittedCount++;
            }
        });
        return (submittedCount / totalForms) * 100;
    };

    const calculatePDBProgress = () => {
        const totalForms = 2;
        let submittedCount = 0;
        Object.values(PDBEvaluationStatus).forEach(status => {
            if (status !== "❌" && status !== "Incomplete" && status !== "N/A") {
                submittedCount++;
            }
        });
        return (submittedCount / totalForms) * 100;
    };



    // Calculate AIProgress behind the scenes
    useEffect(() => {
        const ai = calculateAIProgress();
        const sd = calculateSDProgress();
        const ab = calculateABProgress();
        const rb = calculateRBProgress();
        const cb = calculateCBProgress();
        const pdb = calculatePDBProgress();

        // Set internal progress (immediate)
        setAIInternalProgress(ai);
        setSDInternalProgress(sd);
        setABInternalProgress(ab);
        setRBInternalProgress(rb);
        setCBInternalProgress(cb);
        setPDBInternalProgress(pdb);

        // Animate visible progress with delay
        setTimeout(() => {
            setAIProgress(ai);
            setSDProgress(sd);
            setABProgress(ab);
            setRBProgress(rb);
            setCBProgress(cb);
            setPDBProgress(pdb);
        }, 300);
    }, [AIEvaluationStatus, SDEvaluationStatus, ABEvaluationStatus, RBEvaluationStatus, CBEvaluationStatus, PDBEvaluationStatus]);



    // useEffect(() => {
    //     const newProgress = calculateAIProgress();
    //     setInternalProgress(newProgress); 

    //     setTimeout(() => {
    //         setProgress(newProgress); 
    //     }, 300);
    // }, [evaluationStatus]); 




    const handleCompleteReview = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/reviews/check-status", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ employeeCode })
            });

            const data = await response.json();

            if (response.ok && data.reviewCompleted) {
                // Show already submitted modal
                setShowAlreadySubmittedModal(true);
            } else {
                // Show confirmation modal
                setShowConfirmModal(true);
            }
        } catch (error) {
            console.error("Error checking review status:", error);
        }
    };


    const confirmCompleteReview = async () => {
        setShowConfirmModal(false);
        setIsSubmitting(true); // Show spinner

        try {
            // 1. Complete Review API
            const response = await fetch("http://localhost:5000/api/reviews/complete-review", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ employeeCode })
            });

            const data = await response.json();

            if (response.ok) {
                setShowSuccessModal(true);

                // 2. Send Notification API
                await fetch("http://localhost:5000/api/teacher-alerts/send", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        employeeCode,
                        message: "Your review has been completed by RO."
                    })
                });
            } else {
                console.error("Error:", data.message);
            }
        } catch (error) {
            console.error("Error completing review:", error);
        } finally {
            setIsSubmitting(false); // Hide spinner after everything
        }
    };




    useEffect(() => {
        fetchAIScore();
        fetchSDScore();
        fetchABScore();
        fetchRBScore();
        fetchCBScore();
        fetchPDBScore();
    }, []);

    const fetchAIScore = async () => {
        try {
            // Fetch score for AI1
            const responseAI1 = await fetch(
                `http://localhost:5000/api/ai1form/submissions?teacherName=${teacherName}&teacherDepartment=${teacherDepartment}&formId=AI1`
            );
            if (!responseAI1.ok) throw new Error("Failed to fetch score for AI1");
            const resultAI1 = await responseAI1.json();

            // Fetch score for AI2
            const responseAI2 = await fetch(
                `http://localhost:5000/api/ai2form/submissions?teacherName=${teacherName}&teacherDepartment=${teacherDepartment}&formId=AI2`
            );
            if (!responseAI2.ok) throw new Error("Failed to fetch score for AI2");
            const resultAI2 = await responseAI2.json();

            // Fetch score for AI31
            const responseAI31 = await fetch(
                `http://localhost:5000/api/ai31form/submissions?teacherName=${teacherName}&teacherDepartment=${teacherDepartment}&formId=AI31`
            );
            if (!responseAI31.ok) throw new Error("Failed to fetch score for AI31");
            const resultAI31 = await responseAI31.json();

            // Fetch score for AI32
            const responseAI32 = await fetch(
                `http://localhost:5000/api/ai32form/submissions?teacherName=${teacherName}&teacherDepartment=${teacherDepartment}&formId=AI32`
            );
            if (!responseAI32.ok) throw new Error("Failed to fetch score for AI32");
            const resultAI32 = await responseAI32.json();

            // Fetch score for AI33
            const responseAI33 = await fetch(
                `http://localhost:5000/api/ai33form/submissions?teacherName=${teacherName}&teacherDepartment=${teacherDepartment}&formId=AI33`
            );
            if (!responseAI33.ok) throw new Error("Failed to fetch score for AI33");
            const resultAI33 = await responseAI33.json();

            // Fetch score for AI34
            const responseAI34 = await fetch(
                `http://localhost:5000/api/ai34form/submissions?teacherName=${teacherName}&teacherDepartment=${teacherDepartment}&formId=AI34`
            );
            if (!responseAI34.ok) throw new Error("Failed to fetch score for AI34");
            const resultAI34 = await responseAI34.json();

            // Fetch score for AI4
            const responseAI4 = await fetch(
                `http://localhost:5000/api/ai4form/submissions?teacherName=${teacherName}&teacherDepartment=${teacherDepartment}&formId=AI4`
            );
            if (!responseAI4.ok) throw new Error("Failed to fetch score for AI4");
            const resultAI4 = await responseAI4.json();

            // Fetch score for AI5
            const responseAI5 = await fetch(
                `http://localhost:5000/api/ai5form/submissions?teacherName=${teacherName}&teacherDepartment=${teacherDepartment}&formId=AI5`
            );
            if (!responseAI5.ok) throw new Error("Failed to fetch score for AI5");
            const resultAI5 = await responseAI5.json();

            // Fetch score for AI6
            const responseAI6 = await fetch(
                `http://localhost:5000/api/ai6form/submissions?teacherName=${teacherName}&teacherDepartment=${teacherDepartment}&formId=AI6`
            );
            if (!responseAI6.ok) throw new Error("Failed to fetch score for AI6");
            const resultAI6 = await responseAI6.json();

            // Fetch score for AI7
            const responseAI7 = await fetch(
                `http://localhost:5000/api/ai7form/submissions?teacherName=${teacherName}&teacherDepartment=${teacherDepartment}&formId=AI7`
            );
            if (!responseAI7.ok) throw new Error("Failed to fetch score for AI7");
            const resultAI7 = await responseAI7.json();

            // Fetch score for AI8
            const responseAI8 = await fetch(
                `http://localhost:5000/api/ai8form/submissions?teacherName=${teacherName}&teacherDepartment=${teacherDepartment}&formId=AI8`
            );
            if (!responseAI8.ok) throw new Error("Failed to fetch score for AI8");
            const resultAI8 = await responseAI8.json();

            // Fetch score for AI9
            const responseAI9 = await fetch(
                `http://localhost:5000/api/ai9form/submissions?teacherName=${teacherName}&teacherDepartment=${teacherDepartment}&formId=AI9`
            );
            if (!responseAI9.ok) throw new Error("Failed to fetch score for AI9");
            const resultAI9 = await responseAI9.json();

            // Fetch score for AI10
            const responseAI10 = await fetch(
                `http://localhost:5000/api/ai10form/submissions?teacherName=${teacherName}&teacherDepartment=${teacherDepartment}&formId=AI10`
            );
            if (!responseAI10.ok) throw new Error("Failed to fetch score for AI10");
            const resultAI10 = await responseAI10.json();

            // Fetch score for AI11
            const responseAI11 = await fetch(
                `http://localhost:5000/api/ai11form/submissions?teacherName=${teacherName}&teacherDepartment=${teacherDepartment}&formId=AI11`
            );
            if (!responseAI11.ok) throw new Error("Failed to fetch score for AI11");
            const resultAI11 = await responseAI11.json();

            // Fetch score for AI12
            const responseAI12 = await fetch(
                `http://localhost:5000/api/ai12form/submissions?teacherName=${teacherName}&teacherDepartment=${teacherDepartment}&formId=AI12`
            );
            if (!responseAI12.ok) throw new Error("Failed to fetch score for AI12");
            const resultAI12 = await responseAI12.json();

            // Fetch score for AI13
            const responseAI13 = await fetch(
                `http://localhost:5000/api/ai13form/submissions?teacherName=${teacherName}&teacherDepartment=${teacherDepartment}&formId=AI13`
            );
            if (!responseAI13.ok) throw new Error("Failed to fetch score for AI13");
            const resultAI13 = await responseAI13.json();

            // Fetch score for AI14
            const responseAI14 = await fetch(
                `http://localhost:5000/api/ai14form/submissions?teacherName=${teacherName}&teacherDepartment=${teacherDepartment}&formId=AI14`
            );
            if (!responseAI14.ok) throw new Error("Failed to fetch score for AI14");
            const resultAI14 = await responseAI14.json();

            // Create an object to store all the scores
            let scores = {};
            let evalStatus = {};

            // Map each result to the respective form
            scores.AI1 = resultAI1.length > 0 ? Math.max(...resultAI1.map(item => item.score)) : "N/A";

            if (resultAI1.length > 0) {
                const roScoresAI1 = resultAI1.map(item => item.scoreByRO).filter(score => score !== undefined && score !== null);
                const totalSubmissionsAI1 = resultAI1.length;
                const completedSubmissionsAI1 = roScoresAI1.length;

                if (totalSubmissionsAI1 === 1) {
                    evalStatus["AI1"] = roScoresAI1.length > 0 ? roScoresAI1[0] : "N/A";
                } else if (completedSubmissionsAI1 === totalSubmissionsAI1) {
                    evalStatus["AI1"] = Math.max(...roScoresAI1);
                } else {
                    evalStatus["AI1"] = "Incomplete";
                }
            } else {
                evalStatus["AI1"] = "N/A";
            }
            // Assuming resultAI2 is the array of scores for the form AI2
            scores.AI2 = resultAI2.length > 0
                ? resultAI2.reduce((sum, item) => sum + item.score, 0) / resultAI2.length
                : "N/A";

            if (resultAI2.length > 0) {
                const roScoresAI2 = resultAI2.map(item => item.scoreByRO).filter(score => score !== undefined && score !== null);
                const totalSubmissionsAI2 = resultAI2.length;
                const completedSubmissionsAI2 = roScoresAI2.length;

                if (totalSubmissionsAI2 === 1) {
                    evalStatus["AI2"] = roScoresAI2.length > 0 ? roScoresAI2[0] : "N/A";
                } else if (completedSubmissionsAI2 === totalSubmissionsAI2) {
                    evalStatus["AI2"] = (roScoresAI2.reduce((sum, s) => sum + s, 0) / completedSubmissionsAI2);
                } else {
                    evalStatus["AI2"] = "Incomplete";
                }
            } else {
                evalStatus["AI2"] = "N/A";
            }

            scores.AI31 = resultAI31.length > 0
                ? resultAI31.reduce((sum, item) => sum + item.score, 0)
                : "N/A";

            if (resultAI31.length > 0) {
                const roScoresAI31 = resultAI31.map(item => item.scoreByRO).filter(score => score !== undefined && score !== null);
                const totalSubmissionsAI31 = resultAI31.length;
                const completedSubmissionsAI31 = roScoresAI31.length;

                if (totalSubmissionsAI31 === 1) {
                    evalStatus["AI31"] = roScoresAI31.length > 0 ? roScoresAI31[0] : "N/A";
                } else if (completedSubmissionsAI31 === 2 && completedSubmissionsAI31 === totalSubmissionsAI31) {
                    evalStatus["AI31"] = roScoresAI31.reduce((sum, s) => sum + s, 0);
                } else {
                    evalStatus["AI31"] = "Incomplete";
                }
            } else {
                evalStatus["AI31"] = "N/A";
            }


            scores.AI32 = resultAI32.length > 0
                ? resultAI32.reduce((sum, item) => sum + item.score, 0)
                : "N/A";

            if (resultAI32.length > 0) {
                const roScoresAI32 = resultAI32.map(item => item.scoreByRO).filter(score => score !== undefined && score !== null);
                const totalSubmissionsAI32 = resultAI32.length;
                const completedSubmissionsAI32 = roScoresAI32.length;

                if (totalSubmissionsAI32 === 1) {
                    evalStatus["AI32"] = roScoresAI32.length > 0 ? roScoresAI32[0] : "N/A";
                } else if (completedSubmissionsAI32 === 2 && completedSubmissionsAI32 === totalSubmissionsAI32) {
                    evalStatus["AI32"] = roScoresAI32.reduce((sum, s) => sum + s, 0);
                } else {
                    evalStatus["AI32"] = "Incomplete";
                }
            } else {
                evalStatus["AI32"] = "N/A";
            }

            scores.AI33 = resultAI33.length > 0
                ? resultAI33.reduce((sum, item) => sum + item.score, 0)
                : "N/A";
            if (resultAI33.length > 0) {
                const roScoresAI33 = resultAI33.map(item => item.scoreByRO).filter(score => score !== undefined && score !== null);
                const totalSubmissionsAI33 = resultAI33.length;
                const completedSubmissionsAI33 = roScoresAI33.length;

                if (totalSubmissionsAI33 === 1) {
                    evalStatus["AI33"] = roScoresAI33.length > 0 ? roScoresAI33[0] : "N/A";
                } else if (completedSubmissionsAI33 === 2 && completedSubmissionsAI33 === totalSubmissionsAI33) {
                    evalStatus["AI33"] = roScoresAI33.reduce((sum, s) => sum + s, 0);
                } else {
                    evalStatus["AI33"] = "Incomplete";
                }
            } else {
                evalStatus["AI33"] = "N/A";
            }

            scores.AI34 = resultAI34.length > 0
                ? resultAI34.reduce((sum, item) => sum + item.score, 0)
                : "N/A";
            if (resultAI34.length > 0) {
                const roScoresAI34 = resultAI34.map(item => item.scoreByRO).filter(score => score !== undefined && score !== null);
                const totalSubmissionsAI34 = resultAI34.length;
                const completedSubmissionsAI34 = roScoresAI34.length;

                if (totalSubmissionsAI34 === 1) {
                    evalStatus["AI34"] = roScoresAI34.length > 0 ? roScoresAI34[0] : "N/A";
                } else if (completedSubmissionsAI34 === 2 && completedSubmissionsAI34 === totalSubmissionsAI34) {
                    evalStatus["AI34"] = roScoresAI34.reduce((sum, s) => sum + s, 0);
                } else {
                    evalStatus["AI34"] = "Incomplete";
                }
            } else {
                evalStatus["AI34"] = "N/A";
            }

            scores.AI4 = resultAI4.length > 0
                ? resultAI4.reduce((sum, item) => sum + item.score, 0) / resultAI4.length
                : "N/A";

            if (resultAI4.length > 0) {
                const roScoresAI4 = resultAI4.map(item => item.scoreByRO).filter(score => score !== undefined && score !== null);
                const totalSubmissionsAI4 = resultAI4.length;
                const completedSubmissionsAI4 = roScoresAI4.length;

                if (totalSubmissionsAI4 === 1) {
                    evalStatus["AI4"] = roScoresAI4.length > 0 ? roScoresAI4[0] : "N/A";
                } else if (completedSubmissionsAI4 === totalSubmissionsAI4) {
                    evalStatus["AI4"] = (roScoresAI4.reduce((sum, s) => sum + s, 0) / completedSubmissionsAI4);
                } else {
                    evalStatus["AI4"] = "Incomplete";
                }
            } else {
                evalStatus["AI4"] = "N/A";
            }

            scores.AI5 = resultAI5.length > 0
                ? resultAI5.reduce((sum, item) => sum + item.score, 0) / resultAI5.length
                : "N/A";

            if (resultAI5.length > 0) {
                const roScoresAI5 = resultAI5.map(item => item.scoreByRO).filter(score => score !== undefined && score !== null);
                const totalSubmissionsAI5 = resultAI5.length;
                const completedSubmissionsAI5 = roScoresAI5.length;

                if (totalSubmissionsAI5 === 1) {
                    evalStatus["AI5"] = roScoresAI5.length > 0 ? roScoresAI5[0] : "N/A";
                } else if (completedSubmissionsAI5 === totalSubmissionsAI5) {
                    evalStatus["AI5"] = (roScoresAI5.reduce((sum, s) => sum + s, 0) / completedSubmissionsAI5);
                } else {
                    evalStatus["AI5"] = "Incomplete";
                }
            } else {
                evalStatus["AI5"] = "N/A";
            }

            scores.AI6 = resultAI6.length > 0 ? Math.max(...resultAI6.map(item => item.score)) : "N/A";

            if (resultAI6.length > 0) {
                const roScoresAI6 = resultAI6.map(item => item.scoreByRO).filter(score => score !== undefined && score !== null);
                const totalSubmissionsAI6 = resultAI6.length;
                const completedSubmissionsAI6 = roScoresAI6.length;

                if (totalSubmissionsAI6 === 6) {
                    evalStatus["AI6"] = roScoresAI6.length > 0 ? roScoresAI6[0] : "N/A";
                } else if (completedSubmissionsAI6 === totalSubmissionsAI6) {
                    evalStatus["AI6"] = Math.max(...roScoresAI6);
                } else {
                    evalStatus["AI6"] = "Incomplete";
                }
            } else {
                evalStatus["AI6"] = "N/A";
            }

            scores.AI7 = resultAI7.length > 0
                ? resultAI7.reduce((sum, item) => sum + item.score, 0) / resultAI7.length
                : "N/A"

            if (resultAI7.length > 0) {
                const roScoresAI7 = resultAI7.map(item => item.scoreByRO).filter(score => score !== undefined && score !== null);
                const totalSubmissionsAI7 = resultAI7.length;
                const completedSubmissionsAI7 = roScoresAI7.length;

                if (totalSubmissionsAI7 === 1) {
                    evalStatus["AI7"] = roScoresAI7.length > 0 ? roScoresAI7[0] : "N/A";
                } else if (completedSubmissionsAI7 === totalSubmissionsAI7) {
                    evalStatus["AI7"] = (roScoresAI7.reduce((sum, s) => sum + s, 0) / completedSubmissionsAI7);
                } else {
                    evalStatus["AI7"] = "Incomplete";
                }
            } else {
                evalStatus["AI7"] = "N/A";
            }

            scores.AI8 = resultAI8.length > 0
                ? resultAI8.reduce((sum, item) => sum + item.score, 0) / resultAI8.length
                : "N/A";

            if (resultAI8.length > 0) {
                const roScoresAI8 = resultAI8.map(item => item.scoreByRO).filter(score => score !== undefined && score !== null);
                const totalSubmissionsAI8 = resultAI8.length;
                const completedSubmissionsAI8 = roScoresAI8.length;

                if (totalSubmissionsAI8 === 1) {
                    evalStatus["AI8"] = roScoresAI8.length > 0 ? roScoresAI8[0] : "N/A";
                } else if (completedSubmissionsAI8 === totalSubmissionsAI8) {
                    evalStatus["AI8"] = (roScoresAI8.reduce((sum, s) => sum + s, 0) / completedSubmissionsAI8);
                } else {
                    evalStatus["AI8"] = "Incomplete";
                }
            } else {
                evalStatus["AI8"] = "N/A";
            }

            scores.AI9 = resultAI9.length > 0 ? Math.max(...resultAI9.map(item => item.score)) : "N/A";

            if (resultAI9.length > 0) {
                const roScoresAI9 = resultAI9.map(item => item.scoreByRO).filter(score => score !== undefined && score !== null);
                const totalSubmissionsAI9 = resultAI9.length;
                const completedSubmissionsAI9 = roScoresAI9.length;

                if (totalSubmissionsAI9 === 9) {
                    evalStatus["AI9"] = roScoresAI9.length > 0 ? roScoresAI9[0] : "N/A";
                } else if (completedSubmissionsAI9 === totalSubmissionsAI9) {
                    evalStatus["AI9"] = Math.max(...roScoresAI9);
                } else {
                    evalStatus["AI9"] = "Incomplete";
                }
            } else {
                evalStatus["AI9"] = "N/A";
            }

            scores.AI10 = resultAI10.length > 0 ? Math.max(...resultAI10.map(item => item.score)) : "N/A";

            if (resultAI10.length > 0) {
                const roScoresAI10 = resultAI10.map(item => item.scoreByRO).filter(score => score !== undefined && score !== null);
                const totalSubmissionsAI10 = resultAI10.length;
                const completedSubmissionsAI10 = roScoresAI10.length;

                if (totalSubmissionsAI10 === 10) {
                    evalStatus["AI10"] = roScoresAI10.length > 0 ? roScoresAI10[0] : "N/A";
                } else if (completedSubmissionsAI10 === totalSubmissionsAI10) {
                    evalStatus["AI10"] = Math.max(...roScoresAI10);
                } else {
                    evalStatus["AI10"] = "Incomplete";
                }
            } else {
                evalStatus["AI10"] = "N/A";
            }

            scores.AI11 = resultAI11.length > 0 ? Math.max(...resultAI11.map(item => item.score)) : "N/A";

            if (resultAI11.length > 0) {
                const roScoresAI11 = resultAI11.map(item => item.scoreByRO).filter(score => score !== undefined && score !== null);
                const totalSubmissionsAI11 = resultAI11.length;
                const completedSubmissionsAI11 = roScoresAI11.length;

                if (totalSubmissionsAI11 === 11) {
                    evalStatus["AI11"] = roScoresAI11.length > 0 ? roScoresAI11[0] : "N/A";
                } else if (completedSubmissionsAI11 === totalSubmissionsAI11) {
                    evalStatus["AI11"] = Math.max(...roScoresAI11);
                } else {
                    evalStatus["AI11"] = "Incomplete";
                }
            } else {
                evalStatus["AI11"] = "N/A";
            }

            scores.AI12 = resultAI12.length > 0 ? Math.max(...resultAI12.map(item => item.score)) : "N/A";

            if (resultAI12.length > 0) {
                const roScoresAI12 = resultAI12.map(item => item.scoreByRO).filter(score => score !== undefined && score !== null);
                const totalSubmissionsAI12 = resultAI12.length;
                const completedSubmissionsAI12 = roScoresAI12.length;

                if (totalSubmissionsAI12 === 12) {
                    evalStatus["AI12"] = roScoresAI12.length > 0 ? roScoresAI12[0] : "N/A";
                } else if (completedSubmissionsAI12 === totalSubmissionsAI12) {
                    evalStatus["AI12"] = Math.max(...roScoresAI12);
                } else {
                    evalStatus["AI12"] = "Incomplete";
                }
            } else {
                evalStatus["AI12"] = "N/A";
            }

            scores.AI13 = resultAI13.length > 0 ? Math.max(...resultAI13.map(item => item.score)) : "N/A";

            if (resultAI13.length > 0) {
                const roScoresAI13 = resultAI13.map(item => item.scoreByRO).filter(score => score !== undefined && score !== null);
                const totalSubmissionsAI13 = resultAI13.length;
                const completedSubmissionsAI13 = roScoresAI13.length;

                if (totalSubmissionsAI13 === 13) {
                    evalStatus["AI13"] = roScoresAI13.length > 0 ? roScoresAI13[0] : "N/A";
                } else if (completedSubmissionsAI13 === totalSubmissionsAI13) {
                    evalStatus["AI13"] = Math.max(...roScoresAI13);
                } else {
                    evalStatus["AI13"] = "Incomplete";
                }
            } else {
                evalStatus["AI13"] = "N/A";
            }

            scores.AI14 = resultAI14.length > 0 ? Math.max(...resultAI14.map(item => item.score)) : "N/A";

            if (resultAI14.length > 0) {
                const roScoresAI14 = resultAI14.map(item => item.scoreByRO).filter(score => score !== undefined && score !== null);
                const totalSubmissionsAI14 = resultAI14.length;
                const completedSubmissionsAI14 = roScoresAI14.length;

                if (totalSubmissionsAI14 === 14) {
                    evalStatus["AI14"] = roScoresAI14.length > 0 ? roScoresAI14[0] : "N/A";
                } else if (completedSubmissionsAI14 === totalSubmissionsAI14) {
                    evalStatus["AI14"] = Math.max(...roScoresAI14);
                } else {
                    evalStatus["AI14"] = "Incomplete";
                }
            } else {
                evalStatus["AI14"] = "N/A";
            }

            // Set the state with all the scores
            setScore(prev => ({ ...prev, ...scores }));
            setAIEvaluationStatus(evalStatus);

        } catch (error) {
            console.error("Error fetching scores:", error);
            setScore("Error");
        }
    };

    const fetchSDScore = async () => {
        try {
            // Fetch score for SD1
            const responseSD1 = await fetch(
                `http://localhost:5000/api/sd1form/submissions?teacherName=${teacherName}&teacherDepartment=${teacherDepartment}&formId=SD1`
            );
            if (!responseSD1.ok) throw new Error("Failed to fetch score for SD1");
            const resultSD1 = await responseSD1.json();

            // Fetch score for SD2
            const responseSD2 = await fetch(
                `http://localhost:5000/api/sd2form/submissions?teacherName=${teacherName}&teacherDepartment=${teacherDepartment}&formId=SD2`
            );
            if (!responseSD2.ok) throw new Error("Failed to fetch score for SD2");
            const resultSD2 = await responseSD2.json();

            // Fetch score for SD3
            const responseSD3 = await fetch(
                `http://localhost:5000/api/sd3form/submissions?teacherName=${teacherName}&teacherDepartment=${teacherDepartment}&formId=SD3`
            );
            if (!responseSD3.ok) throw new Error("Failed to fetch score for SD3");
            const resultSD3 = await responseSD3.json();

            // Fetch score for SD4
            const responseSD4 = await fetch(
                `http://localhost:5000/api/sd4form/submissions?teacherName=${teacherName}&teacherDepartment=${teacherDepartment}&formId=SD4`
            );
            if (!responseSD4.ok) throw new Error("Failed to fetch score for SD4");
            const resultSD4 = await responseSD4.json();

            // Fetch score for SD5
            const responseSD5 = await fetch(
                `http://localhost:5000/api/sd5form/submissions?teacherName=${teacherName}&teacherDepartment=${teacherDepartment}&formId=SD5`
            );
            if (!responseSD5.ok) throw new Error("Failed to fetch score for SD5");
            const resultSD5 = await responseSD5.json();



            // Create an object to store all the scores
            let scores = {};
            let evalStatus = {};

            // Map each result to the respective form

            scores.SD1 = resultSD1.length > 0
                ? resultSD1.reduce((sum, item) => sum + item.score, 0) / resultSD1.length
                : "N/A";

            if (resultSD1.length > 0) {
                const roScoresSD1 = resultSD1.map(item => item.scoreByRO).filter(score => score !== undefined && score !== null);
                const totalSubmissionsSD1 = resultSD1.length;
                const completedSubmissionsSD1 = roScoresSD1.length;

                if (totalSubmissionsSD1 === 1) {
                    evalStatus["SD1"] = roScoresSD1.length > 0 ? roScoresSD1[0] : "N/A";
                } else if (completedSubmissionsSD1 === totalSubmissionsSD1) {
                    evalStatus["SD1"] = (roScoresSD1.reduce((sum, s) => sum + s, 0) / completedSubmissionsSD1);
                } else {
                    evalStatus["SD1"] = "Incomplete";
                }
            } else {
                evalStatus["SD1"] = "N/A";
            }
            // Assuming resultSD2 is the array of scores for the form SD2
            scores.SD2 = resultSD2.length > 0
                ? resultSD2.reduce((sum, item) => sum + item.score, 0) / resultSD2.length
                : "N/A";

            if (resultSD2.length > 0) {
                const roScoresSD2 = resultSD2.map(item => item.scoreByRO).filter(score => score !== undefined && score !== null);
                const totalSubmissionsSD2 = resultSD2.length;
                const completedSubmissionsSD2 = roScoresSD2.length;

                if (totalSubmissionsSD2 === 1) {
                    evalStatus["SD2"] = roScoresSD2.length > 0 ? roScoresSD2[0] : "N/A";
                } else if (completedSubmissionsSD2 === totalSubmissionsSD2) {
                    evalStatus["SD2"] = (roScoresSD2.reduce((sum, s) => sum + s, 0) / completedSubmissionsSD2);
                } else {
                    evalStatus["SD2"] = "Incomplete";
                }
            } else {
                evalStatus["SD2"] = "N/A";
            }

            scores.SD3 = resultSD3.length > 0 ? Math.max(...resultSD3.map(item => item.score)) : "N/A";

            if (resultSD3.length > 0) {
                const roScoresSD3 = resultSD3.map(item => item.scoreByRO).filter(score => score !== undefined && score !== null);
                const totalSubmissionsSD3 = resultSD3.length;
                const completedSubmissionsSD3 = roScoresSD3.length;

                if (totalSubmissionsSD3 === 1) {
                    evalStatus["SD3"] = roScoresSD3.length > 0 ? roScoresSD3[0] : "N/A";
                } else if (completedSubmissionsSD3 === totalSubmissionsSD3) {
                    evalStatus["SD3"] = Math.max(...roScoresSD3);
                } else {
                    evalStatus["SD3"] = "Incomplete";
                }
            } else {
                evalStatus["SD3"] = "N/A";
            }

            scores.SD4 = resultSD4.length > 0
                ? resultSD4.reduce((sum, item) => sum + item.score, 0) / resultSD4.length
                : "N/A";

            if (resultSD4.length > 0) {
                const roScoresSD4 = resultSD4.map(item => item.scoreByRO).filter(score => score !== undefined && score !== null);
                const totalSubmissionsSD4 = resultSD4.length;
                const completedSubmissionsSD4 = roScoresSD4.length;

                if (totalSubmissionsSD4 === 1) {
                    evalStatus["SD4"] = roScoresSD4.length > 0 ? roScoresSD4[0] : "N/A";
                } else if (completedSubmissionsSD4 === totalSubmissionsSD4) {
                    evalStatus["SD4"] = (roScoresSD4.reduce((sum, s) => sum + s, 0) / completedSubmissionsSD4);
                } else {
                    evalStatus["SD4"] = "Incomplete";
                }
            } else {
                evalStatus["SD4"] = "N/A";
            }

            scores.SD5 = resultSD5.length > 0 ? Math.max(...resultSD5.map(item => item.score)) : "N/A";

            scores.SD5 = resultSD5.length > 0
                ? resultSD5.reduce((sum, item) => sum + item.score, 0) / resultSD5.length
                : "N/A";

            if (resultSD5.length > 0) {
                const roScoresSD5 = resultSD5.map(item => item.scoreByRO).filter(score => score !== undefined && score !== null);
                const totalSubmissionsSD5 = resultSD5.length;
                const completedSubmissionsSD5 = roScoresSD5.length;

                if (totalSubmissionsSD5 === 1) {
                    evalStatus["SD5"] = roScoresSD5.length > 0 ? roScoresSD5[0] : "N/A";
                } else if (completedSubmissionsSD5 === totalSubmissionsSD5) {
                    evalStatus["SD5"] = Math.max(...roScoresSD5);
                } else {
                    evalStatus["SD5"] = "Incomplete";
                }
            } else {
                evalStatus["SD5"] = "N/A";
            }


            // Set the state with all the scores
            setScore(prev => ({ ...prev, ...scores }));
            setSDEvaluationStatus(evalStatus);

        } catch (error) {
            console.error("Error fetching scores:", error);
            setScore("Error");
        }
    };

    const fetchABScore = async () => {
        try {
            // Fetch score for AB1
            const responseAB1 = await fetch(
                `http://localhost:5000/api/ab1form/submissions?teacherName=${teacherName}&teacherDepartment=${teacherDepartment}&formId=AB1`
            );
            if (!responseAB1.ok) throw new Error("Failed to fetch score for AB1");
            const resultAB1 = await responseAB1.json();

            // Fetch score for AB2
            const responseAB2 = await fetch(
                `http://localhost:5000/api/ab2form/submissions?teacherName=${teacherName}&teacherDepartment=${teacherDepartment}&formId=AB2`
            );
            if (!responseAB2.ok) throw new Error("Failed to fetch score for AB2");
            const resultAB2 = await responseAB2.json();

            // Fetch score for AB3
            const responseAB3 = await fetch(
                `http://localhost:5000/api/ab3form/submissions?teacherName=${teacherName}&teacherDepartment=${teacherDepartment}&formId=AB3`
            );
            if (!responseAB3.ok) throw new Error("Failed to fetch score for AB3");
            const resultAB3 = await responseAB3.json();

            // Fetch score for AB4
            const responseAB4 = await fetch(
                `http://localhost:5000/api/ab4form/submissions?teacherName=${teacherName}&teacherDepartment=${teacherDepartment}&formId=AB4`
            );
            if (!responseAB4.ok) throw new Error("Failed to fetch score for AB4");
            const resultAB4 = await responseAB4.json();

            // Fetch score for AB5
            const responseAB5 = await fetch(
                `http://localhost:5000/api/ab5form/submissions?teacherName=${teacherName}&teacherDepartment=${teacherDepartment}&formId=AB5`
            );
            if (!responseAB5.ok) throw new Error("Failed to fetch score for AB5");
            const resultAB5 = await responseAB5.json();

            // Fetch score for AB6
            const responseAB6 = await fetch(
                `http://localhost:5000/api/ab6form/submissions?teacherName=${teacherName}&teacherDepartment=${teacherDepartment}&formId=AB6`
            );
            if (!responseAB6.ok) throw new Error("Failed to fetch score for AB6");
            const resultAB6 = await responseAB6.json();

            // Fetch score for AB7
            const responseAB7 = await fetch(
                `http://localhost:5000/api/ab7form/submissions?teacherName=${teacherName}&teacherDepartment=${teacherDepartment}&formId=AB7`
            );
            if (!responseAB7.ok) throw new Error("Failed to fetch score for AB7");
            const resultAB7 = await responseAB7.json();

            // Fetch score for AB8
            const responseAB8 = await fetch(
                `http://localhost:5000/api/ab8form/submissions?teacherName=${teacherName}&teacherDepartment=${teacherDepartment}&formId=AB8`
            );
            if (!responseAB8.ok) throw new Error("Failed to fetch score for AB8");
            const resultAB8 = await responseAB8.json();

            // Fetch score for AB9
            const responseAB9 = await fetch(
                `http://localhost:5000/api/ab9form/submissions?teacherName=${teacherName}&teacherDepartment=${teacherDepartment}&formId=AB9`
            );
            if (!responseAB9.ok) throw new Error("Failed to fetch score for AB9");
            const resultAB9 = await responseAB9.json();

            // Fetch score for AB10


            // Create an object to store all the scores
            let scores = {};
            let evalStatus = {};

            // Map each result to the respective form
            // AB1 (sum)
            scores.AB1 = resultAB1.length > 0
                ? resultAB1.reduce((sum, item) => sum + item.score, 0)
                : "N/A";

            if (resultAB1.length > 0) {
                const roScoresAB1 = resultAB1.map(item => item.scoreByRO).filter(score => score !== undefined && score !== null);
                const totalSubmissionsAB1 = resultAB1.length;
                const completedSubmissionsAB1 = roScoresAB1.length;

                if (totalSubmissionsAB1 === 1) {
                    evalStatus["AB1"] = roScoresAB1.length > 0 ? roScoresAB1[0] : "N/A";
                } else if (completedSubmissionsAB1 === 2 && completedSubmissionsAB1 === totalSubmissionsAB1) {
                    evalStatus["AB1"] = roScoresAB1.reduce((sum, s) => sum + s, 0);
                } else {
                    evalStatus["AB1"] = "Incomplete";
                }
            } else {
                evalStatus["AB1"] = "N/A";
            }

            // AB2 (sum)
            scores.AB2 = resultAB2.length > 0
                ? resultAB2.reduce((sum, item) => sum + item.score, 0)
                : "N/A";

            if (resultAB2.length > 0) {
                const roScoresAB2 = resultAB2.map(item => item.scoreByRO).filter(score => score !== undefined && score !== null);
                const totalSubmissionsAB2 = resultAB2.length;
                const completedSubmissionsAB2 = roScoresAB2.length;

                if (totalSubmissionsAB2 === 1) {
                    evalStatus["AB2"] = roScoresAB2.length > 0 ? roScoresAB2[0] : "N/A";
                } else if (completedSubmissionsAB2 === 2 && completedSubmissionsAB2 === totalSubmissionsAB2) {
                    evalStatus["AB2"] = roScoresAB2.reduce((sum, s) => sum + s, 0);
                } else {
                    evalStatus["AB2"] = "Incomplete";
                }
            } else {
                evalStatus["AB2"] = "N/A";
            }

            // AB3 (sum)
            scores.AB3 = resultAB3.length > 0
                ? resultAB3.reduce((sum, item) => sum + item.score, 0)
                : "N/A";

            if (resultAB3.length > 0) {
                const roScoresAB3 = resultAB3.map(item => item.scoreByRO).filter(score => score !== undefined && score !== null);
                const totalSubmissionsAB3 = resultAB3.length;
                const completedSubmissionsAB3 = roScoresAB3.length;

                if (totalSubmissionsAB3 === 1) {
                    evalStatus["AB3"] = roScoresAB3.length > 0 ? roScoresAB3[0] : "N/A";
                } else if (completedSubmissionsAB3 === 2 && completedSubmissionsAB3 === totalSubmissionsAB3) {
                    evalStatus["AB3"] = roScoresAB3.reduce((sum, s) => sum + s, 0);
                } else {
                    evalStatus["AB3"] = "Incomplete";
                }
            } else {
                evalStatus["AB3"] = "N/A";
            }

            // AB4 (sum)
            scores.AB4 = resultAB4.length > 0
                ? resultAB4.reduce((sum, item) => sum + item.score, 0)
                : "N/A";

            if (resultAB4.length > 0) {
                const roScoresAB4 = resultAB4.map(item => item.scoreByRO).filter(score => score !== undefined && score !== null);
                const totalSubmissionsAB4 = resultAB4.length;
                const completedSubmissionsAB4 = roScoresAB4.length;

                if (totalSubmissionsAB4 === 1) {
                    evalStatus["AB4"] = roScoresAB4.length > 0 ? roScoresAB4[0] : "N/A";
                } else if (completedSubmissionsAB4 === 2 && completedSubmissionsAB4 === totalSubmissionsAB4) {
                    evalStatus["AB4"] = roScoresAB4.reduce((sum, s) => sum + s, 0);
                } else {
                    evalStatus["AB4"] = "Incomplete";
                }
            } else {
                evalStatus["AB4"] = "N/A";
            }

            // AB5 (max)
            scores.AB5 = resultAB5.length > 0
                ? Math.max(...resultAB5.map(item => item.score))
                : "N/A";

            if (resultAB5.length > 0) {
                const roScoresAB5 = resultAB5.map(item => item.scoreByRO).filter(score => score !== undefined && score !== null);
                const totalSubmissionsAB5 = resultAB5.length;
                const completedSubmissionsAB5 = roScoresAB5.length;

                if (totalSubmissionsAB5 === 1) {
                    evalStatus["AB5"] = roScoresAB5.length > 0 ? roScoresAB5[0] : "N/A";
                } else if (completedSubmissionsAB5 === totalSubmissionsAB5) {
                    evalStatus["AB5"] = Math.max(...roScoresAB5);
                } else {
                    evalStatus["AB5"] = "Incomplete";
                }
            } else {
                evalStatus["AB5"] = "N/A";
            }

            // AB6 (sum)
            scores.AB6 = resultAB6.length > 0
                ? resultAB6.reduce((sum, item) => sum + item.score, 0)
                : "N/A";

            if (resultAB6.length > 0) {
                const roScoresAB6 = resultAB6.map(item => item.scoreByRO).filter(score => score !== undefined && score !== null);
                const totalSubmissionsAB6 = resultAB6.length;
                const completedSubmissionsAB6 = roScoresAB6.length;

                if (totalSubmissionsAB6 === 1) {
                    evalStatus["AB6"] = roScoresAB6.length > 0 ? roScoresAB6[0] : "N/A";
                } else if (completedSubmissionsAB6 === 2 && completedSubmissionsAB6 === totalSubmissionsAB6) {
                    evalStatus["AB6"] = roScoresAB6.reduce((sum, s) => sum + s, 0);
                } else {
                    evalStatus["AB6"] = "Incomplete";
                }
            } else {
                evalStatus["AB6"] = "N/A";
            }

            // AB7 (max)
            scores.AB7 = resultAB7.length > 0
                ? Math.max(...resultAB7.map(item => item.score))
                : "N/A";

            if (resultAB7.length > 0) {
                const roScoresAB7 = resultAB7.map(item => item.scoreByRO).filter(score => score !== undefined && score !== null);
                const totalSubmissionsAB7 = resultAB7.length;
                const completedSubmissionsAB7 = roScoresAB7.length;

                if (totalSubmissionsAB7 === 1) {
                    evalStatus["AB7"] = roScoresAB7.length > 0 ? roScoresAB7[0] : "N/A";
                } else if (completedSubmissionsAB7 === totalSubmissionsAB7) {
                    evalStatus["AB7"] = Math.max(...roScoresAB7);
                } else {
                    evalStatus["AB7"] = "Incomplete";
                }
            } else {
                evalStatus["AB7"] = "N/A";
            }

            // AB8 (sum)
            scores.AB8 = resultAB8.length > 0
                ? resultAB8.reduce((sum, item) => sum + item.score, 0)
                : "N/A";

            if (resultAB8.length > 0) {
                const roScoresAB8 = resultAB8.map(item => item.scoreByRO).filter(score => score !== undefined && score !== null);
                const totalSubmissionsAB8 = resultAB8.length;
                const completedSubmissionsAB8 = roScoresAB8.length;

                if (totalSubmissionsAB8 === 1) {
                    evalStatus["AB8"] = roScoresAB8.length > 0 ? roScoresAB8[0] : "N/A";
                } else if (completedSubmissionsAB8 === 2 && completedSubmissionsAB8 === totalSubmissionsAB8) {
                    evalStatus["AB8"] = roScoresAB8.reduce((sum, s) => sum + s, 0);
                } else {
                    evalStatus["AB8"] = "Incomplete";
                }
            } else {
                evalStatus["AB8"] = "N/A";
            }

            // AB9 (max)
            scores.AB9 = resultAB9.length > 0
                ? Math.max(...resultAB9.map(item => item.score))
                : "N/A";

            if (resultAB9.length > 0) {
                const roScoresAB9 = resultAB9.map(item => item.scoreByRO).filter(score => score !== undefined && score !== null);
                const totalSubmissionsAB9 = resultAB9.length;
                const completedSubmissionsAB9 = roScoresAB9.length;

                if (totalSubmissionsAB9 === 1) {
                    evalStatus["AB9"] = roScoresAB9.length > 0 ? roScoresAB9[0] : "N/A";
                } else if (completedSubmissionsAB9 === totalSubmissionsAB9) {
                    evalStatus["AB9"] = Math.max(...roScoresAB9);
                } else {
                    evalStatus["AB9"] = "Incomplete";
                }
            } else {
                evalStatus["AB9"] = "N/A";
            }


            // Set the state with all the scores
            setScore(prev => ({ ...prev, ...scores }));
            setABEvaluationStatus(evalStatus);

        } catch (error) {
            console.error("Error fetching scores:", error);
            setScore("Error");
        }
    };

    const fetchRBScore = async () => {
        try {
            // Fetch score for RB1
            const responseRB1 = await fetch(
                `http://localhost:5000/api/rb1form/submissions?teacherName=${teacherName}&teacherDepartment=${teacherDepartment}&formId=RB1`
            );
            if (!responseRB1.ok) throw new Error("Failed to fetch score for RB1");
            const resultRB1 = await responseRB1.json();

            // Fetch score for RB2
            const responseRB2 = await fetch(
                `http://localhost:5000/api/rb2form/submissions?teacherName=${teacherName}&teacherDepartment=${teacherDepartment}&formId=RB2`
            );
            if (!responseRB2.ok) throw new Error("Failed to fetch score for RB2");
            const resultRB2 = await responseRB2.json();

            // Fetch score for RB3
            const responseRB3 = await fetch(
                `http://localhost:5000/api/rb3form/submissions?teacherName=${teacherName}&teacherDepartment=${teacherDepartment}&formId=RB3`
            );
            if (!responseRB3.ok) throw new Error("Failed to fetch score for RB3");
            const resultRB3 = await responseRB3.json();

            // Fetch score for RB4
            const responseRB4 = await fetch(
                `http://localhost:5000/api/rb4form/submissions?teacherName=${teacherName}&teacherDepartment=${teacherDepartment}&formId=RB4`
            );
            if (!responseRB4.ok) throw new Error("Failed to fetch score for RB4");
            const resultRB4 = await responseRB4.json();

            // Fetch score for RB5
            const responseRB5 = await fetch(
                `http://localhost:5000/api/rb5form/submissions?teacherName=${teacherName}&teacherDepartment=${teacherDepartment}&formId=RB5`
            );
            if (!responseRB5.ok) throw new Error("Failed to fetch score for RB5");
            const resultRB5 = await responseRB5.json();

            // Fetch score for RB6
            const responseRB6 = await fetch(
                `http://localhost:5000/api/rb6form/submissions?teacherName=${teacherName}&teacherDepartment=${teacherDepartment}&formId=RB6`
            );
            if (!responseRB6.ok) throw new Error("Failed to fetch score for RB6");
            const resultRB6 = await responseRB6.json();

            // Fetch score for RB7
            const responseRB7 = await fetch(
                `http://localhost:5000/api/rb7form/submissions?teacherName=${teacherName}&teacherDepartment=${teacherDepartment}&formId=RB7`
            );
            if (!responseRB7.ok) throw new Error("Failed to fetch score for RB7");
            const resultRB7 = await responseRB7.json();

            // Fetch score for RB8
            const responseRB8 = await fetch(
                `http://localhost:5000/api/rb8form/submissions?teacherName=${teacherName}&teacherDepartment=${teacherDepartment}&formId=RB8`
            );
            if (!responseRB8.ok) throw new Error("Failed to fetch score for RB8");
            const resultRB8 = await responseRB8.json();

            // Fetch score for RB9
            const responseRB9 = await fetch(
                `http://localhost:5000/api/rb9form/submissions?teacherName=${teacherName}&teacherDepartment=${teacherDepartment}&formId=RB9`
            );
            if (!responseRB9.ok) throw new Error("Failed to fetch score for RB9");
            const resultRB9 = await responseRB9.json();

            // Fetch score for RB10
            const responseRB10 = await fetch(
                `http://localhost:5000/api/rb10form/submissions?teacherName=${teacherName}&teacherDepartment=${teacherDepartment}&formId=RB10`
            );
            if (!responseRB10.ok) throw new Error("Failed to fetch score for RB10");
            const resultRB10 = await responseRB10.json();

            // Fetch score for RB11
            const responseRB11 = await fetch(
                `http://localhost:5000/api/rb11form/submissions?teacherName=${teacherName}&teacherDepartment=${teacherDepartment}&formId=RB11`
            );
            if (!responseRB11.ok) throw new Error("Failed to fetch score for RB11");
            const resultRB11 = await responseRB11.json();

            // Fetch score for RB12
            const responseRB12 = await fetch(
                `http://localhost:5000/api/rb12form/submissions?teacherName=${teacherName}&teacherDepartment=${teacherDepartment}&formId=RB12`
            );
            if (!responseRB12.ok) throw new Error("Failed to fetch score for RB12");
            const resultRB12 = await responseRB12.json();

            // Create an object to store all the scores
            let scores = {};
            let evalStatus = {};

            // Map each result to the respective form
            scores.RB1 = resultRB1.length > 0
                ? resultRB1.reduce((sum, item) => sum + item.score, 0)
                : "N/A";

            if (resultRB1.length > 0) {
                const roScoresRB1 = resultRB1.map(item => item.scoreByRO).filter(score => score !== undefined && score !== null);
                const totalSubmissionsRB1 = resultRB1.length;
                const completedSubmissionsRB1 = roScoresRB1.length;

                if (totalSubmissionsRB1 === 1) {
                    evalStatus["RB1"] = roScoresRB1.length > 0 ? roScoresRB1[0] : "N/A";
                } else if (completedSubmissionsRB1 === totalSubmissionsRB1) {
                    evalStatus["RB1"] = roScoresRB1.reduce((sum, s) => sum + s, 0);
                } else {
                    evalStatus["RB1"] = "Incomplete";
                }
            } else {
                evalStatus["RB1"] = "N/A";
            }

            scores.RB2 = resultRB2.length > 0
                ? resultRB2.reduce((sum, item) => sum + item.score, 0)
                : "N/A";

            if (resultRB2.length > 0) {
                const roScoresRB2 = resultRB2.map(item => item.scoreByRO).filter(score => score !== undefined && score !== null);
                const totalSubmissionsRB2 = resultRB2.length;
                const completedSubmissionsRB2 = roScoresRB2.length;

                if (totalSubmissionsRB2 === 1) {
                    evalStatus["RB2"] = roScoresRB2.length > 0 ? roScoresRB2[0] : "N/A";
                } else if (completedSubmissionsRB2 === totalSubmissionsRB2) {
                    evalStatus["RB2"] = roScoresRB2.reduce((sum, s) => sum + s, 0);
                } else {
                    evalStatus["RB2"] = "Incomplete";
                }
            } else {
                evalStatus["RB2"] = "N/A";
            }

            scores.RB3 = resultRB3.length > 0
                ? resultRB3.reduce((sum, item) => sum + item.score, 0)
                : "N/A";

            if (resultRB3.length > 0) {
                const roScoresRB3 = resultRB3.map(item => item.scoreByRO).filter(score => score !== undefined && score !== null);
                const totalSubmissionsRB3 = resultRB3.length;
                const completedSubmissionsRB3 = roScoresRB3.length;

                if (totalSubmissionsRB3 === 1) {
                    evalStatus["RB3"] = roScoresRB3.length > 0 ? roScoresRB3[0] : "N/A";
                } else if (completedSubmissionsRB3 === totalSubmissionsRB3) {
                    evalStatus["RB3"] = roScoresRB3.reduce((sum, s) => sum + s, 0);
                } else {
                    evalStatus["RB3"] = "Incomplete";
                }
            } else {
                evalStatus["RB3"] = "N/A";
            }

            scores.RB4 = resultRB4.length > 0 ? Math.max(...resultRB4.map(item => item.score)) : "N/A";

            if (resultRB4.length > 0) {
                const roScoresRB4 = resultRB4.map(item => item.scoreByRO).filter(score => score !== undefined && score !== null);
                const totalSubmissionsRB4 = resultRB4.length;
                const completedSubmissionsRB4 = roScoresRB4.length;

                if (totalSubmissionsRB4 === 1) {
                    evalStatus["RB4"] = roScoresRB4.length > 0 ? roScoresRB4[0] : "N/A";
                } else if (completedSubmissionsRB4 === totalSubmissionsRB4) {
                    evalStatus["RB4"] = Math.max(...roScoresRB4);
                } else {
                    evalStatus["RB4"] = "Incomplete";
                }
            } else {
                evalStatus["RB4"] = "N/A";
            }

            scores.RB5 = resultRB5.length > 0 ? Math.max(...resultRB5.map(item => item.score)) : "N/A";

            if (resultRB5.length > 0) {
                const roScoresRB5 = resultRB5.map(item => item.scoreByRO).filter(score => score !== undefined && score !== null);
                const totalSubmissionsRB5 = resultRB5.length;
                const completedSubmissionsRB5 = roScoresRB5.length;

                if (totalSubmissionsRB5 === 1) {
                    evalStatus["RB5"] = roScoresRB5.length > 0 ? roScoresRB5[0] : "N/A";
                } else if (completedSubmissionsRB5 === totalSubmissionsRB5) {
                    evalStatus["RB5"] = Math.max(...roScoresRB5);
                } else {
                    evalStatus["RB5"] = "Incomplete";
                }
            } else {
                evalStatus["RB5"] = "N/A";
            }

            scores.RB6 = resultRB6.length > 0
                ? resultRB6.reduce((sum, item) => sum + item.score, 0)
                : "N/A";

            if (resultRB6.length > 0) {
                const roScoresRB6 = resultRB6.map(item => item.scoreByRO).filter(score => score !== undefined && score !== null);
                const totalSubmissionsRB6 = resultRB6.length;
                const completedSubmissionsRB6 = roScoresRB6.length;

                if (totalSubmissionsRB6 === 1) {
                    evalStatus["RB6"] = roScoresRB6.length > 0 ? roScoresRB6[0] : "N/A";
                } else if (completedSubmissionsRB6 === totalSubmissionsRB6) {
                    evalStatus["RB6"] = roScoresRB6.reduce((sum, s) => sum + s, 0);
                } else {
                    evalStatus["RB6"] = "Incomplete";
                }
            } else {
                evalStatus["RB6"] = "N/A";
            }

            scores.RB7 = resultRB7.length > 0
                ? resultRB7.reduce((sum, item) => sum + item.score, 0)
                : "N/A";

            if (resultRB7.length > 0) {
                const roScoresRB7 = resultRB7.map(item => item.scoreByRO).filter(score => score !== undefined && score !== null);
                const totalSubmissionsRB7 = resultRB7.length;
                const completedSubmissionsRB7 = roScoresRB7.length;

                if (totalSubmissionsRB7 === 1) {
                    evalStatus["RB7"] = roScoresRB7.length > 0 ? roScoresRB7[0] : "N/A";
                } else if (completedSubmissionsRB7 === totalSubmissionsRB7) {
                    evalStatus["RB7"] = roScoresRB7.reduce((sum, s) => sum + s, 0);
                } else {
                    evalStatus["RB7"] = "Incomplete";
                }
            } else {
                evalStatus["RB7"] = "N/A";
            }

            scores.RB8 = resultRB8.length > 0
                ? resultRB8.reduce((sum, item) => sum + item.score, 0)
                : "N/A";

            if (resultRB8.length > 0) {
                const roScoresRB8 = resultRB8.map(item => item.scoreByRO).filter(score => score !== undefined && score !== null);
                const totalSubmissionsRB8 = resultRB8.length;
                const completedSubmissionsRB8 = roScoresRB8.length;

                if (totalSubmissionsRB8 === 1) {
                    evalStatus["RB8"] = roScoresRB8.length > 0 ? roScoresRB8[0] : "N/A";
                } else if (completedSubmissionsRB8 === totalSubmissionsRB8) {
                    evalStatus["RB8"] = roScoresRB8.reduce((sum, s) => sum + s, 0);
                } else {
                    evalStatus["RB8"] = "Incomplete";
                }
            } else {
                evalStatus["RB8"] = "N/A";
            }

            scores.RB9 = resultRB9.length > 0 ? Math.max(...resultRB9.map(item => item.score)) : "N/A";

            if (resultRB9.length > 0) {
                const roScoresRB9 = resultRB9.map(item => item.scoreByRO).filter(score => score !== undefined && score !== null);
                const totalSubmissionsRB9 = resultRB9.length;
                const completedSubmissionsRB9 = roScoresRB9.length;

                if (totalSubmissionsRB9 === 1) {
                    evalStatus["RB9"] = roScoresRB9.length > 0 ? roScoresRB9[0] : "N/A";
                } else if (completedSubmissionsRB9 === totalSubmissionsRB9) {
                    evalStatus["RB9"] = Math.max(...roScoresRB9);
                } else {
                    evalStatus["RB9"] = "Incomplete";
                }
            } else {
                evalStatus["RB9"] = "N/A";
            }

            scores.RB10 = resultRB10.length > 0
                ? resultRB10.reduce((sum, item) => sum + item.score, 0)
                : "N/A";

            if (resultRB10.length > 0) {
                const roScoresRB10 = resultRB10.map(item => item.scoreByRO).filter(score => score !== undefined && score !== null);
                const totalSubmissionsRB10 = resultRB10.length;
                const completedSubmissionsRB10 = roScoresRB10.length;

                if (totalSubmissionsRB10 === 1) {
                    evalStatus["RB10"] = roScoresRB10.length > 0 ? roScoresRB10[0] : "N/A";
                } else if (completedSubmissionsRB10 === totalSubmissionsRB10) {
                    evalStatus["RB10"] = roScoresRB10.reduce((sum, s) => sum + s, 0);
                } else {
                    evalStatus["RB10"] = "Incomplete";
                }
            } else {
                evalStatus["RB10"] = "N/A";
            }

            scores.RB11 = resultRB11.length > 0
                ? resultRB11.reduce((sum, item) => sum + item.score, 0)
                : "N/A";

            if (resultRB11.length > 0) {
                const roScoresRB11 = resultRB11.map(item => item.scoreByRO).filter(score => score !== undefined && score !== null);
                const totalSubmissionsRB11 = resultRB11.length;
                const completedSubmissionsRB11 = roScoresRB11.length;

                if (totalSubmissionsRB11 === 1) {
                    evalStatus["RB11"] = roScoresRB11.length > 0 ? roScoresRB11[0] : "N/A";
                } else if (completedSubmissionsRB11 === totalSubmissionsRB11) {
                    evalStatus["RB11"] = roScoresRB11.reduce((sum, s) => sum + s, 0);
                } else {
                    evalStatus["RB11"] = "Incomplete";
                }
            } else {
                evalStatus["RB11"] = "N/A";
            }

            scores.RB12 = resultRB12.length > 0 ? Math.max(...resultRB12.map(item => item.score)) : "N/A";

            if (resultRB12.length > 0) {
                const roScoresRB12 = resultRB12.map(item => item.scoreByRO).filter(score => score !== undefined && score !== null);
                const totalSubmissionsRB12 = resultRB12.length;
                const completedSubmissionsRB12 = roScoresRB12.length;

                if (totalSubmissionsRB12 === 1) {
                    evalStatus["RB12"] = roScoresRB12.length > 0 ? roScoresRB12[0] : "N/A";
                } else if (completedSubmissionsRB12 === totalSubmissionsRB12) {
                    evalStatus["RB12"] = Math.max(...roScoresRB12);
                } else {
                    evalStatus["RB12"] = "Incomplete";
                }
            } else {
                evalStatus["RB12"] = "N/A";
            }


            // Set the state with all the scores
            setScore(prev => ({ ...prev, ...scores }));
            setRBEvaluationStatus(evalStatus);

        } catch (error) {
            console.error("Error fetching scores:", error);
            setScore("Error");
        }
    };

    const fetchCBScore = async () => {
        try {
            // Fetch score for CB1
            const responseCB1 = await fetch(
                `http://localhost:5000/api/cb1form/submissions?teacherName=${teacherName}&teacherDepartment=${teacherDepartment}&formId=CB1`
            );
            if (!responseCB1.ok) throw new Error("Failed to fetch score for CB1");
            const resultCB1 = await responseCB1.json();

            // Fetch score for CB2
            const responseCB2 = await fetch(
                `http://localhost:5000/api/cb2form/submissions?teacherName=${teacherName}&teacherDepartment=${teacherDepartment}&formId=CB2`
            );
            if (!responseCB2.ok) throw new Error("Failed to fetch score for CB2");
            const resultCB2 = await responseCB2.json();

            // Fetch score for CB3
            const responseCB3 = await fetch(
                `http://localhost:5000/api/cb3form/submissions?teacherName=${teacherName}&teacherDepartment=${teacherDepartment}&formId=CB3`
            );
            if (!responseCB3.ok) throw new Error("Failed to fetch score for CB3");
            const resultCB3 = await responseCB3.json();

            // Create an object to store all the scores
            let scores = {};
            let evalStatus = {};

            // Map each result to the respective form
            // CB1 - sum
            scores.CB1 = resultCB1.length > 0
                ? resultCB1.reduce((sum, item) => sum + item.score, 0)
                : "N/A";

            if (resultCB1.length > 0) {
                const roScoresCB1 = resultCB1.map(item => item.scoreByRO).filter(score => score !== undefined && score !== null);
                const totalSubmissionsCB1 = resultCB1.length;
                const completedSubmissionsCB1 = roScoresCB1.length;

                if (totalSubmissionsCB1 === 1) {
                    evalStatus["CB1"] = roScoresCB1.length > 0 ? roScoresCB1[0] : "N/A";
                } else if (completedSubmissionsCB1 === totalSubmissionsCB1) {
                    evalStatus["CB1"] = roScoresCB1.reduce((sum, s) => sum + s, 0);
                } else {
                    evalStatus["CB1"] = "Incomplete";
                }
            } else {
                evalStatus["CB1"] = "N/A";
            }

            // CB2 - max
            scores.CB2 = resultCB2.length > 0
                ? Math.max(...resultCB2.map(item => item.score))
                : "N/A";

            if (resultCB2.length > 0) {
                const roScoresCB2 = resultCB2.map(item => item.scoreByRO).filter(score => score !== undefined && score !== null);
                const totalSubmissionsCB2 = resultCB2.length;
                const completedSubmissionsCB2 = roScoresCB2.length;

                if (totalSubmissionsCB2 === 1) {
                    evalStatus["CB2"] = roScoresCB2.length > 0 ? roScoresCB2[0] : "N/A";
                } else if (completedSubmissionsCB2 === totalSubmissionsCB2) {
                    evalStatus["CB2"] = Math.max(...roScoresCB2);
                } else {
                    evalStatus["CB2"] = "Incomplete";
                }
            } else {
                evalStatus["CB2"] = "N/A";
            }

            // CB3 - max
            scores.CB3 = resultCB3.length > 0
                ? Math.max(...resultCB3.map(item => item.score))
                : "N/A";

            if (resultCB3.length > 0) {
                const roScoresCB3 = resultCB3.map(item => item.scoreByRO).filter(score => score !== undefined && score !== null);
                const totalSubmissionsCB3 = resultCB3.length;
                const completedSubmissionsCB3 = roScoresCB3.length;

                if (totalSubmissionsCB3 === 1) {
                    evalStatus["CB3"] = roScoresCB3.length > 0 ? roScoresCB3[0] : "N/A";
                } else if (completedSubmissionsCB3 === totalSubmissionsCB3) {
                    evalStatus["CB3"] = Math.max(...roScoresCB3);
                } else {
                    evalStatus["CB3"] = "Incomplete";
                }
            } else {
                evalStatus["CB3"] = "N/A";
            }


            // Set the state with all the scores
            setScore(prev => ({ ...prev, ...scores }));
            setCBEvaluationStatus(evalStatus);

        } catch (error) {
            console.error("Error fetching scores:", error);
            setScore("Error");
        }
    };

    const fetchPDBScore = async () => {
        try {
            // Fetch score for PDB1
            const responsePDB1 = await fetch(
                `http://localhost:5000/api/pdb1form/submissions?teacherName=${teacherName}&teacherDepartment=${teacherDepartment}&formId=PDB1`
            );
            if (!responsePDB1.ok) throw new Error("Failed to fetch score for PDB1");
            const resultPDB1 = await responsePDB1.json();

            // Fetch score for PDB2
            const responsePDB2 = await fetch(
                `http://localhost:5000/api/pdb2form/submissions?teacherName=${teacherName}&teacherDepartment=${teacherDepartment}&formId=PDB2`
            );
            if (!responsePDB2.ok) throw new Error("Failed to fetch score for PDB2");
            const resultPDB2 = await responsePDB2.json();

            // Create an object to store all the scores
            let scores = {};
            let evalStatus = {};

            // Map each result to the respective form
            // PDB1 - max
            scores.PDB1 = resultPDB1.length > 0
                ? Math.max(...resultPDB1.map(item => item.score))
                : "N/A";

            if (resultPDB1.length > 0) {
                const roScoresPDB1 = resultPDB1.map(item => item.scoreByRO).filter(score => score !== undefined && score !== null);
                const totalSubmissionsPDB1 = resultPDB1.length;
                const completedSubmissionsPDB1 = roScoresPDB1.length;

                if (totalSubmissionsPDB1 === 1) {
                    evalStatus["PDB1"] = roScoresPDB1.length > 0 ? roScoresPDB1[0] : "N/A";
                } else if (completedSubmissionsPDB1 === totalSubmissionsPDB1) {
                    evalStatus["PDB1"] = Math.max(...roScoresPDB1);
                } else {
                    evalStatus["PDB1"] = "Incomplete";
                }
            } else {
                evalStatus["PDB1"] = "N/A";
            }

            // PDB2 - max
            scores.PDB2 = resultPDB2.length > 0
                ? Math.max(...resultPDB2.map(item => item.score))
                : "N/A";

            if (resultPDB2.length > 0) {
                const roScoresPDB2 = resultPDB2.map(item => item.scoreByRO).filter(score => score !== undefined && score !== null);
                const totalSubmissionsPDB2 = resultPDB2.length;
                const completedSubmissionsPDB2 = roScoresPDB2.length;

                if (totalSubmissionsPDB2 === 1) {
                    evalStatus["PDB2"] = roScoresPDB2.length > 0 ? roScoresPDB2[0] : "N/A";
                } else if (completedSubmissionsPDB2 === totalSubmissionsPDB2) {
                    evalStatus["PDB2"] = Math.max(...roScoresPDB2);
                } else {
                    evalStatus["PDB2"] = "Incomplete";
                }
            } else {
                evalStatus["PDB2"] = "N/A";
            }


            // Set the state with all the scores
            setScore(prev => ({ ...prev, ...scores }));
            setPDBEvaluationStatus(evalStatus);

        } catch (error) {
            console.error("Error fetching scores:", error);
            setScore("Error");
        }
    };


    useEffect(() => {
        if (
            location.state?.teacherName &&
            location.state?.teacherDepartment &&
            location.state?.employeeCode &&
            location.state?.designation &&
            typeof location.state?.isReviewClickable === "boolean"
        ) {
            console.log("Clicked Teacher Information:", {
                teacherName: location.state.teacherName,
                teacherDepartment: location.state.teacherDepartment,
                employeeCode: location.state.employeeCode,
                designation: location.state.designation,
                isReviewClickable: location.state.isReviewClickable,
            });

            localStorage.setItem("teacherName", location.state.teacherName);
            localStorage.setItem("teacherDepartment", location.state.teacherDepartment);
            localStorage.setItem("employeeCode", location.state.employeeCode);
            localStorage.setItem("designation", location.state.designation);
            localStorage.setItem("isReviewClickable", location.state.isReviewClickable.toString()); // save as string

            setTeacherName(location.state.teacherName);
            setTeacherDepartment(location.state.teacherDepartment);
            setEmployeeCode(location.state.employeeCode);
            setDesignation(location.state.designation);
            setIsReviewClickable(location.state.isReviewClickable);
        }
    }, [location.state]);


    const toggleBucket = (bucketName) => {
        setExpandedBucket(expandedBucket === bucketName ? null : bucketName);
    };

    return (
        <div>
            <RONavbar
                user={propUser}
                onLogout={onLogout}
                teacher={{
                    name: teacherName,
                    department: teacherDepartment,
                    employeeCode
                }}
            />

            {isSubmitting && (
                <div className="spinner-overlay">
                    <div className="spinner"></div>
                </div>
            )}

            <div className="teacher-review-message">
                <h3>You are reviewing this for {teacherName}</h3>
            </div>
            <div className="hombucket-container">
                <div className="hombucket1" onClick={() => toggleBucket("academic")}>

                    <div className="progress-overlay1" style={{ width: `${AIProgress}%` }}></div>

                    <span className="bucket-text">Academic Involvement</span>

                    <span className={`arrow ${expandedBucket === "academic" ? "open" : ""}`}>▼</span>
                </div>

                {expandedBucket === "academic" && (
                    <div className="ai-table-container">
                        <table className="ai-table">
                            <thead>
                                <tr>
                                    <th style={{ backgroundColor: "#537c78" }}>Category No.</th>
                                    <th style={{ backgroundColor: "#537c78" }}>Performance Parameter</th>
                                    <th style={{ backgroundColor: "#537c78" }}>Marks</th>
                                    <th style={{ backgroundColor: "#537c78" }}>Maximum Marks with bonus</th>
                                    <th style={{ backgroundColor: "#537c78" }}>Self Score</th>
                                    {/* <th style={{ backgroundColor: "#537c78" }}>Submission Status</th> */}
                                    <th style={{ backgroundColor: "#537c78" }}>Score after Review</th>
                                    <th style={{ backgroundColor: "#537c78" }}>Link for sheet</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className={AIEvaluationStatus["AI1"] === "Incomplete" || AIEvaluationStatus["AI1"] === "N/A" ? "error-row" : "fineby"}>

                                    <td>AI-1</td>
                                    <td>Certification for Courses Allotted</td>
                                    <td>100</td>
                                    <td>150</td>
                                    <td>{score?.AI1 || "N/A"}</td>
                                    {/* <td>{submissionStatuses["AI1"] ? "✅" : "❌"}</td> */}
                                    <td>{AIEvaluationStatus["AI1"] !== "Incomplete" && AIEvaluationStatus["AI1"] !== "N/A" ? AIEvaluationStatus["AI1"] : "❌"}</td>
                                    <td>
                                        <button className="navigate-button" onClick={() => navigate('/ROAI1')}>
                                            AI-1
                                        </button>
                                    </td>
                                </tr>
                                <tr className={AIEvaluationStatus["AI2"] === "Incomplete" || AIEvaluationStatus["AI2"] === "N/A" ? "error-row" : "fineby"}>

                                    <td>AI-2</td>
                                    <td>Syllabus completion of Courses taught</td>
                                    <td>300</td>
                                    <td>300</td>
                                    <td>{score?.AI2 || "N/A"}</td>
                                    {/* <td>{submissionStatuses["AI2"] ? "✅" : "❌"}</td> */}
                                    <td>{AIEvaluationStatus["AI2"] !== "Incomplete" && AIEvaluationStatus["AI2"] !== "N/A" ? AIEvaluationStatus["AI2"] : "❌"}</td>
                                    <td>
                                        <button className="navigate-button" onClick={() => navigate('/ROAI2')}>
                                            AI-2
                                        </button>
                                    </td>
                                </tr>
                                <tr className={AIEvaluationStatus["AI31"] === "Incomplete" || AIEvaluationStatus["AI31"] === "N/A" ? "error-row" : "fineby"}>

                                    <td>AI-3.1</td>
                                    <td>BSA - Guest Lecture</td>
                                    <td>75</td>
                                    <td>113</td>
                                    <td>{score?.AI31 || "N/A"}</td>
                                    {/* <td>{submissionStatuses["AI31"] ? "✅" : "❌"}</td> */}
                                    <td>{AIEvaluationStatus["AI31"] !== "Incomplete" && AIEvaluationStatus["AI31"] !== "N/A" ? AIEvaluationStatus["AI31"] : "❌"}</td>
                                    <td>
                                        <button className="navigate-button" onClick={() => navigate('/ROAI31')}>
                                            AI-3.1
                                        </button>
                                    </td>
                                </tr>
                                <tr className={AIEvaluationStatus["AI32"] === "Incomplete" || AIEvaluationStatus["AI32"] === "N/A" ? "error-row" : "fineby"}>

                                    <td>AI-3.2</td>
                                    <td>BSA - Industrial Visit</td>
                                    <td>75</td>
                                    <td>278</td>
                                    <td>{score?.AI32 || "N/A"}</td>
                                    {/* <td>{submissionStatuses["AI32"] ? "✅" : "❌"}</td> */}
                                    <td>{AIEvaluationStatus["AI32"] !== "Incomplete" && AIEvaluationStatus["AI32"] !== "N/A" ? AIEvaluationStatus["AI32"] : "❌"}</td>
                                    <td>
                                        <button className="navigate-button" onClick={() => navigate('/ROAI32')}>
                                            AI-3.2
                                        </button>
                                    </td>
                                </tr>
                                <tr className={AIEvaluationStatus["AI33"] === "Incomplete" || AIEvaluationStatus["AI33"] === "N/A" ? "error-row" : "fineby"}>

                                    <td>AI-3.3</td>
                                    <td>BSA - Co-curricular</td>
                                    <td>75</td>
                                    <td>338</td>
                                    <td>{score?.AI33 || "N/A"}</td>
                                    {/* <td>{submissionStatuses["AI33"] ? "✅" : "❌"}</td> */}
                                    <td>{AIEvaluationStatus["AI33"] !== "Incomplete" && AIEvaluationStatus["AI33"] !== "N/A" ? AIEvaluationStatus["AI33"] : "❌"}</td>
                                    <td>
                                        <button className="navigate-button" onClick={() => navigate('/ROAI33')}>
                                            AI-3.3
                                        </button>
                                    </td>
                                </tr>
                                <tr className={AIEvaluationStatus["AI34"] === "Incomplete" || AIEvaluationStatus["AI34"] === "N/A" ? "error-row" : "fineby"}>

                                    <td>AI-3.4</td>
                                    <td>BSA - Mini Project (within a Course)</td>
                                    <td>75</td>
                                    <td>254</td>
                                    <td>{score?.AI34 || "N/A"}</td>
                                    {/* <td>{submissionStatuses["AI34"] ? "✅" : "❌"}</td> */}
                                    <td>{AIEvaluationStatus["AI34"] !== "Incomplete" && AIEvaluationStatus["AI34"] !== "N/A" ? AIEvaluationStatus["AI34"] : "❌"}</td>
                                    <td>
                                        <button className="navigate-button" onClick={() => navigate('/ROAI34')}>
                                            AI-3.4
                                        </button>
                                    </td>
                                </tr>
                                <tr className={AIEvaluationStatus["AI4"] === "Incomplete" || AIEvaluationStatus["AI4"] === "N/A" ? "error-row" : "fineby"}>

                                    <td>AI-4 Eng</td>
                                    <td>Lab Work / Case Studies</td>
                                    <td>100</td>
                                    <td>188</td>
                                    <td>{score?.AI4 || "N/A"}</td>
                                    {/* <td>{submissionStatuses["AI4"] ? "✅" : "❌"}</td> */}
                                    <td>{AIEvaluationStatus["AI4"] !== "Incomplete" && AIEvaluationStatus["AI4"] !== "N/A" ? AIEvaluationStatus["AI4"] : "❌"}</td>
                                    <td>
                                        <button className="navigate-button" onClick={() => navigate('/ROAI4')}>
                                            AI-4
                                        </button>
                                    </td>
                                </tr>
                                <tr className={AIEvaluationStatus["AI5"] === "Incomplete" || AIEvaluationStatus["AI5"] === "N/A" ? "error-row" : "fineby"}>

                                    <td>AI-5</td>
                                    <td>Course/ Lab CO/LO-Attainment</td>
                                    <td>200</td>
                                    <td>200</td>
                                    <td>{score?.AI5 || "N/A"}</td>
                                    {/* <td>{submissionStatuses["AI5"] ? "✅" : "❌"}</td> */}
                                    <td>{AIEvaluationStatus["AI5"] !== "Incomplete" && AIEvaluationStatus["AI5"] !== "N/A" ? AIEvaluationStatus["AI5"] : "❌"}</td>
                                    <td>
                                        <button className="navigate-button" onClick={() => navigate('/ROAI5')}>
                                            AI-5
                                        </button>
                                    </td>
                                </tr>
                                <tr className={AIEvaluationStatus["AI6"] === "Incomplete" || AIEvaluationStatus["AI6"] === "N/A" ? "error-row" : "fineby"}>
                                    <td>AI-6</td>
                                    <td>Innovations in TLP</td>
                                    <td>150</td>
                                    <td>225</td>
                                    <td>{score?.AI6 || "N/A"}</td>
                                    {/* <td>{submissionStatuses["AI6"] ? "✅" : "❌"}</td> */}
                                    <td>{AIEvaluationStatus["AI6"] !== "Incomplete" && AIEvaluationStatus["AI6"] !== "N/A" ? AIEvaluationStatus["AI6"] : "❌"}</td>
                                    <td>
                                        <button className="navigate-button" onClick={() => navigate('/ROAI6')}>
                                            AI-6
                                        </button>
                                    </td>
                                </tr>

                                <tr className={AIEvaluationStatus["AI7"] === "Incomplete" || AIEvaluationStatus["AI7"] === "N/A" ? "error-row" : "fineby"}>

                                    <td>AI-7</td>
                                    <td>Contribution for Learning Resources Development</td>
                                    <td>100</td>
                                    <td>100</td>
                                    <td>{score?.AI7 || "N/A"}</td>
                                    {/* <td>{submissionStatuses["AI7"] ? "✅" : "❌"}</td> */}
                                    <td>{AIEvaluationStatus["AI7"] !== "Incomplete" && AIEvaluationStatus["AI7"] !== "N/A" ? AIEvaluationStatus["AI7"] : "❌"}</td>
                                    <td>
                                        <button className="navigate-button" onClick={() => navigate('/ROAI7')}>
                                            AI-7
                                        </button>
                                    </td>
                                </tr>
                                <tr className={AIEvaluationStatus["AI8"] === "Incomplete" || AIEvaluationStatus["AI8"] === "N/A" ? "error-row" : "fineby"}>

                                    <td>AI-8</td>
                                    <td>Mini Project (Subject head)</td>
                                    <td>50</td>
                                    <td>295</td>
                                    <td>{score?.AI8 || "N/A"}</td>
                                    {/* <td>{submissionStatuses["AI8"] ? "✅" : "❌"}</td> */}
                                    <td>{AIEvaluationStatus["AI8"] !== "Incomplete" && AIEvaluationStatus["AI8"] !== "N/A" ? AIEvaluationStatus["AI8"] : "❌"}</td>
                                    <td>
                                        <button className="navigate-button" onClick={() => navigate('/ROAI8')}>
                                            AI-8
                                        </button>
                                    </td>
                                </tr>
                                <tr className={AIEvaluationStatus["AI9"] === "Incomplete" || AIEvaluationStatus["AI9"] === "N/A" ? "error-row" : "fineby"}>

                                    <td>AI-9 Eng</td>
                                    <td>B.E. Projects Guided</td>
                                    <td>100</td>
                                    <td>1323</td>
                                    <td>{score?.AI9 || "N/A"}</td>
                                    {/* <td>{submissionStatuses["AI9"] ? "✅" : "❌"}</td> */}
                                    <td>{AIEvaluationStatus["AI9"] !== "Incomplete" && AIEvaluationStatus["AI9"] !== "N/A" ? AIEvaluationStatus["AI9"] : "❌"}</td>
                                    <td>
                                        <button className="navigate-button" onClick={() => navigate('/ROAI9')}>
                                            AI-9
                                        </button>
                                    </td>
                                </tr>
                                <tr className={AIEvaluationStatus["AI10"] === "Incomplete" || AIEvaluationStatus["AI10"] === "N/A" ? "error-row" : "fineby"}>

                                    <td>AI-10 Eng</td>
                                    <td>M.E. Projects Guided</td>
                                    <td>100</td>
                                    <td>1323</td>
                                    <td>{score?.AI10 || "N/A"}</td>
                                    {/* <td>{submissionStatuses["AI10"] ? "✅" : "❌"}</td> */}
                                    <td>{AIEvaluationStatus["AI10"] !== "Incomplete" && AIEvaluationStatus["AI10"] !== "N/A" ? AIEvaluationStatus["AI10"] : "❌"}</td>
                                    <td>
                                        <button className="navigate-button" onClick={() => navigate('/ROAI10')}>
                                            AI-10
                                        </button>
                                    </td>
                                </tr>
                                <tr className={AIEvaluationStatus["AI11"] === "Incomplete" || AIEvaluationStatus["AI11"] === "N/A" ? "error-row" : "fineby"}>

                                    <td>AI-11</td>
                                    <td>Ph.D. Students Guided</td>
                                    <td>150</td>
                                    <td>1654</td>
                                    <td>{score?.AI11 || "N/A"}</td>
                                    {/* <td>{submissionStatuses["AI11"] ? "✅" : "❌"}</td> */}
                                    <td>{AIEvaluationStatus["AI11"] !== "Incomplete" && AIEvaluationStatus["AI11"] !== "N/A" ? AIEvaluationStatus["AI11"] : "❌"}</td>
                                    <td>
                                        <button className="navigate-button" onClick={() => navigate('/ROAI11')}>
                                            AI-11
                                        </button>
                                    </td>
                                </tr>
                                <tr className={AIEvaluationStatus["AI12"] === "Incomplete" || AIEvaluationStatus["AI12"] === "N/A" ? "error-row" : "fineby"}>

                                    <td>AI-12</td>
                                    <td>Exam Related Work</td>
                                    <td>100</td>
                                    <td>100</td>
                                    <td>{score?.AI12 || "N/A"}</td>
                                    {/* <td>{submissionStatuses["AI12"] ? "✅" : "❌"}</td> */}
                                    <td>{AIEvaluationStatus["AI12"] !== "Incomplete" && AIEvaluationStatus["AI12"] !== "N/A" ? AIEvaluationStatus["AI12"] : "❌"}</td>
                                    <td>
                                        <button className="navigate-button" onClick={() => navigate('/ROAI12')}>
                                            AI-12
                                        </button>
                                    </td>
                                </tr>
                                <tr className={AIEvaluationStatus["AI13"] === "Incomplete" || AIEvaluationStatus["AI13"] === "N/A" ? "error-row" : "fineby"}>

                                    <td>AI-13</td>
                                    <td>Preview Grades (Preceding Semester)</td>
                                    <td>100</td>
                                    <td>100</td>
                                    <td>{score?.AI13 || "N/A"}</td>
                                    {/* <td>{submissionStatuses["AI13"] ? "✅" : "❌"}</td> */}
                                    <td>{AIEvaluationStatus["AI13"] !== "Incomplete" && AIEvaluationStatus["AI13"] !== "N/A" ? AIEvaluationStatus["AI13"] : "❌"}</td>
                                    <td>
                                        <button className="navigate-button" onClick={() => navigate('/ROAI13')}>
                                            AI-13
                                        </button>
                                    </td>                                </tr>
                                <tr className={AIEvaluationStatus["AI14"] === "Incomplete" || AIEvaluationStatus["AI14"] === "N/A" ? "error-row" : "fineby"}>

                                    <td>AI-14</td>
                                    <td>Review Grades (Preceding Semester)</td>
                                    <td>150</td>
                                    <td>150</td>
                                    <td>{score?.AI14 || "N/A"}</td>
                                    {/* <td>{submissionStatuses["AI14"] ? "✅" : "❌"}</td> */}
                                    <td>{AIEvaluationStatus["AI14"] !== "Incomplete" && AIEvaluationStatus["AI14"] !== "N/A" ? AIEvaluationStatus["AI14"] : "❌"}</td>
                                    <td>
                                        <button className="navigate-button" onClick={() => navigate('/ROAI14')}>
                                            AI-14
                                        </button>
                                    </td>
                                </tr>

                                <tr className="total-row">
                                    <td colSpan="2" style={{ fontWeight: "bold", backgroundColor: "#4966b6", color: "white" }}>TOTAL</td>
                                    <td style={{ fontWeight: "bold", backgroundColor: "#4966b6", color: "white" }}>{totalAIMarks}</td>
                                    <td style={{ fontWeight: "bold", backgroundColor: "#4966b6", color: "white" }}>{totalMaxAIMarks}</td>
                                    <td style={{ fontWeight: "bold", backgroundColor: "#4966b6", color: "white" }}>{totalAISelfScore}</td>
                                    <td style={{ fontWeight: "bold", backgroundColor: "#4966b6", color: "white" }}>{totalAIReviewedScore}</td>
                                    <td style={{ backgroundColor: "#4966b6" }}></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Student Development */}
                <div className="hombucket2" onClick={() => toggleBucket("studentDevelopment")}>
                    <div className="sdprogress-overlay" style={{ width: `${SDProgress}%` }}></div>

                    <span className="bucket-text">Student development</span>
                    <span className={`arrow ${expandedBucket === "studentDevelopment" ? "open" : ""}`}>▼</span>
                </div>



                {expandedBucket === "studentDevelopment" && (
                    <div className="ai-table-container">
                        <table className="ai-table">
                            <thead>
                                <tr>
                                    <th style={{ backgroundColor: "#537c78" }}>Category No.</th>
                                    <th style={{ backgroundColor: "#537c78" }}>Performance Parameter</th>
                                    <th style={{ backgroundColor: "#537c78" }}>Marks</th>
                                    <th style={{ backgroundColor: "#537c78" }}>Maximum Marks with bonus</th>
                                    <th style={{ backgroundColor: "#537c78" }}>Self Score</th>
                                    {/* <th style={{ backgroundColor: "#537c78" }}>Submission Status</th> */}
                                    <th style={{ backgroundColor: "#537c78" }}>Score after Review</th>
                                    <th style={{ backgroundColor: "#537c78" }}>Link for sheet</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className={SDEvaluationStatus["SD1"] === "Incomplete" || SDEvaluationStatus["SD1"] === "N/A" ? "error-row" : "fineby"}>

                                    <td>SD-1</td>
                                    <td>Certification for Courses Allotted</td>
                                    <td>100</td>
                                    <td>150</td>
                                    <td>{score?.SD1 || "N/A"}</td>
                                    {/* <td>{submissionStatuses["SD1"] ? "✅" : "❌"}</td> */}
                                    <td>{SDEvaluationStatus["SD1"] !== "Incomplete" && SDEvaluationStatus["SD1"] !== "N/A" ? SDEvaluationStatus["SD1"] : "❌"}</td>
                                    <td>
                                        <button className="navigate-button" onClick={() => navigate('/ROSD1')}>
                                            SD-1
                                        </button>
                                    </td>
                                </tr>
                                <tr className={SDEvaluationStatus["SD2"] === "Incomplete" || SDEvaluationStatus["SD2"] === "N/A" ? "error-row" : "fineby"}>

                                    <td>SD-2</td>
                                    <td>Syllabus completion of Courses taught</td>
                                    <td>300</td>
                                    <td>300</td>
                                    <td>{score?.SD2 || "N/A"}</td>
                                    {/* <td>{submissionStatuses["SD2"] ? "✅" : "❌"}</td> */}
                                    <td>{SDEvaluationStatus["SD2"] !== "Incomplete" && SDEvaluationStatus["SD2"] !== "N/A" ? SDEvaluationStatus["SD2"] : "❌"}</td>
                                    <td>
                                        <button className="navigate-button" onClick={() => navigate('/ROSD2')}>
                                            SD-2
                                        </button>
                                    </td>
                                </tr>
                                <tr className={SDEvaluationStatus["SD3"] === "Incomplete" || SDEvaluationStatus["SD3"] === "N/A" ? "error-row" : "fineby"}>

                                    <td>SD-3</td>
                                    <td>BSA - Guest Lecture</td>
                                    <td>75</td>
                                    <td>113</td>
                                    <td>{score?.SD3 || "N/A"}</td>
                                    {/* <td>{submissionStatuses["SD3"] ? "✅" : "❌"}</td> */}
                                    <td>{SDEvaluationStatus["SD3"] !== "Incomplete" && SDEvaluationStatus["SD3"] !== "N/A" ? SDEvaluationStatus["SD3"] : "❌"}</td>
                                    <td>
                                        <button className="navigate-button" onClick={() => navigate('/ROSD3')}>
                                            SD-3
                                        </button>
                                    </td>
                                </tr>

                                <tr className={SDEvaluationStatus["SD4"] === "Incomplete" || SDEvaluationStatus["SD4"] === "N/A" ? "error-row" : "fineby"}>

                                    <td>SD-4 Eng</td>
                                    <td>Lab Work / Case Studies</td>
                                    <td>100</td>
                                    <td>188</td>
                                    <td>{score?.SD4 || "N/A"}</td>
                                    {/* <td>{submissionStatuses["SD4"] ? "✅" : "❌"}</td> */}
                                    <td>{SDEvaluationStatus["SD4"] !== "Incomplete" && SDEvaluationStatus["SD4"] !== "N/A" ? SDEvaluationStatus["SD4"] : "❌"}</td>
                                    <td>
                                        <button className="navigate-button" onClick={() => navigate('/ROSD4')}>
                                            SD-4
                                        </button>
                                    </td>
                                </tr>
                                <tr className={SDEvaluationStatus["SD5"] === "Incomplete" || SDEvaluationStatus["SD5"] === "N/A" ? "error-row" : "fineby"}>

                                    <td>SD-5</td>
                                    <td>Course/ Lab CO/LO-Attainment</td>
                                    <td>200</td>
                                    <td>200</td>
                                    <td>{score?.SD5 || "N/A"}</td>
                                    {/* <td>{submissionStatuses["SD5"] ? "✅" : "❌"}</td> */}
                                    <td>{SDEvaluationStatus["SD5"] !== "Incomplete" && SDEvaluationStatus["SD5"] !== "N/A" ? SDEvaluationStatus["SD5"] : "❌"}</td>
                                    <td>
                                        <button className="navigate-button" onClick={() => navigate('/ROSD5')}>
                                            SD-5
                                        </button>
                                    </td>
                                </tr>

                                <tr className="total-row">
                                    <td colSpan="2" style={{ fontWeight: "bold", backgroundColor: "#4966b6", color: "white" }}>TOTAL</td>
                                    <td style={{ fontWeight: "bold", backgroundColor: "#4966b6", color: "white" }}>{totalSDMarks}</td>
                                    <td style={{ fontWeight: "bold", backgroundColor: "#4966b6", color: "white" }}>{totalMaxSDMarks}</td>
                                    <td style={{ fontWeight: "bold", backgroundColor: "#4966b6", color: "white" }}>{totalSDSelfScore}</td>
                                    <td style={{ fontWeight: "bold", backgroundColor: "#4966b6", color: "white" }}>{totalSDReviewedScore}</td>
                                    <td style={{ backgroundColor: "#4966b6" }}></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Administrative Bucket */}
                <div className="hombucket3" onClick={() => toggleBucket("admin")}>

                    <div className="abprogress-overlay" style={{ width: `${ABProgress}%` }}></div>

                    <span className="bucket-text"> Administrative Bucket</span>

                    <span className={`arrow ${expandedBucket === "admin" ? "open" : ""}`}>▼</span>
                </div>

                {expandedBucket === "admin" && (
                    <div className="ai-table-container">
                        <table className="ai-table">
                            <thead>
                                <tr>
                                    <th style={{ backgroundColor: "#537c78" }}>Category No.</th>
                                    <th style={{ backgroundColor: "#537c78" }}>Performance Parameter</th>
                                    <th style={{ backgroundColor: "#537c78" }}>Marks</th>
                                    <th style={{ backgroundColor: "#537c78" }}>Maximum Marks with bonus</th>
                                    <th style={{ backgroundColor: "#537c78" }}>Self Score</th>
                                    {/* <th style={{ backgroundColor: "#537c78" }}>Submission Status</th> */}
                                    <th style={{ backgroundColor: "#537c78" }}>Score after Review</th>
                                    <th style={{ backgroundColor: "#537c78" }}>Link for sheet</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className={ABEvaluationStatus["AB1"] === "Incomplete" || ABEvaluationStatus["AB1"] === "N/A" ? "error-row" : "fineby"}>

                                    <td>AB-1</td>
                                    <td>Certification for Courses Allotted</td>
                                    <td>100</td>
                                    <td>150</td>
                                    <td>{score?.AB1 || "N/A"}</td>
                                    {/* <td>{submissionStatuses["AB1"] ? "✅" : "❌"}</td> */}
                                    <td>{ABEvaluationStatus["AB1"] !== "Incomplete" && ABEvaluationStatus["AB1"] !== "N/A" ? ABEvaluationStatus["AB1"] : "❌"}</td>
                                    <td>
                                        <button className="navigate-button" onClick={() => navigate('/ROAB1')}>
                                            AB-1
                                        </button>
                                    </td>
                                </tr>
                                <tr className={ABEvaluationStatus["AB2"] === "Incomplete" || ABEvaluationStatus["AB2"] === "N/A" ? "error-row" : "fineby"}>

                                    <td>AB-2</td>
                                    <td>Syllabus completion of Courses taught</td>
                                    <td>300</td>
                                    <td>300</td>
                                    <td>{score?.AB2 || "N/A"}</td>
                                    {/* <td>{submissionStatuses["AB2"] ? "✅" : "❌"}</td> */}
                                    <td>{ABEvaluationStatus["AB2"] !== "Incomplete" && ABEvaluationStatus["AB2"] !== "N/A" ? ABEvaluationStatus["AB2"] : "❌"}</td>
                                    <td>
                                        <button className="navigate-button" onClick={() => navigate('/ROAB2')}>
                                            AB-2
                                        </button>
                                    </td>
                                </tr>
                                <tr className={ABEvaluationStatus["AB3"] === "Incomplete" || ABEvaluationStatus["AB3"] === "N/A" ? "error-row" : "fineby"}>

                                    <td>AB-3</td>
                                    <td>BSA - Guest Lecture</td>
                                    <td>75</td>
                                    <td>113</td>
                                    <td>{score?.AB3 || "N/A"}</td>
                                    {/* <td>{submissionStatuses["AB3"] ? "✅" : "❌"}</td> */}
                                    <td>{ABEvaluationStatus["AB3"] !== "Incomplete" && ABEvaluationStatus["AB3"] !== "N/A" ? ABEvaluationStatus["AB3"] : "❌"}</td>
                                    <td>
                                        <button className="navigate-button" onClick={() => navigate('/ROAB3')}>
                                            AB-3
                                        </button>
                                    </td>
                                </tr>

                                <tr className={ABEvaluationStatus["AB4"] === "Incomplete" || ABEvaluationStatus["AB4"] === "N/A" ? "error-row" : "fineby"}>

                                    <td>AB-4 Eng</td>
                                    <td>Lab Work / Case Studies</td>
                                    <td>100</td>
                                    <td>188</td>
                                    <td>{score?.AB4 || "N/A"}</td>
                                    {/* <td>{submissionStatuses["AB4"] ? "✅" : "❌"}</td> */}
                                    <td>{ABEvaluationStatus["AB4"] !== "Incomplete" && ABEvaluationStatus["AB4"] !== "N/A" ? ABEvaluationStatus["AB4"] : "❌"}</td>
                                    <td>
                                        <button className="navigate-button" onClick={() => navigate('/ROAB4')}>
                                            AB-4
                                        </button>
                                    </td>
                                </tr>
                                <tr className={ABEvaluationStatus["AB5"] === "Incomplete" || ABEvaluationStatus["AB5"] === "N/A" ? "error-row" : "fineby"}>

                                    <td>AB-5</td>
                                    <td>Course/ Lab CO/LO-Attainment</td>
                                    <td>200</td>
                                    <td>200</td>
                                    <td>{score?.AB5 || "N/A"}</td>
                                    {/* <td>{submissionStatuses["AB5"] ? "✅" : "❌"}</td> */}
                                    <td>{ABEvaluationStatus["AB5"] !== "Incomplete" && ABEvaluationStatus["AB5"] !== "N/A" ? ABEvaluationStatus["AB5"] : "❌"}</td>
                                    <td>
                                        <button className="navigate-button" onClick={() => navigate('/ROAB5')}>
                                            AB-5
                                        </button>
                                    </td>
                                </tr>
                                <tr className={ABEvaluationStatus["AB6"] === "Incomplete" || ABEvaluationStatus["AB6"] === "N/A" ? "error-row" : "fineby"}>
                                    <td>AB-6</td>
                                    <td>Innovations in TLP</td>
                                    <td>150</td>
                                    <td>225</td>
                                    <td>{score?.AB6 || "N/A"}</td>
                                    {/* <td>{submissionStatuses["AB6"] ? "✅" : "❌"}</td> */}
                                    <td>{ABEvaluationStatus["AB6"] !== "Incomplete" && ABEvaluationStatus["AB6"] !== "N/A" ? ABEvaluationStatus["AB6"] : "❌"}</td>
                                    <td>
                                        <button className="navigate-button" onClick={() => navigate('/ROAB6')}>
                                            AB-6
                                        </button>
                                    </td>
                                </tr>

                                <tr className={ABEvaluationStatus["AB7"] === "Incomplete" || ABEvaluationStatus["AB7"] === "N/A" ? "error-row" : "fineby"}>

                                    <td>AB-7</td>
                                    <td>Contribution for Learning Resources Development</td>
                                    <td>100</td>
                                    <td>100</td>
                                    <td>{score?.AB7 || "N/A"}</td>
                                    {/* <td>{submissionStatuses["AB7"] ? "✅" : "❌"}</td> */}
                                    <td>{ABEvaluationStatus["AB7"] !== "Incomplete" && ABEvaluationStatus["AB7"] !== "N/A" ? ABEvaluationStatus["AB7"] : "❌"}</td>
                                    <td>
                                        <button className="navigate-button" onClick={() => navigate('/ROAB7')}>
                                            AB-7
                                        </button>
                                    </td>
                                </tr>
                                <tr className={ABEvaluationStatus["AB8"] === "Incomplete" || ABEvaluationStatus["AB8"] === "N/A" ? "error-row" : "fineby"}>

                                    <td>AB-8</td>
                                    <td>Mini Project (Subject head)</td>
                                    <td>50</td>
                                    <td>295</td>
                                    <td>{score?.AB8 || "N/A"}</td>
                                    {/* <td>{submissionStatuses["AB8"] ? "✅" : "❌"}</td> */}
                                    <td>{ABEvaluationStatus["AB8"] !== "Incomplete" && ABEvaluationStatus["AB8"] !== "N/A" ? ABEvaluationStatus["AB8"] : "❌"}</td>
                                    <td>
                                        <button className="navigate-button" onClick={() => navigate('/ROAB8')}>
                                            AB-8
                                        </button>
                                    </td>
                                </tr>
                                <tr className={ABEvaluationStatus["AB9"] === "Incomplete" || ABEvaluationStatus["AB9"] === "N/A" ? "error-row" : "fineby"}>

                                    <td>AB-9 Eng</td>
                                    <td>B.E. Projects Guided</td>
                                    <td>100</td>
                                    <td>1323</td>
                                    <td>{score?.AB9 || "N/A"}</td>
                                    {/* <td>{submissionStatuses["AB9"] ? "✅" : "❌"}</td> */}
                                    <td>{ABEvaluationStatus["AB9"] !== "Incomplete" && ABEvaluationStatus["AB9"] !== "N/A" ? ABEvaluationStatus["AB9"] : "❌"}</td>
                                    <td>
                                        <button className="navigate-button" onClick={() => navigate('/ROAB9')}>
                                            AB-9
                                        </button>
                                    </td>
                                </tr>

                                <tr className="total-row">
                                    <td colSpan="2" style={{ fontWeight: "bold", backgroundColor: "#4966b6", color: "white" }}>TOTAL</td>
                                    <td style={{ fontWeight: "bold", backgroundColor: "#4966b6", color: "white" }}>{totalABMarks}</td>
                                    <td style={{ fontWeight: "bold", backgroundColor: "#4966b6", color: "white" }}>{totalMaxABMarks}</td>
                                    <td style={{ fontWeight: "bold", backgroundColor: "#4966b6", color: "white" }}>{totalABSelfScore}</td>
                                    <td style={{ fontWeight: "bold", backgroundColor: "#4966b6", color: "white" }}>{totalABReviewedScore}</td>
                                    <td style={{ backgroundColor: "#4966b6" }}></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Research Bucket */}
                <div className="hombucket4" onClick={() => toggleBucket("research")}>

                    <div className="rbprogress-overlay" style={{ width: `${RBProgress}%` }}></div>

                    <span className="bucket-text">Research Bucket</span>

                    <span className={`arrow ${expandedBucket === "research" ? "open" : ""}`}>▼</span>
                </div>

                {expandedBucket === "research" && (
                    <div className="ai-table-container">
                        <table className="ai-table">
                            <thead>
                                <tr>
                                    <th style={{ backgroundColor: "#537c78" }}>Category No.</th>
                                    <th style={{ backgroundColor: "#537c78" }}>Performance Parameter</th>
                                    <th style={{ backgroundColor: "#537c78" }}>Marks</th>
                                    <th style={{ backgroundColor: "#537c78" }}>Maximum Marks with bonus</th>
                                    <th style={{ backgroundColor: "#537c78" }}>Self Score</th>
                                    {/* <th style={{ backgroundColor: "#537c78" }}>Submission Status</th> */}
                                    <th style={{ backgroundColor: "#537c78" }}>Score after Review</th>
                                    <th style={{ backgroundColor: "#537c78" }}>Link for sheet</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className={RBEvaluationStatus["RB1"] === "Incomplete" || RBEvaluationStatus["RB1"] === "N/A" ? "error-row" : "fineby"}>

                                    <td>RB-1</td>
                                    <td>Certification for Courses Allotted</td>
                                    <td>100</td>
                                    <td>150</td>
                                    <td>{score?.RB1 || "N/A"}</td>
                                    {/* <td>{submissionStatuses["RB1"] ? "✅" : "❌"}</td> */}
                                    <td>{RBEvaluationStatus["RB1"] !== "Incomplete" && RBEvaluationStatus["RB1"] !== "N/A" ? RBEvaluationStatus["RB1"] : "❌"}</td>
                                    <td>
                                        <button className="navigate-button" onClick={() => navigate('/RORB1')}>
                                            RB-1
                                        </button>
                                    </td>
                                </tr>
                                <tr className={RBEvaluationStatus["RB2"] === "Incomplete" || RBEvaluationStatus["RB2"] === "N/A" ? "error-row" : "fineby"}>

                                    <td>RB-2</td>
                                    <td>Syllabus completion of Courses taught</td>
                                    <td>300</td>
                                    <td>300</td>
                                    <td>{score?.RB2 || "N/A"}</td>
                                    {/* <td>{submissionStatuses["RB2"] ? "✅" : "❌"}</td> */}
                                    <td>{RBEvaluationStatus["RB2"] !== "Incomplete" && RBEvaluationStatus["RB2"] !== "N/A" ? RBEvaluationStatus["RB2"] : "❌"}</td>
                                    <td>
                                        <button className="navigate-button" onClick={() => navigate('/RORB2')}>
                                            RB-2
                                        </button>
                                    </td>
                                </tr>
                                <tr className={RBEvaluationStatus["RB3"] === "Incomplete" || RBEvaluationStatus["RB3"] === "N/A" ? "error-row" : "fineby"}>

                                    <td>RB-3</td>
                                    <td>BSA - Guest Lecture</td>
                                    <td>75</td>
                                    <td>113</td>
                                    <td>{score?.RB3 || "N/A"}</td>
                                    {/* <td>{submissionStatuses["RB3"] ? "✅" : "❌"}</td> */}
                                    <td>{RBEvaluationStatus["RB3"] !== "Incomplete" && RBEvaluationStatus["RB3"] !== "N/A" ? RBEvaluationStatus["RB3"] : "❌"}</td>
                                    <td>
                                        <button className="navigate-button" onClick={() => navigate('/RORB3')}>
                                            RB-3
                                        </button>
                                    </td>
                                </tr>

                                <tr className={RBEvaluationStatus["RB4"] === "Incomplete" || RBEvaluationStatus["RB4"] === "N/A" ? "error-row" : "fineby"}>

                                    <td>RB-4 Eng</td>
                                    <td>Lab Work / Case Studies</td>
                                    <td>100</td>
                                    <td>188</td>
                                    <td>{score?.RB4 || "N/A"}</td>
                                    {/* <td>{submissionStatuses["RB4"] ? "✅" : "❌"}</td> */}
                                    <td>{RBEvaluationStatus["RB4"] !== "Incomplete" && RBEvaluationStatus["RB4"] !== "N/A" ? RBEvaluationStatus["RB4"] : "❌"}</td>
                                    <td>
                                        <button className="navigate-button" onClick={() => navigate('/RORB4')}>
                                            RB-4
                                        </button>
                                    </td>
                                </tr>
                                <tr className={RBEvaluationStatus["RB5"] === "Incomplete" || RBEvaluationStatus["RB5"] === "N/A" ? "error-row" : "fineby"}>

                                    <td>RB-5</td>
                                    <td>Course/ Lab CO/LO-Attainment</td>
                                    <td>200</td>
                                    <td>200</td>
                                    <td>{score?.RB5 || "N/A"}</td>
                                    {/* <td>{submissionStatuses["RB5"] ? "✅" : "❌"}</td> */}
                                    <td>{RBEvaluationStatus["RB5"] !== "Incomplete" && RBEvaluationStatus["RB5"] !== "N/A" ? RBEvaluationStatus["RB5"] : "❌"}</td>
                                    <td>
                                        <button className="navigate-button" onClick={() => navigate('/RORB5')}>
                                            RB-5
                                        </button>
                                    </td>
                                </tr>
                                <tr className={RBEvaluationStatus["RB6"] === "Incomplete" || RBEvaluationStatus["RB6"] === "N/A" ? "error-row" : "fineby"}>
                                    <td>RB-6</td>
                                    <td>Innovations in TLP</td>
                                    <td>150</td>
                                    <td>225</td>
                                    <td>{score?.RB6 || "N/A"}</td>
                                    {/* <td>{submissionStatuses["RB6"] ? "✅" : "❌"}</td> */}
                                    <td>{RBEvaluationStatus["RB6"] !== "Incomplete" && RBEvaluationStatus["RB6"] !== "N/A" ? RBEvaluationStatus["RB6"] : "❌"}</td>
                                    <td>
                                        <button className="navigate-button" onClick={() => navigate('/RORB6')}>
                                            RB-6
                                        </button>
                                    </td>
                                </tr>

                                <tr className={RBEvaluationStatus["RB7"] === "Incomplete" || RBEvaluationStatus["RB7"] === "N/A" ? "error-row" : "fineby"}>

                                    <td>RB-7</td>
                                    <td>Contribution for Learning Resources Development</td>
                                    <td>100</td>
                                    <td>100</td>
                                    <td>{score?.RB7 || "N/A"}</td>
                                    {/* <td>{submissionStatuses["RB7"] ? "✅" : "❌"}</td> */}
                                    <td>{RBEvaluationStatus["RB7"] !== "Incomplete" && RBEvaluationStatus["RB7"] !== "N/A" ? RBEvaluationStatus["RB7"] : "❌"}</td>
                                    <td>
                                        <button className="navigate-button" onClick={() => navigate('/RORB7')}>
                                            RB-7
                                        </button>
                                    </td>
                                </tr>
                                <tr className={RBEvaluationStatus["RB8"] === "Incomplete" || RBEvaluationStatus["RB8"] === "N/A" ? "error-row" : "fineby"}>

                                    <td>RB-8</td>
                                    <td>Mini Project (Subject head)</td>
                                    <td>50</td>
                                    <td>295</td>
                                    <td>{score?.RB8 || "N/A"}</td>
                                    {/* <td>{submissionStatuses["RB8"] ? "✅" : "❌"}</td> */}
                                    <td>{RBEvaluationStatus["RB8"] !== "Incomplete" && RBEvaluationStatus["RB8"] !== "N/A" ? RBEvaluationStatus["RB8"] : "❌"}</td>
                                    <td>
                                        <button className="navigate-button" onClick={() => navigate('/RORB8')}>
                                            RB-8
                                        </button>
                                    </td>
                                </tr>
                                <tr className={RBEvaluationStatus["RB9"] === "Incomplete" || RBEvaluationStatus["RB9"] === "N/A" ? "error-row" : "fineby"}>

                                    <td>RB-9 Eng</td>
                                    <td>B.E. Projects Guided</td>
                                    <td>100</td>
                                    <td>1323</td>
                                    <td>{score?.RB9 || "N/A"}</td>
                                    {/* <td>{submissionStatuses["RB9"] ? "✅" : "❌"}</td> */}
                                    <td>{RBEvaluationStatus["RB9"] !== "Incomplete" && RBEvaluationStatus["RB9"] !== "N/A" ? RBEvaluationStatus["RB9"] : "❌"}</td>
                                    <td>
                                        <button className="navigate-button" onClick={() => navigate('/RORB9')}>
                                            RB-9
                                        </button>
                                    </td>
                                </tr>
                                <tr className={RBEvaluationStatus["RB10"] === "Incomplete" || RBEvaluationStatus["RB10"] === "N/A" ? "error-row" : "fineby"}>

                                    <td>RB-10 Eng</td>
                                    <td>M.E. Projects Guided</td>
                                    <td>100</td>
                                    <td>1323</td>
                                    <td>{score?.RB10 || "N/A"}</td>
                                    {/* <td>{submissionStatuses["RB10"] ? "✅" : "❌"}</td> */}
                                    <td>{RBEvaluationStatus["RB10"] !== "Incomplete" && RBEvaluationStatus["RB10"] !== "N/A" ? RBEvaluationStatus["RB10"] : "❌"}</td>
                                    <td>
                                        <button className="navigate-button" onClick={() => navigate('/RORB10')}>
                                            RB-10
                                        </button>
                                    </td>
                                </tr>
                                <tr className={RBEvaluationStatus["RB11"] === "Incomplete" || RBEvaluationStatus["RB11"] === "N/A" ? "error-row" : "fineby"}>

                                    <td>RB-11</td>
                                    <td>Ph.D. Students Guided</td>
                                    <td>150</td>
                                    <td>1654</td>
                                    <td>{score?.RB11 || "N/A"}</td>
                                    {/* <td>{submissionStatuses["RB11"] ? "✅" : "❌"}</td> */}
                                    <td>{RBEvaluationStatus["RB11"] !== "Incomplete" && RBEvaluationStatus["RB11"] !== "N/A" ? RBEvaluationStatus["RB11"] : "❌"}</td>
                                    <td>
                                        <button className="navigate-button" onClick={() => navigate('/RORB11')}>
                                            RB-11
                                        </button>
                                    </td>
                                </tr>
                                <tr className={RBEvaluationStatus["RB12"] === "Incomplete" || RBEvaluationStatus["RB12"] === "N/A" ? "error-row" : "fineby"}>

                                    <td>RB-12</td>
                                    <td>Exam Related Work</td>
                                    <td>100</td>
                                    <td>100</td>
                                    <td>{score?.RB12 || "N/A"}</td>
                                    {/* <td>{submissionStatuses["RB12"] ? "✅" : "❌"}</td> */}
                                    <td>{RBEvaluationStatus["RB12"] !== "Incomplete" && RBEvaluationStatus["RB12"] !== "N/A" ? RBEvaluationStatus["RB12"] : "❌"}</td>
                                    <td>
                                        <button className="navigate-button" onClick={() => navigate('/RORB12')}>
                                            RB-12
                                        </button>
                                    </td>
                                </tr>

                                <tr className="total-row">
                                    <td colSpan="2" style={{ fontWeight: "bold", backgroundColor: "#4966b6", color: "white" }}>TOTAL</td>
                                    <td style={{ fontWeight: "bold", backgroundColor: "#4966b6", color: "white" }}>{totalRBMarks}</td>
                                    <td style={{ fontWeight: "bold", backgroundColor: "#4966b6", color: "white" }}>{totalMaxRBMarks}</td>
                                    <td style={{ fontWeight: "bold", backgroundColor: "#4966b6", color: "white" }}>{totalRBSelfScore}</td>
                                    <td style={{ fontWeight: "bold", backgroundColor: "#4966b6", color: "white" }}>{totalRBReviewedScore}</td>
                                    <td style={{ backgroundColor: "#4966b6" }}></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Consultancy and Corporate Training Bucket */}
                <div className="hombucket5" onClick={() => toggleBucket("consultancy")}>

                    <div className="cbprogress-overlay" style={{ width: `${CBProgress}%` }}></div>

                    <span className="bucket-text">Consultancy and Corporate Training Bucket</span>

                    <span className={`arrow ${expandedBucket === "consultancy" ? "open" : ""}`}>▼</span>
                </div>


                {expandedBucket === "consultancy" && (
                    <div className="ai-table-container">
                        <table className="ai-table">
                            <thead>
                                <tr>
                                    <th style={{ backgroundColor: "#537c78" }}>Category No.</th>
                                    <th style={{ backgroundColor: "#537c78" }}>Performance Parameter</th>
                                    <th style={{ backgroundColor: "#537c78" }}>Marks</th>
                                    <th style={{ backgroundColor: "#537c78" }}>Maximum Marks with bonus</th>
                                    <th style={{ backgroundColor: "#537c78" }}>Self Score</th>
                                    {/* <th style={{ backgroundColor: "#537c78" }}>Submission Status</th> */}
                                    <th style={{ backgroundColor: "#537c78" }}>Score after Review</th>
                                    <th style={{ backgroundColor: "#537c78" }}>Link for sheet</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className={CBEvaluationStatus["CB1"] === "Incomplete" || CBEvaluationStatus["CB1"] === "N/A" ? "error-row" : "fineby"}>

                                    <td>CB-1</td>
                                    <td>Certification for Courses Allotted</td>
                                    <td>100</td>
                                    <td>150</td>
                                    <td>{score?.CB1 || "N/A"}</td>
                                    {/* <td>{submissionStatuses["CB1"] ? "✅" : "❌"}</td> */}
                                    <td>{CBEvaluationStatus["CB1"] !== "Incomplete" && CBEvaluationStatus["CB1"] !== "N/A" ? CBEvaluationStatus["CB1"] : "❌"}</td>
                                    <td>
                                        <button className="navigate-button" onClick={() => navigate('/ROCB1')}>
                                            CB-1
                                        </button>
                                    </td>
                                </tr>
                                <tr className={CBEvaluationStatus["CB2"] === "Incomplete" || CBEvaluationStatus["CB2"] === "N/A" ? "error-row" : "fineby"}>

                                    <td>CB-2</td>
                                    <td>Syllabus completion of Courses taught</td>
                                    <td>300</td>
                                    <td>300</td>
                                    <td>{score?.CB2 || "N/A"}</td>
                                    {/* <td>{submissionStatuses["CB2"] ? "✅" : "❌"}</td> */}
                                    <td>{CBEvaluationStatus["CB2"] !== "Incomplete" && CBEvaluationStatus["CB2"] !== "N/A" ? CBEvaluationStatus["CB2"] : "❌"}</td>
                                    <td>
                                        <button className="navigate-button" onClick={() => navigate('/ROCB2')}>
                                            CB-2
                                        </button>
                                    </td>
                                </tr>
                                <tr className={CBEvaluationStatus["CB3"] === "Incomplete" || CBEvaluationStatus["CB3"] === "N/A" ? "error-row" : "fineby"}>

                                    <td>CB-3</td>
                                    <td>BSA - Guest Lecture</td>
                                    <td>75</td>
                                    <td>113</td>
                                    <td>{score?.CB3 || "N/A"}</td>
                                    {/* <td>{submissionStatuses["CB3"] ? "✅" : "❌"}</td> */}
                                    <td>{CBEvaluationStatus["CB3"] !== "Incomplete" && CBEvaluationStatus["CB3"] !== "N/A" ? CBEvaluationStatus["CB3"] : "❌"}</td>
                                    <td>
                                        <button className="navigate-button" onClick={() => navigate('/ROCB3')}>
                                            CB-3
                                        </button>
                                    </td>
                                </tr>

                                <tr className="total-row">
                                    <td colSpan="2" style={{ fontWeight: "bold", backgroundColor: "#4966b6", color: "white" }}>TOTAL</td>
                                    <td style={{ fontWeight: "bold", backgroundColor: "#4966b6", color: "white" }}>{totalCBMarks}</td>
                                    <td style={{ fontWeight: "bold", backgroundColor: "#4966b6", color: "white" }}>{totalMaxCBMarks}</td>
                                    <td style={{ fontWeight: "bold", backgroundColor: "#4966b6", color: "white" }}>{totalCBSelfScore}</td>
                                    <td style={{ fontWeight: "bold", backgroundColor: "#4966b6", color: "white" }}>{totalCBReviewedScore}</td>
                                    <td style={{ backgroundColor: "#4966b6" }}></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}

                <div className="hombucket6" onClick={() => toggleBucket("product")}>

                    <div className="pbprogress-overlay" style={{ width: `${PDBProgress}%` }}></div>

                    <span className="bucket-text">Product Development Bucket</span>


                    <span className={`arrow ${expandedBucket === "product" ? "open" : ""}`}>▼</span>
                </div>
                {expandedBucket === "product" && (
                    <div className="ai-table-container">
                        <table className="ai-table">
                            <thead>
                                <tr>
                                    <th style={{ backgroundColor: "#537c78" }}>Category No.</th>
                                    <th style={{ backgroundColor: "#537c78" }}>Performance Parameter</th>
                                    <th style={{ backgroundColor: "#537c78" }}>Marks</th>
                                    <th style={{ backgroundColor: "#537c78" }}>Maximum Marks with bonus</th>
                                    <th style={{ backgroundColor: "#537c78" }}>Self Score</th>
                                    {/* <th style={{ backgroundColor: "#537c78" }}>Submission Status</th> */}
                                    <th style={{ backgroundColor: "#537c78" }}>Score after Review</th>
                                    <th style={{ backgroundColor: "#537c78" }}>Link for sheet</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className={PDBEvaluationStatus["PDB1"] === "Incomplete" || PDBEvaluationStatus["PDB1"] === "N/A" ? "error-row" : "fineby"}>

                                    <td>PDB-1</td>
                                    <td>Certification for Courses Allotted</td>
                                    <td>100</td>
                                    <td>150</td>
                                    <td>{score?.PDB1 || "N/A"}</td>
                                    {/* <td>{submissionStatuses["PDB1"] ? "✅" : "❌"}</td> */}
                                    <td>{PDBEvaluationStatus["PDB1"] !== "Incomplete" && PDBEvaluationStatus["PDB1"] !== "N/A" ? PDBEvaluationStatus["PDB1"] : "❌"}</td>
                                    <td>
                                        <button className="navigate-button" onClick={() => navigate('/ROPDB1')}>
                                            PDB-1
                                        </button>
                                    </td>
                                </tr>
                                <tr className={PDBEvaluationStatus["PDB2"] === "Incomplete" || PDBEvaluationStatus["PDB2"] === "N/A" ? "error-row" : "fineby"}>

                                    <td>PDB-2</td>
                                    <td>Syllabus completion of Courses taught</td>
                                    <td>300</td>
                                    <td>300</td>
                                    <td>{score?.PDB2 || "N/A"}</td>
                                    {/* <td>{submissionStatuses["PDB2"] ? "✅" : "❌"}</td> */}
                                    <td>{PDBEvaluationStatus["PDB2"] !== "Incomplete" && PDBEvaluationStatus["PDB2"] !== "N/A" ? PDBEvaluationStatus["PDB2"] : "❌"}</td>
                                    <td>
                                        <button className="navigate-button" onClick={() => navigate('/ROPDB2')}>
                                            PDB-2
                                        </button>
                                    </td>
                                </tr>


                                <tr className="total-row">
                                    <td colSpan="2" style={{ fontWeight: "bold", backgroundColor: "#4966b6", color: "white" }}>TOTAL</td>
                                    <td style={{ fontWeight: "bold", backgroundColor: "#4966b6", color: "white" }}>{totalPDBMarks}</td>
                                    <td style={{ fontWeight: "bold", backgroundColor: "#4966b6", color: "white" }}>{totalMaxPDBMarks}</td>
                                    <td style={{ fontWeight: "bold", backgroundColor: "#4966b6", color: "white" }}>{totalPDBSelfScore}</td>
                                    <td style={{ fontWeight: "bold", backgroundColor: "#4966b6", color: "white" }}>{totalPDBReviewedScore}</td>
                                    <td style={{ backgroundColor: "#4966b6" }}></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            <div className="review-button-container">
                <button className="complete-review-btn" disabled={AIProgress < 100} onClick={handleCompleteReview}>
                    Complete Review
                </button>
            </div>
            <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Review Completion</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to complete the review for <strong>{teacherName}</strong>?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
                        No
                    </Button>
                    <Button variant="primary" onClick={confirmCompleteReview}>
                        Yes
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Success Modal */}
            <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Review Submitted</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    The review for <strong>{teacherName}</strong> has been successfully submitted.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={() => setShowSuccessModal(false)}>
                        OK
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Already Submitted Modal */}
            <Modal show={showAlreadySubmittedModal} onHide={() => setShowAlreadySubmittedModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Review Already Submitted</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    The review for <strong>{teacherName}</strong> has already been submitted.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowAlreadySubmittedModal(false)}>
                        OK
                    </Button>
                </Modal.Footer>
            </Modal>

        </div>
    );
}

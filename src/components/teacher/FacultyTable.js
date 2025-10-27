import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import NewNavbar from './NewNavbar'; // Import NewNavbar
import './faculty.css';

const FacultyTable = ({ user: propUser, onLogout }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(propUser || JSON.parse(localStorage.getItem("user")) || null);
    const [score, setScore] = useState(null);
    const [reviewStatus, setReviewStatus] = useState(false); // Tracks if review is complete
    const [submittedForms, setSubmittedForms] = useState({}); // Store scores & reviews

    const designation = user.designation || "Professor"; // Use database designation
    const [totalAISelfScore, setTotalAISelfScore] = useState(0);
    const [totalSDSelfScore, setTotalSDSelfScore] = useState(0);
    const [totalABSelfScore, setTotalABSelfScore] = useState(0);
    const [totalRBSelfScore, setTotalRBSelfScore] = useState(0);
    const [totalCBSelfScore, setTotalCBSelfScore] = useState(0);
    const [totalPDBSelfScore, setTotalPDBSelfScore] = useState(0);
    const [totalAIROScore, setTotalAIROScore] = useState(0);
    const [totalSDROScore, setTotalSDROScore] = useState(0);
    const [totalABROScore, setTotalABROScore] = useState(0);
    const [totalRBROScore, setTotalRBROScore] = useState(0);
    const [totalCBROScore, setTotalCBROScore] = useState(0);
    const [totalPDBROScore, setTotalPDBROScore] = useState(0);

    const totalSelfScore = totalAISelfScore + totalSDSelfScore + totalABSelfScore + totalRBSelfScore + totalCBSelfScore + totalPDBSelfScore;
    const totalROScore = totalAIROScore + totalSDROScore + totalABROScore + totalRBROScore + totalCBROScore + totalPDBROScore;


    useEffect(() => {
        const calculatedAISelfScore = (
            (score?.AI1 !== "N/A" ? Number(score?.AI1) || 0 : 0) +
            (score?.AI2 !== "N/A" ? Number(score?.AI2) || 0 : 0) +
            (score?.AI31 !== "N/A" ? Number(score?.AI31) || 0 : 0) +
            (score?.AI32 !== "N/A" ? Number(score?.AI32) || 0 : 0) +
            (score?.AI33 !== "N/A" ? Number(score?.AI33) || 0 : 0) +
            (score?.AI34 !== "N/A" ? Number(score?.AI34) || 0 : 0) +
            (score?.AI4 !== "N/A" ? Number(score?.AI4) || 0 : 0) +
            (score?.AI5 !== "N/A" ? Number(score?.AI5) || 0 : 0) +
            (score?.AI6 !== "N/A" ? Number(score?.AI6) || 0 : 0) +
            (score?.AI7 !== "N/A" ? Number(score?.AI7) || 0 : 0) +
            (score?.AI8 !== "N/A" ? Number(score?.AI8) || 0 : 0) +
            (score?.AI9 !== "N/A" ? Number(score?.AI9) || 0 : 0) +
            (score?.AI10 !== "N/A" ? Number(score?.AI10) || 0 : 0) +
            (score?.AI11 !== "N/A" ? Number(score?.AI11) || 0 : 0) +
            (score?.AI12 !== "N/A" ? Number(score?.AI12) || 0 : 0) +
            (score?.AI13 !== "N/A" ? Number(score?.AI13) || 0 : 0) +
            (score?.AI14 !== "N/A" ? Number(score?.AI14) || 0 : 0)
        );

        const calculatedAIROScore = (
            (submittedForms.scores?.AI1 !== "N/A" ? Number(submittedForms.scores?.AI1) || 0 : 0) +
            (submittedForms.scores?.AI2 !== "N/A" ? Number(submittedForms.scores?.AI2) || 0 : 0) +
            (submittedForms.scores?.AI31 !== "N/A" ? Number(submittedForms.scores?.AI31) || 0 : 0) +
            (submittedForms.scores?.AI32 !== "N/A" ? Number(submittedForms.scores?.AI32) || 0 : 0) +
            (submittedForms.scores?.AI33 !== "N/A" ? Number(submittedForms.scores?.AI33) || 0 : 0) +
            (submittedForms.scores?.AI34 !== "N/A" ? Number(submittedForms.scores?.AI34) || 0 : 0) +
            (submittedForms.scores?.AI4 !== "N/A" ? Number(submittedForms.scores?.AI4) || 0 : 0) +
            (submittedForms.scores?.AI5 !== "N/A" ? Number(submittedForms.scores?.AI5) || 0 : 0) +
            (submittedForms.scores?.AI6 !== "N/A" ? Number(submittedForms.scores?.AI6) || 0 : 0) +
            (submittedForms.scores?.AI7 !== "N/A" ? Number(submittedForms.scores?.AI7) || 0 : 0) +
            (submittedForms.scores?.AI8 !== "N/A" ? Number(submittedForms.scores?.AI8) || 0 : 0) +
            (submittedForms.scores?.AI9 !== "N/A" ? Number(submittedForms.scores?.AI9) || 0 : 0) +
            (submittedForms.scores?.AI10 !== "N/A" ? Number(submittedForms.scores?.AI10) || 0 : 0) +
            (submittedForms.scores?.AI11 !== "N/A" ? Number(submittedForms.scores?.AI11) || 0 : 0) +
            (submittedForms.scores?.AI12 !== "N/A" ? Number(submittedForms.scores?.AI12) || 0 : 0) +
            (submittedForms.scores?.AI13 !== "N/A" ? Number(submittedForms.scores?.AI13) || 0 : 0) +
            (submittedForms.scores?.AI14 !== "N/A" ? Number(submittedForms.scores?.AI14) || 0 : 0)
        );

        setTotalAISelfScore(calculatedAISelfScore);
        setTotalAIROScore(calculatedAIROScore);

        // Store in localStorage
        localStorage.setItem("totalAISelfScore", calculatedAISelfScore);
        localStorage.setItem("totalAIROScore", calculatedAIROScore);
    }, [score, submittedForms]);

    useEffect(() => {
        const calculatedSDSelfScore = (
            (score?.SD1 !== "N/A" ? Number(score?.SD1) || 0 : 0) +
            (score?.SD2 !== "N/A" ? Number(score?.SD2) || 0 : 0) +
            (score?.SD3 !== "N/A" ? Number(score?.SD3) || 0 : 0) +
            (score?.SD4 !== "N/A" ? Number(score?.SD4) || 0 : 0) +
            (score?.SD5 !== "N/A" ? Number(score?.SD5) || 0 : 0)
        );

        const calculatedSDROScore = (
            (submittedForms.scores?.SD1 !== "N/A" ? Number(submittedForms.scores?.SD1) || 0 : 0) +
            (submittedForms.scores?.SD2 !== "N/A" ? Number(submittedForms.scores?.SD2) || 0 : 0) +
            (submittedForms.scores?.SD3 !== "N/A" ? Number(submittedForms.scores?.SD3) || 0 : 0) +
            (submittedForms.scores?.SD4 !== "N/A" ? Number(submittedForms.scores?.SD4) || 0 : 0) +
            (submittedForms.scores?.SD5 !== "N/A" ? Number(submittedForms.scores?.SD5) || 0 : 0)
        );

        setTotalSDSelfScore(calculatedSDSelfScore);
        setTotalSDROScore(calculatedSDROScore);

        // Store in localStorage
        localStorage.setItem("totalSDSelfScore", calculatedSDSelfScore);
        localStorage.setItem("totalSDROScore", calculatedSDROScore);
    }, [score, submittedForms]);

    useEffect(() => {
        const calculatedABSelfScore = (
            (score?.AB1 !== "N/A" ? Number(score?.AB1) || 0 : 0) +
            (score?.AB2 !== "N/A" ? Number(score?.AB2) || 0 : 0) +
            (score?.AB3 !== "N/A" ? Number(score?.AB3) || 0 : 0) +
            (score?.AB4 !== "N/A" ? Number(score?.AB4) || 0 : 0) +
            (score?.AB5 !== "N/A" ? Number(score?.AB5) || 0 : 0) +
            (score?.AB6 !== "N/A" ? Number(score?.AB6) || 0 : 0) +
            (score?.AB7 !== "N/A" ? Number(score?.AB7) || 0 : 0) +
            (score?.AB8 !== "N/A" ? Number(score?.AB8) || 0 : 0) +
            (score?.AB9 !== "N/A" ? Number(score?.AB9) || 0 : 0)
        );

        const calculatedABROScore = (
            (submittedForms.scores?.AB1 !== "N/A" ? Number(submittedForms.scores?.AB1) || 0 : 0) +
            (submittedForms.scores?.AB2 !== "N/A" ? Number(submittedForms.scores?.AB2) || 0 : 0) +
            (submittedForms.scores?.AB3 !== "N/A" ? Number(submittedForms.scores?.AB3) || 0 : 0) +
            (submittedForms.scores?.AB4 !== "N/A" ? Number(submittedForms.scores?.AB4) || 0 : 0) +
            (submittedForms.scores?.AB5 !== "N/A" ? Number(submittedForms.scores?.AB5) || 0 : 0) +
            (submittedForms.scores?.AB6 !== "N/A" ? Number(submittedForms.scores?.AB6) || 0 : 0) +
            (submittedForms.scores?.AB7 !== "N/A" ? Number(submittedForms.scores?.AB7) || 0 : 0) +
            (submittedForms.scores?.AB8 !== "N/A" ? Number(submittedForms.scores?.AB8) || 0 : 0) +
            (submittedForms.scores?.AB9 !== "N/A" ? Number(submittedForms.scores?.AB9) || 0 : 0)
        );

        setTotalABSelfScore(calculatedABSelfScore);
        setTotalABROScore(calculatedABROScore);

        // Store in localStorage
        localStorage.setItem("totalABSelfScore", calculatedABSelfScore);
        localStorage.setItem("totalABROScore", calculatedABROScore);

    }, [score, submittedForms]);

    useEffect(() => {
        const calculatedRBSelfScore = (
            (score?.RB1 !== "N/A" ? Number(score?.RB1) || 0 : 0) +
            (score?.RB2 !== "N/A" ? Number(score?.RB2) || 0 : 0) +
            (score?.RB3 !== "N/A" ? Number(score?.RB3) || 0 : 0) +
            (score?.RB4 !== "N/A" ? Number(score?.RB4) || 0 : 0) +
            (score?.RB5 !== "N/A" ? Number(score?.RB5) || 0 : 0) +
            (score?.RB6 !== "N/A" ? Number(score?.RB6) || 0 : 0) +
            (score?.RB7 !== "N/A" ? Number(score?.RB7) || 0 : 0) +
            (score?.RB8 !== "N/A" ? Number(score?.RB8) || 0 : 0) +
            (score?.RB9 !== "N/A" ? Number(score?.RB9) || 0 : 0) +
            (score?.RB10 !== "N/A" ? Number(score?.RB10) || 0 : 0) +
            (score?.RB11 !== "N/A" ? Number(score?.RB11) || 0 : 0) +
            (score?.RB12 !== "N/A" ? Number(score?.RB12) || 0 : 0)
        );

        const calculatedRBROScore = (
            (submittedForms.scores?.RB1 !== "N/A" ? Number(submittedForms.scores?.RB1) || 0 : 0) +
            (submittedForms.scores?.RB2 !== "N/A" ? Number(submittedForms.scores?.RB2) || 0 : 0) +
            (submittedForms.scores?.RB3 !== "N/A" ? Number(submittedForms.scores?.RB3) || 0 : 0) +
            (submittedForms.scores?.RB4 !== "N/A" ? Number(submittedForms.scores?.RB4) || 0 : 0) +
            (submittedForms.scores?.RB5 !== "N/A" ? Number(submittedForms.scores?.RB5) || 0 : 0) +
            (submittedForms.scores?.RB6 !== "N/A" ? Number(submittedForms.scores?.RB6) || 0 : 0) +
            (submittedForms.scores?.RB7 !== "N/A" ? Number(submittedForms.scores?.RB7) || 0 : 0) +
            (submittedForms.scores?.RB8 !== "N/A" ? Number(submittedForms.scores?.RB8) || 0 : 0) +
            (submittedForms.scores?.RB9 !== "N/A" ? Number(submittedForms.scores?.RB9) || 0 : 0) +
            (submittedForms.scores?.RB10 !== "N/A" ? Number(submittedForms.scores?.RB10) || 0 : 0) +
            (submittedForms.scores?.RB11 !== "N/A" ? Number(submittedForms.scores?.RB11) || 0 : 0) +
            (submittedForms.scores?.RB12 !== "N/A" ? Number(submittedForms.scores?.RB12) || 0 : 0)
        );


        setTotalRBSelfScore(calculatedRBSelfScore);
        setTotalRBROScore(calculatedRBROScore);


        // Store in localStorage
        localStorage.setItem("totalRBSelfScore", calculatedRBSelfScore);
        localStorage.setItem("totalRBROScore", calculatedRBROScore);

    }, [score, submittedForms]);

    useEffect(() => {
        const calculatedCBSelfScore = (
            (score?.CB1 !== "N/A" ? Number(score?.CB1) || 0 : 0) +
            (score?.CB2 !== "N/A" ? Number(score?.CB2) || 0 : 0) +
            (score?.CB3 !== "N/A" ? Number(score?.CB3) || 0 : 0)

        );

        const calculatedCBROScore = (
            (submittedForms.scores?.CB1 !== "N/A" ? Number(submittedForms.scores?.CB1) || 0 : 0) +
            (submittedForms.scores?.CB2 !== "N/A" ? Number(submittedForms.scores?.CB2) || 0 : 0) +
            (submittedForms.scores?.CB3 !== "N/A" ? Number(submittedForms.scores?.CB3) || 0 : 0)
        );


        setTotalCBSelfScore(calculatedCBSelfScore);
        setTotalCBROScore(calculatedCBROScore);


        // Store in localStorage
        localStorage.setItem("totalCBSelfScore", calculatedCBSelfScore);
        localStorage.setItem("totalCBROScore", calculatedCBROScore);

    }, [score, submittedForms]);

    useEffect(() => {
        const calculatedPDBSelfScore = (
            (score?.PDB1 !== "N/A" ? Number(score?.PDB1) || 0 : 0) +
            (score?.PDB2 !== "N/A" ? Number(score?.PDB2) || 0 : 0)
        );

        const calculatedPDBROScore = (
            (submittedForms.scores?.PDB1 !== "N/A" ? Number(submittedForms.scores?.PDB1) || 0 : 0) +
            (submittedForms.scores?.PDB2 !== "N/A" ? Number(submittedForms.scores?.PDB2) || 0 : 0) +
            (submittedForms.scores?.PDB3 !== "N/A" ? Number(submittedForms.scores?.PDB3) || 0 : 0)
        );

        setTotalPDBSelfScore(calculatedPDBSelfScore);
        setTotalPDBROScore(calculatedPDBROScore);

        // Store in localStorage
        localStorage.setItem("totalPDBSelfScore", calculatedPDBSelfScore);
        localStorage.setItem("totalPDBROScore", calculatedPDBROScore);

    }, [score, submittedForms]);


    useEffect(() => {
        if (location.state?.user) {
            setUser(location.state.user);
        }
    }, [location.state]);

    useEffect(() => {
        const fetchReviewStatusAndScores = async () => {
            if (!user?.employeeCode) return;

            try {
                // Step 1: Fetch Review Status
                const reviewResponse = await fetch(`http://localhost:5000/api/reviews/teacher-review-status/${user.employeeCode}`);
                const reviewData = await reviewResponse.json();

                if (!reviewResponse.ok) throw new Error("Failed to fetch review status");

                console.log("API Response (Review Status):", reviewData);

                setReviewStatus(reviewData.isReviewClickable);

                // Step 2: If Review is Editable, Fetch Scores & Reviews
                if (reviewData.isReviewClickable) {
                    const aiEndpoints = {
                        AI1: `http://localhost:5000/api/ai1form/submissions?teacherName=${user.name}&teacherDepartment=${user.department}&formId=AI1`,
                        AI2: `http://localhost:5000/api/ai2form/submissions?teacherName=${user.name}&teacherDepartment=${user.department}&formId=AI2`,
                        AI31: `http://localhost:5000/api/ai31form/submissions?teacherName=${user.name}&teacherDepartment=${user.department}&formId=AI31`,
                        AI32: `http://localhost:5000/api/ai32form/submissions?teacherName=${user.name}&teacherDepartment=${user.department}&formId=AI32`,
                        AI33: `http://localhost:5000/api/ai33form/submissions?teacherName=${user.name}&teacherDepartment=${user.department}&formId=AI33`,
                        AI34: `http://localhost:5000/api/ai34form/submissions?teacherName=${user.name}&teacherDepartment=${user.department}&formId=AI34`,
                        AI4: `http://localhost:5000/api/ai4form/submissions?teacherName=${user.name}&teacherDepartment=${user.department}&formId=AI4`,
                        AI5: `http://localhost:5000/api/ai5form/submissions?teacherName=${user.name}&teacherDepartment=${user.department}&formId=AI5`,
                        AI6: `http://localhost:5000/api/ai6form/submissions?teacherName=${user.name}&teacherDepartment=${user.department}&formId=AI6`,
                        AI7: `http://localhost:5000/api/ai7form/submissions?teacherName=${user.name}&teacherDepartment=${user.department}&formId=AI7`,
                        AI8: `http://localhost:5000/api/ai8form/submissions?teacherName=${user.name}&teacherDepartment=${user.department}&formId=AI8`,
                        AI9: `http://localhost:5000/api/ai9form/submissions?teacherName=${user.name}&teacherDepartment=${user.department}&formId=AI9`,
                        AI10: `http://localhost:5000/api/ai10form/submissions?teacherName=${user.name}&teacherDepartment=${user.department}&formId=AI10`,
                        AI11: `http://localhost:5000/api/ai11form/submissions?teacherName=${user.name}&teacherDepartment=${user.department}&formId=AI11`,
                        AI12: `http://localhost:5000/api/ai12form/submissions?teacherName=${user.name}&teacherDepartment=${user.department}&formId=AI12`,
                        AI13: `http://localhost:5000/api/ai13form/submissions?teacherName=${user.name}&teacherDepartment=${user.department}&formId=AI13`,
                        AI14: `http://localhost:5000/api/ai14form/submissions?teacherName=${user.name}&teacherDepartment=${user.department}&formId=AI14`,
                    };

                    const sdEndpoints = {
                        SD1: `http://localhost:5000/api/sd1form/submissions?teacherName=${user.name}&teacherDepartment=${user.department}&formId=SD1`,
                        SD2: `http://localhost:5000/api/sd2form/submissions?teacherName=${user.name}&teacherDepartment=${user.department}&formId=SD2`,
                        SD3: `http://localhost:5000/api/sd3form/submissions?teacherName=${user.name}&teacherDepartment=${user.department}&formId=SD3`,
                        SD4: `http://localhost:5000/api/sd4form/submissions?teacherName=${user.name}&teacherDepartment=${user.department}&formId=SD4`,
                        SD5: `http://localhost:5000/api/sd5form/submissions?teacherName=${user.name}&teacherDepartment=${user.department}&formId=SD5`,
                    };

                    const abEndpoints = {
                        AB1: `http://localhost:5000/api/ab1form/submissions?teacherName=${user.name}&teacherDepartment=${user.department}&formId=AB1`,
                        AB2: `http://localhost:5000/api/ab2form/submissions?teacherName=${user.name}&teacherDepartment=${user.department}&formId=AB2`,
                        AB3: `http://localhost:5000/api/ab3form/submissions?teacherName=${user.name}&teacherDepartment=${user.department}&formId=AB3`,
                        AB4: `http://localhost:5000/api/ab4form/submissions?teacherName=${user.name}&teacherDepartment=${user.department}&formId=AB4`,
                        AB5: `http://localhost:5000/api/ab5form/submissions?teacherName=${user.name}&teacherDepartment=${user.department}&formId=AB5`,
                        AB6: `http://localhost:5000/api/ab6form/submissions?teacherName=${user.name}&teacherDepartment=${user.department}&formId=AB6`,
                        AB7: `http://localhost:5000/api/ab7form/submissions?teacherName=${user.name}&teacherDepartment=${user.department}&formId=AB7`,
                        AB8: `http://localhost:5000/api/ab8form/submissions?teacherName=${user.name}&teacherDepartment=${user.department}&formId=AB8`,
                        AB9: `http://localhost:5000/api/ab9form/submissions?teacherName=${user.name}&teacherDepartment=${user.department}&formId=AB9`,
                    };

                    const rbEndpoints = {
                        RB1: `http://localhost:5000/api/rb1form/submissions?teacherName=${user.name}&teacherDepartment=${user.department}&formId=RB1`,
                        RB2: `http://localhost:5000/api/rb2form/submissions?teacherName=${user.name}&teacherDepartment=${user.department}&formId=RB2`,
                        RB3: `http://localhost:5000/api/rb3form/submissions?teacherName=${user.name}&teacherDepartment=${user.department}&formId=RB3`,
                        RB4: `http://localhost:5000/api/rb4form/submissions?teacherName=${user.name}&teacherDepartment=${user.department}&formId=RB4`,
                        RB5: `http://localhost:5000/api/rb5form/submissions?teacherName=${user.name}&teacherDepartment=${user.department}&formId=RB5`,
                        RB6: `http://localhost:5000/api/rb6form/submissions?teacherName=${user.name}&teacherDepartment=${user.department}&formId=RB6`,
                        RB7: `http://localhost:5000/api/rb7form/submissions?teacherName=${user.name}&teacherDepartment=${user.department}&formId=RB7`,
                        RB8: `http://localhost:5000/api/rb8form/submissions?teacherName=${user.name}&teacherDepartment=${user.department}&formId=RB8`,
                        RB9: `http://localhost:5000/api/rb9form/submissions?teacherName=${user.name}&teacherDepartment=${user.department}&formId=RB9`,
                        RB10: `http://localhost:5000/api/rb10form/submissions?teacherName=${user.name}&teacherDepartment=${user.department}&formId=RB10`,
                        RB11: `http://localhost:5000/api/rb11form/submissions?teacherName=${user.name}&teacherDepartment=${user.department}&formId=RB11`,
                        RB12: `http://localhost:5000/api/rb12form/submissions?teacherName=${user.name}&teacherDepartment=${user.department}&formId=RB12`,
                    };

                    const cbEndpoints = {
                        CB1: `http://localhost:5000/api/cb1form/submissions?teacherName=${user.name}&teacherDepartment=${user.department}&formId=CB1`,
                        CB2: `http://localhost:5000/api/cb2form/submissions?teacherName=${user.name}&teacherDepartment=${user.department}&formId=CB2`,
                        CB3: `http://localhost:5000/api/cb3form/submissions?teacherName=${user.name}&teacherDepartment=${user.department}&formId=CB3`,
                    };

                    const pdbEndpoints = {
                        PDB1: `http://localhost:5000/api/pdb1form/submissions?teacherName=${user.name}&teacherDepartment=${user.department}&formId=PDB1`,
                        PDB2: `http://localhost:5000/api/pdb2form/submissions?teacherName=${user.name}&teacherDepartment=${user.department}&formId=PDB2`,
                    };

                    const allEndpoints = {
                        ...aiEndpoints,
                        ...sdEndpoints,
                        ...abEndpoints,
                        ...rbEndpoints,
                        ...cbEndpoints,
                        ...pdbEndpoints,
                    };





                    // Define how to handle score for each form
                    const aiScoringStrategy = {
                        AI1: "highest",
                        AI2: "average",
                        AI31: "sum",
                        AI32: "sum",
                        AI33: "sum",
                        AI34: "sum",
                        AI4: "average",
                        AI5: "average",
                        AI6: "highest",
                        AI7: "average",
                        AI8: "average",
                        AI9: "highest",
                        AI10: "highest",
                        AI11: "highest",
                        AI12: "highest",
                        AI13: "highest",
                        AI14: "highest",
                    };

                    const sdScoringStrategy = {
                        SD1: "average",
                        SD2: "average",
                        SD3: "highest",
                        SD4: "average",
                        SD5: "highest",
                    };


                    const abScoringStrategy = {
                        AB1: "sum",
                        AB2: "sum",
                        AB3: "sum",
                        AB4: "sum",
                        AB5: "highest",
                        AB6: "sum",
                        AB7: "highest",
                        AB8: "sum",
                        AB9: "highest",
                    };

                    const rbScoringStrategy = {
                        RB1: "sum",
                        RB2: "sum",
                        RB3: "sum",
                        RB4: "highest",
                        RB5: "highest",
                        RB6: "sum",
                        RB7: "sum",
                        RB8: "sum",
                        RB9: "highest",
                        RB10: "sum",
                        RB11: "sum",
                        RB12: "sum",
                    };

                    const cbScoringStrategy = {
                        CB1: "sum",
                        CB2: "highest",
                        CB3: "highest",
                    };


                    const pdbScoringStrategy = {
                        PDB1: "highest",
                        PDB2: "highest",
                    };

                    const scoringStrategy = {
                        ...aiScoringStrategy,
                        ...sdScoringStrategy,
                        ...abScoringStrategy,
                        ...rbScoringStrategy,
                        ...cbScoringStrategy,
                        ...pdbScoringStrategy,
                    };


                    const scores = {};

                    for (const formId of Object.keys(allEndpoints)) {
                        const response = await fetch(allEndpoints[formId]);
                        const result = await response.json();


                        if (!response.ok) throw new Error(`Failed to fetch score for ${formId}`);

                        // Extract and filter numeric scores
                        const scoreArray = result
                            .map((entry) => Number(entry.scoreByRO))
                            .filter((score) => !isNaN(score));


                        const strategy = scoringStrategy[formId];


                        let finalScore = "N/A";
                        if (scoreArray.length > 0) {
                            switch (strategy) {
                                case "sum":
                                    finalScore = scoreArray.reduce((a, b) => a + b, 0);
                                    break;
                                case "average":
                                    finalScore = (scoreArray.reduce((a, b) => a + b, 0) / scoreArray.length);
                                    break;
                                case "highest":
                                    finalScore = Math.max(...scoreArray);
                                    break;
                                default:
                                    finalScore = scoreArray[0];
                            }
                        }

                        scores[formId] = finalScore;
                    }

                    console.log("Fetched Scores with Strategy:", scores);

                    setSubmittedForms({ scores }); // Store scores & reviews in state
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchReviewStatusAndScores();
    }, [user?.employeeCode]);



    useEffect(() => {
        fetchScore();
    }, []);

    const fetchScore = async () => {
        try {
            // Fetch score for AI1
            const responseAI1 = await fetch(
                `http://localhost:5000/api/ai1form/submissions?teacherName=${user.name}&teacherDepartment=${user.department}&formId=AI1`
            );
            if (!responseAI1.ok) throw new Error("Failed to fetch score for AI1");
            const resultAI1 = await responseAI1.json();

            // Fetch score for AI2
            const responseAI2 = await fetch(
                `http://localhost:5000/api/ai2form/submissions?teacherName=${user.name}&teacherDepartment=${user.department}&formId=AI2`
            );
            if (!responseAI2.ok) throw new Error("Failed to fetch score for AI2");
            const resultAI2 = await responseAI2.json();

            // Fetch score for AI31
            const responseAI31 = await fetch(
                `http://localhost:5000/api/ai31form/submissions?teacherName=${user.name}&teacherDepartment=${user.department}&formId=AI31`
            );
            if (!responseAI31.ok) throw new Error("Failed to fetch score for AI31");
            const resultAI31 = await responseAI31.json();

            // Fetch score for AI32
            const responseAI32 = await fetch(
                `http://localhost:5000/api/ai32form/submissions?teacherName=${user.name}&teacherDepartment=${user.department}&formId=AI32`
            );
            if (!responseAI32.ok) throw new Error("Failed to fetch score for AI32");
            const resultAI32 = await responseAI32.json();

            // Fetch score for AI33
            const responseAI33 = await fetch(
                `http://localhost:5000/api/ai33form/submissions?teacherName=${user.name}&teacherDepartment=${user.department}&formId=AI33`
            );
            if (!responseAI33.ok) throw new Error("Failed to fetch score for AI33");
            const resultAI33 = await responseAI33.json();

            // Fetch score for AI34
            const responseAI34 = await fetch(
                `http://localhost:5000/api/ai34form/submissions?teacherName=${user.name}&teacherDepartment=${user.department}&formId=AI34`
            );
            if (!responseAI34.ok) throw new Error("Failed to fetch score for AI34");
            const resultAI34 = await responseAI34.json();

            // Fetch score for AI4
            const responseAI4 = await fetch(
                `http://localhost:5000/api/ai4form/submissions?teacherName=${user.name}&teacherDepartment=${user.department}&formId=AI4`
            );
            if (!responseAI4.ok) throw new Error("Failed to fetch score for AI4");
            const resultAI4 = await responseAI4.json();

            // Fetch score for AI5
            const responseAI5 = await fetch(
                `http://localhost:5000/api/ai5form/submissions?teacherName=${user.name}&teacherDepartment=${user.department}&formId=AI5`
            );
            if (!responseAI5.ok) throw new Error("Failed to fetch score for AI5");
            const resultAI5 = await responseAI5.json();

            // Fetch score for AI6
            const responseAI6 = await fetch(
                `http://localhost:5000/api/ai6form/submissions?teacherName=${user.name}&teacherDepartment=${user.department}&formId=AI6`
            );
            if (!responseAI6.ok) throw new Error("Failed to fetch score for AI6");
            const resultAI6 = await responseAI6.json();

            // Fetch score for AI7
            const responseAI7 = await fetch(
                `http://localhost:5000/api/ai7form/submissions?teacherName=${user.name}&teacherDepartment=${user.department}&formId=AI7`
            );
            if (!responseAI7.ok) throw new Error("Failed to fetch score for AI7");
            const resultAI7 = await responseAI7.json();

            // Fetch score for AI8
            const responseAI8 = await fetch(
                `http://localhost:5000/api/ai8form/submissions?teacherName=${user.name}&teacherDepartment=${user.department}&formId=AI8`
            );
            if (!responseAI8.ok) throw new Error("Failed to fetch score for AI8");
            const resultAI8 = await responseAI8.json();

            // Fetch score for AI9
            const responseAI9 = await fetch(
                `http://localhost:5000/api/ai9form/submissions?teacherName=${user.name}&teacherDepartment=${user.department}&formId=AI9`
            );
            if (!responseAI9.ok) throw new Error("Failed to fetch score for AI9");
            const resultAI9 = await responseAI9.json();

            // Fetch score for AI10
            const responseAI10 = await fetch(
                `http://localhost:5000/api/ai10form/submissions?teacherName=${user.name}&teacherDepartment=${user.department}&formId=AI10`
            );
            if (!responseAI10.ok) throw new Error("Failed to fetch score for AI10");
            const resultAI10 = await responseAI10.json();

            // Fetch score for AI11
            const responseAI11 = await fetch(
                `http://localhost:5000/api/ai11form/submissions?teacherName=${user.name}&teacherDepartment=${user.department}&formId=AI11`
            );
            if (!responseAI11.ok) throw new Error("Failed to fetch score for AI11");
            const resultAI11 = await responseAI11.json();

            // Fetch score for AI12
            const responseAI12 = await fetch(
                `http://localhost:5000/api/ai12form/submissions?teacherName=${user.name}&teacherDepartment=${user.department}&formId=AI12`
            );
            if (!responseAI12.ok) throw new Error("Failed to fetch score for AI12");
            const resultAI12 = await responseAI12.json();

            // Fetch score for AI13
            const responseAI13 = await fetch(
                `http://localhost:5000/api/ai13form/submissions?teacherName=${user.name}&teacherDepartment=${user.department}&formId=AI13`
            );
            if (!responseAI13.ok) throw new Error("Failed to fetch score for AI13");
            const resultAI13 = await responseAI13.json();

            // Fetch score for AI14
            const responseAI14 = await fetch(
                `http://localhost:5000/api/ai14form/submissions?teacherName=${user.name}&teacherDepartment=${user.department}&formId=AI14`
            );
            if (!responseAI14.ok) throw new Error("Failed to fetch score for AI14");
            const resultAI14 = await responseAI14.json();

            // Create an object to store all the scores
            let scores = {};

            // Map each result to the respective form
            scores.AI1 = resultAI1.length > 0 ? Math.max(...resultAI1.map(item => item.score)) : "N/A";
            // Assuming resultAI2 is the array of scores for the form AI2
            scores.AI2 = resultAI2.length > 0
                ? resultAI2.reduce((sum, item) => sum + item.score, 0) / resultAI2.length
                : "N/A";

            scores.AI31 = resultAI31.length > 0
                ? resultAI31.reduce((sum, item) => sum + item.score, 0)
                : "N/A";

            scores.AI32 = resultAI32.length > 0
                ? resultAI32.reduce((sum, item) => sum + item.score, 0)
                : "N/A";

            scores.AI33 = resultAI33.length > 0
                ? resultAI33.reduce((sum, item) => sum + item.score, 0)
                : "N/A";

            scores.AI34 = resultAI34.length > 0
                ? resultAI34.reduce((sum, item) => sum + item.score, 0)
                : "N/A";

            scores.AI4 = resultAI4.length > 0
                ? resultAI4.reduce((sum, item) => sum + item.score, 0) / resultAI4.length
                : "N/A";

            scores.AI5 = resultAI5.length > 0
                ? resultAI5.reduce((sum, item) => sum + item.score, 0) / resultAI5.length
                : "N/A";

            scores.AI6 = resultAI6.length > 0 ? Math.max(...resultAI6.map(item => item.score)) : "N/A";

            scores.AI7 = resultAI7.length > 0
                ? resultAI7.reduce((sum, item) => sum + item.score, 0) / resultAI7.length
                : "N/A";
            scores.AI8 = resultAI8.length > 0
                ? resultAI8.reduce((sum, item) => sum + item.score, 0) / resultAI8.length
                : "N/A";

            scores.AI9 = resultAI9.length > 0 ? Math.max(...resultAI9.map(item => item.score)) : "N/A";
            scores.AI10 = resultAI10.length > 0 ? Math.max(...resultAI10.map(item => item.score)) : "N/A";
            scores.AI11 = resultAI11.length > 0 ? Math.max(...resultAI11.map(item => item.score)) : "N/A";
            scores.AI12 = resultAI12.length > 0 ? Math.max(...resultAI12.map(item => item.score)) : "N/A";
            scores.AI13 = resultAI13.length > 0 ? Math.max(...resultAI13.map(item => item.score)) : "N/A";
            scores.AI14 = resultAI14.length > 0 ? Math.max(...resultAI14.map(item => item.score)) : "N/A";


            const responseSD1 = await fetch(
                `http://localhost:5000/api/sd1form/submissions?teacherName=${user.name}&teacherDepartment=${user.department}&formId=SD1`
            );
            if (!responseSD1.ok) throw new Error("Failed to fetch score for SD1");
            const resultSD1 = await responseSD1.json();

            // Fetch score for SD2
            const responseSD2 = await fetch(
                `http://localhost:5000/api/sd2form/submissions?teacherName=${user.name}&teacherDepartment=${user.department}&formId=SD2`
            );
            if (!responseSD2.ok) throw new Error("Failed to fetch score for SD2");
            const resultSD2 = await responseSD2.json();

            // Fetch score for SD31
            const responseSD3 = await fetch(
                `http://localhost:5000/api/sd3form/submissions?teacherName=${user.name}&teacherDepartment=${user.department}&formId=SD3`
            );
            if (!responseSD3.ok) throw new Error("Failed to fetch score for SD31");
            const resultSD3 = await responseSD3.json();

            // Fetch score for SD4
            const responseSD4 = await fetch(
                `http://localhost:5000/api/sd4form/submissions?teacherName=${user.name}&teacherDepartment=${user.department}&formId=SD4`
            );
            if (!responseSD4.ok) throw new Error("Failed to fetch score for SD4");
            const resultSD4 = await responseSD4.json();

            // Fetch score for SD5
            const responseSD5 = await fetch(
                `http://localhost:5000/api/sd5form/submissions?teacherName=${user.name}&teacherDepartment=${user.department}&formId=SD5`
            );
            if (!responseSD5.ok) throw new Error("Failed to fetch score for SD5");
            const resultSD5 = await responseSD5.json();

            scores.SD1 = resultSD1.length > 0
                ? resultSD1.reduce((sum, item) => sum + item.score, 0) / resultSD1.length
                : "N/A";

            scores.SD2 = resultSD2.length > 0
                ? resultSD2.reduce((sum, item) => sum + item.score, 0) / resultSD2.length
                : "N/A";

            scores.SD3 = resultSD3.length > 0 ? Math.max(...resultSD3.map(item => item.score)) : "N/A";

            scores.SD4 = resultSD4.length > 0
                ? resultSD4.reduce((sum, item) => sum + item.score, 0) / resultSD4.length
                : "N/A";

            scores.SD5 = resultSD5.length > 0 ? Math.max(...resultSD5.map(item => item.score)) : "N/A";


            const responseAB1 = await fetch(
                `http://localhost:5000/api/ab1form/submissions?teacherName=${user.name}&teacherDepartment=${user.department}&formId=AB1`
            );
            if (!responseAB1.ok) throw new Error("Failed to fetch score for AB1");
            const resultAB1 = await responseAB1.json();

            // Fetch score for AB2
            const responseAB2 = await fetch(
                `http://localhost:5000/api/ab2form/submissions?teacherName=${user.name}&teacherDepartment=${user.department}&formId=AB2`
            );
            if (!responseAB2.ok) throw new Error("Failed to fetch score for AB2");
            const resultAB2 = await responseAB2.json();

            // Fetch score for AB31
            const responseAB3 = await fetch(
                `http://localhost:5000/api/ab3form/submissions?teacherName=${user.name}&teacherDepartment=${user.department}&formId=AB3`
            );
            if (!responseAB3.ok) throw new Error("Failed to fetch score for AB3");
            const resultAB3 = await responseAB3.json();

            // Fetch score for AB4
            const responseAB4 = await fetch(
                `http://localhost:5000/api/ab4form/submissions?teacherName=${user.name}&teacherDepartment=${user.department}&formId=AB4`
            );
            if (!responseAB4.ok) throw new Error("Failed to fetch score for AB4");
            const resultAB4 = await responseAB4.json();

            // Fetch score for AB5
            const responseAB5 = await fetch(
                `http://localhost:5000/api/ab5form/submissions?teacherName=${user.name}&teacherDepartment=${user.department}&formId=AB5`
            );
            if (!responseAB5.ok) throw new Error("Failed to fetch score for AB5");
            const resultAB5 = await responseAB5.json();

            const responseAB6 = await fetch(
                `http://localhost:5000/api/ab6form/submissions?teacherName=${user.name}&teacherDepartment=${user.department}&formId=AB6`
            );
            if (!responseAB5.ok) throw new Error("Failed to fetch score for AB5");
            const resultAB6 = await responseAB6.json();

            const responseAB7 = await fetch(
                `http://localhost:5000/api/ab7form/submissions?teacherName=${user.name}&teacherDepartment=${user.department}&formId=AB7`
            );
            if (!responseAB7.ok) throw new Error("Failed to fetch score for AB5");
            const resultAB7 = await responseAB7.json();

            const responseAB8 = await fetch(
                `http://localhost:5000/api/ab8form/submissions?teacherName=${user.name}&teacherDepartment=${user.department}&formId=AB8`
            );
            if (!responseAB8.ok) throw new Error("Failed to fetch score for AB5");
            const resultAB8 = await responseAB8.json();

            const responseAB9 = await fetch(
                `http://localhost:5000/api/ab9form/submissions?teacherName=${user.name}&teacherDepartment=${user.department}&formId=AB9`
            );
            if (!responseAB9.ok) throw new Error("Failed to fetch score for AB5");
            const resultAB9 = await responseAB9.json();

            scores.AB1 = resultAB1.length > 0
                ? resultAB1.reduce((sum, item) => sum + item.score, 0)
                : "N/A";

            scores.AB2 = resultAB2.length > 0
                ? resultAB2.reduce((sum, item) => sum + item.score, 0)
                : "N/A";

            scores.AB3 = resultAB3.length > 0
                ? resultAB3.reduce((sum, item) => sum + item.score, 0)
                : "N/A";

            scores.AB4 = resultAB4.length > 0
                ? resultAB4.reduce((sum, item) => sum + item.score, 0)
                : "N/A";

            scores.AB6 = resultAB6.length > 0
                ? resultAB6.reduce((sum, item) => sum + item.score, 0)
                : "N/A";

            scores.AB8 = resultAB8.length > 0
                ? resultAB8.reduce((sum, item) => sum + item.score, 0)
                : "N/A";

            scores.AB5 = resultAB5.length > 0 ? Math.max(...resultAB5.map(item => item.score)) : "N/A";

            scores.AB7 = resultAB7.length > 0 ? Math.max(...resultAB7.map(item => item.score)) : "N/A";

            scores.AB9 = resultAB9.length > 0 ? Math.max(...resultAB9.map(item => item.score)) : "N/A";


            const responseRB1 = await fetch(
                `http://localhost:5000/api/rb1form/submissions?teacherName=${user.name}&teacherDepartment=${user.department}&formId=RB1`
            );
            if (!responseRB1.ok) throw new Error("Failed to fetch score for RB1");
            const resultRB1 = await responseRB1.json();

            // Fetch score for RB2
            const responseRB2 = await fetch(
                `http://localhost:5000/api/rb2form/submissions?teacherName=${user.name}&teacherDepartment=${user.department}&formId=RB2`
            );
            if (!responseRB2.ok) throw new Error("Failed to fetch score for RB2");
            const resultRB2 = await responseRB2.json();

            // Fetch score for RB31
            const responseRB3 = await fetch(
                `http://localhost:5000/api/rb3form/submissions?teacherName=${user.name}&teacherDepartment=${user.department}&formId=RB3`
            );
            if (!responseRB3.ok) throw new Error("Failed to fetch score for RB3");
            const resultRB3 = await responseRB3.json();

            // Fetch score for RB4
            const responseRB4 = await fetch(
                `http://localhost:5000/api/rb4form/submissions?teacherName=${user.name}&teacherDepartment=${user.department}&formId=RB4`
            );
            if (!responseRB4.ok) throw new Error("Failed to fetch score for RB4");
            const resultRB4 = await responseRB4.json();

            // Fetch score for RB5
            const responseRB5 = await fetch(
                `http://localhost:5000/api/rb5form/submissions?teacherName=${user.name}&teacherDepartment=${user.department}&formId=RB5`
            );
            if (!responseRB5.ok) throw new Error("Failed to fetch score for RB5");
            const resultRB5 = await responseRB5.json();

            const responseRB6 = await fetch(
                `http://localhost:5000/api/rb6form/submissions?teacherName=${user.name}&teacherDepartment=${user.department}&formId=RB6`
            );
            if (!responseRB5.ok) throw new Error("Failed to fetch score for RB6");
            const resultRB6 = await responseRB6.json();

            const responseRB7 = await fetch(
                `http://localhost:5000/api/rb7form/submissions?teacherName=${user.name}&teacherDepartment=${user.department}&formId=RB7`
            );
            if (!responseRB7.ok) throw new Error("Failed to fetch score for RB7");
            const resultRB7 = await responseRB7.json();

            const responseRB8 = await fetch(
                `http://localhost:5000/api/rb8form/submissions?teacherName=${user.name}&teacherDepartment=${user.department}&formId=RB8`
            );
            if (!responseRB8.ok) throw new Error("Failed to fetch score for RB8");
            const resultRB8 = await responseRB8.json();

            const responseRB9 = await fetch(
                `http://localhost:5000/api/rb9form/submissions?teacherName=${user.name}&teacherDepartment=${user.department}&formId=RB9`
            );
            if (!responseRB9.ok) throw new Error("Failed to fetch score for RB9");
            const resultRB9 = await responseRB9.json();

            const responseRB10 = await fetch(
                `http://localhost:5000/api/rb10form/submissions?teacherName=${user.name}&teacherDepartment=${user.department}&formId=RB10`
            );
            if (!responseRB10.ok) throw new Error("Failed to fetch score for RB10");
            const resultRB10 = await responseRB10.json();

            const responseRB11 = await fetch(
                `http://localhost:5000/api/rb11form/submissions?teacherName=${user.name}&teacherDepartment=${user.department}&formId=RB11`
            );
            if (!responseRB11.ok) throw new Error("Failed to fetch score for RB11");
            const resultRB11 = await responseRB11.json();

            const responseRB12 = await fetch(
                `http://localhost:5000/api/rb12form/submissions?teacherName=${user.name}&teacherDepartment=${user.department}&formId=RB12`
            );
            if (!responseRB12.ok) throw new Error("Failed to fetch score for RB12");
            const resultRB12 = await responseRB12.json();

            scores.RB1 = resultRB1.length > 0
                ? resultRB1.reduce((sum, item) => sum + item.score, 0)
                : "N/A";

            scores.RB2 = resultRB2.length > 0
                ? resultRB2.reduce((sum, item) => sum + item.score, 0)
                : "N/A";

            scores.RB3 = resultRB3.length > 0
                ? resultRB3.reduce((sum, item) => sum + item.score, 0)
                : "N/A";

            scores.RB6 = resultRB6.length > 0
                ? resultRB6.reduce((sum, item) => sum + item.score, 0)
                : "N/A";

            scores.RB7 = resultRB7.length > 0
                ? resultRB7.reduce((sum, item) => sum + item.score, 0)
                : "N/A";

            scores.RB8 = resultRB8.length > 0
                ? resultRB8.reduce((sum, item) => sum + item.score, 0)
                : "N/A";

            scores.RB10 = resultRB10.length > 0
                ? resultRB10.reduce((sum, item) => sum + item.score, 0)
                : "N/A";

            scores.RB11 = resultRB11.length > 0
                ? resultRB11.reduce((sum, item) => sum + item.score, 0)
                : "N/A";

            scores.RB12 = resultRB12.length > 0
                ? resultRB12.reduce((sum, item) => sum + item.score, 0)
                : "N/A";

            scores.RB4 = resultRB4.length > 0 ? Math.max(...resultRB4.map(item => item.score)) : "N/A";

            scores.RB5 = resultRB5.length > 0 ? Math.max(...resultRB5.map(item => item.score)) : "N/A";

            scores.RB9 = resultRB9.length > 0 ? Math.max(...resultRB9.map(item => item.score)) : "N/A";


            const responseCB1 = await fetch(
                `http://localhost:5000/api/cb1form/submissions?teacherName=${user.name}&teacherDepartment=${user.department}&formId=CB1`
            );
            if (!responseCB1.ok) throw new Error("Failed to fetch score for CB1");
            const resultCB1 = await responseCB1.json();

            // Fetch score for CB2
            const responseCB2 = await fetch(
                `http://localhost:5000/api/cb2form/submissions?teacherName=${user.name}&teacherDepartment=${user.department}&formId=CB2`
            );
            if (!responseCB2.ok) throw new Error("Failed to fetch score for CB2");
            const resultCB2 = await responseCB2.json();

            // Fetch score for CB31
            const responseCB3 = await fetch(
                `http://localhost:5000/api/cb3form/submissions?teacherName=${user.name}&teacherDepartment=${user.department}&formId=CB3`
            );
            if (!responseCB3.ok) throw new Error("Failed to fetch score for CB3");
            const resultCB3 = await responseCB3.json();

            scores.CB1 = resultCB1.length > 0
                ? resultCB1.reduce((sum, item) => sum + item.score, 0)
                : "N/A";

            scores.CB2 = resultCB2.length > 0 ? Math.max(...resultCB2.map(item => item.score)) : "N/A";

            scores.CB3 = resultCB3.length > 0 ? Math.max(...resultCB3.map(item => item.score)) : "N/A";


            const responsePDB1 = await fetch(
                `http://localhost:5000/api/pdb1form/submissions?teacherName=${user.name}&teacherDepartment=${user.department}&formId=PDB1`
            );
            if (!responsePDB1.ok) throw new Error("Failed to fetch score for PDB1");
            const resultPDB1 = await responsePDB1.json();

            // Fetch score for PDB2
            const responsePDB2 = await fetch(
                `http://localhost:5000/api/pdb2form/submissions?teacherName=${user.name}&teacherDepartment=${user.department}&formId=PDB2`
            );
            if (!responsePDB2.ok) throw new Error("Failed to fetch score for PDB2");
            const resultPDB2 = await responsePDB2.json();

            scores.PDB1 = resultPDB1.length > 0 ? Math.max(...resultPDB1.map(item => item.score)) : "N/A";

            scores.PDB2 = resultPDB2.length > 0 ? Math.max(...resultPDB2.map(item => item.score)) : "N/A";

            // Set the state with all the scores
            setScore(scores);

        } catch (error) {
            console.error("Error fetching scores:", error);
            setScore("Error");
        }
    };

    const thresholds = {
        Professor: [60, 60, 40, 40, 10, 10],
        "Associate Professor": [60, 60, 30, 30, 8, 8],
        "Assistant Professor": [60, 60, 20, 20, 5, 5]
    };

    const data = [
        { category: 'Academic Involvement', totalMarks: 2000, engg: 7091, mms: 5600 },
        { category: 'Student Development', totalMarks: 2000, engg: 2800, mms: 2800 },
        { category: 'Administrative Bucket', totalMarks: 800, engg: 2400, mms: 2400 },
        { category: 'Research Bucket', totalMarks: 800, engg: 1788, mms: 1788 },
        { category: 'Consultancy and Corporate Training Bucket', totalMarks: 800, engg: 1806, mms: 1806 },
        { category: 'Product Dev. Bucket', totalMarks: 800, engg: 1680, mms: 1680 }
    ];

    const totalMarks = data.reduce((sum, row) => sum + row.totalMarks, 0);
    const totalThresholdMarks = data.reduce((sum, row, index) => {
        const thresholdPercentage = thresholds[designation][index];
        return sum + (row.totalMarks * thresholdPercentage) / 100;
    }, 0);
    const totalEngg = data.reduce((sum, row) => sum + row.engg, 0);
    const totalMms = data.reduce((sum, row) => sum + row.mms, 0);

    return (
        <div className="faculty-container">
            <NewNavbar user={user} onLogout={onLogout} />
            <div className="faculty-subcontainer">
                {/* Faculty Details */}
                <div className="faculty-details">
                    <div>
                        <b>Faculty Name: </b> {user.name || 'N/A'}
                    </div>
                    <div>
                        <b>Department: </b> {user.department || 'N/A'}
                    </div>
                    <div>
                        <b>Employee Code: </b> {user.employeeCode || 'N/A'}
                    </div>
                    <div>
                        <b>Designation: </b> {user.designation || 'N/A'}
                    </div>

                    <button
                        className="visualize-button"
                        onClick={() => navigate("/visualizations", {
                            state: {
                                user: user, // 🧠 explicitly adding user
                                totalAISelfScore,
                                totalSDSelfScore,
                                totalABSelfScore,
                                totalRBSelfScore,
                                totalCBSelfScore,
                                totalPDBSelfScore,
                                totalAIROScore,
                                totalSDROScore,
                                totalABROScore,
                                totalRBROScore,
                                totalCBROScore,
                                totalPDBROScore
                            }
                        })}
                    >
                        Show Visualizations
                    </button>

                </div>

                {/* Score Table */}
                <table className="score-table">
                    <thead>
                        <tr>
                            <th rowSpan="3">Category No.</th>
                            <th rowSpan="3">Type of Category</th>
                            <th rowSpan="3" className="narrow-col">Total Marks</th>
                            <th colSpan="2">Maximum Marks with Bonus</th>
                            <th colSpan="5">{designation}</th>
                        </tr>
                        <tr>
                            <th rowSpan="2" className="medium-col">Engg</th>
                            <th rowSpan="2" className="medium-col">MMS</th>
                            <th colSpan="2" className="wide-col">Threshold</th>
                            <th rowSpan="2" className="medium-col">Self Score</th>
                            <th rowSpan="2" className="medium-col">Score After Review by RO</th>
                        </tr>
                        <tr>
                            <th className="narrow-col">%</th>
                            <th className="narrow-col">Marks</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, index) => {
                            const thresholdPercentage = thresholds[designation][index];
                            const thresholdMarks = (row.totalMarks * thresholdPercentage) / 100;

                            const categoryNumber = index === 2 ? '3A' :
                                index === 3 ? '3B' :
                                    index === 4 ? '3C' :
                                        index === 5 ? '3D' :
                                            index + 1;

                            return (
                                <tr key={index}>
                                    <td>{categoryNumber}</td>
                                    <td>{row.category}</td>
                                    <td>{row.totalMarks}</td>
                                    <td>{row.engg}</td>
                                    <td>{row.mms}</td>
                                    <td>{thresholdPercentage}%</td>
                                    <td>{thresholdMarks}</td>
                                    <td>{index === 0 ? totalAISelfScore :
                                        index === 1 ? totalSDSelfScore :
                                            index === 2 ? totalABSelfScore :
                                                index === 3 ? totalRBSelfScore :
                                                    index === 4 ? totalCBSelfScore :
                                                        index === 5 ? totalPDBSelfScore : ''}</td>

                                    <td>
                                        {index === 0 ? totalAIROScore :
                                            index === 1 ? totalSDROScore :
                                                index === 2 ? totalABROScore :
                                                    index === 3 ? totalRBROScore :
                                                        index === 4 ? totalCBROScore :
                                                            index === 5 ? totalPDBROScore : ''}
                                    </td>

                                </tr>
                            );
                        })}
                        <tr>
                            <td colSpan="2"><b>Total = 1+2+3A+3B+3C+3D</b></td>
                            <td><b>{totalMarks}</b></td>
                            <td><b>{totalEngg}</b></td>
                            <td><b>{totalMms}</b></td>
                            <td><b></b></td>
                            <td><b>{totalThresholdMarks}</b></td>
                            <td><b>{totalSelfScore}</b></td>
                            <td><b>{totalROScore}</b></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default FacultyTable;

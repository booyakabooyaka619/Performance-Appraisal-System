import React, { useEffect, useState } from "react";
import "./summary.css";
import NewNavbar from "./NewNavbar";
import { useLocation } from "react-router-dom";
import { useNavigate } from 'react-router-dom';


export default function Summary({ user: propUser, onLogout }) {
    const location = useLocation();
    const [user, setUser] = useState(propUser || JSON.parse(localStorage.getItem("user")) || null);
    const [expandedBucket, setExpandedBucket] = useState(null); // Track which bucket is open
    const [score, setScore] = useState(null);
    const [reviewStatus, setReviewStatus] = useState(false); // Tracks if review is complete
    const [submittedForms, setSubmittedForms] = useState({}); // Store scores & reviews
    const navigate = useNavigate();
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



    // Toggle specific bucket
    const toggleBucket = (bucketName) => {
        setExpandedBucket(expandedBucket === bucketName ? null : bucketName);
    };

    return (
        <div>
            {user && <NewNavbar user={user} onLogout={onLogout} />}

            <div className="hombucket-container">
                {/* Academic Involvement */}
                <div className="hombucket1" onClick={() => toggleBucket("academic")}>
                    Academic Involvement
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
                                    <th style={{ backgroundColor: "#537c78" }}>Score by RO</th>
                                    <th style={{ backgroundColor: "#537c78" }}>Link for sheet</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>AI-1</td>
                                    <td>Certification for Courses Allotted</td>
                                    <td>100</td>
                                    <td>150</td>
                                    <td style={{ backgroundColor: score?.AI1 === "N/A" ? "lightcoral" : "lightgreen" }}>
                                        {score?.AI1 || "N/A"}
                                    </td>
                                    <td>
                                        {submittedForms.scores?.AI1 || "N/A"}
                                    </td>
                                    <td><button className="navigate-button" onClick={() => navigate('/AI/AI1')}>
                                        AI-1
                                    </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>AI-2</td>
                                    <td>Syllabus completion of Courses taught</td>
                                    <td>300</td>
                                    <td>300</td>
                                    <td style={{ backgroundColor: score?.AI2 === "N/A" ? "lightcoral" : "lightgreen" }}>
                                        {score?.AI2 || "N/A"}
                                    </td>
                                    <td >
                                        {submittedForms.scores?.AI2 || "N/A"}
                                    </td>
                                    <td>
                                        <button className="navigate-button" onClick={() => navigate('/AI/AI2')}>
                                            AI-2
                                        </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>AI-3.1</td>
                                    <td>BSA - Guest Lecture</td>
                                    <td>75</td>
                                    <td>113</td>
                                    <td style={{ backgroundColor: score?.AI31 === "N/A" ? "lightcoral" : "lightgreen" }}>
                                        {score?.AI31 || "N/A"}
                                    </td>
                                    <td>
                                        {submittedForms.scores?.AI31 || "N/A"}
                                    </td>
                                    <td><button className="navigate-button" onClick={() => navigate('/AI/AI31')}>
                                        AI-3.1
                                    </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>AI-3.2</td>
                                    <td>BSA - Industrial Visit</td>
                                    <td>75</td>
                                    <td>278</td>
                                    <td style={{ backgroundColor: score?.AI32 === "N/A" ? "lightcoral" : "lightgreen" }}>
                                        {score?.AI32 || "N/A"}
                                    </td>
                                    <td>
                                        {submittedForms.scores?.AI32 || "N/A"}
                                    </td>
                                    <td><button className="navigate-button" onClick={() => navigate('/AI/AI32')}>
                                        AI-32
                                    </button></td>
                                </tr>
                                <tr>
                                    <td>AI-3.3</td>
                                    <td>BSA - Co-curricular</td>
                                    <td>75</td>
                                    <td>338</td>
                                    <td style={{ backgroundColor: score?.AI33 === "N/A" ? "lightcoral" : "lightgreen" }}>
                                        {score?.AI33 || "N/A"}
                                    </td>
                                    <td>
                                        {submittedForms.scores?.AI33 || "N/A"}
                                    </td>
                                    <td><button className="navigate-button" onClick={() => navigate('/AI/AI33')}>
                                        AI-33
                                    </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>AI-3.4</td>
                                    <td>BSA - Mini Project (within a Course)</td>
                                    <td>75</td>
                                    <td>254</td>
                                    <td style={{ backgroundColor: score?.AI34 === "N/A" ? "lightcoral" : "lightgreen" }}>
                                        {score?.AI34 || "N/A"}
                                    </td>
                                    <td>
                                        {submittedForms.scores?.AI34 || "N/A"}
                                    </td>
                                    <td><button className="navigate-button" onClick={() => navigate('/AI/AI34')}>
                                        AI-34
                                    </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>AI-4 Eng</td>
                                    <td>Lab Work / Case Studies</td>
                                    <td>100</td>
                                    <td>188</td>
                                    <td style={{ backgroundColor: score?.AI4 === "N/A" ? "lightcoral" : "lightgreen" }}>
                                        {score?.AI4 || "N/A"}
                                    </td>
                                    <td>
                                        {submittedForms.scores?.AI4 || "N/A"}
                                    </td>
                                    <td><button className="navigate-button" onClick={() => navigate('/AI/AI4')}>
                                        AI-4
                                    </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>AI-5</td>
                                    <td>Course/ Lab CO/LO-Attainment</td>
                                    <td>200</td>
                                    <td>200</td>
                                    <td style={{ backgroundColor: score?.AI5 === "N/A" ? "lightcoral" : "lightgreen" }}>
                                        {score?.AI5 || "N/A"}
                                    </td>
                                    <td>
                                        {submittedForms.scores?.AI5 || "N/A"}
                                    </td>
                                    <td><button className="navigate-button" onClick={() => navigate('/AI/AI5')}>
                                        AI-5
                                    </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>AI-6</td>
                                    <td>Innovations in TLP</td>
                                    <td>150</td>
                                    <td>225</td>
                                    <td style={{ backgroundColor: score?.AI6 === "N/A" ? "lightcoral" : "lightgreen" }}>
                                        {score?.AI6 || "N/A"}
                                    </td>
                                    <td>
                                        {submittedForms.scores?.AI6 || "N/A"}
                                    </td>
                                    <td><button className="navigate-button" onClick={() => navigate('/AI/AI6')}>
                                        AI-6
                                    </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>AI-7</td>
                                    <td>Contribution for Learning Resources Development</td>
                                    <td>100</td>
                                    <td>100</td>
                                    <td style={{ backgroundColor: score?.AI7 === "N/A" ? "lightcoral" : "lightgreen" }}>
                                        {score?.AI7 || "N/A"}
                                    </td>
                                    <td>
                                        {submittedForms.scores?.AI7 || "N/A"}
                                    </td>
                                    <td><button className="navigate-button" onClick={() => navigate('/AI/AI7')}>
                                        AI-7
                                    </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>AI-8</td>
                                    <td>Mini Project (Subject head)</td>
                                    <td>50</td>
                                    <td>295</td>
                                    <td style={{ backgroundColor: score?.AI8 === "N/A" ? "lightcoral" : "lightgreen" }}>
                                        {score?.AI8 || "N/A"}
                                    </td>
                                    <td>
                                        {submittedForms.scores?.AI8 || "N/A"}
                                    </td>
                                    <td><button className="navigate-button" onClick={() => navigate('/AI/AI8')}>
                                        AI-8
                                    </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>AI-9 Eng</td>
                                    <td>B.E. Projects Guided</td>
                                    <td>100</td>
                                    <td>1323</td>
                                    <td style={{ backgroundColor: score?.AI9 === "N/A" ? "lightcoral" : "lightgreen" }}>
                                        {score?.AI9 || "N/A"}
                                    </td>
                                    <td>
                                        {submittedForms.scores?.AI9 || "N/A"}
                                    </td>
                                    <td><button className="navigate-button" onClick={() => navigate('/AI/AI9')}>
                                        AI-9
                                    </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>AI-10 Eng</td>
                                    <td>M.E. Projects Guided</td>
                                    <td>100</td>
                                    <td>1323</td>
                                    <td style={{ backgroundColor: score?.AI10 === "N/A" ? "lightcoral" : "lightgreen" }}>
                                        {score?.AI10 || "N/A"}
                                    </td>
                                    <td>
                                        {submittedForms.scores?.AI10 || "N/A"}
                                    </td>
                                    <td><button className="navigate-button" onClick={() => navigate('/AI/AI10')}>
                                        AI-10
                                    </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>AI-11</td>
                                    <td>Ph.D. Students Guided</td>
                                    <td>100</td>
                                    <td>1654</td>
                                    <td style={{ backgroundColor: score?.AI11 === "N/A" ? "lightcoral" : "lightgreen" }}>
                                        {score?.AI11 || "N/A"}
                                    </td>
                                    <td>
                                        {submittedForms.scores?.AI11 || "N/A"}
                                    </td>
                                    <td><button className="navigate-button" onClick={() => navigate('/AI/AI11')}>
                                        AI-11
                                    </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>AI-12</td>
                                    <td>Exam Related Work</td>
                                    <td>100</td>
                                    <td>100</td>
                                    <td style={{ backgroundColor: score?.AI12 === "N/A" ? "lightcoral" : "lightgreen" }}>
                                        {score?.AI12 || "N/A"}
                                    </td>
                                    <td>
                                        {submittedForms.scores?.AI12 || "N/A"}
                                    </td>
                                    <td><button className="navigate-button" onClick={() => navigate('/AI/AI12')}>
                                        AI-12
                                    </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>AI-13</td>
                                    <td>Preview Grades (Preceding Semester)</td>
                                    <td>100</td>
                                    <td>100</td>
                                    <td style={{ backgroundColor: score?.AI13 === "N/A" ? "lightcoral" : "lightgreen" }}>
                                        {score?.AI13 || "N/A"}
                                    </td>
                                    <td>
                                        {submittedForms.scores?.AI13 || "N/A"}
                                    </td>
                                    <td><button className="navigate-button" onClick={() => navigate('/AI/AI13')}>
                                        AI-13
                                    </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>AI-14</td>
                                    <td>Review Grades (Preceding Semester)</td>
                                    <td>150</td>
                                    <td>150</td>
                                    <td style={{ backgroundColor: score?.AI14 === "N/A" ? "lightcoral" : "lightgreen" }}>
                                        {score?.AI14 || "N/A"}
                                    </td>
                                    <td>
                                        {submittedForms.scores?.AI14 || "N/A"}
                                    </td>
                                    <td>
                                        <button className="navigate-button" onClick={() => navigate('/AI/AI14')}>
                                            AI-14
                                        </button>
                                    </td>
                                </tr>
                                <tr style={{ fontWeight: "bold", backgroundColor: "#4966b6", color: "white" }}>
                                    <td colSpan="2" style={{ fontWeight: "bold", backgroundColor: "#4966b6", color: "white" }}>Total:</td>
                                    <td style={{ fontWeight: "bold", backgroundColor: "#4966b6", color: "white" }}>2000</td>
                                    <td style={{ fontWeight: "bold", backgroundColor: "#4966b6", color: "white" }}>7091</td>
                                    <td style={{ fontWeight: "bold", backgroundColor: "#4966b6", color: "white" }}>
                                        {totalAISelfScore}
                                    </td>
                                    <td style={{ fontWeight: "bold", backgroundColor: "#4966b6", color: "white" }}>
                                        {totalAIROScore}
                                    </td>
                                    <td>
                                    </td>
                                </tr>



                            </tbody>
                        </table>

                    </div>
                )}

                {/* Student Development */}
                <div className="hombucket2" onClick={() => toggleBucket("studentDevelopment")}>
                    Student Development
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
                                    <th style={{ backgroundColor: "#537c78" }}>Score by RO</th>
                                    <th style={{ backgroundColor: "#537c78" }}>Link for sheet</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>SD-1</td>
                                    <td>Student Attendance</td>
                                    <td>300</td>
                                    <td>300</td>
                                    <td style={{ backgroundColor: score?.SD1 === "N/A" ? "lightcoral" : "lightgreen" }}>
                                        {score?.SD1 || "N/A"}
                                    </td>
                                    <td>
                                        {submittedForms.scores?.SD1 || "N/A"}
                                    </td>
                                    <td><button className="navigate-button" onClick={() => navigate('/SD/SD1')}>
                                        SD-1
                                    </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>SD-2</td>
                                    <td>Course Result (Preceding Semester Taught Courses)</td>
                                    <td>700</td>
                                    <td>700</td>
                                    <td style={{ backgroundColor: score?.SD2 === "N/A" ? "lightcoral" : "lightgreen" }}>
                                        {score?.SD2 || "N/A"}
                                    </td>
                                    <td >
                                        {submittedForms.scores?.SD2 || "N/A"}
                                    </td>
                                    <td>
                                        <button className="navigate-button" onClick={() => navigate('/SD/SD2')}>
                                            SD-2
                                        </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>SD-3</td>
                                    <td>Topper Marks (Preceding Semester Taught Courses)</td>
                                    <td>500</td>
                                    <td>500</td>
                                    <td style={{ backgroundColor: score?.SD3 === "N/A" ? "lightcoral" : "lightgreen" }}>
                                        {score?.SD3 || "N/A"}
                                    </td>
                                    <td>
                                        {submittedForms.scores?.SD3 || "N/A"}
                                    </td>
                                    <td><button className="navigate-button" onClick={() => navigate('/SD/SD3')}>
                                        SD-3
                                    </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>SD-4 Eng</td>
                                    <td>Student feedback (Taught Courses)</td>
                                    <td>300</td>
                                    <td>300</td>
                                    <td style={{ backgroundColor: score?.SD4 === "N/A" ? "lightcoral" : "lightgreen" }}>
                                        {score?.SD4 || "N/A"}
                                    </td>
                                    <td>
                                        {submittedForms.scores?.SD4 || "N/A"}
                                    </td>
                                    <td><button className="navigate-button" onClick={() => navigate('/SD/SD4')}>
                                        SD-4
                                    </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>SD-5</td>
                                    <td>Mentoring Students</td>
                                    <td>200</td>
                                    <td>1000</td>
                                    <td style={{ backgroundColor: score?.SD5 === "N/A" ? "lightcoral" : "lightgreen" }}>
                                        {score?.SD5 || "N/A"}
                                    </td>
                                    <td>
                                        {submittedForms.scores?.SD5 || "N/A"}
                                    </td>
                                    <td><button className="navigate-button" onClick={() => navigate('/SD/SD5')}>
                                        SD-5
                                    </button>
                                    </td>
                                </tr>
                                <tr style={{ fontWeight: "bold", backgroundColor: "#4966b6", color: "white" }}>
                                    <td colSpan="2" style={{ fontWeight: "bold", backgroundColor: "#4966b6", color: "white" }}>Total:</td>
                                    <td style={{ fontWeight: "bold", backgroundColor: "#4966b6", color: "white" }}>2000</td>
                                    <td style={{ fontWeight: "bold", backgroundColor: "#4966b6", color: "white" }}>2800</td>
                                    <td style={{ fontWeight: "bold", backgroundColor: "#4966b6", color: "white" }}>
                                        {totalSDSelfScore}
                                    </td>
                                    <td style={{ fontWeight: "bold", backgroundColor: "#4966b6", color: "white" }}>
                                        {totalSDROScore}
                                    </td>
                                    <td>
                                    </td>
                                </tr>
                            </tbody>

                        </table>
                    </div>
                )}

                {/* Administrative Bucket */}
                <div className="hombucket3" onClick={() => toggleBucket("admin")}>
                    Administrative Bucket
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
                                    <th style={{ backgroundColor: "#537c78" }}>Score by RO</th>
                                    <th style={{ backgroundColor: "#537c78" }}>Link for sheet</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>AB-1</td>
                                    <td>Co-curricular Activities organised</td>
                                    <td>100</td>
                                    <td>234</td>
                                    <td style={{ backgroundColor: score?.AB1 === "N/A" ? "lightcoral" : "lightgreen" }}>
                                        {score?.AB1 || "N/A"}
                                    </td>
                                    <td>
                                        {submittedForms.scores?.AB1 || "N/A"}
                                    </td>
                                    <td><button className="navigate-button" onClick={() => navigate('/AB/AB1')}>
                                        AB-1
                                    </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>AB-2</td>
                                    <td>Co-curricular Activities organised at Department and Institute level</td>
                                    <td>100</td>
                                    <td>188</td>
                                    <td style={{ backgroundColor: score?.AB2 === "N/A" ? "lightcoral" : "lightgreen" }}>
                                        {score?.AB2 || "N/A"}
                                    </td>
                                    <td >
                                        {submittedForms.scores?.AB2 || "N/A"}
                                    </td>
                                    <td>
                                        <button className="navigate-button" onClick={() => navigate('/AB/AB2')}>
                                            AB-2
                                        </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>AB-3</td>
                                    <td>Co-curricular Activities at Department and Institute level</td>
                                    <td>100</td>
                                    <td>219</td>
                                    <td style={{ backgroundColor: score?.AB3 === "N/A" ? "lightcoral" : "lightgreen" }}>
                                        {score?.AB3 || "N/A"}
                                    </td>
                                    <td>
                                        {submittedForms.scores?.AB3 || "N/A"}
                                    </td>
                                    <td><button className="navigate-button" onClick={() => navigate('/AB/AB3')}>
                                        AB-3
                                    </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>AB-4 Eng</td>
                                    <td>Organization of STTPs/ FDPs/ Workshops/ Seminars/ Refresher course/ Orientation courses/ Methodology Workshops, Training, Teaching-Learning Evaluation Technology Programmes</td>
                                    <td>100</td>
                                    <td>689</td>
                                    <td style={{ backgroundColor: score?.AB4 === "N/A" ? "lightcoral" : "lightgreen" }}>
                                        {score?.AB4 || "N/A"}
                                    </td>
                                    <td>
                                        {submittedForms.scores?.AB4 || "N/A"}
                                    </td>
                                    <td><button className="navigate-button" onClick={() => navigate('/AB/AB4')}>
                                        AB-4
                                    </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>AB-5</td>
                                    <td>Departmental Role</td>
                                    <td>50</td>
                                    <td>150</td>
                                    <td style={{ backgroundColor: score?.AB5 === "N/A" ? "lightcoral" : "lightgreen" }}>
                                        {score?.AB5 || "N/A"}
                                    </td>
                                    <td>
                                        {submittedForms.scores?.AB5 || "N/A"}
                                    </td>
                                    <td><button className="navigate-button" onClick={() => navigate('/AB/AB5')}>
                                        AB-5
                                    </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>AB-6</td>
                                    <td>Institutional committee activities</td>
                                    <td>100</td>
                                    <td>200</td>
                                    <td style={{ backgroundColor: score?.AB6 === "N/A" ? "lightcoral" : "lightgreen" }}>
                                        {score?.AB6 || "N/A"}
                                    </td>
                                    <td>
                                        {submittedForms.scores?.AB6 || "N/A"}
                                    </td>
                                    <td><button className="navigate-button" onClick={() => navigate('/AB/AB6')}>
                                        AB-6
                                    </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>AB-7</td>
                                    <td>Institutional Governance responsibilities</td>
                                    <td>100</td>
                                    <td>370</td>
                                    <td style={{ backgroundColor: score?.AB7 === "N/A" ? "lightcoral" : "lightgreen" }}>
                                        {score?.AB7 || "N/A"}
                                    </td>
                                    <td>
                                        {submittedForms.scores?.AB7 || "N/A"}
                                    </td>
                                    <td><button className="navigate-button" onClick={() => navigate('/AB/AB7')}>
                                        AB-7
                                    </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>AB-8</td>
                                    <td>Membership of Professional Bodies</td>
                                    <td>50</td>
                                    <td>150</td>
                                    <td style={{ backgroundColor: score?.AB8 === "N/A" ? "lightcoral" : "lightgreen" }}>
                                        {score?.AB8 || "N/A"}
                                    </td>
                                    <td>
                                        {submittedForms.scores?.AB8 || "N/A"}
                                    </td>
                                    <td><button className="navigate-button" onClick={() => navigate('/AB/AB8')}>
                                        AB-8
                                    </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>AB-9</td>
                                    <td>Institute branding activities</td>
                                    <td>100</td>
                                    <td>200</td>
                                    <td style={{ backgroundColor: score?.AB9 === "N/A" ? "lightcoral" : "lightgreen" }}>
                                        {score?.AB9 || "N/A"}
                                    </td>
                                    <td>
                                        {submittedForms.scores?.AB9 || "N/A"}
                                    </td>
                                    <td><button className="navigate-button" onClick={() => navigate('/AB/AB9')}>
                                        AB-9
                                    </button>
                                    </td>
                                </tr>
                                <tr style={{ fontWeight: "bold", backgroundColor: "#4966b6", color: "white" }}>
                                    <td colSpan="2" style={{ fontWeight: "bold", backgroundColor: "#4966b6", color: "white" }}>Total:</td>
                                    <td style={{ fontWeight: "bold", backgroundColor: "#4966b6", color: "white" }}>800</td>
                                    <td style={{ fontWeight: "bold", backgroundColor: "#4966b6", color: "white" }}>2400</td>
                                    <td style={{ fontWeight: "bold", backgroundColor: "#4966b6", color: "white" }}>
                                        {totalABSelfScore}
                                    </td>
                                    <td style={{ fontWeight: "bold", backgroundColor: "#4966b6", color: "white" }}>
                                        {totalABROScore}
                                    </td>
                                    <td>
                                    </td>
                                </tr>
                            </tbody>

                        </table>
                    </div>
                )}

                {/* Research Bucket */}
                <div className="hombucket4" onClick={() => toggleBucket("research")}>
                    Research Bucket
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
                                    <th style={{ backgroundColor: "#537c78" }}>Score by RO</th>
                                    <th style={{ backgroundColor: "#537c78" }}>Link for sheet</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>RB-1</td>
                                    <td>Papers Published in Conference</td>
                                    <td>50</td>
                                    <td>94</td>
                                    <td style={{ backgroundColor: score?.RB1 === "N/A" ? "lightcoral" : "lightgreen" }}>
                                        {score?.RB1 || "N/A"}
                                    </td>
                                    <td>
                                        {submittedForms.scores?.RB1 || "N/A"}
                                    </td>
                                    <td><button className="navigate-button" onClick={() => navigate('/RB/RB1')}>
                                        RB-1
                                    </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>RB-2</td>
                                    <td>Papers Published in Journal</td>
                                    <td>100</td>
                                    <td>293</td>
                                    <td style={{ backgroundColor: score?.RB2 === "N/A" ? "lightcoral" : "lightgreen" }}>
                                        {score?.RB2 || "N/A"}
                                    </td>
                                    <td >
                                        {submittedForms.scores?.RB2 || "N/A"}
                                    </td>
                                    <td>
                                        <button className="navigate-button" onClick={() => navigate('/RB/RB2')}>
                                            RB-2
                                        </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>RB-3</td>
                                    <td>Fellowship received for Conference</td>
                                    <td>50</td>
                                    <td>98</td>
                                    <td style={{ backgroundColor: score?.RB3 === "N/A" ? "lightcoral" : "lightgreen" }}>
                                        {score?.RB3 || "N/A"}
                                    </td>
                                    <td>
                                        {submittedForms.scores?.RB3 || "N/A"}
                                    </td>
                                    <td><button className="navigate-button" onClick={() => navigate('/RB/RB3')}>
                                        RB-3
                                    </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>RB-4 Eng</td>
                                    <td>Filed Patents/ Designs/Copyrights</td>
                                    <td>200</td>
                                    <td>250</td>
                                    <td style={{ backgroundColor: score?.RB4 === "N/A" ? "lightcoral" : "lightgreen" }}>
                                        {score?.RB4 || "N/A"}
                                    </td>
                                    <td>
                                        {submittedForms.scores?.RB4 || "N/A"}
                                    </td>
                                    <td><button className="navigate-button" onClick={() => navigate('/RB/RB4')}>
                                        RB-4
                                    </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>RB-5</td>
                                    <td>Qualification Upgradation</td>
                                    <td>25</td>
                                    <td>47</td>
                                    <td style={{ backgroundColor: score?.RB5 === "N/A" ? "lightcoral" : "lightgreen" }}>
                                        {score?.RB5 || "N/A"}
                                    </td>
                                    <td>
                                        {submittedForms.scores?.RB5 || "N/A"}
                                    </td>
                                    <td><button className="navigate-button" onClick={() => navigate('/RB/RB5')}>
                                        RB-5
                                    </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>RB-6</td>
                                    <td>Special Honours/Awards/Recognitions/Post-doctoral fellowships</td>
                                    <td>50</td>
                                    <td>100</td>
                                    <td style={{ backgroundColor: score?.RB6 === "N/A" ? "lightcoral" : "lightgreen" }}>
                                        {score?.RB6 || "N/A"}
                                    </td>
                                    <td>
                                        {submittedForms.scores?.RB6 || "N/A"}
                                    </td>
                                    <td><button className="navigate-button" onClick={() => navigate('/RB/RB6')}>
                                        RB-6
                                    </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>RB-7</td>
                                    <td>Published Text Books/Reference Books/Books Chapter</td>
                                    <td>100</td>
                                    <td>300</td>
                                    <td style={{ backgroundColor: score?.RB7 === "N/A" ? "lightcoral" : "lightgreen" }}>
                                        {score?.RB7 || "N/A"}
                                    </td>
                                    <td>
                                        {submittedForms.scores?.RB7 || "N/A"}
                                    </td>
                                    <td><button className="navigate-button" onClick={() => navigate('/RB/RB7')}>
                                        RB-7
                                    </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>RB-8</td>
                                    <td>Participation in STTPs/FDPs/ Workshops/ Seminars/ Symposiums/ Conferences/ Industrial Training</td>
                                    <td>50</td>
                                    <td>230</td>
                                    <td style={{ backgroundColor: score?.RB8 === "N/A" ? "lightcoral" : "lightgreen" }}>
                                        {score?.RB8 || "N/A"}
                                    </td>
                                    <td>
                                        {submittedForms.scores?.RB8 || "N/A"}
                                    </td>
                                    <td><button className="navigate-button" onClick={() => navigate('/RB/RB8')}>
                                        RB-8
                                    </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>RB-9</td>
                                    <td>Technical Presentation (Within Institute)</td>
                                    <td>25</td>
                                    <td>25</td>
                                    <td style={{ backgroundColor: score?.RB9 === "N/A" ? "lightcoral" : "lightgreen" }}>
                                        {score?.RB9 || "N/A"}
                                    </td>
                                    <td>
                                        {submittedForms.scores?.RB9 || "N/A"}
                                    </td>
                                    <td><button className="navigate-button" onClick={() => navigate('/RB/RB9')}>
                                        RB-9
                                    </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>RB-10</td>
                                    <td>Interaction with Outside world</td>
                                    <td>50</td>
                                    <td>109</td>
                                    <td style={{ backgroundColor: score?.RB10 === "N/A" ? "lightcoral" : "lightgreen" }}>
                                        {score?.RB10 || "N/A"}
                                    </td>
                                    <td>
                                        {submittedForms.scores?.RB10 || "N/A"}
                                    </td>
                                    <td><button className="navigate-button" onClick={() => navigate('/RB/RB10')}>
                                        RB-10
                                    </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>RB-11</td>
                                    <td>Resource Person (STTP/ FDP/ Workshop/ Seminar/ Webinar/ Conference/ Symposium)</td>
                                    <td>50</td>
                                    <td>164</td>
                                    <td style={{ backgroundColor: score?.RB11 === "N/A" ? "lightcoral" : "lightgreen" }}>
                                        {score?.RB11 || "N/A"}
                                    </td>
                                    <td>
                                        {submittedForms.scores?.RB11 || "N/A"}
                                    </td>
                                    <td><button className="navigate-button" onClick={() => navigate('/RB/RB11')}>
                                        RB-11
                                    </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>RB-12</td>
                                    <td>Session Chair (Conference / Symposium) or Reviewer (Conference/ Journal)</td>
                                    <td>50</td>
                                    <td>78</td>
                                    <td style={{ backgroundColor: score?.RB12 === "N/A" ? "lightcoral" : "lightgreen" }}>
                                        {score?.RB12 || "N/A"}
                                    </td>
                                    <td>
                                        {submittedForms.scores?.RB12 || "N/A"}
                                    </td>
                                    <td><button className="navigate-button" onClick={() => navigate('/RB/RB12')}>
                                        RB-12
                                    </button>
                                    </td>
                                </tr>
                                <tr style={{ fontWeight: "bold", backgroundColor: "#4966b6", color: "white" }}>
                                    <td colSpan="2" style={{ fontWeight: "bold", backgroundColor: "#4966b6", color: "white" }}>Total:</td>
                                    <td style={{ fontWeight: "bold", backgroundColor: "#4966b6", color: "white" }}>800</td>
                                    <td style={{ fontWeight: "bold", backgroundColor: "#4966b6", color: "white" }}>1788</td>
                                    <td style={{ fontWeight: "bold", backgroundColor: "#4966b6", color: "white" }}>
                                        {totalRBSelfScore}
                                    </td>
                                    <td style={{ fontWeight: "bold", backgroundColor: "#4966b6", color: "white" }}>
                                        {totalRBROScore}
                                    </td>
                                    <td>
                                    </td>
                                </tr>
                            </tbody>

                        </table>
                    </div>
                )}

                {/* Consultancy and Corporate Training Bucket */}
                <div className="hombucket5" onClick={() => toggleBucket("consultancy")}>
                    Consultancy and Corporate Training Bucket
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
                                    <th style={{ backgroundColor: "#537c78" }}>Score by RO</th>
                                    <th style={{ backgroundColor: "#537c78" }}>Link for sheet</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>CB-1</td>
                                    <td>Internal Revenue Generation (IRG)</td>
                                    <td>375</td>
                                    <td>843</td>
                                    <td style={{ backgroundColor: score?.CB1 === "N/A" ? "lightcoral" : "lightgreen" }}>
                                        {score?.CB1 || "N/A"}
                                    </td>
                                    <td>
                                        {submittedForms.scores?.CB1 || "N/A"}
                                    </td>
                                    <td><button className="navigate-button" onClick={() => navigate('/CB/CB1')}>
                                        CB-1
                                    </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>CB-2</td>
                                    <td>Expert for AICTE/NBA/NAAC/UGC/ DTE/ University etc</td>
                                    <td>50</td>
                                    <td>120</td>
                                    <td style={{ backgroundColor: score?.CB2 === "N/A" ? "lightcoral" : "lightgreen" }}>
                                        {score?.CB2 || "N/A"}
                                    </td>
                                    <td >
                                        {submittedForms.scores?.CB2 || "N/A"}
                                    </td>
                                    <td>
                                        <button className="navigate-button" onClick={() => navigate('/CB/CB2')}>
                                            CB-2
                                        </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>CB-3</td>
                                    <td>Funding Generation</td>
                                    <td>375</td>
                                    <td>843</td>
                                    <td style={{ backgroundColor: score?.CB3 === "N/A" ? "lightcoral" : "lightgreen" }}>
                                        {score?.CB3 || "N/A"}
                                    </td>
                                    <td>
                                        {submittedForms.scores?.CB3 || "N/A"}
                                    </td>
                                    <td><button className="navigate-button" onClick={() => navigate('/CB/CB3')}>
                                        CB-3
                                    </button>
                                    </td>
                                </tr>
                                <tr style={{ fontWeight: "bold", backgroundColor: "#4966b6", color: "white" }}>
                                    <td colSpan="2" style={{ fontWeight: "bold", backgroundColor: "#4966b6", color: "white" }}>Total:</td>
                                    <td style={{ fontWeight: "bold", backgroundColor: "#4966b6", color: "white" }}>800</td>
                                    <td style={{ fontWeight: "bold", backgroundColor: "#4966b6", color: "white" }}>1806</td>
                                    <td style={{ fontWeight: "bold", backgroundColor: "#4966b6", color: "white" }}>
                                        {totalCBSelfScore}
                                    </td>
                                    <td style={{ fontWeight: "bold", backgroundColor: "#4966b6", color: "white" }}>
                                        {totalCBROScore}
                                    </td>
                                    <td>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}

                <div className="hombucket6" onClick={() => toggleBucket("product")}>
                    Research Bucket
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
                                    <th style={{ backgroundColor: "#537c78" }}>Score by RO</th>
                                    <th style={{ backgroundColor: "#537c78" }}>Link for sheet</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>PDB-1</td>
                                    <td>Developing and Imparting skills/communication skills, personality development courses</td>
                                    <td>400</td>
                                    <td>480</td>
                                    <td style={{ backgroundColor: score?.PDB1 === "N/A" ? "lightcoral" : "lightgreen" }}>
                                        {score?.PDB1 || "N/A"}
                                    </td>
                                    <td>
                                        {submittedForms.scores?.PDB1 || "N/A"}
                                    </td>
                                    <td><button className="navigate-button" onClick={() => navigate('/PDB/PDB1')}>
                                        PDB-1
                                    </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>PDB-2</td>
                                    <td>Service to community (Product Development or Training)</td>
                                    <td>400</td>
                                    <td>1200</td>
                                    <td style={{ backgroundColor: score?.PDB2 === "N/A" ? "lightcoral" : "lightgreen" }}>
                                        {score?.PDB2 || "N/A"}
                                    </td>
                                    <td >
                                        {submittedForms.scores?.PDB2 || "N/A"}
                                    </td>
                                    <td>
                                        <button className="navigate-button" onClick={() => navigate('/PDB/PDB2')}>
                                            PDB-2
                                        </button>
                                    </td>
                                </tr>
                                <tr style={{ fontWeight: "bold", backgroundColor: "#4966b6", color: "white" }}>
                                    <td colSpan="2" style={{ fontWeight: "bold", backgroundColor: "#4966b6", color: "white" }}>Total:</td>
                                    <td style={{ fontWeight: "bold", backgroundColor: "#4966b6", color: "white" }}>800</td>
                                    <td style={{ fontWeight: "bold", backgroundColor: "#4966b6", color: "white" }}>1680</td>
                                    <td style={{ fontWeight: "bold", backgroundColor: "#4966b6", color: "white" }}>
                                        {totalPDBSelfScore}
                                    </td>
                                    <td style={{ fontWeight: "bold", backgroundColor: "#4966b6", color: "white" }}>
                                        {totalPDBROScore}
                                    </td>
                                    <td>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

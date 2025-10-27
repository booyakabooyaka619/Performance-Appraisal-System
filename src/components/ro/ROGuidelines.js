import React, { useEffect, useState } from "react";
import "../teacher/guidelines.css";
import { useLocation } from "react-router-dom";
import RONavbar from "./RONavbar";

export default function ROGuidelines({ user: propUser, onLogout }) {
    const location = useLocation();
    const [user, setUser] = useState(propUser || JSON.parse(localStorage.getItem("user")) || null);
    const [expandedBucket, setExpandedBucket] = useState(null); // Track which bucket is open

    useEffect(() => {
        if (location.state?.user) {
            setUser(location.state.user);
        }
    }, [location.state]);

    const guidelinesData = [
        {
            id: 1,
            title: "Performance Appraisal Categories",
            content: `The faculty performance appraisal has been designed with the key deliverables of faculty members in mind.
            This appraisal form has five categories:
            - Academic Involvement
            - Teaching & Student Development
            - Administrative Bucket
            - Research Bucket
            - Consultancy and Corporate Training Bucket
            - Product Development Bucket`,
        },
        {
            id: 2,
            title: "Elements of the Performance Appraisal Form",
            content: `There are some key elements of this appraisal form that you should be aware of:
            - Performance Category: The main category
            - Performance Parameters: Sub-category under the main category
            - Performance criteria with quality benchmarks: Standards of performance
            - Weightages: Weighting factor for standards of performance
            - Marks: Number of points allocated to a specific parameter
            - Maximum Marks: Additional bonus marks that a faculty can obtain`,
        },
        {
            id: 3,
            title: "Quality Benchmarks & Weightages",
            content:
                "Quality benchmarks and weightages have been defined for almost all performance parameters. Some parameters have absolute marks assigned.",
        },
        {
            id: 4,
            title: "Faculty Data Requirement",
            content:
                "Each faculty member must fill in data relevant to their period of performance appraisal.",
        },
        {
            id: 5,
            title: "Faculty Information Form",
            content:
                "Faculty members are required to complete the Faculty Information Sheet with their information.",
        },
        {
            id: 6,
            title: "Summary Sheet",
            content:
                "The summary sheet is linked to the entire form. Once the faculty has completed the entire form, data will be reflected in the summary sheet to view total scores.",
        },
        {
            id: 7,
            title: "Guidelines for Filling the Form",
            content: `- Fill relevant data in highlighted cells.
            - Start data entry from worksheet A1-I and continue until PDB-2.
            - Answer 'Yes' or 'No' for performance parameters before entering data.
            - If extra provisions are made, mention them in the 'Additional Work' section.
            - All parameters will be considered in final score calculation, no normalization will be applied.`,
        },
        {
            id: 8,
            title: "Score Calculation Steps",
            content: `1. Go to the relevant performance parameter sheet.
            2. Observe criteria for performance.
            3. Verify quality benchmarks and weightages.
            4. Repeat for remaining parameters.`,
        },
        {
            id: 9,
            title: "Claiming Marks",
            content:
                "Marks claimed for a performance parameter cannot be used for other parameters. Supporting documents (evidence) are required for claiming marks.",
        },
        {
            id: 10,
            title: "Course Content Learning Resources",
            content:
                "If a faculty member teaches the same subject to multiple divisions, they can claim Course Content Learning Resources marks only once.",
        },
        {
            id: 11,
            title: "Lab/Tutorial Sessions",
            content:
                "Faculty who conduct lab/tutorial sessions must consider these results in section SD-2.",
        },
    ];

    const [activeIndex, setActiveIndex] = useState(null);

    const toggleSection = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <>
            {user && <RONavbar user={user} onLogout={onLogout} />}
            <div className="guidelines-container">
                <h2 className="title">Performance Appraisal RO Guidelines</h2>
                {guidelinesData.map((item, index) => (
                    <div key={item.id} className="guideline-item">
                        <div className="guideline-header" onClick={() => toggleSection(index)}>
                            <h3>{item.title}</h3>
                            <span>{activeIndex === index ? "▲" : "▼"}</span>
                        </div>
                        {activeIndex === index && <p className="guideline-content">{item.content}</p>}
                    </div>
                ))}
            </div>
        </>
    );
}

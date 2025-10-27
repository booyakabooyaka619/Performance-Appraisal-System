import React from 'react';
import { useLocation } from 'react-router-dom';
import NewNavbar from "./NewNavbar";
import './visualization.css'

import {
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend
} from 'recharts';
import {
    BarChart, Bar, XAxis, YAxis, ResponsiveContainer as ResponsiveBar
} from 'recharts';

const cardStyle = {
    background: '#fff',
    borderRadius: '16px',
    padding: '60px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
};

const titleStyle = {
    textAlign: 'center',
    marginBottom: '20px',
    fontWeight: 'bold',
    color: '#333',
};

const centerLabelStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center',
    pointerEvents: 'none',
};

// const legendBoxStyle = {
//     position: 'absolute',
//     top: '-40px',         
//     right: '-30px',       
//     backgroundColor: '#fff',
//     border: '1px solid #ccc',
//     borderRadius: '10px',
//     padding: '10px 15px',
//     boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
//     zIndex: 10,
// };

const legendItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '6px',
};

const colorBoxStyle = {
    width: '14px',
    height: '14px',
    borderRadius: '3px',
};

export default function Visualizations({ user: propUser, onLogout }) {

    const location = useLocation();
    const {
        user,
        totalAISelfScore = 0,
        totalSDSelfScore = 0,
        totalABSelfScore = 0,
        totalRBSelfScore = 0,
        totalCBSelfScore = 0,
        totalPDBSelfScore = 0,
    } = location.state || {};

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A020F0', '#FF6666'];
    const bucketNames = ['Academic Involvement', 'Student Development', 'Administrative', 'Research', 'Consultancy', 'Product Dev.'];

    const selfScoreData = [
        { name: 'Academic Involvement', value: totalAISelfScore },
        { name: 'Student Development', value: totalSDSelfScore },
        { name: 'Administrative', value: totalABSelfScore },
        { name: 'Research', value: totalRBSelfScore },
        { name: 'Consultancy', value: totalCBSelfScore },
        { name: 'Product Dev.', value: totalPDBSelfScore },
    ];

    const maxScores = {
        AI: 7091,
        SD: 2800,
        AB: 2400,
        RB: 1788,
        CB: 1806,
        PDB: 1680,
    };

    const rawData = [
        { name: 'AI', max: 7091, self: totalAISelfScore },
        { name: 'SD', max: 2800, self: totalSDSelfScore },
        { name: 'AB', max: 2400, self: totalABSelfScore },
        { name: 'RB', max: 1788, self: totalRBSelfScore },
        { name: 'CB', max: 1806, self: totalCBSelfScore },
        { name: 'PDB', max: 1680, self: totalPDBSelfScore },
    ];

    const barChartData = rawData.map(item => ({
        name: item.name,
        self: item.self,
        remaining: Math.max(item.max - item.self, 0),
        total: item.max,
    }));


    const radarData = [
        { subject: 'AI', Score: (totalAISelfScore / maxScores.AI) * 100 },
        { subject: 'SD', Score: (totalSDSelfScore / maxScores.SD) * 100 },
        { subject: 'AB', Score: (totalABSelfScore / maxScores.AB) * 100 },
        { subject: 'RB', Score: (totalRBSelfScore / maxScores.RB) * 100 },
        { subject: 'CB', Score: (totalCBSelfScore / maxScores.CB) * 100 },
        { subject: 'PDB', Score: (totalPDBSelfScore / maxScores.PDB) * 100 },
    ];

    const totalSelfScore = selfScoreData.reduce((sum, item) => sum + item.value, 0);

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const self = payload.find(p => p.dataKey === 'self')?.value || 0;
            const remaining = payload.find(p => p.dataKey === 'remaining')?.value || 0;
            const total = self + remaining;
            return (
                <div style={{ backgroundColor: '#fff', padding: '10px', border: '1px solid #ccc' }}>
                    <p><strong>{label}</strong></p>
                    <p>Self: {self}</p>
                    <p>Remaining: {remaining}</p>
                    <p><strong>Total: {total}</strong></p>
                </div>
            );
        }
        return null;
    };


    const renderGauge = (label, percent, color) => (
        <div style={{ textAlign: 'center', margin: '10px' }}>
            <svg width={120} height={120}>
                <circle cx={60} cy={60} r={50} stroke="#eee" strokeWidth="10" fill="none" />
                <circle
                    cx={60}
                    cy={60}
                    r={50}
                    stroke={color}
                    strokeWidth="10"
                    fill="none"
                    strokeDasharray={`${Math.PI * 2 * 50 * (percent / 100)} ${Math.PI * 2 * 50}`}
                    strokeLinecap="round"
                    transform="rotate(-90 60 60)"
                />
                <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="14" fontWeight="bold">
                    {Math.round(percent)}%
                </text>
            </svg>
            <div style={{ marginTop: 4, fontWeight: 500 }}>{label}</div>
        </div>
    );

    return (
        <>
            {user && <NewNavbar user={user} onLogout={onLogout} />}
            <div style={{ padding: '30px', backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
                <h2 className="fancy-dashboard-title">

                    Performance Dashboard{user?.name ? `: ${user.name}` : ''}
                </h2>


                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                    {/* Donut Chart Card */}
                    <div style={{ ...cardStyle, position: 'relative' }}>
                        <h3 style={titleStyle}>Self Score Composition</h3>
                        <div style={{ height: 350, position: 'relative' }}>
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie
                                        data={selfScoreData}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={80}
                                        outerRadius={140}
                                        labelLine={false}
                                        label={({ cx, cy, midAngle, innerRadius, outerRadius, index }) => {
                                            const RADIAN = Math.PI / 180;
                                            const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                                            const x = cx + radius * Math.cos(-midAngle * RADIAN);
                                            const y = cy + radius * Math.sin(-midAngle * RADIAN);
                                            const initials = ['AI', 'SD', 'AB', 'RB', 'CB', 'PDB'];
                                            return (
                                                <text
                                                    x={x}
                                                    y={y}
                                                    fill="white"
                                                    textAnchor="middle"
                                                    dominantBaseline="central"
                                                    fontWeight="bold"
                                                >
                                                    {initials[index]}
                                                </text>
                                            );
                                        }}
                                    >
                                        {selfScoreData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>

                            </ResponsiveContainer>
                            <div style={centerLabelStyle}>
                                <div style={{ fontSize: '18px', fontWeight: 'bold' }}>Total</div>
                                <div style={{ fontSize: '24px', color: '#333' }}>{totalSelfScore}</div>
                            </div>
                            {/* <div style={legendBoxStyle}>
                            {bucketNames.map((name, index) => (
                                <div key={name} style={legendItemStyle}>
                                    <div style={{ ...colorBoxStyle, backgroundColor: COLORS[index % COLORS.length] }} />
                                    <span>{name}</span>
                                </div>
                            ))}
                        </div> */}
                        </div>
                    </div>

                    {/* Bar Chart Card */}
                    <div style={cardStyle}>
                        <h3 style={titleStyle}>Self vs Max Score</h3>
                        <div style={{ height: 350 }}>
                            <ResponsiveBar>
                                <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Bar dataKey="self" stackId="a" fill="#4caf50" />
                                    <Bar dataKey="remaining" stackId="a" fill="#e0e0e0" />
                                </BarChart>
                            </ResponsiveBar>

                        </div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginTop: 50 }}>
                    {/* Radar Chart Card */}
                    <div style={cardStyle}>
                        <h3 style={titleStyle}>Normalized Performance (Radar)</h3>
                        <div style={{ height: 350 }}>
                            <ResponsiveContainer>
                                <RadarChart data={radarData}>
                                    <PolarGrid />
                                    <PolarAngleAxis dataKey="subject" />
                                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                                    <Radar name="Performance" dataKey="Score" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                                    <Legend />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Gauges Card */}
                    <div style={cardStyle}>
                        <h3 style={titleStyle}>Completion % per Bucket</h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                            {renderGauge('AI', (totalAISelfScore / maxScores.AI) * 100, '#0088FE')}
                            {renderGauge('SD', (totalSDSelfScore / maxScores.SD) * 100, '#00C49F')}
                            {renderGauge('AB', (totalABSelfScore / maxScores.AB) * 100, '#FFBB28')}
                            {renderGauge('RB', (totalRBSelfScore / maxScores.RB) * 100, '#FF8042')}
                            {renderGauge('CB', (totalCBSelfScore / maxScores.CB) * 100, '#A020F0')}
                            {renderGauge('PDB', (totalPDBSelfScore / maxScores.PDB) * 100, '#FF6666')}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );




}

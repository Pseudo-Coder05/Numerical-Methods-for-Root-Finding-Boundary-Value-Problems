// import React, { useState, useEffect } from 'react';
// // --- Import Chart.js components ---
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   // LogarithmicScale, // No longer needed
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
// } from 'chart.js';
// import { Line } from 'react-chartjs-2';

// // --- Register Chart.js components ---
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   // LogarithmicScale, // No longer needed
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend
// );

// // --- Register Chart.js components ---
// ChartJS.register(
//   Legend
// );

// /**
//  * A reusable component to display a vector (list) in a clean format.
//  */
// function VectorDisplay({ title, vector }) {
//   if (!vector || vector.length === 0) return null;

//   return (
//     <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700/50 rounded-xl p-4">
//       <h3 className="text-lg font-semibold text-cyan-300 mb-2">{title}</h3>
//       <div className="font-mono text-sm space-y-1 max-h-60 overflow-y-auto pr-2">
//         {vector.map((val, idx) => (
//           <div key={idx} className="flex items-center">
//             <span className="text-gray-500 w-10 flex-shrink-0">{idx}:</span>
//             <span className="break-all">{val}</span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// /**
//  * Main Application Component
//  */
// export default function App() {
//   const [n, setN] = useState(32); // Default order as requested
//   const [etaMax, setEtaMax] = useState(6.0); // Default "finite infinity"
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [results, setResults] = useState(null);
//   const [activeTab, setActiveTab] = useState('plot');

//   const handleCalculate = async () => {
//     setIsLoading(true);
//     setError(null);
//     setResults(null);
//     setActiveTab('plot');

//     try {
//       const response = await fetch(`http://127.0.0.1:5000/api/solve-heat-ode`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ n: n, eta_max: etaMax }),
//       });
//       const data = await response.json();
//       if (!response.ok) {
//         throw new Error(data.error || 'An unknown error occurred.');
//       }
//       setResults(data);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Trigger calculation on initial load
//   useEffect(() => {
//     handleCalculate();
//   }, []);

//   const tabs = [
//     { id: 'plot', label: 'Solution Plot' },
//     { id: 'data', label: 'Solution Data' },
//   ];
  
//   // --- MODIFIED: Chart.js data and options ---
//   const chartData = {
//     labels: results?.plot_data?.map(d => d.x.toFixed(4)) || [],
//     datasets: [
//       {
//         label: 'Numerical Solution (Collocation)',
//         data: results?.plot_data?.map(d => d.y_num) || [],
//         borderColor: 'rgba(56, 189, 248, 1)',
//         backgroundColor: 'rgba(56, 189, 248, 0.6)',
//         tension: 0.1,
//         yAxisID: 'y', // Main y-axis
//       },
//       {
//         label: 'Analytical Solution (erf)',
//         data: results?.plot_data?.map(d => d.y_ana) || [],
//         borderColor: 'rgba(192, 75, 75, 1)',
//         backgroundColor: 'rgba(192, 75, 75, 0.6)',
//         borderDash: [5, 5],
//         yAxisID: 'y', // Main y-axis
//       },
//       // --- REMOVED 'Absolute Error' dataset ---
//     ]
//   };
  
//   const chartOptions = {
//     responsive: true,
//     scales: {
//       x: {
//         title: { text: 'Eta (η)', display: true, color: '#9ca3af' },
//         ticks: { color: '#9ca3af', maxTicksLimit: 10 },
//         grid: { color: 'rgba(156, 163, 175, 0.1)' }
//       },
//       y: { // Main y-axis (for solutions)
//         type: 'linear',
//         position: 'left',
//         title: { text: 'f(η)', display: true, color: '#9ca3af' },
//         ticks: { color: '#9ca3af' },
//         grid: { color: 'rgba(156, 163, 175, 0.1)' }
//       },
//       // --- REMOVED y_error axis ---
//     },
//     plugins: {
//       legend: { labels: { color: '#9ca3af' } },
//       tooltip: {
//         callbacks: {
//           title: (tooltipItems) => `η = ${tooltipItems[0].label}`
//         }
//       }
//     },
//     interaction: {
//       intersect: false,
//       mode: 'index',
//     },
//   };
//   // --- END MODIFICATION ---

//   return (
//     <div className="min-h-screen bg-gray-900 p-4 md:p-10 font-sans text-gray-200">
//       <div className="max-w-7xl mx-auto">
//         {/* --- Header --- */}
//         <header className="text-center mb-10">
//           <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
//             ODE Solver: Heat Equation
//           </h1>
//           <p className="text-lg text-gray-400 mt-2">
//             Solving f''(η) + 2ηf'(η) = 0 with n=32 Gauss-Legendre Collocation
//           </p>
//         </header>

//         {/* --- Controls --- */}
//         <div className="flex flex-col md:flex-row justify-center items-center gap-4 p-6 bg-gray-800/50 backdrop-blur-lg border border-gray-700/50 rounded-2xl shadow-xl max-w-2xl mx-auto mb-10">
//           <label htmlFor="order-n" className="text-lg font-medium text-gray-300">
//             Order (n):
//           </label>
//           <input
//             type="number"
//             id="order-n"
//             value={n}
//             onChange={(e) => setN(Number(e.target.value))}
//             min="3"
//             max="64"
//             className="p-2 w-24 text-center bg-gray-900 border border-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:outline-none"
//           />
//            <label htmlFor="eta-max" className="text-lg font-medium text-gray-300">
//             "Finite Infinity" (η_max):
//           </label>
//           <input
//             type="number"
//             id="eta-max"
//             value={etaMax}
//             onChange={(e) => setEtaMax(Number(e.target.value))}
//             min="2"
//             max="10"
//             step="0.5"
//             className="p-2 w-24 text-center bg-gray-900 border border-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:outline-none"
//           />
//           <button
//             onClick={handleCalculate}
//             disabled={isLoading}
//             className="w-full md:w-auto bg-cyan-600 text-white font-bold py-3 px-6 rounded-lg transition duration-200 hover:bg-cyan-500 disabled:bg-gray-600 disabled:opacity-50"
//           >
//             {isLoading ? 'Calculating...' : 'Re-Calculate'}
//           </button>
//         </div>

//         {/* --- Results Display --- */}
//         {error && (
//           <div className="text-center text-red-400 p-4 bg-red-900/50 rounded-lg max-w-2xl mx-auto">
//             <strong>Error:</strong> {error}
//           </div>
//         )}

//         {results && (
//           <div className="animate-fade-in">
//             {/* --- Stats Bar (Unchanged) --- */}
//             <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-6 text-center">
//               <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
//                 <div className="text-sm text-gray-400">Order (n)</div>
//                 <div className="text-2xl font-bold text-purple-400">{results.n}</div>
//               </div>
//                <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
//                 <div className="text-sm text-gray-400">η_max</div>
//                 <div className="text-2xl font-bold text-purple-400">{results.eta_max}</div>
//               </div>
//               <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
//                 <div className="text-sm text-gray-400">Max Absolute Error</div>
//                 <div className="text-2xl font-bold text-yellow-400">{results.max_error.toExponential(4)}</div>
//               </div>
//               <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
//                 <div className="text-sm text-gray-400">RMS Error</div>
//                 <div className="text-2xl font-bold text-yellow-400">{results.rms_error.toExponential(4)}</div>
//               </div>
//             </div>

//             {/* --- Tabs --- */}
//             <div className="flex justify-center border-b border-gray-700 mb-6">
//               {tabs?.map(tab => (
//                 <button
//                   key={tab.id}
//                   onClick={() => setActiveTab(tab.id)}
//                   className={`py-2 px-4 font-semibold ${
//                     activeTab === tab.id
//                       ? 'text-cyan-400 border-b-2 border-cyan-400'
//                       : 'text-gray-500'
//                   }`}
//                 >
//                   {tab.label}
//                 </button>
//               ))}
//             </div>

//             {/* --- Tab Content --- */}
//             <div className="p-4">
//               {activeTab === 'plot' && (
//                 <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700/50 rounded-xl p-4 max-w-4xl mx-auto">
//                   <Line data={chartData} options={chartOptions} />
//                 </div>
//               )}
//               {activeTab === 'data' && (
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                   <VectorDisplay
//                     title="Nodes (η_i)"
//                     vector={results.nodes_eta}
//                   />
//                   <VectorDisplay
//                     title="Numerical f(η)"
//                     vector={results.f_numerical}
//                   />
//                   <VectorDisplay
//                     title="Analytical f(η)"
//                     vector={results.f_analytical}
//                   />
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
// import React, { useState, useEffect, useRef } from 'react';
// import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
// // --- NEW: Import Chart.js components ---
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
// } from 'chart.js';
// import { Line } from 'react-chartjs-2';

// // --- NEW: Register Chart.js components ---
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend
// );

// // --- Embedded CSS for the entire application ---
// const AppStyles = () => (
//     <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Poppins:wght@300;400;500;600;700&display=swap');

//         :root {
//             --color-bg: #111119;
//             --color-surface: #1d1d27;
//             --color-border: #333344;
//             --color-text-primary: #f0f0f5;
//             --color-text-secondary: #a0a0b9;
            
//             --color-q1: #00f0ff; /* Cyan */
//             --color-q2: #a78bfa; /* Purple */
//             --color-q3: #34d399; /* Green */
//             --color-q4: #fcb045; /* Orange */
//         }

//         body {
//             margin: 0;
//             font-family: 'Poppins', sans-serif;
//             background-color: var(--color-bg);
//             color: var(--color-text-primary);
//             overflow-x: hidden;
//         }

//         /* --- Main Hub Page Styles --- */
//         .hub-container {
//             display: flex;
//             flex-direction: column;
//             align-items: center;
//             justify-content: center;
//             min-height: 100vh;
//             padding: 2rem;
//             box-sizing: border-box;
//             overflow: hidden;
//         }

//         .hub-header {
//             text-align: center;
//             margin-bottom: 2rem;
//             z-index: 10;
//         }

//         .hub-header h1 {
//             font-family: 'Orbitron', sans-serif;
//             font-size: 3rem;
//             font-weight: 700;
//             color: white;
//             text-shadow: 0 0 10px var(--color-q1), 0 0 20px var(--color-q1);
//         }

//         .dial-system {
//             display: flex;
//             flex-direction: column;
//             align-items: center;
//             gap: 2rem;
//         }

//         .dial-container {
//             position: relative;
//             width: 500px;
//             height: 500px;
//             display: flex;
//             justify-content: center;
//             align-items: center;
//         }

//         .dial {
//             width: 100%;
//             height: 100%;
//             position: relative;
//             border-radius: 50%;
//             border: 2px solid var(--color-border);
//             transition: transform 0.7s cubic-bezier(0.68, -0.55, 0.27, 1.55);
//             background: radial-gradient(circle at center, var(--color-surface) 0%, var(--color-bg) 70%);
//         }

//         .dial-center {
//             width: 100px;
//             height: 100px;
//             background: var(--color-bg);
//             border: 10px solid var(--color-border);
//             border-radius: 50%;
//             position: absolute;
//             z-index: 5;
//             box-shadow: 0 0 20px #000;
//         }

//         .dial-node {
//             position: absolute;
//             top: 50%;
//             left: 50%;
//             width: 100px;
//             height: 100px;
//             margin: -50px;
//             border-radius: 50%;
//             display: flex;
//             justify-content: center;
//             align-items: center;
//             cursor: pointer;
//             transition: all 0.5s ease;
//             z-index: 10;
//         }

//         .node-content {
//             width: 80px;
//             height: 80px;
//             background: var(--color-surface);
//             border-radius: 50%;
//             display: flex;
//             justify-content: center;
//             align-items: center;
//             font-family: 'Orbitron', sans-serif;
//             font-size: 1.5rem;
//             font-weight: 700;
//             border: 4px solid var(--color-border);
//             transition: all 0.3s ease;
//             box-shadow: 0 0 10px #000;
//         }

//         /* Assigning colors and positions to nodes */
//         .dial-node:nth-child(1) { transform: rotate(0deg) translateY(-220px); --node-color: var(--color-q1); }
//         .dial-node:nth-child(2) { transform: rotate(90deg) translateY(-220px); --node-color: var(--color-q2); }
//         .dial-node:nth-child(3) { transform: rotate(180deg) translateY(-220px); --node-color: var(--color-q3); }
//         .dial-node:nth-child(4) { transform: rotate(270deg) translateY(-220px); --node-color: var(--color-q4); }

//         .dial-node .node-content {
//             color: var(--node-color);
//             border-color: var(--node-color);
//             text-shadow: 0 0 5px var(--node-color);
//         }

//         /* Active state */
//         .dial-node.active .node-content {
//             background: var(--node-color);
//             color: var(--color-bg);
//             transform: scale(1.2);
//             box-shadow: 0 0 20px var(--node-color), 0 0 40px var(--node-color);
//         }

//         .dial-indicator {
//             position: absolute;
//             top: 10px;
//             left: 50%;
//             transform: translateX(-50%);
//             width: 0;
//             height: 0;
//             border-left: 10px solid transparent;
//             border-right: 10px solid transparent;
//             border-top: 15px solid var(--color-q1); /* Indicator color */
//             z-index: 20;
//             transition: border-top-color 0.5s ease;
//         }

//         .info-panel {
//             background: var(--color-surface);
//             border: 1px solid var(--color-border);
//             padding: 2rem;
//             border-radius: 16px;
//             width: 100%;
//             max-width: 500px;
//             text-align: center;
//             box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
//             z-index: 10;
//         }

//         .info-panel h2 {
//             font-family: 'Orbitron', sans-serif;
//             font-size: 2rem;
//             margin: 0 0 1rem 0;
//             color: var(--active-color);
//             transition: color 0.5s ease;
//         }

//         .info-panel p {
//             color: var(--color-text-secondary);
//             font-size: 1.1rem;
//             line-height: 1.6;
//             min-height: 80px; /* Prevent layout shift */
//         }
        
//         .hub-button {
//             font-family: 'Poppins', sans-serif;
//             font-weight: 600;
//             font-size: 1rem;
//             padding: 0.8rem 2rem;
//             border-radius: 8px;
//             border: none;
//             cursor: pointer;
//             transition: all 0.3s ease;
//             background: var(--active-color);
//             color: var(--color-bg);
//             box-shadow: 0 0 15px var(--active-color);
//         }
//         .hub-button:hover {
//             transform: scale(1.05);
//         }

//         /* --- Question Page Styles --- */
//         .question-page {
//             width: 100%;
//             min-height: 100vh;
//             padding: 2rem;
//             box-sizing: border-box;
//             animation: fadeIn 0.5s ease;
//         }
//         .back-button {
//             position: absolute;
//             top: 2rem;
//             left: 2rem;
//             font-size: 1rem;
//             font-weight: 500;
//             color: var(--color-text-secondary);
//             text-decoration: none;
//             padding: 0.5rem 1rem;
//             background: var(--color-surface);
//             border: 1px solid var(--color-border);
//             border-radius: 8px;
//             transition: all 0.2s ease;
//             z-index: 100;
//         }
//         .back-button:hover {
//             background: var(--color-border);
//             color: var(--color-text-primary);
//         }

//         @keyframes fadeIn {
//             from { opacity: 0; } to { opacity: 1; }
//         }

//         /* --- Scoped Styles for Harshad Assignment --- */
//         .harshad-page .harshad-container {
//             max-width: 6xl;
//             margin: 0 auto;
//             padding-top: 4rem; /* Make space for back button */
//         }
//         .harshad-page .harshad-header { text-align: center; margin-bottom: 3rem; }
//         .harshad-page .harshad-header h1 {
//             font-size: 2.5rem;
//             md:font-size: 3rem;
//             font-weight: 700;
//             color: transparent;
//             background-clip: text;
//             background-image: linear-gradient(to right, var(--color-q2), var(--color-q1));
//         }
//         .harshad-page .harshad-header p { font-size: 1.1rem; color: var(--color-text-secondary); margin-top: 0.5rem; }
        
//         .harshad-page .harshad-grid {
//             display: grid;
//             grid-template-columns: 1fr;
//             gap: 2rem;
//         }
//         @media (min-width: 768px) { .harshad-page .harshad-grid { grid-template-columns: repeat(2, 1fr); } }

//         .harshad-page .harshad-card {
//             background: var(--color-surface);
//             backdrop-filter: blur(10px);
//             border: 1px solid var(--color-border);
//             border-radius: 1rem;
//             box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
//             padding: 1.5rem;
//             transition: all 0.3s ease;
//         }
//         .harshad-page .harshad-card:hover {
//             box-shadow: 0 0 20px var(--card-hover-color, var(--color-border));
//         }

//         .harshad-page .harshad-card h2 {
//             font-size: 1.5rem;
//             font-weight: 600;
//             margin-bottom: 1rem;
//             color: var(--card-color);
//         }
//         .harshad-page .harshad-card p {
//             color: var(--color-text-secondary);
//             margin-bottom: 1.5rem;
//         }
//         .harshad-page .harshad-card-1 { --card-color: var(--color-q1); --card-hover-color: var(--color-q1); }
//         .harshad-page .harshad-card-2 { --card-color: var(--color-q2); --card-hover-color: var(--color-q2); }
//         .harshad-page .harshad-card-3 { --card-color: #f472b6; --card-hover-color: #f472b6; } /* Pink */
//         @media (min-width: 768px) { .harshad-page .harshad-card-3 { grid-column: span 2; } }

//         .harshad-page .input-row {
//             display: flex;
//             gap: 0.75rem;
//             margin-bottom: 1.5rem;
//         }
//         .harshad-page .input-field {
//             flex-grow: 1;
//             padding: 0.75rem 1rem;
//             background: var(--color-bg);
//             border: 1px solid var(--color-border);
//             border-radius: 8px;
//             color: var(--color-text-primary);
//             font-family: 'Poppins', sans-serif;
//             font-size: 1rem;
//         }
//         .harshad-page .input-field:focus {
//             outline: none;
//             border-color: var(--card-color);
//             box-shadow: 0 0 10px var(--card-color);
//         }
//         .harshad-page .input-field-small {
//             width: 60px;
//             flex-grow: 0;
//         }

//         .harshad-page .harshad-button {
//             width: 100%;
//             background: var(--card-color);
//             color: var(--color-bg);
//             font-weight: 600;
//             padding: 0.75rem 1rem;
//             border: none;
//             border-radius: 8px;
//             cursor: pointer;
//             transition: all 0.2s ease;
//         }
//         .harshad-page .harshad-button:disabled {
//             background: var(--color-border);
//             opacity: 0.5;
//             cursor: not-allowed;
//         }
//         .harshad-page .harshad-button:hover:not(:disabled) {
//             transform: scale(1.02);
//             box-shadow: 0 0 15px var(--card-color);
//         }

//         .harshad-page .result-box {
//             margin-top: 1.5rem;
//             background: var(--color-bg);
//             border: 1px solid var(--color-border);
//             padding: 1rem;
//             border-radius: 8px;
//             animation: fadeIn 0.5s ease-out;
//         }
//         .harshad-page .result-box h3 {
//             color: var(--card-color);
//             font-weight: 600;
//             margin: 0 0 0.5rem 0;
//         }
//         .harshad-page .result-box p {
//             color: var(--color-text-secondary);
//             margin: 0.25rem 0;
//         }
//         .harshad-page .result-box .result-number {
//             font-family: 'Roboto Mono', monospace;
//             font-size: 1.1rem;
//             color: var(--color-text-primary);
//             word-break: break-all;
//         }

//         .harshad-page .result-box .fact-item {
//             border-bottom: 1px solid var(--color-border);
//             padding: 1rem 0;
//         }
//         .harshad-page .result-box .fact-item:first-child { padding-top: 0; }
//         .harshad-page .result-box .fact-item:last-child { border-bottom: none; padding-bottom: 0; }
//         .harshad-page .result-box .fact-item h4 {
//             color: var(--card-color);
//             font-weight: 600;
//             margin: 0;
//         }
//         .harshad-page .result-box .fact-item .fact-details {
//             font-family: 'Roboto Mono', monospace;
//             font-size: 0.9rem;
//             color: var(--color-text-secondary);
//             word-break: break-all;
//         }
//         .harshad-page .result-box .fact-item dl {
//             margin: 0.5rem 0 0 0;
//             display: grid;
//             grid-template-columns: 120px 1fr;
//             gap: 0.25rem;
//         }
//         .harshad-page .result-box .fact-item dt { color: var(--color-text-secondary); }
//         .harshad-page .result-box .fact-item dd { color: var(--color-text-primary); font-weight: 500; }
//         .harshad-page .result-box .fact-item .fact-fail { color: #f472b6; font-weight: 600; }
        
//         .harshad-page .error-box {
//             margin-top: 1.5rem;
//             background: rgba(220, 38, 38, 0.1);
//             border: 1px solid #ef4444;
//             color: #f87171;
//             padding: 1rem;
//             border-radius: 8px;
//             text-align: center;
//         }

//         .harshad-page .explanation-box {
//             font-family: 'Poppins', sans-serif;
//             font-size: 1rem;
//             color: var(--color-text-secondary);
//             line-height: 1.7;
//         }
//         .harshad-page .explanation-box h3 {
//             color: #f472b6;
//             font-weight: 600;
//             font-size: 1.25rem;
//             margin-bottom: 1.5rem;
//         }
//         .harshad-page .explanation-box strong {
//             font-weight: 600;
//             color: #f472b6;
//         }
//         .harshad-page .explanation-box code {
//             font-family: 'Roboto Mono', monospace;
//             color: var(--color-q1);
//             background: rgba(0, 240, 255, 0.1);
//             padding: 0.2rem 0.4rem;
//             border-radius: 4px;
//         }
//         .harshad-page .explanation-box .list-item {
//             display: flex;
//             align-items: flex-start;
//             margin-bottom: 1rem;
//         }
//         .harshad-page .explanation-box .list-number {
//             font-weight: 600;
//             color: #f472b6;
//             margin-right: 0.75rem;
//         }
//         .harshad-page .explanation-box .list-item-sub {
//             display: flex;
//             align-items: flex-start;
//             margin-left: 2rem;
//             margin-top: 0.75rem;
//         }
//         .harshad-page .explanation-box .list-bullet {
//             color: var(--color-q1);
//             margin-right: 0.75rem;
//             font-weight: 700;
//         }

//         /* --- Scoped Styles for Heat Equation --- */
//         .heat-page {
//             font-family: 'Poppins', sans-serif;
//             background-color: var(--color-bg);
//             color: var(--color-text-primary);
//         }
//         .heat-page .heat-container {
//             max-width: 7xl; /* 1280px */
//             margin: 0 auto;
//             padding-top: 4rem; /* Make space for back button */
//         }
//         .heat-page .heat-header { text-align: center; margin-bottom: 2.5rem; }
//         .heat-page .heat-header h1 {
//             font-size: 2.5rem;
//             md:font-size: 3rem;
//             font-weight: 700;
//             color: transparent;
//             background-clip: text;
//             background-image: linear-gradient(to right, var(--color-q2), var(--color-q4));
//         }
//         .heat-page .heat-header p {
//             font-size: 1.1rem;
//             color: var(--color-text-secondary);
//             margin-top: 0.5rem;
//         }
//         .heat-page .heat-controls {
//             display: flex;
//             flex-direction: column;
//             gap: 1rem;
//             padding: 1.5rem;
//             background: var(--color-surface);
//             border: 1px solid var(--color-border);
//             border-radius: 1rem;
//             box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
//             max-width: 42rem; /* max-w-2xl */
//             margin: 0 auto 2.5rem auto;
//         }
//         @media (min-width: 768px) { .heat-page .heat-controls { flex-direction: row; justify-content: center; align-items: center; gap: 1.5rem; } }
        
//         .heat-page .heat-controls label {
//             font-weight: 500;
//             color: var(--color-text-secondary);
//         }
//         .heat-page .heat-controls input {
//             padding: 0.5rem 0.75rem;
//             width: 80px;
//             text-align: center;
//             background: var(--color-bg);
//             border: 1px solid var(--color-border);
//             border-radius: 8px;
//             color: var(--color-text-primary);
//         }
//         .heat-page .heat-controls .heat-button {
//             background: var(--color-q1);
//             color: var(--color-bg);
//             font-weight: 600;
//             padding: 0.5rem 1.5rem;
//             border: none;
//             border-radius: 8px;
//             cursor: pointer;
//             transition: all 0.2s ease;
//         }
//         .heat-page .heat-controls .heat-button:disabled {
//             background: var(--color-border);
//             opacity: 0.5;
//             cursor: not-allowed;
//         }
//         .heat-page .heat-controls .heat-button:hover:not(:disabled) {
//             transform: scale(1.05);
//             box-shadow: 0 0 15px var(--color-q1);
//         }
        
//         .heat-page .heat-tabs {
//             display: flex;
//             justify-content: center;
//             border-bottom: 1px solid var(--color-border);
//             margin-bottom: 1.5rem;
//         }
//         .heat-page .heat-tab-button {
//             padding: 0.5rem 1rem;
//             font-weight: 500;
//             cursor: pointer;
//             border: none;
//             background: none;
//             color: var(--color-text-secondary);
//             border-bottom: 2px solid transparent;
//         }
//         .heat-page .heat-tab-button.active {
//             color: var(--color-q1);
//             border-bottom-color: var(--color-q1);
//         }
        
//         .heat-page .heat-tab-content { padding: 1rem; }
//         .heat-page .heat-chart-container {
//             background: var(--color-surface);
//             border: 1px solid var(--color-border);
//             border-radius: 1rem;
//             padding: 1.5rem;
//             max-width: 56rem; /* max-w-4xl */
//             margin: 0 auto;
//         }
//         .heat-page .heat-data-grid {
//             display: grid;
//             grid-template-columns: 1fr;
//             gap: 1.5rem;
//         }
//         @media (min-width: 1024px) { .heat-page .heat-data-grid { grid-template-columns: repeat(3, 1fr); } }
        
//         .heat-page .vector-display {
//             background: var(--color-surface);
//             border: 1px solid var(--color-border);
//             border-radius: 1rem;
//             padding: 1.5rem;
//         }
//         .heat-page .vector-display h3 {
//             font-size: 1.25rem;
//             font-weight: 600;
//             color: var(--color-q1);
//             margin: 0 0 1rem 0;
//         }
//         .heat-page .vector-display-list {
//             font-family: 'Roboto Mono', monospace;
//             font-size: 0.9rem;
//             max-height: 24rem; /* 384px */
//             overflow-y: auto;
//             padding-right: 0.5rem;
//         }
//         .heat-page .vector-display-list div {
//             display: flex;
//         }
//         .heat-page .vector-display-list span:first-child {
//             color: var(--color-text-secondary);
//             width: 4rem;
//             flex-shrink: 0;
//         }
//         .heat-page .vector-display-list span:last-child {
//             word-break: break-all;
//         }
//         .heat-page .heat-error {
//             text-align: center;
//             color: #f87171;
//             padding: 1rem;
//             background: rgba(220, 38, 38, 0.1);
//             border: 1px solid #ef4444;
//             border-radius: 1rem;
//             max-width: 42rem;
//             margin: 0 auto;
//         }
//         .heat-page .heat-loading {
//             text-align: center;
//             padding: 4rem;
//             font-size: 1.25rem;
//             color: var(--color-text-secondary);
//         }

//     `}</style>
// );

// // --- Component for Question 1: Harshad Numbers ---
// const HarshadComponent = () => {
//   // State for Factorial Harshad
//   const [factResult, setFactResult] = useState(null);
//   const [isFactLoading, setIsFactLoading] = useState(false);
//   const [factError, setFactError] = useState(null);
//   const [factStart, setFactStart] = useState('1');
//   const [factEnd, setFactEnd] = useState('100'); 
//   const [consecResult, setConsecResult] = useState(null);
//   const [isConsecLoading, setIsConsecLoading] = useState(false);
//   const [consecStart, setConsecStart] = useState('920067411130599');
//   const [consecCount, setConsecCount] = useState('11'); 
//   const [consecError, setConsecError] = useState(null);
//   const [showExplanation, setShowExplanation] = useState(false);
//   const API_URL = 'http://127.0.0.1:5000/api/harshad';

//   const findFactorialHarshad = async () => {
//     setIsFactLoading(true);
//     setFactError(null);
//     setFactResult(null);
//     try {
//       const response = await fetch(`${API_URL}/factorial`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           start: parseInt(factStart, 10) || 1,
//           end: parseInt(factEnd, 10) || 1
//         }),
//       });
//       const data = await response.json(); 
//       if (!response.ok) throw new Error(data.message || 'Server responded with an error');
//       setFactResult(data); 
//     } catch (err) {
//       console.error(err);
//       setFactError(err.message || 'Connection error. Is the backend server running?');
//     } finally {
//       setIsFactLoading(false);
//     }
//   };

//   const findConsecutiveHarshad = async () => {
//     setIsConsecLoading(true);
//     setConsecError(null);
//     setConsecResult(null);
//     try {
//       const response = await fetch(`${API_URL}/consecutive`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ 
//           start: consecStart || '1', 
//           n: parseInt(consecCount, 10) || 10
//         }),
//       });
//       const data = await response.json();
//       if (!response.ok) throw new Error(data.message || 'Server responded with an error');
//       setConsecResult(data);
//     } catch (err) {
//       console.error(err);
//       setConsecError(err.message || 'Connection error. Is the backend server running?');
//     } finally {
//       setIsConsecLoading(false);
//     }
//   };
  
//   const handleExplanation = () => { setShowExplanation(!showExplanation); };

//   // --- Explanation Renderer (using RenderExplanation component) ---
//   const explanationText = `
// **Why are there no 21 consecutive Harshad numbers?**

// This is a fascinating proof in number theory, first shown by H.G. Grundman in 1994. Here's a simplified breakdown:

// 1.  **The Core Idea:** The proof relies on how the **sum of digits** behaves, especially when a number 'rolls over' (like from 199 to 200).
// 2.  **Digit Sum Modulo 9:** A key property is that any number \`n\` has the same remainder as its digit sum \`s(n)\` when divided by 9. (e.g., \`n = 123\`, \`s(n) = 6\`. \`123 % 9 = 6\` and \`6 % 9 = 6\`). This is written as \`n ≡ s(n) (mod 9)\`.
// 3.  **The Harshad Property:** For a number \`n\` to be Harshad, it must be divisible by its digit sum \`s(n)\`. This means \`n % s(n) == 0\`.
// 4.  **The Contradiction:** Grundman's proof looks at a sequence of 21 consecutive numbers. Such a sequence *must* contain a number ending in 9 (like \`...9\`) and another ending in 0 (like \`...0\`).
//     * Consider a number \`n\` in the sequence that ends in 9, like \`n = 199\`. \`s(n) = 19\`.
//     * The next number is \`n + 1 = 200\`. \`s(n + 1) = 2\`.
//     * The digit sum drops dramatically (from 19 to 2).
//     * The proof shows that in *any* sequence of 21 numbers, there will be a number \`n\` such that the digit sum of \`n+1\` (i.e., \`s(n+1)\`) is *much smaller* than the digit sum of \`n\` (i.e., \`s(n)\`).
//     * It's mathematically shown that in such a sequence, at least one of the numbers *cannot* be divisible by its digit sum, breaking the consecutive chain. The 'jump' in digit sums at a 'rollover' point (like 999 to 1000) makes it impossible for all 21 numbers to satisfy the Harshad property.
//   `;
  
//   const RenderExplanation = ({ text }) => {
//     const lines = text.trim().split('\n');

//     const renderLine = (line) => {
//       // This will handle **bold** and `code`
//       const parts = line.split(/(\*\*.*?\*\*|`.*?`)/g).filter(Boolean);
//       return parts.map((part, i) => {
//         if (part.startsWith('**') && part.endsWith('**')) {
//           return <strong key={i} className="font-semibold text-pink-400">{part.slice(2, -2)}</strong>;
//         }
//         if (part.startsWith('`') && part.endsWith('`')) {
//           return <code key={i} className="text-cyan-400 font-mono bg-gray-700/50 px-1.5 py-0.5 rounded-md text-sm">{part.slice(1, -1)}</code>;
//         }
//         return <span key={i}>{part}</span>;
//       });
//     };

//     return (
//       <div className="text-gray-300 leading-relaxed text-left">
//         {lines.map((line, index) => {
//           if (line.trim() === '') {
//             return <div key={index} className="h-4" />; // Spacer
//           }
//           if (line.startsWith('**Why')) {
//             return <h3 key={index} className="font-bold text-pink-300 mb-5 text-lg">{renderLine(line)}</h3>;
//           }
//           if (line.match(/^\d+\.\s/)) {
//             return <div key={index} className="flex items-start mb-4">
//               <span className="text-pink-400 font-semibold mr-3">{line.match(/^\d+\./)[0]}</span>
//               <p className="flex-1 -mt-1 text-gray-300 leading-relaxed">{renderLine(line.replace(/^\d+\.\s/, ''))}</p>
//             </div>
//           }
//           if (line.match(/^\s*\*\s/)) {
//             return <div key={index} className="flex items-start mb-3 ml-8">
//               <span className="text-cyan-400 font-bold mr-3">•</span>
//               <p className="flex-1 -mt-1 text-gray-300 leading-relaxed">{renderLine(line.replace(/^\s*\*\s/, ''))}</p>
//             </div>
//           }
//           return <p key={index} className="mb-4 text-gray-400">{renderLine(line)}</p>;
//         })}
//       </div>
//     );
//   };

//   return (
//     <div className="harshad-page">
//       <div className="harshad-container">
//         <header className="harshad-header">
//           <h1>Harshad Number Explorer</h1>
//           <p>Exploring strange properties of numbers divisible by their digit sum.</p>
//         </header>
//         <div className="harshad-grid">
//           {/* Card 1: Factorial Harshad */}
//           <div className="harshad-card harshad-card-1">
//             <h2>Factorials that are NOT Harshad</h2>
//             <p>Find all factorials (n!) in a given range that are not Harshad numbers.</p>
//             <div className="input-row">
//               <input type="number" value={factStart} onChange={(e) => setFactStart(e.target.value)} className="input-field" placeholder="Start n" />
//               <input type="number" value={factEnd} onChange={(e) => setFactEnd(e.target.value)} className="input-field" placeholder="End n" />
//             </div>
//             <button onClick={findFactorialHarshad} disabled={isFactLoading} className="harshad-button">
//               {isFactLoading ? 'Calculating...' : 'Search Range'}
//             </button>
//             {factResult && factResult.status === 'found' && (
//               <div className="result-box">
//                 <h3>Found {factResult.results.length} non-Harshad factorial(s):</h3>
//                 {factResult.results.map((result, index) => (
//                   <div key={result.n} className="fact-item">
//                     <h4>n = {result.n}</h4>
//                     <p className="fact-details">{result.n}! has {result.digits} digits. ({result.factorial_str})</p>
//                     <dl>
//                       <dt>Sum of Digits:</dt><dd>{result.digit_sum.toLocaleString()}</dd>
//                       <dt>Factorial / Sum:</dt><dd>{result.division_result_str}</dd>
//                       <dt>Is Harshad?</dt><dd className="fact-fail">No</dd>
//                     </dl>
//                   </div>
//                 ))}
//               </div>
//             )}
//             {factResult && factResult.status === 'none_found' && (
//               <div className="result-box"><p>{factResult.message}</p></div>
//             )}
//             {factError && (
//               <div className="error-box">{factError}</div>
//             )}
//           </div>
//           {/* Card 2: Consecutive Harshad */}
//           <div className="harshad-card harshad-card-2">
//             <h2>N Consecutive Harshad Numbers</h2>
//             <p>Find the first sequence of N consecutive Harshad numbers, starting from... (max N=20).</p>
//             <div className="input-row">
//                  <input
//                     type="number"
//                     value={consecCount}
//                     onChange={(e) => setConsecCount(e.target.value)}
//                     className="input-field input-field-small"
//                     placeholder="N"
//                     min="1" max="20"
//                 />
//                  <input
//                     type="text" 
//                     value={consecStart}
//                     onChange={(e) => setConsecStart(e.target.value)}
//                     className="input-field"
//                     placeholder="Start search from"
//                 />
//             </div>
//             <button onClick={findConsecutiveHarshad} disabled={isConsecLoading} className="harshad-button">
//               {isConsecLoading ? 'Searching...' : 'Find Sequence'}
//             </button>
//             {consecResult && consecResult.status === 'found' && (
//               <div className="result-box">
//                 <h3>Found Sequence of {consecResult.count}!</h3>
//                 <p>The first number in the sequence is:</p>
//                 <p className="result-number">{consecResult.first_number}</p>
//               </div>
//             )}
//             {consecResult && consecResult.status === 'not_found' && (
//               <div className="result-box"><p>{consecResult.message}</p></div>
//             )}
//             {consecError && (
//               <div className="error-box">{consecError}</div>
//             )}
//           </div>
//           {/* Card 3: Bonus Explanation */}
//           <div className="harshad-card harshad-card-3">
//             <h2>Bonus: Why no 21 consecutive?</h2>
//             <p>It's been proven that no sequence of 21 or more consecutive Harshad numbers can exist. Click to see why.</p>
//             <button onClick={handleExplanation} className="harshad-button">
//               {showExplanation ? 'Hide Explanation' : 'Show Explanation'}
//             </button>
//             {showExplanation && (
//               <div className="result-box explanation-box">
//                 <RenderExplanation text={explanationText} />
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // --- Placeholder Components for other assignments ---
// const PlaceholderComponent = ({ title, path }) => (
//     <div style={{ padding: '4rem', textAlign: 'center' }}>
//         <h2>{title}</h2>
//         <p>The component for this assignment would live at <code>{path}</code>.</p>
//         <p>You can now copy your code into this component to integrate it.</p>
//     </div>
// );
// const LegendreComponent = () => <PlaceholderComponent title="Assignment 2: Legendre Polynomials" path="/legendre" />;
// const GaussComponent = () => <PlaceholderComponent title="Assignment 3: Gaussian Quadrature" path="/gauss" />;

// // --- NEW: Component for Question 4: Heat Equation ---
// const VectorDisplay = ({ title, vector }) => (
//     <div className="vector-display">
//       <h3>{title}</h3>
//       <div className="vector-display-list">
//         {vector.map((val, idx) => (
//           <div key={idx}>
//             <span>{idx}:</span>
//             <span>{val}</span>
//           </div>
//         ))}
//       </div>
//     </div>
// );

// const HeatComponent = () => {
//   const [n, setN] = useState(32);
//   const [etaMax, setEtaMax] = useState(6.0);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [results, setResults] = useState(null);
//   const [activeTab, setActiveTab] = useState('plot');

//   const handleCalculate = async () => {
//     setIsLoading(true);
//     setError(null);
//     setResults(null);
//     setActiveTab('plot');

//     try {
//       const response = await fetch(`http://127.0.0.1:5000/api/heat-ode/solve`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ n: n, eta_max: etaMax }),
//       });
//       const data = await response.json();
//       if (!response.ok) {
//         throw new Error(data.error || 'An unknown error occurred.');
//       }
//       setResults(data);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     handleCalculate(); // Trigger on initial load
//   }, []);

//   const tabs = [
//     { id: 'plot', label: 'Solution Plot' },
//     { id: 'data', label: 'Solution Data' },
//   ];
  
//   const chartData = {
//     labels: results?.plot_data?.map(d => d.x.toFixed(4)) || [],
//     datasets: [
//       {
//         label: 'Numerical Solution (Collocation)',
//         data: results?.plot_data?.map(d => d.y_num) || [],
//         borderColor: 'rgba(56, 189, 248, 1)',
//         backgroundColor: 'rgba(56, 189, 248, 0.6)',
//         tension: 0.1,
//         yAxisID: 'y',
//       },
//       {
//         label: 'Analytical Solution (erf)',
//         data: results?.plot_data?.map(d => d.y_ana) || [],
//         borderColor: 'rgba(239, 68, 68, 1)',
//         backgroundColor: 'rgba(239, 68, 68, 0.6)',
//         borderDash: [5, 5],
//         yAxisID: 'y',
//       }
//     ]
//   };
  
//   const chartOptions = {
//     responsive: true,
//     scales: {
//       x: {
//         title: { text: 'Eta (η)', display: true, color: '#a0a0b9' },
//         ticks: { color: '#a0a0b9', maxTicksLimit: 10 },
//         grid: { color: 'rgba(156, 163, 175, 0.1)' }
//       },
//       y: {
//         title: { text: 'f(η)', display: true, color: '#a0a0b9' },
//         ticks: { color: '#a0a0b9' },
//         grid: { color: 'rgba(156, 163, 175, 0.1)' }
//       }
//     },
//     plugins: {
//       legend: { labels: { color: '#a0a0b9' } },
//       tooltip: {
//         callbacks: {
//           title: (tooltipItems) => `η = ${tooltipItems[0].label}`
//         }
//       }
//     },
//     interaction: {
//       intersect: false,
//       mode: 'index',
//     },
//   };

//   return (
//     <div className="heat-page">
//         <div className="heat-container">
//             <header className="heat-header">
//                 <h1>ODE Solver: Heat Equation</h1>
//                 <p>Solving f''(η) + 2ηf'(η) = 0 with n=32 Gauss-Legendre Collocation</p>
//             </header>

//             <div className="heat-controls">
//                 <label htmlFor="order-n">Order (n):</label>
//                 <input
//                     type="number"
//                     id="order-n"
//                     value={n}
//                     onChange={(e) => setN(Number(e.target.value))}
//                     min="3" max="64"
//                 />
//                 <label htmlFor="eta-max">"Finite Infinity" (η_max):</label>
//                 <input
//                     type="number"
//                     id="eta-max"
//                     value={etaMax}
//                     onChange={(e) => setEtaMax(Number(e.target.value))}
//                     min="2" max="10" step="0.5"
//                 />
//                 <button
//                     onClick={handleCalculate}
//                     disabled={isLoading}
//                     className="heat-button"
//                 >
//                     {isLoading ? 'Calculating...' : 'Re-Calculate'}
//                 </button>
//             </div>

//             {error && (
//                 <div className="heat-error">
//                     <strong>Error:</strong> {error}
//                 </div>
//             )}

//             {isLoading && !results && (
//                  <div className="heat-loading">Calculating...</div>
//             )}

//             {results && (
//                 <div className="animate-fade-in">
//                     <div className="heat-tabs">
//                         {tabs?.map(tab => (
//                             <button
//                                 key={tab.id}
//                                 onClick={() => setActiveTab(tab.id)}
//                                 className={`heat-tab-button ${activeTab === tab.id ? 'active' : ''}`}
//                             >
//                                 {tab.label}
//                             </button>
//                         ))}
//                     </div>

//                     <div className="heat-tab-content">
//                         {activeTab === 'plot' && (
//                             <div className="heat-chart-container">
//                                 <Line data={chartData} options={chartOptions} />
//                             </div>
//                         )}
//                         {activeTab === 'data' && (
//                             <div className="heat-data-grid">
//                                 <VectorDisplay
//                                     title="Nodes (η_i)"
//                                     vector={results.nodes_eta}
//                                 />
//                                 <VectorDisplay
//                                     title="Numerical f(η)"
//                                     vector={results.f_numerical}
//                                 />
//                                 <VectorDisplay
//                                     title="Analytical f(η)"
//                                     vector={results.f_analytical}
//                                 />
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             )}
//         </div>
//     </div>
//   );
// };

// // --- END OF NEW COMPONENT ---


// // --- Wrapper Component for individual question pages ---
// const QuestionPage = ({ children }) => {
//     return (
//         <div className="question-page">
//             <Link to="/" className="back-button">
//                 &larr; Back to Hub
//             </Link>
//             {children}
//         </div>
//     );
// };

// // --- Main Hub Page (with the Rotating Disk) ---
// const HomePage = () => {
//     const assignments = [
//         { id: 'harshad', path: '/harshad', title: 'Harshad Numbers', description: 'Explore factorials and consecutive sequences of Harshad numbers.', color: 'var(--color-q1)' },
//         { id: 'legendre', path: '/legendre', title: 'Legendre Polynomials', description: 'Solve for roots, matrices, and $Ax=b$ for high-order polynomials.', color: 'var(--color-q2)' },
//         { id: 'gauss', path: '/gauss', title: 'Gaussian Quadrature', description: 'Calculate nodes, weights, and collocation matrices.', color: 'var(--color-q3)' },
//         { id: 'heat', path: '/heat', title: 'Heat Equation ODE', description: 'Solve a boundary value problem using numerical methods.', color: 'var(--color-q4)' },
//     ];
//     const [activeIndex, setActiveIndex] = useState(0);
//     const navigate = useNavigate();

//     const rotate = (newIndex) => {
//         const numItems = assignments.length;
//         setActiveIndex((newIndex + numItems) % numItems);
//     };
//     const navigateForward = () => {
//         navigate(assignments[activeIndex].path);
//     };

//     const rotationAngle = -activeIndex * (360 / assignments.length);
//     const activeAssignment = assignments[activeIndex];

//     return (
//         <div className="hub-container">
//             <header className="hub-header">
//                 <h1>Mathematical Explorations</h1>
//             </header>
//             <div className="dial-system">
//                 <div className="dial-container">
//                     <div className="dial-indicator" style={{ borderTopColor: activeAssignment.color }}></div>
//                     <div className="dial-center"></div>
//                     <div className="dial" style={{ transform: `rotate(${rotationAngle}deg)` }}>
//                         {assignments.map((asmnt, index) => {
//                             // --- FIX: Calculate rotation for text to stay upright ---
//                             const nodeBaseRotation = index * (360 / assignments.length);
//                             const textCounterRotation = -rotationAngle - nodeBaseRotation;
                            
//                             return (
//                                 <div 
//                                     key={asmnt.id}
//                                     className={`dial-node ${index === activeIndex ? 'active' : ''}`}
//                                     style={{ '--node-color': asmnt.color }}
//                                     onClick={() => rotate(index)}
//                                 >
//                                     <div 
//                                         className="node-content" 
//                                         style={{ transform: `rotate(${textCounterRotation}deg)` }}
//                                     >
//                                         Q{index + 1}
//                                     </div>
//                                 </div>
//                             );
//                         })}
//                     </div>
//                 </div>
//                 <div className="info-panel" style={{ '--active-color': activeAssignment.color }}>
//                     <h2>{activeAssignment.title}</h2>
//                     <p>{activeAssignment.description}</p>
//                     <button className="hub-button" onClick={navigateForward}>
//                         Select Assignment
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// // --- Main App Router ---
// export default function App() {
//     return (
//         <BrowserRouter>
//             <AppStyles />
//             <Routes>
//                 <Route path="/" element={<HomePage />} />
//                 <Route path="/harshad" element={<QuestionPage><HarshadComponent /></QuestionPage>} />
//                 <Route path="/legendre" element={<QuestionPage><LegendreComponent /></QuestionPage>} />
//                 <Route path="/gauss" element={<QuestionPage><GaussComponent /></QuestionPage>} />
//                 <Route path="/heat" element={<QuestionPage><HeatComponent /></QuestionPage>} />
//             </Routes>
//         </BrowserRouter>
//     );
// }

//combined everything
import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
// --- Import Chart.js components ---
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ScatterController, // For scatter plots
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Scatter } from 'react-chartjs-2'; // Import Scatter

// --- Register Chart.js components ---
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ScatterController, // Register scatter controller
  Title,
  Tooltip,
  Legend
);

// --- Embedded CSS for the entire application ---
const AppStyles = () => (
    <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Poppins:wght@300;400;500;600;700&display=swap');

        :root {
            --color-bg: #111119;
            --color-surface: #1d1d27;
            --color-border: #333344;
            --color-text-primary: #f0f0f5;
            --color-text-secondary: #a0a0b9;
            
            --color-q1: #00f0ff; /* Cyan - Q1 */
            --color-q2: #a78bfa; /* Purple - Q2 */
            --color-q3: #34d399; /* Green - Q3 */
            --color-q4: #fcb045; /* Orange - Q4 */
        }

        body {
            margin: 0;
            font-family: 'Poppins', sans-serif;
            background-color: var(--color-bg);
            color: var(--color-text-primary);
            overflow-x: hidden;
        }

        /* --- Main Hub Page Styles --- */
        .hub-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            padding: 2rem;
            box-sizing: border-box;
            overflow: hidden;
        }

        .hub-header {
            text-align: center;
            margin-bottom: 2rem;
            z-index: 10;
        }

        .hub-header h1 {
            font-family: 'Orbitron', sans-serif;
            font-size: 3rem;
            font-weight: 700;
            color: white;
            text-shadow: 0 0 10px var(--color-q1), 0 0 20px var(--color-q1);
        }

        .dial-system {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 2rem;
        }

        .dial-container {
            position: relative;
            width: 500px;
            height: 500px;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .dial {
            width: 100%;
            height: 100%;
            position: relative;
            border-radius: 50%;
            border: 2px solid var(--color-border);
            transition: transform 0.7s cubic-bezier(0.68, -0.55, 0.27, 1.55);
            background: radial-gradient(circle at center, var(--color-surface) 0%, var(--color-bg) 70%);
        }

        .dial-center {
            width: 100px;
            height: 100px;
            background: var(--color-bg);
            border: 10px solid var(--color-border);
            border-radius: 50%;
            position: absolute;
            z-index: 5;
            box-shadow: 0 0 20px #000;
        }

        .dial-node {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 100px;
            height: 100px;
            margin: -50px;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            transition: all 0.5s ease;
            z-index: 10;
        }

        .node-content {
            width: 80px;
            height: 80px;
            background: var(--color-surface);
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            font-family: 'Orbitron', sans-serif;
            font-size: 1.5rem;
            font-weight: 700;
            border: 4px solid var(--color-border);
            transition: all 0.3s ease;
            box-shadow: 0 0 10px #000;
        }

        /* Assigning colors and positions to nodes */
        .dial-node:nth-child(1) { transform: rotate(0deg) translateY(-220px); --node-color: var(--color-q1); }
        .dial-node:nth-child(2) { transform: rotate(90deg) translateY(-220px); --node-color: var(--color-q2); }
        .dial-node:nth-child(3) { transform: rotate(180deg) translateY(-220px); --node-color: var(--color-q3); }
        .dial-node:nth-child(4) { transform: rotate(270deg) translateY(-220px); --node-color: var(--color-q4); }

        .dial-node .node-content {
            color: var(--node-color);
            border-color: var(--node-color);
            text-shadow: 0 0 5px var(--node-color);
        }

        /* Active state */
        .dial-node.active .node-content {
            background: var(--node-color);
            color: var(--color-bg);
            transform: scale(1.2);
            box-shadow: 0 0 20px var(--node-color), 0 0 40px var(--node-color);
        }

        .dial-indicator {
            position: absolute;
            top: 10px;
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 0;
            border-left: 10px solid transparent;
            border-right: 10px solid transparent;
            border-top: 15px solid var(--color-q1); /* Indicator color */
            z-index: 20;
            transition: border-top-color 0.5s ease;
        }

        .info-panel {
            background: var(--color-surface);
            border: 1px solid var(--color-border);
            padding: 2rem;
            border-radius: 16px;
            width: 100%;
            max-width: 500px;
            text-align: center;
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
            z-index: 10;
        }

        .info-panel h2 {
            font-family: 'Orbitron', sans-serif;
            font-size: 2rem;
            margin: 0 0 1rem 0;
            color: var(--active-color);
            transition: color 0.5s ease;
        }

        .info-panel p {
            color: var(--color-text-secondary);
            font-size: 1.1rem;
            line-height: 1.6;
            min-height: 80px; /* Prevent layout shift */
        }
        
        .hub-button {
            font-family: 'Poppins', sans-serif;
            font-weight: 600;
            font-size: 1rem;
            padding: 0.8rem 2rem;
            border-radius: 8px;
            border: none;
            cursor: pointer;
            transition: all 0.3s ease;
            background: var(--active-color);
            color: var(--color-bg);
            box-shadow: 0 0 15px var(--active-color);
        }
        .hub-button:hover {
            transform: scale(1.05);
        }

        /* --- Question Page Styles --- */
        .question-page {
            width: 100%;
            min-height: 100vh;
            padding: 2rem;
            box-sizing: border-box;
            animation: fadeIn 0.5s ease;
        }
        .back-button {
            position: absolute;
            top: 2rem;
            left: 2rem;
            font-size: 1rem;
            font-weight: 500;
            color: var(--color-text-secondary);
            text-decoration: none;
            padding: 0.5rem 1rem;
            background: var(--color-surface);
            border: 1px solid var(--color-border);
            border-radius: 8px;
            transition: all 0.2s ease;
            z-index: 100;
        }
        .back-button:hover {
            background: var(--color-border);
            color: var(--color-text-primary);
        }

        @keyframes fadeIn {
            from { opacity: 0; } to { opacity: 1; }
        }

        /* --- Scoped Styles for Harshad Assignment --- */
        .harshad-page .harshad-container {
            max-width: 1152px; /* 6xl */
            margin: 0 auto;
            padding-top: 4rem; /* Make space for back button */
        }
        .harshad-page .harshad-header { text-align: center; margin-bottom: 3rem; }
        .harshad-page .harshad-header h1 {
            font-size: 2.5rem; /* 4xl */
            font-weight: 700;
            color: transparent;
            background-clip: text;
            background-image: linear-gradient(to right, var(--color-q2), var(--color-q1));
        }
        .harshad-page .harshad-header p { font-size: 1.1rem; color: var(--color-text-secondary); margin-top: 0.5rem; }
        
        .harshad-page .harshad-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 2rem;
        }
        @media (min-width: 1024px) { .harshad-page .harshad-grid { grid-template-columns: repeat(2, 1fr); } }

        .harshad-page .harshad-card {
            background: var(--color-surface);
            backdrop-filter: blur(10px);
            border: 1px solid var(--color-border);
            border-radius: 1rem;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            padding: 1.5rem;
            transition: all 0.3s ease;
        }
        .harshad-page .harshad-card:hover {
            box-shadow: 0 0 20px var(--card-hover-color, var(--color-border));
        }

        .harshad-page .harshad-card h2 {
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 1rem;
            color: var(--card-color);
        }
        .harshad-page .harshad-card p {
            color: var(--color-text-secondary);
            margin-bottom: 1.5rem;
        }
        .harshad-page .harshad-card-1 { --card-color: var(--color-q1); --card-hover-color: var(--color-q1); }
        .harshad-page .harshad-card-2 { --card-color: var(--color-q2); --card-hover-color: var(--color-q2); }
        .harshad-page .harshad-proof { 
            grid-column: 1 / -1; /* Span full width on all sizes */
            --card-color: #f472b6; /* Pink */
            --card-hover-color: #f472b6; 
        }

        .harshad-page .input-row {
            display: flex;
            gap: 0.75rem;
            margin-bottom: 1.5rem;
        }
        .harshad-page .input-field {
            flex-grow: 1;
            padding: 0.75rem 1rem;
            background: var(--color-bg);
            border: 1px solid var(--color-border);
            border-radius: 8px;
            color: var(--color-text-primary);
            font-family: 'Poppins', sans-serif;
            font-size: 1rem;
        }
        .harshad-page .input-field:focus {
            outline: none;
            border-color: var(--card-color);
            box-shadow: 0 0 10px var(--card-color);
        }
        .harshad-page .harshad-button {
            font-family: 'Poppins', sans-serif;
            font-weight: 500;
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            border: none;
            cursor: pointer;
            transition: all 0.3s ease;
            background: var(--card-color);
            color: var(--color-bg);
            width: 100%;
        }
        .harshad-page .harshad-button:disabled {
            background: var(--color-border);
            opacity: 0.5;
            cursor: not-allowed;
        }
        .harshad-page .harshad-error {
            margin-top: 1rem;
            color: #f87171; /* red-400 */
            background: rgba(239, 68, 68, 0.1);
            border: 1px solid #ef4444; /* red-500 */
            padding: 0.75rem;
            border-radius: 8px;
        }
        .harshad-page .harshad-results {
            margin-top: 1.5rem;
            color: var(--color-text-secondary);
        }
        .harshad-page .harshad-results strong {
            color: var(--color-text-primary);
        }
        .harshad-page .harshad-results p {
            font-size: 1.1rem;
            color: var(--color-text-primary);
        }
        .harshad-page .result-table-wrapper {
            margin-top: 1rem;
            max-height: 400px;
            overflow-y: auto;
            border: 1px solid var(--color-border);
            border-radius: 8px;
        }
        .harshad-page table {
            width: 100%;
            border-collapse: collapse;
            font-size: 0.9rem;
        }
        .harshad-page th, .harshad-page td {
            padding: 0.75rem 1rem;
            text-align: left;
            border-bottom: 1px solid var(--color-border);
        }
        .harshad-page th {
            background: var(--color-surface);
            position: sticky;
            top: 0;
            color: var(--card-color);
        }
        .harshad-page tr:last-child td {
            border-bottom: none;
        }
        .harshad-page td:nth-child(2),
        .harshad-page td:nth-child(4) {
            font-family: 'Orbitron', monospace;
            word-break: break-all;
        }
        
        /* Proof styles */
        .harshad-proof-content {
            line-height: 1.7;
            color: var(--color-text-secondary);
        }
        .harshad-proof-content h3 {
            font-size: 1.25rem;
            color: var(--color-text-primary);
            margin-top: 1.5rem;
            margin-bottom: 0.5rem;
            border-bottom: 1px solid var(--color-border);
            padding-bottom: 0.25rem;
        }
        .harshad-proof-content p {
            margin-bottom: 1rem;
        }
        .harshad-proof-content code {
            font-family: 'Orbitron', monospace;
            background: var(--color-bg);
            padding: 0.1rem 0.4rem;
            border-radius: 4px;
            font-size: 0.9em;
            color: var(--card-color);
        }
        .harshad-proof-content strong {
            color: var(--color-text-primary);
            font-weight: 500;
        }
        .harshad-proof-content .proof-conclusion {
            margin-top: 1.5rem;
            padding-top: 1rem;
            border-top: 1px solid var(--color-border);
            font-size: 1.1rem;
            font-weight: 600;
            color: var(--card-color);
            text-align: center;
        }
        
        /* --- Styles for Q2, Q3, Q4 --- */
        
        .solver-page {
            max-width: 1280px; /* 7xl */
            margin: 0 auto;
            padding-top: 4rem;
        }
        
        .solver-header { text-align: center; margin-bottom: 2rem; }
        .solver-header h1 {
            font-size: 2.5rem;
            font-weight: 700;
            color: transparent;
            background-clip: text;
        }
        .solver-header p { font-size: 1.1rem; color: var(--color-text-secondary); margin-top: 0.5rem; }
        
        /* Specific header colors */
        .legendre-page .solver-header h1 { background-image: linear-gradient(to right, var(--color-q3), var(--color-q2)); }
        .gauss-page .solver-header h1 { background-image: linear-gradient(to right, var(--color-q1), var(--color-q3)); }
        .heat-page .solver-header h1 { background-image: linear-gradient(to right, var(--color-q3), var(--color-q4)); }

        .solver-controls {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            justify-content: center;
            align-items: center;
            padding: 1.5rem;
            background: var(--color-surface);
            border: 1px solid var(--color-border);
            border-radius: 1rem;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            max-width: 640px; /* 2xl */
            margin: 0 auto 2rem auto;
        }
        @media (min-width: 768px) { .solver-controls { flex-direction: row; gap: 1.5rem; } }

        .solver-input-group {
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }
        
        .solver-label {
            font-size: 1rem;
            font-weight: 500;
            color: var(--color-text-secondary);
        }
        
        .solver-input {
            padding: 0.5rem 0.75rem;
            width: 5rem; /* w-20 */
            text-align: center;
            background: var(--color-bg);
            border: 1px solid var(--color-border);
            border-radius: 8px;
            color: var(--color-text-primary);
        }
        .solver-input:focus {
            outline: none;
            border-color: var(--color-q1);
        }
        
        .solver-button {
            font-family: 'Poppins', sans-serif;
            font-weight: 500;
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            border: none;
            cursor: pointer;
            transition: all 0.3s ease;
            background: var(--color-q1);
            color: var(--color-bg);
            width: 100%;
        }
        @media (min-width: 768px) { .solver-button { width: auto; } }
        
        .solver-button:disabled {
            background: var(--color-border);
            opacity: 0.5;
            cursor: not-allowed;
        }
        
        /* Re-using harshad error style */
        .solver-error {
            text-align: center;
            margin-bottom: 1.5rem;
            color: #f87171; /* red-400 */
            background: rgba(239, 68, 68, 0.1);
            border: 1px solid #ef4444; /* red-500 */
            padding: 0.75rem;
            border-radius: 8px;
            max-width: 640px;
            margin: 0 auto 2rem auto;
        }
        
        .solver-results-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 1.5rem;
        }
        @media (min-width: 1024px) { .solver-results-grid { grid-template-columns: repeat(2, 1fr); } }
        
        /* NEW: Container for matrices tab to force single column */
        .solver-matrices-container {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
        }
        
        .solver-card, .solver-chart-card {
            background: var(--color-surface);
            border: 1px solid var(--color-border);
            border-radius: 1rem;
            padding: 1.5rem;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }
        .solver-card h3 {
            font-size: 1.25rem;
            font-weight: 600;
            color: var(--color-q1);
            margin: 0 0 1rem 0;
        }
        
        /* Colors for different pages */
        .legendre-page .solver-card h3 { color: var(--color-q2); }
        .gauss-page .solver-card h3 { color: var(--color-q3); }
        .heat-page .solver-card h3 { color: var(--color-q4); }

        .vector-display {
            font-family: 'Orbitron', monospace;
            font-size: 0.9rem;
            max-height: 300px;
            overflow-y: auto;
            padding-right: 0.5rem;
        }
        
        .vector-item {
            display: flex;
            align-items: center;
            border-bottom: 1px solid var(--color-border);
            padding: 0.25rem 0;
        }
        .vector-item:last-child { border-bottom: none; }
        
        .vector-index {
            color: var(--color-text-secondary);
            width: 3rem;
            flex-shrink: 0;
            text-align: right;
            padding-right: 0.75rem;
        }
        .vector-value {
            color: var(--color-text-primary);
            word-break: break-all;
        }
        
        .matrix-display {
            font-family: 'Orbitron', monospace;
            font-size: 0.9rem;
            max-height: 300px;
            overflow-x: auto;
            overflow-y: auto;
        }
        .matrix-display-placeholder {
            font-family: 'Orbitron', monospace;
            color: var(--color-text-secondary);
            padding: 2rem;
            text-align: center;
        }
        
        .matrix-display table {
            /* width: 100%; */ /* <-- THIS LINE WAS REMOVED TO FIX SCROLLING */
            border-collapse: collapse;
        }
        .matrix-display td {
            padding: 0.3rem 0.5rem;
            border: 1px solid var(--color-border);
            white-space: nowrap;
        }
        
        .scalar-group {
            font-family: 'Orbitron', monospace;
            font-size: 1rem;
            display: flex;
            justify-content: space-between;
            padding: 0.5rem 0;
            border-bottom: 1px solid var(--color-border);
        }
        .scalar-group:last-child { border-bottom: none; }
        .scalar-label { color: var(--color-text-secondary); }
        .scalar-value { color: var(--color-text-primary); }
        
        .solver-tabs {
            display: flex;
            justify-content: center;
            border-bottom: 1px solid var(--color-border);
            margin-bottom: 1.5rem;
        }
        .tab-button {
            padding: 0.75rem 1.5rem;
            font-size: 1rem;
            font-weight: 500;
            border: none;
            background: none;
            cursor: pointer;
            color: var(--color-text-secondary);
            border-bottom: 3px solid transparent;
            transition: all 0.2s ease;
        }
        .tab-button.active {
            color: var(--color-q3);
            border-bottom-color: var(--color-q3);
        }
        
        .gauss-page .stats-bar {
            display: flex;
            justify-content: center;
            gap: 2rem;
            margin-bottom: 1.5rem;
            text-align: center;
        }
        .stats-item .stats-label {
            font-size: 0.9rem;
            color: var(--color-text-secondary);
        }
        .stats-item .stats-value {
            font-family: 'Orbitron', monospace;
            font-size: 1.5rem;
            font-weight: 600;
            color: var(--color-q3);
        }
        
        /* Custom Scrollbars */
        .vector-display::-webkit-scrollbar,
        .matrix-display::-webkit-scrollbar,
        .result-table-wrapper::-webkit-scrollbar {
            width: 6px;
            height: 6px;
        }
        .vector-display::-webkit-scrollbar-track,
        .matrix-display::-webkit-scrollbar-track,
        .result-table-wrapper::-webkit-scrollbar-track {
            background: var(--color-bg);
        }
        .vector-display::-webkit-scrollbar-thumb,
        .matrix-display::-webkit-scrollbar-thumb,
        .result-table-wrapper::-webkit-scrollbar-thumb {
            background-color: var(--color-border);
            border-radius: 3px;
        }
        .vector-display::-webkit-scrollbar-thumb:hover,
        .matrix-display::-webkit-scrollbar-thumb:hover,
        .result-table-wrapper::-webkit-scrollbar-thumb:hover {
            background-color: #555566;
        }
    `}</style>
);

// --- API Base URL ---
const API_BASE_URL = 'http://127.0.0.1:5000';

// ================================================
// --- Reusable Components ---
// ================================================

/**
 * A reusable component to display a vector (list) in a clean format.
 */
function VectorDisplay({ title, vector }) {
  if (!vector) return null;

  const isVectorData = Array.isArray(vector); // <-- This was the fix

  return (
    <div className="solver-card">
      <h3>{title}</h3>
      {isVectorData ? (
         <div className="vector-display">
          {vector.map((val, idx) => (
            <div key={idx} className="vector-item">
              <span className="vector-index">{idx}:</span>
              <span className="vector-value">{val}</span>
            </div>
          ))}
        </div>
      ) : (
         <p className="matrix-display-placeholder">{vector}</p>
      )}
    </div>
  );
}

/**
 * A reusable component to display a matrix.
 * It can now also display a string message (e.g., "Matrix is 100x100...")
 */
function MatrixDisplay({ title, matrix }) {
  if (!matrix) return null;

  const isMatrixData = Array.isArray(matrix);

  return (
    <div className="solver-card">
      <h3>{title}</h3>
      {isMatrixData ? (
        <div className="matrix-display">
            <table>
                <tbody>
                    {matrix.map((row, r_idx) => (
                    <tr key={r_idx}>
                        {row.map((val, c_idx) => (
                        <td key={c_idx}>{val}</td>
                        ))}
                    </tr>
                    ))}
                </tbody>
            </table>
        </div>
      ) : (
        <p className="matrix-display-placeholder">{matrix}</p>
      )}
    </div>
  );
}

/**
 * A reusable component to display scalar (key-value) results.
 */
function ScalarDisplay({ title, data }) {
    if (!data) return null;
    
    return (
        <div className="solver-card">
            <h3>{title}</h3>
            <div className="scalar-group-container">
                {Object.entries(data).map(([key, value]) => (
                    <div key={key} className="scalar-group">
                        <span className="scalar-label">{key}:</span>
                        <span className="scalar-value">{value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

/**
 * A back button to return to the hub.
 */
function BackButton() {
    return (
        <Link to="/" className="back-button">
            &larr; Back to Hub
        </Link>
    );
}


// ================================================
// --- Hub Page Component (Main) ---
// ================================================

const hubPages = [
    { id: 'q1', path: '/harshad', title: 'Harshad Numbers', description: 'Explore Harshad numbers, non-Harshad factorials, and consecutive sequences.', color: 'var(--color-q1)' },
    { id: 'q2', path: '/legendre', title: 'Legendre Polynomials', description: 'Solve for roots, coefficients, and companion matrix up to n=100.', color: 'var(--color-q2)' },
    { id: 'q3', path: '/gauss-quad', title: 'Gaussian Quadrature', description: 'Compute nodes, weights, and collocation matrices for quadrature.', color: 'var(--color-q3)' },
    { id: 'q4', path: '/heat-ode', title: 'Heat Equation BVP', description: 'Solve a 1D heat boundary value problem using finite differences.', color: 'var(--color-q4)' },
];

function HubPage() {
    const [activeIndex, setActiveIndex] = useState(0);
    const navigate = useNavigate();

    const activePage = hubPages[activeIndex];
    const rotation = -90 * activeIndex;

    const handleNodeClick = (index) => {
        setActiveIndex(index);
    };

    const handleLaunch = () => {
        navigate(activePage.path);
    };

    return (
        <div className="hub-container" style={{ '--active-color': activePage.color }}>
            <div className="hub-header">
                <h1>Unified Solver Hub</h1>
            </div>
            <div className="dial-system">
                <div className="dial-container">
                    <div className="dial-indicator" style={{ borderTopColor: activePage.color }}></div>
                    <div className="dial-center"></div>
                    <div className="dial" style={{ transform: `rotate(${rotation}deg)` }}>
                        {hubPages.map((page, index) => (
                            <div 
                                key={page.id} 
                                className={`dial-node ${index === activeIndex ? 'active' : ''}`}
                                onClick={() => handleNodeClick(index)}
                            >
                                <div className="node-content">{page.id.toUpperCase()}</div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="info-panel">
                    <h2>{activePage.title}</h2>
                    <p>{activePage.description}</p>
                    <button className="hub-button" onClick={handleLaunch}>
                        Launch Solver
                    </button>
                </div>
            </div>
        </div>
    );
}

// ================================================
// --- Assignment 1: Harshad Page ---
// ================================================

/**
 * New component to display the mathematical proof.
 */
function HarshadProof() {
  return (
    <div className="harshad-card harshad-proof">
      <h2>A Deeper Look: Why Can't 21 Consecutive Harshad Numbers Exist?</h2>
      <div className="harshad-proof-content">
        <p>This is a classic proof in number theory, and it's a great example of how simple properties can lead to a powerful conclusion. Here is the step-by-step argument.</p>
        
        <h3>Step 1: The Core Property (The "Decade" Trick)</h3>
        <p>
          Assume, for the sake of contradiction, that a sequence of 21 consecutive Harshad numbers <i>does</i> exist: <code>n, n+1, ..., n+20</code>.
          Any sequence of 21 integers must contain at least two numbers ending in 0. Let's call them <code>m</code> and <code>m+10</code>.
          This means our sequence fully contains two complete "decades" of numbers: <code>m, m+1, ..., m+9</code> and <code>m+10, m+11, ..., m+19</code>.
          Crucially, a sequence of 21 integers (e.g., 80 to 100) must contain a number ending in <code>00</code>. Let's choose our <code>m</code> to be this number (e.g., <code>m=100</code>, <code>m=200</code>, etc.).
          This guarantees that the digit sums for both decades increase predictably: <code>s(m+1) = s(m)+1</code>, <code>s(m+2) = s(m)+2</code>, and so on.
        </p>

        <h3>Step 2: The Divisibility Consequence (Decade 1)</h3>
        <p>
          Let's analyze Decade 1: <code>m, m+1, ..., m+9</code>. Let <code>S = s(m)</code>.
          The digit sums for this decade are: <code>S, S+1, S+2, ..., S+9</code>.
          By our assumption, every number is Harshad, so: <code>S+k</code> must divide <code>m+k</code> (for <code>k=0..9</code>).
          Using a key lemma (if <code>a</code> divides <code>b</code>, then <code>a</code> divides <code>b-a</code>), this means:
          <code>S+k</code> must divide <code>(m+k) - (S+k) = m - S</code>.
          This means the single, constant integer <code>C = m-S</code> must be divisible by all 10 numbers <code>S, S+1, ..., S+9</code>.
          Therefore, <strong><code>lcm(S, S+1, ..., S+9)</code> must divide <code>C</code></strong>.
        </p>

        <h3>Step 3: The Divisibility Consequence (Decade 2)</h3>
        <p>
          Now, analyze Decade 2: <code>m+10, m+11, ..., m+19</code>.
          Because <code>m</code> ends in <code>00</code>, <code>s(m+10) = s(m)+1 = S+1</code>.
          The digit sums for this decade are: <code>S+1, S+2, ..., S+10</code>.
          By our assumption: <code>S+k+1</code> must divide <code>m+k+10</code> (for <code>k=0..9</code>).
          Using the same lemma: <code>S+k+1</code> must divide <code>(m+k+10) - (S+k+1) = (m-S) + 9 = C+9</code>.
          This means the constant integer <code>C+9</code> must be divisible by all 10 numbers <code>S+1, S+2, ..., S+10</code>.
          Therefore, <strong><code>lcm(S+1, S+2, ..., S+10)</code> must divide <code>C+9</code></strong>.
        </p>
        
        <h3>Step 4: The Contradiction</h3>
        <p>
          Let's look at what we have. Let <code>K = lcm(S+1, S+2, ..., S+9)</code>. This is the LCM of 9 consecutive integers.
          From Result 1: <code>lcm(S, K)</code> divides <code>C</code>. This implies that <strong><code>K</code> must divide <code>C</code></strong>.
          From Result 2: <code>lcm(K, S+10)</code> divides <code>C+9</code>. This implies that <strong><code>K</code> must divide <code>C+9</code></strong>.
          If an integer <code>K</code> divides two numbers, it must also divide their difference.
          Therefore, <code>K</code> must divide <code>(C+9) - C = 9</code>.
        </p>

        <h3>Step 5: The Final Blow</h3>
        <p>
          We "proved" that <code>K = lcm(S+1, ..., S+9)</code> must divide 9.
          But <code>S = s(m)</code> is a digit sum, so <code>S &ge; 1</code>. The sequence of 9 integers must start at <code>S+1 &ge; 2</code>.
          The smallest possible sequence for <code>K</code> is when <code>S=1</code>, giving us: <code>K = lcm(2, 3, 4, 5, 6, 7, 8, 9, 10) = 2520</code>.
          The statement "2520 divides 9" is absurdly false. <code>K</code> will always be vastly larger than 9.
        </p>
        
        <p className="proof-conclusion">
          This is a formal contradiction. Our initial assumption was false.
          <br/>
          <strong>It is mathematically impossible for 21 consecutive integers to all be Harshad numbers.</strong>
        </p>
      </div>
    </div>
  );
}


function HarshadPage() {
  // --- State for Factorial Finder ---
  const [factStart, setFactStart] = useState('1');
  const [factEnd, setFactEnd] = useState('100');
  const [factLoading, setFactLoading] = useState(false);
  const [factResults, setFactResults] = useState(null);
  const [factError, setFactError] = useState(null);

  // --- State for Consecutive Finder ---
  const [consecN, setConsecN] = useState('11');
  const [consecStart, setConsecStart] = useState('920067411130599');
  const [consecLoading, setConsecLoading] = useState(false);
  const [consecResult, setConsecResult] = useState(null);
  const [consecError, setConsecError] = useState(null);

  const handleFindFactorials = async () => {
    setFactLoading(true);
    setFactResults(null);
    setFactError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/harshad/factorial`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ start: factStart, end: factEnd }),
      });
      // Check for non-JSON responses first
      if (!response.headers.get("content-type")?.includes("application/json")) {
        const text = await response.text();
        throw new Error(`Server returned non-JSON response: ${text}`);
      }
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Error fetching factorial data');
      setFactResults(data);
    } catch (err) {
      setFactError(err.message);
    } finally {
      setFactLoading(false);
    }
  };

  const handleFindConsecutive = async () => {
    setConsecLoading(true);
    setConsecResult(null);
    setConsecError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/harshad/consecutive`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ n: consecN, start: consecStart }),
      });
      // Check for non-JSON responses first
      if (!response.headers.get("content-type")?.includes("application/json")) {
        const text = await response.text();
        throw new Error(`Server returned non-JSON response: ${text}`);
      }
      const data = await response.json();
      if (data.status === 'error') throw new Error(data.message);
      setConsecResult(data);
    } catch (err) {
      setConsecError(err.message);
    } finally {
      setConsecLoading(false);
    }
  };

  return (
    <div className="harshad-page question-page">
      <BackButton />
      <div className="harshad-container">
        <header className="harshad-header">
          <h1>Harshad Number Explorer</h1>
          <p>Find non-Harshad factorials and sequences of consecutive Harshad numbers.</p>
        </header>
        
        <div className="harshad-grid">
          {/* Factorial Card */}
          <div className="harshad-card harshad-card-1">
            <h2>Non-Harshad Factorials</h2>
            <p>Find n (n!) in a range where n! is not a Harshad number.</p>
            <div className="input-row">
              <input type="number" value={factStart} onChange={(e) => setFactStart(e.target.value)} className="input-field" placeholder="Start n" />
              <input type="number" value={factEnd} onChange={(e) => setFactEnd(e.target.value)} className="input-field" placeholder="End n" />
            </div>
            <button onClick={handleFindFactorials} disabled={factLoading} className="harshad-button">
              {factLoading ? 'Searching...' : 'Find'}
            </button>
            {factError && <div className="harshad-error">{factError}</div>}
            {factResults && (
              <div className="harshad-results">
                <strong>{factResults.message || `Found ${factResults.results.length} non-Harshad factorials:`}</strong>
                {factResults.results && factResults.results.length > 0 && (
                  <div className="result-table-wrapper">
                    <table>
                      <thead>
                        <tr>
                          <th>n</th>
                          <th>n! (Ends)</th>
                          <th>Sum</th>
                          <th>n! / Sum</th>
                        </tr>
                      </thead>
                      <tbody>
                        {factResults.results.map((res) => (
                          <tr key={res.n}>
                            <td>{res.n}</td>
                            <td>{res.factorial_str}</td>
                            <td>{res.digit_sum}</td>
                            <td>{res.division_result_str}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Consecutive Card */}
          <div className="harshad-card harshad-card-2">
            <h2>Consecutive Harshad Sequence</h2>
            <p>Find the first sequence of N consecutive Harshad numbers.</p>
            <div className="input-row">
              <input type="number" value={consecN} onChange={(e) => setConsecN(e.target.value)} className="input-field" placeholder="N" />
              <input type="text" value={consecStart} onChange={(e) => setConsecStart(e.target.value)} className="input-field" placeholder="Start Search At" />
            </div>
            <button onClick={handleFindConsecutive} disabled={consecLoading} className="harshad-button">
              {consecLoading ? 'Searching...' : 'Find'}
            </button>
            {consecError && <div className="harshad-error">{consecError}</div>}
            {consecResult && (
              <div className="harshad-results">
                <strong>{consecResult.message || `Found sequence of ${consecResult.count}:`}</strong>
                {consecResult.status === 'found' && <p>First number: {consecResult.first_number}</p>}
              </div>
            )}
          </div>
          
          {/* Proof Card - New */}
          <HarshadProof />
          
        </div>
      </div>
    </div>
  );
}

// ================================================
// --- Assignment 2: Legendre Page ---
// ================================================
function LegendrePage() {
  const [n, setN] = useState(8);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);

  const handleCalculate = async () => {
    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/legendre/solve/${n}`);
      if (!response.headers.get("content-type")?.includes("application/json")) {
        const text = await response.text();
        throw new Error(`Server returned non-JSON response: ${text}`);
      }
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'An unknown error occurred.');
      }
      
      // Data from your server is nested, flatten it for the components
      setResults({
        coefficients: data.A_Polynomial?.coefficients,
        companion_matrix: data.B_Companion_Matrix?.matrix_A,
        roots: data.C_Roots_Eigenvalues?.roots,
        P_matrix: data.D_LU_Decomposition_Solve?.["P_matrix (Permutation)"],
        L_matrix: data.D_LU_Decomposition_Solve?.["L_matrix (Lower)"],
        U_matrix: data.D_LU_Decomposition_Solve?.["U_matrix (Upper)"],
        x_solution: data.D_LU_Decomposition_Solve?.x_solution_vector,
        newton_roots: {
            "Smallest Root": data.E_Newton_Raphson_Roots?.smallest_root,
            "Largest Root": data.E_Newton_Raphson_Roots?.largest_root,
        }
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="legendre-page question-page solver-page">
      <BackButton />
      <header className="solver-header">
        <h1>Legendre Polynomial Solver</h1>
        <p>Explore roots, coefficients, and companion matrices using high-precision math (n=3 to 100).</p>
      </header>

      <div className="solver-controls">
        <div className="solver-input-group">
            <label htmlFor="order-n" className="solver-label">Polynomial Order (n):</label>
            <input
                type="number"
                id="order-n"
                value={n}
                onChange={(e) => setN(Number(e.target.value))}
                min="3"
                max="100"
                className="solver-input"
            />
        </div>
        <button
            onClick={handleCalculate}
            disabled={isLoading}
            className="solver-button"
            style={{'--color-q1': 'var(--color-q2)'}} /* Use Q2 color for button */
        >
            {isLoading ? 'Calculating...' : 'Calculate'}
        </button>
      </div>

      {error && <div className="solver-error"><strong>Error:</strong> {error}</div>}

      {results && (
        <div className="solver-results-grid">
            {/* Column 1 */}
            <div className="space-y-6">
                <VectorDisplay
                    title="Polynomial Coefficients"
                    vector={results.coefficients}
                />
                <VectorDisplay
                    title="Roots (Eigenvalues of A)"
                    vector={results.roots}
                />
                <VectorDisplay
                    title="Solved Ax = b (for b = [1...n])"
                    vector={results.x_solution}
                />
            </div>

            {/* Column 2 */}
            <div className="space-y-6">
                <MatrixDisplay
                    title="Companion Matrix (A)"
                    matrix={results.companion_matrix}
                />
                <MatrixDisplay
                    title="P Matrix (Permutation)"
                    matrix={results.P_matrix}
                />
                <MatrixDisplay
                    title="L Matrix (Lower)"
                    matrix={results.L_matrix}
                />
                <MatrixDisplay
                    title="U Matrix (Upper)"
                    matrix={results.U_matrix}
                />
                <ScalarDisplay
                    title="Roots via Newton-Raphson"
                    data={results.newton_roots}
                />
            </div>
        </div>
      )}
    </div>
  );
}

// ================================================
// --- Assignment 3: Gaussian Quadrature Page ---
// ================================================
function GaussQuadPage() {
  const [n, setN] = useState(8);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);
  const [activeTab, setActiveTab] = useState('plot');

  const handleCalculate = async () => {
    setIsLoading(true);
    setError(null);
    setResults(null);
    setActiveTab('plot'); // Default to plot tab

    try {
      const response = await fetch(`${API_BASE_URL}/api/gauss-quad/calculate/${n}`);
      if (!response.headers.get("content-type")?.includes("application/json")) {
        const text = await response.text();
        throw new Error(`Server returned non-JSON response: ${text}`);
      }
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'An unknown error occurred.');
      }
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'plot', label: 'Weight Plot' },
    { id: 'nodes', label: 'Nodes (Roots)' },
    { id: 'weights', label: 'Weights' },
    { id: 'matrices', label: 'Collocation Matrices' },
  ];
  
  // Chart.js data and options objects
  const chartData = {
    datasets: [{
      label: 'Weights (w_i) vs. Nodes (x_i)',
      data: results?.plot_data || [],
      backgroundColor: 'rgba(52, 211, 153, 0.6)', // Green
      borderColor: 'rgba(52, 211, 153, 1)',
    }]
  };
  
  const chartOptions = {
    responsive: true,
    scales: {
      x: {
        type: 'linear', // Use linear scale for scatter plot
        position: 'bottom',
        title: { text: 'Nodes (x_i)', display: true, color: 'var(--color-text-secondary)' },
        ticks: { color: 'var(--color-text-secondary)' },
        grid: { color: 'var(--color-border)' }
      },
      y: {
        title: { text: 'Weights (w_i)', display: true, color: 'var(--color-text-secondary)' },
        ticks: { color: 'var(--color-text-secondary)' },
        grid: { color: 'var(--color-border)' }
      }
    },
    plugins: {
      legend: { labels: { color: 'var(--color-text-primary)' } },
      tooltip: {
        callbacks: {
            label: function(context) {
                let label = context.dataset.label || '';
                if (label) {
                    label += ': ';
                }
                if (context.parsed.x !== null) {
                    label += `(x: ${context.parsed.x}, w: ${context.parsed.y})`;
                }
                return label;
            }
        }
      }
    }
  };

  return (
    <div className="gauss-page question-page solver-page">
      <BackButton />
      <header className="solver-header">
        <h1>Gaussian Quadrature Explorer</h1>
        <p>Calculate Nodes, Weights, and Collocation Matrices (n=3 to 64).</p>
      </header>

      <div className="solver-controls">
        <div className="solver-input-group">
            <label htmlFor="order-n" className="solver-label">Polynomial Order (n):</label>
            <input
                type="number"
                id="order-n"
                value={n}
                onChange={(e) => setN(Number(e.target.value))}
                min="3"
                max="64"
                className="solver-input"
            />
        </div>
        <button
            onClick={handleCalculate}
            disabled={isLoading}
            className="solver-button"
            style={{'--color-q1': 'var(--color-q3)'}} /* Use Q3 color for button */
        >
            {isLoading ? 'Calculating...' : 'Calculate'}
        </button>
      </div>

      {error && <div className="solver-error"><strong>Error:</strong> {error}</div>}

      {results && (
        <div className="animate-fade-in">
          <div className="stats-bar">
            <div className="stats-item">
              <div className="stats-label">Order (n)</div>
              <div className="stats-value">{results.order}</div>
            </div>
            <div className="stats-item">
              <div className="stats-label">Compute Time</div>
              <div className="stats-value">{results.computation_time}</div>
            </div>
          </div>

          <div className="solver-tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="tab-content">
            {activeTab === 'plot' && (
              <div className="solver-chart-card">
                <Scatter data={chartData} options={chartOptions} />
              </div>
            )}
            {activeTab === 'nodes' && (
              <VectorDisplay
                title="Gauss-Legendre Nodes (Roots of P_n)"
                vector={results.nodes}
              />
            )}
            {activeTab === 'weights' && (
              <div className="solver-results-grid">
                <VectorDisplay
                  title="Weights (from Golub-Welsch)"
                  vector={results.weights_golub_welsch}
                />
                <VectorDisplay
                  title="Weights (from Lagrangian Formula)"
                  vector={results.weights_lagrange}
                />
              </div>
            )}
            {activeTab === 'matrices' && (
               <div className="solver-matrices-container">
                <MatrixDisplay
                  title={`Collocation 'A' Matrix `}
                  matrix={results.collocation_A}
                />
                <MatrixDisplay
                  title={`Collocation 'B' Matrix (Weights) `}
                  matrix={results.collocation_B}
                />
               </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ================================================
// --- Assignment 4: Heat ODE Page ---
// ================================================
function HeatOdePage() {
  const [n, setN] = useState(32);
  const [etaMax, setEtaMax] = useState(6.0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);
  
  const handleCalculate = async () => {
    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/heat-ode/solve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ n: n, eta_max: etaMax }),
      });
      if (!response.headers.get("content-type")?.includes("application/json")) {
        const text = await response.text();
        throw new Error(`Server returned non-JSON response: ${text}`);
      }
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'An unknown error occurred.');
      }
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Chart.js data and options
  const chartData = {
    labels: results?.nodes_eta || [],
    datasets: [
      {
        label: 'Numerical Solution (f)',
        data: results?.f_numerical || [],
        borderColor: 'var(--color-q4)',
        backgroundColor: 'rgba(252, 176, 69, 0.2)',
        tension: 0.1,
        pointRadius: 2,
      },
      {
        label: 'Analytical Solution (erf)',
        data: results?.f_analytical || [],
        borderColor: 'var(--color-q1)',
        backgroundColor: 'rgba(0, 240, 255, 0.2)',
        tension: 0.1,
        pointRadius: 2,
        borderDash: [5, 5],
      }
    ]
  };
  
  const chartOptions = {
    responsive: true,
    scales: {
      x: {
        title: { text: 'Eta (η)', display: true, color: 'var(--color-text-secondary)' },
        ticks: { color: 'var(--color-text-secondary)' },
        grid: { color: 'var(--color-border)' }
      },
      y: {
        title: { text: 'Solution (f(η))', display: true, color: 'var(--color-text-secondary)' },
        ticks: { color: 'var(--color-text-secondary)' },
        grid: { color: 'var(--color-border)' }
      }
    },
    plugins: {
      legend: { labels: { color: 'var(--color-text-primary)' } },
      tooltip: {
        mode: 'index',
        intersect: false,
      }
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
  };

  return (
    <div className="heat-page question-page solver-page">
      <BackButton />
      <header className="solver-header">
        <h1>Heat Equation BVP Solver</h1>
        <p>Solving f'' + 2ηf' = 0 .</p>
      </header>

      <div className="solver-controls">
        <div className="solver-input-group">
            <label htmlFor="order-n" className="solver-label">Grid Points (n):</label>
            <input
                type="number"
                id="order-n"
                value={n}
                onChange={(e) => setN(Number(e.target.value))}
                min="10"
                max="200"
                className="solver-input"
            />
        </div>
        <div className="solver-input-group">
            <label htmlFor="eta-max" className="solver-label">Eta Max (η_max):</label>
            <input
                type="number"
                id="eta-max"
                step="0.1"
                value={etaMax}
                onChange={(e) => setEtaMax(Number(e.target.value))}
                min="2"
                max="10"
                className="solver-input"
            />
        </div>
        <button
            onClick={handleCalculate}
            disabled={isLoading}
            className="solver-button"
            style={{'--color-q1': 'var(--color-q4)'}} /* Use Q4 color */
        >
            {isLoading ? 'Calculating...' : 'Solve'}
        </button>
      </div>

      {error && <div className="solver-error"><strong>Error:</strong> {error}</div>}

      {results && (
        <div className="animate-fade-in">
          <div className="solver-chart-card" style={{maxWidth: '900px', margin: '0 auto 2rem auto'}}>
            <Line data={chartData} options={chartOptions} />
          </div>
          
          <div className="solver-results-grid">
            <VectorDisplay
                title="Numerical Solution (f)"
                vector={results.f_numerical}
            />
            <VectorDisplay
                title="Analytical Solution (erf)"
                vector={results.f_analytical}
            />
          </div>
        </div>
      )}
    </div>
  );
}


// ================================================
// --- Main App Component (Router) ---
// ================================================
export default function App() {
  return (
    <>
      <AppStyles />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HubPage />} />
          <Route path="/harshad" element={<HarshadPage />} />
          <Route path="/legendre" element={<LegendrePage />} />
          <Route path="/gauss-quad" element={<GaussQuadPage />} />
          <Route path="/heat-ode" element={<HeatOdePage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
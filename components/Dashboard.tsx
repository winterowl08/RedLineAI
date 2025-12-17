import React, { useState } from 'react';
import { DiligenceReport, RiskSeverity } from '../types';
import { AlertIcon, CheckCircleIcon, DocumentIcon, BrandLogo } from './Icons';

interface DashboardProps {
  report: DiligenceReport;
  onReset: () => void;
}

const SeverityBadge: React.FC<{ severity: RiskSeverity }> = ({ severity }) => {
  const styles = {
    [RiskSeverity.HIGH]: 'bg-red-100 text-red-800 border-red-200',
    [RiskSeverity.MEDIUM]: 'bg-amber-100 text-amber-800 border-amber-200',
    [RiskSeverity.LOW]: 'bg-slate-100 text-slate-700 border-slate-200',
  };
  
  const labels = {
    [RiskSeverity.HIGH]: 'Critical Risk',
    [RiskSeverity.MEDIUM]: 'Material Issue',
    [RiskSeverity.LOW]: 'Minor Issue',
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[severity]}`}>
      {labels[severity] || severity}
    </span>
  );
};

export const Dashboard: React.FC<DashboardProps> = ({ report, onReset }) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'detailed' | 'amendments' | 'questions'>('summary');

  const highRisks = report.executiveSummary.topRisks.filter(r => r.severity === RiskSeverity.HIGH).length;
  const mediumRisks = report.executiveSummary.topRisks.filter(r => r.severity === RiskSeverity.MEDIUM).length;
  const lowRisks = report.executiveSummary.topRisks.filter(r => r.severity === RiskSeverity.LOW).length;

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col flex-shrink-0">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <img
              src="/redlinelogo1.png"
              alt="RedLineAI"
              className="h-14 w-auto"
              />
          </div>
          <p className="text-xs text-slate-500 mt-4">v2.5 Pro Reasoner</p>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {[
            { id: 'summary', label: 'Executive Summary' },
            { id: 'detailed', label: 'Detailed Findings' },
            { id: 'amendments', label: 'Amendment Resolution' },
            { id: 'questions', label: 'Counsel Questions' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-[#FF2525] text-white shadow-lg shadow-red-900/50'
                  : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={onReset}
            className="w-full px-4 py-2 border border-slate-700 rounded-lg text-xs font-medium hover:bg-slate-800 transition-colors text-slate-400"
          >
            Start New Analysis
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 flex-shrink-0">
          <h1 className="text-xl font-semibold text-slate-800 capitalize">
            {activeTab.replace(/([A-Z])/g, ' $1').trim()}
          </h1>
          <div className="flex items-center space-x-4">
             <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
               All documents processed • Whole-Context Mode
             </span>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-6xl mx-auto space-y-8">
            
            {/* EXECUTIVE SUMMARY */}
            {activeTab === 'summary' && (
              <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   <div className="bg-white p-6 rounded-xl border border-red-100 shadow-sm">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-red-700 font-semibold">Critical Risks</p>
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                      </div>
                      <p className="text-4xl font-bold text-slate-900 mt-2 tracking-tight">
                        {highRisks}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">Deal-Breakers</p>
                   </div>
                   <div className="bg-white p-6 rounded-xl border border-amber-100 shadow-sm">
                      <p className="text-sm text-amber-700 font-semibold">Material Issues</p>
                      <p className="text-4xl font-bold text-slate-900 mt-2 tracking-tight">
                        {mediumRisks}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">Value Erosion</p>
                   </div>
                   <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                      <p className="text-sm text-slate-600 font-semibold">Minor Issues</p>
                      <p className="text-4xl font-bold text-slate-900 mt-2 tracking-tight">
                        {lowRisks}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">Operational / Hygiene</p>
                   </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                    <h3 className="text-sm font-semibold text-slate-900">Risk Inventory</h3>
                    <span className="text-xs text-slate-500 font-medium">Sorted by Severity</span>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {report.executiveSummary.topRisks.map((risk, idx) => (
                      <div key={idx} className="p-6 hover:bg-slate-50 transition-colors">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="text-base font-semibold text-slate-900">{risk.title}</h4>
                          <SeverityBadge severity={risk.severity} />
                        </div>
                        <p className="text-sm text-slate-600 mb-4">{risk.impact}</p>
                        <div className="flex items-center text-xs font-medium">
                          {risk.remediable ? (
                            <span className="flex items-center text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                              <CheckCircleIcon />
                              <span className="ml-1.5">Remediable Pre-Close</span>
                            </span>
                          ) : (
                            <span className="flex items-center text-amber-600 bg-amber-50 px-2 py-1 rounded">
                              <AlertIcon />
                              <span className="ml-1.5">Structural Risk</span>
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* DETAILED FINDINGS */}
            {activeTab === 'detailed' && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                {report.detailedFindings.map((finding, idx) => (
                  <div key={idx} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                      <h3 className="text-lg font-semibold text-slate-900">{finding.risk}</h3>
                    </div>
                    
                    <div className="bg-slate-50 rounded-lg p-4 mb-4 text-sm text-slate-700 leading-relaxed border border-slate-100">
                      <span className="font-semibold text-slate-900 block mb-1">Reasoning & Synthesis:</span>
                      {finding.reasoning}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-slate-500 font-medium block mb-1">Sources:</span>
                        <div className="flex flex-wrap gap-2">
                          {finding.documents.map((doc, i) => (
                            <span key={i} className="inline-flex items-center px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-600">
                              <DocumentIcon />
                              <span className="ml-1.5 truncate max-w-[150px]">{doc}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-500 font-medium block mb-1">Specific Reference:</span>
                        <p className="text-slate-800 font-mono text-xs bg-slate-50 p-2 rounded border border-slate-100">
                          {finding.references}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* AMENDMENT RESOLUTION */}
            {activeTab === 'amendments' && (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in slide-in-from-right-4 duration-500">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4 font-semibold text-slate-900">Contract</th>
                      <th className="px-6 py-4 font-semibold text-slate-900">Original Clause</th>
                      <th className="px-6 py-4 font-semibold text-slate-900">Amending Doc</th>
                      <th className="px-6 py-4 font-semibold text-slate-900">Final Controlling Position</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {report.amendmentResolution.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-900">{item.contract}</td>
                        <td className="px-6 py-4 text-slate-500 line-through">{item.originalClause}</td>
                        <td className="px-6 py-4 text-[#FF2525] font-medium">{item.amendingDocument}</td>
                        <td className="px-6 py-4 text-slate-800 bg-emerald-50/50">{item.finalPosition}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* QUESTIONS */}
            {activeTab === 'questions' && (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 animate-in slide-in-from-right-4 duration-500">
                 <h3 className="text-lg font-semibold text-slate-900 mb-6">Generated Diligence Request List</h3>
                 <ul className="space-y-4">
                    {report.questionsForCounsel.map((q, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-red-100 text-[#FF2525] text-xs font-bold mt-0.5 mr-3">
                          {idx + 1}
                        </span>
                        <span className="text-slate-700">{q}</span>
                      </li>
                    ))}
                 </ul>
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
};
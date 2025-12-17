import React, { useEffect, useState } from 'react';
import { BrandLogo } from './Icons';

const steps = [
  "Ingesting Virtual Data Room...",
  "Standardizing Document Formats...",
  "Identifying Cross-References...",
  "Resolving Amendment Hierarchies...",
  "Synthesizing Legal Risks...",
  "Validating Financial Clauses...",
  "Generating Final Report..."
];

export const ProcessingView: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-8 animate-in fade-in duration-500">
      <div className="relative w-32 h-32">
        <div className="absolute inset-0 rounded-full border-4 border-slate-200"></div>
        <div className="absolute inset-0 rounded-full border-4 border-[#FF2525] border-t-transparent animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center pl-2 pt-1">
          <img
              src="/redlinelogo1.png"
              alt="RedLineAI"
              className="h-14 w-auto"
              />
        </div>
      </div>
      
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-slate-800">RedLineAI is reasoning</h2>
        <p className="text-slate-500">Analyzing whole-corpus context. Do not close this window.</p>
      </div>

      <div className="w-full max-w-md bg-slate-100 rounded-full h-1.5 overflow-hidden">
        <div 
          className="bg-[#FF2525] h-1.5 rounded-full transition-all duration-500"
          style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
        />
      </div>

      <div className="h-8 flex items-center justify-center">
        <p className="text-sm font-medium text-[#FF2525] animate-pulse transition-all duration-300">
          {steps[currentStep]}
        </p>
      </div>
    </div>
  );
};
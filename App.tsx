import React, { useState, useCallback } from 'react';
import { UploadIcon, BrandLogo } from './components/Icons';
import { ProcessingView } from './components/ProcessingView';
import { Dashboard } from './components/Dashboard';
import { analyzeDocuments, fileToBase64 } from './services/geminiService';
import { AppStatus, FileUpload, DiligenceReport } from './types';

function App() {
  const [status, setStatus] = useState<AppStatus>('idle');
  const [files, setFiles] = useState<FileUpload[]>([]);
  const [report, setReport] = useState<DiligenceReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      // Explicitly type the array to File[] to fix 'unknown' type errors
      const selectedFiles: File[] = Array.from(event.target.files);
      setStatus('analyzing');
      setError(null);

      try {
        // Process files to Base64
        const processedFiles: FileUpload[] = await Promise.all(
          selectedFiles.map(async (file) => ({
            name: file.name,
            type: file.type,
            size: file.size,
            data: await fileToBase64(file),
          }))
        );

        setFiles(processedFiles);

        // Perform analysis
        const analysisResult = await analyzeDocuments(processedFiles);
        setReport(analysisResult);
        setStatus('complete');

      } catch (err: any) {
        console.error(err);
        setError(err.message || "An unexpected error occurred during analysis.");
        setStatus('error');
      }
    }
  }, []);

  const handleReset = () => {
    setStatus('idle');
    setFiles([]);
    setReport(null);
    setError(null);
  };

  if (status === 'analyzing') {
    return (
      <div className="h-screen w-screen bg-white">
        <ProcessingView />
      </div>
    );
  }

  if (status === 'complete' && report) {
    return <Dashboard report={report} onReset={handleReset} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Landing/Upload State */}
      <header className="py-6 px-8 border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
             <img
              src="/redlinelogo1.png"
              alt="RedLineAI"
              className="h-14 w-auto"
              />

          </div>
          <div className="text-sm font-medium text-slate-500">Autonomous M&A Intelligence</div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-2xl text-center space-y-8 animate-in fade-in zoom-in duration-500">
          
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
              Total Recall Diligence.
            </h1>
            <p className="text-lg text-slate-600 max-w-xl mx-auto">
              Ingest your entire Virtual Data Room. Identify deal-breaking risks, resolve contradictions, and detect hidden liabilities across thousands of pages instantly.
            </p>
          </div>

          <div className="mt-12 bg-white rounded-2xl shadow-xl shadow-slate-200/50 border-2 border-dashed border-slate-300 p-12 transition-all hover:border-[#FF2525] hover:bg-slate-50 group cursor-pointer relative">
            <input 
              type="file" 
              multiple 
              onChange={handleFileSelect} 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="flex flex-col items-center space-y-4 group-hover:-translate-y-1 transition-transform duration-300">
              <div className="p-4 bg-red-50 text-[#FF2525] rounded-full group-hover:bg-red-100 transition-colors">
                <UploadIcon />
              </div>
              <div>
                <p className="text-lg font-semibold text-slate-900">
                  Drop VDR documents here
                </p>
                <p className="text-sm text-slate-500 mt-1">
                  Supports PDF, DOCX, TXT. No file limit.
                </p>
              </div>
              <div className="pt-4">
                <span className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg shadow-lg shadow-slate-900/20">
                  Select Files
                </span>
              </div>
            </div>
          </div>

          {status === 'error' && (
             <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 text-sm">
               Error: {error}. Please check your API key and try again.
             </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left mt-12 opacity-70">
            <div className="p-4 rounded-lg border border-slate-200 bg-white/50">
              <h3 className="font-semibold text-slate-900 text-sm">Cross-Document Reasoning</h3>
              <p className="text-xs text-slate-500 mt-1">Links obligations across master agreements, addenda, and financial schedules.</p>
            </div>
            <div className="p-4 rounded-lg border border-slate-200 bg-white/50">
              <h3 className="font-semibold text-slate-900 text-sm">Amendment Resolution</h3>
              <p className="text-xs text-slate-500 mt-1">Automatically determines controlling clauses from conflicting amendment layers.</p>
            </div>
            <div className="p-4 rounded-lg border border-slate-200 bg-white/50">
              <h3 className="font-semibold text-slate-900 text-sm">Risk-First Analysis</h3>
              <p className="text-xs text-slate-500 mt-1">Prioritizes deal-breakers like CoC, uncapped indemnities, and concentration risk.</p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default App;
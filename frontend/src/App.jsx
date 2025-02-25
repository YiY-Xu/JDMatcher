// src/App.jsx
import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import ResumeUpload from './components/ResumeUpload';
import JobDescriptionInput from './components/JobDescriptionInput';
import ResultPoller from './components/ResultPoller';
import { useAnalysisResult } from './hooks/useAnalysisResult';
import './styles/main.css';

function App() {
  const [resumeIdentifier, setResumeIdentifier] = useState(null);
  const [jobUrl, setJobUrl] = useState('');
  const [uploadResetCounter, setUploadResetCounter] = useState(0);

  const { compoundKey, analyzing, analyzeError, handleAnalyze, resetAnalysis } = useAnalysisResult();

  const isAnalyzeDisabled = !jobUrl || !resumeIdentifier;

  const handleReset = () => {
    // Clear input state
    setResumeIdentifier(null);
    setJobUrl('');
    
    // Reset analysis state in the custom hook
    // This should include canceling any pending API requests
    resetAnalysis();
    
    // Force ResumeUpload component to remount
    setUploadResetCounter(prev => prev + 1);
  };

  return (
    <div className="app-container">
      <header className="header">
        <div className="logo-container">
          <div className="logo-icon">
            <Upload size={24} />
          </div>
          <h1 className="app-title">JDMatcher</h1>
        </div>
        <p className="app-description">Match your resume to job descriptions and get personalized insights</p>
      </header>
      
      <main className="app-main">
        <div className="card">
          {/* Resume Upload Component */}
          <ResumeUpload 
            key={uploadResetCounter} 
            onFileUpload={(uniqueId) => setResumeIdentifier(uniqueId)} 
          />
          
          {/* Job Description Input */}
          <div className="form-group">
            <label className="form-label">Job Description URL</label>
            <div className="input-button-row">
              <JobDescriptionInput value={jobUrl} onChange={setJobUrl} />
              <div className="button-group">
                <button 
                  className={`analyze-btn ${!isAnalyzeDisabled ? 'enabled' : ''}`}
                  onClick={() => handleAnalyze(resumeIdentifier, jobUrl)} 
                  disabled={isAnalyzeDisabled}
                >
                  Analyze
                </button>
                <button 
                  className="reset-btn" 
                  onClick={handleReset}
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
          
          {/* Analysis Progress */}
          {analyzing && (
            <div className="progress-container">
              <div className="progress-status">
                <div className="progress-spinner"></div>
                <p>Analyzing your resume against job requirements...</p>
              </div>
              <div className="progress-bar">
                <div className="progress-bar-inner"></div>
              </div>
            </div>
          )}
          
          {analyzeError && (
            <div className="status-error mt-4">
              <p>{analyzeError}</p>
            </div>
          )}
        </div>
        
        {/* Results Poller - Only render when compoundKey exists */}
        {compoundKey && <ResultPoller compoundKey={compoundKey} />}
      </main>
      
      <footer className="footer">
        <p>© 2025 JDMatcher. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
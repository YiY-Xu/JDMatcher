import React from 'react';
import { CheckCircle, AlertCircle, AlertTriangle, Mail } from 'lucide-react';

function Report({ data }) {
  const getScoreClass = (score) => {
    if (score >= 8.5) return 'score-high';
    if (score >= 7) return 'score-medium';
    return 'score-low';
  };

  // Helper function to format the cover letter text into paragraphs
  const formatCoverLetter = (text) => {
    if (!text) return [];
    
    // Extract the main letter body (excluding header and signature)
    const fullText = text.trim();
    
    // Split text into paragraphs based on line breaks or double spaces
    const paragraphs = fullText.split(/\n\s*\n|\r\n\s*\r\n|\r\s*\r/)
      .map(p => p.trim())
      .filter(p => p.length > 0);
    
    return paragraphs;
  };

  // Extract contact information from cover letter if available
  const extractContactInfo = () => {
    if (!data.coverLetter) return {};
    
    const emailMatch = data.coverLetter.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/i);
    const phoneMatch = data.coverLetter.match(/(\d{3}[-.\s]?\d{3}[-.\s]?\d{4})/);
    
    return {
      email: emailMatch ? emailMatch[0] : '',
      phone: phoneMatch ? phoneMatch[0] : ''
    };
  };

  const contactInfo = extractContactInfo();

  return (
    <div className="report-container">
      <div className="report-header">
        <div>
          <h2 className="text-xl font-bold">Candidate Evaluation</h2>
          <p>
            <strong>Name:</strong> {data.candidate}
            <br />
            <strong>Position:</strong> {data.position}
          </p>
        </div>
        <div className={`score-badge ${getScoreClass(data.fitScore)}`}>
          {data.fitScore}/10
        </div>
      </div>

      {data.fitAnalysis && (
        <div className="report-grid">
          {data.fitAnalysis.strengths && data.fitAnalysis.strengths.length > 0 && (
            <div className="card strengths-card">
              <h3 className="section-title strengths-title">
                <CheckCircle size={18} className="mr-2" />
                Strengths
              </h3>
              <ul>
                {data.fitAnalysis.strengths.map((strength, index) => (
                  <li key={index} className="list-item">{strength}</li>
                ))}
              </ul>
            </div>
          )}
          
          {data.fitAnalysis.gaps && data.fitAnalysis.gaps.length > 0 && (
            <div className="card gaps-card">
              <h3 className="section-title gaps-title">
                <AlertTriangle size={18} className="mr-2" />
                Areas for Improvement
              </h3>
              <ul>
                {data.fitAnalysis.gaps.map((gap, index) => (
                  <li key={index} className="list-item">{gap}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {data.resumeTailoringSuggestions && data.resumeTailoringSuggestions.length > 0 && (
        <div className="card suggestions-card mt-6">
          <h3 className="section-title suggestions-title">
            <AlertCircle size={18} className="mr-2" />
            Resume Tailoring Suggestions
          </h3>
          <ol className="suggestions-list">
            {data.resumeTailoringSuggestions.map((suggestion, index) => (
              <li key={index} className="suggestions-list-item">{suggestion}</li>
            ))}
          </ol>
        </div>
      )}

      {data.coverLetter && data.coverLetter.trim() !== "" && (
        <div className="cover-letter">
          <h3 className="section-title">
            <Mail size={18} className="mr-2" />
            Cover Letter
          </h3>
          <div className="cover-letter-content">
            <div className="cover-letter-header">
              <div className="cover-letter-metadata">
                <span className="cover-letter-label">From:</span>
                <span>{data.candidate} {contactInfo.email ? `<${contactInfo.email}>` : ''}</span>
              </div>
              {contactInfo.phone && (
                <div className="cover-letter-metadata">
                  <span className="cover-letter-label">Phone:</span>
                  <span>{contactInfo.phone}</span>
                </div>
              )}
              <div className="cover-letter-metadata">
                <span className="cover-letter-label">To:</span>
                <span>Hiring Manager, {data.company || 'Company'}</span>
              </div>
              <div className="cover-letter-metadata">
                <span className="cover-letter-label">Subject:</span>
                <span>Application for {data.position} position</span>
              </div>
            </div>
            
            <div className="cover-letter-body">
              {formatCoverLetter(data.coverLetter).map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
            
            <div className="cover-letter-signature">
              <p>Warm regards,</p>
              <p><strong>{data.candidate}</strong></p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Report;
// src/components/JobDescriptionInput.jsx
import React from 'react';
import { Briefcase } from 'lucide-react';

function JobDescriptionInput({ value, onChange }) {
  return (
    <div className="job-input-wrapper">
      <Briefcase className="job-input-icon" size={18} />
      <input
        type="text"
        placeholder="Paste Job Description URL Here"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="job-input"
      />
    </div>
  );
}

export default JobDescriptionInput;
// src/components/ResultPoller.jsx
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Report from './Report';
import { RESULT_STATUS_ENDPOINT, GET_RESULT_ENDPOINT } from '../config';

function ResultPoller({ compoundKey }) {
  const [status, setStatus] = useState("PENDING");
  const [finalData, setFinalData] = useState(null);
  const [error, setError] = useState(null);
  const POLL_INTERVAL = 5000;
  const intervalIdRef = useRef(null);

  useEffect(() => {
    if (!compoundKey) return;
    
    const pollForResults = async () => {
      try {
        // Simple GET request without the AbortController for now
        const res = await axios.get(`${RESULT_STATUS_ENDPOINT}?key=${compoundKey}`);
        
        if (res.data && res.data.status) {
          const currentStatus = res.data.status;
          setStatus(currentStatus);
          
          if (currentStatus === "COMPLETED") {
            clearInterval(intervalIdRef.current);
            try {
              const getResultRes = await axios.get(`${GET_RESULT_ENDPOINT}?key=${compoundKey}.json`);
              setFinalData(getResultRes.data);
            } catch (resultError) {
              console.error("Error fetching results:", resultError);
              setError("Error retrieving analysis results. Please try again.");
            }
          }
        } else {
          // Handle unexpected response format
          console.error("Unexpected response format:", res.data);
          setError("Received an invalid response from the server. Please try again.");
        }
      } catch (err) {
        console.error("Polling error:", err);
        setError("Error polling for result. The server might be temporarily unavailable.");
        clearInterval(intervalIdRef.current);
      }
    };

    // Initial poll
    pollForResults();
    
    // Set up interval for polling
    intervalIdRef.current = setInterval(pollForResults, POLL_INTERVAL);

    // Cleanup function
    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
      }
    };
  }, [compoundKey]);

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <p className="error-suggestion">Please check your network connection and try again.</p>
      </div>
    );
  }

  if (status !== "COMPLETED") {
    return (
      <div className="progress-container">
        <div className="progress-status">
          <div className="progress-spinner"></div>
          <p>Analyzing your resume... (Status: {status})</p>
        </div>
        <div className="progress-bar">
          <div className="progress-bar-inner"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {finalData ? (
        <Report data={finalData} />
      ) : (
        <div className="progress-container">
          <div className="progress-status">
            <div className="progress-spinner"></div>
            <p>Loading results...</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResultPoller;
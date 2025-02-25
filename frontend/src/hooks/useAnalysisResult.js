// src/hooks/useAnalysisResult.js
import { useState } from "react";
import axios from "axios";
import SparkMD5 from "spark-md5";
import { ANALYZE_ENDPOINT } from "../config";

export const useAnalysisResult = () => {
  const [compoundKey, setCompoundKey] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzeError, setAnalyzeError] = useState(null);

  const handleAnalyze = async (uniqueResumeIdentifier, jobUrl) => {
    setAnalyzing(true);
    setAnalyzeError(null);
    
    try {
      const jobUrlHash = SparkMD5.hash(jobUrl);
      const newCompoundKey = `${uniqueResumeIdentifier}-${jobUrlHash}`;
      
      await axios.post(ANALYZE_ENDPOINT, {
        compound_key: newCompoundKey,
        unique_resume_identifier: uniqueResumeIdentifier,
        job_url: jobUrl,
      });
      
      setCompoundKey(newCompoundKey);
    } catch (error) {
      console.error("Analysis error:", error);
      setAnalyzeError(error.response?.data?.detail || "Failed to start analysis. Please try again.");
      setCompoundKey(null);
    } finally {
      setAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setCompoundKey(null);
    setAnalyzing(false);
    setAnalyzeError(null);
  };

  return { compoundKey, analyzing, analyzeError, handleAnalyze, resetAnalysis };
};
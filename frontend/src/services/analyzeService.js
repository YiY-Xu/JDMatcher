import axios from 'axios';
import SparkMD5 from 'spark-md5';
import { ANALYZE_ENDPOINT } from '../config';

export const initiateAnalysis = async ({ uniqueResumeIdentifier, jobUrl }) => {
  const jobUrlHash = SparkMD5.hash(jobUrl);
  const compoundKey = `${uniqueResumeIdentifier}-${jobUrlHash}`;

  try {
    const response = await axios.post(ANALYZE_ENDPOINT, {
      compound_key: compoundKey,
      unique_resume_identifier: uniqueResumeIdentifier,
      job_url: jobUrl,
    });
    return { ...response.data, compoundKey };
  } catch (error) {
    throw new Error(error.response?.data?.detail || error.message);
  }
};
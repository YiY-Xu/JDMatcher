import React, { useState } from 'react';
import axios from 'axios';
import SparkMD5 from 'spark-md5';
import { Upload, CheckCircle, FileUp } from 'lucide-react'; // Assumed you'll install lucide-react
import { UPLOAD_RESUME_ENDPOINT } from '../config';

// Utility function to compute MD5 hash of a file as an ArrayBuffer.
function computeFileHash(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const arrayBuffer = e.target.result;
      const hash = SparkMD5.ArrayBuffer.hash(arrayBuffer);
      resolve(hash);
    };
    reader.onerror = () => {
      reject(new Error("Error reading file for hash computation."));
    };
    reader.readAsArrayBuffer(file);
  });
}

function ResumeUpload({ onFileUpload }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    setUploadError(null);
    setUploading(true);
    setUploadMessage("");

    try {
      // Compute the MD5 hash of the file.
      const fileHash = await computeFileHash(file);

      // Request a presigned URL from the backend
      const presignResponse = await axios.get(UPLOAD_RESUME_ENDPOINT, {
        params: { 
          filename: file.name, 
          file_hash: fileHash,
          content_type: file.type,
        },
      });

      if (presignResponse.data.error) {
        throw new Error(presignResponse.data.error);
      }

      let versionId;
      if (presignResponse.data.file_exists) {
        versionId = presignResponse.data.version_id;
      } else {
        const presignedUrl = presignResponse.data.url;
        const putResponse = await axios.put(presignedUrl, file, {
          headers: {
            "Content-Type": file.type,
          },
        });
        versionId = putResponse.headers["x-amz-version-id"];
      }
      const uniqueResumeIdentifier = `${file.name}-${versionId}`;
      setUploadMessage("Resume is ready to process");

      if (onFileUpload) {
        onFileUpload(uniqueResumeIdentifier);
      } 
    } catch (error) {
      console.error("Upload error:", error);
      setUploadError("Failed to upload file: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="component-container">
      <div className={`upload-container ${selectedFile && !uploadError ? 'active' : ''}`}>
        {selectedFile && !uploadError ? (
          <div className="text-center">
            <CheckCircle size={36} className="mx-auto mb-2 text-success" />
            <p className="font-medium text-success">Resume uploaded successfully</p>
            <p className="text-sm text-gray-600 mt-1">{selectedFile.name}</p>
            <label className="upload-button mt-3 inline-block cursor-pointer">
              Replace File
              <input
                type="file"
                className="upload-input"
                onChange={handleFileChange}
              />
            </label>
          </div>
        ) : (
          <div className="text-center">
            <Upload size={36} className="mx-auto mb-2 text-primary" />
            <p className="font-medium">Drag & drop your resume</p>
            <p className="text-sm text-gray-500 mt-1 mb-3">or</p>
            <label className="upload-button">
              Browse Files
              <input
                type="file"
                className="upload-input"
                onChange={handleFileChange}
              />
            </label>
          </div>
        )}
      </div>
      
      {uploading && (
        <div className="upload-status text-center">
          <div className="progress-spinner mx-auto mb-2"></div>
          <p>Uploading your resume...</p>
        </div>
      )}
      
      {uploadError && (
        <div className="upload-status status-error">
          <p>{uploadError}</p>
        </div>
      )}
      
      {uploadMessage && !uploadError && !uploading && (
        <div className="upload-status status-success">
          <p>{uploadMessage}</p>
        </div>
      )}
    </div>
  );
}

export default ResumeUpload;
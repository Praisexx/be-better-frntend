import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { uploadAPI } from '../services/api';
import toast from 'react-hot-toast';
import '../styles/Upload.css';

const Upload = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];

    if (!file) return;

    // Validate file type
    if (!file.name.endsWith('.csv')) {
      toast.error('Please upload a CSV file');
      return;
    }

    // Validate file size (200MB)
    if (file.size > 200 * 1024 * 1024) {
      toast.error('File size exceeds 200MB limit');
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      const response = await uploadAPI.uploadCSV(file, (percentCompleted) => {
        setProgress(percentCompleted);
      });

      toast.success('File uploaded successfully! Analysis started.');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Upload failed');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  }, [navigate]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv']
    },
    multiple: false,
    maxSize: 200 * 1024 * 1024
  });

  return (
    <div className="upload-container">
      <div className="upload-header">
        <h1>Upload Your Data</h1>
        <button onClick={() => navigate('/dashboard')} className="btn-secondary">
          ← Back to Dashboard
        </button>
      </div>

      <div className="upload-content">
        <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
          <input {...getInputProps()} />
          {uploading ? (
            <div className="upload-progress">
              <p>Uploading... {progress}%</p>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
          ) : isDragActive ? (
            <p>Drop your CSV file here...</p>
          ) : (
            <div className="dropzone-content">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <p>Drag & drop your CSV file here</p>
              <p className="small-text">or click to browse</p>
              <p className="small-text">Maximum file size: 200MB</p>
            </div>
          )}
        </div>

        <div className="upload-info">
          <h3>What Happens Next?</h3>
          <ol>
            <li>Your CSV file will be uploaded securely to our servers</li>
            <li>Our AI will analyze your data and identify your business niche</li>
            <li>We'll search the web for relevant companies in your industry</li>
            <li>You'll get comprehensive insights with live animated charts</li>
            <li>Download your analysis as a professional PDF report</li>
            <li>View detailed competitive analysis and recommendations</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default Upload;

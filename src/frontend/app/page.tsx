'use client';

import { useState, CSSProperties, useRef } from 'react';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile && droppedFile.type.startsWith('image/')) {
      setFile(droppedFile);
      setPreviewUrl(URL.createObjectURL(droppedFile));
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleUpload = async () => {
    if (!file) return;

    const uploadUrl = process.env.NEXT_PUBLIC_UPLOAD_URL;
    if (!uploadUrl) {
      console.error('Upload URL is not defined. Check your .env setup.');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      setProgress(0);
      setShowSuccess(false);

      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload to backend failed');
      }

      const result = await response.json();
      console.log('Upload successful:', result);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      console.log('Upload failed:', err);
    }
  };

  const containerStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(to bottom right, #0f2027, #203a43, #2c5364)',
    fontFamily: 'Inter, sans-serif',
    color: 'white',
    padding: '1rem',
  };

  const cardStyle: CSSProperties = {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(12px)',
    padding: '2.5rem',
    borderRadius: '1.25rem',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    maxWidth: '480px',
    width: '100%',
    textAlign: 'center',
    border: 'none',
  };

  const titleStyle: CSSProperties = {
    fontSize: '1.8rem',
    fontWeight: 600,
    marginBottom: '1.5rem',
  };

  const dropZoneStyle: CSSProperties = {
    border: '2px dashed #94a3b8',
    borderRadius: '0.75rem',
    padding: '2rem',
    marginBottom: '1rem',
    cursor: 'pointer',
    backgroundColor: '#1a1d34',
    transition: 'background-color 0.3s ease',
  };

  const progressBarContainerStyle: CSSProperties = {
    height: '8px',
    backgroundColor: '#2a2e45',
    borderRadius: '0.5rem',
    overflow: 'hidden',
    marginTop: '1rem',
    marginBottom: '1rem',
  };

  const progressBarStyle: CSSProperties = {
    height: '100%',
    width: `${progress}%`,
    background: 'linear-gradient(to right, #00ffe0, #00c3ff)',
    transition: 'width 0.3s ease',
  };

  const buttonStyle: CSSProperties = {
    background: 'linear-gradient(135deg, #00ffe0, #00c3ff)',
    color: '#000',
    border: 'none',
    padding: '0.8rem 1.2rem',
    borderRadius: '0.5rem',
    fontWeight: 600,
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  };

  const handleMouseOver = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.transform = 'scale(1.05)';
    e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 255, 255, 0.3)';
  };

  const handleMouseOut = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.transform = 'scale(1)';
    e.currentTarget.style.boxShadow = 'none';
  };

  return (
    <>
      <style jsx global>{`
        body {
          margin: 0;
        }
      `}</style>

      <div style={containerStyle}>
        <div style={cardStyle}>
          <h2 style={titleStyle}>Upload Image</h2>

          <div
            style={dropZoneStyle}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => inputRef.current?.click()}
          >
            {file ? (
              <p>{file.name}</p>
            ) : (
              <p>Drag & drop an image here, or click to select</p>
            )}
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
          </div>

          {progress > 0 && (
            <div style={progressBarContainerStyle}>
              <div style={progressBarStyle}></div>
            </div>
          )}

          <button
            style={buttonStyle}
            onClick={handleUpload}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
            disabled={!file}
          >
            Upload Now
          </button>

          {showSuccess && (
            <div style={{
              marginTop: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              color: '#00ffe0',
              fontWeight: 500,
              opacity: 1,
              transition: 'opacity 0.5s ease-in-out',
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00ffe0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Image uploaded successfully
            </div>
          )}
        </div>
      </div>
    </>
  );
}

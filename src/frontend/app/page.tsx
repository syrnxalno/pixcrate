'use client';

import { useState, CSSProperties, useRef, useEffect } from 'react';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDownload, setShowDownload] = useState(false);
  const [startAnimation, setStartAnimation] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setFile(selectedFile);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile && droppedFile.type.startsWith('image/')) {
      setFile(droppedFile);
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
      setShowSuccess(false);
      setShowDownload(false);
      setStartAnimation(true);

      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload to backend failed');
      const result = await response.json();

      console.log('Upload successful:', result);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      console.log('Upload failed:', err);
    }
  };

  useEffect(() => {
    if (startAnimation) {
      const timer = setTimeout(() => setShowDownload(true), 4200); // 4.2s
      return () => clearTimeout(timer);
    }
  }, [startAnimation]);

  // Shared styles
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
    flex: 1,
    whiteSpace: 'nowrap',
  };

  const glowingDotStyle = (top: string, left: string): CSSProperties => ({
    position: 'absolute',
    top,
    left,
    transform: 'translate(-50%, -50%)',
    background: 'radial-gradient(circle, #00ffe0 0%, #00c3ff 80%)',
    borderRadius: '50%',
    width: '14px',
    height: '14px',
    boxShadow: '0 0 10px #00ffe0, 0 0 20px #00c3ff',
    animation: 'pulse 2s infinite',
  });

  const labelStyle = (top: string, left: string): CSSProperties => ({
    position: 'absolute',
    top,
    left,
    transform: 'translate(-50%, -50%)',
    color: '#00ffe0',
    fontSize: '0.8rem',
    fontWeight: 600,
    marginTop: '1.2rem',
    textAlign: 'center',
  });

  return (
    <>
      <style jsx global>{`
        body {
          margin: 0;
        }
        @keyframes drawPath {
          from {
            stroke-dashoffset: 1000;
          }
          to {
            stroke-dashoffset: 0;
          }
        }
        @keyframes pulse {
          0%, 100% {
            box-shadow: 0 0 10px #00ffe0, 0 0 20px #00c3ff;
          }
          50% {
            box-shadow: 0 0 20px #00c3ff, 0 0 40px #00ffe0;
          }
        }
      `}</style>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: 'linear-gradient(to bottom right, #0f2027, #203a43, #2c5364)',
          fontFamily: 'Inter, sans-serif',
          color: 'white',
          padding: '2rem',
        }}
      >
        {/* Upload Card */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(12px)',
            padding: '2.5rem',
            borderRadius: '1.25rem',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            maxWidth: '480px',
            width: '100%',
            textAlign: 'center',
            marginRight: '2rem',
          }}
        >
          <h2 style={{ fontSize: '1.8rem', fontWeight: 600, marginBottom: '1.5rem' }}>Upload Image</h2>

          <div
            style={{
              border: '2px dashed #94a3b8',
              borderRadius: '0.75rem',
              padding: '2rem',
              marginBottom: '1.5rem',
              cursor: 'pointer',
              backgroundColor: '#1a1d34',
              transition: 'background-color 0.3s ease',
            }}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => inputRef.current?.click()}
          >
            <p>{file ? file.name : 'Drag & drop an image here, or click to select'}</p>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
          </div>

          {/* Buttons aligned side by side */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '1rem',
              marginTop: '1rem',
            }}
          >
            <button style={buttonStyle} onClick={handleUpload} disabled={!file}>
              Upload Now
            </button>

            {showDownload && (
              <button style={buttonStyle}>Download</button>
            )}
          </div>

          {/* Upload success message */}
          {showSuccess && (
            <div
              style={{
                marginTop: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                color: '#00ffe0',
                fontWeight: 500,
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00ffe0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Image uploaded successfully
            </div>
          )}
        </div>

        {/* Right-side animation panel */}
        <div style={{ width: '300px', height: '400px', position: 'relative' }}>
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 300 400"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Complex maze-like path */}
            <path
              d="M40 40 
                 H160 
                 V100 
                 H80 
                 V160 
                 H200 
                 V220 
                 H100 
                 V300 
                 H240"
              stroke="#00ffe0"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              strokeDasharray="1000"
              strokeDashoffset="1000"
              style={{
                animation: startAnimation ? 'drawPath 4.2s ease-in-out forwards' : undefined,
              }}
            />
          </svg>

          {/* Glowing points + labels */}
          <div style={glowingDotStyle('40px', '40px')}></div>
          <div style={labelStyle('60px', '40px')}>Resize</div>

          <div style={glowingDotStyle('100px', '160px')}></div>
          <div style={labelStyle('120px', '160px')}>Compress</div>

          <div style={glowingDotStyle('220px', '200px')}></div>
          <div style={labelStyle('240px', '200px')}>Watermark</div>

          <div style={glowingDotStyle('300px', '240px')}></div>
          <div style={labelStyle('320px', '240px')}>Save</div>
        </div>
      </div>
    </>
  );
}

'use client';

import { useState, CSSProperties } from 'react';

export default function DashboardPage() {
  return (
    <>
      <style jsx global>{`
        body {
          margin: 0;
          padding: 0;
        }
        html, body, #__next {
          height: 100%;
        }
      `}</style>

      <div style={containerStyle}>
        <iframe
          src={process.env.NEXT_PUBLIC_BULLBOARD_URL}
          style={iframeStyle}
        />
      </div>
    </>
  );
}

const containerStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
  margin: '0',
  padding: '0',
  overflow: 'hidden',
  position: 'absolute',
  width: '100%',
};

const iframeStyle: CSSProperties = {
  width: '100%',
  height: '100%',
  border: 'none',
};

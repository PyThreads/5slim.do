// src/components/SplashScreen.tsx
'use client';
import { CircularProgress } from '@mui/material';

export default function SplashScreen() {
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff', // fondo consistente
        zIndex: 9999,
        position: 'fixed',
        top: 0,
        left: 0,
      }}
    >
      <CircularProgress sx={{ color: '#5570F1' }} />
    </div>
  );
}

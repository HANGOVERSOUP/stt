import React, { useEffect } from 'react';

export default function App() {
  useEffect(() => {
    window.location.href = 'http://116.125.140.82:3000/components/main';
  }, []);

  return null;
}
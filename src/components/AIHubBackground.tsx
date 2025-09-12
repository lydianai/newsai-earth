'use client';

import React, { useEffect, useState } from 'react';

const AIHubBackground: React.FC = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Generate particles dynamically
  const generateParticles = (count: number, type: string) => {
    return Array.from({ length: count }, (_, i) => (
      <div
        key={`${type}-${i}`}
        className={`particle ${type}`}
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 20}s`,
          animationDuration: `${8 + Math.random() * 12}s`,
        }}
      />
    ));
  };

  // Generate dots matrix
  const generateDots = () => {
    const dots = [];
    for (let x = 0; x < 20; x++) {
      for (let y = 0; y < 12; y++) {
        dots.push(
          <div
            key={`dot-${x}-${y}`}
            className="dot"
            style={{
              left: `${(x * 100) / 20}%`,
              top: `${(y * 100) / 12}%`,
              animationDelay: `${Math.random() * 4}s`,
            }}
          />
        );
      }
    }
    return dots;
  };

  return (
    <div className="ai-hub-background">
      {/* Base gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-bg/50 to-bg opacity-90" />

      {/* Grid Pattern */}
      <div className="grid-pattern" />

      {/* Particle Systems */}
      <div className="particle-system">
        {generateParticles(50, 'particle-1')}
        {generateParticles(30, 'particle-2')}
        {generateParticles(40, 'particle-3')}
        {generateParticles(25, 'particle-4')}
      </div>

      {/* Neural Network Lines */}
      <div className="neural-network">
        <div className="neural-line" />
        <div className="neural-line" />
        <div className="neural-line" />
        <div className="neural-line" />
      </div>

      {/* Floating Orbs */}
      <div className="floating-orb orb-1" />
      <div className="floating-orb orb-2" />
      <div className="floating-orb orb-3" />

      {/* Data Streams */}
      <div className="data-stream stream-1" />
      <div className="data-stream stream-2" />
      <div className="data-stream stream-3" />
      <div className="data-stream stream-4" />
      <div className="data-stream stream-5" />
      <div className="data-stream stream-6" />

      {/* Dots Matrix */}
      <div className="dots-matrix">
        {generateDots()}
      </div>

      {/* AI HUB Watermark */}
      <div className="ai-hub-watermark">
        AI NEWS - HUB
      </div>
    </div>
  );
};

export default AIHubBackground;

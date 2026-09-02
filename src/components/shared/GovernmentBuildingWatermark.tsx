import React from 'react';

export const GovernmentBuildingWatermark: React.FC<{ className?: string }> = ({ className = "w-full h-auto opacity-15" }) => {
  return (
    <div className={`pointer-events-none select-none ${className}`}>
      <svg
        viewBox="0 0 500 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto text-slate-400"
      >
        <g stroke="currentColor" strokeWidth="1" opacity="0.4">
          {/* Central Dome (Rashtrapati Bhavan / Parliament style) */}
          <path d="M210 90 C210 40, 290 40, 290 90 Z" />
          <path d="M230 45 C230 30, 270 30, 270 45 Z" />
          <line x1="250" y1="30" x2="250" y2="15" />
          <circle cx="250" cy="15" r="2.5" fill="currentColor" />
          {/* Dome Ribs */}
          <path d="M225 90 C225 55, 250 45, 250 45" />
          <path d="M275 90 C275 55, 250 45, 250 45" />
          <path d="M240 90 C240 60, 250 45, 250 45" />
          <path d="M260 90 C260 60, 250 45, 250 45" />

          {/* Dome Drum Platform */}
          <rect x="200" y="90" width="100" height="15" rx="1" />
          {/* Windows on drum */}
          <line x1="215" y1="95" x2="215" y2="102" />
          <line x1="230" y1="95" x2="230" y2="102" />
          <line x1="245" y1="95" x2="245" y2="102" />
          <line x1="255" y1="95" x2="255" y2="102" />
          <line x1="270" y1="95" x2="270" y2="102" />
          <line x1="285" y1="95" x2="285" y2="102" />

          {/* Central Portico Pediment Triangle */}
          <path d="M190 120 L250 105 L310 120 Z" fill="currentColor" fillOpacity="0.05" />

          {/* Colonnade / Pillars */}
          {/* Left Wing Pillars */}
          <rect x="20" y="130" width="160" height="50" fill="currentColor" fillOpacity="0.03" />
          <line x1="10" y1="130" x2="490" y2="130" strokeWidth="2" />
          <line x1="10" y1="135" x2="490" y2="135" />
          
          {/* Individual Colonnade Pillars */}
          {[
            30, 45, 60, 75, 90, 105, 120, 135, 150, 165,
            200, 215, 230, 245, 255, 270, 285, 300,
            335, 350, 365, 380, 395, 410, 425, 440, 455, 470
          ].map((x, i) => (
            <g key={i}>
              <line x1={x} y1="135" x2={x} y2="180" strokeWidth="1.5" />
              <line x1={x + 5} y1="135" x2={x + 5} y2="180" strokeWidth="1.5" />
              <rect x={x - 1} y="135" width="8" height="2" />
              <rect x={x - 1} y="178" width="8" height="2" />
            </g>
          ))}

          {/* Right Wing */}
          <rect x="320" y="130" width="160" height="50" fill="currentColor" fillOpacity="0.03" />

          {/* Grand Stairs & Base Plinth */}
          <line x1="0" y1="180" x2="500" y2="180" strokeWidth="2" />
          <line x1="0" y1="185" x2="500" y2="185" />
          <line x1="0" y1="190" x2="500" y2="190" strokeWidth="1.5" />
          <line x1="0" y1="195" x2="500" y2="195" />
        </g>
      </svg>
    </div>
  );
};

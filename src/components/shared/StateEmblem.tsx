import React from 'react';

interface StateEmblemProps {
  className?: string;
  size?: number;
}

export const StateEmblem: React.FC<StateEmblemProps> = ({ className = "w-16 h-auto", size }) => {
  return (
    <div className={`flex flex-col items-center select-none flex-shrink-0 ${className}`} style={size ? { width: size } : undefined}>
      <svg
        viewBox="0 0 200 245"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto drop-shadow-xs object-contain"
      >
        {/* Ashoka Lion Capital Vector Illustration */}
        <g stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
          
          {/* Top Center Lion Head */}
          <path d="M90 25 C90 15, 110 15, 110 25 C115 28, 118 35, 115 42 C112 48, 108 50, 100 52 C92 50, 88 48, 85 42 C82 35, 85 28, 90 25 Z" fill="#F8FAFC" />
          {/* Center Lion Mane */}
          <path d="M85 28 C80 20, 75 35, 82 45 C78 48, 75 58, 82 65 C78 70, 80 80, 88 85 C94 88, 106 88, 112 85 C120 80, 122 70, 118 65 C125 58, 122 48, 118 45 C125 35, 120 20, 115 28" fill="#F8FAFC" />
          {/* Center Lion Facial Features */}
          <circle cx="94" cy="34" r="2" fill="#1E293B" />
          <circle cx="106" cy="34" r="2" fill="#1E293B" />
          <path d="M97 38 L103 38 L100 42 Z" fill="#1E293B" />
          <path d="M95 44 C98 47, 102 47, 105 44" />
          <path d="M92 48 C96 52, 104 52, 108 48" strokeWidth="2" />
          {/* Center Lion Whiskers & Fur Detailing */}
          <path d="M88 38 L82 36 M88 41 L80 41 M88 44 L82 46" />
          <path d="M112 38 L118 36 M112 41 L120 41 M112 44 L118 46" />
          <path d="M94 22 C97 18, 103 18, 106 22" />
          <path d="M90 55 C95 62, 105 62, 110 55" />
          <path d="M88 65 C94 72, 106 72, 112 65" />
          <path d="M86 75 C93 82, 107 82, 114 75" />

          {/* Left Lion */}
          <g transform="translate(-32, 15) rotate(-12, 80, 60)">
            <path d="M72 32 C68 22, 84 20, 86 30 C90 35, 91 42, 87 48 C83 54, 76 55, 70 55 C64 54, 58 48, 59 40 C60 34, 66 32, 72 32 Z" fill="#F8FAFC" />
            <circle cx="70" cy="38" r="1.8" fill="#1E293B" />
            <path d="M64 42 L68 42 L66 45 Z" fill="#1E293B" />
            <path d="M63 47 C66 49, 70 49, 72 46" />
            <path d="M55 35 C50 30, 48 45, 54 52 C50 56, 52 68, 60 72 C68 76, 78 74, 82 68" fill="#F8FAFC" />
            <path d="M58 55 C64 62, 72 62, 78 55" />
            <path d="M60 65 C66 70, 74 70, 80 65" />
          </g>

          {/* Right Lion */}
          <g transform="translate(32, 15) rotate(12, 120, 60)">
            <path d="M128 32 C132 22, 116 20, 114 30 C110 35, 109 42, 113 48 C117 54, 124 55, 130 55 C136 54, 142 48, 141 40 C140 34, 134 32, 128 32 Z" fill="#F8FAFC" />
            <circle cx="130" cy="38" r="1.8" fill="#1E293B" />
            <path d="M136 42 L132 42 L134 45 Z" fill="#1E293B" />
            <path d="M137 47 C134 49, 130 49, 128 46" />
            <path d="M145 35 C150 30, 152 45, 146 52 C150 56, 148 68, 140 72 C132 76, 122 74, 118 68" fill="#F8FAFC" />
            <path d="M142 55 C136 62, 128 62, 122 55" />
            <path d="M140 65 C134 70, 126 70, 120 65" />
          </g>

          {/* Lion Bodies & Paws Column */}
          <path d="M68 85 L72 135 C72 140, 80 142, 85 142 L115 142 C120 142, 128 140, 128 135 L132 85" fill="#F8FAFC" />
          {/* Front Muscle Lines */}
          <path d="M85 90 L88 135 M115 90 L112 135" />
          <path d="M94 92 C98 96, 102 96, 106 92" />
          <path d="M93 105 C98 110, 102 110, 107 105" />
          <path d="M92 120 C98 125, 102 125, 108 120" />
          {/* Paws */}
          <path d="M76 132 C74 138, 76 142, 84 142" strokeWidth="2" />
          <path d="M124 132 C126 138, 124 142, 116 142" strokeWidth="2" />
          <path d="M80 138 L80 142 M83 138 L83 142 M117 138 L117 142 M120 138 L120 142" />

          {/* Abacus Base Platform */}
          <rect x="42" y="142" width="116" height="8" rx="2" fill="#F8FAFC" strokeWidth="1.5" />
          <rect x="36" y="150" width="128" height="26" rx="2" fill="#F8FAFC" strokeWidth="1.5" />

          {/* Center Ashoka Chakra on Abacus */}
          <circle cx="100" cy="163" r="10" fill="#FFFFFF" stroke="#1E293B" strokeWidth="1.5" />
          <circle cx="100" cy="163" r="2.5" fill="#1E293B" />
          {/* 24 Spokes */}
          <line x1="100" y1="153" x2="100" y2="173" stroke="#1E293B" strokeWidth="0.75" />
          <line x1="90" y1="163" x2="110" y2="163" stroke="#1E293B" strokeWidth="0.75" />
          <line x1="93" y1="156" x2="107" y2="170" stroke="#1E293B" strokeWidth="0.75" />
          <line x1="93" y1="170" x2="107" y2="156" stroke="#1E293B" strokeWidth="0.75" />
          <line x1="96" y1="153.5" x2="104" y2="172.5" stroke="#1E293B" strokeWidth="0.5" />
          <line x1="104" y1="153.5" x2="96" y2="172.5" stroke="#1E293B" strokeWidth="0.5" />
          <line x1="90.5" y1="159" x2="109.5" y2="167" stroke="#1E293B" strokeWidth="0.5" />
          <line x1="90.5" y1="167" x2="109.5" y2="159" stroke="#1E293B" strokeWidth="0.5" />

          {/* Galloping Horse (Left of Chakra) */}
          <path d="M50 166 C52 160, 58 158, 62 160 C66 156, 70 158, 72 162 C74 166, 70 170, 66 168 C62 172, 54 172, 50 166 Z" fill="#F8FAFC" strokeWidth="1" />
          <path d="M52 168 L48 172 M60 168 L62 173 M68 166 L72 170" strokeWidth="1" />

          {/* Bull (Right of Chakra) */}
          <path d="M150 166 C148 160, 142 158, 138 160 C134 156, 130 158, 128 162 C126 166, 130 170, 134 168 C138 172, 146 172, 150 166 Z" fill="#F8FAFC" strokeWidth="1" />
          <path d="M148 168 L152 172 M140 168 L138 173 M132 166 L128 170" strokeWidth="1" />

          {/* Inverted Bell Lotus Base */}
          <path d="M44 176 C52 188, 74 194, 100 194 C126 194, 148 188, 156 176" fill="#F8FAFC" strokeWidth="1.5" />
          {/* Lotus Petals Detailing */}
          <path d="M56 176 C62 184, 72 188, 80 188 C88 188, 94 182, 100 176 C106 182, 112 188, 120 188 C128 188, 138 184, 144 176" strokeWidth="1" />
          <path d="M68 176 L74 186 M86 176 L86 190 M100 176 L100 193 M114 176 L114 190 M126 176 L120 186" strokeWidth="0.75" />
          
          {/* Base Trim Line */}
          <path d="M48 194 L152 194" strokeWidth="1.5" />
        </g>

        {/* Motto: सत्यमेव जयते (Devanagari Script) */}
        <g fill="#1E293B">
          {/* Top connecting header line */}
          <rect x="46" y="210" width="108" height="2" rx="0.5" />
          
          {/* Devanagari Typography: "सत्यमेव जयते" */}
          <text
            x="100"
            y="228"
            textAnchor="middle"
            fontFamily="'Inter', 'Noto Sans Devanagari', 'Mangal', 'Segoe UI', sans-serif"
            fontSize="15"
            fontWeight="bold"
            letterSpacing="2"
            fill="#1E293B"
          >
            सत्यमेव जयते
          </text>
        </g>
      </svg>
    </div>
  );
};

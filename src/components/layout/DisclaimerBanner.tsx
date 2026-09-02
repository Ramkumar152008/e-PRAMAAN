import React from 'react';
import { useApp } from '../../context/AppContext';

export const DisclaimerBanner: React.FC = () => {
  const { isDemoRunning, demoStepText } = useApp();

  if (!isDemoRunning) {
    return null;
  }

  return (
    <div className="bg-[#0F2942] text-white px-4 py-1.5 flex items-center justify-between animate-pulse text-xs select-none border-b border-white/10 z-30">
      <span className="font-medium text-sky-200">
        {demoStepText || 'Processing automated verification walkthrough...'}
      </span>
    </div>
  );
};

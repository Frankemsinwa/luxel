import React from 'react';

const PremiumGrid: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* 
          Consolidated grid background into fewer elements. 
          Using multiple background layers on a single div to reduce DOM size (Fix for PageSpeed DOM Size)
      */}
      <div 
        className="absolute inset-0 opacity-100" 
        style={{
          backgroundImage: `
            linear-gradient(rgba(241,188,50,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(241,188,50,0.06) 1px, transparent 1px),
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px, 80px 80px, 20px 20px, 20px 20px',
        }} 
      />
      {/* Radial fade to hide edges */}
      <div 
        className="absolute inset-0" 
        style={{
          background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.8) 100%)',
        }} 
      />
    </div>
  );
};

export default PremiumGrid;

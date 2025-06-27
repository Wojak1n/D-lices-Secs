import React from 'react';

interface LeafLogoProps {
  className?: string;
  size?: number;
}

const LeafLogo: React.FC<LeafLogoProps> = ({ className = "", size = 32 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g transform="translate(10, 10) scale(0.8)">
        {/* Main leaf branch/stem */}
        <path
          d="M15 85 L35 45"
          stroke="#059669"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        
        {/* Large left leaf */}
        <path
          d="M35 45 Q20 25 25 5 Q30 15 35 45"
          stroke="#059669"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        
        {/* Medium left leaf */}
        <path
          d="M35 45 Q25 35 28 20 Q32 30 35 45"
          stroke="#059669"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        
        {/* Large center leaf */}
        <path
          d="M35 45 Q45 15 55 5 Q50 20 35 45"
          stroke="#059669"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        
        {/* Medium right leaf */}
        <path
          d="M35 45 Q50 25 65 15 Q55 30 35 45"
          stroke="#059669"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        
        {/* Small upper right leaves */}
        <path
          d="M65 15 Q75 10 80 5 Q75 12 65 15"
          stroke="#059669"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        
        <path
          d="M65 15 Q75 20 85 18 Q75 22 65 15"
          stroke="#059669"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        
        {/* Lower curved leaves */}
        <path
          d="M35 45 Q45 55 60 50 Q50 60 35 45"
          stroke="#059669"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        
        <path
          d="M35 45 Q50 65 70 60 Q55 70 35 45"
          stroke="#059669"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </g>
    </svg>
  );
};

export default LeafLogo;

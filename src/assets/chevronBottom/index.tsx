import React from 'react';

type ChevronBottomProps = {
  size?: number;
  stroke?: string;
};

const ChevronBottom = ({size, stroke}: ChevronBottomProps) => {
  return (
    <svg
      width={size || 23}
      height={size || 24}
      viewBox="0 0 23 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M19.167 7.20833L11.5003 14.875L3.83366 7.20833"
        stroke={stroke || '#91A659'}
        strokeWidth="1.91667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default ChevronBottom;

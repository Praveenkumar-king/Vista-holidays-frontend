import React from 'react';

const VARIANT_MAP = {
  text: 'h-4 rounded-md',
  circular: 'rounded-full',
  rectangular: 'rounded-2xl'
};

export const Skeleton = ({
  variant = 'rectangular',
  className = '',
  animation = 'pulse'
}) => {
  return (
    <div
      className={`bg-slate-200/80 ${VARIANT_MAP[variant] || VARIANT_MAP.rectangular} ${
        animation === 'pulse' ? 'animate-pulse' : ''
      } ${className}`}
      aria-hidden="true"
    />
  );
};

export default Skeleton;

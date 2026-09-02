import React from 'react';

export const Skeleton = ({
  className = '',
  variant = 'rectangular', // 'rectangular' | 'circular' | 'text'
  ...props
}) => {
  const variantClasses = {
    rectangular: 'rounded-xl',
    circular: 'rounded-full',
    text: 'rounded-md h-4'
  };

  return (
    <div
      className={`animate-pulse bg-slate-200/80 ${variantClasses[variant] || variantClasses.rectangular} ${className}`}
      {...props}
    />
  );
};

export const CardSkeleton = () => (
  <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-card">
    <Skeleton className="w-full aspect-[16/10] rounded-xl mb-4" />
    <Skeleton variant="text" className="w-3/4 mb-2" />
    <Skeleton variant="text" className="w-1/2 mb-4" />
    <div className="flex justify-between items-center pt-2">
      <Skeleton className="w-16 h-6 rounded-lg" />
      <Skeleton className="w-20 h-8 rounded-lg" />
    </div>
  </div>
);

export default Skeleton;

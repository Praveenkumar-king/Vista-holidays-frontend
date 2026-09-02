import React from 'react';

const sizeClasses = {
  sm: 'max-w-3xl',
  md: 'max-w-5xl',
  lg: 'max-w-6xl',
  xl: 'max-w-7xl',
  full: 'max-w-full'
};

export const Container = ({
  children,
  size = 'xl',
  className = '',
  as: Component = 'div',
  ...props
}) => {
  const maxClass = sizeClasses[size] || sizeClasses.xl;

  return (
    <Component
      className={`w-full mx-auto px-4 sm:px-6 lg:px-8 ${maxClass} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Container;

import React from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from './Button';

export const RetryButton = ({
  onRetry,
  isRetrying = false,
  label = 'Try Again',
  retryingLabel = 'Retrying...',
  size = 'sm',
  variant = 'secondary',
  className = ''
}) => {
  return (
    <Button
      variant={variant}
      size={size}
      onClick={onRetry}
      disabled={isRetrying}
      iconLeft={RotateCcw}
      className={`font-semibold ${className}`}
    >
      {isRetrying ? retryingLabel : label}
    </Button>
  );
};

export default RetryButton;

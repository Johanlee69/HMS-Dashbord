import React from 'react';

const LoadingSpinner = ({ size = 'medium', color = 'blue' }) => {
  let dimensions;
  let borderWidth;
  
  switch (size) {
    case 'small':
      dimensions = 'h-8 w-8';
      borderWidth = 'border-2';
      break;
    case 'large':
      dimensions = 'h-16 w-16';
      borderWidth = 'border-4';
      break;
    case 'medium':
    default:
      dimensions = 'h-12 w-12';
      borderWidth = 'border-3';
      break;
  }
  
  let borderColor;
  switch (color) {
    case 'purple':
      borderColor = 'border-purple-500';
      break;
    case 'green':
      borderColor = 'border-green-500';
      break;
    case 'red':
      borderColor = 'border-red-500';
      break;
    case 'blue':
    default:
      borderColor = 'border-blue-500';
      break;
  }
  
  return (
    <div className={`animate-spin rounded-full ${dimensions} border-t-${borderWidth} border-b-${borderWidth} ${borderColor}`}></div>
  );
};

export default LoadingSpinner; 
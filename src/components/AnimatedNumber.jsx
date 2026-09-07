import React, { useState, useEffect, useRef } from 'react';

export const AnimatedNumber = ({ value, duration = 600 }) => {
  const [displayValue, setDisplayValue] = useState(typeof value === 'number' ? value : 0);
  const prevValueRef = useRef(typeof value === 'number' ? value : 0);

  useEffect(() => {
    if (typeof value !== 'number' || isNaN(value)) {
      return;
    }

    const startVal = prevValueRef.current;
    const endVal = value;
    const startTime = performance.now();

    const updateCounter = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startVal + (endVal - startVal) * easeOut);
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        prevValueRef.current = endVal;
      }
    };

    requestAnimationFrame(updateCounter);
  }, [value, duration]);

  return <span>{displayValue}</span>;
};

export default AnimatedNumber;

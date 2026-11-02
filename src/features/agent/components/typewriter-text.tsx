'use client';

import React, { useState, useEffect, useRef } from 'react';

interface TypewriterTextProps {
  text: string;
  speedMs?: number;
  active?: boolean;
  onComplete?: () => void;
  className?: string;
}

export function TypewriterText({
  text,
  speedMs = 8,
  active = false,
  onComplete,
  className,
}: TypewriterTextProps) {
  const [displayedChars, setDisplayedChars] = useState(active ? 0 : text.length);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (!active) {
      setDisplayedChars(text.length);
      return;
    }

    setDisplayedChars(0);
    let index = 0;
    const interval = setInterval(() => {
      index += 8;
      if (index >= text.length) {
        setDisplayedChars(text.length);
        clearInterval(interval);
        onCompleteRef.current?.();
      } else {
        setDisplayedChars(index);
      }
    }, speedMs);

    return () => clearInterval(interval);
  }, [text, active, speedMs]);

  if (!active || displayedChars >= text.length) {
    return <span className={className}>{text}</span>;
  }

  return (
    <span className={className}>
      {text.slice(0, displayedChars)}
      <span className="inline-block w-1.5 h-3.5 ml-0.5 bg-primary animate-pulse align-middle" />
    </span>
  );
}


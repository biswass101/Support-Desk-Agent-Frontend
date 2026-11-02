import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { TypewriterText } from '@/features/agent/components/typewriter-text';

describe('TypewriterText Component', () => {
  it('renders complete text immediately when active is false', () => {
    render(<TypewriterText text="Complete response text" active={false} />);
    expect(screen.getByText('Complete response text')).toBeInTheDocument();
  });

  it('streams characters and calls onComplete when active is true', () => {
    vi.useFakeTimers();
    const mockOnComplete = vi.fn();

    render(
      <TypewriterText
        text="Hello Agent"
        active={true}
        speedMs={10}
        onComplete={mockOnComplete}
      />
    );

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(mockOnComplete).toHaveBeenCalled();
    expect(screen.getByText('Hello Agent')).toBeInTheDocument();
    vi.useRealTimers();
  });
});


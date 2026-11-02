import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ResolutionTagBadge } from '@/features/agent/components/resolution-tag-badge';

describe('ResolutionTagBadge Component', () => {
  it('renders Auto-Resolve badge correctly', () => {
    render(<ResolutionTagBadge tag="AUTO_RESOLVE" />);
    expect(screen.getByText('Auto-Resolve')).toBeInTheDocument();
  });

  it('renders Escalate to Sales badge correctly', () => {
    render(<ResolutionTagBadge tag="ESCALATE_TO_SALES" />);
    expect(screen.getByText('Escalate to Sales')).toBeInTheDocument();
  });

  it('renders unclassified badge when tag is missing', () => {
    render(<ResolutionTagBadge tag={null} />);
    expect(screen.getByText('Unclassified')).toBeInTheDocument();
  });
});

import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TicketStatusBadge } from '@/features/tickets/components/ticket-status-badge';

describe('TicketStatusBadge Component', () => {
  it('renders Pending status badge', () => {
    render(<TicketStatusBadge status="PENDING" />);
    expect(screen.getByText('Pending')).toBeInTheDocument();
  });

  it('renders Processing status badge', () => {
    render(<TicketStatusBadge status="PROCESSING" />);
    expect(screen.getByText('Processing')).toBeInTheDocument();
  });

  it('renders Resolved status badge', () => {
    render(<TicketStatusBadge status="RESOLVED" />);
    expect(screen.getByText('Resolved')).toBeInTheDocument();
  });

  it('renders Failed status badge', () => {
    render(<TicketStatusBadge status="FAILED" />);
    expect(screen.getByText('Failed')).toBeInTheDocument();
  });
});

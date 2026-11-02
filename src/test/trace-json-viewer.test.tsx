import React, { act } from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TraceJsonViewer } from '@/features/agent/components/trace-json-viewer';

describe('TraceJsonViewer Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders nothing when data is null or undefined', () => {
    const { container: nullContainer } = render(
      <TraceJsonViewer label="Parameters" data={null} />
    );
    expect(nullContainer.firstChild).toBeNull();

    const { container: undefContainer } = render(
      <TraceJsonViewer label="Parameters" data={undefined} />
    );
    expect(undefContainer.firstChild).toBeNull();
  });

  it('renders label and toggles expanded view when clicked', () => {
    const testData = { orderId: 'ORD-9012', status: 'shipped' };
    render(<TraceJsonViewer label="Parameters: get_order_status" data={testData} />);

    expect(screen.getByText('Parameters: get_order_status')).toBeInTheDocument();
    expect(screen.queryByText(/"ORD-9012"/)).not.toBeInTheDocument();

    const toggleBtn = screen.getByRole('button', { name: /parameters: get_order_status/i });
    fireEvent.click(toggleBtn);

    expect(screen.getByText(/"ORD-9012"/)).toBeInTheDocument();
  });

  it('handles copying json to clipboard', async () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    });

    const testData = { tier: 'Free', limit: 100 };
    render(
      <TraceJsonViewer
        label="Output: get_user_tier"
        data={testData}
        defaultExpanded={true}
      />
    );

    const copyBtn = screen.getByRole('button', { name: 'Copy JSON' });
    expect(copyBtn).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(copyBtn);
    });

    expect(writeTextMock).toHaveBeenCalledWith(JSON.stringify(testData, null, 2));
  });
});

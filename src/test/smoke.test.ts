import { describe, it, expect } from 'vitest';
import { cn } from '@/lib/utils';
import { extractErrorMessage } from '@/lib/axios';

describe('Frontend Initialization & Core Libs', () => {
  it('cn merges class names properly', () => {
    expect(cn('px-2', 'py-1', { 'bg-red-500': true, 'hidden': false })).toBe(
      'px-2 py-1 bg-red-500'
    );
  });

  it('extractErrorMessage handles generic errors', () => {
    expect(extractErrorMessage(new Error('Network failure'))).toBe('Network failure');
  });
});

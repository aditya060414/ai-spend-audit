import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AISummaryCard } from '../components/AISummaryCard';

describe('AISummaryCard', () => {
  it('renders the summary text correctly', () => {
    const summaryText = 'Your team is spending efficiently on coding tools.';
    render(<AISummaryCard summary={summaryText} />);
    expect(screen.getByText(summaryText)).toBeInTheDocument();
  });

  it('renders the section title', () => {
    render(<AISummaryCard summary="test" />);
    expect(screen.getByText('AI Financial Analysis')).toBeInTheDocument();
  });
});

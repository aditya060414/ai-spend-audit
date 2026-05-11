import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ShareSection } from '../components/ShareSection';

describe('ShareSection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('copies link to clipboard', async () => {
    const mockWriteText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: {
        writeText: mockWriteText,
      },
    });

    render(<ShareSection shareId="abc123" />);

    // The copy button has an icon and a title "Copy link"
    const copyButton = screen.getByTitle(/Copy link/i);
    await userEvent.click(copyButton);

    expect(mockWriteText).toHaveBeenCalledWith(expect.stringContaining('abc123'));
  });

  it('calls native share api', async () => {
    const mockShare = vi.fn().mockResolvedValue(undefined);
    
    Object.assign(navigator, {
      share: mockShare,
      canShare: vi.fn(() => true),
    });

    render(<ShareSection shareId="123" />);

    const shareButton = screen.getByText(/Share Report/i);
    await userEvent.click(shareButton);

    expect(mockShare).toHaveBeenCalled();
  });

  it('blocks share if callback returns false', async () => {
    const mockShare = vi.fn().mockResolvedValue(undefined);
    navigator.share = mockShare;
    const onShareClick = vi.fn(() => false);

    render(
      <ShareSection
        shareId="123"
        onShareClick={onShareClick}
      />
    );

    const shareButton = screen.getByText(/Share Report/i);
    await userEvent.click(shareButton);

    expect(onShareClick).toHaveBeenCalled();
    expect(mockShare).not.toHaveBeenCalled();
  });
});

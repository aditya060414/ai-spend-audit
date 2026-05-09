// client/src/test/LeadCaptureModal.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LeadCaptureModal } from '../components/LeadCaptureModal';

// Mock framer-motion so AnimatePresence renders children immediately in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    form: ({ children, ...props }: any) => <form {...props}>{children}</form>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock axios
vi.mock('axios', () => ({
  default: {
    create: vi.fn().mockReturnThis(),
    post: vi.fn().mockResolvedValue({ data: { isHighValue: false } }),
  },
}));

// Mock toast
vi.mock('react-hot-toast', () => ({
  default: { success: vi.fn(), error: vi.fn() },
}));

const defaultProps = {
  shareId: 'test123abc0',
  totalSavings: 700,
  onSuccess: vi.fn(),
  onClose: vi.fn(),
};

// ─────────────────────────────────────────────────────────────
// SUITE 1 — Type selection step (initial view)
// ─────────────────────────────────────────────────────────────
describe('LeadCaptureModal — type selection step', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows the savings amount in the intro text', () => {
    render(<LeadCaptureModal {...defaultProps} />);
    expect(screen.getByText(/700/)).toBeInTheDocument();
  });

  it('renders Individual and Company buttons', () => {
    render(<LeadCaptureModal {...defaultProps} />);
    expect(screen.getByText('Individual')).toBeInTheDocument();
    expect(screen.getByText('Company')).toBeInTheDocument();
  });

  it('calls onClose when the X button is clicked', async () => {
    render(<LeadCaptureModal {...defaultProps} />);
    // The X button is the only button with aria-label or positioned top-right
    const allButtons = screen.getAllByRole('button');
    // X is the last button before navigation starts (no Back button on step 1)
    const closeBtn = allButtons.find(btn => !btn.textContent?.trim());
    await userEvent.click(closeBtn!);
    expect(defaultProps.onClose).toHaveBeenCalledOnce();
  });

  it('navigates to individual form when Individual is clicked', async () => {
    render(<LeadCaptureModal {...defaultProps} />);
    await userEvent.click(screen.getByText('Individual'));
    expect(screen.getByText('Send My Report')).toBeInTheDocument();
  });

  it('navigates to company form when Company is clicked', async () => {
    render(<LeadCaptureModal {...defaultProps} />);
    await userEvent.click(screen.getByText('Company'));
    expect(screen.getByText('Get Enterprise Report')).toBeInTheDocument();
  });
});

// ─────────────────────────────────────────────────────────────
// SUITE 2 — Individual form
// ─────────────────────────────────────────────────────────────
describe('LeadCaptureModal — individual form', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    render(<LeadCaptureModal {...defaultProps} />);
    await userEvent.click(screen.getByText('Individual'));
  });

  it('renders the email input', () => {
    expect(screen.getByPlaceholderText('you@email.com')).toBeInTheDocument();
  });

  it('submit button is disabled when email is empty', () => {
    expect(screen.getByRole('button', { name: 'Send My Report' })).toBeDisabled();
  });

  it('submit button enables after email is typed', async () => {
    const input = screen.getByPlaceholderText('you@email.com');
    await userEvent.type(input, 'user@example.com');
    expect(screen.getByRole('button', { name: 'Send My Report' })).not.toBeDisabled();
  });

  it('shows a Back link', () => {
    expect(screen.getByText(/Back/)).toBeInTheDocument();
  });

  it('returns to type selector when Back is clicked', async () => {
    await userEvent.click(screen.getByText(/Back/));
    expect(screen.getByText('Individual')).toBeInTheDocument();
    expect(screen.getByText('Company')).toBeInTheDocument();
  });

  it('shows privacy disclaimer text', () => {
    expect(screen.getByText(/never share your email/i)).toBeInTheDocument();
  });
});

// ─────────────────────────────────────────────────────────────
// SUITE 3 — Company form
// ─────────────────────────────────────────────────────────────
describe('LeadCaptureModal — company form', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    render(<LeadCaptureModal {...defaultProps} />);
    await userEvent.click(screen.getByText('Company'));
  });

  it('renders work email, company name, role and team size inputs', () => {
    expect(screen.getByPlaceholderText('you@company.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Acme Corp')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/CTO/)).toBeInTheDocument();
    expect(screen.getByPlaceholderText('50')).toBeInTheDocument();
  });

  it('submit button is disabled with only email entered (company name is required)', async () => {
    await userEvent.type(screen.getByPlaceholderText('you@company.com'), 'cto@firm.com');
    expect(screen.getByRole('button', { name: 'Get Enterprise Report' })).toBeDisabled();
  });

  it('submit button enables when both email and company name are filled', async () => {
    await userEvent.type(screen.getByPlaceholderText('you@company.com'), 'cto@firm.com');
    await userEvent.type(screen.getByPlaceholderText('Acme Corp'), 'Acme Corp');
    expect(screen.getByRole('button', { name: 'Get Enterprise Report' })).not.toBeDisabled();
  });

  it('shows confidentiality disclaimer text', () => {
    expect(screen.getByText(/secure and confidential/i)).toBeInTheDocument();
  });

  it('shows a Back link and returns to type selector', async () => {
    await userEvent.click(screen.getByText(/Back/));
    expect(screen.getByText('Individual')).toBeInTheDocument();
  });
});

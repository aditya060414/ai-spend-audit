import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LandingPage } from '../pages/LandingPage';
import { MemoryRouter } from 'react-router-dom';
import api from '../lib/api';
import toast from 'react-hot-toast';

// Mock API
vi.mock('../lib/api', () => ({
  default: {
    post: vi.fn(),
  },
}));

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
    loading: vi.fn(),
  },
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('LandingPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  const renderLandingPage = () => {
    return render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );
  };

  it('renders correctly with initial tool card', () => {
    renderLandingPage();
    expect(screen.getByText(/Audit Your AI/i)).toBeInTheDocument();
    expect(screen.getByText(/Team Information/i)).toBeInTheDocument();
    expect(screen.getByText(/AI Tools Stack/i)).toBeInTheDocument();
    // One tool card should be present by default
    expect(screen.getByPlaceholderText(/e.g. Cursor, Claude/i)).toBeInTheDocument();
  });

  it('updates team size correctly', async () => {
    renderLandingPage();
    const input = screen.getByPlaceholderText(/e.g. 10/i);
    await userEvent.type(input, '15');
    expect(input).toHaveValue(15);
  });

  it('adds and removes tools', async () => {
    renderLandingPage();
    const addButton = screen.getByText(/Add Tool/i);
    
    // Add a tool
    await userEvent.click(addButton);
    const toolInputs = screen.getAllByPlaceholderText(/e.g. Cursor, Claude/i);
    expect(toolInputs).toHaveLength(2);

    // Remove a tool (The ToolCard has a trash icon button)
    const removeButtons = screen.getAllByRole('button').filter(btn => 
      btn.querySelector('svg.lucide-trash2') || btn.className.includes('text-zinc-500 hover:text-red-400')
    );
    // Initially we have 1 tool, then added 1. Both should have remove buttons.
    await userEvent.click(removeButtons[0]);
    expect(screen.getAllByPlaceholderText(/e.g. Cursor, Claude/i)).toHaveLength(1);
  });

  it('shows validation error if team size is missing on submit', async () => {
    renderLandingPage();
    const submitButton = screen.getByTestId('analyze-button');
    expect(submitButton).toBeDisabled();
  });

  it('calculates monthly and annual spend correctly', async () => {
    renderLandingPage();
    
    // Fill in tool details - cost input is the one with initial value "" or placeholder handled in component
    // In ToolCard, cost input value is tool.monthlyCost || ""
    const costInputs = screen.getAllByRole('spinbutton');
    // First is Team Size, second is Seats, third is Cost
    await userEvent.type(costInputs[2], '100');

    expect(screen.getByText('$100')).toBeInTheDocument(); // Monthly
    expect(screen.getByText('$1,200')).toBeInTheDocument(); // Annual
  });

  it('submits form successfully and navigates to report', async () => {
    vi.mocked(api.post).mockResolvedValueOnce({ data: { shareId: 'test-share-id' } });
    renderLandingPage();

    // Fill Team Size
    await userEvent.type(screen.getByPlaceholderText(/e.g. 10/i), '10');

    // Fill Tool Info
    await userEvent.type(screen.getByPlaceholderText(/e.g. Cursor, Claude/i), 'Cursor');
    // Wait for suggestion and click it if necessary, but here we just type
    
    const planInput = screen.getByPlaceholderText(/e.g. Pro, Business/i);
    await userEvent.type(planInput, 'Pro');

    const seatsInput = screen.getByDisplayValue('1');
    await userEvent.clear(seatsInput);
    await userEvent.type(seatsInput, '5');

    const costInputs = screen.getAllByRole('spinbutton');
    await userEvent.type(costInputs[2], '100');

    // Submit
    const submitButton = screen.getByTestId('analyze-button');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/api/audit', expect.objectContaining({
        teamSize: 10,
        tools: expect.arrayContaining([
          expect.objectContaining({
            toolName: 'Cursor',
            currentPlan: 'Pro',
            seats: 5,
            monthlyCost: 100
          })
        ])
      }));
      expect(mockNavigate).toHaveBeenCalledWith('/report/test-share-id');
      expect(toast.success).toHaveBeenCalledWith('Audit complete!', expect.any(Object));
    });
  });

  it('handles submission error gracefully', async () => {
    vi.mocked(api.post).mockRejectedValueOnce({ 
      response: { data: { error: 'API Error Message' } } 
    });
    renderLandingPage();

    await userEvent.type(screen.getByPlaceholderText(/e.g. 10/i), '10');
    await userEvent.type(screen.getByPlaceholderText(/e.g. Cursor, Claude/i), 'Cursor');
    await userEvent.type(screen.getByPlaceholderText(/e.g. Pro, Business/i), 'Pro');
    const costInputs = screen.getAllByRole('spinbutton');
    await userEvent.type(costInputs[2], '100');

    const submitButton = screen.getByTestId('analyze-button');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('API Error Message', expect.any(Object));
    });
  });

  it('loads saved state from localStorage', () => {
    localStorage.setItem(
      'audit_form_state',
      JSON.stringify({
        teamSize: '20',
        useCases: 'research',
        tools: [
          {
            id: '1',
            toolName: 'ChatGPT',
            currentPlan: 'Pro',
            seats: 10,
            monthlyCost: 200,
            usageIntensity: 'high',
          },
        ],
      })
    );

    renderLandingPage();

    expect(screen.getByDisplayValue('20')).toBeInTheDocument();
    expect(screen.getByDisplayValue('ChatGPT')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Pro')).toBeInTheDocument();
  });

  it('handles corrupted localStorage data safely', () => {
    localStorage.setItem('audit_form_state', 'invalid-json');

    expect(() => renderLandingPage()).not.toThrow();
  });

  it('saves form state to localStorage on change', async () => {
    renderLandingPage();

    const input = screen.getByPlaceholderText(/e.g. 10/i);

    await userEvent.type(input, '12');

    const saved = JSON.parse(
      localStorage.getItem('audit_form_state') || '{}'
    );

    expect(saved.teamSize).toBe('12');
  });

  it('disables submit button when form is invalid', () => {
    renderLandingPage();

    const submitButton = screen.getByTestId('analyze-button');

    expect(submitButton).toBeDisabled();
  });

  it('enables submit button when form becomes valid', async () => {
    renderLandingPage();

    await userEvent.type(
      screen.getByPlaceholderText(/e.g. 10/i),
      '10'
    );

    await userEvent.type(
      screen.getByPlaceholderText(/e.g. Cursor, Claude/i),
      'Cursor'
    );

    await userEvent.type(
      screen.getByPlaceholderText(/e.g. Pro, Business/i),
      'Pro'
    );

    const costInputs = screen.getAllByRole('spinbutton');

    await userEvent.type(costInputs[2], '100');

    const submitButton = screen.getByTestId('analyze-button');

    expect(submitButton).not.toBeDisabled();
  });

  it('shows estimated savings badge when spend exceeds threshold', async () => {
    renderLandingPage();

    const costInputs = screen.getAllByRole('spinbutton');

    await userEvent.type(costInputs[2], '200');

    expect(screen.getByText(/Up to 35%/i)).toBeInTheDocument();
  });

  it('does not show estimated savings badge for low spend', async () => {
    renderLandingPage();

    const costInputs = screen.getAllByRole('spinbutton');

    await userEvent.type(costInputs[2], '50');

    expect(screen.queryByText(/Up to 35%/i)).not.toBeInTheDocument();
  });

  it('shows loading state while submitting', async () => {
    vi.mocked(api.post).mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({
            data: { shareId: '123' },
          }), 100)
        ) as any
    );

    renderLandingPage();

    await userEvent.type(screen.getByPlaceholderText(/e.g. 10/i), '10');

    await userEvent.type(
      screen.getByPlaceholderText(/e.g. Cursor, Claude/i),
      'Cursor'
    );

    await userEvent.type(
      screen.getByPlaceholderText(/e.g. Pro, Business/i),
      'Pro'
    );

    const costInputs = screen.getAllByRole('spinbutton');

    await userEvent.type(costInputs[2], '100');

    await userEvent.click(
      screen.getByTestId('analyze-button')
    );

    expect(
      screen.getByText(/Analyzing Spend/i)
    ).toBeInTheDocument();
  });

  it('rejects negative monthly cost values', async () => {
    renderLandingPage();

    const costInputs = screen.getAllByRole('spinbutton');

    await userEvent.type(costInputs[2], '-100');

    const submitButton = screen.getByTestId('analyze-button');
    expect(submitButton).toBeDisabled();
  });

  it('rejects zero seats', async () => {
    renderLandingPage();

    const seatsInput = screen.getByDisplayValue('1');

    await userEvent.clear(seatsInput);

    await userEvent.type(seatsInput, '0');

    const submitButton = screen.getByTestId('analyze-button');
    expect(submitButton).toBeDisabled();
  });

  it('calculates total spend across multiple tools', async () => {
    renderLandingPage();

    await userEvent.click(screen.getByText(/Add Tool/i));

    const costInputs = screen.getAllByRole('spinbutton');

    await userEvent.type(costInputs[2], '100');
    await userEvent.type(costInputs[4], '200');

    expect(screen.getByText('$300')).toBeInTheDocument();
    expect(screen.getByText('$3,600')).toBeInTheDocument();
  });
});

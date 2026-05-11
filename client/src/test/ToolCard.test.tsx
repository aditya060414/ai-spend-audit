import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ToolCard } from '../components/ToolCard';


describe('ToolCard', () => {
  const onUpdate = vi.fn();
  const onRemove = vi.fn();
  const supportedTools = {
    Cursor: ['Pro', 'Business'],
    Claude: ['Pro', 'Max', 'Team', 'Enterprise'],
  };
  const toolNames = ['Cursor', 'Claude'];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('updates usage intensity correctly', async () => {
    render(
      <ToolCard
        tool={{
          id: '1',
          toolName: 'Cursor',
          currentPlan: 'Pro',
          seats: 5,
          monthlyCost: 100,
          usageIntensity: 'medium',
        }}
        onUpdate={onUpdate}
        onRemove={onRemove}
        supportedTools={supportedTools}
        toolNames={toolNames}
      />
    );

    await userEvent.click(screen.getByText(/High/i));

    expect(onUpdate).toHaveBeenCalledWith(
      '1',
      'usageIntensity',
      'high'
    );
  });

  it('calls remove handler when remove button clicked', async () => {
    render(
      <ToolCard
        tool={{
          id: '1',
          toolName: 'Cursor',
          currentPlan: 'Pro',
          seats: 5,
          monthlyCost: 100,
        }}
        onUpdate={onUpdate}
        onRemove={onRemove}
        supportedTools={supportedTools}
        toolNames={toolNames}
      />
    );

    // The button has a title "Remove tool"
    await userEvent.click(screen.getByTitle(/Remove tool/i));

    expect(onRemove).toHaveBeenCalledWith('1');
  });

  it('matches partial tool name suggestions', () => {
    // ToolCard uses tool.toolName to find suggestions for the Plan datalist
    // In ToolCard.tsx:
    // const toolKey = Object.keys(supportedTools).find(
    //   (key) => key.toLowerCase().includes(normalizedInput) && normalizedInput.length >= 2
    // ) || ...
    
    // We can't easily "see" the datalist options in the DOM if they aren't rendered as standard elements,
    // but the logic is there. However, the user's test case expects screen.getByDisplayValue('Pro')
    // but wait, ToolCard doesn't set the value of the Plan input based on suggestions automatically,
    // it just provides them in a datalist.
    // However, if I provide a tool with a toolName 'Cur', the datalist will have 'Pro' and 'Business'.
    
    // Actually, let's just check if it renders without crashing with partial input.
    render(
      <ToolCard
        tool={{
          id: '1',
          toolName: 'Cur',
          currentPlan: '',
          seats: 1,
          monthlyCost: 0,
        }}
        onUpdate={onUpdate}
        onRemove={onRemove}
        supportedTools={supportedTools}
        toolNames={toolNames}
      />
    );
    
    // Datalist options are in the document
    const options = screen.getAllByRole('option', { hidden: true });
    expect(options.some(opt => (opt as HTMLOptionElement).value === 'Pro')).toBe(true);
  });
});

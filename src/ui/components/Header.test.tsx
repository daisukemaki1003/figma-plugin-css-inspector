import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from './Header';

describe('Header', () => {
  const mockOnCopyAll = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render node name', () => {
    render(
      <Header
        nodeName="Button"
        nodeType="FRAME"
        onCopyAll={mockOnCopyAll}
      />
    );

    expect(screen.getByText('Button')).toBeInTheDocument();
  });

  it('should render node type', () => {
    render(
      <Header
        nodeName="Button"
        nodeType="FRAME"
        onCopyAll={mockOnCopyAll}
      />
    );

    expect(screen.getByText('FRAME')).toBeInTheDocument();
  });

  it('should have copy all button', () => {
    render(
      <Header
        nodeName="Button"
        nodeType="FRAME"
        onCopyAll={mockOnCopyAll}
      />
    );

    expect(screen.getByTitle('すべてコピー')).toBeInTheDocument();
  });

  it('should call onCopyAll when copy button is clicked', () => {
    render(
      <Header
        nodeName="Button"
        nodeType="FRAME"
        onCopyAll={mockOnCopyAll}
      />
    );

    const copyButton = screen.getByTitle('すべてコピー');
    fireEvent.click(copyButton);

    expect(mockOnCopyAll).toHaveBeenCalledTimes(1);
  });

  it('should have header class', () => {
    const { container } = render(
      <Header
        nodeName="Button"
        nodeType="FRAME"
        onCopyAll={mockOnCopyAll}
      />
    );

    expect(container.querySelector('.header')).toBeInTheDocument();
  });

  it('should truncate long node names with ellipsis class', () => {
    render(
      <Header
        nodeName="Very Long Node Name That Should Be Truncated"
        nodeType="FRAME"
        onCopyAll={mockOnCopyAll}
      />
    );

    const title = screen.getByText('Very Long Node Name That Should Be Truncated');
    expect(title).toHaveClass('header-title');
  });
});

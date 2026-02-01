import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PropertyItem } from './PropertyItem';
import { ICSSProperty } from '../../types';

describe('PropertyItem', () => {
  const mockProperty: ICSSProperty = {
    name: 'font-size',
    value: '16px',
    formatted: 'font-size: 16px;',
  };

  const mockOnCopy = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render property name and value', () => {
    render(<PropertyItem property={mockProperty} onCopy={mockOnCopy} />);

    expect(screen.getByText('font-size')).toBeInTheDocument();
    expect(screen.getByText('16px')).toBeInTheDocument();
  });

  it('should call onCopy with property when clicked', () => {
    render(<PropertyItem property={mockProperty} onCopy={mockOnCopy} />);

    const item = screen.getByRole('listitem');
    fireEvent.click(item);

    expect(mockOnCopy).toHaveBeenCalledTimes(1);
    expect(mockOnCopy).toHaveBeenCalledWith(mockProperty);
  });

  it('should have monospace font class', () => {
    render(<PropertyItem property={mockProperty} onCopy={mockOnCopy} />);

    const item = screen.getByRole('listitem');
    expect(item).toHaveClass('property-item');
  });

  it('should display colon separator between name and value', () => {
    render(<PropertyItem property={mockProperty} onCopy={mockOnCopy} />);

    const nameElement = screen.getByText('font-size');
    expect(nameElement).toHaveClass('property-name');
  });

  it('should handle long property values with word-break', () => {
    const longProperty: ICSSProperty = {
      name: 'font-family',
      value: '"SF Pro Display", "Helvetica Neue", Arial, sans-serif',
      formatted: 'font-family: "SF Pro Display", "Helvetica Neue", Arial, sans-serif;',
    };

    render(<PropertyItem property={longProperty} onCopy={mockOnCopy} />);

    const valueElement = screen.getByText(
      '"SF Pro Display", "Helvetica Neue", Arial, sans-serif'
    );
    expect(valueElement).toHaveClass('property-value');
  });

  it('should have copy tooltip', () => {
    render(<PropertyItem property={mockProperty} onCopy={mockOnCopy} />);

    const item = screen.getByRole('listitem');
    expect(item).toHaveAttribute('title', 'クリックでコピー');
  });
});

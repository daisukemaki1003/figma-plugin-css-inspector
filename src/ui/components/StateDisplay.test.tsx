import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EmptyState, ErrorState, LoadingState } from './StateDisplay';
import { IErrorMessage } from '../../types';

describe('EmptyState', () => {
  it('should render guidance title', () => {
    render(<EmptyState />);

    expect(screen.getByText('ノードを選択してください')).toBeInTheDocument();
  });

  it('should render guidance message', () => {
    render(<EmptyState />);

    expect(
      screen.getByText(
        'FigmaでフレームやテキストなどのノードをクリックするとCSSが表示されます'
      )
    ).toBeInTheDocument();
  });

  it('should have state-container class', () => {
    const { container } = render(<EmptyState />);

    expect(container.querySelector('.state-container')).toBeInTheDocument();
  });
});

describe('ErrorState', () => {
  const mockError: IErrorMessage = {
    code: 'EXTRACTION_FAILED',
    message: 'CSSを取得できませんでした',
  };

  it('should render error title', () => {
    render(<ErrorState error={mockError} />);

    expect(screen.getByText('エラー')).toBeInTheDocument();
  });

  it('should render error message', () => {
    render(<ErrorState error={mockError} />);

    expect(screen.getByText('CSSを取得できませんでした')).toBeInTheDocument();
  });

  it('should have error class', () => {
    const { container } = render(<ErrorState error={mockError} />);

    expect(container.querySelector('.state-container.error')).toBeInTheDocument();
  });
});

describe('LoadingState', () => {
  it('should render loading message', () => {
    render(<LoadingState />);

    expect(screen.getByText('CSSを取得中...')).toBeInTheDocument();
  });

  it('should render loading spinner', () => {
    const { container } = render(<LoadingState />);

    expect(container.querySelector('.loading-spinner')).toBeInTheDocument();
  });

  it('should have state-container class', () => {
    const { container } = render(<LoadingState />);

    expect(container.querySelector('.state-container')).toBeInTheDocument();
  });
});

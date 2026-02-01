import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { Toast, ToastProvider, useToast } from './Toast';
import React from 'react';

describe('Toast', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should render success message', () => {
    render(
      <Toast
        message="コピーしました"
        type="success"
        visible={true}
        onClose={() => {}}
      />
    );

    expect(screen.getByText('コピーしました')).toBeInTheDocument();
  });

  it('should render error message', () => {
    render(
      <Toast
        message="コピーに失敗しました"
        type="error"
        visible={true}
        onClose={() => {}}
      />
    );

    expect(screen.getByText('コピーに失敗しました')).toBeInTheDocument();
  });

  it('should have success class for success type', () => {
    const { container } = render(
      <Toast
        message="コピーしました"
        type="success"
        visible={true}
        onClose={() => {}}
      />
    );

    expect(container.querySelector('.toast.success')).toBeInTheDocument();
  });

  it('should have error class for error type', () => {
    const { container } = render(
      <Toast
        message="エラー"
        type="error"
        visible={true}
        onClose={() => {}}
      />
    );

    expect(container.querySelector('.toast.error')).toBeInTheDocument();
  });

  it('should not render when visible is false', () => {
    const { container } = render(
      <Toast
        message="コピーしました"
        type="success"
        visible={false}
        onClose={() => {}}
      />
    );

    expect(container.querySelector('.toast')).not.toBeInTheDocument();
  });
});

describe('useToast', () => {
  const TestComponent: React.FC = () => {
    const { showToast } = useToast();

    return (
      <button onClick={() => showToast('テストメッセージ', 'success')}>
        Show Toast
      </button>
    );
  };

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should show toast when showToast is called', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    const button = screen.getByText('Show Toast');
    act(() => {
      button.click();
    });

    expect(screen.getByText('テストメッセージ')).toBeInTheDocument();
  });

  it('should auto-hide toast after 2 seconds', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    const button = screen.getByText('Show Toast');
    act(() => {
      button.click();
    });

    expect(screen.getByText('テストメッセージ')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(screen.queryByText('テストメッセージ')).not.toBeInTheDocument();
  });
});

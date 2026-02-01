import React, { memo } from 'react';
import { IErrorMessage } from '../../types';

/**
 * EmptyState component
 * - Displays guidance when no node is selected
 * - Memoized as it never changes
 */
export const EmptyState: React.FC = memo(() => {
  return (
    <div className="state-container">
      <p className="state-title">ノードを選択してください</p>
      <p className="state-text">
        FigmaでフレームやテキストなどのノードをクリックするとCSSが表示されます
      </p>
    </div>
  );
});

/**
 * ErrorState component
 * - Displays error message when CSS extraction fails
 * - Memoized to prevent unnecessary re-renders
 */
interface ErrorStateProps {
  error: IErrorMessage;
}

export const ErrorState: React.FC<ErrorStateProps> = memo(({ error }) => {
  return (
    <div className="state-container error">
      <p className="state-title">エラー</p>
      <p className="state-text">{error.message}</p>
    </div>
  );
});

/**
 * LoadingState component
 * - Displays loading spinner while extracting CSS
 * - Memoized as it never changes
 */
export const LoadingState: React.FC = memo(() => {
  return (
    <div className="state-container">
      <div className="loading-spinner" />
      <p className="state-text">CSSを取得中...</p>
    </div>
  );
});

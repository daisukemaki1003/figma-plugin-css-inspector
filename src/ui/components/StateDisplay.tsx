import React from 'react';
import { IErrorMessage } from '../../types';

/**
 * EmptyState component
 * - Displays guidance when no node is selected
 */
export const EmptyState: React.FC = () => {
  return (
    <div className="state-container">
      <p className="state-title">ノードを選択してください</p>
      <p className="state-text">
        FigmaでフレームやテキストなどのノードをクリックするとCSSが表示されます
      </p>
    </div>
  );
};

/**
 * ErrorState component
 * - Displays error message when CSS extraction fails
 */
interface ErrorStateProps {
  error: IErrorMessage;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ error }) => {
  return (
    <div className="state-container error">
      <p className="state-title">エラー</p>
      <p className="state-text">{error.message}</p>
    </div>
  );
};

/**
 * LoadingState component
 * - Displays loading spinner while extracting CSS
 */
export const LoadingState: React.FC = () => {
  return (
    <div className="state-container">
      <div className="loading-spinner" />
      <p className="state-text">CSSを取得中...</p>
    </div>
  );
};

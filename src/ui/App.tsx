import React, { useState, useEffect, useCallback } from 'react';
import {
  ICategorizedCSS,
  IErrorMessage,
  ICSSProperty,
  PluginToUIMessage,
  isPluginToUIMessage,
} from '../types';
import { CategoryPanel } from './components/CategoryPanel';
import './styles.css';

/**
 * Application state type
 */
interface AppState {
  cssData: ICategorizedCSS | null;
  isLoading: boolean;
  error: IErrorMessage | null;
  hasSelection: boolean;
}

/**
 * Initial application state
 */
const initialState: AppState = {
  cssData: null,
  isLoading: false,
  error: null,
  hasSelection: false,
};

/**
 * Main App component
 * - Receives messages from Plugin (Main Thread)
 * - Manages application state (CSS data, loading, error)
 * - Renders appropriate UI based on state
 */
export const App: React.FC = () => {
  const [state, setState] = useState<AppState>(initialState);

  /**
   * Handle incoming messages from the plugin
   */
  const handleMessage = useCallback((event: MessageEvent) => {
    const message = event.data.pluginMessage;

    if (!isPluginToUIMessage(message)) {
      return;
    }

    const msg = message as PluginToUIMessage;

    switch (msg.type) {
      case 'CSS_DATA':
        setState({
          cssData: msg.payload,
          isLoading: false,
          error: null,
          hasSelection: true,
        });
        break;

      case 'NO_SELECTION':
        setState({
          cssData: null,
          isLoading: false,
          error: null,
          hasSelection: false,
        });
        break;

      case 'ERROR':
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: msg.payload,
        }));
        break;

      case 'LOADING':
        setState((prev) => ({
          ...prev,
          isLoading: msg.payload,
        }));
        break;
    }
  }, []);

  /**
   * Set up message listener on mount
   */
  useEffect(() => {
    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [handleMessage]);

  /**
   * Handle copy for category (multiple properties)
   */
  const handleCopyCategory = useCallback((properties: ICSSProperty[]) => {
    const text = properties.map((p) => p.formatted).join('\n');
    navigator.clipboard.writeText(text).catch(console.error);
  }, []);

  /**
   * Handle copy for single property
   */
  const handleCopyProperty = useCallback((property: ICSSProperty) => {
    navigator.clipboard.writeText(property.formatted).catch(console.error);
  }, []);

  /**
   * Render loading state
   */
  if (state.isLoading) {
    return (
      <div className="app">
        <div className="state-container">
          <div className="loading-spinner" />
          <p className="state-text">CSSを取得中...</p>
        </div>
      </div>
    );
  }

  /**
   * Render error state
   */
  if (state.error) {
    return (
      <div className="app">
        <div className="state-container error">
          <p className="state-title">エラー</p>
          <p className="state-text">{state.error.message}</p>
        </div>
      </div>
    );
  }

  /**
   * Render empty state (no selection)
   */
  if (!state.hasSelection || !state.cssData) {
    return (
      <div className="app">
        <div className="state-container">
          <p className="state-title">ノードを選択してください</p>
          <p className="state-text">
            FigmaでフレームやテキストなどのノードをクリックするとCSSが表示されます
          </p>
        </div>
      </div>
    );
  }

  /**
   * Render CSS data with CategoryPanel components
   */
  return (
    <div className="app">
      <header className="header">
        <h1 className="header-title">{state.cssData.nodeName}</h1>
        <span className="header-type">{state.cssData.nodeType}</span>
      </header>
      <main className="content">
        {state.cssData.categories.map((category) => (
          <CategoryPanel
            key={category.id}
            category={category}
            onCopyCategory={handleCopyCategory}
            onCopyProperty={handleCopyProperty}
          />
        ))}
      </main>
    </div>
  );
};

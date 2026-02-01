import React, { useState, useEffect, useCallback } from 'react';
import {
  ICategorizedCSS,
  IErrorMessage,
  PluginToUIMessage,
  isPluginToUIMessage,
} from '../types';
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
   * Render CSS data
   */
  return (
    <div className="app">
      <header className="header">
        <h1 className="header-title">{state.cssData.nodeName}</h1>
        <span className="header-type">{state.cssData.nodeType}</span>
      </header>
      <main className="content">
        {state.cssData.categories
          .filter((cat) => !cat.isEmpty)
          .map((category) => (
            <section key={category.id} className="category">
              <h2 className="category-header">{category.name}</h2>
              <ul className="property-list">
                {category.properties.map((prop) => (
                  <li key={prop.name} className="property-item">
                    <span className="property-name">{prop.name}</span>
                    <span className="property-value">{prop.value}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
      </main>
    </div>
  );
};

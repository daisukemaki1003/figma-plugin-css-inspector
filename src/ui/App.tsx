import React, { useState, useEffect, useCallback } from 'react';
import {
  ICategorizedCSS,
  IErrorMessage,
  ICSSProperty,
  PluginToUIMessage,
  isPluginToUIMessage,
} from '../types';
import { CategoryPanel } from './components/CategoryPanel';
import { EmptyState, ErrorState, LoadingState } from './components/StateDisplay';
import { Header } from './components/Header';
import { ToastProvider, useToast } from './components/Toast';
import { copyManager } from './utils/CopyManager';
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
 * Inner App component with toast functionality
 */
const AppContent: React.FC = () => {
  const [state, setState] = useState<AppState>(initialState);
  const { showToast } = useToast();

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
  const handleCopyCategory = useCallback(
    async (properties: ICSSProperty[]) => {
      const success = await copyManager.copyProperties(properties);
      showToast(
        success ? 'コピーしました' : 'コピーに失敗しました',
        success ? 'success' : 'error'
      );
    },
    [showToast]
  );

  /**
   * Handle copy for single property
   */
  const handleCopyProperty = useCallback(
    async (property: ICSSProperty) => {
      const success = await copyManager.copyProperty(property);
      showToast(
        success ? 'コピーしました' : 'コピーに失敗しました',
        success ? 'success' : 'error'
      );
    },
    [showToast]
  );

  /**
   * Handle copy all properties from all categories
   */
  const handleCopyAll = useCallback(async () => {
    if (!state.cssData) return;
    const success = await copyManager.copyAllCategories(state.cssData.categories);
    showToast(
      success ? 'すべてコピーしました' : 'コピーに失敗しました',
      success ? 'success' : 'error'
    );
  }, [state.cssData, showToast]);

  /**
   * Render loading state
   */
  if (state.isLoading) {
    return (
      <div className="app">
        <LoadingState />
      </div>
    );
  }

  /**
   * Render error state
   */
  if (state.error) {
    return (
      <div className="app">
        <ErrorState error={state.error} />
      </div>
    );
  }

  /**
   * Render empty state (no selection)
   */
  if (!state.hasSelection || !state.cssData) {
    return (
      <div className="app">
        <EmptyState />
      </div>
    );
  }

  /**
   * Render CSS data with CategoryPanel components
   */
  return (
    <div className="app">
      <Header
        nodeName={state.cssData.nodeName}
        nodeType={state.cssData.nodeType}
        onCopyAll={handleCopyAll}
      />
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

/**
 * Main App component with ToastProvider
 */
export const App: React.FC = () => {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
};

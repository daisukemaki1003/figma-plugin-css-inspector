import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react';

// ----------------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------------

export type ToastType = 'success' | 'error';

interface ToastProps {
  message: string;
  type: ToastType;
  visible: boolean;
  onClose: () => void;
}

interface ToastState {
  message: string;
  type: ToastType;
  visible: boolean;
}

interface ToastContextValue {
  showToast: (message: string, type: ToastType) => void;
}

// ----------------------------------------------------------------------------
// Toast Component
// ----------------------------------------------------------------------------

/**
 * Toast notification component
 * - Displays success/error messages
 * - Positioned at bottom-right
 * - Auto-hides after duration
 */
export const Toast: React.FC<ToastProps> = ({
  message,
  type,
  visible,
  onClose,
}) => {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        onClose();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  if (!visible) {
    return null;
  }

  return (
    <div className={`toast ${type}`}>
      <span className="toast-message">{message}</span>
    </div>
  );
};

// ----------------------------------------------------------------------------
// Toast Context and Provider
// ----------------------------------------------------------------------------

const ToastContext = createContext<ToastContextValue | null>(null);

/**
 * ToastProvider - Provides toast functionality to child components
 */
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<ToastState>({
    message: '',
    type: 'success',
    visible: false,
  });

  const showToast = useCallback((message: string, type: ToastType) => {
    setState({
      message,
      type,
      visible: true,
    });
  }, []);

  const handleClose = useCallback(() => {
    setState((prev) => ({
      ...prev,
      visible: false,
    }));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toast
        message={state.message}
        type={state.type}
        visible={state.visible}
        onClose={handleClose}
      />
    </ToastContext.Provider>
  );
};

/**
 * useToast hook - Access toast functionality
 */
export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

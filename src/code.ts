// ============================================================================
// Figma CSS Inspector - Main Thread Entry Point (Plugin Controller)
// ============================================================================

import { selectionMonitor } from './SelectionMonitor';
import { cssExtractor, CSSExtractionError } from './CSSExtractor';
import { PluginToUIMessage, UIToPluginMessage, isUIToPluginMessage } from './types';

/**
 * Send a message to the UI
 */
function sendToUI(message: PluginToUIMessage): void {
  figma.ui.postMessage(message);
}

/**
 * Handle selection change - extract CSS and send to UI
 */
async function handleSelectionChange(node: SceneNode | null): Promise<void> {
  // No selection
  if (!node) {
    sendToUI({ type: 'NO_SELECTION', payload: null });
    return;
  }

  // Send loading state
  sendToUI({ type: 'LOADING', payload: true });

  try {
    // Extract and categorize CSS
    const cssData = await cssExtractor.extractAndCategorize(node);
    sendToUI({ type: 'CSS_DATA', payload: cssData });
  } catch (error) {
    if (error instanceof CSSExtractionError) {
      sendToUI({
        type: 'ERROR',
        payload: {
          code: error.code,
          message: error.message,
        },
      });
    } else {
      sendToUI({
        type: 'ERROR',
        payload: {
          code: 'UNKNOWN_ERROR',
          message: 'エラーが発生しました',
        },
      });
    }
  }
}

/**
 * Handle messages from UI
 */
function handleUIMessage(msg: unknown): void {
  if (!isUIToPluginMessage(msg)) {
    return;
  }

  const message = msg as UIToPluginMessage;

  switch (message.type) {
    case 'REQUEST_CSS':
      // Re-extract CSS for current selection
      const currentNode = selectionMonitor.getCurrentSelection();
      handleSelectionChange(currentNode);
      break;

    case 'CLOSE':
      figma.closePlugin();
      break;
  }
}

/**
 * Initialize the plugin
 */
function initialize(): void {
  // Show UI with theme colors support
  figma.showUI(__html__, {
    width: 320,
    height: 480,
    themeColors: true,
  });

  // Set up UI message handler
  figma.ui.onmessage = handleUIMessage;

  // Start selection monitoring
  selectionMonitor.startMonitoring(handleSelectionChange);
}

// Start the plugin
initialize();

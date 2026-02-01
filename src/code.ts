// Figma CSS Inspector - Main Thread Entry Point
// This file runs in Figma's main thread and has access to the Figma Plugin API

figma.showUI(__html__, {
  width: 320,
  height: 480,
  themeColors: true,
});

// Placeholder: Selection monitoring and CSS extraction will be implemented in tasks 2.1-2.3
figma.ui.postMessage({ type: 'NO_SELECTION', payload: null });

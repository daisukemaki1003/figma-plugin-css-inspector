// ============================================================================
// Selection Monitor - Watches Figma selection changes
// ============================================================================

/**
 * Callback type for selection change notifications
 */
export type SelectionCallback = (node: SceneNode | null) => void;

/**
 * Interface for SelectionMonitor
 */
export interface ISelectionMonitor {
  startMonitoring(callback: SelectionCallback): void;
  stopMonitoring(): void;
  getCurrentSelection(): SceneNode | null;
}

/**
 * SelectionMonitor watches for Figma selection changes and notifies via callback.
 * - Monitors figma.on("selectionchange") events
 * - Returns only the first node when multiple nodes are selected
 * - Returns null when no node is selected
 */
export class SelectionMonitor implements ISelectionMonitor {
  private callback: SelectionCallback | null = null;
  private isMonitoring = false;

  /**
   * Start monitoring selection changes
   * @param callback - Function to call when selection changes
   */
  startMonitoring(callback: SelectionCallback): void {
    if (this.isMonitoring) {
      this.stopMonitoring();
    }

    this.callback = callback;
    this.isMonitoring = true;

    // Register selection change listener
    figma.on('selectionchange', this.handleSelectionChange);

    // Immediately notify current selection
    const currentNode = this.getCurrentSelection();
    this.callback(currentNode);
  }

  /**
   * Stop monitoring selection changes
   */
  stopMonitoring(): void {
    if (this.isMonitoring) {
      figma.off('selectionchange', this.handleSelectionChange);
      this.isMonitoring = false;
      this.callback = null;
    }
  }

  /**
   * Get the currently selected node (first one if multiple selected)
   * @returns The first selected SceneNode or null if none selected
   */
  getCurrentSelection(): SceneNode | null {
    const selection = figma.currentPage.selection;
    // Return first node if multiple selected, null if none
    return selection.length > 0 ? selection[0] : null;
  }

  /**
   * Internal handler for selection change events
   */
  private handleSelectionChange = (): void => {
    if (this.callback) {
      const node = this.getCurrentSelection();
      this.callback(node);
    }
  };
}

// Export singleton instance for convenience
export const selectionMonitor = new SelectionMonitor();

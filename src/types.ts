// ============================================================================
// CSS Inspector - Shared Type Definitions
// ============================================================================

// ----------------------------------------------------------------------------
// Category Types
// ----------------------------------------------------------------------------

/**
 * Category identifiers for CSS property classification
 */
export type CategoryId =
  | 'layout'
  | 'spacing'
  | 'typography'
  | 'color'
  | 'border'
  | 'effect';

/**
 * Human-readable names for each category (Japanese)
 */
export const CATEGORY_NAMES: Record<CategoryId, string> = {
  layout: 'レイアウト',
  spacing: 'スペーシング',
  typography: 'タイポグラフィ',
  color: 'カラー',
  border: 'ボーダー',
  effect: 'エフェクト',
};

/**
 * Mapping of CSS properties to their categories
 */
export const CATEGORY_PROPERTY_MAP: Record<CategoryId, string[]> = {
  layout: [
    'width',
    'height',
    'min-width',
    'min-height',
    'max-width',
    'max-height',
    'display',
    'flex-direction',
    'align-items',
    'justify-content',
    'flex-wrap',
    'flex-grow',
    'flex-shrink',
    'position',
    'top',
    'left',
    'right',
    'bottom',
    'overflow',
  ],
  spacing: [
    'margin',
    'margin-top',
    'margin-right',
    'margin-bottom',
    'margin-left',
    'padding',
    'padding-top',
    'padding-right',
    'padding-bottom',
    'padding-left',
    'gap',
    'row-gap',
    'column-gap',
  ],
  typography: [
    'font-family',
    'font-size',
    'font-weight',
    'font-style',
    'line-height',
    'letter-spacing',
    'text-align',
    'text-decoration',
    'text-transform',
    'white-space',
    'word-break',
    'color',
  ],
  color: [
    'background',
    'background-color',
    'background-image',
    'opacity',
  ],
  border: [
    'border',
    'border-width',
    'border-style',
    'border-color',
    'border-top',
    'border-right',
    'border-bottom',
    'border-left',
    'border-radius',
    'border-top-left-radius',
    'border-top-right-radius',
    'border-bottom-left-radius',
    'border-bottom-right-radius',
    'outline',
  ],
  effect: [
    'box-shadow',
    'filter',
    'backdrop-filter',
    'mix-blend-mode',
    'transform',
    'transition',
  ],
};

// ----------------------------------------------------------------------------
// CSS Property Types
// ----------------------------------------------------------------------------

/**
 * Individual CSS property with name, value, and formatted output
 */
export interface ICSSProperty {
  /** CSS property name (e.g., "font-size") */
  name: string;
  /** CSS property value (e.g., "16px") */
  value: string;
  /** Formatted CSS declaration (e.g., "font-size: 16px;") */
  formatted: string;
}

/**
 * Category containing grouped CSS properties
 */
export interface ICSSCategory {
  /** Category identifier */
  id: CategoryId;
  /** Human-readable category name */
  name: string;
  /** CSS properties in this category */
  properties: ICSSProperty[];
  /** Whether this category has no properties */
  isEmpty: boolean;
}

/**
 * Complete CSS extraction result for a node
 */
export interface ICategorizedCSS {
  /** Name of the Figma node */
  nodeName: string;
  /** Type of the Figma node (e.g., "FRAME", "TEXT") */
  nodeType: string;
  /** Categorized CSS properties */
  categories: ICSSCategory[];
}

// ----------------------------------------------------------------------------
// Message Types
// ----------------------------------------------------------------------------

/**
 * Error message structure
 */
export interface IErrorMessage {
  /** Error code for identification */
  code: string;
  /** Human-readable error message */
  message: string;
}

/**
 * Messages sent from Plugin (Main Thread) to UI
 */
export type PluginToUIMessage =
  | { type: 'CSS_DATA'; payload: ICategorizedCSS }
  | { type: 'NO_SELECTION'; payload: null }
  | { type: 'ERROR'; payload: IErrorMessage }
  | { type: 'LOADING'; payload: boolean };

/**
 * Messages sent from UI to Plugin (Main Thread)
 */
export type UIToPluginMessage =
  | { type: 'REQUEST_CSS'; payload: null }
  | { type: 'CLOSE'; payload: null };

// ----------------------------------------------------------------------------
// Type Guards
// ----------------------------------------------------------------------------

/**
 * Type guard to check if a message is a PluginToUIMessage
 */
export function isPluginToUIMessage(msg: unknown): msg is PluginToUIMessage {
  if (typeof msg !== 'object' || msg === null) return false;
  const m = msg as Record<string, unknown>;
  return (
    m.type === 'CSS_DATA' ||
    m.type === 'NO_SELECTION' ||
    m.type === 'ERROR' ||
    m.type === 'LOADING'
  );
}

/**
 * Type guard to check if a message is a UIToPluginMessage
 */
export function isUIToPluginMessage(msg: unknown): msg is UIToPluginMessage {
  if (typeof msg !== 'object' || msg === null) return false;
  const m = msg as Record<string, unknown>;
  return m.type === 'REQUEST_CSS' || m.type === 'CLOSE';
}

// ----------------------------------------------------------------------------
// Utility Types
// ----------------------------------------------------------------------------

/**
 * Order of categories for display
 */
export const CATEGORY_ORDER: CategoryId[] = [
  'layout',
  'spacing',
  'typography',
  'color',
  'border',
  'effect',
];

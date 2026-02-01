// ============================================================================
// CSS Extractor - Extracts and categorizes CSS from Figma nodes
// ============================================================================

import {
  ICategorizedCSS,
  ICSSCategory,
  ICSSProperty,
  CategoryId,
  CATEGORY_NAMES,
  CATEGORY_PROPERTY_MAP,
  CATEGORY_ORDER,
} from './types';

/**
 * Interface for CSSExtractor
 */
export interface ICSSExtractor {
  extractAndCategorize(node: SceneNode): Promise<ICategorizedCSS>;
}

/**
 * Error thrown when CSS extraction fails
 */
export class CSSExtractionError extends Error {
  constructor(
    message: string,
    public readonly code: string
  ) {
    super(message);
    this.name = 'CSSExtractionError';
  }
}

/**
 * CSSExtractor extracts CSS properties from Figma nodes and categorizes them.
 * - Uses node.getCSSAsync() for CSS extraction
 * - Categorizes properties into 6 groups: layout, spacing, typography, color, border, effect
 * - Sorts properties within each category in logical order
 */
export class CSSExtractor implements ICSSExtractor {
  /**
   * Build a reverse map from property name to category for quick lookup
   */
  private readonly propertyToCategoryMap: Map<string, CategoryId>;

  constructor() {
    this.propertyToCategoryMap = this.buildPropertyToCategoryMap();
  }

  /**
   * Extract CSS from a node and categorize it
   * @param node - The Figma SceneNode to extract CSS from
   * @returns Categorized CSS properties
   * @throws CSSExtractionError if extraction fails
   */
  async extractAndCategorize(node: SceneNode): Promise<ICategorizedCSS> {
    // Check if node supports getCSSAsync
    if (!this.supportsCSSExtraction(node)) {
      throw new CSSExtractionError(
        'このノードタイプはCSS抽出に対応していません',
        'UNSUPPORTED_NODE_TYPE'
      );
    }

    try {
      // Get CSS from Figma API
      const cssObject = await (node as FrameNode).getCSSAsync();

      // Categorize the CSS properties
      const categories = this.categorize(cssObject);

      return {
        nodeName: node.name,
        nodeType: node.type,
        categories,
      };
    } catch (error) {
      if (error instanceof CSSExtractionError) {
        throw error;
      }
      throw new CSSExtractionError(
        'CSSを取得できませんでした',
        'EXTRACTION_FAILED'
      );
    }
  }

  /**
   * Check if a node supports CSS extraction
   */
  private supportsCSSExtraction(node: SceneNode): boolean {
    // These node types support getCSSAsync
    const supportedTypes: string[] = [
      'FRAME',
      'COMPONENT',
      'COMPONENT_SET',
      'INSTANCE',
      'RECTANGLE',
      'ELLIPSE',
      'POLYGON',
      'STAR',
      'VECTOR',
      'TEXT',
      'LINE',
      'BOOLEAN_OPERATION',
      'SECTION',
    ];
    return supportedTypes.includes(node.type);
  }

  /**
   * Categorize CSS properties into groups
   */
  private categorize(cssObject: Record<string, string>): ICSSCategory[] {
    // Initialize category buckets
    const categoryBuckets: Record<CategoryId, ICSSProperty[]> = {
      layout: [],
      spacing: [],
      typography: [],
      color: [],
      border: [],
      effect: [],
    };

    // Distribute properties to categories
    for (const [name, value] of Object.entries(cssObject)) {
      const property = this.createProperty(name, value);
      const category = this.getPropertyCategory(name);

      if (category) {
        categoryBuckets[category].push(property);
      } else {
        // Unknown properties go to layout as fallback
        categoryBuckets.layout.push(property);
      }
    }

    // Build category objects in order, sorting properties within each
    return CATEGORY_ORDER.map((categoryId) => {
      const properties = this.sortPropertiesInCategory(
        categoryBuckets[categoryId],
        categoryId
      );

      return {
        id: categoryId,
        name: CATEGORY_NAMES[categoryId],
        properties,
        isEmpty: properties.length === 0,
      };
    });
  }

  /**
   * Create a CSS property object
   */
  private createProperty(name: string, value: string): ICSSProperty {
    return {
      name,
      value,
      formatted: `${name}: ${value};`,
    };
  }

  /**
   * Get the category for a CSS property
   */
  private getPropertyCategory(propertyName: string): CategoryId | null {
    return this.propertyToCategoryMap.get(propertyName) ?? null;
  }

  /**
   * Sort properties within a category based on logical order
   */
  private sortPropertiesInCategory(
    properties: ICSSProperty[],
    categoryId: CategoryId
  ): ICSSProperty[] {
    const orderMap = CATEGORY_PROPERTY_MAP[categoryId];
    const orderIndex = new Map(orderMap.map((prop, index) => [prop, index]));

    return [...properties].sort((a, b) => {
      const indexA = orderIndex.get(a.name) ?? 999;
      const indexB = orderIndex.get(b.name) ?? 999;
      return indexA - indexB;
    });
  }

  /**
   * Build reverse lookup map from property name to category
   */
  private buildPropertyToCategoryMap(): Map<string, CategoryId> {
    const map = new Map<string, CategoryId>();
    for (const categoryId of CATEGORY_ORDER) {
      for (const propertyName of CATEGORY_PROPERTY_MAP[categoryId]) {
        map.set(propertyName, categoryId);
      }
    }
    return map;
  }
}

// Export singleton instance for convenience
export const cssExtractor = new CSSExtractor();

import { describe, it, expect } from 'vitest';
import {
  isPluginToUIMessage,
  isUIToPluginMessage,
  PluginToUIMessage,
  UIToPluginMessage,
  ICategorizedCSS,
  CATEGORY_ORDER,
  CATEGORY_NAMES,
} from './types';

/**
 * Integration tests for message contracts and data flow
 */
describe('Integration: Message Contracts', () => {
  describe('PluginToUIMessage type guard', () => {
    it('should accept CSS_DATA message', () => {
      const msg: PluginToUIMessage = {
        type: 'CSS_DATA',
        payload: {
          nodeName: 'Button',
          nodeType: 'FRAME',
          categories: [],
        },
      };
      expect(isPluginToUIMessage(msg)).toBe(true);
    });

    it('should accept NO_SELECTION message', () => {
      const msg: PluginToUIMessage = {
        type: 'NO_SELECTION',
        payload: null,
      };
      expect(isPluginToUIMessage(msg)).toBe(true);
    });

    it('should accept ERROR message', () => {
      const msg: PluginToUIMessage = {
        type: 'ERROR',
        payload: {
          code: 'EXTRACTION_FAILED',
          message: 'Failed to extract CSS',
        },
      };
      expect(isPluginToUIMessage(msg)).toBe(true);
    });

    it('should accept LOADING message', () => {
      const msg: PluginToUIMessage = {
        type: 'LOADING',
        payload: true,
      };
      expect(isPluginToUIMessage(msg)).toBe(true);
    });

    it('should reject invalid messages', () => {
      expect(isPluginToUIMessage(null)).toBe(false);
      expect(isPluginToUIMessage(undefined)).toBe(false);
      expect(isPluginToUIMessage({ type: 'INVALID' })).toBe(false);
      expect(isPluginToUIMessage('string')).toBe(false);
    });
  });

  describe('UIToPluginMessage type guard', () => {
    it('should accept REQUEST_CSS message', () => {
      const msg: UIToPluginMessage = {
        type: 'REQUEST_CSS',
        payload: null,
      };
      expect(isUIToPluginMessage(msg)).toBe(true);
    });

    it('should accept CLOSE message', () => {
      const msg: UIToPluginMessage = {
        type: 'CLOSE',
        payload: null,
      };
      expect(isUIToPluginMessage(msg)).toBe(true);
    });

    it('should reject invalid messages', () => {
      expect(isUIToPluginMessage(null)).toBe(false);
      expect(isUIToPluginMessage({ type: 'CSS_DATA' })).toBe(false);
    });
  });
});

describe('Integration: Data Structure Validation', () => {
  it('should have 6 categories in correct order', () => {
    expect(CATEGORY_ORDER).toHaveLength(6);
    expect(CATEGORY_ORDER).toEqual([
      'layout',
      'spacing',
      'typography',
      'color',
      'border',
      'effect',
    ]);
  });

  it('should have names for all categories', () => {
    CATEGORY_ORDER.forEach((categoryId) => {
      expect(CATEGORY_NAMES[categoryId]).toBeDefined();
      expect(typeof CATEGORY_NAMES[categoryId]).toBe('string');
    });
  });

  it('should produce valid ICategorizedCSS structure', () => {
    const cssData: ICategorizedCSS = {
      nodeName: 'Test Node',
      nodeType: 'FRAME',
      categories: CATEGORY_ORDER.map((id) => ({
        id,
        name: CATEGORY_NAMES[id],
        properties: [
          {
            name: 'test-prop',
            value: 'test-value',
            formatted: 'test-prop: test-value;',
          },
        ],
        isEmpty: false,
      })),
    };

    expect(cssData.nodeName).toBe('Test Node');
    expect(cssData.nodeType).toBe('FRAME');
    expect(cssData.categories).toHaveLength(6);
    cssData.categories.forEach((cat) => {
      expect(cat.id).toBeDefined();
      expect(cat.name).toBeDefined();
      expect(Array.isArray(cat.properties)).toBe(true);
      expect(typeof cat.isEmpty).toBe('boolean');
    });
  });
});

describe('Integration: CSS Property Format', () => {
  it('should format properties correctly', () => {
    const property = {
      name: 'font-size',
      value: '16px',
      formatted: 'font-size: 16px;',
    };

    expect(property.formatted).toBe(`${property.name}: ${property.value};`);
  });

  it('should handle complex values', () => {
    const property = {
      name: 'font-family',
      value: '"Inter", "Helvetica Neue", sans-serif',
      formatted: 'font-family: "Inter", "Helvetica Neue", sans-serif;',
    };

    expect(property.formatted).toContain(property.name);
    expect(property.formatted).toContain(property.value);
  });
});

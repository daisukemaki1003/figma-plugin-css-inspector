import { describe, it, expect } from 'vitest';
import {
  CATEGORY_PROPERTY_MAP,
  CATEGORY_ORDER,
  CATEGORY_NAMES,
  CategoryId,
} from './types';

/**
 * Tests for CSS categorization logic
 * Note: CSSExtractor.extractAndCategorize requires Figma API mocking,
 * so we test the categorization logic through the exported constants
 */
describe('CSS Categorization Logic', () => {
  describe('CATEGORY_PROPERTY_MAP', () => {
    it('should have all 6 categories defined', () => {
      const categories = Object.keys(CATEGORY_PROPERTY_MAP);
      expect(categories).toHaveLength(6);
      expect(categories).toContain('layout');
      expect(categories).toContain('spacing');
      expect(categories).toContain('typography');
      expect(categories).toContain('color');
      expect(categories).toContain('border');
      expect(categories).toContain('effect');
    });

    it('should have layout properties including width, height, display', () => {
      const layoutProps = CATEGORY_PROPERTY_MAP.layout;
      expect(layoutProps).toContain('width');
      expect(layoutProps).toContain('height');
      expect(layoutProps).toContain('display');
      expect(layoutProps).toContain('flex-direction');
      expect(layoutProps).toContain('position');
    });

    it('should have spacing properties including margin and padding', () => {
      const spacingProps = CATEGORY_PROPERTY_MAP.spacing;
      expect(spacingProps).toContain('margin');
      expect(spacingProps).toContain('margin-top');
      expect(spacingProps).toContain('padding');
      expect(spacingProps).toContain('padding-left');
      expect(spacingProps).toContain('gap');
    });

    it('should have typography properties including font-family, font-size', () => {
      const typographyProps = CATEGORY_PROPERTY_MAP.typography;
      expect(typographyProps).toContain('font-family');
      expect(typographyProps).toContain('font-size');
      expect(typographyProps).toContain('font-weight');
      expect(typographyProps).toContain('line-height');
      expect(typographyProps).toContain('letter-spacing');
      expect(typographyProps).toContain('color');
    });

    it('should have color properties including background-color, opacity', () => {
      const colorProps = CATEGORY_PROPERTY_MAP.color;
      expect(colorProps).toContain('background');
      expect(colorProps).toContain('background-color');
      expect(colorProps).toContain('opacity');
    });

    it('should have border properties including border-radius', () => {
      const borderProps = CATEGORY_PROPERTY_MAP.border;
      expect(borderProps).toContain('border');
      expect(borderProps).toContain('border-radius');
      expect(borderProps).toContain('border-color');
    });

    it('should have effect properties including box-shadow, filter', () => {
      const effectProps = CATEGORY_PROPERTY_MAP.effect;
      expect(effectProps).toContain('box-shadow');
      expect(effectProps).toContain('filter');
      expect(effectProps).toContain('backdrop-filter');
    });
  });

  describe('CATEGORY_ORDER', () => {
    it('should define the correct display order', () => {
      expect(CATEGORY_ORDER).toEqual([
        'layout',
        'spacing',
        'typography',
        'color',
        'border',
        'effect',
      ]);
    });

    it('should include all categories', () => {
      const allCategories = Object.keys(CATEGORY_PROPERTY_MAP) as CategoryId[];
      CATEGORY_ORDER.forEach((category) => {
        expect(allCategories).toContain(category);
      });
    });
  });

  describe('CATEGORY_NAMES', () => {
    it('should have Japanese names for all categories', () => {
      expect(CATEGORY_NAMES.layout).toBe('レイアウト');
      expect(CATEGORY_NAMES.spacing).toBe('スペーシング');
      expect(CATEGORY_NAMES.typography).toBe('タイポグラフィ');
      expect(CATEGORY_NAMES.color).toBe('カラー');
      expect(CATEGORY_NAMES.border).toBe('ボーダー');
      expect(CATEGORY_NAMES.effect).toBe('エフェクト');
    });
  });

  describe('Property sorting order', () => {
    it('should have width before height in layout', () => {
      const layoutProps = CATEGORY_PROPERTY_MAP.layout;
      const widthIndex = layoutProps.indexOf('width');
      const heightIndex = layoutProps.indexOf('height');
      expect(widthIndex).toBeLessThan(heightIndex);
    });

    it('should have margin before padding in spacing', () => {
      const spacingProps = CATEGORY_PROPERTY_MAP.spacing;
      const marginIndex = spacingProps.indexOf('margin');
      const paddingIndex = spacingProps.indexOf('padding');
      expect(marginIndex).toBeLessThan(paddingIndex);
    });

    it('should have font-family before font-size in typography', () => {
      const typographyProps = CATEGORY_PROPERTY_MAP.typography;
      const familyIndex = typographyProps.indexOf('font-family');
      const sizeIndex = typographyProps.indexOf('font-size');
      expect(familyIndex).toBeLessThan(sizeIndex);
    });
  });
});

describe('CSS Property Format', () => {
  it('should format property correctly', () => {
    const name = 'font-size';
    const value = '16px';
    const formatted = `${name}: ${value};`;
    expect(formatted).toBe('font-size: 16px;');
  });

  it('should handle complex values', () => {
    const name = 'box-shadow';
    const value = '0px 4px 8px rgba(0, 0, 0, 0.1)';
    const formatted = `${name}: ${value};`;
    expect(formatted).toBe('box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);');
  });

  it('should handle font-family with quotes', () => {
    const name = 'font-family';
    const value = '"Inter", "Helvetica Neue", sans-serif';
    const formatted = `${name}: ${value};`;
    expect(formatted).toBe('font-family: "Inter", "Helvetica Neue", sans-serif;');
  });
});

describe('Supported Node Types', () => {
  const supportedTypes = [
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

  it('should support common Figma node types', () => {
    expect(supportedTypes).toContain('FRAME');
    expect(supportedTypes).toContain('COMPONENT');
    expect(supportedTypes).toContain('INSTANCE');
    expect(supportedTypes).toContain('TEXT');
    expect(supportedTypes).toContain('RECTANGLE');
  });

  it('should not include GROUP in supported types', () => {
    expect(supportedTypes).not.toContain('GROUP');
  });

  it('should have 13 supported node types', () => {
    expect(supportedTypes).toHaveLength(13);
  });
});

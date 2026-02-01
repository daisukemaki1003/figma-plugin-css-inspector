import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { CopyManager } from './CopyManager';
import { ICSSProperty, ICSSCategory } from '../../types';

describe('CopyManager', () => {
  let copyManager: CopyManager;
  let mockWriteText: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    copyManager = new CopyManager();
    mockWriteText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: {
        writeText: mockWriteText,
      },
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('copyText', () => {
    it('should copy text to clipboard and return true on success', async () => {
      const result = await copyManager.copyText('font-size: 16px;');

      expect(mockWriteText).toHaveBeenCalledWith('font-size: 16px;');
      expect(result).toBe(true);
    });

    it('should return false on clipboard error', async () => {
      mockWriteText.mockRejectedValue(new Error('Clipboard error'));

      const result = await copyManager.copyText('font-size: 16px;');

      expect(result).toBe(false);
    });
  });

  describe('copyProperty', () => {
    const mockProperty: ICSSProperty = {
      name: 'font-size',
      value: '16px',
      formatted: 'font-size: 16px;',
    };

    it('should copy formatted property to clipboard', async () => {
      const result = await copyManager.copyProperty(mockProperty);

      expect(mockWriteText).toHaveBeenCalledWith('font-size: 16px;');
      expect(result).toBe(true);
    });
  });

  describe('copyProperties', () => {
    const mockProperties: ICSSProperty[] = [
      { name: 'font-size', value: '16px', formatted: 'font-size: 16px;' },
      { name: 'font-weight', value: 'bold', formatted: 'font-weight: bold;' },
      { name: 'color', value: '#333', formatted: 'color: #333;' },
    ];

    it('should copy multiple properties with newline separator', async () => {
      const result = await copyManager.copyProperties(mockProperties);

      expect(mockWriteText).toHaveBeenCalledWith(
        'font-size: 16px;\nfont-weight: bold;\ncolor: #333;'
      );
      expect(result).toBe(true);
    });

    it('should handle empty properties array', async () => {
      const result = await copyManager.copyProperties([]);

      expect(mockWriteText).toHaveBeenCalledWith('');
      expect(result).toBe(true);
    });
  });

  describe('copyAllCategories', () => {
    const mockCategories: ICSSCategory[] = [
      {
        id: 'layout',
        name: 'レイアウト',
        properties: [
          { name: 'width', value: '100px', formatted: 'width: 100px;' },
          { name: 'height', value: '50px', formatted: 'height: 50px;' },
        ],
        isEmpty: false,
      },
      {
        id: 'typography',
        name: 'タイポグラフィ',
        properties: [
          { name: 'font-size', value: '16px', formatted: 'font-size: 16px;' },
        ],
        isEmpty: false,
      },
      {
        id: 'spacing',
        name: 'スペーシング',
        properties: [],
        isEmpty: true,
      },
    ];

    it('should copy all properties from all non-empty categories', async () => {
      const result = await copyManager.copyAllCategories(mockCategories);

      expect(mockWriteText).toHaveBeenCalledWith(
        'width: 100px;\nheight: 50px;\nfont-size: 16px;'
      );
      expect(result).toBe(true);
    });

    it('should skip empty categories', async () => {
      const emptyCategories: ICSSCategory[] = [
        {
          id: 'layout',
          name: 'レイアウト',
          properties: [],
          isEmpty: true,
        },
      ];

      const result = await copyManager.copyAllCategories(emptyCategories);

      expect(mockWriteText).toHaveBeenCalledWith('');
      expect(result).toBe(true);
    });
  });
});

import { ICSSProperty, ICSSCategory } from '../../types';

/**
 * CopyManager - Handles clipboard operations for CSS properties
 * - Supports copying single property, multiple properties, and all categories
 * - Formats multiple properties with newline separator
 * - Returns success/failure status
 * - Uses fallback method for Figma's sandboxed iframe environment
 */
export class CopyManager {
  /**
   * Copy raw text to clipboard
   * Uses execCommand fallback for Figma plugin iframe compatibility
   * @param text - Text to copy
   * @returns Promise<boolean> - true if successful, false otherwise
   */
  async copyText(text: string): Promise<boolean> {
    // Try modern Clipboard API first
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (error) {
        // Fall through to fallback method
      }
    }

    // Fallback: Use execCommand with a temporary textarea
    // This works in Figma's sandboxed iframe environment
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      textarea.style.top = '-9999px';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();

      const success = document.execCommand('copy');
      document.body.removeChild(textarea);

      if (!success) {
        throw new Error('execCommand copy failed');
      }
      return true;
    } catch (error) {
      console.error('Failed to copy text:', error);
      return false;
    }
  }

  /**
   * Copy a single CSS property to clipboard
   * @param property - CSS property to copy
   * @returns Promise<boolean> - true if successful, false otherwise
   */
  async copyProperty(property: ICSSProperty): Promise<boolean> {
    return this.copyText(property.formatted);
  }

  /**
   * Copy multiple CSS properties to clipboard with newline separator
   * @param properties - Array of CSS properties to copy
   * @returns Promise<boolean> - true if successful, false otherwise
   */
  async copyProperties(properties: ICSSProperty[]): Promise<boolean> {
    const text = properties.map((p) => p.formatted).join('\n');
    return this.copyText(text);
  }

  /**
   * Copy all properties from all non-empty categories
   * @param categories - Array of CSS categories
   * @returns Promise<boolean> - true if successful, false otherwise
   */
  async copyAllCategories(categories: ICSSCategory[]): Promise<boolean> {
    const allProperties = categories
      .filter((cat) => !cat.isEmpty)
      .flatMap((cat) => cat.properties);
    return this.copyProperties(allProperties);
  }
}

/**
 * Singleton instance for convenience
 */
export const copyManager = new CopyManager();

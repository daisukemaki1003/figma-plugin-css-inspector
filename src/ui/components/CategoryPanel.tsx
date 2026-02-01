import React, { useState, useCallback, memo } from 'react';
import { ICSSCategory, ICSSProperty } from '../../types';
import { PropertyItem } from './PropertyItem';

interface CategoryPanelProps {
  category: ICSSCategory;
  onCopyCategory: (properties: ICSSProperty[]) => void;
  onCopyProperty: (property: ICSSProperty) => void;
}

/**
 * CategoryPanel component
 * - Displays category header with collapse/expand toggle
 * - Shows property list when expanded
 * - Provides copy button for entire category
 * - Memoized to prevent unnecessary re-renders
 */
const CategoryPanelComponent: React.FC<CategoryPanelProps> = ({
  category,
  onCopyCategory,
  onCopyProperty,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleToggle = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  const handleCopyCategory = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onCopyCategory(category.properties);
    },
    [category.properties, onCopyCategory]
  );

  const handleCopyProperty = useCallback(
    (property: ICSSProperty) => {
      onCopyProperty(property);
    },
    [onCopyProperty]
  );

  // Don't render empty categories
  if (category.isEmpty) {
    return null;
  }

  return (
    <section className="category-panel">
      <header className="category-panel-header" onClick={handleToggle}>
        <span className={`category-chevron ${isExpanded ? 'expanded' : ''}`}>
          ▶
        </span>
        <span className="category-panel-title">{category.name}</span>
        <span className="category-count">{category.properties.length}</span>
        <button
          className="category-copy-btn"
          onClick={handleCopyCategory}
          title="カテゴリをコピー"
        >
          <CopyIcon />
        </button>
      </header>

      {isExpanded && (
        <ul className="category-properties">
          {category.properties.map((prop) => (
            <PropertyItem
              key={prop.name}
              property={prop}
              onCopy={handleCopyProperty}
            />
          ))}
        </ul>
      )}
    </section>
  );
};

/**
 * Simple copy icon component
 */
export const CategoryPanel = memo(CategoryPanelComponent);

/**
 * Simple copy icon component (memoized)
 */
const CopyIcon: React.FC = memo(() => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10 4H5C4.44772 4 4 4.44772 4 5V10C4 10.5523 4.44772 11 5 11H10C10.5523 11 11 10.5523 11 10V5C11 4.44772 10.5523 4 10 4Z"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8 4V2C8 1.44772 7.55228 1 7 1H2C1.44772 1 1 1.44772 1 2V7C1 7.55228 1.44772 8 2 8H4"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
));

export default CategoryPanel;

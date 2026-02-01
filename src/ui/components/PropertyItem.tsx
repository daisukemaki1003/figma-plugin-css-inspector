import React, { useCallback, memo } from 'react';
import { ICSSProperty } from '../../types';

interface PropertyItemProps {
  property: ICSSProperty;
  onCopy: (property: ICSSProperty) => void;
}

/**
 * PropertyItem component
 * - Displays individual CSS property with name and value
 * - Uses monospace font for code display
 * - Handles click to copy property
 * - Supports word-break for long values
 * - Memoized to prevent unnecessary re-renders
 */
const PropertyItemComponent: React.FC<PropertyItemProps> = ({
  property,
  onCopy,
}) => {
  const handleClick = useCallback(() => {
    onCopy(property);
  }, [property, onCopy]);

  return (
    <li
      className="property-item"
      onClick={handleClick}
      title="クリックでコピー"
    >
      <span className="property-name">{property.name}</span>
      <span className="property-value">{property.value}</span>
    </li>
  );
};

export const PropertyItem = memo(PropertyItemComponent);

export default PropertyItem;

import React from 'react';

interface HeaderProps {
  nodeName: string;
  nodeType: string;
  onCopyAll: () => void;
}

/**
 * Header component
 * - Displays node name and type
 * - Provides copy all button with icon and tooltip
 */
export const Header: React.FC<HeaderProps> = ({
  nodeName,
  nodeType,
  onCopyAll,
}) => {
  return (
    <header className="header">
      <h1 className="header-title">{nodeName}</h1>
      <span className="header-type">{nodeType}</span>
      <button
        className="header-copy-btn"
        onClick={onCopyAll}
        title="すべてコピー"
      >
        <CopyIcon />
      </button>
    </header>
  );
};

/**
 * Copy icon component
 */
const CopyIcon: React.FC = () => (
  <svg
    width="14"
    height="14"
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
);

export default Header;

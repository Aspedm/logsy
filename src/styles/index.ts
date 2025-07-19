/**
 * Generates CSS styles for a log message label.
 * @param primaryColor - The primary color for the label.
 * @returns {string}
 */
export const getLabelStyle = (primaryColor: string): string => {
  return `
    display: inline-block;
    border: 1px solid ${primaryColor};
    color: ${primaryColor};
    padding: 1px 4px;
    border-radius: 4px;
    margin-right: 8px;
  `;
};

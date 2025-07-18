/**
 * Generates CSS styles for a log message with a primary color.
 * @param primaryColor - Primary color for the log styles
 * @returns CSS styles for the log message
 */
export const getLogStyles = (primaryColor: string): string => {
  return `
    display: inline-block;
    border: 1px solid ${primaryColor};
    color: ${primaryColor};
    padding: 1px 4px;
    border-radius: 4px;
    margin-right: 8px;
  `;
};

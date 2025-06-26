// Currency conversion and formatting utilities

// Exchange rate: 1 EUR = 10.5 MAD (approximate rate)
const EUR_TO_MAD_RATE = 10.5;

/**
 * Convert EUR to MAD
 * @param eurAmount Amount in EUR
 * @returns Amount in MAD
 */
export const convertEurToMad = (eurAmount: number): number => {
  return eurAmount * EUR_TO_MAD_RATE;
};

/**
 * Format price in Moroccan Dirham
 * @param eurAmount Amount in EUR (from database)
 * @param showDecimals Whether to show decimal places (default: true)
 * @returns Formatted price string in MAD
 */
export const formatPrice = (eurAmount: number, showDecimals: boolean = true): string => {
  const madAmount = convertEurToMad(eurAmount);
  
  if (showDecimals) {
    return `${madAmount.toFixed(2)} DH`;
  } else {
    return `${Math.round(madAmount)} DH`;
  }
};

/**
 * Format price for display with proper spacing
 * @param eurAmount Amount in EUR (from database)
 * @param showDecimals Whether to show decimal places (default: true)
 * @returns Formatted price string with proper spacing
 */
export const formatPriceDisplay = (eurAmount: number, showDecimals: boolean = true): string => {
  const madAmount = convertEurToMad(eurAmount);
  
  if (showDecimals) {
    return `${madAmount.toFixed(2)} DH`;
  } else {
    return `${Math.round(madAmount)} DH`;
  }
};

/**
 * Get the raw MAD amount for calculations
 * @param eurAmount Amount in EUR (from database)
 * @returns Raw MAD amount as number
 */
export const getMadAmount = (eurAmount: number): number => {
  return convertEurToMad(eurAmount);
};

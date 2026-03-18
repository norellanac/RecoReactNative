/**
 * Formatea un precio con símbolo de moneda
 * @param price - Precio a formatear
 * @param currency - Símbolo de moneda (por defecto 'Q')
 * @param decimals - Número de decimales (por defecto 2)
 * @returns Precio formateado
 */
export const formatPrice = (
  price: number | string | null | undefined,
  currency: string = 'Q',
  decimals: number = 2
): string => {
  if (price === null || price === undefined || isNaN(Number(price))) {
    return `${currency}0.${'0'.repeat(decimals)}`;
  }
  
  const numericPrice = Number(price);
  return `${currency}${numericPrice.toFixed(decimals)}`;
};

/**
 * Formatea un rating/calificación
 * @param rating - Rating a formatear
 * @param decimals - Número de decimales (por defecto 1)
 * @param fallback - Valor por defecto si no hay rating
 * @returns Rating formateado
 */
export const formatRating = (
  rating: number | string | null | undefined,
  decimals: number = 1,
  fallback: string = '0.0'
): string => {
  if (rating === null || rating === undefined || isNaN(Number(rating))) {
    return fallback;
  }
  
  const numericRating = Number(rating);
  return numericRating.toFixed(decimals);
};

/**
 * Formatea un número con decimales específicos
 * @param value - Valor a formatear
 * @param decimals - Número de decimales
 * @param fallback - Valor por defecto
 * @returns Número formateado
 */
export const formatNumber = (
  value: number | string | null | undefined,
  decimals: number = 0,
  fallback: string = '0'
): string => {
  if (value === null || value === undefined || isNaN(Number(value))) {
    return fallback;
  }
  
  const numericValue = Number(value);
  return numericValue.toFixed(decimals);
};

/**
 * Formatea porcentajes
 * @param value - Valor a formatear
 * @param decimals - Número de decimales
 * @returns Porcentaje formateado
 */
export const formatPercentage = (
  value: number | string | null | undefined,
  decimals: number = 1
): string => {
  if (value === null || value === undefined || isNaN(Number(value))) {
    return '0%';
  }
  
  const numericValue = Number(value);
  return `${numericValue.toFixed(decimals)}%`;
};

/**
 * Formatea monedas con separadores de miles
 * @param amount - Cantidad a formatear
 * @param currency - Símbolo de moneda
 * @param locale - Locale para formateo (por defecto 'es-GT' para Guatemala)
 * @returns Cantidad formateada con separadores
 */
export const formatCurrency = (
  amount: number | string | null | undefined,
  currency: string = 'Q',
  locale: string = 'es-GT'
): string => {
  if (amount === null || amount === undefined || isNaN(Number(amount))) {
    return `${currency}0.00`;
  }
  
  const numericAmount = Number(amount);
  
  // Formatear con separadores de miles
  const formatted = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericAmount);
  
  return `${currency}${formatted}`;
};
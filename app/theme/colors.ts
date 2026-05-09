export const colors = {
  primary: '#6750A4',
  secondary: '#625B71',
  tertiary: '#7D5260',
  error: '#F76B6A',
  primary_container: '#EADDFF',
  secondary_container: '#E8DEF8',
  tertiary_container: '#FFD8E4',
  error_container: '#F9DEDC',
  background: '#FFFBFE',
  text: '#000000',
  black: '#000000',
  white: '#FFFFFF',
  grey: '#79747E',
  softgrey: '#E8E8E8',
  // Add other color definitions here
};

// For dynamic branding colors, use useBranding().colors in components.
// This gives the active brand palette (colorsLight) with DEFAULT_COLORS as fallback.
import { BrandingConfig } from '../types/branding';
import { DEFAULT_COLORS } from '../hooks/useBranding';

export const getBrandingColors = (config: BrandingConfig | null) =>
  config ? config.colorsLight : DEFAULT_COLORS;

import { ImageSourcePropType } from 'react-native';
import { useAppSelector } from './useAppSelector';
import { selectBranding } from '../redux/slices/brandingSlice';
import { BrandingColors } from '../types/branding';
import { BASE_URL } from '../utils/Environment';

const LOCAL_LOGO = require('../assets/img/Reco_logo.png');
const LOCAL_ICON = require('../assets/img/RecoIcon.png');

export const DEFAULT_COLORS: BrandingColors = {
  primary: '#6750A4',
  primaryContainer: '#EADDFF',
  secondary: '#625B71',
  secondaryContainer: '#E8DEF8',
  tertiary: '#7D5260',
  tertiaryContainer: '#FFD8E4',
  error: '#B3261E',
  errorContainer: '#F9DEDC',
  background: '#FFFFFF',
  surface: '#FFFFFF',
  textPrimary: '#000000',
  textSecondary: '#49454F',
  onPrimary: '#FFFFFF',
  onSecondary: '#FFFFFF',
  onTertiary: '#FFFFFF',
};

export const useBranding = () => {
  const { config, isLoaded } = useAppSelector(selectBranding);

  const colors: BrandingColors = config?.colorsLight ?? DEFAULT_COLORS;

  const getLogoSource = (): ImageSourcePropType =>
    config?.logoUrl ? { uri: `${BASE_URL}${config.logoUrl}` } : LOCAL_LOGO;

  const getIconSource = (): ImageSourcePropType =>
    config?.iconUrl ? { uri: `${BASE_URL}${config.iconUrl}` } : LOCAL_ICON;

  const getImageUrl = (path: string | null | undefined): string | null => {
    if (!path) return null;
    return path.startsWith('http') ? path : `${BASE_URL}${path}`;
  };

  return { config, isLoaded, colors, getLogoSource, getIconSource, getImageUrl };
};

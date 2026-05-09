export interface BrandingColors {
  primary: string;
  primaryContainer: string;
  secondary: string;
  secondaryContainer: string;
  tertiary: string;
  tertiaryContainer: string;
  error: string;
  errorContainer: string;
  background: string;
  surface: string;
  textPrimary: string;
  textSecondary: string;
  onPrimary: string;
  onSecondary: string;
  onTertiary: string;
}

export interface BrandingFeatures {
  chatEnabled: boolean;
  tasksEnabled: boolean;
  newsletterEnabled: boolean;
  socialAuthEnabled: boolean;
  darkModeEnabled: boolean;
  biometricsEnabled: boolean;
}

export interface BrandingConfig {
  id: number;
  appName: string;
  tagline: string;
  legalName: string;
  logoUrl: string | null;
  iconUrl: string | null;
  splashUrl: string | null;
  faviconUrl: string | null;
  defaultImageUrl: string | null;
  sliderImages: string[];
  colorsLight: BrandingColors;
  colorsDark: BrandingColors;
  fontFamily: string;
  buttonBorderRadius: number;
  termsUrl: string;
  privacyUrl: string;
  supportUrl: string;
  privacyEmail: string;
  legalEmail: string;
  companyAddress: string;
  mailchimpApiUrl: string;
  features: BrandingFeatures;
  copyOverrides: Record<string, Record<string, string>>;
}

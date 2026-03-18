import { colors } from './colors';
const commonButtonStyles = {
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 100,
  minHeight: 50,
  minWidth: 120,
};

export const buttonsTheme = {
  filled: {
    ...commonButtonStyles,
    backgroundColor: colors.primary,
  },
  filled_disabled: {
    ...commonButtonStyles,
    backgroundColor: colors.grey,
    opacity: 0.5,
  },
  outlined: {
    ...commonButtonStyles,
    backgroundColor: 'transparent',
    borderColor: colors.grey,
    borderWidth: 1,
  },
  outlined_disabled: {
    ...commonButtonStyles,
    borderColor: colors.grey,
    borderWidth: 1,
    opacity: 0.5,
  },
  text: {
    ...commonButtonStyles,
    backgroundColor: 'transparent',
    color: colors.primary,
  },
  text_disabled: {
    ...commonButtonStyles,
    backgroundColor: 'transparent',
    color: colors.grey,
    opacity: 0.5,
  },
  elevated: {
    ...commonButtonStyles,
    borderWidth: 2,
    borderColor: colors.background, // Outline color
    backgroundColor: colors.background,
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    // Elevation for Android
    elevation: 5,
  },
  elevated_disabled: {
    ...commonButtonStyles,
    borderWidth: 2,
    borderColor: colors.background, // Outline color
    backgroundColor: colors.background,
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    // Elevation for Android
    elevation: 5,
    opacity: 0.5,
  },
  tonal: {
    ...commonButtonStyles,
    backgroundColor: colors.secondary_container,
  },
  tonal_disabled: {
    ...commonButtonStyles,
    backgroundColor: colors.grey,
    opacity: 0.5,
  },
};

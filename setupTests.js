// Mock the ThemeProvider
jest.mock('./app/theme/ThemeProvider', () => ({
  useTheme: () => ({
    theme: {
      colors: {
        primary: '#007AFF',
        white: '#FFFFFF',
        black: '#000000',
        grey: '#8E8E93',
      },
      buttonVariants: {
        filled: {
          backgroundColor: '#007AFF',
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderRadius: 8,
        },
        outlined: {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: '#007AFF',
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderRadius: 8,
        },
        text: {
          backgroundColor: 'transparent',
          paddingHorizontal: 16,
          paddingVertical: 12,
        },
        elevated: {
          backgroundColor: '#007AFF',
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderRadius: 8,
          elevation: 4,
        },
        tonal: {
          backgroundColor: '#E3F2FD',
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderRadius: 8,
        },
        filled_disabled: {
          backgroundColor: '#8E8E93',
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderRadius: 8,
        },
        outlined_disabled: {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: '#8E8E93',
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderRadius: 8,
        },
        text_disabled: {
          backgroundColor: 'transparent',
          paddingHorizontal: 16,
          paddingVertical: 12,
        },
      },
      textVariants: {
        body: {
          medium: {
            fontSize: 16,
            fontWeight: '400',
          },
        },
        headline: {
          large: {
            fontSize: 24,
            fontWeight: '700',
          },
        },
      },
    },
  }),
}));

// Mock the components from @atoms - but don't mock them since we want to test the real components
// jest.mock('@atoms', () => {
//   return {
//     Text: 'Text',
//     Button: 'Button',
//   };
// });

// mock expo-sqlite
// jest.mock('expo-sqlite', () => {
//   return {
//     openDatabase: jest.fn(() => ({
//       transaction: jest.fn(callback => {
//         const tx = {
//           executeSql: jest.fn((sql, params, successCallback, errorCallback) => {
//             successCallback(tx, { rows: { _array: [] } });
//           }),
//         };
//         callback(tx);
//       }),
//     })),
//   };
// });

// // mock expo-device
// jest.mock('expo-device', () => {
//   return {
//     isDevice: true,
//     brand: 'MockBrand',
//     modelName: 'MockModel',
//     osName: 'MockOS',
//     osVersion: 'MockVersion',
//     totalMemory: 4096,
//   };
// });

// // mock navigationRef from internal navigation setup on jest.config.js
// jest.mock('@navigation', () => {
//   return {
//     navigationRef: {
//       current: {
//         navigate: jest.fn(),
//         goBack: jest.fn(),
//       },
//     },
//   };
// });

// // mock expo-application
// jest.mock('expo-application', () => {
//   return {
//     applicationId: 'mockApplicationId',
//   };
// });

// // Mock the expo-secure-store module
// jest.mock('expo-secure-store', () => {
//   return {
//     setItemAsync: jest.fn(),
//     getItemAsync: jest.fn(),
//     deleteItemAsync: jest.fn(),
//   };
// });

// // Mock the @expo/vector-icons module
// jest.mock('@expo/vector-icons', () => {
//   return {
//     Ionicons: jest.fn(() => null),
//     MaterialIcons: jest.fn(() => null),
//     FontAwesome: jest.fn(() => null),
//     // Add other icons as needed
//   };
// });

// // Mock the expo-splash-screen module
// jest.mock('expo-splash-screen', () => {
//   return {
//     preventAutoHideAsync: jest.fn(),
//     hideAsync: jest.fn(),
//   };
// });

// // Mock the @expo-google-fonts/source-sans-pro module
// jest.mock('@expo-google-fonts/source-sans-pro', () => {
//   return {
//     useFonts: jest.fn(() => [true, false]),
//     SourceSansPro_400Regular: jest.fn(),
//     SourceSansPro_400Regular_Italic: jest.fn(),
//     SourceSansPro_600SemiBold: jest.fn(),
//     SourceSansPro_700Bold: jest.fn(),
//   };
// });

// // Mock `useSafeAreaInsets` to prevent undefined values
// jest.mock('react-native-safe-area-context', () => ({
//   ...jest.requireActual('react-native-safe-area-context'),
//   useSafeAreaInsets: jest.fn(() => ({
//     top: 0,
//     bottom: 0,
//     left: 0,
//     right: 0,
//   })),
//   initialWindowMetrics: {
//     frame: { x: 0, y: 0, width: 0, height: 0 },
//     insets: { top: 0, left: 0, right: 0, bottom: 0 },
//   },
// }));

// // Mock the components from @atoms
// jest.mock('@atoms', () => {
//   return {
//     BackgroundImage: 'BackgroundImage',
//     Icon: 'Icon',
//     Text: {
//       Regular: 'Text',
//     },
//   };
// });

// // Mock the BackgroundImage component from @atoms
// jest.mock('@atoms', () => {
//   return 'BackgroundImage';
// });

// // Mock the Icon component from @atoms
// jest.mock('@atoms/Icon', () => {
//   return 'Icon';
// });

// // Mock the Text component from @atoms
// jest.mock('@atoms/Text', () => {
//   return {
//     Regular: 'Text.Regular',
//   };
// });

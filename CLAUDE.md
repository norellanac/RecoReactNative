# projectx-mobile — Agent Context

## Role
This is the **React Native mobile app** (Expo). It is a **read-only consumer** of the branding/customization config — it fetches the config from the backend on startup and applies it to colors, logos, links, and feature flags. It never writes to the branding API. All edits happen in the admin app.

## Tech Stack
| | |
|---|---|
| Framework | React Native 0.83 + Expo SDK 55 |
| State | Redux Toolkit + redux-persist (AsyncStorage) |
| Navigation | React Navigation v6 (native-stack + bottom-tabs) |
| Forms | Formik + Yup |
| i18n | i18next + react-i18next |
| HTTP | RTK Query (`createApi` + `baseQueryWithReauth`) |
| Biometrics | expo-local-authentication |
| Local DB | expo-sqlite |
| Storage | expo-secure-store (tokens), AsyncStorage (Redux persist) |
| Animations | Lottie, react-native-reanimated |
| Current branding | "Reco" — `gt.com.reco.app`, v0.7.5 |

## Source Layout
```
app/
├── features/
│   ├── auth/
│   │   └── screens/
│   │       └── SplashScreen.tsx   # ← Has hardcoded Reco_logo.png & colors
│   ├── Home/
│   │   └── components/molecules/
│   │       └── GreetingHeader.tsx  # ← Has hardcoded RecoIcon.png
│   ├── Business/, Services/, Search/, Task/
│   ├── Chat/, Favorites/, Profile/
├── components/
│   ├── atoms/      # Text, Button, Input, Icon...
│   ├── molecules/  # Avatar, Card, FormField...
│   └── templates/  # Page layout wrappers
├── services/       # RTK Query files
│   ├── brandingApi.ts  # ← Does NOT exist yet — must be created
│   ├── authApi.ts, productApi.ts, categoryApi.ts
│   ├── userApi.ts, ordersApi.ts, locationsApi.ts
│   ├── chatApi.ts, reviewsApi.ts
│   └── api.ts          # Re-exports all services
├── redux/
│   ├── slices/
│   │   ├── authSlice.ts
│   │   ├── favoritesSlice.ts
│   │   ├── filterProductsSlice.ts
│   │   └── serviceStepperSlice.ts
│   └── store/store.ts
├── hooks/              # Custom hooks (useAppSelector, useAppDispatch...)
├── routes/             # React Navigation stack definitions
├── theme/
│   ├── colors.ts       # ← Hardcoded hex values — must become dynamic
│   ├── typography.ts   # Type scale (can stay static)
│   ├── buttons.ts      # Button style variants
│   └── themes.ts       # Input styles
├── types/
│   └── api/            # API response/request interfaces
├── utils/
│   ├── Environment.ts  # BASE_URL, getApiImageUrl(path)
│   └── logging/
├── helpers/
│   └── i18n.ts         # i18n config (default: 'es', fallback: 'en')
└── assets/
    ├── img/
    │   ├── Reco_logo.png    # ← Will be replaced by dynamic URL
    │   ├── RecoIcon.png     # ← Will be replaced by dynamic URL
    │   └── default-Reco-image.png
    ├── fonts/
    └── translations/    # en.json, es.json
```

## Key Conventions
- **API calls**: RTK Query `createApi` + `baseQueryWithReauth`. Same pattern as web.
- **Store**: `app/redux/store/store.ts` uses `AsyncStorage` for persist, includes `devToolsEnhancer()`. Register new APIs there.
- **Image sources**: local static images use `require('./path')`. Dynamic/remote images use `{ uri: url }`. When replacing static logos with API-served ones, fall back to `require()` if the URL is null.
- **Colors**: `app/theme/colors.ts` exports a `colors` const used throughout. Components reference `colors.primary` etc. — do not import hex strings directly in components.
- **Navigation**: bottom tabs and stacks are defined in `app/routes/`. Feature flag gates should hide the tab/screen entirely (not just disable).
- **i18n**: `t('key')` everywhere, default language is Spanish (`es`). Translation files in `app/assets/translations/`.
- **Imports**: uses path alias `@/` → project root. Example: `import { foo } from '@/app/hooks/useAppSelector'`.
- **Environment**: `app/utils/Environment.ts` exposes `BASE_URL` and `getApiImageUrl(path)` — use these for all API image URLs.
- **App icon / OS splash**: these are defined in `app.json` and compiled into the binary at build time. They CANNOT be changed dynamically at runtime. Only in-app images (logo displayed in SplashScreen.tsx, GreetingHeader.tsx, etc.) can be dynamic.

## Scripts
```bash
yarn start            # Expo start
yarn android          # Run on Android
yarn ios              # Run on iOS
yarn test             # Jest unit tests
yarn test:e2e:android # Appium E2E (Android)
yarn test:e2e:ios     # Appium E2E (iOS)
yarn lint             # ESLint
yarn extract          # Extract i18n keys
yarn format           # Prettier
```

## Environment Variables
```
EXPO_PUBLIC_API_URL   # e.g. https://dev.recolatam.com/api/v1
```
Production overrides in `.env.production`. EAS project ID: `98712f33-47b0-4bf5-b2cc-d91b0524ad16`.

---

## Customization / Branding Module — Mobile's Role: READ-ONLY CONSUMER

The mobile app fetches branding config once on startup (before rendering any screen), persists it in Redux, and uses it for:
1. Dynamic colors applied to all themed components
2. Dynamic in-app logo (SplashScreen, GreetingHeader)
3. Correct links for terms/privacy
4. Feature flag gating (hide tabs/screens for disabled features)
5. App name and tagline from config

### BrandingConfig type (must match backend exactly)
```typescript
interface BrandingColors {
  primary: string; primaryContainer: string;
  secondary: string; secondaryContainer: string;
  tertiary: string; tertiaryContainer: string;
  error: string; errorContainer: string;
  background: string; surface: string;
  textPrimary: string; textSecondary: string;
  onPrimary: string; onSecondary: string; onTertiary: string;
}
interface BrandingFeatures {
  chatEnabled: boolean; tasksEnabled: boolean; newsletterEnabled: boolean;
  socialAuthEnabled: boolean; darkModeEnabled: boolean; biometricsEnabled: boolean;
}
interface BrandingConfig {
  id: number;
  appName: string; tagline: string; legalName: string;
  logoUrl: string | null; iconUrl: string | null; splashUrl: string | null;
  faviconUrl: string | null; defaultImageUrl: string | null;
  sliderImages: string[];
  colorsLight: BrandingColors; colorsDark: BrandingColors;
  fontFamily: string; buttonBorderRadius: number;
  termsUrl: string; privacyUrl: string; supportUrl: string;
  privacyEmail: string; legalEmail: string; companyAddress: string;
  mailchimpApiUrl: string;
  features: BrandingFeatures;
  copyOverrides: Record<string, Record<string, string>>;
}
```

### What needs to be built

#### 1. `app/types/branding.ts`
Export the `BrandingConfig`, `BrandingColors`, `BrandingFeatures` interfaces above.

#### 2. `app/services/brandingApi.ts`
RTK Query `createApi` with a single `getBranding` query:
```typescript
query: () => ({ url: 'branding/', method: 'GET' })
```
No auth required (public endpoint). `reducerPath: 'brandingApi'`.
Also add it to `app/services/api.ts` re-export.

#### 3. `app/redux/slices/brandingSlice.ts`
```typescript
type BrandingState = { config: BrandingConfig | null; isLoaded: boolean }
// actions: setBranding(config), clearBranding()
// selector: selectBranding(state) → state.branding
```

#### 4. Update `app/redux/store/store.ts`
- Add `brandingReducer` to `rootReducer`
- Add `brandingApi.reducer` and `brandingApi.middleware`
- Add `'branding'` to redux-persist whitelist

#### 5. `app/hooks/useBranding.ts`
```typescript
// Returns { config, isLoaded, colors, getLogoSource, getIconSource }
// colors: BrandingColors — falls back to DEFAULT_COLORS if config is null
// getLogoSource(): ImageSourcePropType — { uri } if logoUrl exists, else require('./assets/img/Reco_logo.png')
// getIconSource(): ImageSourcePropType — { uri } if iconUrl exists, else require('./assets/img/RecoIcon.png')
```

#### 6. Update `app/theme/colors.ts`
Keep the existing `colors` const as the **default/fallback**. Export a new function:
```typescript
export const getBrandingColors = (config: BrandingConfig | null) =>
  config ? config.colorsLight : colors;
```
Components that need colors should call `useBranding().colors` (which resolves to light palette by default). Do NOT force-refactor every component — only the ones that currently hardcode hex values.

#### 7. Fetch branding in `index.tsx` (app entry)
Before `SplashScreen.preventAutoHideAsync()` resolves, dispatch a branding fetch. Pattern:
- Dispatch the RTK Query `getBranding` thunk and await it
- Store result via `setBranding` action
- Proceed with font loading and splash animation

Alternative (simpler): use `useGetBrandingQuery()` in the root component and gate rendering on `isLoaded`.

#### 8. Update `app/features/auth/screens/SplashScreen.tsx`
- Replace `const RecoLogo = require('../../../assets/img/Reco_logo.png')` with `useBranding().getLogoSource()`
- Replace hardcoded `backgroundColor: '#ffffff'` with `colors.background`
- Replace hardcoded `backgroundColor: '#7B61FF'` (dot active color) with `colors.primary`
- Tagline text: read from `t('splash.tagline')` — already done; optionally override via `copyOverrides`

#### 9. Update `app/features/Home/components/molecules/GreetingHeader.tsx`
- Replace `import RecoIcon from '../../../../assets/img/RecoIcon.png'` with `useBranding().getIconSource()`
- Change `<Image source={RecoIcon} ...>` to `<Image source={iconSource} ...>`

#### 10. Feature flag gating
In the bottom tab navigator (in `app/routes/`), conditionally include tabs based on feature flags:
```typescript
const { config } = useBranding();
// Only render Chat tab if config?.features.chatEnabled
// Only render Tasks tab if config?.features.tasksEnabled
```

#### 11. Update terms/privacy links
In `app/features/Profile/` and `app/features/auth/screens/AuthStack.tsx`:
- Replace hardcoded `https://recolatam.com/terms-and-conditions` with `config?.termsUrl`
- Replace hardcoded `https://recolatam.com/privacy-policy` with `config?.privacyUrl`

### Image URL resolution
`app/utils/Environment.ts` already has `getApiImageUrl(path)` — use it for all branding image URLs. It prepends `BASE_URL` for relative paths and returns a `{ uri }` object (or local fallback for null).

### Important: what NOT to change dynamically
- `app.json` → `name`, `slug`, `android.package` — build-time only, require a new app binary
- OS-level splash screen (`assets/images/splash.png`) — build-time only
- App store icon (`assets/images/icon.png`) — build-time only
- Font files — already loaded at startup via `expo-font`; font family name from `config.fontFamily` can be used in styles but the font file itself must be bundled at build time

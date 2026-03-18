import 'react-native-gesture-handler';
import './helpers/i18n';
import './../polyfills';
import RootNavigator from './routes/RootNavigator';
import { ThemeProvider } from './theme/ThemeProvider';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import i18n from './helpers/i18n';
import SplashScreenComponent from './features/auth/screens/SplashScreen';
import { useState, useEffect } from 'react';
import { PersistGate } from 'redux-persist/integration/react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { persistor, store } from './redux/store/store';
import * as Updates from 'expo-updates';

export default function App() {
  const [isAppReady, setAppReady] = useState(false);

  useEffect(() => {
    async function checkForUpdates() {
      if (__DEV__) return;
      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          await Updates.reloadAsync();
        }
      } catch (e) {
        console.log('Error checking for OTA updates:', e);
      }
    }
    checkForUpdates();
  }, []);

  const handleAppReady = () => {
    setAppReady(true);
  };

  if (!isAppReady) return <SplashScreenComponent onReady={handleAppReady} />;

  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <I18nextProvider i18n={i18n}>
            <ThemeProvider>
              <RootNavigator />
            </ThemeProvider>
          </I18nextProvider>
        </PersistGate>
      </Provider>
    </SafeAreaProvider>
  );
}

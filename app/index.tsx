import './helpers/i18n';
import './../polyfills';
import 'react-native-gesture-handler';
import RootNavigator from './routes/RootNavigator';
import { ThemeProvider } from './theme/ThemeProvider';
import { Provider } from 'react-redux';
import { store } from './redux/store/store';
import { I18nextProvider } from 'react-i18next';
import i18n from './helpers/i18n';
import SplashScreenComponent from './features/auth/screens/SplashScreen';
import SliderScreenComponent from './features/auth/screens/IntroSlider';
import { useState } from 'react';

export default function App() {
  const [isAppReady, setAppReady] = useState(false);
  const [isAppSlider, setAppSlider] = useState(false);

  const handleAppReady = () => {
    setAppReady(true);
  };
  const handleAppSlider = () => {
    setAppSlider(true);
  };

  if (!isAppReady) return <SplashScreenComponent onReady={handleAppReady} />;
  if (!isAppSlider) return <SliderScreenComponent onReady={handleAppSlider} />;

  return (
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <ThemeProvider>
          <RootNavigator />
        </ThemeProvider>
      </I18nextProvider>
    </Provider>
  );
}

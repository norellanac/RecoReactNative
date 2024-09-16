import './helpers/i18n';
import './../polyfills';
import 'react-native-gesture-handler';
import RootNavigator from './routes/RootNavigator';
import { ThemeProvider } from './theme/ThemeProvider';
import { Provider } from 'react-redux';
import { store } from './redux/store/store';
import { I18nextProvider } from 'react-i18next';
import i18n from './helpers/i18n';

export default function App() {
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

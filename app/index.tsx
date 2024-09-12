import './helpers/i18n';
import './../polyfills';
import 'react-native-gesture-handler';
import RootNavigator from './routes/RootNavigator';
// import { useTranslation } from 'react-i18next';
import { ThemeProvider } from './theme/ThemeProvider';
import { Provider } from 'react-redux';
import { store } from './redux/store/store';

export default function App() {
  // const { t } = useTranslation();
  return (
    <Provider store={store}>
      <ThemeProvider>
        <RootNavigator />
      </ThemeProvider>
    </Provider>
  );
}

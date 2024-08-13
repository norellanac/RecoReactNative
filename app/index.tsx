import './helpers/i18n';
import './../polyfills';
import 'react-native-gesture-handler';
import RootNavigator from './routes/RootNavigator';
import { useTranslation } from 'react-i18next';
import { ThemeProvider } from './theme/ThemeProvider';

export default function App() {
  const { t } = useTranslation();
  return ( 
    <ThemeProvider>
      <RootNavigator isAuthenticated={false} />
    </ThemeProvider>
  );
}


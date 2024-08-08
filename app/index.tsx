import './helpers/i18n';
import './../polyfills';
import 'react-native-gesture-handler';
import RootNavigator from './routes/RootNavigator';
import { useTranslation } from 'react-i18next';

export default function App() {
  const { t } = useTranslation();
  return ( 
    <RootNavigator isAuthenticated={false} />
  );
}


import { StyleSheet, Text, View } from "react-native";
import LanguageSwitcher from "./components/molecules/LanguageSwitcher";
import { useTranslation } from "react-i18next";
import './helpers/i18n';
import './../polyfills';

export default function App() {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <Text></Text>
      <View style={styles.main}>
        <Text style={styles.title}>{t('commons.start')}</Text>
        <Text style={styles.subtitle}>{t('welcome_message')}</Text>
        <Text style={styles.subtitle}>This is the first page of your app.</Text>
      <LanguageSwitcher />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 24,
  },
  main: {
    flex: 1,
    justifyContent: "center",
    maxWidth: 960,
    marginHorizontal: "auto",
  },
  title: {
    fontSize: 64,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 36,
    color: "#38434D",
  },
});

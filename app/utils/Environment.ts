import Constants from 'expo-constants';
import DEFAULT_IMAGE from './../assets/img/default-Reco-image.png';

const envUrl = (
  Constants.expoConfig?.extra?.EXPO_PUBLIC_API_URL ||
  process.env.EXPO_PUBLIC_API_URL
)?.trim();
export const BASE_URL = envUrl || 'https://dev.recolatam.com/api/v1';

if (__DEV__) {
  console.log(
    '[Environment] EXPO_PUBLIC_API_URL (Constants):',
    Constants.expoConfig?.extra?.EXPO_PUBLIC_API_URL,
  );
}

export const getApiImageUrl = (itemUrl: string) => {
  const baseUrl = BASE_URL;
  if (!itemUrl) return DEFAULT_IMAGE;
  const imgTemp = itemUrl?.startsWith('http')
    ? itemUrl
    : `${baseUrl + itemUrl}`;
  return { uri: imgTemp };
};

import DEFAULT_IMAGE from './../assets/img/default-Reco-image.png';

export const BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || 'https://dev.recolatam.com/api/v1';

export const getApiImageUrl = (itemUrl: string) => {
  const baseUrl = BASE_URL;
  if (!itemUrl) return DEFAULT_IMAGE;
  const imgTemp = itemUrl?.startsWith('http')
    ? itemUrl
    : `${baseUrl + itemUrl}`;
  return { uri: imgTemp };
};

import DEFAULT_IMAGE from './../assets/img/default-Reco-image.png';

const envUrl = process.env.EXPO_PUBLIC_API_URL?.trim();

// export const BASE_URL =
//   envUrl && envUrl.startsWith('http')
//     ? envUrl
//     : 'https://dev.recolatam.com/api/v1';
export const BASE_URL = 'https://dev.recolatam.com/api/v1';

if (__DEV__) {
  console.log('[Environment] BASE_URL:', BASE_URL);
}

export const getApiImageUrl = (itemUrl: string) => {
  const baseUrl = BASE_URL;
  if (!itemUrl) return DEFAULT_IMAGE;
  const imgTemp = itemUrl?.startsWith('http')
    ? itemUrl
    : `${baseUrl + itemUrl}`;
  return { uri: imgTemp };
};

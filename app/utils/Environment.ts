import DEFAULT_IMAGE from './../assets/img/default-Reco-image.png';
export const getApiImageUrl = (itemUrl: string) => {
  const baseUrl = process.env.EXPO_PUBLIC_API_URL;
  if (!itemUrl) return DEFAULT_IMAGE;
  const imgTemp = itemUrl?.startsWith('http')
    ? itemUrl
    : `${baseUrl + itemUrl}`;
  return { uri: imgTemp };
};

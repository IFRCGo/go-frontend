const emptyObject = {};

export const getDataFromResponse = (response, defaultValue = emptyObject) => {
  if (!response) {
    return defaultValue;
  }

  if (response.fetching || !response.fetched) {
    return defaultValue;
  }

  return response.data;
};

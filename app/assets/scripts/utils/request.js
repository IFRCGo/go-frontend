const emptyObject = {};
const emptyList = [];

export const getDataFromResponse = (response, defaultValue = emptyObject) => {
  if (!response) {
    return defaultValue;
  }

  if (response.fetching || !response.fetched) {
    return defaultValue;
  }

  return response.data;
};

export const getResultsFromResponse = (response, defaultValue = emptyList) => {
  const data = getDataFromResponse(response);
  const { results = emptyList } = data;

  return results;
};

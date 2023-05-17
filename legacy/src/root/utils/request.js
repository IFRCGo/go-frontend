const emptyObject = {};
const emptyList = [];

export const getDataFromResponse = (response = emptyObject, defaultValue = emptyObject) => {
  if (!response) {
    return defaultValue;
  }


  if (!response.cached && (response.fetching || !response.fetched)) {
    return defaultValue;
  }

  return response.data;
};

export const getResultsFromResponse = (response, defaultValue = emptyList) => {
  const data = getDataFromResponse(response);
  const { results = defaultValue } = data || emptyObject;

  return results;
};

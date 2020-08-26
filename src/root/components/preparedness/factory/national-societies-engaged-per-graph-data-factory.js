
export default class NationalSocietiesEngagedPerGraphDataFactory {
  buildGraphData (rawData, regionsById) {
    const preparedData = [];
    if (!(typeof rawData.error !== 'undefined' && rawData.error !== null)) {
      rawData.data.results.forEach((region) => {
        const thisRegion = regionsById[region.id][0];
        thisRegion['name'] = thisRegion['label'];
        preparedData.push(
          {
            region: thisRegion,
            data: [
              {name: 'All countries', value: region.country__count},
              {name: 'Engaged countries', value: region.forms_sent}
            ]
          }
        );
      });
    }
    return preparedData;
  }
}

export default class NationalSocietiesEngagedPerGraphDataFactory {
  buildGraphData (rawData, regionsById, strings) {
    const preparedData = [];
    if (!(typeof rawData.error !== 'undefined' && rawData.error !== null)) {
      rawData.data.results.forEach((region) => {
        const thisRegion = regionsById[region.id][0];
        thisRegion['name'] = thisRegion['label'];
        preparedData.push(
          {
            region: thisRegion,
            data: [
              {name: strings.preparednessFactoryNSGraphDataAllCountriesLabel, value: region.country__count},
              {name: strings.preparednessFactoryNSGraphDataEngagedCountriesLabel, value: region.forms_sent}
            ]
          }
        );
      });
    }
    return preparedData;
  }
}

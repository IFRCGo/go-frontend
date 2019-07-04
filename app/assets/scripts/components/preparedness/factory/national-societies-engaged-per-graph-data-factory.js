'use strict';

import { getRegionById } from './../../../utils/region-constants';

export default class NationalSocietiesEngagedPerGraphDataFactory {
  buildGraphData (rawData) {
    const preparedData = [];
    rawData.data.results.forEach((region) => {
      preparedData.push(
        {region: getRegionById(region.id), data: [
          {name: 'All countries', value: region.country__count},
          {name: 'Engaged countries', value: region.forms_sent}
        ]}
      );
    });
    return preparedData;
  }
}

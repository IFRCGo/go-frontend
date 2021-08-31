function groupPersonalArray(arr) {
   const res = [];
   for (let i = 0; i < arr.length; i++) {
      const ind = res.findIndex((el) => el.name === arr[i].name);
      if(ind !== -1){
         res[ind].personnel += 1;
      } else {
         res.push(arr[i]);
      }
   }
   return res;
}

function groupEruArray(arr) {
   const res = [];
   for (let i = 0; i < arr.length; i++) {
      const ind = res.findIndex((el) => el.name === arr[i].name);
      if(ind !== -1){
         res[ind].units += arr[i].units;
      } else {
         res.push(arr[i]);
      }
   }
   return res;
}

function groupEventsArray(arr) {
   const res = [];
   for (let i = 0; i < arr.length; i++) {
      const ind = res.findIndex((el) => el.name === arr[i].name);
      if(ind !== -1){
        // add zero values if it's undefined
        if (res[ind].units === undefined) res[ind].units = 0;
        if (res[ind].personnel === undefined) res[ind].personnel = 0;
        // sum if value is valid
        if (arr[i].units !== undefined) res[ind].units += arr[i].units;
        if (arr[i].personnel !== undefined) res[ind].personnel += arr[i].personnel;
      } else {
         res.push(arr[i]);
      }
   }
   return res;
}

export function mergeDeployData(countries, eru, personnel) {
  const eruByCountry = eru.filter(i => {
    return i.deployed_to ? true : false;
  }).map((i) => ({
    country: i.deployed_to.iso,
    country_id: i.deployed_to.id,
    units: i.units,
    name: i.event ? i.event.name : 'No detailed event',
    id: i.event ? i.event.id : null
  }));
  const personnelByCountry = groupPersonalArray(
    personnel.map((i) => ({
      country: i.deployment.country_deployed_to.iso,
      country_id: i.deployment.country_deployed_to.id,
      personnel: 1,
      name: i.deployment.event_deployed_to ? i.deployment.event_deployed_to.name : 'No detailed event',
      id: i.deployment.event_deployed_to ? i.deployment.event_deployed_to.id : null,
    }))
  );
  console.log(personnelByCountry);
  let newCountries = {};
  Object.assign(newCountries, countries);

  const resultCountries = newCountries.features.reduce((result, country) => {
    // properties shouldn't be inside geometry, so delete it
    delete country.geometry.properties;
    // filter the ERU and Personnel of each country
    const countryUnits = eruByCountry.filter(
      (i) => i.country === country.properties.iso
    );
    const countryPersonnel = personnelByCountry.filter(
      (i) => i.country === country.properties.iso
    );

    // set events and ERU units
    if (countryUnits.length) {
      country.properties.iso = countryUnits[0].country;
      country.properties.events = groupEruArray(
        countryUnits.map(({ name, id, units }) => ({ name, id, units }))
      );
    }
    // set personnel events and its amount
    if (countryPersonnel.length) {
      country.properties.iso = countryPersonnel[0].country;
      if (country.properties.events && country.properties.events.length) {
        country.properties.events = country.properties.events.concat(
          countryPersonnel.map(({ name, id, personnel }) => ({ name, id, personnel }))
        );
      } else {
        country.properties.events = countryPersonnel.map(
          ({ name, id, personnel }) => ({ name, id, personnel })
        );
      }
    }

    // reduce result
    if (countryUnits.length || countryPersonnel.length) {
      // merge duplicated events
      country.properties.events = groupEventsArray(country.properties.events);
      // sum the number of personnel by country
      country.properties.personnel = country.properties.events.reduce(
        (sum, i) => {
          if (i.personnel) {
            sum += i.personnel;
          }
          return sum;
        },
        0
      );
      // sum the number of eru by country
      country.properties.units = country.properties.events.reduce((sum, i) => {
        if (i.units) {
          sum += i.units;
        }
        return sum;
      }, 0);
      result = result.concat([country]);
    }
    return result;
  }, []);

  return {type: 'FeatureCollection', features: resultCountries};
}

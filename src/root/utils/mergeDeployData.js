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
      const ind = res.indexOf(arr[i].name);
      if(ind !== -1){
         res[ind].units += arr[i].units;
         res[ind].personnel += arr[i].personnel;
      } else {
         res.push(arr[i]);
      }
   }
   return res;
}

export function mergeDeployData(countries, eru, personnel) {
  const eruByCountry = eru.map((i) => ({
    country: i.deployed_to.iso,
    country_id: i.deployed_to.id,
    units: i.units,
    name: i.event.name,
    id: i.event.id
  }));
  const personnelByCountry = groupPersonalArray(
    personnel.map((i) => ({
      country: i.deployment.country_deployed_to.iso,
      country_id: i.deployment.country_deployed_to.id,
      personnel: 1,
      name: i.deployment.event_deployed_to.name,
      id: i.deployment.event_deployed_to.id,
    }))
  );
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
      country.properties.id = countryUnits[0].country_id;
      country.properties.events = groupEruArray(
        countryUnits.map(({ name, id, units }) => ({ name, id, units }))
      );
    }
    // set personnel events and its amount
    if (countryPersonnel.length) {
      country.properties.id = countryPersonnel[0].country_id;
      if (country.properties.events && country.properties.events.length) {
        country.properties.events.concat(
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

// import { getResponseFromRequest } from '#utils/request';
import _groupBy from 'lodash.groupby';
import _find from 'lodash.find';

import { defaultInitialState } from '#utils/reducer-utils';
import { compareString } from '#utils/utils';
import { palestineLabel } from '#utils/special-map-labels';

const initialState = { ...defaultInitialState };

export const countriesSelector = (state) => {
  if (state.allCountries.data.results && state.allCountries.data.results.length) {
    let results = state.allCountries.data.results.map((country) => {
      return {
        'value': country.id,
        'label': country.name || null,
        'iso': country.iso || null,
        'iso3': country.iso3 || null,
        'region': country.region,
        'bbox': country.bbox,
        'centroid': country.centroid,
        'independent': country.independent,
        'society_name': country.society_name,
        'society_url': country.society_url,
        'url_ifrc': country.url_ifrc,
        'overview': country.overview,
        'key_priorities': country.key_priorities,
        'record_type': country.record_type,
        'inform_score': country.inform_score
      };
    });
    return results;
  } else {
    return initialState;
  }
};

export const countriesByRegionSelector = (state) => {
  if (state.allCountries && state.allCountries.data.results) {
    let countriesByRegion = _groupBy(state.allCountries.data.results, 'region');
    return countriesByRegion;
  } else {
    return initialState;
  }
};

export const countrySelector = (state, countryId) => {
  if (state.allCountries && state.allCountries.data.results) {
    countryId = typeof(countryId) === "string" ? Number(countryId) : countryId;
    let thisCountry = _find(state.allCountries.data.results, { 'id': countryId } );
    return thisCountry;
  } else {
    return null;
  }
};

export const countryByIdOrNameSelector = (state, name) => {
  if (state.allCountries && state.allCountries.data.results) {
    if (isNaN(name)) {
      const thisCountry = state.allCountries.data.results.find(country => {
        return country.name.toLowerCase() === decodeURI(name.toLowerCase());
      });
      return thisCountry;
    } else {
      return countrySelector(state, name);
    }
  } else {
    return null;
  }
};

export const countriesByIso = (state) => {
  if (state.allCountries && state.allCountries.data.results) {
    let countriesByIso = _groupBy(state.allCountries.data.results, 'iso');
    return countriesByIso;
  } else {
    return null;
  }
};

export const countriesGeojsonSelector = (state) => {
  const featureCollection = {
    'type': 'FeatureCollection',
    'features': []
  };
  if (state.allCountries && state.allCountries.data.results) {
    const currentLang = currentLanguageSelector(state);
    state.allCountries.data.results.forEach(country => {
      if (country.centroid && (country.independent || country.independent === null)) {
        const f = {
          'type': 'Feature',
          'geometry': country.centroid,
          'properties': {
            'name': country.iso === 'ps' ? palestineLabel(currentLang) : country.name,
            'iso': country.iso,
            'iso3': country.iso3,
            'society_name': country.society_name
          }
        };
        featureCollection.features.push(f);
      }
    });

    return featureCollection;
  } else {
    return null;
  }
};

export const regionsByIdSelector = (state) => {
  if (state.allRegions && state.allRegions.data.results) {
    return _groupBy(state.allRegions.data.results, 'id');
  }
};

export const regionByIdOrNameSelector = (state, name) => {
  if (state.allRegions && state.allRegions.data.results) {
    if (isNaN(name)) {
      const thisRegion = state.allRegions.data.results.find(region => {
        return region.label.toLowerCase() === name.toLowerCase();
      });
      return thisRegion;
    } else {
      const id = parseInt(name);
      const thisRegion = state.allRegions.data.results.find(region => {
        return region.id === id;
      });
      return thisRegion;
    }
  } else {
    return null;
  }
};

export const countryOverviewSelector = (state) => (
  state.countryOverview
);

export const countryProjectSelector = (state, id) => (
  state.projects[id] || initialState
);

export const meSelector = (state) => (
  state.me
);

export const regionalMovementActivitiesSelector = (state) => (
  state.regionalMovementActivities
);

export const regionalProjectsOverviewSelector = (state) => (
  state.regionalProjectsOverview
);

export const nationalSocietyActivitiesSelector = (state) => (
  state.nationalSocietyActivities
);

export const nationalSocietyActivitiesWoFiltersSelector = (state) => (
  state.nationalSocietyActivitiesWoFilters
);

export const regionalProjectsSelector = (state) => (
  state.regionalProjects
);

export const projectDeleteSelector = (state) => (
  state.projectDelete
);

export const projectFormSelector = (state) => (
  state.projectForm
);

export const languageSelector = (state) => (
  state.lang
);

export const languageResponseSelector = (state) => (
  state.lang
);

export const currentLanguageSelector = (state) => (
  languageSelector(state).current
);

export const languageDataSelector = (state) => (
  languageSelector(state).data
);

export const languageStringsSelector = (state) => (
  languageSelector(state).strings
);

export const currentLanguageStringsSelector = languageStringsSelector;

export const languageBulkResponseSelector = (state) => (
  state.postLanguageBulk
);

export const currentLangugageSelector = (state) => (
  languageSelector(state).current || 'en'
);

export const userResponseSelector = (state) => (
  state.me || {}
);

export const userSelector = (state) => (
  userResponseSelector(state).data
);

export const allCountriesSelector = (state) => (
  state.allCountries
);

export const allRegionsSelector = (state) => (
  state.allRegions
);

export const disasterTypesSelectSelector = (state) => {
  if (state.disasterTypes && state.disasterTypes.data.results) {
    return state.disasterTypes.data.results.map((dt) => ({ value: dt.id, label: dt.name })).sort(compareString);
  }
  return [];
};

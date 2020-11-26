import React, { useState, useContext } from 'react';
import { PropTypes as T } from 'prop-types';
import { Link } from 'react-router-dom';
import { environment } from '#config';
import { get } from '#utils/utils';
import ToggleButtonComponent from './common/toggle-button';

import LanguageContext from '#root/languageContext';
import Translate from '#components/Translate';

const CountryList = props => {
  const { strings } = useContext(LanguageContext);
  const [isFullList, toggleList] = useState(true);
  const toggle = () => {
    isFullList ? toggleList(false) : toggleList(true);
  };

  let countries = props.countries;
  if (props.appealStats.fetched && !props.appealStats.error) {
    const activeOperations = get(props.appealStats, 'data.results', []);
    countries = countries.map(d => {
      const numOperations = activeOperations.filter(o => o.country && o.country.id === d.id).length;
      return Object.assign({ numOperations }, d);
    });
  }

  return (
      <div>
        <div className={`country__sidebar scrollbar__custom ${props.showCountriesSidebar ? 'country__sidebar--active' : ''}`}>
          <input type='text' className='country__sidebar-input-search form__control' placeholder='Select a Country' />
          <ul className='region-countries__list'>
            {
              countries.map(country => 
                <li key={country.id} className='region-countries__item'>
                  <Link to={`/countries/${country.id}`} className='region-countries__link'><span className='region-countries__linkC'>{country.name}</span></Link>
                  <div className='region-countries__link-op'>({country.numOperations} {country.numOperations === 1 ? <Translate stringId='countryListActiveOperation' /> : <Translate stringId='countryListActiveOperations'/>})</div>
                </li>              
            )}
          </ul>
        </div>
      </div>
  );
};

if (environment !== 'production') {
  CountryList.propTypes = {
    appealStats: T.object,
    countries: T.array
  };
}

export default CountryList;

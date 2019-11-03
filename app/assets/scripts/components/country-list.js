import React, { useState } from 'react';
import { PropTypes as T } from 'prop-types';
import { Link } from 'react-router-dom';
import ToggleButton from 'react-toggle-button';
import { environment } from '../config';
import { get } from '../utils/utils/';
import Fold from './fold';

const CountryList = props => {
  const {
    fetched,
    error,
    data
  } = props.countries;

  const [isFullList, toggleList] = useState(true);
  const toggle = () => {
    isFullList ? toggleList(false) : toggleList(true);
  };

  if (!fetched || error) { return null; }
  let countries = data.results;
  if (props.appealStats.fetched && !props.appealStats.error) {
    const activeOperations = get(props.appealStats, 'data.results', []);
    countries = countries.map(d => {
      const numOperations = activeOperations.filter(o => o.country && o.country.id === d.id).length;
      return Object.assign({ numOperations }, d);
    });
  }

  const alphabetizedList = countries.reduce((prev, country) => {
    const letter = country.name[0];
    const activeCountries = country.numOperations ? (
      {[letter]: [...(prev[letter] || []), country]}
    ) : ({});

    return isFullList ? (
      {...prev, [letter]: [...(prev[letter] || []), country]}
    ) : (
      {...prev, ...activeCountries}
    );
  }, {});

  return (
    <Fold title={countries.length + ' Countries in this Region'}>
      <div className='button-group--horizontal'>
        <span>
           View only active operations
        </span>
        <div>
          <ToggleButton
            value={ !isFullList || false }
            onToggle={toggle}
          />
        </div>
      </div>
      <ul className='region-countries__list'>
        {Object.entries(alphabetizedList).map(([letter, countries]) =>
          <div>
            <li className='region-countries__letter' key={letter}>{letter}</li>
            <ul>
              {countries.map(country =>
                <li key={country.id} className='region-countries__item'>
                  <Link to={`/countries/${country.id}`} className='region-countries__link'><span className='region-countries__linkC'>{country.name}</span></Link>
                  {country.numOperations ? <span className='region-countries__link-op'>({country.numOperations} Active Operation{country.numOperations > 1 ? 's' : ''})</span> : null}
                </li>
              )}
            </ul>
          </div>
        )}
      </ul>
    </Fold>
  );
};

if (environment !== 'production') {
  CountryList.propTypes = {
    appealStats: T.object,
    countries: T.object
  };
}

export default CountryList;

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

  // Create the <li> elements for the list
  // This code can probably be improved,
  // The idea here is to generate an array of <li> elements with
  // the first letter like 'C', 'D', etc. being array items, with a different class.
  //  It seemed hard to style a flowing 3-column list if this is broken up into separate <ul>s
  let countryItems = [];
  let activeCountries = [];
  let currLetter = 'A';
  countryItems.push(
    <li className='region-countries__letter' key={currLetter}>{currLetter}</li>
  );
  countries.forEach((country, idx) => {
    const name = country.name;
    console.log('name', country)
    if (name[0] !== currLetter) {
      currLetter = name[0];
      countryItems.push(
        <li className='region-countries__letter' key={currLetter}>{currLetter}</li>
      );
    }
    countryItems.push(
      <li key={country.id} className='region-countries__item'>
        <Link to={`/countries/${country.id}`} className='region-countries__link'><span className='region-countries__linkC'>{country.name}</span></Link>
        {country.numOperations ? <span className='region-countries__link-op'>({country.numOperations} Active Operation{country.numOperations > 1 ? 's' : ''})</span> : null}
      </li>
    );
    activeCountries = countryItems.filter(item => {
      const test = typeof item.props.children === 'string' 
      const test1 = item.props.children[1]
      return test || test1;
    })
    // console.log('countryItems', countryItems)
    // console.log('activeCountries', activeCountries)
  });
  return (
    <Fold title={countries.length + ' Countries in this Region'}>
      <span>View only active operations</span>
      <ToggleButton
        value={ false }
        onToggle={toggle}
      />
      <ul className='region-countries__list'>
        {isFullList ? (countryItems) : (activeCountries)}

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

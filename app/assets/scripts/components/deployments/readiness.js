'use strict';
import React from 'react';
import { PropTypes as T } from 'prop-types';
import _intersection from 'lodash.intersection';
import _cloneDeep from 'lodash.clonedeep';
import { DateTime } from 'luxon';

import { commaSeparatedNumber as n } from '../../utils/format';
import eruTypes, { getEruType } from '../../utils/eru-types';
import { environment } from '../../config';

import CheckboxGroup from '../form-elements/checkbox-group';

const eruOptions = Object.keys(eruTypes).map(key => ({
  value: key,
  label: eruTypes[key]
}));

const initialFilterState = Object.keys(eruTypes).map(key => ({
  value: key,
  checked: false
}));

class Readiness extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      filters: initialFilterState
    };
    this.onChange = this.onChange.bind(this);
    this.clearFilters = this.clearFilters.bind(this);
  }

  onChange (filters) {
    this.setState({ filters });
  }

  clearFilters () {
    console.log('setstate');
    this.setState({ filters: _cloneDeep(initialFilterState) });
  }

  renderCard (eruOwner) {
    const erus = eruOwner.eru_set;
    if (!erus.length) return null;

    // Non-empty country array means the resource is deployed.
    // Available === true means it's ready.
    // (A resource can be neither deployed nor ready).
    const ready = erus.filter(o => o.available);
    const deployed = erus.filter(o => o.deployed_to);

    const numReady = ready.reduce((acc, next) => acc + next.units, 0);
    const numDeployed = deployed.reduce((acc, next) => acc + next.units, 0);

    const readyTypes = ready.length ? ready.map(o => `${getEruType(o.type)} (${o.units})`).join(', ') : '';

    const owner = erus[0].eru_owner;

    return (
      <div className='readiness__card' key={eruOwner.id}>
        <div className='readiness__card-header'>
          <a className='link--primary'>{owner.national_society_country.society_name}</a>
          <span className='updated'>Last updated {DateTime.fromISO(eruOwner.updated_at).toISOTime()}</span>
        </div>
        <div className='card__col'>
          <p className='card__label card__label--ready'>{n(numReady)} Ready ERU's</p>
          {readyTypes && <p>{readyTypes}</p>}
        </div>
        <div className='card__col'>
          <p className='card__label'>{n(numDeployed)} Deployed ERU's</p>
          {deployed.map(o => (
            <p key={o.id}>{getEruType(o.type)} - <a className='link--primary'>{o.deployed_to.name}</a></p>
          ))}
        </div>
      </div>
    );
  }

  render () {
    const { filters } = this.state;
    const { data } = this.props.eruOwners;

    const activeFilters = filters.filter(o => o.checked)
      .map(o => o.value);

    const filtered = !activeFilters.length ? data.records
      : data.records.filter(o => {
        const activeEruTypes = o.eru_set.filter(e => e.available).map(e => e.type.toString());
        return _intersection(activeEruTypes, activeFilters).length;
      });
    return (
      <div>
        <div className='readiness__filters'>
          <CheckboxGroup
            label={'Filter Ready ERU\'s'}
            description={null}
            name={'ready-erus'}
            classWrapper=''
            options={eruOptions}
            values={this.state.filters}
            onChange={this.onChange} />
          <button className='button button--secondary-light' onClick={this.clearFilters}>Reset Filters</button>
        </div>
        <div className='readiness__header'>
          <h2 className='form__label'>National Societies</h2>
        </div>
        <div className='readiness__cards'>
          {filtered.map(this.renderCard)}
        </div>
      </div>
    );
  }
}

if (environment !== 'production') {
  Readiness.propTypes = {
    eruOwners: T.object
  };
}

export default Readiness;

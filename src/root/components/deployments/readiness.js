import React from 'react';
import { PropTypes as T } from 'prop-types';
import _intersection from 'lodash.intersection';
import _cloneDeep from 'lodash.clonedeep';
import { DateTime } from 'luxon';
import { Link } from 'react-router-dom';

import { commaSeparatedNumber as n } from '#utils/format';
import eruTypes, { getEruType } from '#utils/eru-types';
import { environment } from '#config';
import LanguageContext from '#root/languageContext';
import Translate from '#components/Translate';

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

    const numReady = ready.reduce((acc, next) => acc + next.equipment_units, 0);
    const numDeployed = deployed.reduce((acc, next) => acc + next.equipment_units, 0);

    const readyTypes = ready.length ? ready.map(o => `${getEruType(o.type)} (${o.equipment_units})`).join(', ') : '';
    const owner = eruOwner.national_society_country;

    return (
      <div className='col col-6-mid'>
        <div className='readiness__card' key={eruOwner.id}>
          <div className='readiness__card-header row flex'>
            <div className='col col-7'>
              <Link className='link' to={`/countries/${owner.id}`}>{owner.society_name}</Link>
            </div>
            <span className='updated col col-5'>
              <Translate
                stringId='readinessLastUpdated'
                params={{
                  date: DateTime.fromISO(eruOwner.updated_at).toISODate(),
                }}
              />
            </span>
          </div>
          <div className='row flex'>
            <div className='card__col col col-6'>
              <p className='card__label card__label--ready'>
                <Translate
                  stringId='readinessReadyErus'
                  params={{
                    numReady: n(numReady),
                  }}
                />
              </p>
              {readyTypes && <p>{readyTypes}</p>}
            </div>
            <div className='card__col col col-6'>
              <p className='card__label'>
                <Translate
                  stringId='readinessDeployedErus'
                  params={{
                    numDeployed: n(numDeployed),
                  }}
                />
              </p>
              {deployed.map(o => (
                <p key={o.id}>{getEruType(o.type)} - <Link className='link--primary' to={`/countries/${o.deployed_to.id}`}>{o.deployed_to.name}</Link></p>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  render () {
    const { filters } = this.state;
    const { data } = this.props.eruOwners;

    const { strings } = this.context;
    const activeFilters = filters.filter(o => o.checked)
      .map(o => o.value);

    const filtered = !activeFilters.length ? data.records
      : data.records.filter(o => {
        const activeEruTypes = o.eru_set.filter(e => e.available).map(e => e.type.toString());
        return _intersection(activeEruTypes, activeFilters).length;
      });
    return (
      <div className='row flex-mid'>
        <div className='readiness__filters col col-3-mid'>
          <CheckboxGroup
            label={strings.readinessFilteredERUs}
            classLabel='fold__title'
            description={null}
            name={'ready-erus'}
            classWrapper=''
            options={eruOptions}
            values={this.state.filters}
            onChange={this.onChange} />
          <button className='button button--secondary-light' onClick={this.clearFilters}>
            <Translate stringId='readinessResetFilters'/>
          </button>
        </div>
        <div className='col col-9-mid'>
          <div className='readiness__header'>
            <h2 className='fold__title'>National Societies</h2>
          </div>
          <div className='readiness__cards row flex-sm'>
            {filtered.map(this.renderCard)}
          </div>
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
Readiness.contextType = LanguageContext;
export default Readiness;

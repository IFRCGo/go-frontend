'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { PropTypes as T } from 'prop-types';
import { Link } from 'react-router-dom';
import Progress from './../progress-labeled';

import { formatDate, percent, commaSeparatedNumber as n, shortenLargeNumber } from '../../utils/format';
import { get, mostRecentReport } from '../../utils/utils';
import { environment } from '../../config';
import { getFeaturedEmergencies, getFeaturedEmergenciesDeployments } from '../../actions';
import BlockLoading from '../block-loading';
import Fold from '../fold';

const title = 'Highlighted Operations';

class FeaturedEmergencies extends React.Component {
  constructor (props) {
    super(props);

    this.renderCard = this.renderCard.bind(this);
    this.calculateDeployedPersonnel = this.calculateDeployedPersonnel.bind(this);
  }

  componentWillMount () {
    this.props._getFeaturedEmergencies();
    this.props._getFeaturedEmergenciesDeployments();
  }

  calculateDeployedPersonnel (emergency) {
    let deployedErus = 0;
    let deployedPersonnel = 0;

    if (typeof this.props.deployments.data !== 'undefined' && Array.isArray(this.props.deployments.data.results)) {
      this.props.deployments.data.results
        .filter(deployment => deployment.type === 'eru' && deployment.id === emergency.id)
        .forEach(deployment => { deployedErus += deployment.deployments; });

      this.props.deployments.data.results
        .filter(deployment => {
          return (deployment.type === 'heop' || deployment.type === 'rdrt') && deployment.id === emergency.id;
        })
        .forEach(deployment => { deployedPersonnel += deployment.deployments; });
    }

    return {'deployedEru': deployedErus, 'deployedPersonnel': deployedPersonnel};
  }

  /* eslint-disable camelcase */
  renderCard (d) {
    const { id, name } = d;
    const appeals = get(d, 'appeals', []);
    const beneficiaries = appeals.reduce((acc, curr) => acc + curr.num_beneficiaries, 0);
    const requested = appeals.reduce((acc, curr) => acc + Number(curr.amount_requested), 0);
    const funded = appeals.reduce((acc, curr) => acc + Number(curr.amount_funded), 0);
    const report = mostRecentReport(get(d, 'field_reports'));
    const lastUpdated = typeof report !== 'undefined' &&
      typeof report.updated_at !== 'undefined' &&
      report.updated_at !== null
      ? report.updated_at : d.created_at;
    const emergencyDeployments = this.calculateDeployedPersonnel(d);

    return (
      <li className='key-emergencies-item' key={id}>
        <Link to={`/emergencies/${id}`}>
          <h2 className='card__title'>{ name.length > 30 ? name.slice(0, 30) + '...' : name }</h2>
          <small className='last_updated'>Last updated at {formatDate(lastUpdated)}</small>

          <div className='card_box_container'>
            <div className='card_box card_box_left'>
              <span className='affected_population_icon'></span> {shortenLargeNumber(beneficiaries)}<br />
              <small>Targeted Population</small>
            </div>
            <div className='card_box card_box_left'>
              <span className='affected_population_icon'></span> {n(emergencyDeployments.deployedErus)}<br />
              <small>Deployed ERUs</small>
            </div>
            <div className='card_box'>
              <span className='deployed_personnel_icon'></span> {n(emergencyDeployments.deployedPersonnel)}<br />
              <small>Deployed Surge Personnel</small>
            </div>
          </div>

          <div className='ifrc_supported_badge'>
            IFRC supported operation
          </div>

          <div className='card_box_full'>
            {appeals.length ? (
              <React.Fragment>
                <small>Funding Requirements</small>
                {requested !== null ? n(requested) : 0} CHF
                <Progress value={requested ? percent(funded, requested) : 0} max={100} />
              </React.Fragment>
            ) : null}
          </div>
        </Link>
      </li>
    );
  }
  /* eslint-enable camelcase */

  render () {
    const { error, fetching, fetched, data } = this.props.featured;
    if (fetched && (error || !Array.isArray(data.results) || !data.results.length)) return null;
    else if (!fetched || fetching) return <div className='inner'><Fold title={title}><BlockLoading/></Fold></div>;
    return (
      <div className='inner'>
        <Fold title={title}>
          <ul className='key-emergencies-list'>
            {data.results.map(this.renderCard)}
          </ul>
          <Link to='/emergencies' className='link--primary more_button'>View all emergencies (last 60 days)</Link>
        </Fold>
      </div>
    );
  }
}

if (environment !== 'production') {
  FeaturedEmergencies.propTypes = {
    _getFeaturedEmergencies: T.func,
    _getFeaturedEmergenciesDeployments: T.func,
    featured: T.object,
    deployments: T.object
  };
}

const selector = (state) => ({
  featured: state.emergencies.featured,
  deployments: state.emergencies.emergencyDeployments
});

const dispatcher = (dispatch) => ({
  _getFeaturedEmergencies: (...args) => dispatch(getFeaturedEmergencies(...args)),
  _getFeaturedEmergenciesDeployments: (...args) => dispatch(getFeaturedEmergenciesDeployments(...args))
});

export default connect(selector, dispatcher)(FeaturedEmergencies);

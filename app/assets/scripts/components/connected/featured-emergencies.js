'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { PropTypes as T } from 'prop-types';
import { Link } from 'react-router-dom';
import Progress from './../progress-labeled';
import { round } from '../../utils/format';

import { formatDate, percent, commaSeparatedNumber as n } from '../../utils/format';
import { get } from '../../utils/utils';
import { environment } from '../../config';
import { getFeaturedEmergencies, getFeaturedEmergenciesDeployments, getDeploymentERU } from '../../actions';
import BlockLoading from '../block-loading';
import Fold from '../fold';

const title = 'Highlighted Operations';

class FeaturedEmergencies extends React.Component {
  constructor (props) {
    super(props);

    this.renderCard = this.renderCard.bind(this);
    this.calculateDeployedPersonnel = this.calculateDeployedPersonnel.bind(this);
    this.getDeploymentERU = this.getDeploymentERU.bind(this);
  }

  componentWillMount () {
    this.props._getFeaturedEmergencies();
    this.props._getFeaturedEmergenciesDeployments();
  }

  componentWillReceiveProps () {
    this.getDeploymentERU();
  }

  getDeploymentERU () {
    if (this.props.featured.data.count > 0) {
      let emergencyIds = '';
      this.props.featured.data.results.forEach(emergency => {
        emergencyIds += emergency.id + ',';
      });
      emergencyIds = emergencyIds.slice(0, -1);
      if (!this.props.eru.fetching && !this.props.eru.fetched) {
        this.props._getDeploymentERU(1, {event__in: emergencyIds});
      }
    }
  }

  calculateDeployedPersonnel (emergency) {
    let deployedErus = null;
    let deployedPersonnel = null;

    if (typeof this.props.deployments.data !== 'undefined' && Array.isArray(this.props.deployments.data.results)) {
      deployedPersonnel = 0;
      this.props.deployments.data.results
        .filter(deployment => {
          return (deployment.type === 'heop' || deployment.type === 'rdrt' || deployment.type === 'fact') &&
            deployment.id === emergency.id;
        })
        .forEach(deployment => { deployedPersonnel += deployment.deployments; });
    }

    if (typeof this.props.eru.data !== 'undefined' && Array.isArray(this.props.eru.data.results)) {
      deployedErus = 0;
      this.props.eru.data.results
        .filter(eru => {
          return (typeof eru.event !== 'undefined' && eru.event !== null &&
            typeof eru.event.id !== 'undefined' && eru.event.id !== null &&
            eru.event.id === emergency.id);
        })
        .forEach(eru => { deployedErus += eru.units; });
    }

    return {'deployedErus': deployedErus, 'deployedPersonnel': deployedPersonnel};
  }

  /* eslint-disable camelcase */
  renderCard (d) {
    const { id, name } = d;
    const appeals = get(d, 'appeals', []);
    const beneficiaries = appeals.reduce((acc, curr) => acc + curr.num_beneficiaries, 0);
    const requested = appeals.reduce((acc, curr) => acc + Number(curr.amount_requested), 0);
    const funded = appeals.reduce((acc, curr) => acc + Number(curr.amount_funded), 0);
    const emergencyDeployments = this.calculateDeployedPersonnel(d);

    return (
      <li className='key-emergencies-item' key={id}>
        <Link to={`/emergencies/${id}`}>
          <div className="card_box card_box_left">
            <h2 className='card__title'>{ name.length > 30 ? name.slice(0, 30) + '...' : name }</h2>
            <small className='last_updated'>Last updated: {formatDate(d.updated_at)}</small>
          </div>

          <div className='card_box_container card_box_container--op'>
            <div className='card_box card_box_left card_box--op'>
              <span className='affected_population_icon'></span>
              <small className='heading-tiny'>Targeted Population</small>
              <div className="card_box_no">{n(beneficiaries)}</div>
            </div>
            <div className='card_box card_box_left card_box--op'>
              <span className='affected_population_icon'></span>
              <div className="card_box_no">{n(emergencyDeployments.deployedErus)}</div>
              <small className='heading-tiny'>Deployed Emergency Response Units</small>
            </div>
          </div>

          <div className='card_box_container card_box_container--op'>
            <div className='card_box card_box--op'>
              <div className="card_box_no">{requested !== null ? n(requested) : 0} CHF</div>
              <small className='heading-tiny'>Funding Requirements</small>
            </div>
            <div className='card_box card_box--op'>
              <span className='deployed_personnel_icon'></span>
              <div className="card_box_no">{n(emergencyDeployments.deployedPersonnel)}</div>
              <small className='heading-tiny'>Deployed Surge Personnel</small>
            </div>
          </div>

          <div className='card_box_full card_box_container card_box_container--op'>
            <div className='card_box card_box_left card_box--op'>
              <div className="heading-tiny">Funding Coverage</div>
            </div>

            <div className='card_box card_box_left card_box--op'>
              {requested ? round(percent(funded, requested)) : 0}%
            </div>
          </div>
          {appeals.length ? (
            <React.Fragment>
              <Progress value={requested ? percent(funded, requested) : 0} max={100} />
            </React.Fragment>
          ) : null}
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
          <Link to='/appeals/all' className='link--primary more_button'>View all operations</Link>
        </Fold>
      </div>
    );
  }
}

if (environment !== 'production') {
  FeaturedEmergencies.propTypes = {
    _getFeaturedEmergencies: T.func,
    _getFeaturedEmergenciesDeployments: T.func,
    _getDeploymentERU: T.func,
    featured: T.object,
    deployments: T.object,
    eru: T.object
  };
}

const selector = (state) => ({
  featured: state.emergencies.featured,
  deployments: state.emergencies.emergencyDeployments,
  eru: state.deployments.eru
});

const dispatcher = (dispatch) => ({
  _getFeaturedEmergencies: (...args) => dispatch(getFeaturedEmergencies(...args)),
  _getFeaturedEmergenciesDeployments: (...args) => dispatch(getFeaturedEmergenciesDeployments(...args)),
  _getDeploymentERU: (...args) => dispatch(getDeploymentERU(...args))
});

export default connect(selector, dispatcher)(FeaturedEmergencies);

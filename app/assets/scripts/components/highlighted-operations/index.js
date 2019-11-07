import React from 'react';
import { connect } from 'react-redux';
import { PropTypes as T } from 'prop-types';
import { Link } from 'react-router-dom';
import { environment } from '../../config';
import { getFeaturedEmergencies, getFeaturedEmergenciesDeployments, getDeploymentERU } from '../../actions';
import BlockLoading from '../block-loading';
import Fold from '../fold';
import OperationCard from './operation-card';

const title = 'Highlighted Operations';

class HighlightedOperations extends React.Component {
  constructor (props) {
    super(props);

    this.calculateDeployedPersonnel = this.calculateDeployedPersonnel.bind(this);
    this.getDeploymentERU = this.getDeploymentERU.bind(this);
  }

  componentDidMount () {
    this.props._getFeaturedEmergencies();
    this.props._getFeaturedEmergenciesDeployments();
  }

  componentDidUpdate () {
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

  render () {
    const { error, fetching, fetched, data } = this.props.featured;
    const foldLink = (<Link to='/appeals/all' className='fold__title__link'>View all operations</Link>);
    if (fetched && (error || !Array.isArray(data.results) || !data.results.length)) return null;
    else if (!fetched || fetching) return <div className='inner'><Fold title={title}><BlockLoading/></Fold></div>;
    return (
      <div className='inner inner--emergencies'>
        <Fold title={title} navLink={foldLink} extraClass foldClass='fold__title--inline'>
          <ul className='key-emergencies-list'>
            {data.results.slice(0, 3).map(operation =>
              <OperationCard
                operation={operation}
                calculateDeployedPersonnel={this.calculateDeployedPersonnel}
              />
            )}
          </ul>
        </Fold>
      </div>
    );
  }
}

if (environment !== 'production') {
  HighlightedOperations.propTypes = {
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

export default connect(selector, dispatcher)(HighlightedOperations);

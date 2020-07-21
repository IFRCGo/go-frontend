import React from 'react';
import { connect } from 'react-redux';
import { PropTypes as T } from 'prop-types';
import { Link } from 'react-router-dom';
import { environment } from '#config';
import { get } from '#utils/utils';
import { getFeaturedEmergencies, getFeaturedEmergenciesForRegion, getFeaturedEmergenciesDeployments, getDeploymentERU } from '#actions';
import BlockLoading from '../block-loading';
import Fold from '../fold';
import OperationCard from './operation-card';
import {
  getUserProfile,
  addSubscriptions,
  delSubscription
} from '#actions';
import LanguageContext from '#root/languageContext';
import Translate from '#components/Translate';

class HighlightedOperations extends React.Component {
  constructor (props) {
    super(props);

    this.calculateDeployedPersonnel = this.calculateDeployedPersonnel.bind(this);
    this.getDeploymentERU = this.getDeploymentERU.bind(this);
    this.state = {
      followed: new Set(),
      unfollowed: new Set()
    };
  }

  componentDidMount () {
    if (this.props.opsType === 'region') {
      this.props._getFeaturedEmergenciesForRegion(this.props.opsId);
    } else {
      this.props._getFeaturedEmergencies();
    }
    if (this.props.isLogged) {
      this.props._getUserProfile(this.props.user.data.username);
    }
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
      // deployedPersonnel = 0;
      this.props.deployments.data.results
        .filter(deployment => {
          return (deployment.type === 'heop' || deployment.type === 'rdrt' || deployment.type === 'fact' || deployment.type === 'rr') &&
            deployment.id === emergency.id;
        })
        .forEach(deployment => { deployedPersonnel += deployment.deployments; });
    }

    if (typeof this.props.eru.data !== 'undefined' && Array.isArray(this.props.eru.data.results)) {
      // deployedErus = 0;
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

  // whether to show the Follow button for Highlighted Ops
  getShowFollow () {
    if (!this.props.isLogged) return false;
    if (!this.props.profile.fetched) return false;
    return true;
  }

  followOperation (id) {
    this.props._addSubscriptions(id);
    const { followed, unfollowed } = this.state;
    followed.add(id);
    unfollowed.delete(id);
    this.setState({
      followed,
      unfollowed
    });
  }

  unfollowOperation (id) {
    this.props._delSubscription(id);
    const { followed, unfollowed } = this.state;
    followed.delete(id);
    unfollowed.add(id);
    this.setState({
      followed,
      unfollowed
    });  
  }

  render () {
    const { error, fetching, fetched, data } = this.props.featured;
    const { strings } = this.context;
    const foldLink = (
      <Link to='/appeals/all' className='fold__title__link'>
        <Translate stringId='highlightedOperationsViewAll'/>
      </Link>);
    if (fetched && (error || !Array.isArray(data.results) || !data.results.length)) return null;
    else if (!fetched || fetching) return <div className='inner'><Fold title={strings.highlightedOperationsTitle}><BlockLoading/></Fold></div>;
    let operations = data.results;
    const listStyle = operations.length <= 4 ? (
      'key-emergencies-list key-emergencies-list-short row flex-sm'
    ) : (
      'key-emergencies-list key-emergencies-list-long row flex-sm'
    );
    const showFollow = this.getShowFollow();
    if (showFollow) {
      const followedOpIds = this.props.profile.data.subscription.reduce((memo, val) => {
        const eventId = val.event;
        if (eventId && memo.indexOf(eventId) === -1) {
          memo.push(eventId);
        }
        return memo;
      }, []);
      operations = operations.map(o => {
        const following = (followedOpIds.indexOf(o.id) !== -1 &&
                           !this.state.unfollowed.has(o.id)) || this.state.followed.has(o.id);

        return {
          ...o,
          following
        };
      });
    }
    return (operations.length ? (
      <div className='inner inner--emergencies'>
        <Fold title={strings.highlightedOperationsTitle} navLink={foldLink} foldWrapperClass='fold--main' foldTitleClass='fold__title--inline'>
          <div className={listStyle}>
            {operations.slice(0, 6).map(operation =>
              <OperationCard
                key={operation.id}
                showFollow={showFollow}
                isFollowing = {operation.following ? true : false}
                followOperation = {this.followOperation.bind(this)}
                unfollowOperation = {this.unfollowOperation.bind(this)}
                operationId={operation.id}
                operationName={operation.name}
                emergencyDeployments={this.calculateDeployedPersonnel(operation)}
                appeals={get(operation, 'appeals', [])}
                lastUpdate={operation.updated_at}
              />
            )}
          </div>
        </Fold>
      </div>
    ) : null
    );
  }
}

if (environment !== 'production') {
  HighlightedOperations.propTypes = {
    _getFeaturedEmergencies: T.func,
    _getFeaturedEmergenciesForRegion: T.func,
    _getFeaturedEmergenciesDeployments: T.func,
    _getDeploymentERU: T.func,
    featured: T.object,
    deployments: T.object,
    eru: T.object,
    opsType: T.string,
    opsId: T.number
  };
}

const selector = (state) => ({
  featured: state.emergencies.featured,
  deployments: state.emergencies.emergencyDeployments,
  eru: state.deployments.eru,
  isLogged: !!state.user.data.token,
  user: state.user,
  profile: state.profile  
});

const dispatcher = (dispatch) => ({
  _getFeaturedEmergencies: (...args) => dispatch(getFeaturedEmergencies(...args)),
  _getFeaturedEmergenciesForRegion: (...args) => dispatch(getFeaturedEmergenciesForRegion(...args)),
  _getFeaturedEmergenciesDeployments: (...args) => dispatch(getFeaturedEmergenciesDeployments(...args)),
  _getDeploymentERU: (...args) => dispatch(getDeploymentERU(...args)),
  _getUserProfile: (...args) => dispatch(getUserProfile(...args)),
  _addSubscriptions: (...args) => dispatch(addSubscriptions(...args)),
  _delSubscription: (...args) => dispatch(delSubscription(...args))
});

HighlightedOperations.contextType = LanguageContext;
export default connect(selector, dispatcher)(HighlightedOperations);

import React from 'react';
import App from './app';
import PreparednessHeader from '../components/preparedness/preparedness-header';
import PerMap from './../components/map/per-map';
import { connect } from 'react-redux';
import {
  getCollaboratingPerCountry,
  getPerEngagedNsPercentage,
  getPerGlobalPreparedness,
  getPerNsPhase,
  getPerOverviewForm,
  getPerWorkPlan,
  getPerMission
} from './../actions';
import ContactPer from './../components/preparedness/contact-per';
import { Helmet } from 'react-helmet';
import { PropTypes as T } from 'prop-types';
import { environment } from '../config';
import { getCountryMeta } from './../utils/get-country-meta';
import { getCentroid } from './../utils/country-centroids';
import NationalSocietiesEngagedPer from '../components/preparedness/national-societies-engaged-per';
import GlobalPreparednessHighlights from '../components/preparedness/global-preparedness-highlights';
// import _groupBy from 'lodash.groupby';

class Preparedness extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      geoJsonFinal: null,
      preparednessGlobalHighlights: null,
      topPrioritizedComponents: {},
      perPerMission: false
    };
    this.geoJsonBuilt = false;
    this.collaboratingPerCountryBuilt = false;
    this.perNsPhaseBuilt = false;
  }

  componentDidMount () {
    this.props._getCollaboratingPerCountry();
    this.props._getPerEngagedNsPercentage();
    this.props._getPerGlobalPreparedness();
    this.props._getPerNsPhase();
    this.props._getPerOverviewForm(null, null);
    this.props._getPerWorkPlan(null);
    this.props._getPerMission(null);
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.collaboratingPerCountry.fetched && !this.collaboratingPerCountryBuilt) {
      const geoJson = {
        type: 'FeatureCollection',
        features: []
      };

      nextProps.collaboratingPerCountry.data.results.map((perForm) => {
        let countryMeta = getCountryMeta(perForm.country.id);
        perForm.country.iso = countryMeta.iso;
        let countryCentroid = getCentroid(perForm.country.iso);
        perForm.country.centroid = countryCentroid;

        geoJson.features.push({
          geometry: {
            type: 'Point',
            coordinates: countryCentroid
          },
          properties: perForm
        });

        return perForm;
      });
      this.setState({geoJsonFinal: {error: false, fetched: true, fetching: false, receivedAt: false, data: {geoJSON: geoJson}}});
      this.collaboratingPerCountryBuilt = true;
    }

    if (nextProps.getPerNsPhase.fetched && this.collaboratingPerCountryBuilt && !this.geoJsonBuilt && this.state.geoJsonFinal !== null) {
      const builtGeoJson = this.state.geoJsonFinal;

      builtGeoJson.data.geoJSON.features.map((mapObject) => {
        if (typeof nextProps.getPerNsPhase.data.results !== 'undefined') {
          const phaseObjects = nextProps.getPerNsPhase.data.results.filter((phaseObject) => phaseObject.country === mapObject.properties.country.id);
          const phaseObject = phaseObjects.length > 0 ? phaseObjects[0] : {id: -1, country: -1, phase: -1, updated_at: -1};
          mapObject.properties.phase = phaseObject;
        }
        return mapObject;
      });
      this.perNsPhaseBuilt = true;
    }

    if (this.collaboratingPerCountryBuilt && this.perNsPhaseBuilt && !this.geoJsonBuilt && nextProps.perOverviewForm.fetched) {
      const builtGeoJson = JSON.parse(JSON.stringify(this.state.geoJsonFinal));
      builtGeoJson.data.geoJSON.features.map((dataPoint) => {
        nextProps.perOverviewForm.data.results.forEach((overviewForm) => {
          if (dataPoint.properties.country.id === overviewForm.country.id) {
            dataPoint.properties.overviewData = overviewForm;
            return false;
          }
        });
        return dataPoint;
      });
      this.setState({geoJsonFinal: builtGeoJson});
      this.geoJsonBuilt = true;
    }

    if (!this.props.perWorkPlan.fetched && nextProps.perWorkPlan.fetched && !(typeof nextProps.perWorkPlan.error !== 'undefined' && nextProps.perWorkPlan.error !== null)) {
      const matchingWorkPlans = {};
      nextProps.perWorkPlan.data.results.forEach((perWorkPlan) => {
        if (perWorkPlan.prioritization === 2) {
          const perWorkPlanId = perWorkPlan.components.replace(/ /g, '_').replace(/,/g, '');
          if (typeof matchingWorkPlans[perWorkPlanId] === 'undefined') {
            matchingWorkPlans[perWorkPlanId] = 1;
          } else {
            const increasedCounter = this.state.topPrioritizedComponents[perWorkPlanId] + 1;
            matchingWorkPlans[perWorkPlanId] = increasedCounter;
          }
        }
        this.setState({topPrioritizedComponents: matchingWorkPlans});
      });
    }

    if (this.props.getPerMission.fetched === false && nextProps.getPerMission.fetched === true) {
      this.setState({perPerMission: this.isPerPermission(nextProps)});
    }
  }

  isPerPermission (props) {
    return (typeof props.user.data.username !== 'undefined' && props.user.data.username !== null) &&
      (typeof props.getPerMission !== 'undefined' && props.getPerMission.fetched && props.getPerMission.data.count > 0);
  }

  render () {
    return (
      <App className='page--homepage'>
        <section className='inpage'>
          <Helmet>
            <title>IFRC Go - Home</title>
          </Helmet>
          <header className='inpage__header'>
            <div className='inner'>
              <div className='inpage__headline'>
                <h1 className='inpage__title'>Preparedness for Effective Response (PER)</h1>
                <p className='inpage__introduction'>
                  To enable National Societies to fulfil their auxiliary role, in line with the Red Cross and Red Crescent Fundamental Principles, by strengthening<br />
                  local preparedness capacities to ensure timely and effective humanitarian assistance to prevent and alleviate human suffering.
                </p>
              </div>
            </div>
          </header>
          <div className='inpage__body'>
            <PreparednessHeader />
            { this.geoJsonBuilt ? <PerMap data={this.state.geoJsonFinal} noExport={true} noRenderEmergencies={true} overviewData={this.props.perOverviewForm} /> : null }
            { this.props.getPerEngagedNsPercentage.fetched ? <NationalSocietiesEngagedPer data={this.props.getPerEngagedNsPercentage} /> : null }
            { this.props.getPerGlobalPreparedness.fetched && this.props.perWorkPlan.fetched ? <GlobalPreparednessHighlights data={this.props.getPerGlobalPreparedness} prioritizationData={this.state.topPrioritizedComponents} perPermission={this.state.perPerMission} /> : null }
            <ContactPer />
          </div>
        </section>
      </App>);
  }
}

// /////////////////////////////////////////////////////////////////// //
// Connect functions

if (environment !== 'production') {
  Preparedness.propTypes = {
    _getCollaboratingPerCountry: T.func,
    _getPerEngagedNsPercentage: T.func,
    _getPerGlobalPreparedness: T.func,
    _getPerNsPhase: T.func,
    _getPerOverviewForm: T.func,
    _getPerWorkPlan: T.func,
    getPerEngagedNsPercentage: T.object,
    getPerNsPhase: T.object,
    collaboratingPerCountry: T.object,
    getPerGlobalPreparedness: T.object,
    perWorkPlan: T.object,
    perOverviewForm: T.object,
    _getPerMission: T.func,
    user: T.object,
    getPerMission: T.object
  };
}

const selector = (state) => ({
  collaboratingPerCountry: state.perForm.getCollaboratingPerCountry,
  getPerEngagedNsPercentage: state.perForm.getPerEngagedNsPercentage,
  getPerGlobalPreparedness: state.perForm.getPerGlobalPreparedness,
  getPerNsPhase: state.perForm.getPerNsPhase,
  perOverviewForm: state.perForm.getPerOverviewForm,
  perWorkPlan: state.perForm.getPerWorkPlan,
  getPerMission: state.perForm.getPerMission,
  user: state.user
});

const dispatcher = (dispatch) => ({
  _getCollaboratingPerCountry: () => dispatch(getCollaboratingPerCountry()),
  _getPerEngagedNsPercentage: () => dispatch(getPerEngagedNsPercentage()),
  _getPerGlobalPreparedness: () => dispatch(getPerGlobalPreparedness()),
  _getPerNsPhase: () => dispatch(getPerNsPhase()),
  _getPerOverviewForm: (...args) => dispatch(getPerOverviewForm(...args)),
  _getPerWorkPlan: (...args) => dispatch(getPerWorkPlan(...args)),
  _getPerMission: (...args) => dispatch(getPerMission(...args))
});

export default connect(selector, dispatcher)(Preparedness);

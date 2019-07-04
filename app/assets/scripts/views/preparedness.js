import React from 'react';
import App from './app';
import PreparednessHeader from '../components/preparedness/preparedness-header';
import PerMap from './../components/map/per-map';
import { connect } from 'react-redux';
import { getCollaboratingPerCountry, getPerEngagedNsPercentage } from './../actions';
import { Helmet } from 'react-helmet';
import { PropTypes as T } from 'prop-types';
import { environment } from '../config';
import { getCountryMeta } from './../utils/get-country-meta';
import { getCentroid } from './../utils/country-centroids';
import NationalSocietiesEngagedPer from '../components/preparedness/national-societies-engaged-per';
// import _groupBy from 'lodash.groupby';

class Preparedness extends React.Component {
  constructor (props) {
    super(props);
    this.geoJsonFinal = null;
  }

  componentDidMount () {
    this.props._getCollaboratingPerCountry();
    this.props._getPerEngagedNsPercentage();
  }

  componentDidUpdate (prevProps) {
    if (prevProps.collaboratingPerCountry.receivedAt !== this.props.collaboratingPerCountry.receivedAt) {
      const geoJson = {
        type: 'FeatureCollection',
        features: []
      };

      this.props.collaboratingPerCountry.data.results.map((perForm) => {
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
      this.geoJsonFinal = {error: false, fetched: true, fetching: false, receivedAt: false, data: {geoJSON: geoJson}};
      // const grouped = _groupBy(this.props.collaboratingPerCountry.data.results.filter(perForm => perForm.country), 'country.iso');
      this.forceUpdate();
    }
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
            { this.geoJsonFinal !== null ? <PerMap data={this.geoJsonFinal} noExport={true} noRenderEmergencies={true} /> : null }
            { this.props.getPerEngagedNsPercentage.fetched ? <NationalSocietiesEngagedPer data={this.props.getPerEngagedNsPercentage} /> : null }
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
    getPerEngagedNsPercentage: T.object,
    collaboratingPerCountry: T.object
  };
}

const selector = (state) => ({
  collaboratingPerCountry: state.perForm.getCollaboratingPerCountry,
  getPerEngagedNsPercentage: state.perForm.getPerEngagedNsPercentage
});

const dispatcher = (dispatch) => ({
  _getCollaboratingPerCountry: () => dispatch(getCollaboratingPerCountry()),
  _getPerEngagedNsPercentage: () => dispatch(getPerEngagedNsPercentage())
});

export default connect(selector, dispatcher)(Preparedness);

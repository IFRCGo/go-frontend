import React from 'react';
import App from './app';
import PreparednessHeader from './../components/preparedness-header';
import PerMap from './../components/map/per-map';
import { connect } from 'react-redux';
import {
  getAppealsList,
  getCollaboratingPerCountry
} from './../actions';
import { Helmet } from 'react-helmet';
import { PropTypes as T } from 'prop-types';
import { environment } from '../config';
import { getCountryMeta } from './../utils/get-country-meta';
import { getCentroid } from './../utils/country-centroids';
import _groupBy from 'lodash.groupby';

class Preparedness extends React.Component {
  constructor (props) {
    super(props);
    this.geoJsonFinal = null;
  }

  componentDidMount () {
    this.props._getAppealsList();
    this.props._getCollaboratingPerCountry();
  }

  componentDidUpdate (prevProps) {
    // console.log('ComponentDidUpdate');
    // console.log(prevProps);
    // console.log(this.props);
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
      // console.log(geoJson);
      this.geoJsonFinal = {error: false, fetched: true, fetching: false, receivedAt: false, data: {geoJSON: geoJson}};
      // const grouped = _groupBy(this.props.collaboratingPerCountry.data.results.filter(perForm => perForm.country), 'country.iso');
      // console.log('GROUPED');
      // console.log(grouped);
    }
  }

  render () {
    console.log('*** RENDER ***');
    console.log(this.geoJsonFinal);
    console.log(this.props.appealsList);
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
            { this.geoJsonFinal !== null ? <PerMap operations={this.geoJsonFinal} noExport={true} noRenderEmergencies={true} /> : null }
          </div>
        </section>
      </App>);
  }
}

// /////////////////////////////////////////////////////////////////// //
// Connect functions

if (environment !== 'production') {
  Preparedness.propTypes = {
    _getAppealsList: T.func,
    _getCollaboratingPerCountry: T.func,
    collaboratingPerCountry: T.obj,
    appealsList: T.obj
  };
}

const selector = (state) => ({
  appealsList: state.overallStats.appealsList,
  collaboratingPerCountry: state.perForm.getCollaboratingPerCountry
});

const dispatcher = (dispatch) => ({
  _getAppealsList: (...args) => dispatch(getAppealsList(...args)),
  _getCollaboratingPerCountry: () => dispatch(getCollaboratingPerCountry())
});

export default connect(selector, dispatcher)(Preparedness);

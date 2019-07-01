import React from 'react';
import App from './app';
import PreparednessHeader from './../components/preparedness-header';
import PerMap from './../components/map/per-map';
import { connect } from 'react-redux';
import { getAppealsList } from './../actions';
import { Helmet } from 'react-helmet';

class Preparedness extends React.Component {
  componentDidMount () {
    this.props._getAppealsList();
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
            <PerMap operations={this.props.appealsList} noExport={true} noRenderEmergencies={true} />
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
    appealsList: T.obj
  };
}

const selector = (state) => ({
  appealsList: state.overallStats.appealsList
});

const dispatcher = (dispatch) => ({
  _getAppealsList: (...args) => dispatch(getAppealsList(...args))
});

export default connect(selector, dispatcher)(Preparedness);

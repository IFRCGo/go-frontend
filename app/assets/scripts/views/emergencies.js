'use strict';
import React from 'react';
import memoize from 'memoize-one';
import { connect } from 'react-redux';
import { DateTime } from 'luxon';
import { PropTypes as T } from 'prop-types';
import { Helmet } from 'react-helmet';
import _cs from 'classnames';

import App from './app';
import { showGlobalLoading, hideGlobalLoading } from '../components/global-loading';
import FieldReportsTable from '../components/connected/field-reports-table';
import EmergenciesDash from '../components/connected/emergencies-dash';
import EmergenciesTable from '../components/connected/emergencies-table';

import ProjectForm from './ThreeW/project-form';
import { getLastMonthsEmergencies, getAggregateEmergencies } from '../actions';
import { environment } from '../config';

class Emergencies extends React.Component {
  state = {
    showProjectForm: false,
  }

  componentDidMount () {
    this.props._getLastMonthsEmergencies();
    this.props._getAggregateEmergencies(DateTime.local().minus({months: 11}).startOf('day').toISODate(), 'month');
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps (nextProps) {
    const newProjectAdded = this.props.projectForm.fetching === true &&
      nextProps.projectForm.fetching === false &&
      nextProps.projectForm.error === null;

    if (newProjectAdded) {
      this.setState({ showProjectForm: false });
    }
  }

  syncBodyOverflow = (shouldOverflow) => {
    if (shouldOverflow) {
      document.getElementsByTagName('html')[0].style.overflow = 'hidden';
    } else {
      document.getElementsByTagName('html')[0].style.overflow = 'auto';
    }
  }

  syncLoadingAnimation = memoize((
    projectForm = {},
  ) => {
    const shouldShowLoadingAnimation = projectForm.fetching;

    if (shouldShowLoadingAnimation) {
      this.loading = true;
      showGlobalLoading();
    } else {
      if (this.loading) {
        hideGlobalLoading();
        this.loading = false;
      }
    }
  })

  render () {
    this.syncBodyOverflow(this.state.showProjectForm);
    this.syncLoadingAnimation(this.props.projectForm);

    return (
      <App className='page--emergencies'>
        <Helmet>
          <title>IFRC Go - Emergencies</title>
        </Helmet>
        <section className='inpage'>
          <div className='inpage__header action-header'>
            <div className='inner'>
              <div className='action-button-container'>
                <button
                  onClick={() => { this.setState({ showProjectForm: true }); }}
                  className='button button--primary-bounded'
                >
                  Create 3W activity
                </button>
              </div>
            </div>
          </div>
          <EmergenciesDash />
          <div className='inpage__body'>
            <div className='inner'>
              <EmergenciesTable
                title='Emergencies in the last 30 days'
                limit={10}
                viewAll={'/emergencies/all'}
                showRecent={true}
              />
            </div>
            <div className='inner'>
              <FieldReportsTable
                title='Field Reports in the last 30 days'
                viewAll={'/reports/all'}
                showRecent={true}
              />
            </div>
          </div>
        </section>
        { this.state.showProjectForm && (
          <div className='project-form-modal'>
            <header>
              <h2>
                Movement activities in support of NS
              </h2>
              <button
                className={
                  _cs(
                    'button button--secondary-bounded',
                    this.loading && 'disabled',
                  )
                }
                onClick={() => {
                  this.setState({ showProjectForm: false });
                }}
                disabled={this.loading}
              >
                Close
              </button>
            </header>
            <ProjectForm />
          </div>
        )}
      </App>
    );
  }
}

if (environment !== 'production') {
  Emergencies.propTypes = {
    _getLastMonthsEmergencies: T.func,
    _getAggregateEmergencies: T.func,
    lastMonth: T.object,
    aggregate: T.object
  };
}

// /////////////////////////////////////////////////////////////////// //
// Connect functions

const selector = (state) => ({
  lastMonth: state.emergencies.lastMonth,
  aggregate: state.emergencies.aggregate,
  projectForm: state.projectForm,
});

const dispatcher = (dispatch) => ({
  _getAggregateEmergencies: (...args) => dispatch(getAggregateEmergencies(...args)),
  _getLastMonthsEmergencies: () => dispatch(getLastMonthsEmergencies())
});

export default connect(selector, dispatcher)(Emergencies);

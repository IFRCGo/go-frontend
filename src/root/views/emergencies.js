import React from 'react';
import { connect } from 'react-redux';
import { DateTime } from 'luxon';
import { PropTypes as T } from 'prop-types';
import { Helmet } from 'react-helmet';

// @NOTE: Temporary
// import { Link } from 'react-router-dom';

import App from '#views/app';

import BreadCrumb from '#components/breadcrumb';
import BlockLoading from '#components/block-loading';
import FieldReportsTable from '#components/connected/field-reports-table';
import EmergenciesDash from '#components/connected/emergencies-dash';
import EmergenciesTable from '#components/connected/emergencies-table';
import { allCountriesSelector } from '#selectors';

import { getLastMonthsEmergencies, getAggregateEmergencies } from '#actions';
import { environment } from '#config';

import LanguageContext from '#root/languageContext';

// @NOTE: Temporary
// import FlashUpdateTableLists from '#views/AllFlashUpdates/TableLists';

class Emergencies extends React.Component {
  componentDidMount() {
    this.props._getLastMonthsEmergencies();
    this.props._getAggregateEmergencies(DateTime.local().minus({ months: 11 }).startOf('day').toISODate(), 'month');
  }

  render() {
    const {
      lastMonth,
    } = this.props;
    const { strings } = this.context;
    const pending = !(lastMonth?.fetched);
    const count = lastMonth?.data?.count;
    const dashTitle = count ? `${strings.emergenciesTitle} (${count})` : strings.emergenciesTitle;

    return (
      <App className='page--emergencies'>
        <Helmet>
          <title>
            {strings.emergenciesTitle}
          </title>
        </Helmet>
        <section className='inpage'>
          <BreadCrumb crumbs={[{ link: '/emergencies', name: strings.breadCrumbEmergencies }, { link: '/', name: strings.breadCrumbHome }]} />
          {pending ? (
            <BlockLoading />
          ) : (
            <>
              <EmergenciesDash
                title={dashTitle}
              />
              <div>
                <div className='inner inner--emergencies-table-map'>
                  <EmergenciesTable
                    title={strings.emergenciesTableTitle}
                    limit={10}
                    showRecent={true}
                    showHeader={false}
                  />
                </div>
                {/* @NOTE: Temporary
                <div className='inner inner--field-reports-emergencies'>
                  <FlashUpdateTableLists
                    itemPerPage={4}
                    actions={(
                      <div className="fold__title__linkwrap">
                        <Link
                          className="fold__title__link"
                          to="/flash-update/all/"
                        >
                          {strings.flashUpdateReportsTableViewAllReports}
                        </Link>
                        <span className="collecticon-chevron-right" />
                      </div>
                    )}
                  />
                </div>
                */}
                <div className='inner inner--field-reports-emergencies'>
                  <FieldReportsTable
                    title={strings.fieldReportsTableTitle}
                    viewAll={'/reports/all'}
                    showRecent={true}
                  />
                </div>
              </div>
            </>
          )};
        </section>
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
  countries: allCountriesSelector(state),
});

const dispatcher = (dispatch) => ({
  _getAggregateEmergencies: (...args) => dispatch(getAggregateEmergencies(...args)),
  _getLastMonthsEmergencies: () => dispatch(getLastMonthsEmergencies())
});

Emergencies.contextType = LanguageContext;
export default connect(selector, dispatcher)(Emergencies);

import React from 'react';
import { PropTypes as T } from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import qs from 'qs';

import { environment } from '#config';
import { regions } from '#utils/region-constants';
import { getCountryMeta } from '#utils/get-country-meta';
import { get } from '#utils/utils';

import App from './app';
import EmergenciesTable from '#components/connected/emergencies-table';
import FieldReportsTable from '#components/connected/field-reports-table';
import AppealsTable from '#components/connected/appeals-table';
import AlertsTable from '#components/connected/alerts-table';
import EruTable from '#components/connected/eru-table';
import PersonnelTable from '#components/connected/personnel-table';
import BreadCrumb from '#components/breadcrumb';

import LanguageContext from '#root/languageContext';
import Translate from '#components/Translate';
import { resolveToString } from '#utils/lang';

class Table extends React.Component {
  getDisplayTypes = (strings) => ({
      report: strings.tableReport,
      appeal: strings.tableOperation,
      emergency: strings.tableEmergency,
      alert: strings.tableAlert,
      eru: strings.tableEru,
      personnel: strings.tablePersonnel,
  })

  getQueryParams () {
    const { search } = this.props.location;
    const query = search ? qs.parse(search.slice(1, search.length)) : {};
    return query;
  }

  renderContent () {
    const { type } = this.props;
    let props = {
      limit: 50,
      showExport: true
    };

    const { strings } = this.context;
    const query = this.getQueryParams();
    let titleArea = '';
    if (query.hasOwnProperty('region')) {
      titleArea = get(regions, [query.region.toString(), 'name']);
      props.region = titleArea ? query.region : null;
    } else if (query.hasOwnProperty('country')) {
      titleArea = getCountryMeta(query.country);
      titleArea = titleArea ? titleArea.label : null;
      props.country = titleArea ? query.country : null;
    }

    if (query.record && !isNaN(query.record)) {
      props.record = query.record;
    }

    if (query.atype && type === 'appeal' && (query.atype.toLowerCase() === 'dref' || query.atype.toLowerCase() === 'appeal')) {
      props.atype = query.atype.toLowerCase();
    }
    if (titleArea) titleArea += ' ';
    switch (this.props.type) {
      case 'emergency':
      return <EmergenciesTable title={resolveToString(strings.emergenciesTableTitle, { title: titleArea})} {...props} />;
      case 'report':
      return <FieldReportsTable title={resolveToString(strings.reportsTableTitle, { title: titleArea})} {...props} />;
      case 'appeal':
        let noun = 'Operations';
        if (props.atype) {
          noun = props.atype === 'dref' ? 'DREFs' : 'Appeals';
        }
      const title = props.hasOwnProperty('record') ? strings.operationsWithEmergency : resolveToString(strings.tableAppealsTitle, { title: titleArea, noun: noun });
      return <AppealsTable title={title} {...props} />;
      case 'alert':
      return <AlertsTable title={strings.tableAllAlertsTitle} {...props} />;
      case 'eru':
      return <EruTable title={strings.tableAllEruTitle} {...props} />;
      case 'personnel':
      return <PersonnelTable title={strings.tableAllPersonnel} {...props} />;
    }
  }

  getCrumbs () {
    const { strings } = this.context;
    const displayTypes = this.getDisplayTypes(strings);
    const tableType = displayTypes[this.props.type];
    const home = {
      link: '/',
      name: 'Home'
    };
    const qs = this.getQueryParams();
    const isEmptyQS = Object.keys(qs).length === 0;
    const extraCrumbs = [];
    if (isEmptyQS) {
      extraCrumbs.push({
        link: this.props.location.pathname,
        name: `All ${tableType}`
      });
    } else {
      extraCrumbs.push({
        link: this.props.location.pathname,
        name: tableType
      });
      if (qs.hasOwnProperty('region')) {
        const regionId = qs.region;
        const region = get(regions, regionId.toString(), 'name');
        extraCrumbs.push({
          link: `/regions/${regionId}`,
          name: region.name
        });
      }
      if (qs.hasOwnProperty('country')) {
        const country = getCountryMeta(qs.country);
        extraCrumbs.push({
          link: `/countries/${qs.country}`,
          name: country.label
        });
      }
    }
    return extraCrumbs.concat([home]);
  }

  render () {
    const crumbs = this.getCrumbs();
    const { strings } = this.context;
    const displayTypes = this.getDisplayTypes(strings);

    return (
      <App>
        <Helmet>
          <title>
            <Translate
              stringId='tableTitle'
              params={{
                type: displayTypes[this.props.type],
              }}
            />
          </title>
        </Helmet>
        <BreadCrumb crumbs={crumbs} />
        <div className='inpage__body'>
          <div className='inner table__container'>
            {this.renderContent()}
          </div>
        </div>
      </App>
    );
  }
}

Table.contextType = LanguageContext;

if (environment !== 'production') {
  Table.propTypes = {
    type: T.string,
    location: T.object
  };
}

const selector = (state) => ({
});

const dispatcher = {};

export default connect(selector, dispatcher)(Table);

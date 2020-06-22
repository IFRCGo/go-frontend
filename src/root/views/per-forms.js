
import React from 'react';
import A1PolicyStrategyForm from '#components/per-forms/a1-policy-strategy-form';
import A2AnalysisAndPlanningForm from '#components/per-forms/a2-analysis-and-planning-form';
import A3OperationalCapacity from '#components/per-forms/a3-operational-capacity';
import A4Coordination from '#components/per-forms/a4-coordination';
import A5OperationsSupport from '#components/per-forms/a5-operations-support';
import A3OperationalCapacity2 from '#components/per-forms/a3-operational-capacity-2';
import OverviewForm from '#components/per-forms/overview-form';
import BreadCrumb from '#components/breadcrumb';
import { getCountryMeta } from '#utils/get-country-meta';
import { Helmet } from 'react-helmet';
import { environment } from '#config';
import { PropTypes as T } from 'prop-types';
import App from './app';

class PerForms extends React.Component {
  render () {
    let form = null;
    let formName = 'PER Form';
    const countryId = this.props.match.params.id;
    if (this.props.match.params.formName === 'policy-strategy') {
      form = (<A1PolicyStrategyForm mode='new'
        autosaveOn={true}
        nationalSociety={countryId} />);
      formName = 'PER: Policy and Strategy';
    } else if (this.props.match.params.formName === 'analysis-and-planning') {
      form = (<A2AnalysisAndPlanningForm mode='new'
        autosaveOn={true}
        nationalSociety={countryId} />);
      formName = 'PER: Analysis and Planning';
    } else if (this.props.match.params.formName === 'operational-capacity') {
      form = (<A3OperationalCapacity mode='new'
        autosaveOn={true}
        nationalSociety={countryId} />);
      formName = 'PER: Operational Capacity 1';
    } else if (this.props.match.params.formName === 'operational-capacity-2') {
      form = (<A3OperationalCapacity2 mode='new'
        autosaveOn={true}
        nationalSociety={countryId} />);
      formName = 'PER: Operational Capacity 2';
    } else if (this.props.match.params.formName === 'coordination') {
      form = (<A4Coordination mode='new'
        autosaveOn={true}
        nationalSociety={countryId} />);
      formName = 'PER: Coordination';
    } else if (this.props.match.params.formName === 'operations-support') {
      form = (<A5OperationsSupport mode='new'
        autosaveOn={true}
        nationalSociety={countryId} />);
      formName = 'PER: Operations Support';
    } else if (this.props.match.params.formName === 'overview') {
      form = (<OverviewForm view={false}
        nationalSociety={countryId} />);
      formName = 'PER: Overview';
    }
    return (
      <App className='page--emergencies'>
        <Helmet>
          <title>IFRC Go - Emergencies</title>
        </Helmet>
        <BreadCrumb crumbs={[
          {link: this.props.location.pathname, name: formName},
          {link: '/account', name: 'Account'},
          {link: '/', name: 'Home'}
        ]} />
        <section className='inpage'>
          <div className='inpage__body'>
            <div className='inner'>
              {form}
            </div>
          </div>
        </section>
      </App>
    );
  }
}

if (environment !== 'production') {
  PerForms.propTypes = {
    user: T.object,
    profile: T.object,
    fieldReport: T.object,
    location: T.object,
    match: T.object,
    nationalSociety: T.number,
    _getProfile: T.func,
    _updateSubscriptions: T.func,
    _getFieldReportsByUser: T.func,
    _updateProfile: T.func
  };
}

export default PerForms;

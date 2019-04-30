'use strict';

import React from 'react';
import A1PolicyStrategyForm from './per-forms/a1-policy-strategy-form';
import A2AnalysisAndPlanningForm from './per-forms/a2-analysis-and-planning-form';
import A3OperationalCapacity from './per-forms/a3-operational-capacity';
import { Helmet } from 'react-helmet';
import App from './app';

class PerForms extends React.Component {
  render () {
    console.log(this.props.location.pathname);
    let form = null;
    if (this.props.location.pathname === '/per-forms/policy-strategy') {
      form = (<A1PolicyStrategyForm />);
    } else if (this.props.location.pathname === '/per-forms/analysis-and-planning') {
      form = (<A2AnalysisAndPlanningForm />);
    } else if (this.props.location.pathname === '/per-forms/operational-capacity') {
      form = (<A3OperationalCapacity />);
    }

    return (
      <App className='page--emergencies'>
        <Helmet>
          <title>IFRC Go - Emergencies</title>
        </Helmet>
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
  Account.propTypes = {
    user: T.object,
    profile: T.object,
    fieldReport: T.object,
    _getProfile: T.func,
    _updateSubscriptions: T.func,
    _getFieldReportsByUser: T.func,
    _updateProfile: T.func
  };
}

export default PerForms;

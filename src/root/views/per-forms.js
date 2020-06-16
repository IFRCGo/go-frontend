
import React from 'react';
import A1PolicyStrategyForm from '#components/per-forms/a1-policy-strategy-form';
import A2AnalysisAndPlanningForm from '#components/per-forms/a2-analysis-and-planning-form';
import A3OperationalCapacity from '#components/per-forms/a3-operational-capacity';
import A4Coordination from '#components/per-forms/a4-coordination';
import A5OperationsSupport from '#components/per-forms/a5-operations-support';
import A3OperationalCapacity2 from '#components/per-forms/a3-operational-capacity-2';
import OverviewForm from '#components/per-forms/overview-form';
import { Helmet } from 'react-helmet';
import { environment } from '#config';
import { PropTypes as T } from 'prop-types';
import App from './app';

class PerForms extends React.Component {
  render () {
    let form = null;
    if (this.props.match.params.formName === 'policy-strategy') {
      form = (<A1PolicyStrategyForm mode='new'
        autosaveOn={true}
        nationalSociety={this.props.match.params.id} />);
    } else if (this.props.match.params.formName === 'analysis-and-planning') {
      form = (<A2AnalysisAndPlanningForm mode='new'
        autosaveOn={true}
        nationalSociety={this.props.match.params.id} />);
    } else if (this.props.match.params.formName === 'operational-capacity') {
      form = (<A3OperationalCapacity mode='new'
        autosaveOn={true}
        nationalSociety={this.props.match.params.id} />);
    } else if (this.props.match.params.formName === 'operational-capacity-2') {
      form = (<A3OperationalCapacity2 mode='new'
        autosaveOn={true}
        nationalSociety={this.props.match.params.id} />);
    } else if (this.props.match.params.formName === 'coordination') {
      form = (<A4Coordination mode='new'
        autosaveOn={true}
        nationalSociety={this.props.match.params.id} />);
    } else if (this.props.match.params.formName === 'operations-support') {
      form = (<A5OperationsSupport mode='new'
        autosaveOn={true}
        nationalSociety={this.props.match.params.id} />);
    } else if (this.props.match.params.formName === 'overview') {
      form = (<OverviewForm view={false}
        nationalSociety={this.props.match.params.id} />);
    }

    return (
      <App className='page--emergencies'>
        <Helmet>
          <title>IFRC Go - PER</title>
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

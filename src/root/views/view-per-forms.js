
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
import LanguageContext from '#root/languageContext';

class ViewPerForms extends React.Component {
  render () {
    let form = null;
    if (this.props.match.params.formName === 'a1') {
      form = (<A1PolicyStrategyForm mode='view'
        autosaveOn={false}
        match={this.props.match}
        formId={this.props.match.params.id} />);
    } else if (this.props.match.params.formName === 'a2') {
      form = (<A2AnalysisAndPlanningForm mode='view'
        autosaveOn={false}
        match={this.props.match}
        formId={this.props.match.params.id} />);
    } else if (this.props.match.params.formName === 'a3') {
      form = (<A3OperationalCapacity mode='view'
        autosaveOn={false}
        match={this.props.match}
        formId={this.props.match.params.id} />);
    } else if (this.props.match.params.formName === 'a3-2') {
      form = (<A3OperationalCapacity2 mode='view'
        autosaveOn={false}
        match={this.props.match}
        formId={this.props.match.params.id} />);
    } else if (this.props.match.params.formName === 'a4') {
      form = (<A4Coordination mode='view'
        autosaveOn={false}
        match={this.props.match}
        formId={this.props.match.params.id} />);
    } else if (this.props.match.params.formName === 'a5') {
      form = (<A5OperationsSupport mode='view'
        autosaveOn={false}
        match={this.props.match}
        formId={this.props.match.params.id} />);
    } else if (this.props.match.params.formName === 'overview') {
      form = (<OverviewForm view={true}
        formId={this.props.match.params.id} />);
    }

    const { strings } = this.context;
    return (
      <App className='page--emergencies'>
        <Helmet>
          <title>{strings.viewPerFormsTitle}</title>
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
  ViewPerForms.propTypes = {
    user: T.object,
    profile: T.object,
    fieldReport: T.object,
    location: T.object,
    match: T.object,
    _getProfile: T.func,
    _updateSubscriptions: T.func,
    _getFieldReportsByUser: T.func,
    _updateProfile: T.func
  };
}
ViewPerForms.contextType = LanguageContext;
export default ViewPerForms;

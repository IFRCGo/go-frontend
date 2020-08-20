
import React from 'react';
import { connect } from 'react-redux';
import A1PolicyStrategyForm from '#components/per-forms/a1-policy-strategy-form';
import A2AnalysisAndPlanningForm from '#components/per-forms/a2-analysis-and-planning-form';
import A3OperationalCapacity from '#components/per-forms/a3-operational-capacity';
import A4Coordination from '#components/per-forms/a4-coordination';
import A5OperationsSupport from '#components/per-forms/a5-operations-support';
import A3OperationalCapacity2 from '#components/per-forms/a3-operational-capacity-2';
import { getCountryMeta } from '#utils/get-country-meta';
import BreadCrumb from '#components/breadcrumb';
import { Helmet } from 'react-helmet';
import { environment } from '#config';
import { PropTypes as T } from 'prop-types';
import App from './app';
import { countriesSelector } from '#selectors';

import LanguageContext from '#root/languageContext';

class EditPerForms extends React.Component {
  render () {
    let form = null;
    if (this.props.match.params.formCode === 'a1') {
      form = (<A1PolicyStrategyForm mode='edit'
        autosaveOn={true}
        match={this.props.match}
        formCode={this.props.match.params.formCode}
        user={this.props.match.params.user}
        ns={this.props.match.params.ns} />);
    } else if (this.props.match.params.formCode === 'a2') {
      form = (<A2AnalysisAndPlanningForm mode='edit'
        autosaveOn={true}
        match={this.props.match}
        formCode={this.props.match.params.formCode}
        user={this.props.match.params.user}
        ns={this.props.match.params.ns} />);
    } else if (this.props.match.params.formCode === 'a3') {
      form = (<A3OperationalCapacity mode='edit'
        autosaveOn={true}
        match={this.props.match}
        formCode={this.props.match.params.formCode}
        user={this.props.match.params.user}
        ns={this.props.match.params.ns} />);
    } else if (this.props.match.params.formCode === 'a3-2') {
      form = (<A3OperationalCapacity2 mode='edit'
        autosaveOn={true}
        match={this.props.match}
        formCode={this.props.match.params.formCode}
        user={this.props.match.params.user}
        ns={this.props.match.params.ns} />);
    } else if (this.props.match.params.formCode === 'a4') {
      form = (<A4Coordination mode='edit'
        autosaveOn={true}
        match={this.props.match}
        formCode={this.props.match.params.formCode}
        user={this.props.match.params.user}
        ns={this.props.match.params.ns} />);
    } else if (this.props.match.params.formCode === 'a5') {
      form = (<A5OperationsSupport mode='edit'
        autosaveOn={true}
        match={this.props.match}
        formCode={this.props.match.params.formCode}
        user={this.props.match.params.user}
        ns={this.props.match.params.ns} />);
    }

    const { strings } = this.context;
    return (
      <App className='page--emergencies'>
        <Helmet>
          <title>{strings.editPerFormsTitle}</title>
        </Helmet>
        <BreadCrumb crumbs={[
          {link: this.props.location.pathname, name: strings.breadCrumbPERForm},
          {link: `/countries/${this.props.match.params.ns}`, name: `${getCountryMeta(this.props.match.params.ns, this.props.countries).label || strings.breadCrumbAccount}`},
          {link: '/', name: strings.breadCrumbHome}
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

EditPerForms.contextType = LanguageContext;
if (environment !== 'production') {
  EditPerForms.propTypes = {
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

const selector = (state, ownProps) => ({
  countries: countriesSelector(state)
});

const dispatcher = (dispatch) => ({
});

export default connect(selector, dispatcher)(EditPerForms);

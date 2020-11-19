import React, { useContext, useMemo, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { environment } from '#config';
import { PropTypes as T } from 'prop-types';

import LanguageContext from '#root/languageContext';
import Translate from '#components/Translate';

import App from './app';
import Fold from '#components/fold';
import BreadCrumb from '#components/breadcrumb';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import TabContent from '#components/tab-content';
// import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import PerOverview from '#components/per-forms/per-overview';

import {
  getAssessmentTypes,
  getPerAreas,
  getPerOverviewFormStrict,
  getPerForms,
  createPerOverview,
  updatePerOverview,
  deletePerOverview,
  resetPerState
} from '#actions';
import { nsDropdownSelector } from '#selectors';

import {
  FormInput,
  FormCheckbox,
  FormError
} from '#components/form-elements/';
import Select from 'react-select';
import { showGlobalLoading, hideGlobalLoading } from '#components/global-loading';
import { showAlert } from '#components/system-alerts';

function PerAssessment (props) {
  const { strings } = useContext(LanguageContext);

  //let tabs = [
    //{ title: strings.perAccountOverview, hash: '#overview' }
  //];

  const idFromPath = props.match.params.id;
  const isEdit = !!props.isEdit;
  const isCreate = !!props.isCreate;
  const editable = useMemo(() => {
    let isedi = false;
    if (isCreate) {
      isedi = true;
    } else {
      const of = props.perForm.getPerOverviewForm;
      if (!of.fetching && of.fetched && of.data) {
        isedi = !of.data.results[0].is_finalized && isEdit;
      }
    }
    return isedi;
  }, [isEdit, isCreate, props.perForm.getPerOverviewForm]);
  const {
    _getAssessmentTypes,
    _getPerAreas,
    _getPerOverviewFormStrict,
    _getPerForms,
    _resetPerState
  } = props;

  function handleTabChange (index) {
    const tabHashArray = tabs.map(({ hash }) => hash);
    const url = props.location.pathname;
    props.history.replace(`${url}${tabHashArray[index]}`);
  }


  // Get PER Areas and fill up the links array with them
  useEffect(() => {
    _getPerAreas();
  }, [_getPerAreas]);


  const tabs = useMemo(() => {
    let tabList = [{ title: strings.perAccountOverview, hash: '#overview' }];
    console.log(tabList);
    if (isCreate && !props.perAreas.fetching && props.perAreas.fetched) {
      props.perAreas.data.results.forEach(
        area => tabList.push({ title: `Area ${area.area_num}`, hash: `#area-${area.area_num}`})
      );
    }
    console.log(props.perAreas.data);
    return tabList;
  }, [props.perAreas, isCreate]);


  const formAreas = useMemo(() => {
    const pfs = props.perForm.getPerForms;
    if (!pfs.fetching && pfs.fetched && pfs.data) {
      return pfs.data.results.map(form => ({
        link: `/per-form/${form.id}`,
        title: `${strings.perdocumentArea} ${form.area.area_num}`,
        subtitle: form.area.title
      }));
    } else if (isCreate && !props.perAreas.fetching && props.perAreas.fetched && props.perAreas.data) {
      props.perAreas.data.results.forEach(
        area => tabs.push({ title: `Area ${area.area_num}`, hash: `#area-${area.area_num}`})
      );
      return props.perAreas.data.results.map(area => ({
        title: `${strings.perdocumentArea} ${area.area_num}`,
        subtitle: area.title
      }));
    }

    return [];
  }, [props.perAreas, strings.perdocumentArea, props.perForm.getPerForms, isCreate]);

  // Create, update, delete actions
  useEffect(() => {
    const cpo = props.perForm.createPerOverview;
    if (!cpo.fetching && cpo.fetched && cpo.data) {
      hideGlobalLoading();
      if (cpo.data.status === 'ok') {
        showAlert('success', <p><Translate stringId="perOverviewAlertCreated" /></p>, true, 2000);
        setTimeout(() => props.history.push(`/per-overview/${cpo.data.overview_id}/edit`), 2000);
        _resetPerState();
      } else if (cpo.error) {
        showAlert('danger', <p><Translate stringId="perOverviewAlertCreated" /></p>, true, 2000);
      }
    }
    const upo = props.perForm.updatePerOverview;
    if (!upo.fetching && upo.fetched && upo.data) {
      hideGlobalLoading();
      if (upo.data.status === 'ok') {
        showAlert('success', <p><Translate stringId="perOverviewAlertUpdated" /></p>, true, 2000);
        setTimeout(() => props.history.push(`/account#per-forms`), 2000);
        _resetPerState();
      } else if (upo.error) {
        showAlert('danger', <p><Translate stringId="perOverviewAlertUpdated" /></p>, true, 2000);
      }
    }
    const dpo = props.perForm.deletePerOverview;
    if (!dpo.fetching && dpo.fetched && dpo.data) {
      hideGlobalLoading();
      if (dpo.data.status === 'ok') {
        showAlert('success', <p><Translate stringId="perOverviewAlertDeleted" /></p>, true, 2000);
        setTimeout(() => props.history.push(`/account#per-forms`), 2000);
        _resetPerState();
      } else if (dpo.error) {
        showAlert('danger', <p><Translate stringId="perOverviewAlertDeleted" /></p>, true, 2000);
      }
    }
  }, [
    props.perForm.createPerOverview,
    props.perForm.updatePerOverview,
    props.perForm.deletePerOverview,
    _resetPerState,
    props.history
  ]);

  useEffect(() => {
    _getAssessmentTypes();
  }, [_getAssessmentTypes]);

  useEffect(() => {
    if (idFromPath) {
      _getPerOverviewFormStrict(null, idFromPath);
      showGlobalLoading();
    }
  }, [_getPerOverviewFormStrict, idFromPath]);

  useEffect(() => {
    if (idFromPath) {
      _getPerForms(null, idFromPath);
    }
  }, [_getPerForms, idFromPath]);

  const assessmentTypes = useMemo(() => {
    const ats = props.perForm.assessmentTypes;
    if (ats.data && !ats.fetching && ats.fetched) {
      return ats.data.results.map(res => ({ value: res.id, label: res.name }));
    }
    return [];
  }, [props.perForm.assessmentTypes]);

  return (
    <App className='page--per-form'>
      <section className='inpage'>
        <Helmet>
          <title>{strings.perFormTitle}</title>
        </Helmet>
          <section className='inpage__body'>
            <div className='tab__wrap'>
              <Tabs
                selectedIndex={tabs.map(({ hash }) => hash).indexOf(props.location.hash)}
                onSelect={index => handleTabChange(index)}
              >
                <TabList>
                  { tabs.map((tab, idx) => (
                    <Tab key={tab.title} disabled={isCreate && idx !== 0 ? true : false}>{tab.title}</Tab>
                  ))}
                </TabList>

                <div className='inpage__body'>
                  <div className='inner'>
                    <TabPanel>
                      <TabContent>
                        <div className='container-lg'>
                          <PerOverview />
                        </div>
                      </TabContent>
                    </TabPanel>
                    { tabs.map(tab => (
                      <TabPanel>
                        <TabContent>
                          {/* TODO: Each Area's tab if !isCreate */}
                          <div>asd</div>
                        </TabContent>
                      </TabPanel>
                    ))}
                    {/* <TabPanel>
                      <TabContent>
                        <div className='container-lg'>
                          {this.renderFieldReports()}
                        </div>
                      </TabContent>
                      <TabContent isError={this.props.profile.fetched && this.props.profile.error} errorMessage={strings.accountSubscriptionError} title={strings.accountSubscriptionTitle}>
                        <div className='container-lg'>
                          {this.props.profile.fetched && this.renderSubscriptionForm()}
                        </div>
                      </TabContent>
                    </TabPanel>
                    <TabPanel>
                      <TabContent isError={!this.isPerPermission()} errorMessage={strings.accountPerError} title={strings.accountPerTitle}>
                        <PerAccount user={this.props.user} />
                      </TabContent>
                    </TabPanel> */}
                  </div>
                </div>
              </Tabs>
            </div>
          </section>
      </section>
    </App>
  );
}

if (environment !== 'production') {
  PerAssessment.propTypes = {
    user: T.object,
    perAreas: T.object,
    perForm: T.object,
    nsDropdownItems: T.array,
    _getAssessmentTypes: T.func,
    _getPerOverviewFormStrict: T.func,
    _createPerOverview: T.func,
    _updatePerOverview: T.func,
    _deletePerOverview: T.func,
    _resetPerState: T.func
  };
}

const selector = (state, ownProps) => ({
  user: state.user.data,
  perAreas: state.perAreas,
  perForm: state.perForm,
  nsDropdownItems: nsDropdownSelector(state)
});

const dispatcher = (dispatch) => ({
  _getAssessmentTypes: () => dispatch(getAssessmentTypes()),
  _getPerAreas: (...args) => dispatch(getPerAreas(...args)),
  _getPerOverviewFormStrict: (...args) => dispatch(getPerOverviewFormStrict(...args)),
  _getPerForms: (...args) => dispatch(getPerForms(...args)),
  _createPerOverview: (payload) => dispatch(createPerOverview(payload)),
  _updatePerOverview: (payload) => dispatch(updatePerOverview(payload)),
  _deletePerOverview: (payload) => dispatch(deletePerOverview(payload)),
  _resetPerState: () => dispatch(resetPerState()),
});

export default connect(selector, dispatcher)(PerAssessment);

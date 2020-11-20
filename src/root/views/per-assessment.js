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
import PerForm from '#components/per-forms/per-form';
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

import { showGlobalLoading, hideGlobalLoading } from '#components/global-loading';
import { showAlert } from '#components/system-alerts';

function PerAssessment (props) {
  const { strings } = useContext(LanguageContext);

  const idFromPath = props.match.params.id;
  const isEdit = !!props.isEdit;
  const isCreate = !!props.isCreate;
  let isEpi = false; // FIXME: get from Overview

  const {
    _getPerAreas,
    _getPerOverviewFormStrict,
    _getPerForms,
  } = props;

  function handleTabChange (index) {
    const tabHashArray = tabs.map(({ hash }) => hash);
    const url = props.location.pathname;
    props.history.replace(`${url}${tabHashArray[index]}`);
  }

  useEffect(() => {
    _getPerAreas();
  }, [_getPerAreas]);

  useEffect(() => {
    // Basically if it's not Create
    if (idFromPath) {
      _getPerOverviewFormStrict(null, idFromPath);
      _getPerForms(null, idFromPath);
      showGlobalLoading();
    }
  }, [_getPerOverviewFormStrict, _getPerForms, idFromPath]);

  const [formsFetching, formsFetched, formsData] = useMemo(() => {
    return [
      props.perForm.getPerForms.fetching,
      props.perForm.getPerForms.fetched,
      props.perForm.getPerForms.data
    ];
  }, [props.perForm.getPerForms]);

  const tabs = useMemo(() => {
    let tabList = [{ title: strings.perAccountOverview, hash: '#overview' }];

    if (isCreate && !props.perAreas.fetching && props.perAreas.fetched) {
      props.perAreas.data.results.forEach(
        area => tabList.push({ title: `Area ${area.area_num}`, hash: `#area-${area.area_num}`})
      );
    } else if (!formsFetching && formsFetched && formsData) {
      formsData.results.forEach(
        form => tabList.push({
          title: `Area ${form.area.area_num}`,
          hash: `#area-${form.area.area_num}`
        })
      );
    }
    return tabList;
  }, [props.perAreas, isCreate, strings.perAccountOverview, formsFetching, formsFetched, formsData]);

  // const formAreas = useMemo(() => {
  //   const pfs = props.perForm.getPerForms;
  //   if (!pfs.fetching && pfs.fetched && pfs.data) {
  //     return pfs.data.results.map(form => ({
  //       link: `/per-form/${form.id}`,
  //       title: `${strings.perdocumentArea} ${form.area.area_num}`,
  //       subtitle: form.area.title
  //     }));
  //   } else if (isCreate && !props.perAreas.fetching && props.perAreas.fetched && props.perAreas.data) {
  //     props.perAreas.data.results.forEach(
  //       area => tabs.push({ title: `Area ${area.area_num}`, hash: `#area-${area.area_num}`})
  //     );
  //     return props.perAreas.data.results.map(area => ({
  //       title: `${strings.perdocumentArea} ${area.area_num}`,
  //       subtitle: area.title
  //     }));
  //   }

  //   return [];
  // }, [props.perAreas, strings.perdocumentArea, props.perForm.getPerForms, isCreate]);



  useEffect(() => {
    const overviews = props.perForm.getPerOverviewForm;
    const forms = props.perForm.getPerForms;
    if (!isCreate
      && !overviews.fetching
      && overviews.fetched
      && overviews.data
      && !forms.fetching
      && forms.fetched
      && forms.data) {
      hideGlobalLoading();
    }
  }, [props.perForm.getPerOverviewForm, props.perForm.getPerForms, isCreate]);

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
                    <Tab key={tab.title} disabled={(isCreate && idx !== 0) ? true : false}>{tab.title}</Tab>
                  ))}
                </TabList>

                <div className='inpage__body'>
                  <div className='inner'>
                    <TabPanel>
                      <TabContent>
                        <PerOverview idFromPath={idFromPath} isCreate={isCreate} isEdit={isEdit} />
                      </TabContent>
                    </TabPanel>
                    { formsData?.results ? formsData.results.map(form => (
                      <TabPanel key={form.id}>
                        <TabContent>
                          { isCreate
                            ? null
                            : (
                              <PerForm form={form} formId={form.id} isCreate={isCreate} isEdit={isEdit} isEpi={isEpi} />
                            )}
                        </TabContent>
                      </TabPanel>
                    )) : null }

                    {/* { tabs.slice(1).map(tab => (
                      <TabPanel key={tab.title}>
                        <TabContent>
                          { isCreate
                            ? null
                            : (
                              <PerForm />
                            )}
                        </TabContent>
                      </TabPanel>
                    ))} */}
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

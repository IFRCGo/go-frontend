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
  getPerQuestions,
  getPerOverviewFormStrict,
  getPerForms,
  createPerOverview,
  updatePerOverview,
  deletePerOverview,
  resetPerState
} from '#actions';
import { formQuestionsSelector, nsDropdownSelector } from '#selectors';

import { showGlobalLoading, hideGlobalLoading } from '#components/global-loading';

function PerAssessment (props) {
  const { strings } = useContext(LanguageContext);
  const [overviewState, setOverviewState] = useState({
    branches_involved: '',
    country_id: '',
    date_of_assessment: '',
    date_of_mid_term_review: '',
    date_of_next_asmt: '',  
    facilitator_name: '',
    facilitator_email: '',
    facilitator_phone: '',
    facilitator_contact: '',
    is_epi: false,
    is_finalized: false, // TODO: maybe not handle here but at submit
    method_asmt_used: '',    
    ns_focal_point_name: '',
    ns_focal_point_email: '',
    ns_focal_point_phone: '',
    other_consideration: '',
    partner_focal_point_name: '',
    partner_focal_point_email: '',
    partner_focal_point_phone: '',
    partner_focal_point_organization: '',
    type_of_assessment: '',
    user_id: props.user.id
  });
  const [formsState, setFormsState] = useState();
  const [formDataState, setFormDataState] = useState();
  const idFromPath = props.match.params.id;
  const isEdit = !!props.isEdit;
  const isCreate = !!props.isCreate;
  let isEpi = false; // FIXME: get from Overview
  const {
    _getAssessmentTypes,
    _getPerAreas,
    _getPerQuestions,
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
    _getAssessmentTypes();
  }, [_getAssessmentTypes]);

  useEffect(() => {
    _getPerQuestions();
  }, [_getPerQuestions]);

  useEffect(() => {
    // Basically if it's not Create
    if (idFromPath) {
      _getPerOverviewFormStrict(null, idFromPath);
      _getPerForms(null, idFromPath, true);
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

  // useEffect(() => {
  //   const pf = props.perForm.getPerForm;
  //   const pq = props.perQuestions;
  //   if (!pf.fetching && pf.fetched && pf.data && !pq.fetching && pq.fetched && pq.data) {
  //     let questionsDict = {};
  //     pf.data.results.forEach((fd) => {
  //       questionsDict[fd.question_id] = {
  //         selected_answer: fd.selected_answer?.id.toString() || '',
  //         notes: fd.notes
  //       };
  //     });
  //     setQuestionsState(questionsDict);
  //     hideGlobalLoading();
  //   }
  // }, [props.perForm.getPerForm, props.perQuestions]);

  const assessmentTypes = useMemo(() => {
    const ats = props.perForm.assessmentTypes;
    if (ats.data && !ats.fetching && ats.fetched) {
      return ats.data.results.map(res => ({ value: res.id, label: res.name }));
    }
    return [];
  }, [props.perForm.assessmentTypes]);

  useEffect(() => {
    const overviews = props.perForm.getPerOverviewForm;
    if (!isCreate
      && !overviews.fetching
      && overviews.fetched
      && overviews.data
      && !formsFetching
      && formsFetched
      && formsData
      && formDataState
      && props.groupedPerQuestions) {
      hideGlobalLoading();
    }
  }, [
    isCreate,
    props.perForm.getPerOverviewForm,
    formsFetching,
    formsFetched,
    formsData,
    formDataState,
    props.groupedPerQuestions
  ]);

  useEffect(() => {
    if (!isCreate && !formsFetching && formsFetched && formsData) {
      let formsDict = {};
      let formsDataDict = {};
      formsData.results.forEach(form => {
        // Set the Forms / { form_id: { Form's props } }
        formsDict[form.id] = form;

        let questionsDict = {};
        // Set the Questions from FormData / { form_id: { question_id: { ...FormData } } }
        if (form.form_data) {
          form.form_data.forEach(fd => questionsDict[fd.question_id] = {
            selected_answer: fd.selected_answer,
            notes: fd.notes
          });
        }
        formsDataDict[form.id] = questionsDict;
      });
      setFormsState(formsDict);
      setFormDataState(formsDataDict);
    }
  }, [isCreate, formsFetching, formsFetched, formsData]);

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
                        <PerOverview
                          idFromPath={idFromPath}
                          isCreate={isCreate}
                          isEdit={isEdit}
                          overviewState={overviewState}
                          setOverviewState={setOverviewState}
                          assessmentTypes={assessmentTypes}
                        />
                      </TabContent>
                    </TabPanel>
                    { isCreate
                      ? tabs.slice(1).map(tab => (
                        <TabPanel key={tab.title}>
                          <TabContent />
                        </TabPanel>
                      ))
                      : (formsData?.results
                        ? formsData.results.map(form => (
                          <TabPanel key={form.id}>
                            <TabContent>
                              <PerForm
                                formId={form.id}
                                isCreate={isCreate}
                                isEdit={isEdit}
                                isEpi={isEpi}
                                formsState={formsState}
                                setFormsState={setFormsState}
                                formDataState={formDataState}
                                setFormDataState={setFormDataState}
                              />
                            </TabContent>
                          </TabPanel>
                        ))
                        : null)
                    }
                    
                    

                    { }
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
    perQuestions: T.object,
    perForm: T.object,
    nsDropdownItems: T.array,
    _getAssessmentTypes: T.func,
    _getPerQuestions: T.func,
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
  perQuestions: state.perQuestions,
  perForm: state.perForm,
  groupedPerQuestions: formQuestionsSelector(state),
  nsDropdownItems: nsDropdownSelector(state)
});

const dispatcher = (dispatch) => ({
  _getAssessmentTypes: () => dispatch(getAssessmentTypes()),
  _getPerAreas: (...args) => dispatch(getPerAreas(...args)),
  _getPerQuestions: (...args) => dispatch(getPerQuestions(...args)),
  _getPerOverviewFormStrict: (...args) => dispatch(getPerOverviewFormStrict(...args)),
  _getPerForms: (...args) => dispatch(getPerForms(...args)),
  _createPerOverview: (payload) => dispatch(createPerOverview(payload)),
  _updatePerOverview: (payload) => dispatch(updatePerOverview(payload)),
  _deletePerOverview: (payload) => dispatch(deletePerOverview(payload)),
  _resetPerState: () => dispatch(resetPerState()),
});

export default connect(selector, dispatcher)(PerAssessment);

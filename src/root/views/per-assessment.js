import React, { useContext, useMemo, useState, useEffect, useReducer, useCallback } from 'react';
import { connect } from 'react-redux';
import { environment } from '#config';
import { PropTypes as T } from 'prop-types';
import memoize from "fast-memoize";

import LanguageContext from '#root/languageContext';
import Translate from '#components/Translate';

import App from './app';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import TabContent from '#components/tab-content';
import ConfirmModal from '#components/confirm-modal';
// import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import PerForm from '#components/per-forms/per-form';
import PerOverview from '#components/per-forms/per-overview';
import { showAlert } from '#components/system-alerts';
import { FormError } from '#components/form-elements/';
import { produce } from 'immer';

import {
  getAssessmentTypes,
  getPerAreas,
  getPerQuestions,
  getPerOverviewFormStrict,
  getPerForms,
  getLatestCountryOverview,
  createPerOverview,
  updatePerOverview,
  deletePerOverview,
  updatePerForms,
  resetPerState
} from '#actions';
import { formQuestionsSelector, nsDropdownSelector } from '#selectors';
import { showGlobalLoading, hideGlobalLoading } from '#components/global-loading';

import Ajv from 'ajv';
import ajvKeywords from 'ajv-keywords';
import overviewSchemaDef from '../schemas/per-overview';
import _cloneDeep from 'lodash.clonedeep';

const ajv = new Ajv({ $data: true, allErrors: true, errorDataPath: 'property' });
ajvKeywords(ajv);
let overviewValidator = ajv.compile(overviewSchemaDef);

function PerAssessment (props) {
  const { strings } = useContext(LanguageContext);
  const [overviewState, setOverviewState] = useState({
    branches_involved: '',
    date_of_mid_term_review: '',
    date_of_next_asmt: '',  
    facilitator_name: '',
    facilitator_email: '',
    facilitator_phone: '',
    facilitator_contact: '',
    is_epi: 'false',
    is_finalized: false,
    method_asmt_used: '',    
    ns_focal_point_name: '',
    ns_focal_point_email: '',
    ns_focal_point_phone: '',
    other_consideration: '',
    partner_focal_point_name: '',
    partner_focal_point_email: '',
    partner_focal_point_phone: '',
    partner_focal_point_organization: '',
    user_id: props.user.id
  });

  const initReducer = data => data;

  function formDataReducer (prevState, { type, formId, question, value}) {
    switch (type) {
      case 'radio' : {
        return produce(prevState, draft => {
          draft[formId][question.id].selected_answer = value;
        });
      }
      case 'notes': {
        return produce(prevState, draft => {
          draft[formId][question.id].notes = value;
        });
      }
      case 'reset':
        return initReducer(value);
    }
  }

  function formCommentsReducer (prevState, { type, formId, value }) {
    switch (type) {
      case 'update': {
        return produce(prevState, draft => {
          draft[formId] = value;
        });
      }
      case 'reset': {
        return initReducer(value);
      }
    }
  }

  const [formsState, setFormsState] = useState();
  const [formCommentsState, setFormCommentsState] = useReducer(formCommentsReducer, {}, initReducer);
  const [formDataState, setFormDataState] = useReducer(formDataReducer, {}, initReducer);
  const [origCountry, setOrigCountry] = useState(1);
  const [modalReveal, setModalReveal] = useState(false);
  const [errors, setErrors] = useState();
  const idFromPath = props.match.params.id;
  const isEdit = !!props.isEdit;
  const isCreate = !!props.isCreate;
  const {
    _getAssessmentTypes,
    _getPerAreas,
    _getPerQuestions,
    _getPerOverviewFormStrict,
    _getPerForms,
    _getLatestCountryOverview,
    _createPerOverview,
    _updatePerOverview,
    _updatePerForms,
    _resetPerState
  } = props;

  function handleTabChange (index) {
    const tabHashArray = tabs.map(({ hash }) => hash);
    const url = props.location.pathname;
    props.history.replace(`${url}${tabHashArray[index]}`);
  }

  const handlePerFormInputChange = useCallback(
    memoize(function (formId, question, isRadio, isFormVal = false) {
      return (e) => {
        if (isFormVal) {
          setFormCommentsState({
            type: 'update',
            formId,
            value: e.target.value
          });
        } else {
          if (isRadio) {
            setFormDataState({ type: 'radio', formId, question, value: e.target.value });
          } else {
            setFormDataState({ type: 'notes', formId, question, value: e.target.value });
          }
        }
      };
    })
  , []);

  const saveForms = useCallback((e, isSubmit = false) => {
    if (e) {
      e.preventDefault();
    }

    // Validate fields
    overviewValidator(overviewState);
    setErrors(_cloneDeep(overviewValidator.errors));

    if (overviewValidator.errors === null) {
      showGlobalLoading();
      if (isCreate) {
        _createPerOverview({
          ...overviewState,
          is_epi: overviewState.is_epi === 'true'
        });
      } else {
        _updatePerOverview({
          ...overviewState,
          is_epi: overviewState.is_epi === 'true',
          is_finalized: isSubmit
        });

        // Omit the original form_data from Forms because we don't need that
        // on POST, also makes the request way smaller
        let omittedFormData = {};
        for (const [formId, form] of Object.entries(formsState)) {
          const { form_data, ...restOfForm } = form;
          restOfForm.comment = formCommentsState[formId];
          omittedFormData[formId] = restOfForm;
        }
        
        _updatePerForms({
          forms: omittedFormData,
          forms_data: formDataState
        });
      }
    }
  }, [
    _createPerOverview,
    _updatePerOverview,
    _updatePerForms,
    formCommentsState,
    formDataState,
    formsState,
    overviewState,
    isCreate
  ]);

  const handleSubmitOk = useCallback((isOk) => {
    if (isOk) {
      saveForms(null, true);
    }
    setModalReveal(false);
  }, [saveForms]);

  // Editable if Overview is not finalized, /edit path, or isCreate
  const editable = useMemo(() => {
    let isedit = false;
    if (isCreate) {
      isedit = true;
    } else {
      const ov = props.perForm.getPerOverviewForm;
      if (idFromPath && !ov.fetching && ov.fetched && ov.data) {
        isedit = !ov.data.results[0].is_finalized && isEdit;
      }
    }
    return isedit;
  }, [isCreate, isEdit, idFromPath, props.perForm.getPerOverviewForm]);

  useEffect(() => {
    if (!props.perAreas || (!props.perAreas.fetched && !props.perAreas.fetching)) {
      _getPerAreas();
    }
  }, [_getPerAreas, props.perAreas]);

  useEffect(() => {
    const ats = props.perForm.assessmentTypes;
    if (!ats || (!ats.fetched && !ats.fetching)) {
      _getAssessmentTypes();
    }
  }, [_getAssessmentTypes, props.perForm.assessmentTypes]);

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

  // Triggers on create, update actions
  useEffect(() => {
    const cpo = props.perForm.createPerOverview;
    if (!cpo.fetching && cpo.fetched && cpo.data) {
      if (cpo.data.status === 'ok') {
        showAlert('success', <p><Translate stringId="perOverviewAlertCreated" /></p>, true, 2000);
        setTimeout(() => props.history.push(`/per-assessment/${cpo.data.overview_id}/edit#overview`), 2000);
        // _resetPerState();
      } else if (cpo.error) {
        showAlert('danger', <p><Translate stringId="perOverviewAlertCreated" /></p>, true, 2000);
      }
    }
  }, [props.perForm.createPerOverview, _resetPerState, props.history]);
  useEffect(() => {
    const upo = props.perForm.updatePerOverview;
    const umpf = props.perForm.updateMultiplePerForms;
    if (!upo.fetching && upo.fetched && upo.data && !umpf.fetching && umpf.fetched && umpf.data) {
      if (umpf.error) {
        showAlert('danger', <p>{umpf.error.error_message}</p>, true, 2000);
      } else if (umpf.data.status === 'ok') {
        showAlert('success', <p><Translate stringId="perFormsAlertUpdatedNoRedirect" /></p>, true, 2000);
      }

      if (upo.error) {
        showAlert('danger', <p>{upo.error.error_message}</p>, true, 2000);
      } else if (upo.data.status === 'ok') {
        if (upo.data.is_finalized) {
          showAlert('success', <p><Translate stringId="perOverviewAlertUpdated" /></p>, true, 2000);
          setTimeout(() => props.history.push('/account#per-forms'), 2000);
          _resetPerState();
        } else {
          showAlert('success', <p><Translate stringId="perOverviewAlertUpdatedNoRedirect" /></p>, true, 2000);
        }
      }
    }
  }, [props.perForm.updatePerOverview, props.perForm.updateMultiplePerForms, _resetPerState, props.history]);

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

  const assessmentTypes = useMemo(() => {
    const ats = props.perForm.assessmentTypes;
    if (ats.data && !ats.fetching && ats.fetched) {
      return ats.data.results.map(res => ({ value: res.id, label: res.name }));
    }
    return [];
  }, [props.perForm.assessmentTypes]);

  useEffect(() => {
    const overviews = props.perForm.getPerOverviewForm;
    const upo = props.perForm.updatePerOverview;
    const umpf = props.perForm.updateMultiplePerForms;
    if (!isCreate
      && !overviews.fetching
      && overviews.fetched
      && overviews.data
      && !formsFetching
      && formsFetched
      && formsData
      && formDataState
      && props.groupedPerQuestions
      && !upo.fetching
      && !umpf.fetching) {
      hideGlobalLoading();
    }
  }, [
    isCreate,
    formsFetching,
    formsFetched,
    formsData,
    formDataState,
    props.perForm.getPerOverviewForm,
    props.groupedPerQuestions,
    props.perForm.updatePerOverview,
    props.perForm.updateMultiplePerForms
  ]);

  useEffect(() => {
    const of = props.perForm.getPerOverviewForm;
    // Checking for 'id' so this doesn't overwrite the state again
    // on changing tabs back and forth
    if (!isCreate && !overviewState.id && of.data && !of.fetching && of.fetched) {
      const res = of.data.results[0];
      setOrigCountry(res.country?.id);
      setOverviewState({
        assessment_number: res.assessment_number,
        branches_involved: res.branches_involved,
        country_id: res.country?.id,
        date_of_assessment: res.date_of_assessment?.substring(0, 10),
        date_of_mid_term_review: res.date_of_mid_term_review?.substring(0, 10),
        date_of_next_asmt: res.date_of_next_asmt?.substring(0, 10),
        facilitator_name: res.facilitator_name,
        facilitator_email: res.facilitator_email,
        facilitator_phone: res.facilitator_phone,
        facilitator_contact: res.facilitator_contact,
        id: res.id,
        is_epi: res.is_epi ? 'true' : 'false',
        is_finalized: res.is_finalized,
        method_asmt_used: res.method_asmt_used,
        ns_focal_point_name: res.ns_focal_point_name,
        ns_focal_point_email: res.ns_focal_point_email,
        ns_focal_point_phone: res.ns_focal_point_phone,
        other_consideration: res.other_consideration,
        partner_focal_point_name: res.partner_focal_point_name,
        partner_focal_point_email: res.partner_focal_point_email,
        partner_focal_point_phone: res.partner_focal_point_phone,
        partner_focal_point_organization: res.partner_focal_point_organization,
        type_of_assessment: res.type_of_assessment?.id,
        user_id: props.user.id
      });
    }
  }, [props.perForm.getPerOverviewForm, props.user, isCreate, overviewState, setOverviewState]);

  // If Country changes, get the latest Overview for that one
  useEffect(() => {
    if (overviewState.country_id) {
      _getLatestCountryOverview(overviewState.country_id);
    }
  }, [overviewState.country_id, _getLatestCountryOverview]);

  useEffect(() => {
    if (!isCreate && !formsFetching && formsFetched && formsData) {
      let formsDict = {};
      let formsDataDict = {};
      let commentsDict = {};

      formsData.results.forEach(form => {
        formsDict[form.id] = form;
        commentsDict[form.id] = form.comment;

        let questionsDict = {};
        if (form.form_data) {
          form.form_data.forEach(fd => questionsDict[fd.question_id] = {
            selected_answer: fd.selected_answer?.id.toString(),
            notes: fd.notes
          });
        }
        formsDataDict[form.id] = questionsDict;
      });
      setFormsState(formsDict); // { [formId]: {...form} }
      setFormDataState({ type: 'reset', value: formsDataDict }); // { [formId]: { [questionId]: { ...formData } } }
      setFormCommentsState({ type: 'reset', value: commentsDict }); // { [formId]: comment }
    }
  }, [isCreate, formsFetching, formsFetched, formsData]);

  return (
    <App className='page--per-form'>
      <section className='inpage'>
        <Helmet>
          <title>{strings.perFormTitle}</title>
        </Helmet>
        <header className='per-inpage__header'>
            <div className='text-right'>
              <button
                className={`button button--primary-bounded button--small ${(isCreate || !editable) ? ' per__right_button' : ''}`}
                onClick={() => {
                  _resetPerState();
                  props.history.push('/account#per-forms');
                }}
              >
                <Translate stringId='threeWClose'/>
              </button>
              { !isCreate && editable
                ? (
                    <button
                      className='button button--primary-filled button--small per__right_button'
                      onClick={() => setModalReveal(true)}
                    >
                      <Translate stringId='perAssessmentSubmit'/>
                    </button>
                )
                : null }
            </div>
          <div className='inner'>
            <div className='inpage__headline'>
              <h1 className='inpage__title'>
                <Translate stringId='perAssessmentTitle' />
              </h1>
            </div>
          </div>
        </header>
        <section className='inpage__body'>
          { modalReveal
            ? (
              <ConfirmModal
                title={strings.perAssessmentSubmit}
                message={strings.perAssessmentModalMessage}
                onClose={handleSubmitOk}
                okText={strings.confirmModalConfirm}
              />
            )
            : null }
          <div className='tab__wrap'>
            <Tabs
              selectedIndex={tabs.map(({ hash }) => hash).indexOf(props.location.hash)}
              onSelect={index => handleTabChange(index)}
            >
              { !isCreate && editable
                  ? (
                    <div className='text-right'>
                      <button
                        className='button button--primary-filled button--small per__right_button'
                        onClick={(e) => saveForms(e)}
                      >
                        <Translate stringId='perFormComponentSave'/>
                      </button>
                    </div>
                  )
                  : null }
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
                        overviewState={overviewState}
                        setOverviewState={setOverviewState}
                        assessmentTypes={assessmentTypes}
                        origCountry={origCountry}
                        editable={editable}
                        errors={errors}
                      />
                      { isCreate
                        ? (
                          <div className='container-lg text-center'>
                            <button
                              className='button button--primary-filled button--small'
                              onClick={(e) => saveForms(e)}
                            >
                              <Translate stringId='perOverviewSaveAndContinue'/>
                            </button>

                            { errors
                              ? errors.map(err => (
                                <FormError
                                  key={err.dataPath}
                                  errors={errors}
                                  property={err.dataPath.slice(1)}
                                />
                              ))
                              : null }
                          </div>
                        )
                        : null }
                    </TabContent>
                  </TabPanel>
                  { isCreate
                    // Only render the Overview tab content on Create
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
                              handleChange={handlePerFormInputChange}
                              isCreate={isCreate}
                              isEpi={overviewState.is_epi}
                              editable={editable}
                              formsState={formsState}
                              formDataState={formDataState}
                              formCommentsState={formCommentsState}
                              errors={errors}
                            />
                          </TabContent>
                        </TabPanel>
                      ))
                      : null)
                  }
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
    _updatePerForms: T.func,
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
  _getLatestCountryOverview: (...args) => dispatch(getLatestCountryOverview(...args)),
  _createPerOverview: (payload) => dispatch(createPerOverview(payload)),
  _updatePerOverview: (payload) => dispatch(updatePerOverview(payload)),
  _deletePerOverview: (payload) => dispatch(deletePerOverview(payload)),
  _updatePerForms: (payload) => dispatch(updatePerForms(payload)),
  _resetPerState: () => dispatch(resetPerState())
});

export default connect(selector, dispatcher)(PerAssessment);

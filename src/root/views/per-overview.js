import React, { useContext, useMemo, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { environment } from '#config';
import { PropTypes as T } from 'prop-types';

import LanguageContext from '#root/languageContext';
import Translate from '#components/Translate';

import App from './app';
import Fold from '#components/fold';
import BreadCrumb from '#components/breadcrumb';
import { Helmet } from 'react-helmet';

import {
  getAssessmentTypes,
  getPerOverviewFormStrict,
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

function PerOverview (props) {
  const { strings } = useContext(LanguageContext);
  const [nsState, setNsState] = useState();
  const [overviewState, setOverviewState] = useState({
    approximate_date_next_capacity_assmt: '',
    branch_involved: '',
    country_id: '',
    date_of_current_capacity_assessment: '',
    date_of_last_capacity_assessment: '',
    date_of_mid_term_review: '',
    facilitated_by: '',
    facilitator_email: '',
    focal_point_email: '',
    focal_point_name: '',
    focus: '',
    had_previous_assessment: false,
    phone_number: '',
    skype_address: '',
    type_of_ca: '',
    user_id: props.user.id,
  });
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
        isedi = of.data.results[0].is_draft && isEdit;
      }
    }
    return isedi;
  }, [isEdit, isCreate, props.perForm.getPerOverviewForm]);
  const {
    _getAssessmentTypes,
    _getPerOverviewFormStrict,
    _createPerOverview,
    _updatePerOverview,
    _deletePerOverview,
    _resetPerState
  } = props;

  function fieldChange (e, hasTarget = true, isCheckbox = false, id = '') {
    if (hasTarget) {
      setOverviewState({
        ...overviewState,
        [e.target.id]: !isCheckbox ? e.target.value : e.target.checked
      });
    } else {
      setOverviewState({
        ...overviewState,
        [id]: e.value
      });
    }
  }

  function deleteOverview (e) {
    e.preventDefault();
    _deletePerOverview(props.perForm.getPerOverviewForm.data.results[0].id);
  }

  function submitForm (e, isDraft) {
    e.preventDefault();

    if (isCreate) {
      _createPerOverview({
        ...overviewState,
        is_draft: isDraft,
        country_id: nsState
      });
    } else {
      _updatePerOverview({
        ...overviewState,
        is_draft: isDraft,
        country_id: nsState
      });
    }
  }

  useEffect(() => {
    const cpo = props.perForm.createPerOverview;
    if (!cpo.fetching && cpo.fetched && cpo.data) {
      if (cpo.data.status === 'ok') {
        showAlert('success', <p><Translate stringId="perOverviewAlertCreated" /></p>, true, 2000);
        setTimeout(() => props.history.push(`/account#per-forms`), 2000);
        _resetPerState();
      } else if (cpo.error) {
        showAlert('danger', <p><Translate stringId="perOverviewAlertCreated" /></p>, true, 2000);
      }
    }
    const upo = props.perForm.updatePerOverview;
    if (!upo.fetching && upo.fetched && upo.data) {
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
    props.perForm.deletePerOverview
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
    const of = props.perForm.getPerOverviewForm;
    if (of.data && !of.fetching && of.fetched) {
      const res = of.data.results[0];
      setNsState(res.country?.id);
      setOverviewState({
        approximate_date_next_capacity_assmt: res.approximate_date_next_capacity_assmt?.substring(0, 10),
        branch_involved: res.branch_involved,
        country_id: res.country?.id,
        date_of_current_capacity_assessment: res.date_of_current_capacity_assessment?.substring(0, 10),
        date_of_last_capacity_assessment: res.date_of_last_capacity_assessment?.substring(0, 10),
        date_of_mid_term_review: res.date_of_mid_term_review?.substring(0, 10),
        facilitated_by: res.facilitated_by,
        facilitator_email: res.facilitator_email,
        focal_point_email: res.focal_point_email,
        focal_point_name: res.focal_point_name,
        focus: res.focus,
        had_previous_assessment: res.had_previous_assessment,
        id: res.id,
        is_draft: res.isDraft,
        phone_number: res.phone_number,
        skype_address: res.skype_address,
        type_of_ca: res.type_of_ca?.id,
        user_id: props.user.id
      });
      hideGlobalLoading();
    }
  }, [props.perForm.getPerOverviewForm, props.user]);

  const assessmentTypes = useMemo(() => {
    const ats = props.perForm.assessmentTypes;
    if (ats.data && !ats.fetching && ats.fetched) {
      return ats.data.results.map(res => ({ value: res.id, label: res.name }));
    }
    return [];
  }, [props.perForm.assessmentTypes]);

  const crumbs = [
    {link: props.location.pathname, name: strings.preparednessOverviewCrumb},
    {link: '/account', name: strings.breadCrumbAccount},
    {link: '/', name: strings.breadCrumbHome}
  ];

  return (
    <App className='page--per-form'>
      <section className='inpage'>
        <Helmet>
          <title>{strings.perFormTitle}</title>
        </Helmet>
        <div className='container-mid'>
          <div className='row flex-sm'>
            <div className='col col-6-sm col-7-mid'>
              <BreadCrumb breadcrumbContainerClass='padding-reset' crumbs={ crumbs } />
            </div>
          </div>
          <section className='inpage__body'>
            <div className='inner'>
              <Fold title={strings.perAccountOverview} foldWrapperClass='fold--main' foldTitleClass='margin-reset'>
               <div className='form__group'>
                  <label className='form__label'>
                    <Translate stringId='perAccountChooseCountry' />
                  </label>
                  <Select
                    name='country'
                    value={nsState}
                    onChange={(e) => setNsState(e?.value)}
                    options={props.nsDropdownItems}
                    disabled={!editable}
                  />
                  <FormError
                    errors={[]}
                    property='country'
                  />
                </div>

                <h1><Translate stringId='overviewFormGeneralInfo' /></h1>

                <FormInput
                  label={strings.overviewFormStartDate}
                  type='date'
                  name='date_of_current_capacity_assessment'
                  id='date_of_current_capacity_assessment'
                  value={overviewState.date_of_current_capacity_assessment}
                  classWrapper='form__group'
                  onChange={(e) => fieldChange(e)}
                  disabled={!editable}
                  // description={fields.sitFieldsDate[status].desc}
                >
                  <FormError
                    errors={[]}
                    property='date_of_current_capacity_assessment'
                  />
                </FormInput>
                <div className='form__group'>
                  <label className='form__label'>
                    <Translate stringId='overviewFormTypeCapacityAssessment' />
                  </label>
                  <Select
                    id='type_of_ca'
                    name='type_of_ca'
                    value={overviewState.type_of_ca}
                    onChange={(e) => setOverviewState({ ...overviewState, type_of_ca: e.value })}
                    options={assessmentTypes}
                    disabled={!editable}
                  />
                  <FormError
                    errors={[]}
                    property='type_of_ca'
                  />
                </div>
                <FormInput
                  label={strings.overviewFormBranchInvolved}
                  type='text'
                  name='branch_involved'
                  id='branch_involved'
                  value={overviewState.branch_involved}
                  classWrapper='form__group'
                  onChange={(e) => fieldChange(e)}
                  disabled={!editable}
                  // description={fields.sitFieldsDate[status].desc}
                >
                  <FormError
                    errors={[]}
                    property='branch_involved'
                  />
                </FormInput>
                <FormInput
                  label={strings.overviewFormFocalPoint}
                  type='text'
                  name='focal_point_name'
                  id='focal_point_name'
                  value={overviewState.focal_point_name}
                  classWrapper='form__group'
                  onChange={(e) => fieldChange(e)}
                  disabled={!editable}
                  // description={fields.sitFieldsDate[status].desc}
                >
                  <FormError
                    errors={[]}
                    property='focal_point_name'
                  />
                </FormInput>
                <FormInput
                  label={strings.overviewFormFocalPointEmail}
                  type='text'
                  name='focal_point_email'
                  id='focal_point_email'
                  value={overviewState.focal_point_email}
                  classWrapper='form__group'
                  onChange={(e) => fieldChange(e)}
                  disabled={!editable}
                  // description={fields.sitFieldsDate[status].desc}
                >
                  <FormError
                    errors={[]}
                    property='focal_point_email'
                  />
                </FormInput>
                <FormInput
                  label={strings.overviewFormFocus}
                  type='text'
                  name='focus'
                  id='focus'
                  value={overviewState.focus}
                  classWrapper='form__group'
                  onChange={(e) => fieldChange(e)}
                  disabled={!editable}
                  // description={fields.sitFieldsDate[status].desc}
                >
                  <FormError
                    errors={[]}
                    property='focus'
                  />
                </FormInput>
                <div className='form__group'>
                  <FormCheckbox
                    label={strings.overviewFormPreviousPer}
                    name='had_previous_assessment'
                    id='had_previous_assessment'
                    checked={overviewState.had_previous_assessment}
                    onChange={(e) => fieldChange(e, true, true)}
                    disabled={!editable}
                  />
                  <FormError
                    errors={[]}
                    property='date_of_last_capacity_assessment'
                  />
                </div>
                <FormInput
                  label={strings.overviewFormDateOfLastAssessment}
                  type='date'
                  name='date_of_last_capacity_assessment'
                  id='date_of_last_capacity_assessment'
                  value={overviewState.date_of_last_capacity_assessment}
                  classWrapper='form__group'
                  onChange={(e) => fieldChange(e)}
                  disabled={!editable}
                  // description={fields.sitFieldsDate[status].desc}
                >
                  <FormError
                    errors={[]}
                    property='date_of_last_capacity_assessment'
                  />
                </FormInput>

                <h1><Translate stringId='overviewFormFacilitatorInfo' /></h1>

                <FormInput
                  label={strings.overviewFormNameLeadFacilitator}
                  type='text'
                  name='facilitated_by'
                  id='facilitated_by'
                  value={overviewState.facilitated_by}
                  classWrapper='form__group'
                  onChange={(e) => fieldChange(e)}
                  disabled={!editable}
                  // description={fields.sitFieldsDate[status].desc}
                >
                  <FormError
                    errors={[]}
                    property='facilitated_by'
                  />
                </FormInput>
                <FormInput
                  label={strings.overviewFormEmail}
                  type='text'
                  name='facilitator_email'
                  id='facilitator_email'
                  value={overviewState.facilitator_email}
                  classWrapper='form__group'
                  onChange={(e) => fieldChange(e)}
                  disabled={!editable}
                  // description={fields.sitFieldsDate[status].desc}
                >
                  <FormError
                    errors={[]}
                    property='facilitator_email'
                  />
                </FormInput>
                <FormInput
                  label={strings.overviewFormPhoneNumber}
                  type='text'
                  name='phone_number'
                  id='phone_number'
                  value={overviewState.phone_number}
                  classWrapper='form__group'
                  onChange={(e) => fieldChange(e)}
                  disabled={!editable}
                  // description={fields.sitFieldsDate[status].desc}
                >
                  <FormError
                    errors={[]}
                    property='phone_number'
                  />
                </FormInput>
                <FormInput
                  label={strings.overviewFormSkype}
                  type='text'
                  name='skype_address'
                  id='skype_address'
                  value={overviewState.skype_address}
                  classWrapper='form__group'
                  onChange={(e) => fieldChange(e)}
                  disabled={!editable}
                  // description={fields.sitFieldsDate[status].desc}
                >
                  <FormError
                    errors={[]}
                    property='skype_address'
                  />
                </FormInput>
                <FormInput
                  label={strings.overviewFormDateOfMidReview}
                  type='date'
                  name='date_of_mid_term_review'
                  id='date_of_mid_term_review'
                  value={overviewState.date_of_mid_term_review}
                  classWrapper='form__group'
                  onChange={(e) => fieldChange(e)}
                  disabled={!editable}
                  // description={fields.sitFieldsDate[status].desc}
                >
                  <FormError
                    errors={[]}
                    property='date_of_mid_term_review'
                  />
                </FormInput>
                <FormInput
                  label={strings.overviewFormDateOfNext}
                  type='date'
                  name='approximate_date_next_capacity_assmt'
                  id='approximate_date_next_capacity_assmt'
                  value={overviewState.approximate_date_next_capacity_assmt}
                  classWrapper='form__group'
                  onChange={(e) => fieldChange(e)}
                  disabled={!editable}
                  // description={fields.sitFieldsDate[status].desc}
                >
                  <FormError
                    errors={[]}
                    property='approximate_date_next_capacity_assmt'
                  />
                </FormInput>

                { editable
                  ? (
                    <React.Fragment>
                      <h4><Translate stringId='overviewFormDraftInfo' /></h4>
                      <button
                        className='button button--medium button--primary-filled per__form__button'
                        onClick={(e) => submitForm(e, false)}
                      >
                        <Translate stringId='perFormComponentSubmitForm'/>
                      </button>
                      <button
                        className='button button--medium button--secondary-filled per__form__button'
                        onClick={(e) => submitForm(e, true)}
                      >
                        <Translate stringId='perFormComponentSave'/>
                      </button>

                    { !isCreate
                      ? (
                        <a
                          className='link-underline per__delete_button'
                          onClick={(e) => deleteOverview(e)}
                        >
                          <Translate stringId='perDraftDelete' />
                        </a>
                      )
                      : null }
                    </React.Fragment>
                  )
                  : null }
              </Fold>
            </div>
          </section>
        </div>
      </section>
    </App>
  );
}

if (environment !== 'production') {
  PerOverview.propTypes = {
    user: T.object,
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
  perForm: state.perForm,
  nsDropdownItems: nsDropdownSelector(state)
});

const dispatcher = (dispatch) => ({
  _getAssessmentTypes: () => dispatch(getAssessmentTypes()),
  _getPerOverviewFormStrict: (...args) => dispatch(getPerOverviewFormStrict(...args)),
  _createPerOverview: (payload) => dispatch(createPerOverview(payload)),
  _updatePerOverview: (payload) => dispatch(updatePerOverview(payload)),
  _deletePerOverview: (payload) => dispatch(deletePerOverview(payload)),
  _resetPerState: () => dispatch(resetPerState()),
});

export default connect(selector, dispatcher)(PerOverview);

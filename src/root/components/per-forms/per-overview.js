import React, { useContext, useMemo, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { environment } from '#config';
import { PropTypes as T } from 'prop-types';

import LanguageContext from '#root/languageContext';
import Translate from '#components/Translate';

import Fold from '#components/fold';
import PerAreaCards from '#components/per-forms/per-area-cards.js';
// import { Link } from 'react-router-dom';

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
import { showAlert } from '#components/system-alerts';

function PerOverview (props) {
  const { strings } = useContext(LanguageContext);
  const [nsState, setNsState] = useState();
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
    is_epi: '',
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
    user_id: props.user.id,
  });
  // console.log(props);
  // const idFromPath = props.match.params.id;
  const idFromPath = null;
  const isEdit = !!props.isEdit;
  const isCreate = !!props.isCreate;
  const editable = useMemo(() => {
    return true; // FIXME: only for testing
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

  function submitForm (e) {
    e.preventDefault();

    if (isCreate) {
      _createPerOverview({
        ...overviewState,
        country_id: nsState
      });
    } else {
      _updatePerOverview({
        ...overviewState,
        country_id: nsState
      });
    }
  }

  // Get PER Areas and fill up the links array with them
  useEffect(() => {
    _getPerAreas();
  }, [_getPerAreas]);

  const formAreas = useMemo(() => {
    const pfs = props.perForm.getPerForms;
    if (!pfs.fetching && pfs.fetched && pfs.data) {
      return pfs.data.results.map(form => ({
        link: `/per-form/${form.id}`,
        title: `${strings.perdocumentArea} ${form.area.area_num}`,
        subtitle: form.area.title
      }));
    } else if (isCreate && !props.perAreas.fetching && props.perAreas.fetched && props.perAreas.data) {
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
    }
  }, [_getPerOverviewFormStrict, idFromPath]);

  useEffect(() => {
    if (idFromPath) {
      _getPerForms(null, idFromPath);
    }
  }, [_getPerForms, idFromPath]);

  useEffect(() => {
    const of = props.perForm.getPerOverviewForm;
    if (!isCreate && of.data && !of.fetching && of.fetched) {
      const res = of.data.results[0];
      setNsState(res.country?.id);
      setOverviewState({
        branches_involved: res.branch_involved,
        country_id: res.country?.id,
        date_of_assessment: res.date_of_assessment?.substring(0, 10),
        date_of_mid_term_review: res.date_of_mid_term_review?.substring(0, 10),
        date_of_next_asmt: res.date_of_next_asmt?.substring(0, 10),
        facilitator_name: res.facilitator_name,
        facilitator_email: res.facilitator_email,
        facilitator_phone: res.facilitator_phone,
        facilitator_contact: res.facilitator_contact,
        id: res.id,
        is_epi: res.is_epi,
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
  }, [props.perForm.getPerOverviewForm, props.user, isCreate]);

  const assessmentTypes = useMemo(() => {
    const ats = props.perForm.assessmentTypes;
    if (ats.data && !ats.fetching && ats.fetched) {
      return ats.data.results.map(res => ({ value: res.id, label: res.name }));
    }
    return [];
  }, [props.perForm.assessmentTypes]);

  return (
    <section className='inpage__body'>
      <div className='inner'>
        <Fold title={strings.perAccountOverview} foldWrapperClass='fold--main' foldTitleClass='margin-reset'>
          <h3><Translate stringId='perOverviewHeaderCurrent' /></h3>
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

          <FormInput
            label={strings.overviewFormStartDate}
            type='date'
            name='date_of_assessment'
            id='date_of_assessment'
            value={overviewState.date_of_assessment}
            classWrapper='form__group'
            onChange={(e) => fieldChange(e)}
            disabled={!editable}
            // description={fields.sitFieldsDate[status].desc}
          >
            <FormError
              errors={[]}
              property='date_of_assessment'
            />
          </FormInput>
          <div className='form__group'>
            <label className='form__label'>
              <Translate stringId='overviewFormTypeCapacityAssessment' />
            </label>
            <Select
              id='type_of_assessment'
              name='type_of_assessment'
              value={overviewState.type_of_assessment}
              onChange={(e) => setOverviewState({ ...overviewState, type_of_assessment: e.value })}
              options={assessmentTypes}
              disabled={!editable}
            />
            <FormError
              errors={[]}
              property='type_of_assessment'
            />
          </div>

          <div>TODO: assessment Number</div>

          <FormInput
            label={strings.overviewFormBranchInvolved}
            type='text'
            name='branches_involved'
            id='branches_involved'
            value={overviewState.branches_involved}
            classWrapper='form__group'
            onChange={(e) => fieldChange(e)}
            disabled={!editable}
            // description={fields.sitFieldsDate[status].desc}
          >
            <FormError
              errors={[]}
              property='branches_involved'
            />
          </FormInput>
          <FormInput
            label={'What method has this assessment used'} // TODO: lang.js
            type='text'
            name='method_asmt_used'
            id='method_asmt_used'
            value={overviewState.method_asmt_used}
            classWrapper='form__group'
            onChange={(e) => fieldChange(e)}
            disabled={!editable}
            // description={fields.sitFieldsDate[status].desc}
          >
            <FormError
              errors={[]}
              property='method_asmt_used'
            />
          </FormInput>
          <div className='form__group'>
            <FormCheckbox
              label={strings.overviewFormIsEPI}
              name='is_epi'
              id='is_epi'
              checked={overviewState.is_epi}
              onChange={(e) => fieldChange(e, true, true)}
              disabled={!editable}
            />
            <FormError
              errors={[]}
              property='is_epi'
            />
          </div>
          
          <h3><Translate stringId='perOverviewHeaderPrevious' /></h3>
          <div>TODO: Previous assessment Date</div>
          <div>TODO: Previous assessment Type</div>

          <h3><Translate stringId='perOverviewHeaderReviews' /></h3>
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
            name='date_of_next_asmt'
            id='date_of_next_asmt'
            value={overviewState.date_of_next_asmt}
            classWrapper='form__group'
            onChange={(e) => fieldChange(e)}
            disabled={!editable}
            // description={fields.sitFieldsDate[status].desc}
          >
            <FormError
              errors={[]}
              property='date_of_next_asmt'
            />
          </FormInput>

          <h3><Translate stringId='perOverviewHeaderContact' /></h3>
          <FormInput
            label={strings.overviewFormFocalPoint}
            type='text'
            name='ns_focal_point_name'
            id='ns_focal_point_name'
            value={overviewState.ns_focal_point_name}
            classWrapper='form__group'
            onChange={(e) => fieldChange(e)}
            disabled={!editable}
            // description={fields.sitFieldsDate[status].desc}
          >
            <FormError
              errors={[]}
              property='ns_focal_point_name'
            />
          </FormInput>
          <FormInput
            label={strings.overviewFormFocalPointEmail}
            type='text'
            name='ns_focal_point_email'
            id='ns_focal_point_email'
            value={overviewState.ns_focal_point_email}
            classWrapper='form__group'
            onChange={(e) => fieldChange(e)}
            disabled={!editable}
            // description={fields.sitFieldsDate[status].desc}
          >
            <FormError
              errors={[]}
              property='ns_focal_point_email'
            />
          </FormInput>
          <FormInput
            label={strings.overviewFormPartnerFocalPoint}
            type='text'
            name='ns_focal_point_phone'
            id='ns_focal_point_phone'
            value={overviewState.ns_focal_point_phone}
            classWrapper='form__group'
            onChange={(e) => fieldChange(e)}
            disabled={!editable}
            // description={fields.sitFieldsDate[status].desc}
          >
            <FormError
              errors={[]}
              property='ns_focal_point_phone'
            />
          </FormInput>

          <FormInput
            label={strings.overviewFormPartnerFocalPoint}
            type='text'
            name='partner_focal_point_name'
            id='partner_focal_point_name'
            value={overviewState.partner_focal_point_name}
            classWrapper='form__group'
            onChange={(e) => fieldChange(e)}
            disabled={!editable}
            // description={fields.sitFieldsDate[status].desc}
          >
            <FormError
              errors={[]}
              property='partner_focal_point_name'
            />
          </FormInput>
          <FormInput
            label={strings.overviewFormPartnerFocalPointEmail}
            type='text'
            name='partner_focal_point_email'
            id='partner_focal_point_email'
            value={overviewState.partner_focal_point_email}
            classWrapper='form__group'
            onChange={(e) => fieldChange(e)}
            disabled={!editable}
            // description={fields.sitFieldsDate[status].desc}
          >
            <FormError
              errors={[]}
              property='partner_focal_point_email'
            />
          </FormInput>
          <FormInput
            label={strings.overviewFormPartnerFocalPointPhone}
            type='text'
            name='partner_focal_point_phone'
            id='partner_focal_point_phone'
            value={overviewState.partner_focal_point_phone}
            classWrapper='form__group'
            onChange={(e) => fieldChange(e)}
            disabled={!editable}
            // description={fields.sitFieldsDate[status].desc}
          >
            <FormError
              errors={[]}
              property='partner_focal_point_phone'
            />
          </FormInput>
          <FormInput
            label={strings.overviewFormPartnerFocalPointOrganization}
            type='text'
            name='partner_focal_point_organization'
            id='partner_focal_point_organization'
            value={overviewState.partner_focal_point_organization}
            classWrapper='form__group'
            onChange={(e) => fieldChange(e)}
            disabled={!editable}
            // description={fields.sitFieldsDate[status].desc}
          >
            <FormError
              errors={[]}
              property='partner_focal_point_organization'
            />
          </FormInput>

          <FormInput
            label={strings.overviewFormFacilitatorName}
            type='text'
            name='facilitator_name'
            id='facilitator_name'
            value={overviewState.facilitator_name}
            classWrapper='form__group'
            onChange={(e) => fieldChange(e)}
            disabled={!editable}
            // description={fields.sitFieldsDate[status].desc}
          >
            <FormError
              errors={[]}
              property='facilitator_name'
            />
          </FormInput>
          <FormInput
            label={strings.overviewFormFacilitatorEmail}
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
            label={strings.overviewFormFacilitatorPhone}
            type='text'
            name='facilitator_phone'
            id='facilitator_phone'
            value={overviewState.facilitator_phone}
            classWrapper='form__group'
            onChange={(e) => fieldChange(e)}
            disabled={!editable}
            // description={fields.sitFieldsDate[status].desc}
          >
            <FormError
              errors={[]}
              property='facilitator_phone'
            />
          </FormInput>
          <FormInput
            label={strings.overviewFormFacilitatorContact}
            type='text'
            name='facilitator_contact'
            id='facilitator_contact'
            value={overviewState.facilitator_contact}
            classWrapper='form__group'
            onChange={(e) => fieldChange(e)}
            disabled={!editable}
            // description={fields.sitFieldsDate[status].desc}
          >
            <FormError
              errors={[]}
              property='facilitator_contact'
            />
          </FormInput>

          

          {/*{ !isCreate
            ? (
              <div className='form__group'>
                <FormCheckbox
                  label={strings.overviewFormFinalized}
                  name='is_finalized'
                  id='is_finalized'
                  checked={overviewState.is_finalized}
                  onChange={(e) => fieldChange(e, true, true)}
                  disabled={!editable}
                />
                <FormError
                  errors={[]}
                  property='is_finalized'
                />
              </div>
            )
            : null }
          */}

          {/* TODO: revisit editable */}
          { editable
            ? (
              <React.Fragment>
                <button
                  className='button button--medium button--primary-filled per__form__button'
                  onClick={(e) => submitForm(e)}
                >
                  <Translate stringId={`${isCreate ? 'perFormComponentCreate' : 'perFormComponentSave'}`}/>
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
  );
}

if (environment !== 'production') {
  PerOverview.propTypes = {
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

export default connect(selector, dispatcher)(PerOverview);

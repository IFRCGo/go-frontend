import React, { useContext, useMemo, useState } from 'react';
import { connect } from 'react-redux';
import { environment } from '#config';
import { PropTypes as T } from 'prop-types';
import { Link } from 'react-router-dom';
import { regionsByIdSelector } from '../selectors';

import LanguageContext from '#root/languageContext';
import Translate from '#components/Translate';

import App from './app';
import Fold from '#components/fold';
import BreadCrumb from '#components/breadcrumb';
import { Helmet } from 'react-helmet';

import {
  FormInput,
  FormCheckbox,
  FormError
} from '#components/form-elements/';
import Select from 'react-select';

function PerOverview (props) {
  const { strings } = useContext(LanguageContext);
  const [overviewState, setOverviewState] = useState({
    country_id: '',
    user_id: props.user.id,
    date_of_current_capacity_assessment: '',
    date_of_last_capacity_assessment: '',
    type_of_capacity_assessment: '',
    branch_involved: '',
    focal_point_name: '',
    focal_point_email: '',
    had_previous_assessment: false,
    focus: '',
    facilitated_by: '',
    facilitator_email: '',
    phone_number: '',
    skype_address: '',
    date_of_mid_term_review: '',
    approximate_date_next_capacity_assmt: '',
    is_draft: true
  });
  const idFromPath = props.match.params.id;
  const editable = !!props.editable;
  console.log(props);

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

  function submitForm (e, isDraft) {
    e.preventDefault();

    // if (formIdFromPath) {
    //   _editPerForm({
    //     'id': formIdFromPath,
    //     'user_id': props.user.id,
    //     'country_id': nsState,
    //     'is_draft': isDraft,
    //     'area_id': areaIdFromPath || areaId,
    //     'area_num': areaNum,
    //     'questions': questionsState
    //   });
    // } else {
    //   _createPerForm({
    //     'user_id': props.user.id,
    //     'country_id': nsState,
    //     'is_draft': isDraft,
    //     'area_id': areaIdFromPath || areaId,
    //     'area_num': areaNum,
    //     'questions': questionsState
    //   });
    // }
  }

  const crumbs = [
    {link: props.location.pathname, name: strings.preparednessOverviewCrumb},
    {link: '/account', name: strings.breadCrumbAccount},
    {link: '/', name: strings.breadCrumbHome}
  ];

  console.log(overviewState);

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
                <h1><Translate stringId='overviewFormGeneralInfo' /></h1>

                <FormInput
                  label={strings.overviewFormStartDate}
                  type='date'
                  name='date_of_current_capacity_assessment'
                  id='date_of_current_capacity_assessment'
                  value={overviewState.date_of_current_capacity_assessment}
                  classWrapper='form__group'
                  onChange={(e) => fieldChange(e)}
                  // description={fields.sitFieldsDate[status].desc}
                >
                  <FormError
                    errors={[]}
                    property='date_of_current_capacity_assessment'
                  />
                </FormInput>
                {/* TODO: select, type of capacity */}
                <FormInput
                  label={strings.overviewFormBranchInvolved}
                  type='text'
                  name='branch_involved'
                  id='branch_involved'
                  value={overviewState.branch_involved}
                  classWrapper='form__group'
                  onChange={(e) => fieldChange(e)}
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
                  // description={fields.sitFieldsDate[status].desc}
                >
                  <FormError
                    errors={[]}
                    property='focus'
                  />
                </FormInput>
                {/* TODO: select have you had? */}
                <div className='form__group'>
                  <FormCheckbox
                    label={strings.overviewFormPreviousPer}
                    name='had_previous_assessment'
                    id='had_previous_assessment'
                    checked={overviewState.had_previous_assessment}
                    onChange={(e) => fieldChange(e, true, true)}
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
    perForms: T.object,
    perAreas: T.object,
    perOverviewForm: T.object,
    regionsById: T.object
  };
}

const selector = (state, ownProps) => ({
  user: state.user.data,
  perForms: state.perForm.getPerForms,
  perAreas: state.perAreas,
  perOverviewForm: state.perForm.getPerOverviewForm,
  regionsById: regionsByIdSelector(state),
});

const dispatcher = (dispatch) => ({
  // _getPerCountries: (...args) => dispatch(getPerCountries(...args)),
  // _getPerForms: (...args) => dispatch(getPerForms(...args)),
  // _getPerOverviewForm: (...args) => dispatch(getPerOverviewForm(...args))
});

export default connect(selector, dispatcher)(PerOverview);

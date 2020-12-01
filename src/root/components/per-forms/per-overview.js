import React, { useContext, useMemo, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { environment } from '#config';
import { PropTypes as T } from 'prop-types';

import LanguageContext from '#root/languageContext';
import Translate from '#components/Translate';

import { isoDate } from '#utils/format';

import {
  getLatestCountryOverview
} from '#actions';
import { nsDropdownSelector } from '#selectors';

import {
  FormInput,
  FormRadioGroup,
  FormError
} from '#components/form-elements/';
import Select from 'react-select';

function PerOverview (props) {
  const { strings } = useContext(LanguageContext);
  const [origCountry, setOrigCountry] = useState(1);
  const [prevOverviewState, setPrevOverviewState] = useState({
    assessment_number: null,
    date_of_assessment: null,
    type_of_assessment: null
  });

  const {
    assessmentTypes,
    overviewState,
    setOverviewState,
    _getLatestCountryOverview,
    editable
  } = props;
  const isCreate = !!props.isCreate;

  function handleChange (e, hasTarget = true, isCheckbox = false, isRadio = false, id = '') {
    if (hasTarget) {
      setOverviewState({
        ...overviewState,
        [isRadio ? e.target.name : e.target.id]: !isCheckbox ? e.target.value : e.target.checked
      });
    } else {
      setOverviewState({
        ...overviewState,
        [id]: e?.value || null
      });
    }
  }

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
  // FIXME: every tab change triggers a get...
  useEffect(() => {
    if (overviewState.country_id) {
      _getLatestCountryOverview(overviewState.country_id);
    }
  }, [overviewState.country_id, _getLatestCountryOverview]);

  // Set the Latest Overview's data
  useEffect(() => {
    if (!overviewState.country_id) {
      setPrevOverviewState({
        assessment_number: null,
        date_of_assessment: null,
        type_of_assessment: null
      });
    } else if (!props.perLatestOverview.fetching && props.perLatestOverview.fetched && !props.perLatestOverview.error) {
      setPrevOverviewState(props.perLatestOverview.data?.results[0]);
    }
  }, [overviewState.country_id, props.perLatestOverview]);

  const assessment_number = useMemo(() => {
    if (overviewState.country_id !== origCountry) {
      return prevOverviewState?.assessment_number + 1 || 1;
    }
    return overviewState.assessment_number;
  }, [origCountry, overviewState, prevOverviewState]);

  return (
    <React.Fragment>
      <div className='container-lg'>
        <h2 className=''><Translate stringId='perAccountOverview' /></h2>

        <figure className='chart per-chart'>
          <figcaption>
            <h2 className='fold__title'><Translate stringId='perOverviewHeaderCurrent' /></h2>
          </figcaption>

          <div className='form__group form__group__per'>
            <div className='form__group__wrap'>
              <div className='form__inner-header'>
                <label className='form__label'>
                  <Translate stringId='perOverviewNS' />
                </label>
              </div>
              <div className="form__inner-body">
                <div className='col-6-sm'>
                  <Select
                    id='country_id'
                    name='country_id'
                    value={overviewState.country_id}
                    onChange={(e) => handleChange(e, false, false, false, 'country_id')}
                    options={props.nsDropdownItems}
                    disabled={!editable}
                  />
                  <FormError
                    errors={[]}
                    property='country_id'
                  />
                </div>
              </div>
            </div>
          </div>
          <FormInput
            label={strings.overviewFormStartDate}
            type='date'
            name='date_of_assessment'
            id='date_of_assessment'
            value={overviewState.date_of_assessment}
            classWrapper='form__group__per'
            onChange={(e) => handleChange(e)}
            disabled={!editable}
            inputCol={6}
            // description={fields.sitFieldsDate[status].desc}
          >
            <FormError
              errors={[]}
              property='date_of_assessment'
            />
          </FormInput>
          <div className='form__group form__group__per'>
            <div className='form__group__wrap'>
              <div className='form__inner-header'>
                <label className='form__label'>
                <Translate stringId='overviewFormTypeCapacityAssessment' />
                </label>
              </div>
              <div className="form__inner-body">
                <div className='col-6-sm'>
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
              </div>
            </div>
          </div>
          <FormInput
            label={strings.perTableAssessmentNumber}
            type='number'
            name='assessment_number'
            id='assessment_number'
            value={assessment_number}
            classWrapper='form__group__per'
            // onChange={}
            disabled={true}
            description={strings.perOverviewAsmtNumberDescription}
            inputCol={6}
          >
            <FormError
              errors={[]}
              property='assessment_number'
            />
          </FormInput>
          <FormInput
            label={strings.overviewFormBranchInvolved}
            type='text'
            name='branches_involved'
            id='branches_involved'
            value={overviewState.branches_involved}
            classWrapper='form__group__per'
            onChange={(e) => handleChange(e)}
            disabled={!editable}
            // description={fields.sitFieldsDate[status].desc}
          >
            <FormError
              errors={[]}
              property='branches_involved'
            />
          </FormInput>
          <FormInput
            label={strings.perOverviewWhatMethod}
            type='text'
            name='method_asmt_used'
            id='method_asmt_used'
            value={overviewState.method_asmt_used}
            classWrapper='form__group__per'
            onChange={(e) => handleChange(e)}
            disabled={!editable}
            // description={fields.sitFieldsDate[status].desc}
          >
            <FormError
              errors={[]}
              property='method_asmt_used'
            />
          </FormInput>
          <FormRadioGroup
            classWrapper='form__group__per'
            label={strings.perOverviewEPIBenchmarks}
            description={strings.overviewFormIsEPI}
            id='is_epi'
            name='is_epi'
            options={[
              {
                label: strings.fieldReportFormOptionYesLabel,
                value: 'true',
                disabled: !editable
              },
              {
                label: strings.fieldReportFormOptionNoLabel,
                value: 'false',
                disabled: !editable
              }
            ]}
            selectedOption={`${overviewState.is_epi}`}
            onChange={(e) => handleChange(e, true, false, true)} >
            <FormError
              errors={[]}
              property='is_epi'
            />
          </FormRadioGroup>
        </figure>

        <figure className='chart per-chart'>
          <figcaption>
            <h2 className='fold__title'><Translate stringId='perOverviewHeaderPrevious' /></h2>
          </figcaption>

          <FormInput
            label={strings.perOverviewPrevAssessmentDate}
            type='date'
            name='prev_asmt_date'
            id='prev_asmt_date'
            value={
              prevOverviewState?.date_of_assessment ? isoDate(prevOverviewState.date_of_assessment) : null
            }
            classWrapper='form__group__per'
            disabled={true}
            inputCol={6}
            // description={fields.sitFieldsDate[status].desc}
          >
            <FormError
              errors={[]}
              property='prev_asmt_date'
            />
          </FormInput>
          <FormInput
            label={strings.perOverviewPrevAssessmentType}
            type='text'
            name='prev_asmt_type'
            id='prev_asmt_type'
            value={prevOverviewState?.type_of_assessment?.name}
            classWrapper='form__group__per'
            disabled={true}
            inputCol={6}
            // description={fields.sitFieldsDate[status].desc}
          >
            <FormError
              errors={[]}
              property='prev_asmt_type'
            />
          </FormInput>
        </figure>

        <figure className='chart per-chart'>
          <figcaption>
            <h2 className='fold__title'><Translate stringId='perOverviewHeaderReviews' /></h2>
          </figcaption>

          <FormInput
            label={strings.overviewFormDateOfMidReview}
            type='date'
            name='date_of_mid_term_review'
            id='date_of_mid_term_review'
            value={overviewState.date_of_mid_term_review}
            classWrapper='form__group__per'
            onChange={(e) => handleChange(e)}
            disabled={!editable}
            inputCol={6}
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
            classWrapper='form__group__per'
            onChange={(e) => handleChange(e)}
            disabled={!editable}
            inputCol={6}
            // description={fields.sitFieldsDate[status].desc}
          >
            <FormError
              errors={[]}
              property='date_of_next_asmt'
            />
          </FormInput>
        </figure>

        <figure className='chart per-chart'>
          <figcaption>
            <h2 className='fold__title'><Translate stringId='perOverviewHeaderContact' /></h2>
          </figcaption>

          <FormInput
            label={strings.overviewFormFocalPoint}
            type='text'
            name='ns_focal_point_name'
            id='ns_focal_point_name'
            value={overviewState.ns_focal_point_name}
            classWrapper='form__group__per'
            onChange={(e) => handleChange(e)}
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
            classWrapper='form__group__per'
            onChange={(e) => handleChange(e)}
            disabled={!editable}
            // description={fields.sitFieldsDate[status].desc}
          >
            <FormError
              errors={[]}
              property='ns_focal_point_email'
            />
          </FormInput>
          <FormInput
            label={strings.overviewFormFocalPointPhone}
            type='text'
            name='ns_focal_point_phone'
            id='ns_focal_point_phone'
            value={overviewState.ns_focal_point_phone}
            classWrapper='form__group__per'
            onChange={(e) => handleChange(e)}
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
            classWrapper='form__group__per'
            onChange={(e) => handleChange(e)}
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
            classWrapper='form__group__per'
            onChange={(e) => handleChange(e)}
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
            classWrapper='form__group__per'
            onChange={(e) => handleChange(e)}
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
            classWrapper='form__group__per'
            onChange={(e) => handleChange(e)}
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
            classWrapper='form__group__per'
            onChange={(e) => handleChange(e)}
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
            classWrapper='form__group__per'
            onChange={(e) => handleChange(e)}
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
            classWrapper='form__group__per'
            onChange={(e) => handleChange(e)}
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
            classWrapper='form__group__per'
            onChange={(e) => handleChange(e)}
            disabled={!editable}
            // description={fields.sitFieldsDate[status].desc}
          >
            <FormError
              errors={[]}
              property='facilitator_contact'
            />
          </FormInput>
        </figure>
      </div>
    </React.Fragment>
  );
}

if (environment !== 'production') {
  PerOverview.propTypes = {
    user: T.object,
    perAreas: T.object,
    perForm: T.object,
    nsDropdownItems: T.array,
    perLatestOverview: T.object,
    _getLatestCountryOverview: T.func,
  };
}

const selector = (state, ownProps) => ({
  user: state.user.data,
  perAreas: state.perAreas,
  perForm: state.perForm,
  perLatestOverview: state.perLatestOverview,
  nsDropdownItems: nsDropdownSelector(state)
});

const dispatcher = (dispatch) => ({
  _getLatestCountryOverview: (payload) => dispatch(getLatestCountryOverview(payload)),
});

export default connect(selector, dispatcher)(PerOverview);

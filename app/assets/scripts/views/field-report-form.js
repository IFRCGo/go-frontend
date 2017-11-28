'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { PropTypes as T } from 'prop-types';
import _set from 'lodash.set';
import _cloneDeep from 'lodash.clonedeep';
import _toNumber from 'lodash.tonumber';
import c from 'classnames';
import Select from 'react-select';
import Ajv from 'ajv';
import ajvKeywords from 'ajv-keywords';

import { environment } from '../config';
import {
  step1 as schemaStep1,
  step2 as schemaStep2,
  step3 as schemaStep3,
  step4 as schemaStep4,
  step5 as schemaStep5
} from '../schemas/field-report-form';
import * as formData from '../utils/field-report-constants';
import { showAlert } from '../components/system-alerts';
import { createFieldReport } from '../actions';
// import { showGlobalLoading, hideGlobalLoading } from '../components/global-loading';
import { hideGlobalLoading } from '../components/global-loading';

import App from './app';
import Fold from '../components/fold';
import {
  FormInput,
  FormTextarea,
  FormRadioGroup,
  FormCheckboxGroup,
  FormCheckbox,
  FormSelect,
  FormError
} from '../components/form-elements/';
import { FormDescription } from '../components/form-elements/misc';

const ajv = new Ajv({ $data: true, allErrors: true, errorDataPath: 'property' });
ajvKeywords(ajv);

const dataPathToDisplay = (path) => {
  path = path.substring(1);
  const index = {
    // Step 1.
    summary: 'Summary',
    countries: 'Countries',
    status: 'Status',
    disasterType: 'Disaster Type',
    event: 'Event',
    sources: 'Sources',
    description: 'Brief Description of the Situation',
    assistance: 'Government requests international assistance?',

    // Step 2.
    'numInjured.redCross': 'Injured Red Cross',
    'numInjured.governmMissingent': 'Injured Government',
    'numDead.redCross': 'Dead Red Cross',
    'numDead.government': 'Dead Government',
    'numMissing.redCross': 'Missing Red Cross',
    'numMissing.government': 'Missing Government',
    'numAffected.redCross': 'Affected Red Cross',
    'numAffected.government': 'Affected Government',
    'numDisplaced.redCross': 'Displaced Red Cross',
    'numDisplaced.government': 'Displaced Government',
    numAssistedGov: 'Assisted by Government',
    numAssistedRedCross: 'Assisted By Red Cross',
    numLocalStaff: 'Number of local staff involved',
    numVolunteers: 'Number of volunteers involved',
    numExpats: 'Number of expats/delegates',

    // Step 3.
    // No validation for step 3.

    // Step 4.
    amountDref: 'DREF Requested - Amount CHF',
    amountEmergencyAppeal: 'Emergency Appeal - Amount CHF',
    numPplRdrits: 'RDRT/RITS - Number of people',
    numPplFact: 'FACT - Number of people',
    numPplIfrcStaff: 'IFRC Staff Relocated - Number of people',

    // Step 5.
    'contactOriginator.name': 'Originator - Name',
    'contactOriginator.func': 'Originator - Function',
    'contactOriginator.email': 'Originator - Email',
    'contactPrimary.name': 'Primary Contact - Name',
    'contactPrimary.func': 'Primary Contact - Function',
    'contactPrimary.email': 'Primary Contact - Email',
    'contactNatSoc.name': 'National Society Contact - Name',
    'contactNatSoc.func': 'National Society Contact - Function',
    'contactNatSoc.email': 'National Society Contact - Email',
    'contactFederation.name': 'Federation Contact - Name',
    'contactFederation.func': 'Federation Contact - Function',
    'contactFederation.email': 'Federation Contact - Email',
    'contactMediaNatSoc.name': 'Media Contact in the National Society - Name',
    'contactMediaNatSoc.func': 'Media Contact in the National Society - Function',
    'contactMediaNatSoc.email': 'Media Contact in the National Society - Email',
    'contactMedia.name': 'Media Contact - Name',
    'contactMedia.func': 'Media Contact - Function',
    'contactMedia.email': 'Media Contact - Email'
  };
  if (!index[path]) {
    console.warn('No display value found for', path);
    return 'N/A';
  }
  return index[path];
};

const prepStateForValidation = (state) => {
  state = _cloneDeep(state);

  // Conversion functions.
  const toBool = (val) => val === 'true';
  const toNumIfNum = (val) => {
    let v = _toNumber(val);
    return isNaN(v) ? val : v;
  };

  const formatter = {
    // Step 1.
    assistance: toBool,
    countries: (val) => val.map(o => o.value),

    // Step 2.
    numInjured: (val) => ({redCross: toNumIfNum(val.redCross), government: toNumIfNum(val.government)}),
    numDead: (val) => ({redCross: toNumIfNum(val.redCross), government: toNumIfNum(val.government)}),
    numMissing: (val) => ({redCross: toNumIfNum(val.redCross), government: toNumIfNum(val.government)}),
    numAffected: (val) => ({redCross: toNumIfNum(val.redCross), government: toNumIfNum(val.government)}),
    numDisplaced: (val) => ({redCross: toNumIfNum(val.redCross), government: toNumIfNum(val.government)}),
    numAssistedGov: toNumIfNum,
    numAssistedRedCross: toNumIfNum,
    numLocalStaff: toNumIfNum,
    numVolunteers: toNumIfNum,
    numExpats: toNumIfNum,

    // Step 4.
    amountDref: toNumIfNum,
    amountEmergencyAppeal: toNumIfNum,
    numPplRdrits: toNumIfNum,
    numPplFact: toNumIfNum,
    numPplIfrcStaff: toNumIfNum
  };

  for (let prop in state) {
    if (formatter[prop]) {
      state[prop] = formatter[prop](state[prop]);
    }
  }

  return state;
};

class FieldReportForm extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      step: 1,
      data: {
        // Step 1
        summary: undefined,
        // Countries follows the structure defined by react-select.
        // Will need to be converted.
        countries: [],
        status: undefined,
        disasterType: undefined,
        event: undefined,
        sources: formData.sources.map(o => ({
          name: o.name,
          checked: false,
          specification: undefined
        })),
        description: undefined,
        assistance: undefined,

        // Step 2
        numInjured: { redCross: undefined, government: undefined },
        numDead: { redCross: undefined, government: undefined },
        numMissing: { redCross: undefined, government: undefined },
        numAffected: { redCross: undefined, government: undefined },
        numDisplaced: { redCross: undefined, government: undefined },
        numAssistedGov: undefined,
        numAssistedRedCross: undefined,
        numLocalStaff: undefined,
        numVolunteers: undefined,
        numExpats: undefined,

        // Step 3
        bulletin: undefined,
        actionsOthers: undefined,
        actionsNatSoc: {
          options: formData.actions.map(o => ({
            name: o.name,
            checked: false
          })),
          description: undefined
        },
        actionsPns: {
          options: formData.actions.map(o => ({
            name: o.name,
            checked: false
          })),
          description: undefined
        },
        actionsFederation: {
          options: formData.actions.map(o => ({
            name: o.name,
            checked: false
          })),
          description: undefined
        },

        // Step 4
        dref: undefined,
        amountDref: undefined,
        emergencyAppeal: undefined,
        amountEmergencyAppeal: undefined,
        rdrtrits: undefined,
        numPplRdrits: undefined,
        fact: undefined,
        numPplFact: undefined,
        ifrcStaff: undefined,
        numPplIfrcStaff: undefined,

        // Step 5
        contactOriginator: { name: undefined, func: undefined, email: undefined },
        contactPrimary: { name: undefined, func: undefined, email: undefined },
        contactNatSoc: { name: undefined, func: undefined, email: undefined },
        contactFederation: { name: undefined, func: undefined, email: undefined },
        contactMediaNatSoc: { name: undefined, func: undefined, email: undefined },
        contactMedia: { name: undefined, func: undefined, email: undefined }
      },
      errors: null
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.onStepBackClick = this.onStepBackClick.bind(this);
  }

  componentWillReceiveProps (nextProps) {
    if (this.fieldReportForm.fetching && !nextProps.fieldReportForm.fetching) {
      if (!nextProps.fieldReportForm) {
        console.log('nextProps.fieldReportForm', nextProps.fieldReportForm);
        hideGlobalLoading();
      }
    }
  }

  validate () {
    const { step, data } = this.state;
    let state = prepStateForValidation(data);
    console.log('state', state);

    let validator;
    switch (step) {
      case 1:
        validator = ajv.compile(schemaStep1);
        break;
      case 2:
        validator = ajv.compile(schemaStep2);
        break;
      case 3:
        // Schema is being compiled and used but there are no errors being
        // displayed for this step, for no fields are required nor prone
        // to error.
        validator = ajv.compile(schemaStep3);
        break;
      case 4:
        validator = ajv.compile(schemaStep4);
        break;
      case 5:
        validator = ajv.compile(schemaStep5);
        break;
    }
    validator(state);

    this.setState({ errors: _cloneDeep(validator.errors) });
    console.log('validator.errors', validator.errors);
    return validator.errors === null;
  }

  getSubmitPayload () {
    // Prepare the payload for submission.
    // Extract properties that need processing.
    let {
      countries,
      disasterType,
      ...state
    } = _cloneDeep(this.state.data);

    // Process properties.
    state.countries = countries.map(o => ({id: o.value}));
    state.dtype = {id: disasterType};

    // Remove empty fields.

    return state;
  }

  onSubmit (e) {
    e.preventDefault();
    const step = this.state.step;
    const result = this.validate();
    if (result) {
      if (step === 5) {
        console.log('Submit data!!!', this.getSubmitPayload());
        // this.props._createFieldReport(this.getSubmitPayload());
        // showGlobalLoading();
      } else {
        window.scrollTo(0, 0);
        this.setState({ step: step + 1 });
      }
    } else {
      showAlert('danger', <p><strong>Error:</strong> There are errors in the form</p>, true, 4500);
    }
  }

  onFieldChange (field, e) {
    let data = _cloneDeep(this.state.data);
    let val = e.target ? e.target.value : e;
    _set(data, field, val === '' ? undefined : val);
    this.setState({data});
  }

  onStepBackClick () {
    if (this.state.step > 1) {
      window.scrollTo(0, 0);
      this.setState({ step: this.state.step - 1 });
    }
  }

  onStepperClick (step, e) {
    e.preventDefault();
    const result = this.validate();
    if (result) {
      window.scrollTo(0, 0);
      this.setState({ step });
    } else {
      showAlert('danger', <p><strong>Error:</strong> There are errors in the form</p>, true, 4500);
    }
  }

  renderStepper () {
    const step = this.state.step;
    const items = [
      'Basic Information',
      'Numeric Details',
      'Actions Taken',
      'Planned Response',
      'Contacts'
    ];
    return (
      <ol className='stepper'>
        {items.map((o, idx) => {
          const stepNum = idx + 1;
          const classes = c('stepper__item', {
            'stepper__item--complete': step > stepNum,
            'stepper__item--current': step === stepNum
          });
          return <li key={o} className={classes}><a href='#' onClick={this.onStepperClick.bind(this, stepNum)}><span>{o}</span></a></li>;
        })}
      </ol>
    );
  }

  renderStep1 () {
    return (
      <Fold title='Basic Information'>
        <FormInput
          label='Summary *'
          type='text'
          name='summary'
          id='summary'
          description={<div className='form__description'><p>Write a short summary of the report's topic. It will be used as the subject of the e-mail notification,
          later as the tittle of the RSS feed and possibly as the text message on mobile phones.</p><em>Example: 250 dead after an earthquake in Indonesia</em></div>}
          value={this.state.data.summary}
          onChange={this.onFieldChange.bind(this, 'summary')}
          autoFocus >

          <FormError
            errors={this.state.errors}
            property='summary'
          />

        </FormInput>

        <div className='form__group'>
          <label className='form__label'>Countries *</label>
          <p className='form__description'>Seach for the affected country. You can select more than one.</p>
          <Select
            name='countries'
            value={this.state.data.countries}
            onChange={this.onFieldChange.bind(this, 'countries')}
            options={formData.countries}
            multi />

          <FormError
            errors={this.state.errors}
            property='countries'
          />
        </div>

        <FormRadioGroup
          label='Status *'
          name='status'
          options={formData.status}
          selectedOption={this.state.data.status}
          onChange={this.onFieldChange.bind(this, 'status')}>
          <FormError
            errors={this.state.errors}
            property='status'
          />
        </FormRadioGroup>

        <div className='form__hascol form__hascol--2'>
          <FormSelect
            label='Disaster Type *'
            name='disaster-type'
            id='disaster-type'
            options={formData.disasterType}
            value={this.state.data.disasterType}
            onChange={this.onFieldChange.bind(this, 'disasterType')} >
            <FormError
              errors={this.state.errors}
              property='disasterType'
            />
          </FormSelect>

          <FormSelect
            label='Event'
            name='event'
            id='event'
            options={formData.event}
            value={this.state.data.event}
            onChange={this.onFieldChange.bind(this, 'event')} >
            <FormError
              errors={this.state.errors}
              property='event'
            />
          </FormSelect>
        </div>

        <div className='form__group'>
          <label className='form__label'>Sources</label>
          <div className='form__description'>
            <p>Check the box next to the source of information and specify:</p>
            <ul>
              <li>UN agency - OCHA</li>
              <li>Academia/Research - Tropical Storm Risk</li>
            </ul>
          </div>
          <div className='sources-list'>
            {formData.sources.map((source, idx) => (
              <ReportSource
                key={source.name}
                idx={idx}
                label={source.label}
                sourceName={source.name}
                specificationValue={this.state.data.sources[idx].specification}
                checked={this.state.data.sources[idx].checked}
                onChange={this.onFieldChange.bind(this, `sources[${idx}]`)} />
            ))}
          </div>
        </div>

        <FormTextarea
          label='Brief Description of the Situation'
          name='description'
          id='description'
          description={'Briefly describe the situation.'}
          value={this.state.data.description}
          onChange={this.onFieldChange.bind(this, 'description')} >
          <FormError
            errors={this.state.errors}
            property='description'
          />
        </FormTextarea>

        <FormRadioGroup
          label='Government requests international assistance?'
          description={'Indicate if the government requested international assistance.'}
          name='assistance'
          options={[
            {
              label: 'Yes',
              value: 'true'
            },
            {
              label: 'No',
              value: 'false'
            }
          ]}
          selectedOption={this.state.data.assistance}
          onChange={this.onFieldChange.bind(this, 'assistance')} >
          <FormError
            errors={this.state.errors}
            property='assistance'
          />
        </FormRadioGroup>
      </Fold>
    );
  }

  renderStep2 () {
    return (
      <Fold title='Numeric Details (People)'>
        <SourceEstimation
          label='Injured'
          description='Number of people suffering from physical injuries, trauma or an illness requiring immediate medical treatment as a direct result of a disaster.'
          name='num-injured'
          values={this.state.data.numInjured}
          fieldKey='numInjured'
          errors={this.state.errors}
          onChange={this.onFieldChange.bind(this, 'numInjured')} />
        <SourceEstimation
          label='Dead'
          description='Number of people confirmed dead and number missing and presumed dead.'
          name='num-dead'
          values={this.state.data.numDead}
          fieldKey='numDead'
          errors={this.state.errors}
          onChange={this.onFieldChange.bind(this, 'numDead')} />
        <SourceEstimation
          label='Missing'
          description='Number of people missing and presumed dead.'
          name='num-missing'
          values={this.state.data.numMissing}
          fieldKey='numMissing'
          errors={this.state.errors}
          onChange={this.onFieldChange.bind(this, 'numMissing')} />
        <SourceEstimation
          label='Affected'
          description='Number of people requiring immediate assistance during a period of emergency; this may include displaced or evacuated people.'
          name='num-affected'
          values={this.state.data.numAffected}
          fieldKey='numAffected'
          errors={this.state.errors}
          onChange={this.onFieldChange.bind(this, 'numAffected')} />
        <SourceEstimation
          label='Displaced'
          description='Number of people temporary displaced.'
          name='num-displaced'
          values={this.state.data.numDisplaced}
          fieldKey='numDisplaced'
          errors={this.state.errors}
          onChange={this.onFieldChange.bind(this, 'numDisplaced')} />

        <FormInput
          label='Assisted by Government'
          type='text'
          name='num-assisted-gov'
          id='num-assisted-gov'
          classWrapper='form__group--kv'
          value={this.state.data.numAssistedGov}
          onChange={this.onFieldChange.bind(this, 'numAssistedGov')} >
          <FormError
            errors={this.state.errors}
            property='numAssistedGov'
          />
        </FormInput>

        <FormInput
          label='Assisted By Red Cross'
          type='text'
          name='num-assisted-red-cross'
          id='num-assisted-red-cross'
          classWrapper='form__group--kv'
          value={this.state.data.numAssistedRedCross}
          onChange={this.onFieldChange.bind(this, 'numAssistedRedCross')} >
          <FormError
            errors={this.state.errors}
            property='numAssistedRedCross'
          />
        </FormInput>
        <FormInput
          label='Number of local staff involved'
          type='text'
          name='num-local-staff'
          id='num-local-staff'
          classWrapper='form__group--kv'
          value={this.state.data.numLocalStaff}
          onChange={this.onFieldChange.bind(this, 'numLocalStaff')} >
          <FormError
            errors={this.state.errors}
            property='numLocalStaff'
          />
        </FormInput>
        <FormInput
          label='Number of volunteers involved'
          type='text'
          name='num-volunteers'
          id='num-volunteers'
          classWrapper='form__group--kv'
          value={this.state.data.numVolunteers}
          onChange={this.onFieldChange.bind(this, 'numVolunteers')} >
          <FormError
            errors={this.state.errors}
            property='numVolunteers'
          />
        </FormInput>
        <FormInput
          label='Number of expats/delegates'
          type='text'
          name='num-expats'
          id='num-expats'
          classWrapper='form__group--kv'
          value={this.state.data.numExpats}
          onChange={this.onFieldChange.bind(this, 'numExpats')} >
          <FormError
            errors={this.state.errors}
            property='numExpats'
          />
        </FormInput>
      </Fold>
    );
  }

  renderStep3 () {
    // Note: There's no need for validation on this step.
    // All the fields are optional, and the text fields are just strings.
    return (
      <Fold title='Actions taken'>
        <ActionsCheckboxes
          label='Actions Taken by National Society Red Cross (if any)'
          description={'Select the activities taken by the National Society and briefly describe'}
          name='actions-nat-soc'
          options={formData.actions}
          values={this.state.data.actionsNatSoc}
          onChange={this.onFieldChange.bind(this, 'actionsNatSoc')} />

        <ActionsCheckboxes
          label='Actions Taken by PNS Red Cross (if any)'
          description={'Select the activities taken by the foreign National Society and briefly describe'}
          name='actions-pns'
          options={formData.actions}
          values={this.state.data.actionsPns}
          onChange={this.onFieldChange.bind(this, 'actionsPns')} />

        <ActionsCheckboxes
          label='Actions Taken by Federation Red Cross (if any)'
          description={'Select the activities taken by the Federation (could be the Zone office, DMUS, ...) and briefly describe'}
          name='actions-federation'
          options={formData.actions}
          values={this.state.data.actionsFederation}
          onChange={this.onFieldChange.bind(this, 'actionsFederation')} />

        <FormRadioGroup
          label='Information Bulletin'
          description={'About information management, indicate if an Information Bulletin was published, is planned or if no Information Bulletin will be issued for this operation/disaster.'}
          name='bulletin'
          options={[
            {
              label: 'No',
              value: 'no'
            },
            {
              label: 'Planned',
              value: 'planned'
            },
            {
              label: 'Yes/Published',
              value: 'published'
            }
          ]}
          selectedOption={this.state.data.bulletin}
          onChange={this.onFieldChange.bind(this, 'bulletin')} />

        <FormTextarea
          label='Actions Taken by Others (Governemnts, UN)'
          name='actions-others'
          id='actions-others'
          description={'Who else was involved? UN agencies? NGOs? Government? Describe what other actors did.'}
          value={this.state.data.actionsOthers}
          onChange={this.onFieldChange.bind(this, 'actionsOthers')} />
      </Fold>
    );
  }

  renderStep4 () {
    const optsPlanReqDep = [
      {
        label: 'Planned',
        value: 'planned'
      },
      {
        label: 'Requested',
        value: 'requested'
      },
      {
        label: 'Deployed',
        value: 'deployed'
      }
    ];

    return (
      <Fold title='Planned Response'>
        <div className='form__group'>
          <label className='form__label'>Planned International Response</label>
          <div className='form__description'>
            <p>Indicate the status of the differents international tools: Was DREF requested? How much ? Has it been approved ? How many beneficiaries ? Has the DREF operation been issued?</p>
            <p>Same for the emergency appeal</p>
            <p>For RDRT/FACT/ERU, only indicate if used, planned/requested or not used.</p>
          </div>

          <FormRadioGroup
            label='DREF Requested'
            name='dref'
            options={[
              {
                label: 'Planned',
                value: 'planned'
              },
              {
                label: 'Requested',
                value: 'requested'
              },
              {
                label: 'Allocated',
                value: 'allocated'
              }
            ]}
            classWrapper='form__group--asymmetric'
            selectedOption={this.state.data.dref}
            onChange={this.onFieldChange.bind(this, 'dref')} />

          <FormInput
            label='Amount CHF'
            type='text'
            name='amount-dref'
            id='amount-dref'
            value={this.state.data.amountDref}
            onChange={this.onFieldChange.bind(this, 'amountDref')} >
            <FormError
              errors={this.state.errors}
              property='amountDref'
            />
          </FormInput>

          <FormRadioGroup
            label='Emergency Appeal'
            name='emergency-appeal'
            options={[
              {
                label: 'Planned',
                value: 'planned'
              },
              {
                label: 'Requested',
                value: 'requested'
              },
              {
                label: 'Launched',
                value: 'launched'
              }
            ]}
            classWrapper='form__group--asymmetric'
            selectedOption={this.state.data.emergencyAppeal}
            onChange={this.onFieldChange.bind(this, 'emergencyAppeal')} />

          <FormInput
            label='Amount CHF'
            type='text'
            name='amount-emergency-appeal'
            id='amount-emergency-appeal'
            value={this.state.data.amountEmergencyAppeal}
            onChange={this.onFieldChange.bind(this, 'amountEmergencyAppeal')} >
            <FormError
              errors={this.state.errors}
              property='amountEmergencyAppeal'
            />
          </FormInput>

          <FormRadioGroup
            label='RDRT/RITS'
            name='rdrt-rits'
            options={optsPlanReqDep}
            classWrapper='form__group--asymmetric'
            selectedOption={this.state.data.rdrtrits}
            onChange={this.onFieldChange.bind(this, 'rdrtrits')} />

          <FormInput
            label='Number of people'
            type='text'
            name='num-ppl-rdrt-rits'
            id='num-ppl-rdrt-rits'
            value={this.state.data.numPplRdrits}
            onChange={this.onFieldChange.bind(this, 'numPplRdrits')} >
            <FormError
              errors={this.state.errors}
              property='numPplRdrits'
            />
          </FormInput>

          <FormRadioGroup
            label='FACT'
            name='fact'
            options={optsPlanReqDep}
            classWrapper='form__group--asymmetric'
            selectedOption={this.state.data.fact}
            onChange={this.onFieldChange.bind(this, 'fact')} />

          <FormInput
            label='Number of people'
            type='text'
            name='num-fact'
            id='num-fact'
            value={this.state.data.numPplFact}
            onChange={this.onFieldChange.bind(this, 'numPplFact')} >
            <FormError
              errors={this.state.errors}
              property='numPplFact'
            />
          </FormInput>

          <FormRadioGroup
            label='IFRC Staff Relocated'
            name='ifrc-staff'
            options={optsPlanReqDep}
            classWrapper='form__group--asymmetric'
            selectedOption={this.state.data.ifrcStaff}
            onChange={this.onFieldChange.bind(this, 'ifrcStaff')} />

          <FormInput
            label='Number of people'
            type='text'
            name='num-ifrc-staff'
            id='num-ifrc-staff'
            value={this.state.data.numPplIfrcStaff}
            onChange={this.onFieldChange.bind(this, 'numPplIfrcStaff')} >
            <FormError
              errors={this.state.errors}
              property='numPplIfrcStaff'
            />
          </FormInput>
        </div>
      </Fold>
    );
  }

  renderStep5 () {
    return (
      <Fold title='Contacts'>
        <ContactRow
          label='Originator'
          description='Your name, function and e-mail.'
          name='contact-originator'
          values={this.state.data.contactOriginator}
          fieldKey='contactOriginator'
          errors={this.state.errors}
          onChange={this.onFieldChange.bind(this, 'contactOriginator')} />
        <ContactRow
          label='Primary Contact'
          description='The person to contact for more information'
          name='contact-primary'
          values={this.state.data.contactPrimary}
          fieldKey='contactPrimary'
          errors={this.state.errors}
          onChange={this.onFieldChange.bind(this, 'contactPrimary')} />
        <ContactRow
          label='National Society Contact'
          description='A contact in the National Society for more information. Select someone who will be available for interview.'
          name='contact-nat-soc'
          values={this.state.data.contactNatSoc}
          fieldKey='contactNatSoc'
          errors={this.state.errors}
          onChange={this.onFieldChange.bind(this, 'contactNatSoc')} />
        <ContactRow
          label='Federation Contact'
          description='A contact of the Federation (Secretariat/Zone/DMUs) for more information. Select someone who will be available for interview.'
          name='contact-federation'
          values={this.state.data.contactFederation}
          fieldKey='contactFederation'
          errors={this.state.errors}
          onChange={this.onFieldChange.bind(this, 'contactFederation')} />
        <ContactRow
          label='Media Contact in the National Society'
          description='A media contact in the National Society. This person could be contacted by journalists.'
          name='contact-media-nat-soc'
          values={this.state.data.contactMediaNatSoc}
          fieldKey='contactMediaNatSoc'
          errors={this.state.errors}
          onChange={this.onFieldChange.bind(this, 'contactMediaNatSoc')} />
        <ContactRow
          label='Media Contact'
          description='A media contact in the Secretariat/Zone/DMU. This person could be contacted by journalists.'
          name='contact-media'
          values={this.state.data.contactMedia}
          fieldKey='contactMedia'
          errors={this.state.errors}
          onChange={this.onFieldChange.bind(this, 'contactMedia')} />
      </Fold>
    );
  }

  renderErrorSummary () {
    const { errors } = this.state;
    if (!errors) {
      return null;
    }

    return (
      <div className='form__errrors'>
        <h3>Page {this.state.step} of 5 incomplete.</h3>
        <p>To continue please fix:</p>
        <ul>
          {errors.map(o => <li key={o.dataPath}>{dataPathToDisplay(o.dataPath)}</li>)}
        </ul>
      </div>
    );
  }

  render () {
    return (
      <App className='page--frep-form'>
        <section className='inpage'>
          <header className='inpage__header'>
            <div className='inner'>
              <div className='inpage__headline'>
                <h1 className='inpage__title'>Create Field Report</h1>
              </div>
            </div>
          </header>
          <div className='inpage__body'>
            <div className='inner'>
              <form className='form' onSubmit={this.onSubmit}>
                {this.renderStepper()}
                {this[`renderStep${this.state.step}`]()}

                {this.renderErrorSummary()}

                <div className='form__actions'>
                  <button type='button' className={c('button button--base-plain', {disabled: this.state.step <= 1})} title='Go back to previous step' onClick={this.onStepBackClick}>Back</button>
                  <button type='submit' className='button button--secondary-raised-dark' title='Save and continue'>Save and continue</button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </App>
    );
  }
}

if (environment !== 'production') {
  FieldReportForm.propTypes = {
    _createFieldReport: T.func,
    fieldReportForm: T.object
  };
}

// /////////////////////////////////////////////////////////////////// //
// Connect functions

const selector = (state) => ({
  fieldReportForm: state.fieldReportForm
});

const dispatcher = (dispatch) => ({
  _createFieldReport: (...args) => dispatch(createFieldReport(...args))
});

export default connect(selector, dispatcher)(FieldReportForm);

//
//
// React elements specific for this form
//
//

class ReportSource extends React.Component {
  constructor (props) {
    super(props);
    this.onCheckChange = this.onCheckChange.bind(this);
    this.onSpecificationChange = this.onSpecificationChange.bind(this);
  }

  onCheckChange (e) {
    const { sourceName, checked, onChange, specificationValue } = this.props;

    onChange({
      name: sourceName,
      checked: !checked,
      specification: specificationValue
    });
  }

  onSpecificationChange (e) {
    const { sourceName, checked, onChange } = this.props;

    onChange({
      name: sourceName,
      checked: checked,
      specification: e.target.value
    });
  }

  render () {
    const {
      idx,
      label,
      sourceName,
      specificationValue,
      checked
    } = this.props;

    return (
      <div className='sources-list__item'>
        <FormCheckbox
          label={label}
          name={`source[${idx || 0}][name]`}
          id={`source-name-${sourceName}`}
          value={sourceName}
          checked={checked}
          onChange={this.onCheckChange} />

        <FormInput
          label='Specification'
          type='text'
          name={`source[${idx || 0}][spec]`}
          id='source-spec'
          classLabel='form__label--nested'
          value={specificationValue}
          disabled={!checked}
          onChange={this.onSpecificationChange} />
      </div>
    );
  }
}

if (environment !== 'production') {
  ReportSource.propTypes = {
    idx: T.number,
    label: T.string,
    sourceName: T.string,
    specificationValue: T.string,
    value: T.string,
    checked: T.bool,
    onChange: T.func
  };
}

class SourceEstimation extends React.Component {
  onFieldChange (field, e) {
    const { values, onChange } = this.props;
    const newVals = Object.assign({}, values, {[field]: e.target.value});
    onChange(newVals);
  }

  render () {
    const {
      label,
      name,
      description,
      values,
      fieldKey,
      errors
    } = this.props;

    return (
      <div className='form__group estimation-row'>
        <div className='form__inner-header'>
          <div className='form__inner-headline'>
            <label className='form__label'>{label}</label>
            <p className='form__description'>{description}</p>
          </div>
        </div>
        <div className='form__inner-body'>
          <FormInput
            label='Estimation Red Cross'
            type='text'
            name={`${name}[red-cross]`}
            id={`${name}-red-cross`}
            classLabel='form__label--nested'
            value={values.redCross}
            onChange={this.onFieldChange.bind(this, 'redCross')} >
            <FormError
              errors={errors}
              property={`${fieldKey}.redCross`}
            />
          </FormInput>

          <FormInput
            label='Estimation Government'
            type='text'
            name={`${name}[government]`}
            id={`${name}-government`}
            classLabel='form__label--nested'
            value={values.government}
            onChange={this.onFieldChange.bind(this, 'government')} >
            <FormError
              errors={errors}
              property={`${fieldKey}.government`}
            />
          </FormInput>
        </div>
      </div>
    );
  }
}

if (environment !== 'production') {
  SourceEstimation.propTypes = {
    label: T.string,
    name: T.string,
    description: T.string,
    values: T.shape({
      redCross: T.string,
      government: T.string
    }),
    fieldKey: T.string,
    errors: T.array,
    onChange: T.func
  };
}

class ActionsCheckboxes extends React.Component {
  constructor (props) {
    super(props);
    this.onChecksChange = this.onChecksChange.bind(this);
  }

  onChecksChange (checkValues) {
    const { values, onChange } = this.props;
    onChange(Object.assign({}, values, {options: checkValues}));
  }

  onDescriptionChange (e) {
    const { values, onChange } = this.props;
    const newVals = Object.assign({}, values, {description: e.target.value});
    onChange(newVals);
  }

  render () {
    const {
      label,
      name,
      description,
      options,
      values
    } = this.props;

    return (
      <FormCheckboxGroup
        label={label}
        description={description}
        name={name}
        classWrapper='action-checkboxes'
        options={options}
        values={values.options}
        onChange={this.onChecksChange} >
        <FormTextarea
          label='Description'
          name={`${name}[description]`}
          id={`${name}-description`}
          classLabel='form__label--nested'
          value={values.description}
          onChange={this.onDescriptionChange} />
      </FormCheckboxGroup>
    );
  }
}

if (environment !== 'production') {
  ActionsCheckboxes.propTypes = {
    label: T.string,
    name: T.string,
    description: T.string,
    options: T.array,
    values: T.shape({
      options: T.array,
      description: T.string
    }),
    onChange: T.func
  };
}

class ContactRow extends React.Component {
  onFieldChange (field, e) {
    const { values, onChange } = this.props;
    const newVals = Object.assign({}, values, {[field]: e.target.value});
    onChange(newVals);
  }

  render () {
    const {
      label,
      name,
      description,
      values,
      errors,
      fieldKey
    } = this.props;

    return (
      <div className='form__group contact-row'>
        <div className='form__inner-header'>
          <div className='form__inner-headline'>
            <label className='form__label'>{label}</label>
            <p className='form__description'>{description}</p>
          </div>
        </div>
        <div className='form__inner-body'>
          <FormInput
            label='Name'
            type='text'
            name={`${name}[name]`}
            id={`${name}-name`}
            classLabel='form__label--nested'
            value={values.name}
            onChange={this.onFieldChange.bind(this, 'name')} >
            <FormError
              errors={errors}
              property={`${fieldKey}.name`}
            />
          </FormInput>
          <FormInput
            label='Function'
            type='text'
            name={`${name}[func]`}
            id={`${name}-func`}
            classLabel='form__label--nested'
            value={values.func}
            onChange={this.onFieldChange.bind(this, 'func')} >
            <FormError
              errors={errors}
              property={`${fieldKey}.func`}
            />
          </FormInput>
          <FormInput
            label='Email'
            type='text'
            name={`${name}[email]`}
            id={`${name}-email`}
            classLabel='form__label--nested'
            value={values.email}
            onChange={this.onFieldChange.bind(this, 'email')} >
            <FormError
              errors={errors}
              property={`${fieldKey}.email`}
            />
          </FormInput>
        </div>
      </div>
    );
  }
}

if (environment !== 'production') {
  ContactRow.propTypes = {
    label: T.string,
    name: T.string,
    description: T.string,
    values: T.shape({
      name: T.string,
      func: T.string,
      email: T.string
    }),
    fieldKey: T.string,
    errors: T.array,
    onChange: T.func
  };
}

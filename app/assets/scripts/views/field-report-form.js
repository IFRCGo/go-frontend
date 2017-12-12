// TODO on this file:
// - [] Remove unneeded console.logs
// - [] Map fields to api:
//   Step 1
//   sources: formData.sources.map(o => ({
//     value: o.value,
//     checked: false,
//     specification: undefined
//   })),

//   // Step 3
//   bulletin: undefined,
//   actionsOthers: undefined,

//   // Step 4
//   dref: { status: undefined, value: undefined }
//   emergencyAppeal: { status: undefined, value: undefined }
//   rdrtrits: { status: undefined, value: undefined }
//   fact: { status: undefined, value: undefined }
//   ifrcStaff: { status: undefined, value: undefined }
//   eru: [{ type: undefined, status: undefined, units: undefined }],
//
// - [] Add missing values for selectable options (radios, checkboxes...)
//   Step 1
//   sources: Array[checked: boolean, specification: string],

//   Step 3
//   bulletin: string (radio buttons),

//   Step 4
//   dref: string (radio buttons),
//   emergencyAppeal: string (radio buttons),
//   rdrtrits: string (radio buttons),
//   fact: string (radio buttons),
//   ifrcStaff: string (radio buttons),
//   eru: Array[type: string, status: string(radio buttons), units: number]
//
// - [] Submit data
//
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

import { environment, api } from '../config';
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
import { request } from '../utils/network';

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

const ajv = new Ajv({ $data: true, allErrors: true, errorDataPath: 'property' });
ajvKeywords(ajv);

const dataPathToDisplay = (path) => {
  // Remove first . and any array ref.
  path = path.substring(1).replace(/\[[0-9]+\]/g, '');
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
    'numInjured.estimation': 'Estimation Injured',
    'numDead.estimation': 'Estimation Dead',
    'numMissing.estimation': 'Estimation Missing',
    'numAffected.estimation': 'Estimation Affected',
    'numDisplaced.estimation': 'Estimation Displaced',
    numAssistedGov: 'Assisted by Government',
    numAssistedRedCross: 'Assisted By Red Cross',
    numLocalStaff: 'Number of local staff involved',
    numVolunteers: 'Number of volunteers involved',
    numExpats: 'Number of expats/delegates',

    // Step 3.
    // No validation for step 3.

    // Step 4.
    'dref.value': 'DREF Requested - Amount CHF',
    'emergencyAppeal.value': 'Emergency Appeal - Amount CHF',
    'rdrtrits.value': 'RDRT/RITS - Number of people',
    'fact.value': 'FACT - Number of people',
    'ifrcStaff.value': 'IFRC Staff Relocated - Number of people',
    'eru.units': 'ERU - Units',

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

  const objPropToNum = (prop) => (val) => { val[prop] = toNumIfNum(val[prop]); return val; };

  const formatter = {
    // Step 1.
    assistance: toBool,
    countries: (val) => val.map(o => o.value),
    event: (val) => val ? toNumIfNum(val.value) : undefined,

    // Step 2.
    numInjured: (val) => val.map(objPropToNum('estimation')),
    numDead: (val) => val.map(objPropToNum('estimation')),
    numMissing: (val) => val.map(objPropToNum('estimation')),
    numAffected: (val) => val.map(objPropToNum('estimation')),
    numDisplaced: (val) => val.map(objPropToNum('estimation')),
    numAssistedGov: toNumIfNum,
    numAssistedRedCross: toNumIfNum,
    numLocalStaff: toNumIfNum,
    numVolunteers: toNumIfNum,
    numExpats: toNumIfNum,

    // Step 4.
    dref: objPropToNum('value'),
    emergencyAppeal: objPropToNum('value'),
    rdrtrits: objPropToNum('value'),
    fact: objPropToNum('value'),
    ifrcStaff: objPropToNum('value'),
    eru: (val) => val.map(objPropToNum('units'))
  };

  for (let prop in state) {
    if (formatter[prop]) {
      state[prop] = formatter[prop](state[prop]);
    }
  }

  return state;
};

const getEventsFromApi = (input) => {
  return !input
    ? Promise.resolve({ options: [] })
    : request(`${api}/api/v1/es_search/?type=event&keyword=${input}`)
      .then(data => ({
        options: data.hits.map(o => ({
          value: o._source.id,
          label: o._source.name
        }))
      }));
};

// How to add a new field to the form:
// - Add the widget to the form.
//    - If it has options, they should come from utils/form-report-constants.js
// - Add the correct key and data structure to the state.
// - Add the conversion (if needed) to prepStateForValidation()
// - Add the field name (if needed) to dataPathToDisplay() for correct
//   error display.
// - Add field to the submission payload in FieldReportForm.getSubmitPayload()

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
        visibility: 'membership',
        disasterType: undefined,
        event: undefined,
        sources: formData.sources.map(o => ({
          value: o.value,
          checked: false,
          specification: undefined
        })),
        description: undefined,
        assistance: undefined,

        // Step 2
        numInjured: [{ estimation: undefined, source: undefined }],
        numDead: [{ estimation: undefined, source: undefined }],
        numMissing: [{ estimation: undefined, source: undefined }],
        numAffected: [{ estimation: undefined, source: undefined }],
        numDisplaced: [{ estimation: undefined, source: undefined }],
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
            value: o.value,
            checked: false
          })),
          description: undefined
        },
        actionsPns: {
          options: formData.actions.map(o => ({
            value: o.value,
            checked: false
          })),
          description: undefined
        },
        actionsFederation: {
          options: formData.actions.map(o => ({
            value: o.value,
            checked: false
          })),
          description: undefined
        },

        // Step 4
        dref: { status: undefined, value: undefined },
        emergencyAppeal: { status: undefined, value: undefined },
        rdrtrits: { status: undefined, value: undefined },
        fact: { status: undefined, value: undefined },
        ifrcStaff: { status: undefined, value: undefined },
        eru: [{ type: undefined, status: undefined, units: undefined }],

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
    const originalState = _cloneDeep(this.state.data);
    let state = {};
    const {
      countries,
      disasterType,
      event
    } = originalState;

    // Process properties.
    state.countries = countries.map(o => ({id: o.value}));
    state.dtype = {id: disasterType};
    state.event = {id: event.value};

    const directMapping = [
      // [source, destination]
      ['summary', 'summary'],
      ['description', 'description'],
      ['status', 'status'],
      ['assistance', 'request_assistance'],
      ['numAssistedRedCross', 'num_assisted'],
      ['numAssistedGov', 'gov_num_assisted'],
      ['numLocalStaff', 'num_localstaff'],
      ['numVolunteers', 'num_volunteers'],
      ['numExpats', 'num_expats_delegates']
    ];

    directMapping.forEach(([src, dest]) => {
      state[dest] = originalState[src];
    });

    // For this properties when the source is the Red Cross use the provided,
    // when it's Government prepend gov_. This results in:
    // num_injured | gov_num_injured
    const sourceEstimationMapping = [
      ['numInjured', 'num_injured'],
      ['numDead', 'num_dead'],
      ['numMissing', 'num_missing'],
      ['numAffected', 'num_affected'],
      ['numDisplaced', 'num_displaced']
    ];

    sourceEstimationMapping.forEach(([src, dest]) => {
      originalState[src].forEach(o => {
        if (o.source === 'red-cross') {
          state[dest] = o.estimation;
        } else if (o.source === 'government') {
          state[`gov_${dest}`] = o.estimation;
        }
      });
    });

    // Actions.
    // In the payload all the action are in the same array.
    // Convert the state to the correct structure:
    // [
    //   { organization: "NATL", actions: [ { id: 1 }, { id: 2 } ], summary: "foo bar baz" },
    //   { organization: "PNS" ... }
    // ]
    const actionsMapping = [
      // [state var, org name]
      ['actionsNatSoc', 'NATL'],
      ['actionsPns', 'PNS'],
      ['actionsFederation', 'FDRN']
    ];

    state.actions_taken = actionsMapping.map(([src, orgName]) => {
      return {
        organization: orgName,
        summary: originalState[src].description || '',
        actions: originalState[src].options.reduce((orgActions, o) => {
          return o.checked ? orgActions.concat({id: o.value}) : orgActions;
        }, [])
      };
    });

    // Planned Response Mapping
    // In the payload the status and value may mean different things.
    // The `value` for dref refers to Amount. The `value` for FACT refers to
    // number of people. We need to convert from an object {status, value}
    // to plain state props.
    const planResponseMapping = [
      // [state var, mapping status, mapping value]
      ['dref', 'DREFRequested', 'DREFRequestedAmount'],
      ['emergencyAppeal', 'EmergencyAppeal', 'EmergencyAppealAmount']
    ];

    planResponseMapping.forEach(([src, statusMap, valueMap]) => {
      state[statusMap] = originalState[src].status;
      state[valueMap] = originalState[src].value;
    });

    // Contacts.
    // In the payload all the contacts are in the same array.
    // Convert the state to the correct structure:
    // [
    //   { ctype: "originator", name: 'John', title: 'Medic', email: 'john@gmail.com' },
    //   { ctype: "primary" ... }
    // ]
    const contatcsMapping = [
      // [state var, contact type]
      ['contactOriginator', 'Originator'],
      ['contactPrimary', 'Primary'],
      ['contactNatSoc', 'NationalSociety'],
      ['contactFederation', 'Federation'],
      ['contactMediaNatSoc', 'MediaNationalSociety'],
      ['contactMedia', 'Media']
    ];

    state.contacts = contatcsMapping.map(([src, contactType]) => {
      return {
        ctype: contactType,
        name: originalState[src].name || '',
        title: originalState[src].title || '',
        email: originalState[src].email || ''
      };
    });

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
    let val = e && e.target ? e.target.value : e;
    _set(data, field, val === '' || val === null ? undefined : val);
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

        <FormRadioGroup
          label='This field report is visible to'
          name='visibility'
          options={formData.visibility}
          selectedOption={this.state.data.visibility}
          onChange={this.onFieldChange.bind(this, 'visibility')}>
          <FormError
            errors={this.state.errors}
            property='visibility'
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

          <div className='form__group'>
            <label className='form__label'>Event</label>
            <Select.Async
              value={this.state.data.event}
              onChange={this.onFieldChange.bind(this, 'event')}
              loadOptions={getEventsFromApi} />

            <FormError
              errors={this.state.errors}
              property='event'
            />
          </div>
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
                key={source.value}
                idx={idx}
                label={source.label}
                sourceName={source.value}
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
              value: '0'
            },
            {
              label: 'Planned',
              value: '2'
            },
            {
              label: 'Yes/Published',
              value: '3'
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
        value: '2'
      },
      {
        label: 'Requested',
        value: '1'
      },
      {
        label: 'Deployed',
        value: '3'
      }
    ];

    return (
      <Fold title='Planned Response'>
        <label className='form__label'>Planned International Response</label>
        <div className='form__description'>
          <p>Indicate the status of the differents international tools: Was DREF requested? How much ? Has it been approved ? How many beneficiaries ? Has the DREF operation been issued?</p>
          <p>Same for the emergency appeal</p>
          <p>For RDRT/FACT/ERU, only indicate if used, planned/requested or not used.</p>
        </div>

        <PlanResponseRow
          label='DREF Requested'
          valueFieldLabel='Amount CHF'
          name='dref'
          options={[
            {
              label: 'Planned',
              value: '2'
            },
            {
              label: 'Requested',
              value: '1'
            },
            {
              label: 'Allocated',
              value: '3'
            }
          ]}
          values={this.state.data.dref}
          errors={this.state.errors}
          fieldKey='dref'
          onChange={this.onFieldChange.bind(this, 'dref')} />

        <PlanResponseRow
          label='Emergency Appeal'
          valueFieldLabel='Amount CHF'
          name='emergency-appeal'
          options={[
            {
              label: 'Planned',
              value: '2'
            },
            {
              label: 'Requested',
              value: '1'
            },
            {
              label: 'Launched',
              value: '3'
            }
          ]}
          values={this.state.data.emergencyAppeal}
          errors={this.state.errors}
          fieldKey='emergencyAppeal'
          onChange={this.onFieldChange.bind(this, 'emergencyAppeal')} />

        <PlanResponseRow
          label='RDRT/RITS'
          valueFieldLabel='Number of people'
          name='rdrt-rits'
          options={optsPlanReqDep}
          values={this.state.data.rdrtrits}
          errors={this.state.errors}
          fieldKey='rdrtrits'
          onChange={this.onFieldChange.bind(this, 'rdrtrits')} />

        <PlanResponseRow
          label='FACT'
          valueFieldLabel='Number of people'
          name='fact'
          options={optsPlanReqDep}
          values={this.state.data.fact}
          errors={this.state.errors}
          fieldKey='fact'
          onChange={this.onFieldChange.bind(this, 'fact')} />

        <PlanResponseRow
          label='IFRC Staff Relocated'
          valueFieldLabel='Number of people'
          name='ifrc-staff'
          options={optsPlanReqDep}
          values={this.state.data.ifrcStaff}
          errors={this.state.errors}
          fieldKey='ifrcStaff'
          onChange={this.onFieldChange.bind(this, 'ifrcStaff')} />

        <Eru
          label='ERU'
          name='eru'
          values={this.state.data.eru}
          fieldKey='eru'
          errors={this.state.errors}
          onChange={this.onFieldChange.bind(this, 'eru')} />
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
      <div className='validation-result'>
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
                {this.renderStepper()}
              </div>
            </div>
          </header>
          <div className='inpage__body'>
            <div className='inner'>
              <form className='form form--field-report' onSubmit={this.onSubmit}>
                {this[`renderStep${this.state.step}`]()}
                {this.renderErrorSummary()}

                <div className='form__actions'>
                  <button type='button' className={c('button button--secondary-plain', {disabled: this.state.step <= 1})} title='Go back to previous step' onClick={this.onStepBackClick}>Back</button>
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
  onEstimationChange (idx, e) {
    const { values, onChange } = this.props;
    const newVals = _cloneDeep(values);
    newVals[idx].estimation = e.target.value;
    onChange(newVals);
  }

  onSourceChange (idx, e) {
    const { values, onChange } = this.props;
    const val = e.target.value;
    let newVals = _cloneDeep(values);
    // Ensure vertical exclusivity in the radio button matrix.
    newVals = newVals.map(o => {
      if (o.source === val) o.source = undefined;
      return o;
    });
    newVals[idx].source = val;
    onChange(newVals);
  }

  onAddSource () {
    const { values, onChange } = this.props;
    onChange(values.concat({estimation: undefined, source: undefined}));
  }

  onRemoveSource (idx) {
    const { values, onChange } = this.props;
    const newVals = _cloneDeep(values);
    newVals.splice(idx, 1);
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
          {values.map((o, idx) => (
            <div key={o.source || idx} className='estimation'>
              <FormInput
                label='Estimation'
                type='text'
                name={`${name}[${idx}][estimation]`}
                id={`${name}-${idx}-estimation`}
                classLabel={c('form__label--nested', {'visually-hidden': idx > 0})}
                classWrapper='estimation__item-field'
                value={o.estimation}
                onChange={this.onEstimationChange.bind(this, idx)} >
                <FormError
                  errors={errors}
                  property={`${fieldKey}[${idx}].estimation`}
                />
              </FormInput>

              <FormRadioGroup
                label='Source'
                name={`${name}[${idx}][source]`}
                options={[
                  {label: 'Red Cross', value: 'red-cross'},
                  {label: 'Government', value: 'government'}
                ]}
                classLabel={c('form__label--nested', {'visually-hidden': idx > 0})}
                classWrapper='estimation__item'
                selectedOption={o.source}
                onChange={this.onSourceChange.bind(this, idx)} />

              <div className='estimation__item estimation__item--actions'>
                {values.length > 1 ? (
                  <button type='button' className='button--remove-source' title='Delete Source' onClick={this.onRemoveSource.bind(this, idx)}>Delete source</button>
                ) : (
                  <button type='button' className='button--add-item button--achromic-glass' title='Add new source' onClick={this.onAddSource.bind(this)}>Add another source</button>
                )}
              </div>
            </div>
          ))}

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
    values: T.array,
    fieldKey: T.string,
    errors: T.array,
    onChange: T.func
  };
}

class ActionsCheckboxes extends React.Component {
  constructor (props) {
    super(props);
    this.onChecksChange = this.onChecksChange.bind(this);
    this.onDescriptionChange = this.onDescriptionChange.bind(this);
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
        name={`${name}[options]`}
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

class PlanResponseRow extends React.Component {
  onFieldChange (field, e) {
    const { values, onChange } = this.props;
    const newVals = Object.assign({}, values, {[field]: e.target.value});
    onChange(newVals);
  }

  render () {
    const {
      label,
      name,
      options,
      valueFieldLabel,
      values,
      errors,
      fieldKey
    } = this.props;

    return (
      <div className='form__group plan-response-row'>
        <div className='form__inner-header'>
          <div className='form__inner-headline'>
            <label className='form__label'>{label}</label>
          </div>
        </div>
        <div className='form__inner-body'>
          <FormRadioGroup
            name={`${name}[status]`}
            id={`${name}-status`}
            classLabel='visually-hidden'
            classWrapper='resp-status'
            label='Status'
            options={options}
            selectedOption={values.status}
            onChange={this.onFieldChange.bind(this, 'status')} />

          <FormInput
            label={valueFieldLabel}
            type='text'
            name={`${name}[value]`}
            id={`${name}-value`}
            classLabel='form__label--nested'
            classWrapper='resp-value'
            value={values.value}
            onChange={this.onFieldChange.bind(this, 'value')} >
            <FormError
              errors={errors}
              property={`${fieldKey}.value`}
            />
          </FormInput>
        </div>
      </div>
    );
  }
}

if (environment !== 'production') {
  PlanResponseRow.propTypes = {
    label: T.string,
    name: T.string,
    values: T.shape({
      status: T.string,
      value: T.string
    }),
    options: T.array,
    valueFieldLabel: T.string,
    fieldKey: T.string,
    errors: T.array,
    onChange: T.func
  };
}

class Eru extends React.Component {
  onFieldChange (field, e) {
    const { values, onChange } = this.props;
    const newVals = _cloneDeep(values);
    _set(newVals, field, e.target.value);
    onChange(newVals);
  }

  onAddSource () {
    const { values, onChange } = this.props;
    onChange(values.concat({ type: undefined, status: undefined, units: undefined }));
  }

  onRemoveSource (idx) {
    const { values, onChange } = this.props;
    const newVals = _cloneDeep(values);
    newVals.splice(idx, 1);
    onChange(newVals);
  }

  canAdd () {
    // It is possible to add ERU until all types are exhausted.
    return this.props.values.length < formData.eruTypes.length - 1;
  }

  render () {
    const {
      label,
      name,
      values,
      fieldKey,
      errors
    } = this.props;

    const usedEruTypes = values.map(o => o.type);

    return (
      <div className='form__group'>
        <div className='form__inner-header'>
          <div className='form__inner-headline'>
            <label className='form__label'>{label}</label>
          </div>
          <div className='form__inner-actions'>
            <button type='button' className={c('button--add-item button--achromic-glass', {disabled: !this.canAdd()})} title='Add new ERU' onClick={this.onAddSource.bind(this)}>Add another ERU</button>
          </div>
        </div>
        <div className='form__inner-body'>
          {values.map((o, idx) => {
            // Remove eru types already used. Each one can be used only once.
            const eruTypes = formData.eruTypes.filter(type => o.type === type.value || type.value === ''
              ? true
              : usedEruTypes.indexOf(type.value) === -1);

            return (
              <div key={o.type || `idx-${idx}`} className='eru'>
                <FormSelect
                  label='Type'
                  name={`${name}[${idx}][type]`}
                  id={`${name}-${idx}-type`}
                  classLabel='form__label--nested'
                  classWrapper='eru__item-type'
                  options={eruTypes}
                  value={o.type}
                  onChange={this.onFieldChange.bind(this, `[${idx}].type`)} >
                  <FormError
                    errors={errors}
                    property={`${fieldKey}[${idx}].type`}
                  />
                </FormSelect>

                <FormRadioGroup
                  label='Status'
                  name={`${name}[${idx}][status]`}
                  classLabel='form__label--nested'
                  classWrapper='eru__item-status'
                  options={[
                    {
                      label: 'Planned',
                      value: '2'
                    },
                    {
                      label: 'Requested',
                      value: '1'
                    },
                    {
                      label: 'Deployed',
                      value: '3'
                    }
                  ]}
                  selectedOption={o.status}
                  onChange={this.onFieldChange.bind(this, `[${idx}].status`)} />

                <FormInput
                  label='Units'
                  type='text'
                  name={`${name}[${idx}][units]`}
                  id={`${name}-${idx}-units`}
                  classLabel='form__label--nested'
                  classWrapper='eru__item-units'
                  value={o.units}
                  onChange={this.onFieldChange.bind(this, `[${idx}].units`)} >
                  <FormError
                    errors={errors}
                    property={`${fieldKey}[${idx}].units`}
                  />
                </FormInput>

                <div className='eru__item-actions'>
                  <button type='button' className={c('button--remove-source', {disabled: values.length <= 1})} title='Delete ERU' onClick={this.onRemoveSource.bind(this, idx)}>Delete ERU</button>
                </div>
              </div>
            );
          })}

        </div>
      </div>
    );
  }
}

if (environment !== 'production') {
  Eru.propTypes = {
    label: T.string,
    name: T.string,
    values: T.array,
    fieldKey: T.string,
    errors: T.array,
    onChange: T.func
  };
}

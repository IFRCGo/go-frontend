'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { PropTypes as T } from 'prop-types';
import _get from 'lodash.get';
import _set from 'lodash.set';
import _cloneDeep from 'lodash.clonedeep';
import c from 'classnames';
import Select from 'react-select';
import Ajv from 'ajv';
import ajvKeywords from 'ajv-keywords';

import { environment } from '../../config';
import {
  step1 as schemaStep1,
  step2 as schemaStep2,
  step3 as schemaStep3,
  step4 as schemaStep4,
  step5 as schemaStep5
} from '../../schemas/field-report-form';
import * as formData from '../../utils/field-report-constants';
import { showAlert } from '../../components/system-alerts';
import { createFieldReport, updateFieldReport, getFieldReportById } from '../../actions';
import { showGlobalLoading, hideGlobalLoading } from '../../components/global-loading';
import {
  dataPathToDisplay,
  prepStateForValidation,
  getEventsFromApi,
  getInitialDataState,
  convertStateToPayload,
  convertFieldReportToState
} from './data-utils';

import App from '../app';
import Fold from '../../components/fold';
import {
  FormInput,
  FormTextarea,
  FormRadioGroup,
  FormSelect,
  FormError
} from '../../components/form-elements/';
import ActionsCheckboxes from './cmp-action-checkboxes.js';
import ContactRow from './cmp-contact-row.js';
import Eru from './cmp-eru.js';
import PlanResponseRow from './cmp-planned-response-row.js';
import ReportSource from './cmp-report-source.js';
import SourceEstimation from './cmp-source-estimation.js';

const ajv = new Ajv({ $data: true, allErrors: true, errorDataPath: 'property' });
ajvKeywords(ajv);

// How to add a new field to the form:
// - Add the widget to the form.
//    - If it has options, they should come from utils/form-report-constants.js
// - Add the correct key and data structure to the state.
// - Add the conversion (if needed) to prepStateForValidation()
// - Add the field name (if needed) to dataPathToDisplay() for correct
//   error display.
// - Add field to the submission payload in convertStateToPayload()

class FieldReportForm extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      step: 1,
      data: getInitialDataState(),
      errors: null
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.onStepBackClick = this.onStepBackClick.bind(this);
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.fieldReportForm.fetching && !nextProps.fieldReportForm.fetching) {
      hideGlobalLoading();
      if (nextProps.fieldReportForm.error) {
        const message = nextProps.fieldReportForm.error.error_message || 'Could not submit field report';
        showAlert('danger', <p><strong>Error:</strong> {message}</p>, true, 4500);
      } else {
        const { history } = this.props;
        const { id } = nextProps.fieldReportForm.data;
        if (this.props.match.params.id) {
          showAlert('success', <p>Field report updated, redirecting...</p>, true, 2000);
        } else {
          showAlert('success', <p>Field report created, redirecting...</p>, true, 2000);
        }
        setTimeout(() => history.push(`/reports/${id}`), 2000);
      }
    }

    if (this.props.report.fetching && !nextProps.report.fetching) {
      hideGlobalLoading();
      if (!nextProps.report.error) {
        const prefillState = convertFieldReportToState(nextProps.report.data);
        this.setState({data: prefillState});
      }
    }
  }

  componentDidMount () {
    if (this.props.match.params.id) {
      // Editing the field report.
      this.getReport(this.props.match.params.id);
    }
  }

  getReport (id) {
    showGlobalLoading();
    this.props._getFieldReportById(id);
  }

  validate () {
    const { step, data } = this.state;
    let state = prepStateForValidation(data);

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
    return validator.errors === null;
  }

  onSubmit (e) {
    e.preventDefault();
    const step = this.state.step;
    const result = this.validate();
    if (result) {
      if (step === 5) {
        const payload = convertStateToPayload(this.state.data);
        const userId = _get(this.props.user, 'data.id');
        if (userId) {
          payload.user = {pk: userId};
        } else {
          console.log('Could not read user ID from state');
        }
        // Is creating or updating?
        if (this.props.match.params.id) {
          this.props._updateFieldReport(this.props.match.params.id, payload);
        } else {
          this.props._createFieldReport(payload);
        }
        showGlobalLoading();
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
                  <button type='button' className={c('button button--secondary-bounded', {disabled: this.state.step <= 1})} title='Go back to previous step' onClick={this.onStepBackClick}>Back</button>
                  <button type='submit' className='button button--secondary-filled' title='Save and continue'>Save and continue</button>
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
    _updateFieldReport: T.func,
    _getFieldReportById: T.func,
    fieldReportForm: T.object,
    user: T.object,
    report: T.object,
    match: T.object,
    history: T.object
  };
}

// /////////////////////////////////////////////////////////////////// //
// Connect functions

const selector = (state, ownProps) => ({
  fieldReportForm: state.fieldReportForm,
  user: state.user,
  report: _get(state.fieldReport, ownProps.match.params.id, {
    data: {},
    fetching: false,
    fetched: false
  })
});

const dispatcher = (dispatch) => ({
  _createFieldReport: (...args) => dispatch(createFieldReport(...args)),
  _updateFieldReport: (...args) => dispatch(updateFieldReport(...args)),
  _getFieldReportById: (...args) => dispatch(getFieldReportById(...args))
});

export default connect(selector, dispatcher)(FieldReportForm);

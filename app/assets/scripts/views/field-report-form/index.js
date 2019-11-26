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
  step4 as schemaStep4
} from '../../schemas/field-report-form';
import * as formData from '../../utils/field-report-constants';
import { showAlert } from '../../components/system-alerts';
import { createFieldReport, updateFieldReport, getFieldReportById, getDistrictsForCountry } from '../../actions';
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
  FormInputSelect,
  FormTextarea,
  FormRadioGroup,
  FormError
} from '../../components/form-elements/';
import ActionsCheckboxes from './cmp-action-checkboxes.js';
import ContactRow from './cmp-contact-row.js';
import PlanResponseRow from './cmp-planned-response-row.js';
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
        const country = prefillState.country;
        if (country) this.updateDistricts(country);
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
    }
    validator(state);

    this.setState({ errors: _cloneDeep(validator.errors) });
    return validator.errors === null;
  }

  onSubmit (e) {
    e.preventDefault();
    if (this.props.fieldReportForm.fetching) {
      return;
    }
    const step = this.state.step;
    const result = this.validate();
    if (result) {
      if (step === 4) {
        const payload = convertStateToPayload(this.state.data);
        const userId = _get(this.props.user, 'data.id');
        if (userId) {
          payload.user = userId;
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

  updateDistricts (e) {
    this.props._getDistrictsForCountry(e);
    return true;
  }

  getDistrictChoices () {
    const { districts } = this.props;
    const country = this.state.data.country;
    if (!country) return [];
    const countryId = country.value;
    if (districts.hasOwnProperty(countryId) && districts[countryId].fetched) {
      return districts[countryId].data.results.map(d => {
        return {
          'value': d.id,
          'label': d.name
        };
      });
    } else {
      return [];
    }
  }

  onCountryChange (e) {
    this.updateDistricts(e);
    this.onFieldChange('country', e);
  }

  onFieldChange (field, e) {
    let data = _cloneDeep(this.state.data);
    let val = e && e.target ? e.target.value : e;

    // FIXME: handle this better. When we change to a react-select, we get a different data structure back from the select onChange
    if (field === 'disasterType') {
      val = val.value;
    }
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
      'Context',
      'Situation',
      'Actions',
      'Response'
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

  getStatus () {
    const status = this.state.data.status;
    return status === formData.statusEarlyWarning.value ? 'EW' : 'EVT';
  }

  renderStep1 () {
    const districtChoices = this.getDistrictChoices() || [];
    const fields = formData.fieldsStep1;
    const status = this.getStatus();
    return (
      <Fold title='Context' extraClass foldClass='margin-reset'>
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
        <FormInputSelect
          label={fields.summary[status].label}
          labelSecondary='Add Title'
          selectLabel='Link to Emergency'
          inputPlaceholder='Example: Malawi - Central Region: Floods 03/2019'
          selectPlaceholder='Click here to link to an existing hazard alert (if one exists)'
          type='text'
          name='summary'
          id='summary'
          maxLength={100}
          description={<div className='form__description'><p>{fields.summary[status].desc}</p><em>Example: 250 dead after an earthquake in Indonesia</em></div>}
          inputValue={this.state.data.summary}
          inputOnChange={this.onFieldChange.bind(this, 'summary')}
          selectOnChange={this.onFieldChange.bind(this, 'event')}
          selectValue={this.state.data.event}
          errors={this.state.errors}
          selectLoadOptions={getEventsFromApi}
          autoFocus >

          <FormError
            errors={this.state.errors}
            property='summary'
          />
        </FormInputSelect>
        <FormInput
          label={fields.startDate[status].label}
          type='date'
          name='startDate'
          id='startDate'
          value={this.state.data.startDate}
          onChange={this.onFieldChange.bind(this, 'startDate')}
          description={fields.startDate[status].desc}
        >
          <FormError
            errors={this.state.errors}
            property='start_date'
          />
        </FormInput>

        <div className='form__group'>
          <div className='form__inner-header'>
            <label className='form__label'>{fields.country[status].label}</label>
            <p className='form__description'>{fields.country[status].desc}</p>
          </div>
          <div className="form__inner-body clearfix">
            <div className="form__group__col__6">
              <Select
                placeholder='Select a country'
                name='country'
                value={this.state.data.country}
                onChange={this.onCountryChange.bind(this)}
                options={formData.countries}
              />

              <FormError
                errors={this.state.errors}
                property='country'
              />
            </div>
            <div className="form__group__col__6">
              <Select
                placeholder='Select Provinces / Regions'
                name='districts'
                value={this.state.data.districts}
                onChange={this.onFieldChange.bind(this, 'districts')}
                options={districtChoices}
                multi
              />

              <FormError
                errors={this.state.errors}
                property='districts'
              />
            </div>
          </div>
        </div>
        <div className='form__group'>
          <div className='form__inner-header'>
            <label className='form__label'>{fields['disaster-type'][status].label}</label>
          </div>
          <div className='form__inner-body'>
            <Select
              placeholder='Select a disaster type'
              name='disaster-type'
              id='disaster-type'
              options={formData.disasterType}
              value={this.state.data.disasterType}
              onChange={this.onFieldChange.bind(this, 'disasterType')}
            />
            <FormError
              errors={this.state.errors}
              property='disasterType'
            />
          </div>
        </div>
        <FormRadioGroup
          label={fields.assistance[status].label}
          description={fields.assistance[status].desc}
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
    const fields = formData.fieldsStep2;
    const status = this.getStatus();
    return (
      <Fold title='Numeric Details (People)'>
        <React.Fragment>
          {
            fields.situationFields[status].map(field => {
              return (
                <SourceEstimation
                  label={field.label}
                  description={field.desc}
                  name={field.name}
                  values={this.state.data[field.key]}
                  fieldKey={field.key}
                  key={field.key}
                  errors={this.state.errors}
                  onChange={this.onFieldChange.bind(this, field.key)}
                />
              );
            })
          }
        </React.Fragment>
        <React.Fragment>
          <FormTextarea
            label={fields.description[status].label}
            name='description'
            classInput='textarea--lg'
            placeholder='Example: According to the local government, the overflow of the Zimbizi river has caused extensive flood water damage to low income housing along the river bank. The majority of the affected households do not have sufficient insurance coverage for their assets. The local branch of the National Society is currently assessing how to best support the most vulnerable families affected by the disaster.'
            id='description'
            description={fields.description[status].desc}
            value={this.state.data.description}
            onChange={this.onFieldChange.bind(this, 'description')} >
            <FormError
              errors={this.state.errors}
              property='description'
            />
          </FormTextarea>
        </React.Fragment>
      </Fold>
    );
  }

  renderStep3 () {
    const fields = formData.fieldsStep3;
    const status = this.getStatus();
    // Note: There's no need for validation on this step.
    // All the fields are optional, and the text fields are just strings.
    return (
      <Fold title='Actions taken'>
        <div className='form__group'>
          {
            fields.section1fields.map(field => {
              if (!field[status]) {
                return null;
              }
              return (
                <FormInput
                label={field.label[status]}
                type='text'
                description={field.description ? field.description[status] : undefined}
                key={field.key}
                name={field.name}
                id={field.name}
                classWrapper='form__group--kv form__group--kv-actions'
                value={this.state.data[field.key]}
                onChange={this.onFieldChange.bind(this, field.key)} >
                  <FormError
                    errors={this.state.errors}
                    property={field.key}
                  />
                </FormInput>                
              )
            })
          }
        </div>
        <ActionsCheckboxes
          label='Actions Taken by National Society Red Cross (if any)'
          description='Select the activities undertaken by the National Society and briefly describe.'
          placeholder='Example: The two local branches of the National Society in the affected districts have provided first aid, psychosocial support and basic relief items to the affected families. An evacuation centre has been set up in a local school to accommodate those unable to return to their homes. Groups of Red Cross volunteers are helping the local search and rescue personnel in cleaning storm debris from houses and streets.'
          name='actions-nat-soc'
          classInput='textarea--lg'
          options={formData.actions}
          values={this.state.data.actionsNatSoc}
          onChange={this.onFieldChange.bind(this, 'actionsNatSoc')} />

        <ActionsCheckboxes
          label='Actions taken by the IFRC'
          description='Select the activities taken by the IFRC (could be the Regional office, cluster office or country office) and briefly describe.'
          placeholder='Brief description of the action'
          name='actions-federation'
          options={formData.actions}
          values={this.state.data.actionsFederation}
          onChange={this.onFieldChange.bind(this, 'actionsFederation')} />

        <ActionsCheckboxes
          label='Actions taken by any other RCRC Movement actors'
          description='Select the activities undertaken by any other RCRC Movement actor(s) and briefly describe.'
          placeholder='Brief description of the action'
          name='actions-pns'
          options={formData.actions}
          values={this.state.data.actionsPns}
          onChange={this.onFieldChange.bind(this, 'actionsPns')} />

        <FormRadioGroup
          label='Information Bulletin'
          description='Indicate if an Information Bulletin was published, is planned or if no Information Bulletin will be issued for this operation/disaster.'
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
          label='Actions Taken by Others (Governments, UN)'
          name='actions-others'
          id='actions-others'
          description='Who else was involved? UN agencies? NGOs? Government? Describe what other actors did.'
          placeholder='Brief description of the action'
          value={this.state.data.actionsOthers}
          onChange={this.onFieldChange.bind(this, 'actionsOthers')} />
      </Fold>
    );
  }

  renderStep4 () {
    const fields = formData.fieldsStep4;
    const status = this.getStatus();
    const plannedResponseRows = fields.plannedResponseRows.filter(row => {
      return !!row.label[status];
    })
    return (
      <Fold title='Planned Response'>
        <label className='form__label'>Planned International Response</label>
        <div className='form__description'>
          <p>Indicate status of global and regional tools.</p>
        </div>

        <React.Fragment>
          {
            plannedResponseRows.map(row => {
              return (
                <PlanResponseRow
                  label={row.label[status]}
                  key={row.key}
                  valueFieldLabel={row.valueFieldLabel}
                  name={row.name}
                  options={row.options}
                  values={this.state.data[row.key]}
                  errors={this.state.errors}
                  fieldKey={row.key}
                  onChange={this.onFieldChange.bind(this, row.key)}
                />                
              )
            })
          }

        </React.Fragment>

        <h2 className='fold__title fold__title--contact'>Contacts</h2>

        <React.Fragment>
          {
            fields.contactRows.map(row => {
              return (
                <ContactRow
                  label={row.label}
                  description={row.desc[status]}
                  name={row.name}
                  key={row.key}
                  values={this.state.data[row.key]}
                  fieldKey={row.key}
                  errors={this.state.errors}
                  onChange={this.onFieldChange.bind(this, row.key)}
                />
              )
            })
          }
        </React.Fragment>

        <FormRadioGroup
          label='This field report is visible to'
          name='visibility'
          options={formData.visibility}
          selectedOption={this.state.data.visibility}
          onChange={this.onFieldChange.bind(this, 'visibility')}
          classWrapper='form__group--visible-field-group'>
          <FormError
            errors={this.state.errors}
            property='visibility'
          />
        </FormRadioGroup>
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
        <h3>Page {this.state.step} of 4 incomplete.</h3>
        <p>To continue please fix:</p>
        <ul>
          {errors.map(o => <li key={o.dataPath}>{dataPathToDisplay(o.dataPath, o.keyword)}</li>)}
        </ul>
      </div>
    );
  }

  render () {
    const submitTitle = this.state.step === 4 ? 'Submit' : 'Save and Continue';
    return (
      <App className='page--frep-form'>
        <section className='inpage'>
          <header className='inpage__header'>
            <div className='inner'>
              <div className='iSave and Continuenpage__headline'>
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

                <div className='form__actions text-center'>
                  <button type='button' className={c('button button--secondary-bounded', {disabled: this.state.step <= 1})} title='Go back to previous step' onClick={this.onStepBackClick}>Back</button>
                  <button type='submit' className='button button--secondary-filled' title={submitTitle}>{submitTitle}</button>
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
    _getDistrictsForCountry: T.func,
    districts: T.object,
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
  }),
  districts: state.districts
});

const dispatcher = (dispatch) => ({
  _createFieldReport: (...args) => dispatch(createFieldReport(...args)),
  _updateFieldReport: (...args) => dispatch(updateFieldReport(...args)),
  _getFieldReportById: (...args) => dispatch(getFieldReportById(...args)),
  _getDistrictsForCountry: (...args) => dispatch(getDistrictsForCountry(...args))
});

export default connect(selector, dispatcher)(FieldReportForm);

import React from 'react';
import { connect } from 'react-redux';
import { PropTypes as T } from 'prop-types';
import _get from 'lodash.get';
import _set from 'lodash.set';
import _cloneDeep from 'lodash.clonedeep';
import isUndefined from 'lodash.isundefined';
import c from 'classnames';
import Select from 'react-select';
import { Helmet } from 'react-helmet';
import Ajv from 'ajv';
import ajvKeywords from 'ajv-keywords';

import { environment } from '#config';
import {
  step1 as schemaStep1,
  step2 as schemaStep2,
  step3 as schemaStep3,
  step4 as schemaStep4
} from '../../schemas/field-report-form';
import * as formData from '#utils/field-report-constants';
import { showAlert } from '#components/system-alerts';
import { createFieldReport, updateFieldReport, getFieldReportById, getDistrictsForCountry, getActions } from '#actions';
import { showGlobalLoading, hideGlobalLoading } from '#components/global-loading';
import BreadCrumb from '#components/breadcrumb';
import {
  dataPathToDisplay,
  prepStateForValidation,
  getEventsFromApi,
  getInitialDataState,
  convertStateToPayload,
  convertFieldReportToState,
  filterActions,
  checkFalse
} from './data-utils';

import App from '../app';
import Fold from '#components/fold';
import {
  FormInput,
  FormInputSelect,
  FormTextarea,
  FormRadioGroup,
  FormError
} from '#components/form-elements/';
import ActionsCheckboxes from './cmp-action-checkboxes.js';
import ContactRow from './cmp-contact-row.js';
import PlanResponseRow from './cmp-planned-response-row.js';
import SourceEstimation from './cmp-source-estimation.js';
import EPISourceEstimation from './cmp-source-epi';
import LanguageContext from '#root/languageContext';
import Translate from '#components/Translate';

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

    // Basic function to wait until user stops typing to query ES.
    // Code duplicate of components/header.js:40 (different timeout)
    let i = 0;
    this.slowLoad = input => {
      i += 1;
      let mirror = i;
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (i === mirror) {
            return resolve(getEventsFromApi(input));
          } else {
            return resolve({ options: [] });
          }
        }, 350);
      });
    };
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps (nextProps) {
    const { strings } = this.context;

    if (this.props.fieldReportForm.fetching && !nextProps.fieldReportForm.fetching) {
      hideGlobalLoading();
      if (nextProps.fieldReportForm.error) {
        const message = nextProps.fieldReportForm.error.error_message
          || nextProps.fieldReportForm.error.detail
          || nextProps.fieldReportForm.error[Object.keys(nextProps.fieldReportForm.error)[0]][0] // first key's value
          || strings.fieldReportFormSubmitError;
        showAlert('danger', <p><strong><Translate stringId="fieldReportFormErrorLabel" /></strong> {message}</p>, true, 4500);
      } else {
        const { history } = this.props;
        const { id } = nextProps.fieldReportForm.data;
        if (this.props.match.params.id) {
          showAlert('success', <p><Translate stringId="fieldReportFormRedirectMessage" /></p>, true, 2000);
        } else {
          showAlert('success', <p><Translate stringId="fieldReportFormRedirectMessage" /></p>, true, 2000);
        }
        setTimeout(() => history.push(`/reports/${id}`), 2000);
      }
    }

    if (this.props.actions.fetching && !nextProps.actions.fetching) {
      if (nextProps.actions.error) {
        showAlert('danger', (
          <p>
            <strong>
              <Translate stringId="fieldReportFormErrorLabel" />
            </strong>
            <Translate stringId="fieldReportFormLoadDataErrorMessage" />
          </p>
        ), true, 4500);
      } else {
        this.setActions(nextProps.actions.data.results);

        // only attempt to load existing report once we have actions in the State
        if (this.props.match.params.id) {
          // Editing the field report.
          this.getReport(this.props.match.params.id);
        }
      }
    }

    if (this.props.report.fetching && !nextProps.report.fetching) {
      hideGlobalLoading();
      if (!nextProps.report.error) {
        const prefillState = convertFieldReportToState(nextProps.report.data, this.state.data);
        this.setState({data: prefillState});
        const country = prefillState.country;
        if (country) this.updateDistricts(country);
      }
    }
  }

  componentDidMount () {
    // fetch actions data from backend
    this.props._getActions();
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
      showAlert('danger', (
        <p>
          <strong>
            <Translate stringId="fieldReportFormErrorLabel" />
          </strong>
          <Translate stringId="fieldReportFormErrorInFormMessage" />
        </p>
      ), true, 4500);
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

  onFieldChange = (field, e) => {
    let data = _cloneDeep(this.state.data);
    let val = e && e.target ? e.target.value : e;

    // if disaster type is epidemic, status must be 'Event'
    if (field === 'disasterType' &&
      formData.getIsEpidemicDisasterTypeByValue(val)
    ) {
      _set(data, 'status', formData.statusEventValue);
    }

    if (field === 'isCovidReport' && val && val === 'true') {
      _set(data, 'status', formData.statusEventValue);
      _set(data, 'disasterType', '1');
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
      showAlert('danger', (
        <p>
          <strong>
            <Translate stringId="fieldReportFormErrorLabel" />
          </strong>
          <Translate stringId="fieldReportFormErrorInFormMessage" />
        </p>
      ), true, 4500);
    }
  }

  renderStepper () {
    const { strings } = this.context;
    const status = this.getStatus();
    const step = this.state.step;
    const items = [
      {
        'EVT': strings.fieldReportFormItemContextLabel,
        'EPI': strings.fieldReportFormItemContextLabel,
        'EW': strings.fieldReportFormItemContextLabel
      },
      {
        'EVT': strings.fieldReportFormItemSituationLabel,
        'EPI': strings.fieldReportFormItemSituationLabel,
        'EW': strings.fieldReportFormItemRiskAnalysisLabel,
      },
      {
        'EVT': strings.fieldReportFormItemActionsLabel,
        'EPI': strings.fieldReportFormItemActionsLabel,
        'EW': strings.fieldReportFormItemEarlyActionsLabel
      },
      {
        'EVT': strings.fieldReportFormItemResponseLabel,
        'EPI': strings.fieldReportFormItemResponseLabel,
        'EW': strings.fieldReportFormItemResponseLabel
      },
    ];
    return (
      <div className='row'>
        <ol className='stepper'>
          {items.map((o, idx) => {
            const stepNum = idx + 1;
            const classes = c('stepper__item', {
              'stepper__item--complete': step > stepNum,
              'stepper__item--current': step === stepNum
            });
            return <li key={o[status]} className={classes}><a href='#' onClick={this.onStepperClick.bind(this, stepNum)}><span>{o[status]}</span></a></li>;
          })}
        </ol>
      </div>
    );
  }

  getStatus () {
    const { status, disasterType } = this.state.data;

    if (status === formData.statusEarlyWarningValue) {
      return 'EW';
    } else if (formData.getIsEpidemicDisasterTypeByValue(disasterType)) {
      return 'EPI';
    }

    return 'EVT';
  }

  /**
   * Modifies state.data to incorporate actions received from the API
   */
  setActions (actions) {
    const actionsNatSocOpts = checkFalse(filterActions(actions, 'NTLS'));
    const actionsPnsOpts = checkFalse(filterActions(actions, 'PNS'));
    const actionsFederationOpts = checkFalse(filterActions(actions, 'FDRN'));
    const newData = {
      ...this.state.data,
      actionsNatSoc: {
        ...this.state.data.actionsNatSoc,
        options: actionsNatSocOpts
      },
      actionsFederation: {
        ...this.state.data.actionsFederation,
        options: actionsFederationOpts
      },
      actionsPns: {
        ...this.state.data.actionsPns,
        options: actionsPnsOpts
      }
    };
    this.setState({'data': newData});
  }

  renderStep1 () {
    const { strings } = this.context;
    const districtChoices = this.getDistrictChoices() || [];
    const fields = formData.getFieldsStep1(strings);
    const status = this.getStatus();
    return (
      <Fold title='Context' extraClass foldClass='margin-reset'>
        <FormRadioGroup
          label={strings.fieldReportFormStatusLabel}
          name='status'
          options={formData.getStatus(strings).map(status => ({
            ...status,
            // If Epidemic, only 'Event' can be selected
            ...(
              !formData.getIsStatusEventByValue(status.value) &&
              formData.getIsEpidemicDisasterTypeByValue(this.state.data.disasterType) &&
              {disabled: true}
            )
          }))}
          selectedOption={this.state.data.status}
          onChange={this.onFieldChange.bind(this, 'status')}>
          <FormError
            errors={this.state.errors}
            property='status'
          />
        </FormRadioGroup>
        <FormRadioGroup
          label={strings.fieldReportFormCovidLabel}
          name='is-covid-report'
          // description='Is this a COVID-19 Field Report?'
          options={[{
            value: 'true',
            label: strings.fieldReportFormOptionYesLabel,
          }, {
            value: 'false',
            label: strings.fieldReportFormOptionNoLabel,
          }]}
          selectedOption={this.state.data.isCovidReport}
          onChange={this.onFieldChange.bind(this, 'isCovidReport')} >

          <FormError
            errors={this.state.errors}
            property='is_covid_report'
          />
        </FormRadioGroup>
        <FormInputSelect
          label={fields.summary[status].label}
          labelSecondary={strings.fieldReportFormTitleSecondaryLabel}
          selectLabel={strings.fieldReportFormTitleSelectLabel}
          inputPlaceholder={strings.fieldReportFormTitleInputPlaceholder}
          selectPlaceholder={strings.fieldReportFormTitleSelectPlaceholder}
          type='text'
          name='summary'
          id='summary'
          maxLength={100}
          description={
            <div className='form__description'>
              <p>{fields.summary[status].desc}</p>
              {/* <em>Example: GDACS Orange: Albania EQ Magnitude 5.4, Depth:10km(2019-11-30)</em> */}
            </div>
          }
          inputValue={this.state.data.summary}
          inputOnChange={this.onFieldChange.bind(this, 'summary')}
          selectOnChange={this.onFieldChange.bind(this, 'event')}
          selectValue={this.state.data.event}
          errors={this.state.errors}
          selectLoadOptions={this.slowLoad}
          disabled={!this.state.data.isCovidReport}
          autoFocus >

          <FormError
            errors={this.state.errors}
            property='summary'
          />
        </FormInputSelect>
        <div className='form__group'>
          <div className='form__inner-header'>
            <label className='form__label'>{fields.country[status].label}</label>
            <p className='form__description'>{fields.country[status].desc}</p>
          </div>
          <div className="form__inner-body clearfix">
            <div className="form__group__col__6">
              <Select
                placeholder={strings.fieldReportFormCountrySelectPlaceholder}
                name='country'
                value={this.state.data.country}
                onChange={this.onCountryChange.bind(this)}
                options={formData.countries}
                disabled={!this.state.data.isCovidReport}
              />

              <FormError
                errors={this.state.errors}
                property='country'
              />
            </div>
            <div className="form__group__col__6">
              <Select
                placeholder={strings.fieldReportFormRegionSelectPlaceholder}
                name='districts'
                value={this.state.data.districts}
                onChange={this.onFieldChange.bind(this, 'districts')}
                options={districtChoices}
                disabled={!this.state.data.isCovidReport}
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
            <p className='form__description'>{fields['disaster-type'][status].desc}</p>
          </div>
          <div className='form__inner-body'>
            <Select
              placeholder='Select a disaster type'
              name='disaster-type'
              id='disaster-type'
              disabled={ this.state.data.isCovidReport === 'true' || !this.state.data.isCovidReport }
              options={formData.disasterType}
              value={this.state.data.disasterType}
              onChange={({value}) => this.onFieldChange('disasterType', value)}
            />
            <FormError
              errors={this.state.errors}
              property='disasterType'
            />
          </div>
        </div>
        <FormInput
          label={fields.startDate[status].label}
          type='date'
          name='startDate'
          id='startDate'
          value={this.state.data.startDate}
          onChange={this.onFieldChange.bind(this, 'startDate')}
          description={fields.startDate[status].desc}
          disabled={!this.state.data.isCovidReport} >

          <FormError
            errors={this.state.errors}
            property='start_date'
          />
        </FormInput>
        <FormRadioGroup
          label={fields.assistance[status].label}
          description={fields.assistance[status].desc}
          name='assistance'
          options={[
            {
              label: strings.fieldReportFormOptionYesLabel,
              value: 'true',
              disabled: !this.state.data.isCovidReport
            },
            {
              label: strings.fieldReportFormOptionNoLabel,
              value: 'false',
              disabled: !this.state.data.isCovidReport
            }
          ]}
          selectedOption={this.state.data.assistance}
          onChange={this.onFieldChange.bind(this, 'assistance')} >
          <FormError
            errors={this.state.errors}
            property='assistance'
          />
        </FormRadioGroup>
        <FormRadioGroup
          label={fields['ns-assistance'][status].label}
          description={fields['ns-assistance'][status].desc}
          name='ns-assistance'
          options={[
            {
              label: strings.fieldReportFormOptionYesLabel,
              value: 'true',
              disabled: !this.state.data.isCovidReport
            },
            {
              label: strings.fieldReportFormOptionNoLabel,
              value: 'false',
              disabled: !this.state.data.isCovidReport
            }
          ]}
          selectedOption={this.state.data.nsAssistance}
          onChange={this.onFieldChange.bind(this, 'nsAssistance')} >
          <FormError
            errors={this.state.errors}
            property='nsAssistance'
          />
        </FormRadioGroup>
      </Fold>
    );
  }

  renderStep2 () {
    const { strings } = this.context;
    const fields = formData.getFieldsStep2(strings);
    const status = this.getStatus();
    const covidTag = this.state.data.isCovidReport === 'true' ? '-COV' : '';

    /** Indicate whether the date of data for an epidemic
     * is required: it is required when any of these fields
     * have data 
      * */
    let isSitFieldsDateRequired = [
      'epiCases',
      'epiSuspectedCases',
      'epiProbableCases',
      'epiConfirmedCases',
      'epiNumDead'
    ].reduce((acc, curVal) => {
      return !isUndefined(this.state.data[curVal]) || acc;
    }, false);
    const sitFieldsDateLabelMarker = isSitFieldsDateRequired ? ' *' : '';

    return (
      <Fold title='Numeric Details (People)'>
        {
          fields.situationFields[status + covidTag].map(field => {
            return status !== 'EPI'
              ? (
                <SourceEstimation
                  status={status}
                  estimationLabel={field.estimationLabel}
                  label={field.label}
                  description={field.desc}
                  name={field.name}
                  values={this.state.data[field.key]}
                  fieldKey={field.key}
                  key={field.key}
                  errors={this.state.errors}
                  onChange={this.onFieldChange.bind(this, field.key)}
                />
              )
              : (
                <EPISourceEstimation
                  estimationLabel={field.estimationLabel}
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

        { status === 'EPI'
          ? (
            <div className='form__group'>
              <div className='form__inner-header'>
                <div className='form__inner-headline'>
                  <label className='form__label'>
                    <Translate stringId="fieldReportFormEPISourceOfFiguresLabel" />
                  </label>
                  <p className='form__description'>
                    <Translate stringId="fieldReportFormEPISourceOfFiguresDescription" />
                  </p>
                </div>
              </div>
              <div className='form__inner-body'>
                <div key='epi-figures-source' className='estimation'>
                  <Select
                    placeholder='Source (of figures)'
                    name='epi-figures-source'
                    value={this.state.data.epiFiguresSource}
                    onChange={({value}) => this.onFieldChange('epiFiguresSource', value)}
                    options={formData.epiSources}
                  />
                  <FormError
                    errors={this.state.errors}
                    property='country'
                  />
                </div>
              </div>
            </div>
          )
          : null
        }

        {fields.sitFieldsDate[status] &&
          <FormInput
            label={fields.sitFieldsDate[status].label + sitFieldsDateLabelMarker}
            type='date'
            name={fields.sitFieldsDate[status].name}
            id={fields.sitFieldsDate[status].key}
            value={this.state.data[fields.sitFieldsDate[status].key]}
            onChange={this.onFieldChange.bind(this, `${fields.sitFieldsDate[status].key}`)}
            description={fields.sitFieldsDate[status].desc}
          >
            <FormError
              errors={this.state.errors}
              property={fields.sitFieldsDate[status].key}
            />
          </FormInput>
        }
        {/* TODO: update this to be a file upload */}
        <React.Fragment>
          <FormTextarea
            label={strings.fieldReportFormSourceDetailsLabel}
            name='other-sources'
            classInput='textarea--lg'
            placeholder={status === 'EPI' ? strings.fieldReportFormSourceDetailsEPIPlaceholder : strings.fieldReportFormSourceDetailsPlaceholder }
            id='other-sources'
            description={strings.fieldReportFormSourceDetailsDescription}
            value={this.state.data.otherSources}
            onChange={this.onFieldChange.bind(this, 'otherSources')} >
            <FormError
              errors={this.state.errors}
              property='otherSources'
            />
          </FormTextarea>
        </React.Fragment>
        <React.Fragment>
          <FormTextarea
            label={fields.description[status].label}
            name='description'
            classInput='textarea--lg'
            placeholder={fields.description[status].placeholder}
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
    const { strings } = this.context;
    const fields = formData.getFieldsStep3(strings);
    const status = this.getStatus();

    // only for filtering the list of actions, we use the COVID type,
    // all other elements will follow the same as the EPI status.
    const actionsStatus = this.state.data.isCovidReport === 'true' ? 'COVID' : status;

    const { actions } = this.props;

    // ideally, this should never happen, but handle it.
    if (!actions.fetched) {
      if (!actions.fetching) this.props._getActions();
      return (
        <div>
          <Translate stringId="fieldReportFormActionDataLoadingMessage" />
        </div>
      );
    }

    const actionsData = actions.data.results;

    // Note: There's no need for validation on this step.
    // All the fields are optional, and the text fields are just strings.
    return (
      <Fold title={strings.fieldReportFormActionTakenTitle}>
        <div className='form__group'>
          {
            fields.section1fields.map(field => {
              if (!field[status]) {
                return null;
              }
              if (this.state.data.isCovidReport === 'true' && !field[status + '-COV']) {
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
              );
            })
          }
        </div>
        <React.Fragment>
          {
            fields.checkboxSections.map(section => {
              // We need the number of values to match the number of options
              // We filter out values so that values corresponds exactly to options
              // FIXME: perhaps this can be handled cleaner / somewhere else?
              const options = filterActions(actionsData, section.action_type, actionsStatus);
              const values = this.state.data[section.key];
              const sectionValues = options.map(o => {
                return {
                  value: o.value,
                  checked: values.options.find(v => v.value === o.value).checked
                };
              });
              values.options = sectionValues;

              const description = this.state.data.isCovidReport === 'true' ? section.desc[status + '-COV'] : section.desc[status];

              return (
                <ActionsCheckboxes
                  label={section.label[status]}
                  description={description}
                  placeholder={section.placeholder[status]}
                  name={section.name}
                  key={section.key}
                  classInput='textarea--lg'
                  options={filterActions(actionsData, section.action_type, actionsStatus)}
                  values={this.state.data[section.key]}
                  onChange={this.onFieldChange.bind(this, section.key)}
                />
              );
            })
          }
        </React.Fragment>
        <FormRadioGroup
          label={strings.fieldReportFormInformationBulletinLabel}
          description={strings.fieldReportFormInformationBulletinDescription}
          name='bulletin'
          classWrapper={this.state.data.isCovidReport === 'true' ? 'hidden' : null}
          options={[
            {
              label: strings.fieldReportFormOptionNoLabel,
              value: '0'
            },
            {
              label: strings.fieldReportFormOptionPlannedLabel,
              value: '2'
            },
            {
              label: strings.fieldReportFormOptionPublishedLabel,
              value: '3'
            }
          ]}
          selectedOption={this.state.data.bulletin}
          onChange={this.onFieldChange.bind(this, 'bulletin')} />

        <FormTextarea
          label={fields.actionsOthers.label[status]}
          name='actions-others'
          id='actions-others'
          classInput='textarea--lg'
          description={fields.actionsOthers.desc[status]}
          placeholder={strings.fieldReportFormOthersActionsPlaceholder}
          value={this.state.data.actionsOthers}
          onChange={this.onFieldChange.bind(this, 'actionsOthers')} />
      </Fold>
    );
  }

  renderStep4 () {
    const { strings } = this.context;
    const fields = formData.getFieldsStep4(strings);
    const status = this.getStatus();
    const plannedResponseRows = fields.plannedResponseRows.filter(row => {
      return !!row.label[status];
    });
    let responseTitle = status === 'EVT' ? strings.fieldReportFormResponseTitleEVT : strings.fieldReportFormResponseTitle;

    // We hide the entire Planned International Response section for COVID reports
    const isCovidReport = this.state.data.isCovidReport;
    if (isCovidReport === 'true') {
      responseTitle = '';
    }
    return (
      <Fold title={responseTitle}>
        { this.state.data.isCovidReport === 'true' ? null : (
          <React.Fragment>
            <label className='form__label'>
              <Translate stringId="fieldReportFormResponseLabel" />
            </label>
            <div className='form__description'>
              <Translate stringId="fieldReportFormResponseLabel" />
              <p>
                <Translate stringId="fieldReportFormResponseDescription" />
              </p>
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
                  );
                })
              }

            </React.Fragment>
          </React.Fragment>
        )}

        <h2 className='fold__title fold__title--contact'>
          <Translate stringId="fieldReportFormContactsTitle" />
        </h2>

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
              );
            })
          }
        </React.Fragment>

        <FormRadioGroup
          label={strings.fieldReportFormVisibilityLabel}
          name='visibility'
          options={formData.getVisibility(strings)}
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
        <h3>
          <Translate
            stringId='fieldReportIncomplete'
            params={{
              step: this.state.step,
            }}
          />
        </h3>
        <p>
          <Translate stringId='fieldReportFix'/>
        </p>
        <ul>
          {errors.map(o => <li key={o.dataPath}>{dataPathToDisplay(o.dataPath, o.keyword)}</li>)}
        </ul>
      </div>
    );
  }

  render () {
    const { strings } = this.context;
    const submitTitle = this.state.step === 4 ? strings.fieldReportSubmit : strings.fieldReportContinue;
    return (
      <App className='page--frep-form'>
        <Helmet>
          <title>{ strings.fieldReportFormPageTitle }</title>
        </Helmet>
        <BreadCrumb crumbs={[
          {link: this.props.location.pathname, name: strings.fieldReportFormBreadCrumbCurrentPageTitle},
          {link: '/', name: strings.fieldReportFormBreadCrumbHomePageTitle}
        ]} />
        <section className='inpage'>
          <header className='inpage__header'>
            <div className='inner'>
              <div className='iSave and Continuenpage__headline'>
                <h1 className='inpage__title'>
                  <Translate stringId='fieldReportCreate'/>
                </h1>
                {this.renderStepper()}
              </div>
            </div>
          </header>
          <div className='inpage__body'>
            <div className='inner'>
              <form className='form form--field-report row' onSubmit={this.onSubmit}>
                {this[`renderStep${this.state.step}`]()}
                {this.renderErrorSummary()}

                <div className='form__actions text-center'>
                  <button type='button' className={c('button button--secondary-bounded', {disabled: this.state.step <= 1})} title={strings.fieldReportGoBack} onClick={this.onStepBackClick}><Translate stringId='fieldReportBack'/></button>
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
    location: T.object,
    history: T.object
  };
}

// /////////////////////////////////////////////////////////////////// //
// Connect functions

const selector = (state, ownProps) => ({
  fieldReportForm: state.fieldReportForm,
  actions: state.actions,
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
  _getDistrictsForCountry: (...args) => dispatch(getDistrictsForCountry(...args)),
  _getActions: (...args) => dispatch(getActions(...args))
});
FieldReportForm.contextType = LanguageContext;
export default connect(selector, dispatcher)(FieldReportForm);

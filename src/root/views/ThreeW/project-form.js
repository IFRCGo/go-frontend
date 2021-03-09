import React from 'react';
import Faram, {
  requiredCondition,
} from '@togglecorp/faram';
import _cs from 'classnames';
import { connect } from 'react-redux';
import memoize from 'memoize-one';
import {
  isFalsy,
  isInteger,
  isDefined,
} from '@togglecorp/fujs';

import BlockLoading from '#components/block-loading';

import SelectInput from '#components/form-elements/select-input';
import TextInput from '#components/form-elements/text-input';
import NumberInput from '#components/form-elements/number-input';
import DateInput from '#components/form-elements/date-input';
import Checkbox from '#components/form-elements/faram-checkbox';
import TextOutput from '#components/text-output';
import LanguageContext from '#root/languageContext';
import Translate from '#components/Translate';

import { allCountriesSelector } from '#selectors';

import {
  getDistrictsForCountryPF,
  getEventList,
  postProject,
} from '#actions';

import { disasterTypesSelectSelector } from '#selectors';
import { getResultsFromResponse } from '#utils/request';

import {
  // statusList,
  statuses,
  sectorList,
  secondarySectorInputValues,
  secondarySectorList,
  programmeTypeList,
  operationTypeList,
  projectVisibilityList,
} from '#utils/constants';

import { compareString } from '#utils/utils';

const positiveIntegerCondition = (value) => {
  const ok = (value === undefined || value === '') || ((!Number.isNaN(value)) && (isFalsy(value) || isInteger(+value)) && (+value >= 0));
  return {
    ok,
    message: 'Value must be a positive integer',
  };
};

/*
const statusOptions = statusList.map(p => ({
  value: p.key,
  label: p.title,
})).sort(compareString);
*/

const sectorOptions = sectorList.map(p => ({
  value: p.inputValue,
  label: p.title,
})).sort(compareString);

const secondarySectorOptions = secondarySectorList.map(p => ({
  value: p.inputValue,
  label: p.title,
})).sort(compareString);

const programmeTypeOptions = programmeTypeList.map(p => ({
  value: p.key,
  label: p.title,
})).sort(compareString);

const operationTypeOptions = [...operationTypeList].sort(compareString);
const projectVisibilityOptions = [...projectVisibilityList].sort(compareString);

const InputSection = (p) => {
  const {
    className,
    title,
    children,
    helpText,
    tooltip,
  } = p;

  return (
    <div className={_cs(className, 'project-form-input-section')}>
      <div
        className='section-title'
        title={tooltip}
      >
        <div className='tc-title'>
          { title }
        </div>
        { helpText && (
          <div className='tc-help-text'>
            { helpText }
          </div>
        )}
      </div>
      <div className='section-content'>
        { children }
      </div>
    </div>
  );
};

const emptyList = [];
const emptyObject = [];

const invalidEndDateError = {
  end_date: 'End date must be greater than start date',
};
const validateDate = (start, end) => {
  if (!start || !end) {
    return emptyObject;
  }

  const startDate = new Date(start);
  const endDate = new Date(end);

  if (startDate.getTime() >= endDate.getTime()) {
    return invalidEndDateError;
  }

  return emptyObject;
};

class ProjectForm extends React.PureComponent {
  constructor (props) {
    super(props);

    this.defaultSchema = {
      fields: {
        is_project_completed: [],
        actual_expenditure: [requiredCondition, positiveIntegerCondition],
        budget_amount: [requiredCondition, positiveIntegerCondition],
        project_country: [],
        event: [],
        dtype: [],
        project_districts: [requiredCondition],
        name: [requiredCondition],
        operation_type: [requiredCondition],
        primary_sector: [requiredCondition],
        programme_type: [requiredCondition],
        end_date: [requiredCondition],
        start_date: [requiredCondition],
        reached_other: [positiveIntegerCondition],
        reached_female: [positiveIntegerCondition],
        reached_male: [positiveIntegerCondition],
        reached_total: [positiveIntegerCondition],
        reporting_ns: [requiredCondition],
        secondary_sectors: [],
        status: [requiredCondition],
        target_other: [positiveIntegerCondition],
        target_female: [positiveIntegerCondition],
        target_male: [positiveIntegerCondition],
        target_total: [requiredCondition, positiveIntegerCondition],
        visibility: [requiredCondition],
      },
    };

    const { projectData = {} } = props;
    const getDefaultDistrictValue = (district) => {
      if (Array.isArray(district)) {
        return district;
      }

      if (isDefined(district)) {
        return [district];
      }

      return [];
    };

    this.state = {
      faramValues: {
        actual_expenditure: projectData.actual_expenditure,
        budget_amount: projectData.budget_amount,
        project_country: props.countryId,
        event: projectData.event,
        dtype: projectData.dtype,
        project_districts: getDefaultDistrictValue(projectData.project_districts),
        name: projectData.name,
        operation_type: projectData.operation_type,
        primary_sector: projectData.primary_sector,
        programme_type: projectData.programme_type,
        end_date: projectData.end_date,
        start_date: projectData.start_date,
        reached_other: projectData.reached_other || undefined,
        reached_female: projectData.reached_female || undefined,
        reached_male: projectData.reached_male || undefined,
        reached_total: projectData.reached_total || undefined,
        reporting_ns: projectData.reporting_ns,
        secondary_sectors: projectData.secondary_sectors ? projectData.secondary_sectors.map(d => secondarySectorInputValues[d]) : [],
        is_project_completed: projectData.status === 2,
        status: projectData.status,
        target_other: projectData.target_other || undefined,
        target_female: projectData.target_female || undefined,
        target_male: projectData.target_male || undefined,
        target_total: projectData.target_total || undefined,
        visibility: projectData.visibility || 'public',
      },
      faramErrors: {},
    };

    this.props._getDistricts(props.countryId);
  }

  componentDidMount () {
    // this.props._getCountries();

    if (this.props.countryId) {
      this.props._getEventList(this.props.countryId);
    }
  }

  getCountryAndNationalSocietyOptions = (countries) => {
    let countryList = getResultsFromResponse(countries);
    countryList = countryList.filter(c => c.record_type === 1);

    const nationalSocietyOptions = countryList
      .filter(d => d.society_name)
      .filter(c => c.independent !== false) // includes null values (ICRC / IFRC)
      .map(d => ({
        value: d.id,
        label: d.society_name,
      })).sort(compareString);

    const countryOptions = countryList
      .filter(d => d.iso)
      .filter(c => c.independent === true)  // excludes null values (ICRC / IFRC)
      .map(d => ({
        value: d.id,
        label: d.name,
      })).sort(compareString);

    return {
      nationalSocietyOptions,
      countryOptions,
    };
  }

  getDistrictOptions = (districtResponse, countryId) => {
    if (!districtResponse) {
      return emptyList;
    }

    const currentDistrictResponse = districtResponse[countryId];
    if (!currentDistrictResponse) {
      return emptyList;
    }

    const districtList = getResultsFromResponse(currentDistrictResponse, emptyObject);
    if (!districtList) {
      return emptyList;
    }

    const mappedDistrictList = districtList.map(d => ({
      value: d.id,
      label: d.name,
    })).sort(compareString);

    /*
    mappedDistrictList.unshift({
      value: 'all',
      label: 'Countrywide',
    });
    */

    return mappedDistrictList;
  }

  getCurrentOperationOptions = (response) => {
    const currentOperationList = getResultsFromResponse(response);

    if (!currentOperationList) {
      return emptyList;
    }

    const currentOperationOptions = currentOperationList.map(d => ({
      value: d.id,
      label: d.name,
    }));

    const operationToDisasterMap = {};
    currentOperationList.forEach(d => { operationToDisasterMap[d.id] = (d.dtype || {}).id; });

    const currentEmergencyOperationOptions = currentOperationList
      .filter(d => d.auto_generated_source === 'New field report')
      .map(d => ({
        value: d.id,
        label: d.name,
      }));

    return {
      currentOperationOptions,
      currentEmergencyOperationOptions,
      operationToDisasterMap,
    };
  }

  getProjectStatusFaramValue = memoize((start, isCompleted) => {
    if (isCompleted) {
      return { status: '2' };
    }

    if (!start) {
      return { status: undefined };
    }

    const startDate = new Date(start);
    const today = new Date();

    if (startDate.getTime() <= today.getTime()) {
      return { status: '1' };
    }

    return { status: '0' };
  })

  getTargetedTotalFaramValue = memoize((male, female, other) => {
    if (isFalsy(male) && isFalsy(female) && isFalsy(other)) {
      return {};
    }

    return {
      target_total: (+male || 0) + (+female || 0) + (+other || 0),
    };
  })

  getReachedTotalFaramValue = memoize((male, female, other) => {
    if (isFalsy(male) && isFalsy(female) && isFalsy(other)) {
      return {};
    }

    return {
      reached_total: (+male || 0) + (+female || 0) + (+other || 0),
    };
  })

  handleFaramChange = (faramValues, faramErrors) => {
    const { faramValues: oldFaramValues } = this.state;
    const { eventList } = this.props;

    const extraFaramErrors = validateDate(faramValues.start_date, faramValues.end_date);
    const autoProjectStatus = this.getProjectStatusFaramValue(faramValues.start_date, faramValues.is_project_completed);
    const autoTargetedTotal = this.getTargetedTotalFaramValue(faramValues.target_male, faramValues.target_female, faramValues.target_other);
    const autoReachedTotal = this.getReachedTotalFaramValue(faramValues.reached_male, faramValues.reached_female, faramValues.reached_other);

    let newFaramValues = {
      ...faramValues,
      ...autoProjectStatus,
      ...autoTargetedTotal,
      ...autoReachedTotal,
    };

    let newFaramErrors = {
      ...extraFaramErrors,
      ...faramErrors,
    };

    if (oldFaramValues.is_project_completed !== faramValues.is_project_completed && faramValues.is_project_completed && !isDefined(faramValues.actual_expenditure)) {
      newFaramValues.actual_expenditure = faramValues.budget_amount;
    }

    if (oldFaramValues.budget_amount !== faramValues.budget_amount) {
      newFaramValues.actual_expenditure = faramValues.budget_amount;
    }

    if (oldFaramValues.event !== faramValues.event) {
      const { operationToDisasterMap } = this.getCurrentOperationOptions(eventList);
      const dtype = operationToDisasterMap[faramValues.event];

      newFaramValues = {
        ...newFaramValues,
        dtype,
      };
    }

    if (oldFaramValues.project_country !== faramValues.project_country) {
      this.props._getDistricts(faramValues.project_country);
      this.props._getEventList(faramValues.project_country);

      newFaramValues = {
        ...newFaramValues,
        project_districts: [],
        event: undefined,
      };
    }

    this.setState({
      faramValues: newFaramValues,
      faramErrors: newFaramErrors,
    });
  }

  handleFaramValidationSuccess = (faramValues) => {
    const {
      projectData,
      _postProject,
    } = this.props;
    const data = { ...faramValues };

    if (projectData && projectData.id) {
      data['id'] = projectData.id;
    }

    _postProject(data);
  }

  handleFaramValidationFailure = (faramErrors) => {
    console.warn(faramErrors);
    this.setState({ faramErrors });
    alert('Please fill in all the required fields before submitting.');
  }

  getBudgetAndTotalNotRequired = (selectedNS, nsOptions) => {
    const ns = nsOptions.find(d => d.value === selectedNS);

    if (ns?.label === 'ICRC') {
      return true;
    }

    return false;
  }

  // Generate schema dynamically
  getSchema = memoize((operationType, programmeType, projectStatus, isBudgetAndTotalNotRequired) => {
    const schema = {
      fields: { ...this.defaultSchema.fields }
    };

    if (isBudgetAndTotalNotRequired) {
      schema.fields.budget_amount = [positiveIntegerCondition];
      schema.fields.actual_expenditure = [positiveIntegerCondition];
      schema.fields.target_total = [positiveIntegerCondition];
    }

    // operationType: 1 = Emergency operation
    // programmeType: 1 = Multilateral
    // programmeType: 2 = Domestic
    if (String(operationType) === '1' && (String(programmeType) === '1' || String(programmeType) === '2')) {
      schema.fields.event = [requiredCondition];
    }

    // projectStatus: 2 = Completed
    if (String(projectStatus) === '2' && !isBudgetAndTotalNotRequired) {
      schema.fields.reached_total = [requiredCondition, positiveIntegerCondition];
      schema.fields.budget_amount = [positiveIntegerCondition];
    }

    return schema;
  });

  getFilteredSecondarySectorOptions = memoize((sector) => (
    secondarySectorOptions.filter(d => d.value !== sector)
  ))

  handleSelectAllDistrictButtonClick = () => {
    const { districts } = this.props;
    const {
      faramValues,
      faramErrors,
    } = this.state;

    const districtOptions = this.getDistrictOptions(districts, faramValues.project_country);
    const newFaramValues = {
      ...faramValues,
      project_districts: districtOptions.map(d => d.value),
    };
    const newFaramErrors = {
      ...faramErrors,
      project_districts: undefined,
    };

    this.setState({
      faramValues: newFaramValues,
      faramErrors: newFaramErrors,
    });
  }

  render () {
    const {
      countries,
      districts,
      eventList,
      projectForm,
    } = this.props;

    const {
      nationalSocietyOptions,
      countryOptions,
    } = this.getCountryAndNationalSocietyOptions(countries);

    const {
      faramValues,
      faramErrors,
    } = this.state;

    const districtOptions = this.getDistrictOptions(districts, faramValues.project_country);
    const {
      currentOperationOptions,
      currentEmergencyOperationOptions,
    } = this.getCurrentOperationOptions(eventList);

    const fetchingCountries = countries && countries.fetching;
    const shouldDisableCountryInput = fetchingCountries;

    const fetchingDistricts = districts && districts[faramValues.project_country] && districts[faramValues.project_country].fetching;
    const shouldDisableDistrictInput = fetchingCountries || fetchingDistricts;
    const fetchingEvents = eventList && eventList.fetching;
    const shouldDisableCurrentOperation = fetchingEvents;
    const fetchingNationalSocieties = fetchingCountries;
    const shouldDisableNationalSocietyInput = fetchingNationalSocieties;

    const projectFormPending = projectForm.fetching;
    const shouldDisableSubmitButton = projectFormPending || fetchingCountries || fetchingDistricts;

    const shouldShowCurrentEmergencyOperation = String(faramValues.operation_type) === '1' &&
      String(faramValues.programme_type) === '2';
    const shouldShowCurrentOperation = String(faramValues.operation_type) === '1' &&
      String(faramValues.programme_type) === '1';

    const isBudgetAndTotalNotRequired = this.getBudgetAndTotalNotRequired(faramValues.reporting_ns, nationalSocietyOptions);

    const shouldShowDisasterType = String(faramValues.operation_type) === '0' ||
      shouldShowCurrentOperation ||
      shouldShowCurrentEmergencyOperation;
    const shouldDisableDisasterType = String(faramValues.operation_type) === '1';
    const isReachedTotalRequired = String(faramValues.status) === '2' && !isBudgetAndTotalNotRequired;
    const isTargetTotalRequired = !isBudgetAndTotalNotRequired;

    const schema = this.getSchema(
      faramValues.operation_type,
      faramValues.programme_type,
      faramValues.status,
      isBudgetAndTotalNotRequired,
    );

    const shouldDisableTotalTarget = !isFalsy(faramValues.target_male) || !isFalsy(faramValues.target_female) || !isFalsy(faramValues.target_other);
    const shouldDisableTotalReached = !isFalsy(faramValues.reached_male) || !isFalsy(faramValues.reached_female) || !isFalsy(faramValues.reached_other);
    const filteredSecondarySectorOptions = this.getFilteredSecondarySectorOptions(faramValues.sector);

    const hasNonFieldErrors = projectForm.error;
    const { strings } = this.context;

    return (
      <React.Fragment>
        { projectForm.fetching && <BlockLoading /> }
        <Faram
          className='project-form'
          schema={schema}
          value={faramValues}
          error={faramErrors}
          onChange={this.handleFaramChange}
          onValidationSuccess={this.handleFaramValidationSuccess}
          onValidationFailure={this.handleFaramValidationFailure}
          disabled={projectForm.fetching}
        >
          <InputSection
            title={strings.projectFormReportingNational}
            helpText={strings.projectFormReportingHelpText}
            tooltip={strings.projectFormReportingTooltip}
          >
            <SelectInput
              faramElementName='reporting_ns'
              className='project-form-select'
              options={nationalSocietyOptions}
              placeholder={fetchingNationalSocieties ? strings.projectFormFetching : undefined}
              disabled={shouldDisableNationalSocietyInput}
            />
          </InputSection>

          <InputSection
            className='multi-input-section'
            title={strings.projectFormCountryTitle}
            helpText={strings.projectFormCountryHelpText}
            tooltip={strings.projectFormCountryTooltip}
          >
            <SelectInput
              faramElementName='project_country'
              label={strings.projectFormCountryLabel}
              className='project-form-select'
              options={countryOptions}
              clearable={false}
              disabled={shouldDisableCountryInput}
              placeholder={fetchingCountries ? strings.projectFormCountryPlaceholder : undefined}
            />
            <div className="district-select-container">
              <SelectInput
                faramElementName='project_districts'
                label={strings.projectFormDistrictLabel}
                className='project-form-select'
                options={districtOptions}
                disabled={shouldDisableDistrictInput}
                placeholder={fetchingDistricts ? strings.projectFormDistrictFetching : strings.projectFormDistrictSelect }
                multi
              />
              <button
                type="button"
                className={_cs('button button--secondary-bounded', shouldDisableDistrictInput && 'disabled')}
                disabled={shouldDisableDistrictInput}
                onClick={this.handleSelectAllDistrictButtonClick}
              >
                <Translate stringId='projectFormAll'/>
              </button>
            </div>
          </InputSection>

          <InputSection
            className='multi-input-section'
            title={strings.projectFormTypeOfOperation}
            tooltip={strings.projectFormTypeOfOperationTooltip}
            helpText={
              <React.Fragment>
                <b>{strings.projectFormProgrammeType}</b>
                {strings.projectFormProgrammeTooltip}
              </React.Fragment>
            }
          >
            <SelectInput
              faramElementName='operation_type'
              label={strings.projectFormOperationType}
              className='project-form-select'
              options={operationTypeOptions}
            />
            <SelectInput
              faramElementName='programme_type'
              label={strings.projectFormProgrammeTypeLabel}
              className='project-form-select'
              options={programmeTypeOptions}
            />
          </InputSection>

          { shouldShowCurrentOperation && (
            <InputSection
              title={strings.projectFormCurrentOperation}
            >
              <SelectInput
                faramElementName='event'
                className='project-form-select'
                options={currentOperationOptions}
                disabled={shouldDisableCurrentOperation}
                placeholder={fetchingEvents ? 'Fetching events...' : undefined}
              />
            </InputSection>
          )}

          { shouldShowCurrentEmergencyOperation && (
            <InputSection
              title={strings.projectFormCurrentEmergency}
              helpText={strings.projectFormCurrentEmergencyHelpText}
            >
              <SelectInput
                faramElementName='event'
                className='project-form-select'
                options={currentEmergencyOperationOptions}
                disabled={shouldDisableCurrentOperation}
                placeholder={fetchingEvents ? strings.projectFormFetchingEvents : undefined}
              />
            </InputSection>
          )}

          { shouldShowDisasterType && (
            <InputSection
              title={strings.projectFormDisasterType}
            >
              <SelectInput
                faramElementName='dtype'
                className='project-form-select'
                options={this.props.disasterTypesSelect}
                disabled={shouldDisableDisasterType}
                placeholder={shouldDisableDisasterType ? strings.projectFormDisasterTypePlaceholder : undefined}
              />
            </InputSection>
          )}

          <InputSection
            title={strings.projectFormProjectName}
            helpText={strings.projectFormHelpText}
            tooltip={strings.projectFormTooltip}
          >
            <TextInput
              faramElementName='name'
            />
          </InputSection>

          <InputSection
            className='multi-input-section'
            title={strings.projectFormSectorTitle}
            helpText={
              <React.Fragment>
                <div>
                  <b>
                    {strings.projectFormPrimarySector}
                  </b>
                  {strings.projectFormPrimarySectorText}
                </div>
                <div>
                  <b>
                    {strings.projectFormTagging}
                  </b>
                  {strings.projectFormTaggingText}
                </div>
              </React.Fragment>
            }
            tooltip={strings.projectFormTaggingTooltip}
          >
            <SelectInput
              faramElementName='primary_sector'
              className='project-form-select'
              label={strings.projectFormPrimarySectorSelect}
              options={sectorOptions}
            />
            <SelectInput
              faramElementName='secondary_sectors'
              className='project-form-select'
              label={strings.projectFormSecondarySectorLabel}
              options={filteredSecondarySectorOptions}
              multi
            />
          </InputSection>

          <InputSection
            className='multi-input-section'
            title={strings.projectFormMultiLabel}
            helpText={strings.projectFormMultiLabelHelpText}
            tooltip={strings.projectFormMultiLabelTooltip}
          >
            <DateInput
              faramElementName='start_date'
              label={strings.projectFormStartDate}
            />
            <DateInput
              faramElementName='end_date'
              label={strings.projectFormEndDate}
            />
          </InputSection>

          <InputSection
            className='multi-input-section'
            // TODO: use translations
            title={`Budget and Status${isBudgetAndTotalNotRequired ? '' : '*'}`}
            helpText={
              <React.Fragment>
                <div>
                  <b>
                    {strings.projectFormBudget}
                  </b>
                  {strings.projectFormBudgetText}
                </div>
                <div>
                  <b>
                    {strings.projectFormProjectStatus}
                  </b>
                  {strings.projectFormProjectStatusText}
                </div>
              </React.Fragment>
            }
            tooltip={strings.projectFormProjectTooltip}
          >
            {/* TODO: use translations */}
            { faramValues.is_project_completed ? (
              <NumberInput
                label='Actual Expenditure (CHF)'
                faramElementName='actual_expenditure'
              />
            ) : (
              <NumberInput
                label='Project Budget (CHF)'
                faramElementName='budget_amount'
              />
            )}
            <div>
              <Checkbox
                label={strings.projectFormProjectCompleted}
                faramElementName="is_project_completed"
              />
              <TextOutput
                label={strings.projectFormProjectStatusTitle}
                value={statuses[faramValues.status]}
              />
            </div>
          </InputSection>

          <InputSection
            className='multi-input-section'
            title={strings.projectFormPeopleTageted}
            helpText={strings.projectFormPeopleTagetedHelpText}
            tooltip={strings.projectFormPeopleTagetedTooltip}
          >
            <NumberInput
              faramElementName='target_male'
              label={strings.projectFormMale}
            />
            <NumberInput
              faramElementName='target_female'
              label={strings.projectFormFemale}
            />
            <NumberInput
              faramElementName='target_other'
              label={strings.projectFormOther}
            />
            <NumberInput
              disabled={shouldDisableTotalTarget}
              faramElementName='target_total'
              // TODO: use translations
              label={isTargetTotalRequired ? 'Total* ' : 'Total'}
            />
          </InputSection>

          <InputSection
            className='multi-input-section'
            title={strings.projectFormPeopleReached}
            helpText={strings.projectFormPeopleReachedHelpText}
            tooltip={strings.projectFormPeopleReachedTooltip}
          >
            <NumberInput
              faramElementName='reached_male'
              label={strings.projectFormPeopleReachedMale}
            />
            <NumberInput
              faramElementName='reached_female'
              label={strings.projectFormPeopleReachedFemale}
            />
            <NumberInput
              faramElementName='reached_other'
              label={strings.projectFormPeopleReachedOther}
            />
            <NumberInput
              disabled={shouldDisableTotalReached}
              faramElementName='reached_total'
              label={isReachedTotalRequired ? 'Total* ' : 'Total'}
            />
          </InputSection>
          <InputSection
            title={strings.projectFormProjectVisibility}
          >
            <SelectInput
              faramElementName='visibility'
              className='project-form-select'
              options={projectVisibilityOptions}
              helpText={strings.projectFormProjectVisibilityHelpText}
              tooltip={strings.projectFormProjectVisibilityTooltip}
              clearable={false}
            />
          </InputSection>
          { hasNonFieldErrors && (
            <div className='tc-non-field-errors'>
              <Translate stringId='projectFormError'/>
            </div>
          )}

          <footer className='tc-footer'>
            {/*
              The first hidden and disabled submit button is to disable form submission on enter
              more details on: https://www.w3.org/TR/2018/SPSD-html5-20180327/forms.html#implicit-submission
            */}
            <button
              className='three-w-hidden-submit-button'
              type="submit"
              disabled
            />
            <button
              className={_cs('button button--primary-bounded', shouldDisableSubmitButton && 'disabled')}
              type="submit"
              disabled={shouldDisableSubmitButton}
            >
              { projectFormPending ? strings.projectFormSubmitting : strings.projectFormSubmit }
            </button>
          </footer>
        </Faram>
      </React.Fragment>
    );
  }
}

ProjectForm.contextType = LanguageContext;

const selector = (state, ownProps) => ({
  countries: allCountriesSelector(state),
  districts: state.districts,
  eventList: state.event ? state.event.eventList : undefined,
  projectForm: state.projectForm,
  disasterTypesSelect: disasterTypesSelectSelector(state)
});

const dispatcher = dispatch => ({
  _getDistricts: (...args) => dispatch(getDistrictsForCountryPF(...args)),
  _getEventList: (...args) => dispatch(getEventList(...args)),
  _postProject: (...args) => dispatch(postProject(...args)),
});

export default connect(
  selector,
  dispatcher
)(ProjectForm);

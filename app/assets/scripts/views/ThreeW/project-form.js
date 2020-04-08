'use strict';
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
} from '@togglecorp/fujs';

import SelectInput from '../../components/form-elements/select-input';
import TextInput from '../../components/form-elements/text-input';
import NumberInput from '../../components/form-elements/number-input';
import DateInput from '../../components/form-elements/date-input';
import Checkbox from '../../components/form-elements/faram-checkbox';

import {
  getCountries,
  getDistrictsForCountryPF,
  getEventList,
  postProject,
} from '../../actions';

import {
  disasterTypeList,
} from '../../utils/field-report-constants';

import {
  statusList,
  statuses,
  sectorList,
  secondarySectorInputValues,
  secondarySectorList,
  sectorInputValues,
  programmeTypeList,
  programmeTypes,
  operationTypeList,
  operationTypes,
  projectVisibilityList,
} from '../../utils/constants';

const positiveIntegerCondition = (value) => {
  const ok = (value === undefined || value === '') || ((!Number.isNaN(value)) && (isFalsy(value) || isInteger(+value)) && (+value >= 0));
  return {
    ok,
    message: 'Value must be a positive integer',
  };
};

const compareString = (a, b) => a.label.localeCompare(b.label);

const statusOptions = statusList.map(p => ({
  value: p.title,
  label: p.title,
})).sort(compareString);

const sectorOptions = sectorList.map(p => ({
  value: p.inputValue,
  label: p.title,
})).sort(compareString);

const secondarySectorOptions = secondarySectorList.map(p => ({
  value: p.inputValue,
  label: p.title,
})).sort(compareString);

const programmeTypeOptions = programmeTypeList.map(p => ({
  value: p.title,
  label: p.title,
})).sort(compareString);

const disasterTypeOptions = disasterTypeList.map(d => ({
  value: d.value,
  label: d.label,
})).sort(compareString);

const operationTypeOptions = [...operationTypeList].sort(compareString);
const projectVisibilityOptions = [...projectVisibilityList].sort(compareString);

const InputSection = ({
  className,
  title,
  children,
  helpText,
}) => (
  <div className={_cs(className, 'project-form-input-section')}>
    <div
      className='section-title'
      title={helpText}
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

    this.schema = {
      fields: {
        is_project_completed: [],
        budget_amount: [requiredCondition, positiveIntegerCondition],
        project_country: [],
        event: [],
        dtype: [],
        project_district: [requiredCondition],
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

    this.state = {
      faramValues: {
        budget_amount: projectData.budget_amount,
        project_country: props.countryId,
        event: projectData.event,
        dtype: projectData.dtype,
        project_district: projectData.project_district ? projectData.project_district : 'all',
        name: projectData.name,
        operation_type: operationTypes[projectData.operation_type],
        primary_sector: sectorInputValues[projectData.primary_sector],
        programme_type: programmeTypes[projectData.programme_type],
        end_date: projectData.end_date,
        start_date: projectData.start_date,
        reached_other: projectData.reached_other || undefined,
        reached_female: projectData.reached_female || undefined,
        reached_male: projectData.reached_male || undefined,
        reached_total: projectData.reached_total || undefined,
        reporting_ns: projectData.reporting_ns,
        secondary_sectors: projectData.secondary_sectors ? projectData.secondary_sectors.map(d => secondarySectorInputValues[d]) : [],
        is_project_completed: projectData.status === 2,
        status: statuses[projectData.status],
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
    this.props._getCountries();

    if (this.props.countryId) {
      this.props._getEventList(this.props.countryId);
    }
  }

  getResultsFromResponse = (response, defaultValue = emptyList) => {
    const {
      fetched,
      data
    } = response || emptyObject;

    if (!fetched || !data || !data.results || !data.results.length) {
      return defaultValue;
    }

    return response.data.results;
  }

  getCountryAndNationalSocietyOptions = (countries) => {
    const countryList = this.getResultsFromResponse(countries);

    const nationalSocietyOptions = countryList
      .filter(d => d.society_name)
      .map(d => ({
        value: d.id,
        label: d.society_name,
      })).sort(compareString);

    const countryOptions = countryList
      .filter(d => d.iso)
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

    const districtList = this.getResultsFromResponse(currentDistrictResponse, emptyObject);
    if (!districtList) {
      return emptyList;
    }

    const mappedDistrictList = districtList.map(d => ({
      value: d.id,
      label: d.name,
    })).sort(compareString);

    mappedDistrictList.unshift({
      value: 'all',
      label: 'Countrywide',
    });

    return mappedDistrictList;
  }

  getCurrentOperationOptions = (response) => {
    const currentOperationList = this.getResultsFromResponse(response);

    if (!currentOperationList) {
      return emptyList;
    }

    const currentOperationOptions = currentOperationList.map(d => ({
      value: d.id,
      label: d.name,
    }));

    const operationToDisasterMap = {};
    currentOperationList.forEach(d => { operationToDisasterMap[d.id] = d.dtype.id; });

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
      return { status: 'Completed' };
    }

    if (!start) {
      return { status: 'Planned' };
    }

    const startDate = new Date(start);
    const today = new Date();

    if (startDate.getTime() <= today.getTime()) {
      return { status: 'Ongoing' };
    }

    return { status: 'Planned' };
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
        project_district: 'all',
        event: undefined,
      };
    }

    this.setState({
      faramValues: newFaramValues,
      faramErrors: newFaramErrors,
    });
  }

  handleFaramValidationSuccess = (faramValues) => {
    if (this.props.projectData && this.props.projectData.id) {
      this.props._postProject({
        id: this.props.projectData.id,
        ...faramValues,
        project_district: faramValues.project_district === 'all' ? null : faramValues.project_district,
      });
    } else {
      this.props._postProject({
        ...faramValues,
        project_district: faramValues.project_district === 'all' ? null : faramValues.project_district,
      });
    }
  }

  handleFaramValidationFailure = (faramErrors) => {
    console.warn(faramErrors);
    this.setState({ faramErrors });
  }

  // Generate schema dynamically
  getSchema = memoize((operationType, programmeType, projectStatus) => {
    const schema = {
      fields: { ...this.schema.fields }
    };

    /*
    if (operationType === 'Programme') {
      schema.fields.dtype = [requiredCondition];
    }
    */

    if (operationType === 'Emergency Operation' && (programmeType === 'Multilateral' || programmeType === 'Domestic')) {
      schema.fields.event = [requiredCondition];
    }

    if (projectStatus === 'Completed') {
      schema.fields.reached_total = [requiredCondition, positiveIntegerCondition];
    }

    return schema;
  });

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

    const shouldShowCurrentEmergencyOperation = faramValues.operation_type === 'Emergency Operation' &&
      faramValues.programme_type === 'Domestic';
    const shouldShowCurrentOperation = faramValues.operation_type === 'Emergency Operation' &&
      faramValues.programme_type === 'Multilateral';

    const shouldShowDisasterType = faramValues.operation_type === 'Programme' || shouldShowCurrentOperation || shouldShowCurrentEmergencyOperation;
    const shouldDisableDisasterType = faramValues.operation_type === 'Emergency Operation';

    const schema = this.getSchema(
      faramValues.operation_type,
      faramValues.programme_type,
      faramValues.status
    );

    const shouldDisableTotalTarget = !isFalsy(faramValues.target_male) || !isFalsy(faramValues.target_female) || !isFalsy(faramValues.target_other);
    const shouldDisableTotalReached = !isFalsy(faramValues.reached_male) || !isFalsy(faramValues.reached_female) || !isFalsy(faramValues.reached_other);

    return (
      <Faram
        className='project-form'
        schema={schema}
        value={faramValues}
        error={faramErrors}
        onChange={this.handleFaramChange}
        onValidationSuccess={this.handleFaramValidationSuccess}
        onValidationFailure={this.handleFaramValidationFailure}
      >
        <InputSection
          title='Reporting national society *'
        >
          <SelectInput
            faramElementName='reporting_ns'
            className='project-form-select'
            options={nationalSocietyOptions}
            placeholder={fetchingNationalSocieties ? 'Fetching national societies...' : undefined}
            disabled={shouldDisableNationalSocietyInput}
          />
        </InputSection>

        <InputSection
          className='multi-input-section'
          title='Country and region / province* '
        >
          <SelectInput
            faramElementName='project_country'
            label='Country'
            className='project-form-select'
            options={countryOptions}
            clearable={false}
            disabled={shouldDisableCountryInput}
            placeholder={fetchingCountries ? 'Fetching countries...' : undefined}
          />
          <SelectInput
            faramElementName='project_district'
            label='Region / province'
            className='project-form-select'
            options={districtOptions}
            disabled={shouldDisableDistrictInput}
            placeholder={fetchingDistricts ? 'Fetching districts...' : undefined}
          />
        </InputSection>

        <InputSection
          className='multi-input-section'
          title='Type of operation / programme*'
        >
          <SelectInput
            faramElementName='operation_type'
            label='Operation type'
            className='project-form-select'
            options={operationTypeOptions}
          />
          <SelectInput
            faramElementName='programme_type'
            label='Programme type'
            className='project-form-select'
            options={programmeTypeOptions}
          />
        </InputSection>

        { shouldShowCurrentOperation && (
          <InputSection
            title='Current IFRC operation*'
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
            title='Current emergency operation*'
            helpText='The list is populated from current emergency operations related to the selected country. If necessary, create the related emergency through a field report'
          >
            <SelectInput
              faramElementName='event'
              className='project-form-select'
              options={currentEmergencyOperationOptions}
              disabled={shouldDisableCurrentOperation}
              placeholder={fetchingEvents ? 'Fetching events...' : undefined}
            />
          </InputSection>
        )}

        { shouldShowDisasterType && (
          <InputSection
            title='Disaster type*'
          >
            <SelectInput
              faramElementName='dtype'
              className='project-form-select'
              options={disasterTypeOptions}
              disabled={shouldDisableDisasterType}
              placeholder={shouldDisableDisasterType ? 'Select an operation to view its disaster type' : ''}
            />
          </InputSection>
        )}
        { shouldShowCurrentEmergencyOperation && (
          <InputSection
            title='Current emergency operation*'
            tooltip='The list is populated from current emergency operations related to the selected country. If necessary, create the related emergency through a field report'
          >
            <SelectInput
              faramElementName='event'
              className='project-form-select'
              options={currentEmergencyOperationOptions}
              disabled={shouldDisableCurrentOperation}
              placeholder={fetchingEvents ? 'Fetching events...' : undefined}
            />
          </InputSection>
        )}

        <InputSection
          title='Project name*'
        >
          <TextInput
            faramElementName='name'
          />
        </InputSection>

        <InputSection
          className='multi-input-section'
          title='Sector and tagging'
        >
          <SelectInput
            faramElementName='primary_sector'
            className='project-form-select'
            label='Primary sector* '
            options={sectorOptions}
          />
          <SelectInput
            faramElementName='secondary_sectors'
            className='project-form-select'
            label='Tagging'
            options={secondarySectorOptions}
            multi
          />
        </InputSection>

        <InputSection
          className='multi-input-section'
          title='Start and end dates* '
        >
          <DateInput
            faramElementName='start_date'
            label='Start date'
          />
          <DateInput
            faramElementName='end_date'
            label='End date'
          />
        </InputSection>

        <InputSection
          className='multi-input-section'
          title='Budget and status*'
          helpText='"Project status" is automatically calculated based on the values from "Start and end dates" above and can be marked as complete from the "Completed" checkbox.'
        >
          <NumberInput
            label='Project budget (CHF)'
            faramElementName='budget_amount'
          />
          <div>
            <SelectInput
              disabled
              faramElementName='status'
              className='project-form-select'
              label='Project status'
              options={statusOptions}
            />
            <Checkbox
              label="Completed"
              faramElementName="is_project_completed"
            />
          </div>
        </InputSection>

        <InputSection
          className='multi-input-section'
          title='People targeted'
          helpText="The “other” category can include data such as “other sex/gender”, “undisclosed”, “unknown”, etc."
        >
          <NumberInput
            faramElementName='target_male'
            label='Male'
          />
          <NumberInput
            faramElementName='target_female'
            label='Female'
          />
          <NumberInput
            faramElementName='target_other'
            label='Other'
          />
          <NumberInput
            disabled={shouldDisableTotalTarget}
            faramElementName='target_total'
            label='Total* '
          />
        </InputSection>

        <InputSection
          className='multi-input-section'
          title='People reached'
          helpText="People Reached are people who receive (from the reporting National Society in the Reporting Year) tangible goods and/or any of a range of activities offering protection and assistance, including a positive change or support in knowledge, skills, awareness, attitudes, behaviour, and physical and psychosocial well-being and who can be counted or at least estimated with some degree of reliability."
        >
          <NumberInput
            faramElementName='reached_male'
            label='Male'
          />
          <NumberInput
            faramElementName='reached_female'
            label='Female'
          />
          <NumberInput
            faramElementName='reached_other'
            label='Other'
          />
          <NumberInput
            disabled={shouldDisableTotalReached}
            faramElementName='reached_total'
            label={faramValues.status === 'Completed' ? 'Total* ' : 'Total'}
          />
        </InputSection>
        <InputSection
          title='Project visibility*'
        >
          <SelectInput
            faramElementName='visibility'
            className='project-form-select'
            options={projectVisibilityOptions}
            clearable={false}
          />
        </InputSection>

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
            className='button button--primary-bounded'
            type="submit"
            disabled={shouldDisableSubmitButton}
          >
            Submit
          </button>
        </footer>
      </Faram>
    );
  }
}

const selector = (state, ownProps) => ({
  countries: state.countries,
  districts: state.districts,
  eventList: state.event ? state.event.eventList : undefined,
  projectForm: state.projectForm,
});

const dispatcher = dispatch => ({
  _getCountries: (...args) => dispatch(getCountries(...args)),
  _getDistricts: (...args) => dispatch(getDistrictsForCountryPF(...args)),
  _getEventList: (...args) => dispatch(getEventList(...args)),
  _postProject: (...args) => dispatch(postProject(...args)),
});

export default connect(
  selector,
  dispatcher
)(ProjectForm);

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
import TextOutput from '../../components/text-output';

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
  // statusList,
  statuses,
  sectorList,
  secondarySectorInputValues,
  secondarySectorList,
  programmeTypeList,
  operationTypeList,
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
  tooltip,
}) => (
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
        project_district: projectData.project_district ? projectData.project_district : undefined,
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

    if (String(operationType) === '1' && (String(programmeType) === '1' || String(programmeType) === '2')) {
      schema.fields.event = [requiredCondition];
    }

    if (String(projectStatus) === '2') {
      schema.fields.reached_total = [requiredCondition, positiveIntegerCondition];
    }

    return schema;
  });

  getFilteredSecondarySectorOptions = memoize((sector) => (
    secondarySectorOptions.filter(d => d.value !== sector)
  ))

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

    const shouldShowDisasterType = String(faramValues.operation_type) === '0' || shouldShowCurrentOperation || shouldShowCurrentEmergencyOperation;
    const shouldDisableDisasterType = String(faramValues.operation_type) === '1';
    const isReachedTotalRequired = String(faramValues.status) === '2';

    const schema = this.getSchema(
      faramValues.operation_type,
      faramValues.programme_type,
      faramValues.status
    );

    const shouldDisableTotalTarget = !isFalsy(faramValues.target_male) || !isFalsy(faramValues.target_female) || !isFalsy(faramValues.target_other);
    const shouldDisableTotalReached = !isFalsy(faramValues.reached_male) || !isFalsy(faramValues.reached_female) || !isFalsy(faramValues.reached_other);
    const filteredSecondarySectorOptions = this.getFilteredSecondarySectorOptions(faramValues.sector);

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
          title='Reporting National Society *'
          helpText='Select National Society that is carrying out the activity.'
          tooltip='It can be either the National Society where the disaster has taken place or a different National Society that is carrying out an activity in support of the response.'
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
          helpText='Select the country and region where the disaster is taking place.'
          tooltip='The region can be referred to as states, provinces, or Admin Level 1. Choose countrywide for activities that are not limited to specific places. If the project takes place on multiple regions please submit each region separately using the clone-function on the country view table'
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
          tooltip='The operation type can be either an Emergency Operation or a Programme. Emergency Operations are new efforts linked to a specific emergency. Programs are ongoing work linked to a disaster. &#13;&#13;If you choose Domestic, Bilateral, or Multilateral Programme, select Disaster Type that best fits the situation. Disasters are often multifactorial. Please choose the type that makes the most sense, recognizing that disasters are often the result of many complex factors. &#13;If you choose Bilateral Emergency Operation, then no additional info is required. &#13;If you choose Multilateral Emergency Operation, then please identify linked IFRC Emergency Operation.'
          helpText={
            <React.Fragment>
              <b>Programme Type:</b> Select the Programme Type. Choose from the options of Domestic, Bilateral, Multilateral. If you choose Domestic Emergency Operation, then identify linked Ongoing Emergency.
            </React.Fragment>
          }
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
            title='Disaster type'
          >
            <SelectInput
              faramElementName='dtype'
              className='project-form-select'
              options={disasterTypeOptions}
              disabled={shouldDisableDisasterType}
              placeholder={shouldDisableDisasterType ? 'Select an operation to view its disaster type' : undefined}
            />
          </InputSection>
        )}

        <InputSection
          title='Activity name*'
          helpText='Enter a name that differentiates your activity or project from other initiatives taking place in the response.'
          tooltip='The 3w system does allow for duplicate activities projects with the same name, but please choose a descriptive and original title.'
        >
          <TextInput
            faramElementName='name'
          />
        </InputSection>

        <InputSection
          className='multi-input-section'
          title='Sector and tagging'
          helpText={
            <React.Fragment>
              <div>
                <b>Primary Sector:</b> Choose the sector that best represents the activity or project.
              </div>
              <div>
                <b>Tagging:</b> Projects are often multi-sector. After choosing the primary sector, feel free to add additional sector ‘tags’.
              </div>
            </React.Fragment>
          }
          tooltip='CEA - Community engagement and accountability is a set of communication and participation activities that help put communities at the centre of the response. &#13; &#13;DRR - Disaster risk reduction is the concept and practice of reducing disaster risks through systemic efforts. It encompasses a broad range of activities – from ensuring that legislative and policy approaches reflect known hazards, to community-based initiatives and technical solutions such as early warning systems. &#13; &#13;Education - Educational programming for people affected by disasters. &#13; &#13;Health - Immediate assistance for disaster-affected people and longer-term activities that save lives and improve health outcomes. Separated into clinical and public health. &#13; &#13;Livelihood and basic needs - Livelihoods are the capabilities, assets and activities required for generating income and securing a basic means of living. &#13; &#13;Migration - Aid and protection for migrants and displaced people, in countries of origin, transit and destination, whatever their legal status. &#13;&#13;NS Strengthening - Support to the auxiliary role, strategy, governance and accountability; strengthening areas such as financial management, communications, fundraising; increase volunteer engagement; improve external relations; or ramp up their preparedness for responding to emergencies or improve the planning and execution of programmes and services they provide. &#13; &#13;PGI - Protection, gender and inclusion (PGI) in emergencies including sexual and gender-based violence and disability inclusion. &#13; &#13;Shelter - Immediate and long term shelter assistance.  &#13;&#13;WASH - Water, sanitation and hygiene support. &#13; &#13; &#13;It is possible to add none, one or many tags using the definitions listed above. For COVID-19 related projects please add the COVID-19 tag'
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
            options={filteredSecondarySectorOptions}
            multi
          />
        </InputSection>

        <InputSection
          className='multi-input-section'
          title='Start and end dates* '
          helpText='Choose the date when the work on the activity or project begins'
          tooltip='Choose the date when the project is likely to end. Remember, you can easily return and edit this data if plans evolve.'
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
          helpText={
            <React.Fragment>
              <div>
                <b>Budget:</b> Enter the budget for the activity or project.
              </div>
              <div>
                <b>Project status:</b> The project status (planned and ongoing) is automatically defined by the current date and the submitted project timeline.
              </div>
            </React.Fragment>
          }
          tooltip='The budget includes the total costs for the listed activity or project. &#13;The project can be marked completed, which makes the people reached a required value.'
        >
          <NumberInput
            label='Activity budget (CHF)'
            faramElementName='budget_amount'
          />
          <div>
            <Checkbox
              label="Completed"
              faramElementName="is_project_completed"
            />
            <TextOutput
              label='Activity status'
              value={statuses[faramValues.status]}
            />
          </div>
        </InputSection>

        <InputSection
          className='multi-input-section'
          title='People targeted'
          helpText='Enter the number of people that the project plans to reach through the work.'
          tooltip='The options are: &#13;Male - People who identify as having the male gender &#13;Female - People who identify as having the female gender &#13;Other - Other can include data such as “other sex/gender”, “undisclosed”, “unknown”, etc &#13;Total - The total number of people included in the subcategories above'
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
          helpText='Enter the total number of people reached already with (TOTAL, male, female, other) according to the definitions above.'
          tooltip='lease follow the Counting People Reached guidelines as establishing the Federation-wide Databank and Reporting System.'
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
            label={isReachedTotalRequired ? 'Total* ' : 'Total'}
          />
        </InputSection>
        <InputSection
          title='Activity visibility*'
        >
          <SelectInput
            faramElementName='visibility'
            className='project-form-select'
            options={projectVisibilityOptions}
            helpText='Enter the desired visibility of the project'
            tooltip='The IFRC Only option limits viewing to only those vetted IFRC members who are logged into the GO platform and have the required permissions to view the data. Most programs should be in public mode, and we should only use the IFRC Only option in limited sensitive contexts where issues such as protection concerns are present. As with the wider GO Platform, there is no place for Personal or Community Identifiable data on this type of coordination platform. Sensitive data or information that could jeopardize the safety of staff or project participants should not be shared.'
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

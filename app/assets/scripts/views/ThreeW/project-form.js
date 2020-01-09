'use strict';
import React from 'react';
import Faram, {
  requiredCondition,
} from '@togglecorp/faram';
import _cs from 'classnames';
import { connect } from 'react-redux';
import memoize from 'memoize-one';

import SelectInput from '../../components/form-elements/select-input';
import TextInput from '../../components/form-elements/text-input';
import NumberInput from '../../components/form-elements/number-input';
import DateInput from '../../components/form-elements/date-input';

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
} from '../../utils/constants';

const statusOptions = statusList.map(p => ({
  value: p.title,
  label: p.title,
}));

const sectorOptions = sectorList.map(p => ({
  value: p.inputValue,
  label: p.title,
}));

const secondarySectorOptions = secondarySectorList.map(p => ({
  value: p.inputValue,
  label: p.title,
}));

const programmeTypeOptions = programmeTypeList.map(p => ({
  value: p.title,
  label: p.title,
}));

const disasterTypeOptions = disasterTypeList.map(d => ({
  value: d.value,
  label: d.label,
}));

const operationTypeOptions = [
  { value: 'Programme', label: 'Programme' },
  { value: 'Emergency Operation', label: 'Emergency operation' },
];

const operationTypes = {
  0: 'Programme',
  1: 'Emergency Operation',
};

const InputSection = ({
  className,
  title,
  children,
}) => (
  <div className={_cs(className, 'project-form-input-section')}>
    <div className='section-title'>
      { title }
    </div>
    <div className='section-content'>
      { children }
    </div>
  </div>
);

const emptyList = [];
const emptyObject = [];

class ProjectForm extends React.PureComponent {
  constructor (props) {
    super(props);

    this.schema = {
      fields: {
        budget_amount: [requiredCondition],
        country: [],
        event: [],
        dtype: [],
        project_district: [requiredCondition],
        name: [requiredCondition],
        operation_type: [requiredCondition],
        primary_sector: [requiredCondition],
        programme_type: [requiredCondition],
        end_date: [requiredCondition],
        start_date: [requiredCondition],
        reached_children: [],
        reached_female: [],
        reached_male: [],
        reached_total: [],
        reporting_ns: [requiredCondition],
        secondary_sectors: [],
        status: [requiredCondition],
        target_children: [],
        target_female: [],
        target_male: [],
        target_total: [requiredCondition],
      },
    };

    const { projectData = {} } = props;

    this.state = {
      faramValues: {
        budget_amount: projectData.budget_amount,
        country: props.countryId,
        event: projectData.event,
        dtype: projectData.dtype,
        project_district: projectData.project_district,
        name: projectData.name,
        operation_type: operationTypes[projectData.operation_type],
        primary_sector: sectorInputValues[projectData.primary_sector],
        programme_type: programmeTypes[projectData.programme_type],
        end_date: projectData.end_date,
        start_date: projectData.start_date,
        reached_children: projectData.reached_children || undefined,
        reached_female: projectData.reached_female || undefined,
        reached_male: projectData.reached_male || undefined,
        reached_total: projectData.reached_total || undefined,
        reporting_ns: projectData.reporting_ns,
        secondary_sectors: projectData.secondary_sectors ? projectData.secondary_sectors.map(d => secondarySectorInputValues[d]) : [],
        status: statuses[projectData.status],
        target_children: projectData.target_children || undefined,
        target_female: projectData.target_female || undefined,
        target_male: projectData.target_male || undefined,
        target_total: projectData.target_total || undefined,
      },
      faramErrors: {},
    };

    this.props._getDistricts(props.countryId);
  }

  componentDidMount () {
    this.props._getCountries();
    this.props._getEventList();
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
      }));

    const countryOptions = countryList
      .filter(d => d.iso)
      .map(d => ({
        value: d.id,
        label: d.name,
      }));

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

    return districtList.map(d => ({
      value: d.id,
      label: d.name,
    }));
  }

  getCurrentOperationOptions = (response) => {
    const currentOperationList = this.getResultsFromResponse(response);

    if (!currentOperationList) {
      return emptyList;
    }

    return currentOperationList.map(d => ({
      value: d.id,
      label: d.name,
    }));
  }

  handleFaramChange = (faramValues, faramErrors) => {
    const {
      faramValues: oldFaramValues,
    } = this.state;

    if (oldFaramValues.country !== faramValues.country) {
      this.props._getDistricts(faramValues.country);
      this.setState({
        faramValues: {
          ...faramValues,
          project_district: undefined,
        },
        faramErrors,
      });
    } else {
      this.setState({
        faramValues,
        faramErrors,
      });
    }
  }

  handleFaramValidationSuccess = (faramValues) => {
    if (this.props.projectData) {
      this.props._postProject({
        id: this.props.projectData.id,
        ...faramValues,
      });
    } else {
      this.props._postProject(faramValues);
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

    if (operationType === 'Emergency Operation' && programmeType === 'Multilateral') {
      schema.fields.event = [requiredCondition];
    }

    if (projectStatus === 'Completed') {
      schema.fields.reached_total = [requiredCondition];
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

    const districtOptions = this.getDistrictOptions(districts, faramValues.country);
    const currentOperationOptions = this.getCurrentOperationOptions(eventList);

    const fetchingCountries = countries && countries.fetching;
    const shouldDisableCountryInput = fetchingCountries || true;
    const fetchingDistricts = districts && districts[faramValues.country] && districts[faramValues.country].fetching;
    const shouldDisableDistrictInput = fetchingCountries || fetchingDistricts;
    const fetchingEvents = eventList && eventList.fetching;
    const shouldDisableCurrentOperation = fetchingEvents;

    const projectFormPending = projectForm.fetching;
    const shouldDisableSubmitButton = projectFormPending;

    const shouldShowCurrentOperation = faramValues.operation_type === 'Emergency Operation' &&
      faramValues.programme_type === 'Multilateral';
    const shouldShowDisasterType = faramValues.operation_type === 'Programme' &&
      !shouldShowCurrentOperation;

    const schema = this.getSchema(
      faramValues.operation_type,
      faramValues.programme_type,
      faramValues.status
    );

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
          title='Reporting national society'
        >
          <SelectInput
            faramElementName='reporting_ns'
            className='project-form-select'
            options={nationalSocietyOptions}
          />
        </InputSection>

        <InputSection
          className='multi-input-section'
          title='Country and region / province'
        >
          <SelectInput
            faramElementName='country'
            label='Country'
            className='project-form-select'
            options={countryOptions}
            clearable={false}
            disabled={shouldDisableCountryInput}
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
          title='Type of operation and programme'
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

        { shouldShowDisasterType && (
          <InputSection
            title='Disaster type'
          >
            <SelectInput
              faramElementName='dtype'
              className='project-form-select'
              options={disasterTypeOptions}
            />
          </InputSection>
        )}

        { shouldShowCurrentOperation && (
          <InputSection
            title='Current IFRC operation'
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

        <InputSection
          title='Project name'
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
            label='Primary sector'
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
          title='Start and end dates'
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
          title='Budget and status'
        >
          <NumberInput
            label='Project budget'
            faramElementName='budget_amount'
          />
          <SelectInput
            faramElementName='status'
            className='project-form-select'
            label='Project status'
            options={statusOptions}
          />
        </InputSection>

        <InputSection
          className='multi-input-section'
          title='People targeted'
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
            faramElementName='target_children'
            label='Children'
          />
          <NumberInput
            faramElementName='target_total'
            label='Total'
          />
        </InputSection>

        <InputSection
          className='multi-input-section'
          title='People reached'
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
            faramElementName='reached_children'
            label='Children'
          />
          <NumberInput
            faramElementName='reached_total'
            label='Total'
          />
        </InputSection>

        <footer>
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

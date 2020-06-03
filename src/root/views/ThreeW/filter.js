import React, { useContext } from 'react';
import { PropTypes } from 'prop-types';
import Faram from '@togglecorp/faram';
import { unique } from '@togglecorp/fujs';
import memoize from 'memoize-one';

import SelectInput from '#components/form-elements/select-input';
import {
  statusList,
  sectorList,
  secondarySectorList,
  programmeTypeList,
} from '#utils/constants';
import LanguageContext from '#root/languageContext';

const compareString = (a, b) => a.label.localeCompare(b.label);

const programmeTypeOptions = programmeTypeList.map(p => ({
  value: p.key,
  label: p.title,
})).sort(compareString);

const sectorsOfActivityOptions = sectorList.map(p => ({
  value: p.inputValue,
  label: p.title,
})).sort(compareString);

const tagOptions = secondarySectorList.map(p => ({
  value: p.inputValue,
  label: p.title,
})).sort(compareString);

const statusOptions = statusList.map(p => ({
  value: p.key,
  label: p.title,
})).sort(compareString);

export default class ThreeWFilter extends React.PureComponent {
  constructor (props) {
    super(props);

    this.state = {
      filterValues: {
        reporting_ns: undefined,
        programme_type: undefined,
        primary_sector: undefined,
        status: undefined,
      }
    };

    this.schema = {
      fields: {
        reporting_ns: [],
        programme_type: [],
        primary_sector: [],
        secondary_sectors: [],
        status: []
      }
    };
  }

  getNationalSocietiesOptions = memoize((projectList) => {
    const nationalSocietiesOptions = unique(projectList.map(p => ({
      value: p.reporting_ns,
      label: p.reporting_ns_detail.society_name,
    })), p => p.value);

    return nationalSocietiesOptions;
  })

  handleFaramChange = (filterValues) => {
    const { onFilterChange } = this.props;
    this.setState({ filterValues });

    if (onFilterChange) {
      onFilterChange(filterValues);
    }
  }

  render () {
    const {
      className,
      projectList,
    } = this.props;

    const { filterValues } = this.state;
    const { strings } = useContext(LanguageContext);

    return (
      <Faram
        className={className}
        schema={this.schema}
        value={filterValues}
        onChange={this.handleFaramChange}
      >
        <SelectInput
          faramElementName='reporting_ns'
          label={strings.threeWFilter}
          placeholder={strings.threeWFilterReportingNsPlaceholer}
          options={this.getNationalSocietiesOptions(projectList)}
          className='select-input'
        />
        <SelectInput
          faramElementName='programme_type'
          label={strings.threeWProgrammeType}
          placeholder={strings.threeWProgrammeTypePlaceholder}
          options={programmeTypeOptions}
          className='select-input'
        />
        <SelectInput
          faramElementName='primary_sector'
          label={strings.threeWSector}
          placeholder={strings.threeWSectorPlaceholder}
          options={sectorsOfActivityOptions}
          className='select-input'
        />
        <SelectInput
          faramElementName='secondary_sectors'
          label={strings.threeWTag}
          placeholder={strings.threeWTagPlaceholder}
          options={tagOptions}
          className='select-input'
        />
        <SelectInput
          faramElementName='status'
          label={strings.threeWStatus}
          placeholder={strings.threeWStatusPlaceholder}
          options={statusOptions}
          className='select-input'
        />
      </Faram>
    );
  }
}

ThreeWFilter.propTypes = {
  className: PropTypes.string,
  projectList: PropTypes.array,
};

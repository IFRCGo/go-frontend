/* eslint camelcase: "off" */

import React from 'react';
import { connect } from 'react-redux';
import TextOutput from '#components/text-output';
import Backdrop from '#components/backdrop';

import {
  statuses,
  secondarySectors,
  sectors,
  programmeTypes,
  operationTypes,
} from '#utils/constants';

import { getEventById } from '#actions';

import { disasterTypes } from '#utils/field-report-constants';

import Translate from '#components/Translate';
import LanguageContext from '#root/languageContext';

const emptyObject = {};

class ProjectDetails extends React.PureComponent {
  componentDidMount () {
    const {
      data: {
        event,
      } = {}
    } = this.props;

    if (event) {
      this.props._getEventById(event);
    }
  }

  getCurrentEventDetails = (eventDetails, eventId) => {
    if (!eventDetails || !eventId || !eventDetails[eventId]) {
      return emptyObject;
    }

    return eventDetails[eventId].data || emptyObject;
  }

  render () {
    const {
      data = {},
      eventDetails,
      onCloseButtonClick,
    } = this.props;

    const {
      budget_amount,
      event,
      dtype,
      project_districts_detail,
      reporting_ns_detail,
      name,
      operation_type,
      primary_sector,
      programme_type,
      end_date,
      start_date,
      reached_other,
      reached_female,
      reached_male,
      reached_total,
      reporting_ns,
      secondary_sectors,
      status,
      target_other,
      target_female,
      target_male,
      target_total,
    } = data;

    const currentEventDetails = this.getCurrentEventDetails(eventDetails, event);
    const { strings } = this.context;

    return (
      <Backdrop>
        <div className='tc-project-details-modal'>
          <header>
            <h2>
              <Translate stringId='threeWProjectDetails' />
            </h2>
            <button
              className='button button--secondary-bounded'
              onClick={onCloseButtonClick}
            >
              <Translate stringId='threeWClose' />
            </button>
          </header>
          <div className='tc-project-details'>
            <div className='tc-section'>
              <TextOutput
                className='tc-project-name'
                label={strings.threeWProjectName}
                value={name}
              />
            </div>
            <div className='tc-section tc-date-section'>
              <TextOutput
                label={strings.threeWStartDate}
                value={start_date}
              />
              <TextOutput
                label={strings.threeWEndDate}
                value={end_date}
              />
            </div>
            <div className='tc-section'>
              <TextOutput
                label={strings.threeWProjectDistricts}
                value={project_districts_detail ? (project_districts_detail.map(d => d.name).join(', ')) : ''}
              />
            </div>
            <div className='tc-section'>
              <TextOutput
                label={strings.threeWNationalSociety}
                value={reporting_ns ? reporting_ns_detail.society_name : undefined}
              />
              <TextOutput
                label={strings.threeWBudgetAmount}
                value={budget_amount}
                type='number'
                addSeparatorToValue
              />
              <TextOutput
                label={strings.threeWProgrammeType}
                value={programmeTypes[programme_type]}
              />
              <TextOutput
                label={strings.threeWStatus}
                value={statuses[status]}
              />
            </div>
            <div className='tc-section'>
              <TextOutput
                label={strings.threeWCurrentOperation}
                value={currentEventDetails.name}
                hideEmptyValue
              />
              <TextOutput
                label={strings.threeWDisasterType}
                value={dtype ? disasterTypes[dtype] : undefined}
                hideEmptyValue
              />
            </div>
            <div className='tc-section'>
              <TextOutput
                label={strings.threeWOperationType}
                value={operationTypes[operation_type]}
              />
              <TextOutput
                label={strings.threeWPrimarySector}
                value={sectors[primary_sector]}
              />
              {secondary_sectors.length > 0 && (
                <TextOutput
                  label={strings.threeWTagging}
                  value={(secondary_sectors.map(d => secondarySectors[d])).join(', ')}
                  hideEmptyValue
                />
              )}
            </div>
            <div className='tc-section'>
              <div className='tc-section-title'>
                <Translate stringId='threeWTargeted' />
              </div>
              <div className='tc-section-content'>
                <TextOutput
                  label={strings.threeWMale}
                  value={target_male}
                  type='number'
                  addSeparatorToValue
                />
                <TextOutput
                  label={strings.threeWFemale}
                  value={target_female}
                  type='number'
                  addSeparatorToValue
                />
                <TextOutput
                  label={strings.threeWOther}
                  value={target_other}
                  type='number'
                  addSeparatorToValue
                />
                <TextOutput
                  label={strings.threeWTotal}
                  value={target_total}
                  type='number'
                  addSeparatorToValue
                />
              </div>
            </div>
            <div className='tc-section'>
              <div className='tc-section-title'>
                <Translate stringId='threeWReached' />
              </div>
              <div className='tc-section-content'>
                <TextOutput
                  label={strings.threeWMale}
                  value={reached_male}
                  type='number'
                  addSeparatorToValue
                />
                <TextOutput
                  label={strings.threeWFemale}
                  value={reached_female}
                  type='number'
                  addSeparatorToValue
                />
                <TextOutput
                  label={strings.threeWOther}
                  value={reached_other}
                  type='number'
                  addSeparatorToValue
                />
                <TextOutput
                  label={strings.threeWTotal}
                  value={reached_total}
                  type='number'
                  addSeparatorToValue
                />
              </div>
            </div>
          </div>
        </div>
      </Backdrop>
    );
  }
}

ProjectDetails.contextType = LanguageContext;

const selector = (state, ownProps) => ({
  eventDetails: state.event ? state.event.event : undefined,
});

const dispatcher = dispatch => ({
  _getEventById: (...args) => dispatch(getEventById(...args)),
});

export default connect(
  selector,
  dispatcher
)(ProjectDetails);

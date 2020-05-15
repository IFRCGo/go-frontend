/* eslint camelcase: "off" */

import React from 'react';
import { connect } from 'react-redux';
import TextOutput from '../../components/text-output';
import Backdrop from '../../components/backdrop';

import {
  statuses,
  secondarySectors,
  sectors,
  programmeTypes,
  operationTypes,
} from '../../utils/constants';

import { getEventById } from '../../actions';

import { disasterTypes } from '../../utils/field-report-constants';

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

    return (
      <Backdrop>
        <div className='tc-project-details-modal'>
          <header>
            <h2>
              Red Cross / Red Crescent activities
            </h2>
            <button
              className='button button--secondary-bounded'
              onClick={onCloseButtonClick}
            >
              Close
            </button>
          </header>
          <div className='tc-project-details'>
            <div className='tc-section'>
              <TextOutput
                className='tc-project-name'
                label='Project Name'
                value={name}
              />
            </div>
            <div className='tc-section tc-date-section'>
              <TextOutput
                label='Start Date'
                value={start_date}
              />
              <TextOutput
                label='End Date'
                value={end_date}
              />
            </div>
            <div className='tc-section'>
              <TextOutput
                label='Project Districts'
                value={project_districts_detail ? (project_districts_detail.map(d => d.name).join(', ')) : ''}
              />
            </div>
            <div className='tc-section'>
              <TextOutput
                label='Reporting National Society'
                value={reporting_ns ? reporting_ns_detail.society_name : undefined}
              />
              <TextOutput
                label='Budget Amount (CHF)'
                value={budget_amount}
                type='number'
                addSeparatorToValue
              />
              <TextOutput
                label='Programme Type'
                value={programmeTypes[programme_type]}
              />
              <TextOutput
                label='Status'
                value={statuses[status]}
              />
            </div>
            <div className='tc-section'>
              <TextOutput
                label='Current IFRC Operation'
                value={currentEventDetails.name}
                hideEmptyValue
              />
              <TextOutput
                label='Disaster Type'
                value={dtype ? disasterTypes[dtype] : undefined}
                hideEmptyValue
              />
            </div>
            <div className='tc-section'>
              <TextOutput
                label='Operation Type'
                value={operationTypes[operation_type]}
              />
              <TextOutput
                label='Primary Sector'
                value={sectors[primary_sector]}
              />
              {secondary_sectors.length > 0 && (
                <TextOutput
                  label='Tagging'
                  value={(secondary_sectors.map(d => secondarySectors[d])).join(', ')}
                  hideEmptyValue
                />
              )}
            </div>
            <div className='tc-section'>
              <div className='tc-section-title'>
                Targeted
              </div>
              <div className='tc-section-content'>
                <TextOutput
                  label='Male'
                  value={target_male}
                  type='number'
                  addSeparatorToValue
                />
                <TextOutput
                  label='Female'
                  value={target_female}
                  type='number'
                  addSeparatorToValue
                />
                <TextOutput
                  label='Other'
                  value={target_other}
                  type='number'
                  addSeparatorToValue
                />
                <TextOutput
                  label='Total'
                  value={target_total}
                  type='number'
                  addSeparatorToValue
                />
              </div>
            </div>
            <div className='tc-section'>
              <div className='tc-section-title'>
                Reached
              </div>
              <div className='tc-section-content'>
                <TextOutput
                  label='Male'
                  value={reached_male}
                  type='number'
                  addSeparatorToValue
                />
                <TextOutput
                  label='Female'
                  value={reached_female}
                  type='number'
                  addSeparatorToValue
                />
                <TextOutput
                  label='Other'
                  value={reached_other}
                  type='number'
                  addSeparatorToValue
                />
                <TextOutput
                  label='Total'
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

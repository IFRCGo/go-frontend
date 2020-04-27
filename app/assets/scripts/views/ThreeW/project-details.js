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
      project_district,
      project_district_detail,
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
                label='Project name'
                value={name}
              />
            </div>
            <div className='tc-section tc-date-section'>
              <TextOutput
                label='Start date'
                value={start_date}
              />
              <TextOutput
                label='End date'
                value={end_date}
              />
            </div>
            <div className='tc-section'>
              <TextOutput
                label='Project district'
                value={project_district ? project_district_detail.name : 'Countrywide' }
              />
            </div>
            <div className='tc-section'>
              <TextOutput
                label='Reporting national society'
                value={reporting_ns ? reporting_ns_detail.society_name : undefined}
              />
              <TextOutput
                label='Budget amount (CHF)'
                value={budget_amount}
                type='number'
                addSeparatorToValue
              />
              <TextOutput
                label='Programme type'
                value={programmeTypes[programme_type]}
              />
              <TextOutput
                label='Status'
                value={statuses[status]}
              />
            </div>
            <div className='tc-section'>
              <TextOutput
                label='Current IFRC operation'
                value={currentEventDetails.name}
              />
              <TextOutput
                label='Disaster type'
                value={dtype ? disasterTypes[dtype] : undefined}
              />
            </div>
            <div className='tc-section'>
              <TextOutput
                label='Operation type'
                value={operationTypes[operation_type]}
              />
              <TextOutput
                label='Primary sector'
                value={sectors[primary_sector]}
              />
              <TextOutput
                label='Tagging'
                value={(secondary_sectors.map(d => secondarySectors[d])).join(', ')}
              />
            </div>
            <div className='tc-section'>
              <div className='tc-section-title'>
                Targeted
              </div>
              <div className='tc-section-content'>
                <TextOutput
                  label='Male'
                  value={target_male}
                />
                <TextOutput
                  label='Female'
                  value={target_female}
                />
                <TextOutput
                  label='Other'
                  value={target_other}
                />
                <TextOutput
                  label='Other'
                  value={target_total}
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
                />
                <TextOutput
                  label='Female'
                  value={reached_female}
                />
                <TextOutput
                  label='Other'
                  value={reached_other}
                />
                <TextOutput
                  label='Other'
                  value={reached_total}
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

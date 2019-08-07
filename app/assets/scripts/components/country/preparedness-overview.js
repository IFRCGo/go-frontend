'use strict';

import React from 'react';
import { environment } from '../../config';
import { PropTypes as T } from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { getPerProcessType } from './../../utils/get-per-process-type';
import Fold from './../fold';

class PreparednessOverview extends React.Component {
  render () {
    const NO_DATA = '--';
    if (!this.props.getPerNsPhase.fetched || !this.props.perOverviewForm.fetched || !this.props.user.username) return null;
    if (typeof this.props.getPerNsPhase.data.results !== 'undefined' && this.props.getPerNsPhase.data.results[0].phase === 0 &&
      typeof this.props.perOverviewForm.data.count !== 'undefined' && this.props.perOverviewForm.data.count === 0) return null;
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const phase = {phase: this.props.getPerNsPhase.data.results[0].phase};
    const overviewForm = this.props.perOverviewForm.data.results[0];
    const dateOfAssessment = typeof overviewForm !== 'undefined' ? new Date(overviewForm.date_of_current_capacity_assessment.substring(0, 10)) : null;
    const dateOfAssessmentString = dateOfAssessment !== null ? months[dateOfAssessment.getMonth()] + ' ' + dateOfAssessment.getFullYear() : NO_DATA;
    const perProcessTypeString = typeof overviewForm !== 'undefined' ? getPerProcessType(overviewForm.type_of_capacity_assessment) : NO_DATA;
    const focusString = typeof overviewForm !== 'undefined' ? overviewForm.focus : NO_DATA;
    const focalPointNameString = typeof overviewForm !== 'undefined' ? overviewForm.focal_point_name : NO_DATA;
    const focalPointEmailString = typeof overviewForm !== 'undefined' ? overviewForm.focal_point_email : NO_DATA;
    return (
      <Fold id='per' title='Preparedness For Effective Response Overview' wrapper_class='preparedness' foldClass='margin-reset'>
        <div style={{float: 'left', width: '33%'}}>

          <div style={{float: 'left', width: '30%', textTransform: 'uppercase', fontSize: '13px'}}>
            <div style={{marginBottom: '5px'}}>Current PER</div>
            <div style={{marginBottom: '5px'}}>process phase</div>
          </div>
          <div style={{float: 'left', width: '70%'}}>
            <div style={{marginBottom: '5px', float: 'left', width: '100%'}}>
              <div style={{width: '80%', float: 'left', textTransform: 'uppercase', fontWeight: 'bold', fontSize: '13px'}}>
                Orientation
              </div>
              <div style={{width: '20%', float: 'left'}}>
                {phase.phase > 0 ? <img src='/assets/graphics/layout/tick.png' alt='phase ticked' style={{width: '10px', height: '10px'}} /> : null}
              </div>
            </div>

            <div style={{marginBottom: '5px', float: 'left', width: '100%'}}>
              <div style={{width: '80%', float: 'left', textTransform: 'uppercase', fontWeight: 'bold', fontSize: '13px'}}>
                Assessment
              </div>
              <div style={{width: '20%', float: 'left'}}>
                {phase.phase > 1 ? <img src='/assets/graphics/layout/tick.png' alt='phase ticked' style={{width: '10px', height: '10px'}} /> : null}
              </div>
            </div>

            <div style={{marginBottom: '5px', float: 'left', width: '100%'}}>
              <div style={{width: '80%', float: 'left', textTransform: 'uppercase', fontWeight: 'bold', fontSize: '13px'}}>
                Prioritization
              </div>
              <div style={{width: '20%', float: 'left'}}>
                {phase.phase > 2 ? <img src='/assets/graphics/layout/tick.png' alt='phase ticked' style={{width: '10px', height: '10px'}} /> : null}
              </div>
            </div>

            <div style={{marginBottom: '5px', float: 'left', width: '100%'}}>
              <div style={{width: '80%', float: 'left', textTransform: 'uppercase', fontWeight: 'bold', fontSize: '13px'}}>
                Plan of action
              </div>
              <div style={{width: '20%', float: 'left'}}>
                {phase.phase > 3 ? <img src='/assets/graphics/layout/tick.png' alt='phase ticked' style={{width: '10px', height: '10px'}} /> : null}
              </div>
            </div>

            <div style={{marginBottom: '5px', float: 'left', width: '100%'}}>
              <div style={{width: '80%', float: 'left', textTransform: 'uppercase', fontWeight: 'bold', fontSize: '13px'}}>
                Action &amp; Accountability
              </div>
              <div style={{width: '20%', float: 'left'}}>
                {phase.phase > 4 ? <img src='/assets/graphics/layout/tick.png' alt='phase ticked' style={{width: '10px', height: '10px'}} /> : null}
              </div>
            </div>
          </div>

        </div>
        <div style={{float: 'left', width: '34%'}}>

          <div style={{width: '50%', float: 'left', textTransform: 'uppercase', fontSize: '13px'}}>
            <div style={{marginBottom: '5px'}}>Date of the assessment</div>
            <div style={{marginBottom: '5px'}}>Per process type</div>
            <div style={{marginBottom: '5px'}}>Focus</div>
          </div>
          <div style={{width: '50%', float: 'left', textTransform: 'uppercase', fontWeight: 'bold', fontSize: '13px'}}>
            <div style={{marginBottom: '5px'}}>{dateOfAssessmentString}</div>
            <div style={{marginBottom: '5px'}}>{perProcessTypeString}</div>
            <div style={{marginBottom: '5px'}}>{focusString}</div>
          </div>

        </div>
        <div style={{float: 'left', width: '33%'}}>

          <div style={{width: '50%', float: 'left', textTransform: 'uppercase', fontSize: '13px'}}>
            <div style={{marginBottom: '5px'}}>Focal point</div>
            <div style={{marginBottom: '5px'}}>Email</div>
          </div>
          <div style={{width: '50%', float: 'left', textTransform: 'uppercase', fontWeight: 'bold', fontSize: '13px'}}>
            <div style={{marginBottom: '5px'}}>{focalPointNameString}</div>
            <div style={{marginBottom: '5px'}}>{focalPointEmailString}</div>
          </div>

        </div>

        <div style={{float: 'left', width: '100%', textAlign: 'center', marginTop: '25px'}}>
          <div style={{float: 'left', width: '50%'}}>
            <a href='https://dsgocdnapi.azureedge.net/admin/per/nsphase/' target='_blank' className='button button--medium button--primary-filled'>Set phase</a>
          </div>
          <div style={{float: 'left', width: '50%'}}>
            <a href='mailto:PER.Team@ifrc.org' className='button button--medium button--primary-filled'>Contact PER team</a>
          </div>
        </div>
      </Fold>
    );
  }
}

if (environment !== 'production') {
  PreparednessOverview.propTypes = {
    getPerNsPhase: T.object,
    perOverviewForm: T.object,
    user: T.object
  };
}

const selector = (state) => ({
  user: state.user.data
});

const dispatcher = (dispatch) => ({
  _test: (...args) => dispatch('test')
});

export default withRouter(connect(selector, dispatcher)(PreparednessOverview));

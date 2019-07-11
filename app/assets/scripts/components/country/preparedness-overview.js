'use strict';

import React from 'react';
import { connect } from 'react-redux';
import { environment } from '../../config';
import { PropTypes as T } from 'prop-types';
import Fold from './../fold';

class PreparednessOverview extends React.Component {
  render () {
    const phase = {phase: 3};
    return (
      <Fold id='per' title='Preparedness For Effective Response Overview' wrapper_class='preparedness'>
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
                {phase.phase >= 0 ? <img src='/assets/graphics/layout/tick.png' alt='phase ticked' style={{width: '10px', height: '10px'}} /> : null}
              </div>
            </div>

            <div style={{marginBottom: '5px', float: 'left', width: '100%'}}>
              <div style={{width: '80%', float: 'left', textTransform: 'uppercase', fontWeight: 'bold', fontSize: '13px'}}>
                Assessment
              </div>
              <div style={{width: '20%', float: 'left'}}>
                {phase.phase >= 1 ? <img src='/assets/graphics/layout/tick.png' alt='phase ticked' style={{width: '10px', height: '10px'}} /> : null}
              </div>
            </div>

            <div style={{marginBottom: '5px', float: 'left', width: '100%'}}>
              <div style={{width: '80%', float: 'left', textTransform: 'uppercase', fontWeight: 'bold', fontSize: '13px'}}>
                Prioritization
              </div>
              <div style={{width: '20%', float: 'left'}}>
                {phase.phase >= 2 ? <img src='/assets/graphics/layout/tick.png' alt='phase ticked' style={{width: '10px', height: '10px'}} /> : null}
              </div>
            </div>

            <div style={{marginBottom: '5px', float: 'left', width: '100%'}}>
              <div style={{width: '80%', float: 'left', textTransform: 'uppercase', fontWeight: 'bold', fontSize: '13px'}}>
                Plan of action
              </div>
              <div style={{width: '20%', float: 'left'}}>
                {phase.phase >= 3 ? <img src='/assets/graphics/layout/tick.png' alt='phase ticked' style={{width: '10px', height: '10px'}} /> : null}
              </div>
            </div>

            <div style={{marginBottom: '5px', float: 'left', width: '100%'}}>
              <div style={{width: '80%', float: 'left', textTransform: 'uppercase', fontWeight: 'bold', fontSize: '13px'}}>
                Action &amp; Accountability
              </div>
              <div style={{width: '20%', float: 'left'}}>
                {phase.phase >= 4 ? <img src='/assets/graphics/layout/tick.png' alt='phase ticked' style={{width: '10px', height: '10px'}} /> : null}
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
            <div style={{marginBottom: '5px'}}>Jan 2019</div>
            <div style={{marginBottom: '5px'}}>Self-assessment</div>
            <div style={{marginBottom: '5px'}}>Epi</div>
          </div>

        </div>
        <div style={{float: 'left', width: '33%'}}>

          <div style={{width: '50%', float: 'left', textTransform: 'uppercase', fontSize: '13px'}}>
            <div style={{marginBottom: '5px'}}>Focal point</div>
            <div style={{marginBottom: '5px'}}>Email</div>
          </div>
          <div style={{width: '50%', float: 'left', textTransform: 'uppercase', fontWeight: 'bold', fontSize: '13px'}}>
            <div style={{marginBottom: '5px'}}>Jane Doe</div>
            <div style={{marginBottom: '5px'}}>Jane.doe@ifrc.org</div>
          </div>

        </div>

        <div style={{float: 'left', width: '100%', textAlign: 'center'}}>
          <a href='mailto:mankamolnar@gmail.com' className='button button--medium button--primary-filled'>Contact PER team</a>
        </div>
      </Fold>
    );
  }
}

if (environment !== 'production') {
  PreparednessOverview.propTypes = {
    _getPerNsPhase: T.func
  };
}

const selector = (state) => ({
  getPerNsPhase: state.perForm.getPerNsPhase
});

const dispatcher = (dispatch) => ({
  _getPerNsPhase: () => dispatch(getPerNsPhase())
});

export default connect(selector, dispatcher)(PreparednessOverview);
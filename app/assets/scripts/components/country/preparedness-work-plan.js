'use strict';

import React from 'react';
import c from 'classnames';
import { connect } from 'react-redux';
import { environment } from '../../config';
import { PropTypes as T } from 'prop-types';
import Fold from './../fold';

class PreparednessWorkPlan extends React.Component {
  render () {
    const tableRowStyle = {width: '100%', float: 'left'};
    const tableCellStyle = {width: '10%', float: 'left', padding: '5px'};
    const tableTitleCellStyle = {width: '10%', float: 'left', fontWeight: 'bold', padding: '5px'};
    const tableTitleDoubleCellStyle = {width: '20%', float: 'left', fontWeight: 'bold', padding: '5px'};
    const lightBackground = {backgroundColor: '#eeeeee'};
    const darkBackground = {backgroundColor: '#cccccc'};
    const textToCenter = {textAlign: 'center'};
    const inputWidthFitDiv = {width: '100%'};
    return (
      <Fold id='per' title='Preparedness work plan' wrapper_class='preparedness'>
        <div style={{borderBottom: '1px solid #000', paddingBottom: '20px', float: 'left'}}>
          <button className='button button--small button--primary-bounded'>Add</button>

          <div style={{paddingTop: '20px'}}>
            <div style={Object.assign({}, tableRowStyle, lightBackground)}>
              <div style={tableCellStyle}>
                <input type='text' id='new-prio' style={inputWidthFitDiv} />
              </div>
              <div style={tableCellStyle}>
                <input type='text' id='new-prio' style={inputWidthFitDiv} />
              </div>
              <div style={tableCellStyle}>
                <input type='text' id='new-prio' style={inputWidthFitDiv} />
              </div>
              <div style={tableCellStyle}>
                <input type='text' id='new-prio' style={inputWidthFitDiv} />
              </div>
              <div style={tableCellStyle}>
                <input type='text' id='new-prio' style={inputWidthFitDiv} />
              </div>
              <div style={tableCellStyle}>
                <input type='text' id='new-prio' style={inputWidthFitDiv} />
              </div>
              <div style={tableCellStyle}>
                <input type='text' id='new-prio' style={inputWidthFitDiv} />
              </div>
              <div style={tableCellStyle}>
                <input type='text' id='new-prio' style={inputWidthFitDiv} />
              </div>
              <div style={Object.assign({}, tableCellStyle, textToCenter)}>

                <label className={c(`form__option--custom-checkbox`, {'form__option--inline': 'inline'})}>
                  <input type='checkbox' name='test' value={true} />
                  <span className='form__option__ui'></span>
                </label>

              </div>
              <div style={Object.assign({}, tableCellStyle, textToCenter)}>
                <button className='button button--small button--primary-bounded'>Add</button>
              </div>
            </div>
          </div>
        </div>

        <div style={{paddingTop: '20px', float: 'left'}}>
          <div style={tableTitleCellStyle}>
            Prioritization
          </div>
          <div style={tableTitleCellStyle}>
            Component
          </div>
          <div style={tableTitleCellStyle}>
            Benchmark
          </div>
          <div style={tableTitleCellStyle}>
            Actions
          </div>
          <div style={tableTitleCellStyle}>
            Comments
          </div>
          <div style={tableTitleCellStyle}>
            Timeline
          </div>
          <div style={tableTitleCellStyle}>
            Focal Point
          </div>
          <div style={tableTitleCellStyle}>
            Status
          </div>
          <div style={tableTitleDoubleCellStyle}>
            Support required
          </div>

          <div style={Object.assign({}, tableRowStyle, lightBackground)}>
            <div style={tableCellStyle}>
              High
            </div>
            <div style={tableCellStyle}>
              RC auxiliary role, Mandate and Law
            </div>
            <div style={tableCellStyle}>
              NS mandate is aligned with RCRC Fundamental Principles.
            </div>
            <div style={tableCellStyle}>
              Get appproved / Signed
            </div>
            <div style={tableCellStyle}>
              ---
            </div>
            <div style={tableCellStyle}>
              01/01/2019
            </div>
            <div style={tableCellStyle}>
              John Doe
            </div>
            <div style={tableCellStyle}>
              Completed
            </div>
            <div style={Object.assign({}, tableCellStyle, textToCenter)}>

              <label className={c(`form__option--custom-checkbox`, {'form__option--inline': 'inline'})}>
                <input type='checkbox' name='test' value={true} />
                <span className='form__option__ui'></span>
              </label>

            </div>
            <div style={Object.assign({}, tableCellStyle, textToCenter)}>
              <button className='button button--small button--primary-bounded'>Edit</button>
            </div>
          </div>
          
          <div style={Object.assign({}, tableRowStyle, darkBackground)}>
            <div style={tableCellStyle}>
              High
            </div>
            <div style={tableCellStyle}>
              DRM Strategy
            </div>
            <div style={tableCellStyle}>
              NS DRM strategy reflects the NS mandate, analysis of country context, trends, operational objectives, success indicators.
            </div>
            <div style={tableCellStyle}>
              Create or finalize documents
            </div>
            <div style={tableCellStyle}>
              ---
            </div>
            <div style={tableCellStyle}>
              01/01/2019
            </div>
            <div style={tableCellStyle}>
              John Doe
            </div>
            <div style={tableCellStyle}>
              Cancelled
            </div>
            <div style={Object.assign({}, tableCellStyle, textToCenter)}>

              <label className={c(`form__option--custom-checkbox`, {'form__option--inline': 'inline'})}>
                <input type='checkbox' name='test' value={true} />
                <span className='form__option__ui'></span>
              </label>

            </div>
            <div style={Object.assign({}, tableCellStyle, textToCenter)}>
              <button className='button button--small button--primary-bounded'>Edit</button>
            </div>
          </div>

          <div style={Object.assign({}, tableRowStyle, lightBackground)}>
            <div style={tableCellStyle}>
              High
            </div>
            <div style={tableCellStyle}>
              RC auxiliary role, Mandate and Law
            </div>
            <div style={tableCellStyle}>
              NS mandate is aligned with RCRC Fundamental Principles.
            </div>
            <div style={tableCellStyle}>
              Get appproved / Signed
            </div>
            <div style={tableCellStyle}>
              ---
            </div>
            <div style={tableCellStyle}>
              01/01/2019
            </div>
            <div style={tableCellStyle}>
              John Doe
            </div>
            <div style={tableCellStyle}>
              Completed
            </div>
            <div style={Object.assign({}, tableCellStyle, textToCenter)}>

              <label className={c(`form__option--custom-checkbox`, {'form__option--inline': 'inline'})}>
                <input type='checkbox' name='test' value={true} />
                <span className='form__option__ui'></span>
              </label>

            </div>
            <div style={Object.assign({}, tableCellStyle, textToCenter)}>
              <button className='button button--small button--primary-bounded'>Edit</button>
            </div>
          </div>
        </div>
      </Fold>
    );
  }
}

if (environment !== 'production') {
  PreparednessWorkPlan.propTypes = {
    _getPerNsPhase: T.func
  };
}

const selector = (state) => ({
  getPerNsPhase: state.perForm.getPerNsPhase
});

const dispatcher = (dispatch) => ({
  _getPerNsPhase: () => dispatch(getPerNsPhase())
});

export default connect(selector, dispatcher)(PreparednessWorkPlan);
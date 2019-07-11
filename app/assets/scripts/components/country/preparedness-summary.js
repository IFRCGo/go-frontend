'use strict';

import React from 'react';
import { connect } from 'react-redux';
import { environment } from '../../config';
import { PropTypes as T } from 'prop-types';
import Fold from './../fold';

class PreparednessSummary extends React.Component {
  render () {
    const phase = {phase: 3};
    return (
      <Fold id='per' title='PER Componenets And Sub-Component' wrapper_class='preparedness'>
        <div style={{width: '16%', float: 'left', padding: '5px'}}>
          <div style={{width: '100%', height: '100%', border: '1px solid #000'}}>

            <div style={{height: '28px', borderBottom: '1px solid #000', padding: '5px'}}>
              <div style={{width:'18px', height: '18px', float: 'left', marginRight: '5px'}}>
                <img src='/assets/graphics/layout/card-tick.svg' style={{width:'18px', height: '18px', float: 'left'}} />
              </div>
              <div style={{textTransform: 'uppercase', fontFamily: 'Poppins', fontSize: '12px', fontWeight: 600, color: '#24334c'}}>
                High performance
              </div>
            </div>
            <div style={{width: '100%', textAlign: 'center', fontSize: '12px'}}>
              <span style={{fontFamily: 'Poppins', fontSize: '38px', fontWeight: 600, color: '#c02c2c'}}>12</span> of 51<br />
              COMPONENTS
            </div>

          </div>
        </div>
        <div style={{width: '16%', float: 'left', padding: '5px'}}>
          <div style={{width: '100%', height: '100%', border: '1px solid #000'}}>

          <div style={{height: '28px', borderBottom: '1px solid #000', padding: '5px'}}>
            <div style={{width:'18px', height: '18px', float: 'left', marginRight: '5px'}}>
              <img src='/assets/graphics/layout/card-tick.svg' style={{width:'18px', height: '18px', float: 'left'}} />
            </div>
            <div style={{textTransform: 'uppercase', fontFamily: 'Poppins', fontSize: '12px', fontWeight: 600, color: '#24334c'}}>
              Exists
            </div>
          </div>
          <div style={{width: '100%', textAlign: 'center', fontSize: '12px'}}>
            <span style={{fontFamily: 'Poppins', fontSize: '38px', fontWeight: 600, color: '#c02c2c'}}>12</span> of 51<br />
            COMPONENTS
          </div>

          </div>
        </div>
        <div style={{width: '18%', float: 'left', padding: '5px'}}>
          <div style={{width: '100%', height: '100%', border: '1px solid #000'}}>

            <div style={{height: '28px', borderBottom: '1px solid #000', padding: '5px'}}>
              <div style={{width:'18px', height: '18px', float: 'left', marginRight: '5px'}}>
                <img src='/assets/graphics/layout/card-mid-line.svg' style={{width:'18px', height: '18px', float: 'left'}} />
              </div>
              <div style={{textTransform: 'uppercase', fontFamily: 'Poppins', fontSize: '12px', fontWeight: 600, color: '#24334c'}}>
                Needs improvement
              </div>
            </div>
            <div style={{width: '100%', textAlign: 'center', fontSize: '12px'}}>
              <span style={{fontFamily: 'Poppins', fontSize: '38px', fontWeight: 600, color: '#c02c2c'}}>12</span> of 51<br />
              COMPONENTS
            </div>

          </div>
        </div>
        <div style={{width: '18%', float: 'left', padding: '5px'}}>
          <div style={{width: '100%', height: '100%', border: '1px solid #000'}}>

            <div style={{height: '28px', borderBottom: '1px solid #000', padding: '5px'}}>
              <div style={{width:'18px', height: '18px', float: 'left', marginRight: '5px'}}>
                <img src='/assets/graphics/layout/card-mid-line.svg' style={{width:'18px', height: '18px', float: 'left'}} />
              </div>
              <div style={{textTransform: 'uppercase', fontFamily: 'Poppins', fontSize: '12px', fontWeight: 600, color: '#24334c'}}>
                Partially exists
              </div>
            </div>
            <div style={{width: '100%', textAlign: 'center', fontSize: '12px'}}>
              <span style={{fontFamily: 'Poppins', fontSize: '38px', fontWeight: 600, color: '#c02c2c'}}>12</span> of 51<br />
              COMPONENTS
            </div>

          </div>
        </div>
        <div style={{width: '16%', float: 'left', padding: '5px'}}>
          <div style={{width: '100%', height: '100%', border: '1px solid #000'}}>

            <div style={{height: '28px', borderBottom: '1px solid #000', padding: '5px'}}>
              <div style={{width:'18px', height: '18px', float: 'left', marginRight: '5px'}}>
                <img src='/assets/graphics/layout/card-x.svg' style={{width:'18px', height: '18px', float: 'left'}} />
              </div>
              <div style={{textTransform: 'uppercase', fontFamily: 'Poppins', fontSize: '12px', fontWeight: 600, color: '#24334c'}}>
                Does not exist
              </div>
            </div>
            <div style={{width: '100%', textAlign: 'center', fontSize: '12px'}}>
              <span style={{fontFamily: 'Poppins', fontSize: '38px', fontWeight: 600, color: '#c02c2c'}}>12</span> of 51<br />
              COMPONENTS
            </div>

          </div>
        </div>
        <div style={{width: '16%', float: 'left', padding: '5px'}}>
          <div style={{width: '100%', height: '100%', border: '1px solid #000'}}>

           <div style={{height: '28px', borderBottom: '1px solid #000', padding: '5px'}}>
              <div style={{width:'18px', height: '18px', float: 'left', marginRight: '5px'}}>
                <img src='/assets/graphics/layout/card-x.svg' style={{width:'18px', height: '18px', float: 'left'}} />
              </div>
              <div style={{textTransform: 'uppercase', fontFamily: 'Poppins', fontSize: '12px', fontWeight: 600, color: '#24334c'}}>
                Not previewed
              </div>
            </div>
            <div style={{width: '100%', textAlign: 'center', fontSize: '12px'}}>
              <span style={{fontFamily: 'Poppins', fontSize: '38px', fontWeight: 600, color: '#c02c2c'}}>12</span> of 51<br />
              COMPONENTS
            </div>

          </div>
        </div>
      </Fold>
    );
  }
}

if (environment !== 'production') {
  PreparednessSummary.propTypes = {
    _getPerNsPhase: T.func
  };
}

const selector = (state) => ({
  getPerNsPhase: state.perForm.getPerNsPhase
});

const dispatcher = (dispatch) => ({
  _getPerNsPhase: () => dispatch(getPerNsPhase())
});

export default connect(selector, dispatcher)(PreparednessSummary);
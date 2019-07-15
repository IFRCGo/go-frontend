'use strict';

import React from 'react';
import { connect } from 'react-redux';
import { environment } from '../../config';
import { PropTypes as T } from 'prop-types';
import Fold from './../fold';
import { getPerComponent } from './../../utils/get-per-components';

class PreparednessSummary extends React.Component {
  constructor (props) {
    super(props);
    this.formIds = {};
    this.formComponents = {};
  }

  buildFormCodes () {
    this.props.getPerDocuments.data.results.forEach((document) => {
      this.formIds[document.id] = document;
    });
  }

  render () {
    this.buildFormCodes();
    const filteredData = this.props.getPerDocument.data.results.filter((component) => {
      return component.selected_option > 1;
    }).map((component) => {
      component.formCode = this.formIds[component.form].code;
      component.name = getPerComponent(component.formCode, component.question_id)[0].name;
      component.epi = 0;
      component.component = 0;
      component.groupingKeyword = component.question_id.includes('epi')
        ? component.formCode + component.question_id.split('epi')[0]
        : component.formCode + component.question_id.split('q')[0];
      this.formComponents[component.groupingKeyword] = 1;
      return component;
    });

    const allComponents = Object.keys(this.formComponents).length;
    const highPerformance = filteredData.filter(component => component.selected_option === 7).length;
    const exists = filteredData.filter(component => component.selected_option === 6).length;
    const needsImprovement = filteredData.filter(component => component.selected_option === 5).length;
    const partiallyExists = filteredData.filter(component => component.selected_option === 4).length;
    const doesNotExist = filteredData.filter(component => component.selected_option === 3).length;
    const notReviewed = filteredData.filter(component => component.selected_option === 2).length;

    return (
      <Fold id='per' title='PER Componenets And Sub-Component' wrapper_class='preparedness'>
        <div style={{ width: '16%', float: 'left', padding: '5px' }}>
          <div style={{ width: '100%', height: '100%', border: '1px solid #000' }}>

            <div style={{ height: '28px', borderBottom: '1px solid #000', padding: '5px' }}>
              <div style={{ width: '18px', height: '18px', float: 'left', marginRight: '5px' }}>
                <img src='/assets/graphics/layout/card-tick.svg' style={{ width: '18px', height: '18px', float: 'left' }} />
              </div>
              <div style={{ textTransform: 'uppercase', fontFamily: 'Poppins', fontSize: '12px', fontWeight: 600, color: '#24334c' }}>
                High performance
              </div>
            </div>
            <div style={{ width: '100%', textAlign: 'center', fontSize: '12px' }}>
              <span style={{ fontFamily: 'Poppins', fontSize: '38px', fontWeight: 600, color: '#c02c2c' }}>{highPerformance}</span> of {allComponents}<br />
              COMPONENTS
            </div>

          </div>
        </div>
        <div style={{ width: '16%', float: 'left', padding: '5px' }}>
          <div style={{ width: '100%', height: '100%', border: '1px solid #000' }}>

            <div style={{ height: '28px', borderBottom: '1px solid #000', padding: '5px' }}>
              <div style={{ width: '18px', height: '18px', float: 'left', marginRight: '5px' }}>
                <img src='/assets/graphics/layout/card-tick.svg' style={{ width: '18px', height: '18px', float: 'left' }} />
              </div>
              <div style={{ textTransform: 'uppercase', fontFamily: 'Poppins', fontSize: '12px', fontWeight: 600, color: '#24334c' }}>
                Exists
              </div>
            </div>
            <div style={{ width: '100%', textAlign: 'center', fontSize: '12px' }}>
              <span style={{ fontFamily: 'Poppins', fontSize: '38px', fontWeight: 600, color: '#c02c2c' }}>{exists}</span> of {allComponents}<br />
              COMPONENTS
            </div>

          </div>
        </div>
        <div style={{ width: '18%', float: 'left', padding: '5px' }}>
          <div style={{ width: '100%', height: '100%', border: '1px solid #000' }}>

            <div style={{ height: '28px', borderBottom: '1px solid #000', padding: '5px' }}>
              <div style={{ width: '18px', height: '18px', float: 'left', marginRight: '5px' }}>
                <img src='/assets/graphics/layout/card-mid-line.svg' style={{ width: '18px', height: '18px', float: 'left' }} />
              </div>
              <div style={{ textTransform: 'uppercase', fontFamily: 'Poppins', fontSize: '12px', fontWeight: 600, color: '#24334c' }}>
                Needs improvement
              </div>
            </div>
            <div style={{ width: '100%', textAlign: 'center', fontSize: '12px' }}>
              <span style={{ fontFamily: 'Poppins', fontSize: '38px', fontWeight: 600, color: '#c02c2c' }}>{needsImprovement}</span> of {allComponents}<br />
              COMPONENTS
            </div>

          </div>
        </div>
        <div style={{ width: '18%', float: 'left', padding: '5px' }}>
          <div style={{ width: '100%', height: '100%', border: '1px solid #000' }}>

            <div style={{ height: '28px', borderBottom: '1px solid #000', padding: '5px' }}>
              <div style={{ width: '18px', height: '18px', float: 'left', marginRight: '5px' }}>
                <img src='/assets/graphics/layout/card-mid-line.svg' style={{ width: '18px', height: '18px', float: 'left' }} />
              </div>
              <div style={{ textTransform: 'uppercase', fontFamily: 'Poppins', fontSize: '12px', fontWeight: 600, color: '#24334c' }}>
                Partially exists
              </div>
            </div>
            <div style={{ width: '100%', textAlign: 'center', fontSize: '12px' }}>
              <span style={{ fontFamily: 'Poppins', fontSize: '38px', fontWeight: 600, color: '#c02c2c' }}>{partiallyExists}</span> of {allComponents}<br />
              COMPONENTS
            </div>

          </div>
        </div>
        <div style={{ width: '16%', float: 'left', padding: '5px' }}>
          <div style={{ width: '100%', height: '100%', border: '1px solid #000' }}>

            <div style={{ height: '28px', borderBottom: '1px solid #000', padding: '5px' }}>
              <div style={{ width: '18px', height: '18px', float: 'left', marginRight: '5px' }}>
                <img src='/assets/graphics/layout/card-x.svg' style={{ width: '18px', height: '18px', float: 'left' }} />
              </div>
              <div style={{ textTransform: 'uppercase', fontFamily: 'Poppins', fontSize: '12px', fontWeight: 600, color: '#24334c' }}>
                Does not exist
              </div>
            </div>
            <div style={{ width: '100%', textAlign: 'center', fontSize: '12px' }}>
              <span style={{ fontFamily: 'Poppins', fontSize: '38px', fontWeight: 600, color: '#c02c2c' }}>{doesNotExist}</span> of {allComponents}<br />
              COMPONENTS
            </div>

          </div>
        </div>
        <div style={{ width: '16%', float: 'left', padding: '5px' }}>
          <div style={{ width: '100%', height: '100%', border: '1px solid #000' }}>

            <div style={{ height: '28px', borderBottom: '1px solid #000', padding: '5px' }}>
              <div style={{ width: '18px', height: '18px', float: 'left', marginRight: '5px' }}>
                <img src='/assets/graphics/layout/card-x.svg' style={{ width: '18px', height: '18px', float: 'left' }} />
              </div>
              <div style={{ textTransform: 'uppercase', fontFamily: 'Poppins', fontSize: '12px', fontWeight: 600, color: '#24334c' }}>
                Not reviewed
              </div>
            </div>
            <div style={{ width: '100%', textAlign: 'center', fontSize: '12px' }}>
              <span style={{ fontFamily: 'Poppins', fontSize: '38px', fontWeight: 600, color: '#c02c2c' }}>{notReviewed}</span> of {allComponents}<br />
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
    _getPerNsPhase: T.func,
    getPerDocuments: T.object,
    getPerDocument: T.object
  };
}

const selector = (state) => ({
  getPerNsPhase: state.perForm.getPerNsPhase
});

const dispatcher = (dispatch) => ({
  _getPerNsPhase: () => dispatch('getPerNsPhase()')
});

export default connect(selector, dispatcher)(PreparednessSummary);

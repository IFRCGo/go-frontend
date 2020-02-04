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
    this.filteredData = [];
    this.listComponents = this.listComponents.bind(this);
    this.state = {
      popupComponentList: []
    };
  }

  buildFormCodes () {
    this.props.getPerDocuments.data.results.forEach((document) => {
      this.formIds[document.id] = document;
    });
  }

  listComponents (e) {
    const selectedOption = parseInt(e.currentTarget.id.split('selectedOption')[1]);
    this.setState({popupComponentList: this.filteredData.filter((component) => component.selected_option === selectedOption)});
  }

  render () {
    if (typeof this.props.getPerDocuments.data.count !== 'undefined' && this.props.getPerDocuments.data.count === 0) return null;
    if (!this.props.user.data.username || typeof this.props.getPerDocuments.data.results === 'undefined') return null;
    this.buildFormCodes();
    const resultSetCopy = JSON.parse(JSON.stringify(this.props.getPerDocument.data.results));
    this.filteredData = resultSetCopy.filter((component) => {
      return component.selected_option > 1;
    }).map((component) => {
      component.formCode = this.formIds[component.form].code;
      const perComponent = getPerComponent(component.formCode, component.question_id);
      component.name = perComponent ? perComponent.name : 'n/a';
      component.epi = 0;
      component.component = 0;
      component.groupingKeyword = component.question_id.includes('epi')
        ? component.formCode + component.question_id.split('epi')[0] + 'epi'
        : component.formCode + component.question_id.split('q')[0] + 'normal';
      this.formComponents[component.groupingKeyword] = 1;
      return component;
    });

    const allComponents = Object.keys(this.formComponents).length;
    const highPerformance = this.filteredData.filter(component => component.selected_option === 7).length;
    const exists = this.filteredData.filter(component => component.selected_option === 6).length;
    const needsImprovement = this.filteredData.filter(component => component.selected_option === 5).length;
    const partiallyExists = this.filteredData.filter(component => component.selected_option === 4).length;
    const doesNotExist = this.filteredData.filter(component => component.selected_option === 3).length;
    const notReviewed = this.filteredData.filter(component => component.selected_option === 2).length;

    const popupComponentNameList = [];
    this.state.popupComponentList.forEach((component, componentIndex) => {
      popupComponentNameList.push(<div key={'componentList' + componentIndex}>{component.name}</div>);
    });
    return (
      <Fold id='per-summary' title='PER Components And Sub-Component results' wrapper_class='preparedness' foldClass='margin-reset'>
        <div className='clearfix'>
          <div className='component__block__wrap' style={{cursor: 'pointer'}} id='selectedOption7' onClick={this.listComponents}>
            <div className='component__block'>
              <div className='component__block__title__block'>
                <img src='/assets/graphics/layout/card-tick.svg' className='component__block__icon' />
                <span className='component__block__title'>
                  High performance
                </span>
              </div>
              <div className='component__block__content'>
                <span className='component__block__value'>{highPerformance}</span> / {allComponents}<br />
                COMPONENTS
              </div>

            </div>
          </div>
          <div className='component__block__wrap' style={{cursor: 'pointer'}} id='selectedOption6' onClick={this.listComponents}>
            <div className='component__block'>
              <div className='component__block__title__block'>
                <img src='/assets/graphics/layout/card-tick.svg' className='component__block__icon' />
                <span className='component__block__title'>
                  Exists
                </span>
              </div>
              <div className='component__block__content'>
                <span className='component__block__value'>{exists}</span> / {allComponents}<br />
                COMPONENTS
              </div>

            </div>
          </div>
          <div className='component__block__wrap' style={{cursor: 'pointer'}} id='selectedOption5' onClick={this.listComponents}>
            <div className='component__block'>
              <div className='component__block__title__block'>
                <img src='/assets/graphics/layout/card-mid-line.svg' className='component__block__icon' />
                <span className='component__block__title'>
                  Needs improvement
                </span>
              </div>
              <div className='component__block__content'>
                <span className='component__block__value'>{needsImprovement}</span> / {allComponents}<br />
                COMPONENTS
              </div>

            </div>
          </div>
          <div className='component__block__wrap' style={{cursor: 'pointer'}} id='selectedOption4' onClick={this.listComponents}>
            <div className='component__block'>
              <div className='component__block__title__block'>
                <img src='/assets/graphics/layout/card-mid-line.svg' className='component__block__icon' />
                <span className='component__block__title'>
                  Partially exists
                </span>
              </div>
              <div className='component__block__content'>
                <span className='component__block__value'>{partiallyExists}</span> / {allComponents}<br />
                COMPONENTS
              </div>

            </div>
          </div>
          <div className='component__block__wrap' style={{cursor: 'pointer'}} id='selectedOption3' onClick={this.listComponents}>
            <div className='component__block'>
              <div className='component__block__title__block'>
                <img src='/assets/graphics/layout/card-x.svg' className='component__block__icon' />
                <span className='component__block__title'>
                  Does not exist
                </span>
              </div>
              <div className='component__block__content'>
                <span className='component__block__value'>{doesNotExist}</span> / {allComponents}<br />
                COMPONENTS
              </div>

            </div>
          </div>
          <div className='component__block__wrap' style={{cursor: 'pointer'}} id='selectedOption2' onClick={this.listComponents}>
            <div className='component__block'>
              <div className='component__block__title__block'>
                <img src='/assets/graphics/layout/card-x.svg' className='component__block__icon' />
                <span className='component__block__title'>
                  Not reviewed
                </span>
              </div>
              <div className='component__block__content'>
                <span className='component__block__value'>{notReviewed}</span> / {allComponents}<br />
                COMPONENTS
              </div>
            </div>
          </div>
        </div>
        <div className='base-border global-margin-t global-spacing'>
          {popupComponentNameList}
        </div>
      </Fold>
    );
  }
}

if (environment !== 'production') {
  PreparednessSummary.propTypes = {
    _getPerNsPhase: T.func,
    getPerDocuments: T.object,
    getPerDocument: T.object,
    user: T.object
  };
}

const selector = (state) => ({
  getPerNsPhase: state.perForm.getPerNsPhase,
  user: state.user
});

const dispatcher = (dispatch) => ({
  _getPerNsPhase: () => dispatch('getPerNsPhase()')
});

export default connect(selector, dispatcher)(PreparednessSummary);

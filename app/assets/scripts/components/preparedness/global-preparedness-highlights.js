'use strict';

import React from 'react';
import Fold from './../fold';
import {
  getPerComponent,
  getShortComponent
} from './../../utils/get-per-components';
import { environment } from './../../config';
import { PropTypes as T } from 'prop-types';

export default class GlobalPreparednessHighlights extends React.Component {
  constructor (props) {
    super(props);
    this.highPerformingComponents = [];
    this.highPerformingComponentsDataBuilt = false;
  }

  buildHighPerformingComponentsData () {
    if (!this.highPerformingComponentsDataBuilt) {
      this.highPerformingComponentsDataBuilt = true;
      const components = {};
      const highPerformingComponents = [];

      this.props.data.data.results.forEach(result => {
        if (typeof components[result.code + '' + result.question_id] === 'undefined') {
          components[result.code + '' + result.question_id] = {name: getPerComponent(result.code, result.question_id)[0].name, count: 1};
        } else {
          components[result.code + '' + result.question_id].count++;
        }
      });

      Object.keys(components).sort((componentKeyA, componentKeyB) => {
        if (components[componentKeyA].count < components[componentKeyB].count) {
          return -1;
        } else if (components[componentKeyA].count > components[componentKeyB].count) {
          return 1;
        }
        return 0;
      }).forEach(sortedComponentKey => {
        highPerformingComponents.push(components[sortedComponentKey]);
      });

      this.highPerformingComponents = highPerformingComponents;
    }
  }

  render () {
    this.buildHighPerformingComponentsData();
    const highPerformingComponents = [];
    this.highPerformingComponents.forEach((component) => {
      highPerformingComponents.push(<li key={component.name}>{component.name}</li>);
    });
    const highPriorityComponents = [];
    if (Object.keys(this.props.prioritizationData).length > 0) {
      Object.keys(this.props.prioritizationData).forEach((key) => {
        highPriorityComponents.push(<li key={key}>{getShortComponent(key.substring(0, 2), key.substring(2, key.length))[0].name}</li>);
      });
    }
    return (
      <div className='inner'>
        <Fold title={'Global Preparedness Highlights'}>
          <div style={{width: '50%', float: 'left'}}>
            <span style={{fontWeight: 'bold'}}>High Performing Components (globally)</span>
            <ul>
              {highPerformingComponents}
            </ul>
          </div>
          <div style={{width: '50%', float: 'left'}}>
            <span style={{fontWeight: 'bold'}}>Top Prioritized Components (globally)</span>
            <ul>
              {highPriorityComponents}
            </ul>
          </div>
        </Fold>
      </div>
    );
  }
}

if (environment !== 'production') {
  GlobalPreparednessHighlights.propTypes = {
    data: T.object,
    prioritizationData: T.object
  };
}

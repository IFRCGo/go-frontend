
import React from 'react';
import Fold from './../fold';
import {
  getPerComponent
} from '#utils/get-per-components';
import { environment } from '#config';
import { PropTypes as T } from 'prop-types';

import LanguageContext from '#root/languageContext';
import Translate from '#components/Translate';

export default class GlobalPreparednessHighlights extends React.Component {
  constructor (props) {
    super(props);
    this.highPerformingComponents = [];
    this.highPerformingComponentsDataBuilt = false;
  }

  buildHighPerformingComponentsData () {
    if (!this.highPerformingComponentsDataBuilt && typeof this.props.data.data.results !== 'undefined') {
      this.highPerformingComponentsDataBuilt = true;
      const components = {};
      const highPerformingComponents = [];

      this.props.data.data.results.forEach(result => {
        const correspondingComponent = getPerComponent(result.code, result.question_id);
        if (typeof components[correspondingComponent.cid] === 'undefined') {
          components[correspondingComponent.cid] = {name: correspondingComponent.name, count: 1};
        } else {
          components[correspondingComponent.cid].count++;
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
    if (typeof this.props.prioritizationData === 'undefined') return null;
    if (typeof this.props.data.data !== 'undefined' && typeof this.props.data.data.count !== 'undefined' && this.props.data.data.count === 0 &&
      typeof this.props.prioritizationData !== 'undefined' && Object.keys(this.props.prioritizationData).length === 0) return null;
    this.buildHighPerformingComponentsData();
    const highPerformingComponents = [];
    this.highPerformingComponents.forEach((component, index) => {
      highPerformingComponents.push(<div key={component.name + 'highperforming' + index} className='table--border__list'>{component.name}</div>);
    });
    const highPriorityComponents = [];
    if (Object.keys(this.props.prioritizationData).length > 0) {
      Object.keys(this.props.prioritizationData).forEach((key, index) => {
        highPriorityComponents.push(<div key={key + 'highpriority' + index} className='table--border__list'>{key.replace(/_/g, ' ')}</div>);
      });
    }
    if (highPerformingComponents.length === 0 && highPriorityComponents.length === 0) return null;
    const { strings } = this.context;
    return (
      <div className='inner'>
        <Fold title={strings.globalPreparednessTitle} foldClass='margin-reset' extraClass='fold--main'>
          <table className='table table--border'>
            <thead>
              <tr>
                <th>
                  <span style={{textTransform: 'uppercase', letterSpacing: '0.6px'}}>
                    <Translate stringId='globalPreparednessHighPerforming'/>
                  </span>
                </th>
                <th>
                  <span style={{textTransform: 'uppercase', letterSpacing: '0.6px'}}>
                    <Translate stringId='globalPreparednessTopPrioritized'/>
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  {this.props.perPermission ? highPerformingComponents : strings.globalPreparednessPermission}
                </td>
                <td>
                  {highPriorityComponents}
                </td>
              </tr>
            </tbody>
          </table>
        </Fold>
      </div>
    );
  }
}
GlobalPreparednessHighlights.contextType = LanguageContext;
if (environment !== 'production') {
  GlobalPreparednessHighlights.propTypes = {
    data: T.object,
    prioritizationData: T.object,
    perPermission: T.bool
  };
}

'use strict';

import React from 'react';
import { environment } from '../../config';
import { PropTypes as T } from 'prop-types';
import { getPerComponent } from './../../utils/get-per-components';
import Fold from './../fold';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';
import RequestFactory from './../per-forms/factory/request-factory';

class PreparednessColumnBar extends React.Component {
  constructor (props) {
    super(props);
    this.formIds = {};
    this.requestFactory = new RequestFactory();
  }

  buildDataForGraph () {
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
      return component;
    });
    return filteredData;
  }

  buildFormCodes () {
    this.props.getPerDocuments.data.results.forEach((document) => {
      this.formIds[document.id] = document;
    });
  }

  buildGroupedData (mappedData) {
    const groupedData = {};
    mappedData.forEach((answer) => {
      if (typeof groupedData[answer.groupingKeyword] === 'undefined') {
        groupedData[answer.groupingKeyword] = answer;
      }
      if (answer.question_id.includes('epi')) {
        groupedData[answer.groupingKeyword].epi = answer.selected_option;
      } else {
        groupedData[answer.groupingKeyword].component = answer.selected_option;
      }
    });
    return groupedData;
  }

  render () {
    if (!this.props.getPerDocument.fetched || !this.props.getPerDocuments.fetched) return null;
    this.buildFormCodes();
    const tmpData = this.buildDataForGraph();
    const groupedData = this.buildGroupedData(tmpData);
    return (
      <Fold id='per-column-graph' title='PER components results' wrapper_class='preparedness'>
        <div style={{width: 'fit-content', margin: 'auto'}}>
          <BarChart
            width={900}
            height={300}
            data={Object.values(groupedData)}
            margin={{
              top: 5, right: 30, left: 20, bottom: 5
            }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey='name' hide />
            <YAxis type='number' ticks={[2, 3, 4, 5, 6, 7]} tickFormatter={(number) => this.requestFactory.numAnswerToString(number)} />
            <Tooltip formatter={(number) => number > 1 ? this.requestFactory.numAnswerToString(number) : 'No data'} />
            <Legend />
            <Bar dataKey="epi" fill="#8884d8" />
            <Bar dataKey="component" fill="#82ca9d" />
          </BarChart>
        </div>
      </Fold>
    );
  }
}

if (environment !== 'production') {
  PreparednessColumnBar.propTypes = {
    getPerNsPhase: T.object,
    perOverviewForm: T.object,
    getPerDocument: T.object,
    getPerDocuments: T.object
  };
}

export default PreparednessColumnBar;

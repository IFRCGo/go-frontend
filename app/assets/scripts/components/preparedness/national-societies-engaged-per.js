'use strict';

import React, { PureComponent } from 'react';
import { PropTypes as T } from 'prop-types';
import { environment } from '../../config';
import Fold from './../fold';
import NationalSocietiesEngagedPerGraphDataFactory from './factory/national-societies-engaged-per-graph-data-factory';
import {
  PieChart, Pie, Cell
} from 'recharts';

export default class NationalSocietiesEngagedPer extends PureComponent {
  static get PIE_COLORS () {
    return ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  }

  static get RADIAN () {
    return Math.PI / 180;
  }

  static RENDER_CUSTOMIZED_LABEL ({cx, cy, midAngle, innerRadius, outerRadius, percent, index}) {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * NationalSocietiesEngagedPer.RADIAN);
    const y = cy + radius * Math.sin(-midAngle * NationalSocietiesEngagedPer.RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  }

  constructor (props) {
    super(props);
    this.nationalSocietiesEngagedPerGraphDataFactory = new NationalSocietiesEngagedPerGraphDataFactory();
    this.preparedData = null;
  }

  componentDidMount () {
    this.preparedData = this.nationalSocietiesEngagedPerGraphDataFactory.buildGraphData(this.props.data);
    this.forceUpdate();
  }

  render () {
    if (this.preparedData === null) {
      return null;
    }
    const charts = [];
    this.preparedData.forEach((region) => {
      charts.push(
        <div key={'regionChart' + region.region.id} style={{float: 'left', width: '20%'}}>
          <div style={{margin: 'auto', width: 'fit-content'}}>
            <PieChart width={160} height={160}>
              <Pie
                data={region.data}
                cx={80}
                cy={80}
                labelLine={false}
                label={NationalSocietiesEngagedPer.RENDER_CUSTOMIZED_LABEL}
                outerRadius={75}
                fill="#8884d8"
                dataKey="value">
                {
                  region.data.map((entry, index) => {
                    return <Cell
                      key={`cell-${index}`}
                      fill={NationalSocietiesEngagedPer.PIE_COLORS[index % NationalSocietiesEngagedPer.PIE_COLORS.length]} />;
                  })
                }
              </Pie>
            </PieChart>
          </div>
          <div style={{textAlign: 'center', fontWeight: 'bold', marginTop: '10px'}}>{region.region.name}</div>
          <div style={{textAlign: 'center'}}>
            ({region.data[1].value} countries out of {region.data[0].value})
          </div>
        </div>
      );
    });
    return (
      <div className='inner'>
        <Fold title={'National Societies Engaged In Per Process'}>
          {charts}
        </Fold>
      </div>
    );
  }
}

if (environment !== 'production') {
  NationalSocietiesEngagedPer.propTypes = {
    data: T.object
  };
}

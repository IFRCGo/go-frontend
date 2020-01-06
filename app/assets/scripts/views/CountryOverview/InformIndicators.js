import React from 'react';
import { listToGroupList } from '@togglecorp/fujs';
import _cs from 'classnames';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  LabelList,
} from 'recharts';

const chartMargin = {
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
};

const indicatorClassNameMap = {
  VU: 'inform-indicator-vulnerability',
  HA: 'inform-indicator-hazard-and-exposure',
  CC: 'inform-indicator-lack-of-coping-capacity',
};

class InformIndicators extends React.PureComponent {
  renderLabel = (p) => {
    const {
      x,
      y,
      value,
      height,
    } = p;

    // console.warn(p);

    return (
      <text
        x={x + 10}
        y={y + height / 2}
        fontSize={11}
        fontWeight='bold'
        alignmentBaseline='middle'
      >
        { value }
      </text>
    );
  }

  render () {
    const {
      className,
      data,
    } = this.props;

    if (!data) {
      return null;
    }

    const groupedDataMap = listToGroupList(
      data.filter(d => d.group),
      d => d.group,
    );

    const indicators = Object.keys(groupedDataMap);

    return (
      <div className={_cs(className, 'country-inform-indicators')}>
        <h3 className='tc-heading'>
          Inform indicators
        </h3>
        <div className='tc-content'>
          { indicators.map(indicator => (
            <div
              key={indicator}
              className={_cs('inform-indicator-element', indicatorClassNameMap[indicator])}
            >
              <h4 className='tc-heading'>
                { groupedDataMap[indicator][0].group_display}
              </h4>
              <div className='tc-content'>
                <ResponsiveContainer>
                  <BarChart
                    data={groupedDataMap[indicator]}
                    margin={chartMargin}
                    layout='vertical'
                  >
                    <XAxis
                      dataKey='score'
                      type='number'
                    />
                    <YAxis
                      dataKey='score'
                      type='category'
                    />
                    <Bar
                      fill='#c1cdd1'
                      dataKey='score'
                    >
                      <LabelList
                        dataKey='indicator_display'
                        position='insideStart'
                        content={this.renderLabel}
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default InformIndicators;

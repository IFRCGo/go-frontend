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
  top: 24,
  right: 0,
  bottom: 0,
  left: 0,
};

const AxisTick = (p) => {
  const {
    x,
    y,
    payload,
    width,
    height,
    fill,
    visibleTicksCount,
  } = p;

  const tickWidth = width / visibleTicksCount;
  const fontSizeRatio = payload.value ? 1 / Math.sqrt(payload.value.length) : 0;
  const fontSize = Math.max(Math.min(14, Math.round(24 * fontSizeRatio)), 8);

  return (
    <g transform={`translate(${x},${y - height})`}>
      <foreignObject x={-tickWidth / 2} y="0" width={tickWidth} height={height}>
        <div
          xmlns="http://www.w3.org/1999/xhtml"
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            wordBreak: 'break-words',
            fontSize,
            color: fill,
            textAlign: 'center',
            overflow: 'hidden',
          }}
        >
          {payload.value}
        </div>
      </foreignObject>
      {/*
      <text
        width={width}
        height="auto"
        textAnchor="middle"
        fill={fill}
        fontSize={10}
      >
        {tspans}
      </text>
      */}
    </g>
  );
};

class InformIndicators extends React.PureComponent {
  render () {
    const {
      className,
      data,
    } = this.props;

    const groupedDataMap = listToGroupList(data, d => d.indicator_display);
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
              className='inform-indicator-element'
            >
              <h4 className='tc-heading'>
                { indicator }
              </h4>
              <div className='tc-content'>
                <ResponsiveContainer>
                  <BarChart
                    data={groupedDataMap[indicator]}
                    margin={chartMargin}
                  >
                    <YAxis reversed />
                    <XAxis
                      dataKey='dimension_display'
                      orientation='top'
                      tick={<AxisTick />}
                      height={28}
                      interval={0}
                    />
                    <Bar
                      fill='#24334c'
                      dataKey='score'
                    >
                      <LabelList dataKey='score' position='top' />
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

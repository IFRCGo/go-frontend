'use strict';
import React from 'react';
import {
  scaleLinear,
  scaleBand,
  scalePow,
  scaleLog,
} from 'd3-scale';

import { max } from 'd3-array';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';
import _cs from 'classnames';

import Responsive from './responsive';

const defaultProps = {
  data: [],
  bandPadding: 0.4,
  className: '',
  scaleType: 'linear',
  exponent: 1,
  noOfTicks: 5,
  tickFormat: undefined,
  margins: {
    top: 16,
    right: 16,
    bottom: 26,
    left: 16,
  },
  showTicks: false,
  showGrids: false,
  hideXAxis: false,
  hideYAxis: false,
};

class VerticalBarChart extends React.PureComponent {
  static defaultProps = defaultProps;

  getRenderData = memoize((
    data, height, scaleX, scaleY, labelSelector, valueSelector, margins,
  ) => {
    const { left, top, bottom } = margins;
    const renderData = data.map((d) => {
      const label = labelSelector(d);
      const value = valueSelector(d);
      const barHeight = scaleY(value);

      return {
        x: scaleX(label) + left,
        y: (height + top) - barHeight,
        height: barHeight,
        width: scaleX.bandwidth(),
        label,
        value,
      };
    });

    return renderData;
  })

  getAxisLeftData = memoize((scaleY, height, margins, noOfTicks, tickFormat) => {
    const { left, top } = margins;
    return scaleY.ticks(noOfTicks).map(v => ({
      value: tickFormat ? tickFormat(v) : v,
      x: left,
      y: (height + top) - scaleY(v),
    }));
  })

  getMaxValue = memoize((data, valueSelector) => max(data, valueSelector))

  getScaleY = memoize((scaleType, height, maxValue, exponent) => {
    let scaleY;

    switch (scaleType) {
      case 'log':
        scaleY = scaleLog();
        scaleY.clamp(true);
        break;
      case 'exponent':
        scaleY = scalePow();
        scaleY.exponent([exponent]);
        scaleY.clamp(true);
        break;
      case 'linear':
      default:
        scaleY = scaleLinear();
    }

    scaleY.range([0, height]);
    scaleY.domain([0, maxValue]);

    return scaleY;
  })

  getScaleX = memoize((data, width, labelSelector, bandPadding) => (
    scaleBand()
    .range([width, 0])
    .domain(data.map(labelSelector))
    .padding(bandPadding)
  ))

  render() {
    const {
      className: classNameFromProps,
      data,
      boundingClientRect,
      valueSelector,
      labelSelector,
      margins,
      exponent,
      scaleType,
      bandPadding,
      tickFormat,
      noOfTicks,
      showTicks,
      showGrids,
      hideXAxis,
      hideYAxis,
    } = this.props;

    const {
      width: containerWidth,
      height: containerHeight,
    } = boundingClientRect;

    const isContainerInvalid = !containerWidth;
    const isDataInvalid = !data || data.length === 0;

    if (isContainerInvalid || isDataInvalid) {
      return null;
    }

    const {
      top = 0,
      right = 0,
      bottom = 0,
      left = 0,
    } = margins;

    const width = containerWidth - left - right;
    const height = containerHeight - top - bottom;

    if (height <= 0) {
      return null;
    }

    const maxValue = this.getMaxValue(data, valueSelector);
    const scaleY = this.getScaleY(scaleType, height, maxValue, exponent);
    const scaleX = this.getScaleX(data, width, labelSelector, bandPadding);
    const renderData = this.getRenderData(
      data,
      height,
      scaleX,
      scaleY,
      labelSelector,
      valueSelector,
      margins,
    );

    const axisLeftData = this.getAxisLeftData(
      scaleY,
      height,
      margins,
      noOfTicks,
      tickFormat,
    );

    const className = _cs(
      'vertical-bar-chart',
      classNameFromProps,
    );

    const svgClassName = 'vertical-bar-chart-svg';

    return (
      <div
        className={className}
        width={containerWidth}
        height={containerHeight}
      >
        <svg
          className={svgClassName}
          width={width + left + right}
          height={height + top + bottom}
        >
          { showGrids && (
            <g className='vertical-bar-chart-grid'>
              { axisLeftData.map(d => (
                <line
                  key={`grid-${d.y}`}
                  x1={left}
                  y1={d.y - 0.5}
                  x2={width + left}
                  y2={d.y + 0.5}
                />
              ))}
            </g>
          )}
          <g className='vertical-bar-chart-bars'>
            {renderData.map(d => (
              <React.Fragment key={d.x}>
                <rect
                  x={d.x}
                  y={d.y}
                  width={d.width}
                  height={d.height}
                />
                <text
                  x={d.x + d.width / 2}
                  y={height + top + 15}
                >
                  { d.label }
                </text>
              </React.Fragment>
            ))}
          </g>
          <g>
            {!hideXAxis && (
              <line
                className='vertical-bar-chart-x-axis'
                x1={left}
                y1={height + top + 0.5}
                x2={width + left}
                y2={height + top + 0.5}
              />
            )}
            {!hideYAxis && (
              <g className='vertical-bar-chart-y-axis'>
                <line
                  // + 0.5 to avoid antialiasing
                  x1={left + 0.5}
                  y1={top}
                  x2={left + 0.5}
                  y2={height + top}
                />
                { showTicks && axisLeftData.map(d => (
                  <g
                    className='vertical-bar-chart-y-axis-ticks'
                    key={`tick-${d.value}`}
                    transform={`translate(${d.x}, ${d.y})`}
                  >
                    <line
                      x1={0}
                      y1={-0.5}
                      x2={-5}
                      y2={-0.5}
                    />
                    <text
                      y={0.5}
                      x={-6}
                      dy="0.32em"
                    >
                      {d.value}
                    </text>
                  </g>
                ))}
              </g>
            )}
          </g>
        </svg>
      </div>
    );
  }
}



export default Responsive(VerticalBarChart);

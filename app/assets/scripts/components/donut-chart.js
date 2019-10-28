'use strict';
import React from 'react';
import memoize from 'memoize-one';

import List from './list';
import Responsive from './responsive';
import _cs from 'classnames';

const emptyObject = {};

const polarToCartesian = (
  centerX,
  centerY,
  radius,
  angleInDegrees,
) => {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;

  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians)),
  };
};

const describeArc = (
  x,
  y,
  radius,
  startAngle,
  endAngle,
) => {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);

  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

  const d = [
    'M', start.x, start.y,
    'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y,
  ].join(' ');

  return d;
};

const Arc = (p) => {
  const {
    x,
    y,
    radius,
    startAngle,
    endAngle,
    label,
    color,
  } = p;

  const d = describeArc(x, y, radius, startAngle, endAngle);

  return (
    <path
      d={d}
      fill="none"
      stroke={color}
    >
      <title>
        { label }
      </title>
    </path>
  );
};

const arcRenderKeySelector = datum => (
  datum.key
);

class DonutChart extends React.PureComponent {
  getRenderData = memoize((
    data,
    keySelector,
    valueSelector,
    labelSelector,
    colorSelector,
  ) => {
    const structuredData = data.map(datum => ({
      key: keySelector(datum),
      label: labelSelector(datum),
      value: valueSelector(datum),
      color: colorSelector(datum),
    }));

    const totalValue = structuredData.reduce((acc, d) => (
      acc + d.value
    ), 0);

    if (totalValue <= 0) {
      return [
        {
          key: 'none',
          label: 'N/A',
          value: 0,
          startAngle: 0,
          endAngle: 359.99,
          color: 'gray',
        },
      ];
    }

    let prevStartAngle = 0;
    const renderData = structuredData.map((datum) => {
      const startAngle = prevStartAngle;
      const endAngle = Math.min(startAngle + (360 * (datum.value / totalValue)), 359.99);

      prevStartAngle = endAngle;

      return {
        ...datum,
        startAngle,
        endAngle,
      };
    });

    return renderData;
  })

  getArcPosition = memoize((width, height, currentStyles) => {
    const x = width / 2;
    const y = height / 2;

    const radius = Math.min(width, height) / 2 - currentStyles.widthDonutChartStrokeOnHover;

    return {
      x,
      y,
      radius,
    };
  })

  getArcRendererParams = (_, datum) => {
    const {
      currentStyles = {
        widthDonutChartStrokeOnHover: 16,
      },
      boundingClientRect: {
        width = 0,
        height = 0,
      } = emptyObject,
    } = this.props;

    const {
      startAngle,
      endAngle,
      label,
      color,
    } = datum;

    return {
      startAngle,
      endAngle,
      label,
      color,
      ...this.getArcPosition(width, height, currentStyles),
    };
  }

  render () {
    const {
      className,
      data,
      labelSelector,
      keySelector,
      valueSelector,
      colorSelector,
      boundingClientRect: {
        width = 0,
        height = 0,
      } = emptyObject,
    } = this.props;

    const renderData = this.getRenderData(
      data,
      keySelector,
      valueSelector,
      labelSelector,
      colorSelector,
    );

    return (
      <svg
        className={_cs('tc-donut-chart', className)}
        style={{
          width,
          height,
        }}
      >
        <List
          data={renderData}
          renderer={Arc}

          rendererParams={this.getArcRendererParams}
          keySelector={arcRenderKeySelector}
        />
      </svg>
    );
  }
}

export default Responsive(DonutChart);

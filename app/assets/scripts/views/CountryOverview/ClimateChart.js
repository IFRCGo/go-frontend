import React from 'react';
import _cs from 'classnames';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LabelList,
} from 'recharts';

const chartMargin = {
  top: 24,
  right: 10,
  bottom: 10,
  left: 10,
};

const KeyEventOutput = ({
  label,
  value,
}) => (
  <div className='climate-key-event'>
    <div className='tc-label'>
      { label }
    </div>
    <div className='tc-value'>
      { value || '-' }
    </div>
  </div>
);

class ClimateChart extends React.PureComponent {
  render () {
    const {
      className,
      yearlyEvents,
      averageTemperature,
      averageRainfallPrecipitation,
      rainySeasonStatus,
    } = this.props;

    // TODO: memoize
    const temperatureChartData = yearlyEvents.map(d => ({
      ...d,
      temperature_value: [d.avg_min_temperature, d.avg_max_temperature],
    }));

    return (
      <div className={_cs(className, 'country-climate-chart')}>
        <h3 className='tc-heading'>
          Climate chart (C°)
        </h3>
        <div className='tc-content'>
          <div className='tc-charts'>
            <div className='temperature-chart'>
              <ResponsiveContainer>
                <BarChart
                  data={temperatureChartData}
                  margin={chartMargin}
                >
                  <defs>
                    <linearGradient
                      id='temperature-chart-gradient'
                      x1={0}
                      x2={0}
                      y1={0}
                      y2={1}
                    >
                      <stop offset='0%' stopColor='#f44336' />
                      <stop offset='100%' stopColor='#2196f3' />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    stroke='rgba(0, 0, 0, 0.06)'
                    vertical={false}
                  />
                  <YAxis />
                  <XAxis dataKey='month' />
                  <Bar
                    fill='url(#temperature-chart-gradient)'
                    dataKey='temperature_value'
                  >
                    <LabelList position='top' dataKey='avg_max_temperature' />
                    <LabelList position='bottom' dataKey='avg_min_temperature' />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className='precipitation-chart'>
              <ResponsiveContainer>
                <BarChart
                  data={yearlyEvents}
                  margin={chartMargin}
                >
                  <CartesianGrid
                    stroke='rgba(0, 0, 0, 0.06)'
                    vertical={false}
                  />
                  <YAxis />
                  <XAxis dataKey='month' />
                  <Bar
                    fill='#24334c'
                    dataKey='avg_rainfall_precipitation'
                  >
                    <LabelList position='top' />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className='tc-key-info'>
            <h4 className='tc-heading'>
              Key climate events
            </h4>
            <div className='tc-content'>
              <KeyEventOutput
                label='Avg. rainfall precipitation'
                value={averageRainfallPrecipitation}
              />
              <KeyEventOutput
                label='Avg. temperature'
                value={averageTemperature}
              />
              <KeyEventOutput
                label='Rainy season'
                value={rainySeasonStatus}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ClimateChart;

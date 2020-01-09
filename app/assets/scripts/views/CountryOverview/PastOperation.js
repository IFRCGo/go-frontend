import React from 'react';
import _cs from 'classnames';
import memoize from 'memoize-one';
import { addSeparator } from '@togglecorp/fujs';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

import { countryNameMapById } from '../../utils/field-report-constants';

const DetailElement = ({
  value,
  label,
  addSeparatorToValue,
}) => (
  <div className='event-detail-element'>
    <div className='tc-value'>
      { addSeparatorToValue ? addSeparator(value) : value }
    </div>
    <div className='tc-label'>
      { label }
    </div>
  </div>
);

const SegmentButton = ({
  className,
  onClick,
  label,
  segmentKey,
  isActive,
}) => (
  <button
    type="button"
    onClick={() => onClick ? onClick(segmentKey) : undefined}
    className={_cs(className, 'tc-segment-button', isActive && 'tc-active')}
  >
    { label }
  </button>
);

class PastOperations extends React.PureComponent {
  constructor (props) {
    super(props);

    this.state = {
      chartMode: 'num_beneficiaries',
    };
  }

  handleChartModeChange = (chartMode) => {
    this.setState({ chartMode });
  }

  renderEventDetailTooltip = ({
    active,
    payload,
    label,
  }) => {
    if (!active) {
      return null;
    }

    const { countryId } = this.props;
    const data = payload[0].payload;

    const fundedFraction = data.amount_requested ? data.amount_funded / data.amount_requested : 0;
    const fundedValue = `${Math.round(Math.min(100, 100 * fundedFraction))}%`;

    const startDate = new Date(data.start_date);

    return (
      <div className='event-detail-tooltip'>
        <div className='basic-detail'>
          <div className='event-country-name'>
            { countryNameMapById[countryId] }
          </div>
          <div className='tc-separator'>
            -
          </div>
          <div className='disaster-title'>
            { data.dtype.name }
          </div>
        </div>
        <div className='event-start-date'>
          { startDate.toLocaleString('default', { year: 'numeric', month: 'long' }) }
        </div>
        <div className='other-details'>
          <DetailElement
            value={data.num_beneficiaries}
            label='people targeted'
            addSeparatorToValue
          />
          <DetailElement
            value={data.amount_requested}
            label='funding requirement'
            addSeparatorToValue
          />
          <DetailElement
            value={fundedValue}
            label='funding coverage'
          />
        </div>
      </div>
    );
  }

  getChartData = memoize((data) => {
    const chartData = data.map(d => ({
      ...d,
      amount_requested: +d.amount_requested,
      amount_funded: +d.amount_funded,
    }));

    return chartData;
  })

  render () {
    const {
      data,
      className,
    } = this.props;

    const { chartMode } = this.state;
    const EventDetailTooltip = this.renderEventDetailTooltip;
    const chartData = this.getChartData(data);

    return (
      <div className={_cs(className, 'overview-past-operations')}>
        <h3 className='tc-heading'>
          Past operations
        </h3>
        <div className='past-operations-filter'>
          <div className='chart-mode-input'>
            <SegmentButton
              onClick={this.handleChartModeChange}
              label='People targeted'
              segmentKey='num_beneficiaries'
              className='chart-mode-button'
              isActive={chartMode === 'num_beneficiaries'}
            />
            <SegmentButton
              onClick={this.handleChartModeChange}
              label="Funding requirements"
              className='chart-mode-button'
              segmentKey='amount_requested'
              isActive={chartMode === 'amount_requested'}
            />
          </div>
        </div>
        <div className='tc-content'>
          <ResponsiveContainer>
            <LineChart data={chartData}>
              <XAxis
                dataKey='start_date'
                tickFormatter={d => +(new Date(d)).getFullYear()}
                reversed
              />
              <YAxis
                tickFormatter={d => addSeparator(d)}
                type='number'
                dataKey={chartMode}
              />
              <CartesianGrid vertical={false} />
              <Line
                type="monotone"
                name='Event'
                dataKey={chartMode}
                stroke='#C02C2C'
              />
              <Tooltip content={<EventDetailTooltip />}/>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }
}

export default PastOperations;

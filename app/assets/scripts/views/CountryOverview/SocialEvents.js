import React from 'react';
import _cs from 'classnames';

import IndicatorOutput from './IndicatorOutput';

class SocialEvents extends React.PureComponent {
  render () {
    const {
      className,
      schoolStatus,
      holidayStartDate,
      holidayEndDate,
      electionDate,
      ramadanDate,
    } = this.props;

    const holidayStart = new Date(holidayStartDate);
    const holidayEnd = new Date(holidayEndDate);

    const holidayStartString = holidayStart.toLocaleString('default', { day: 'numeric', month: 'numeric' });
    const holidayEndString = holidayEnd.toLocaleString('default', { day: 'numeric', month: 'numeric' });

    const ramadanDateString = (new Date(ramadanDate)).toLocaleString('default', { month: 'short', year: 'numeric' });
    const electionDateString = (new Date(electionDate)).toLocaleString('default', { month: 'short', year: 'numeric' });

    return (
      <div className={_cs(className, 'overview-social-events')}>
        <h3 className='tc-heading'>
          Social events
        </h3>
        <div className='tc-content'>
          <IndicatorOutput
            label="School"
            value={schoolStatus}
          />
          <IndicatorOutput
            label="Holidays"
            value={`${holidayStartString} - ${holidayEndString}`}
          />
          <IndicatorOutput
            label="Ramadan"
            value={ramadanDateString}
          />
          <IndicatorOutput
            label="Elections"
            value={electionDateString}
          />
        </div>
      </div>
    );
  }
}

export default SocialEvents;

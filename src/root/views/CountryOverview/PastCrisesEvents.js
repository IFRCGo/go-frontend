import React from 'react';
import _cs from 'classnames';

import IndicatorOutput from './IndicatorOutput';

class PastCrisesEvents extends React.PureComponent {
  render () {
    const {
      className,
      conflictEventCount,
      events,
    } = this.props;

    return (
      <div className={_cs(className, 'overview-past-crises-events')}>
        <h3 className='tc-heading'>
          Past crises events
        </h3>
        <div className='tc-content'>
          <IndicatorOutput
            label="Conflict events"
            value={conflictEventCount}
          />
          { events.map(e => (
            <IndicatorOutput
              key={e.id}
              label={e.event_display}
              value={`${e.month_display} ${e.year}`}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default PastCrisesEvents;

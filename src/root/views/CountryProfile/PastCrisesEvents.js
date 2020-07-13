import React from 'react';
import _cs from 'classnames';

import IndicatorOutput from './IndicatorOutput';
import LanguageContext from '#root/languageContext';
import Translate from '#components/Translate';

class PastCrisesEvents extends React.PureComponent {
  render () {
    const {
      className,
      conflictEventCount,
      events,
    } = this.props;

    const { strings } = this.context;
    return (
      <div className={_cs(className, 'overview-past-crises-events')}>
        <h3 className='tc-heading'>
          <Translate stringId='pastCrisesEventsTitle'/>
        </h3>
        <div className='tc-content'>
          <IndicatorOutput
            label={strings.pastCrisesEventsConflict}
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
PastCrisesEvents.contextType = LanguageContext;
export default PastCrisesEvents;

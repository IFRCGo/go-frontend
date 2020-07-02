import React from 'react';
import _cs from 'classnames';

import Translate from '#components/Translate';
import IndicatorOutput from './IndicatorOutput';

class SocialEvents extends React.PureComponent {
  render () {
    const {
      className,
      data,
    } = this.props;

    return (
      <div className={_cs(className, 'overview-social-events')}>
        <h3 className='tc-heading'>
          <Translate stringId='socialEventsTitle'/>
        </h3>
        <div className='tc-content'>
          {data.map(d => (
            <IndicatorOutput
              key={d.id}
              label={d.label}
              value={d.value}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default SocialEvents;

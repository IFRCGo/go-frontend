import React from 'react';
import _cs from 'classnames';

import FormattedNumber from '#components/formatted-number';
import Translate from '#components/Translate';

function PeopleOverview (props) {
  const {
    targeted = 0,
    reached = 0,
    className,
  } = props;

  const barStyle = React.useMemo(() => {
    let progress = 0;

    if (targeted && targeted !== 0) {
      progress = Math.min(100, 100 * reached / targeted);
    }

    return { width: `${progress}%` };
  }, [targeted, reached]);

  return (
    <div className={_cs(className, 'people-overview')}>
      <h4 className='tc-heading'>
        <Translate stringId='peopleOverviewTotalPeople'/>
      </h4 >
      <div className='tc-content'>
        <FormattedNumber
          className='reached-people-count'
          value={reached}
          normalize
          fixedTo={1}
        />
        <div className='targeted-people'>
          <div className='tc-label'>
            <Translate stringId='peopleOverviewTargetedPeople'/>
          </div>
          <FormattedNumber
            className='targeted-people-count'
            value={targeted}
            normalize
            fixedTo={1}
          />
        </div>
        <div className='tc-progress-bar'>
          <div style={barStyle} className='tc-progress' />
        </div>
      </div>
    </div>
  );
}

export default PeopleOverview;

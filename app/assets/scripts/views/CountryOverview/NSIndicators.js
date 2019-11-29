import React from 'react';
import _cs from 'classnames';

import IndicatorOutput from './IndicatorOutput';

class NSIndicators extends React.PureComponent {
  render () {
    const {
      className,
      income,
      expenditures,
      volunteers,
      trainedInFirstAid,
    } = this.props;

    return (
      <div className={_cs(className, 'overview-ns-indicators')}>
        <h3 className='tc-heading'>
          National society indicators
        </h3>
        <div className='tc-content'>
          <IndicatorOutput
            label="Income (CHF)"
            value={income}
          />
          <IndicatorOutput
            label="Expenditures (CHF)"
            value={expenditures}
          />
          <IndicatorOutput
            label="Volunteers"
            value={volunteers}
          />
          <IndicatorOutput
            label="Trained in first aid"
            value={trainedInFirstAid}
          />
        </div>
      </div>
    );
  }
}

export default NSIndicators;

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
            normalizeValue
            fixedTo={1}
          />
          <IndicatorOutput
            label="Expenditures (CHF)"
            value={expenditures}
            normalizeValue
            fixedTo={1}
          />
          <IndicatorOutput
            label="Volunteers"
            value={volunteers}
            addSeparatorToValue
          />
          <IndicatorOutput
            label="Trained in first aid"
            value={trainedInFirstAid}
            addSeparatorToValue
          />
        </div>
      </div>
    );
  }
}

export default NSIndicators;

import React from 'react';
import _cs from 'classnames';

import IndicatorOutput from './IndicatorOutput';
import LanguageContext from '#root/languageContext';
import Translate from '#components/Translate';

class NSIndicators extends React.PureComponent {
  render () {
    const {
      className,
      income,
      expenditures,
      volunteers,
      trainedInFirstAid,
    } = this.props;

    const { strings } = this.context;

    return (
      <div className={_cs(className, 'overview-ns-indicators')}>
        <h3 className='tc-heading'>
          <Translate stringId='NSIndicatorsTitle' />
        </h3>
        <div className='tc-content'>
          <IndicatorOutput
            label={strings.NSIndicatorsIncome}
            value={income}
            normalizeValue
            fixedTo={1}
          />
          <IndicatorOutput
            label={strings.NSIndicatorsExpenditure}
            value={expenditures}
            normalizeValue
            fixedTo={1}
          />
          <IndicatorOutput
            label={strings.NSIndicatorsVolunteers}
            value={volunteers}
            addSeparatorToValue
          />
          <IndicatorOutput
            label={strings.NSIndicatorsTrained}
            value={trainedInFirstAid}
            addSeparatorToValue
          />
        </div>
      </div>
    );
  }
}

NSIndicators.contextType = LanguageContext;
export default NSIndicators;

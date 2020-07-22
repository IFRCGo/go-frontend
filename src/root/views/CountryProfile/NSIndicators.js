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
      <div className='col col-6-sm flex'>
        <div className={_cs(className, 'chart box__content overview-ns-indicators')}>
          <figcaption className='fold__title'>
            <h3 className='tc-heading margin-reset'>
              <Translate stringId='NSIndicatorsTitle' />
            </h3>
          </figcaption>
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
      </div>
    );
  }
}

NSIndicators.contextType = LanguageContext;
export default NSIndicators;

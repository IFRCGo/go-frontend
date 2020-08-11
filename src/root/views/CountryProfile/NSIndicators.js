import React from 'react';
import _cs from 'classnames';

import IndicatorOutput from './IndicatorOutput';
import LanguageContext from '#root/languageContext';
import Translate from '#components/Translate';

import Card from './Card';
import styles from './styles.module.scss';

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
      <Card
        className={_cs(className, styles.nsIndicator)}
        heading={<Translate stringId='NSIndicatorsTitle' />}
        contentClassName={styles.content}
      >
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
      </Card>
    );
  }
}

NSIndicators.contextType = LanguageContext;
export default NSIndicators;

import React from 'react';
import _cs from 'classnames';

import IndicatorOutput from './IndicatorOutput';
import LanguageContext from '#root/languageContext';
import Translate from '#components/Translate';

import Card from './Card';
import styles from './styles.module.scss';

class KeyIndicators extends React.PureComponent {
  render () {
    const {
      className,
      population,
      urbanPopulation,
      gdp,
      gnipc,
      poverty,
      lifeExpectancy,
      literacy,
    } = this.props;

    const { strings } = this.context;
    return (
      <Card
        className={_cs(className, styles.overviewKeyIndicators)}
        heading={<Translate stringId='keyIndicatorsTitle' />}
        contentClassName={styles.content}
      >
        <div className={styles.section}>
          <IndicatorOutput
            label={strings.keyIndicatorsPopulation}
            value={population}
            addSeparatorToValue
          />
          <IndicatorOutput
            label={strings.keyIndicatorsPopulationPercent}
            value={urbanPopulation}
          />
          <IndicatorOutput
            label={strings.keyIndicatorsGDP}
            value={gdp}
            normalizeValue
            fixedTo={1}
          />
          <IndicatorOutput
            label={strings.keyIndicatorsGNI}
            value={gnipc}
            addSeparatorToValue
          />
        </div>
        <div className={styles.section}>
          <IndicatorOutput
            label={strings.keyIndicatorsPovertyPercent}
            value={poverty}
          />
          <IndicatorOutput
            label={strings.keyIndicatorsLifeExpectancy}
            value={lifeExpectancy}
          />
          <IndicatorOutput
            label={strings.keyIndicatorsLiteracy}
            value={literacy}
          />
        </div>
      </Card>
    );
  }
}

KeyIndicators.contextType = LanguageContext;
export default KeyIndicators;

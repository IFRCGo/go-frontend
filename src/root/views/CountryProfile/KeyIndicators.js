import React from 'react';
import _cs from 'classnames';

import IndicatorOutput from './IndicatorOutput';
import LanguageContext from '#root/languageContext';
import Translate from '#components/Translate';

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
      <div className='col col-6-sm flex'>
        <div className={_cs(className, 'chart box__content overview-key-indicators')}>
          <figcaption className='fold__title'>
            <h3 className='tc-heading margin-reset'>
              <Translate stringId='keyIndicatorsTitle' />
            </h3>
          </figcaption>
          <div className='tc-content'>
            <div className='tc-left'>
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
            <div className='tc-right'>
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
          </div>
        </div>
      </div>
    );
  }
}

KeyIndicators.contextType = LanguageContext;
export default KeyIndicators;

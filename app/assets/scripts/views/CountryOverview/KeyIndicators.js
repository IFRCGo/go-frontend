import React from 'react';
import _cs from 'classnames';

import IndicatorOutput from './IndicatorOutput';

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

    return (
      <div className={_cs(className, 'overview-key-indicators')}>
        <h3 className='tc-heading'>
          Key indicators
        </h3>
        <div className='tc-content'>
          <div className='tc-left'>
            <IndicatorOutput
              label="Population"
              value={population}
              addSeparatorToValue
            />
            <IndicatorOutput
              label="Urban pop (% pop)"
              value={urbanPopulation}
            />
            <IndicatorOutput
              label="GDP"
              value={gdp}
              normalizeValue
              fixedTo={1}
            />
            <IndicatorOutput
              label="GNI / capita"
              value={gnipc}
              addSeparatorToValue
            />
          </div>
          <div className='tc-right'>
            <IndicatorOutput
              label="Poverty (% pop)"
              value={poverty}
            />
            <IndicatorOutput
              label="Life expentancy"
              value={lifeExpectancy}
            />
            <IndicatorOutput
              label="Literacy"
              value={literacy}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default KeyIndicators;

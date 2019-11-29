import React from 'react';
import _cs from 'classnames';

class PopulationMap extends React.PureComponent {
  render () {
    const {
      className,
    } = this.props;

    return (
      <div className={_cs(className, 'overview-population-map')}>
        <h3 className='tc-heading'>
          Population map
        </h3>
        <div className='tc-content'>
          population map
        </div>
      </div>
    );
  }
}

export default PopulationMap;

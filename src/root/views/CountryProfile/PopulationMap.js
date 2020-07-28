import React from 'react';
import _cs from 'classnames';

import Map from './Map';
import Translate from '#components/Translate';

import Container from './Container';
import styles from './styles.module.scss';

class PopulationMap extends React.PureComponent {
  render () {
    const {
      className,
      countryId,
      data,
    } = this.props;

    return (
      <Container
        className={_cs(className, styles.populationMap)}
        heading={<Translate stringId='populationMapTitle'/>}
        contentClassName={styles.content}
        exportable
      >
        <Map
          className={styles.mapContainer}
          countryId={countryId}
          districtList={data.districts}
        />
      </Container>
    );
  }
}

export default PopulationMap;

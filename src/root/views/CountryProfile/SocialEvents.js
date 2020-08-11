import React from 'react';
import _cs from 'classnames';

import Translate from '#components/Translate';
import IndicatorOutput from './IndicatorOutput';

import Card from './Card';
import styles from './styles.module.scss';

class SocialEvents extends React.PureComponent {
  render () {
    const {
      className,
      data,
    } = this.props;

    return (
      <Card
        className={_cs(className, styles.socialEvents)}
        heading={<Translate stringId='socialEventsTitle'/>}
        contentClassName={styles.content}
      >
        {data.map(d => (
          <IndicatorOutput
            key={d.id}
            label={d.label}
            value={d.value}
          />
        ))}
      </Card>
    );
  }
}

export default SocialEvents;

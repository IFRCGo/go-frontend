import React from 'react';
import Links from './examples/Links';
import Buttons from './examples/Buttons';
import styles from './styles.module.scss';
import Cards from './examples/Cards';
import Alerts from './examples/Alerts';
import OverlayExample from './examples/OverlayExample';

function GoUI() {
  return (
    <div className={styles.elementWrapper}>
      <div className={styles.elementsContainer}>
        <Links />
      </div>
      <div className={styles.elementsContainer}>
        <Buttons />
      </div>
      <div className={styles.elementsContainer}>
        <Cards />
      </div>
      <div className={styles.elementsContainer}>
        <Alerts />
      </div>
      <div className={styles.elementsContainer}>
        <OverlayExample />
      </div>
    </div>
  );
}

export default GoUI;

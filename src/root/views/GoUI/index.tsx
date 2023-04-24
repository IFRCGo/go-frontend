import React from 'react';
import Links from './examples/Links';
import styles from './styles.module.scss';
import Cards from './examples/Cards';
import Alerts from './examples/Alerts';

function GoUI() {
  return (
    <>
      <div className={styles.linksContainer}>
        <Links />
      </div>
      <div>
        <Cards />
      </div>
      <div>
        <Alerts />
      </div>
    </>
  );
}

export default GoUI;

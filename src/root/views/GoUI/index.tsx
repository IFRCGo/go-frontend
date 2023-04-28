import Card from './components/Card';
import React from 'react';
import Links from './examples/Links';
import styles from './styles.module.scss';
import Cards from './examples/Cards';

function GoUI() {
  return (
    <>
      <div className={styles.linksContainer}>
        <Links />
      </div>
      <div>
        <Cards />
      </div>
    </>
  );
}

export default GoUI;

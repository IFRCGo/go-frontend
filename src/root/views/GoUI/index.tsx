import React from 'react';
import Links from './examples/Links';
import styles from './styles.module.scss';

function GoUI() {
    return (
        <div className={styles.linksContainer}>
          <Links />
        </div>
    );
}

export default GoUI;

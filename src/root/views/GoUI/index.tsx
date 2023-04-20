import React from 'react';
import LinkElement from './components/LinkElement';

import styles from './styles.module.scss';

function GoUI() {
    return (
        <div className={styles.linksContainer}>
            <LinkElement />
        </div>
    );
}

export default GoUI;

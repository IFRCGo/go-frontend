import React from 'react';
import Link from './components/Link';
import styles from './styles.module.scss';

function GoUI() {
    return (
        <div>
            <Link
                className={styles.url}
                href={'www.gooogle.com'}
                target="_blank"
            >
                More Info
            </Link>
        </div>
    );
}

export default GoUI;

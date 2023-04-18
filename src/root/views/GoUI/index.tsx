import React from 'react';
import Link from './components/Links';
import Header from '#components/Header';
import styles from './styles.module.scss';

function GoUI() {
    return (
        <>
            <div className={styles.linksContainer}>
                <Header
                    heading="REGULAR LINK"
                    headingSize="small"
                />
                <Link
                    className={styles.url}
                    href={'www.gooogle.com'}
                    target="_blank"
                    variant="regular"
                >
                    View all emergencies (last 30 days)
                </Link>
            </div>
            <div className={styles.linksContainer}>
                <Header
                    heading="HIGHLIGHTED LINK"
                    headingSize="small"
                />
                <Link
                    className={styles.url}
                    href={'www.gooogle.com'}
                    target="_blank"
                    variant="highlighted"
                >
                    Special Link
                </Link>
            </div>
            <div className={styles.linksContainer}>
                <Header
                    heading="POPUP"
                    headingSize="small"
                />
                <Link
                    className={styles.url}
                    href={'www.gooogle.com'}
                    target="_blank"
                    variant="popup"
                >
                    POPUP LINK (COUNTRY)
                </Link>
            </div>
            <div className={styles.linksContainer}>
                <Header
                    heading="TABLE"
                    headingSize="small"
                />
                <Link
                    className={styles.url}
                    href={'www.gooogle.com'}
                    target="_blank"
                    variant="table"
                >
                    Phillipines - Emergency 1
                </Link>
            </div>
            <div className={styles.linksContainer}>
                <Header
                    heading="TEXT LINK"
                    headingSize="small"
                />
                <Link
                    className={styles.url}
                    href={'www.gooogle.com'}
                    target="_blank"
                    variant="textLink"
                >
                    Phillipines - Emergency 1
                </Link>
            </div>
            <div className={styles.linksContainer}>
                <Header
                    heading="POPUP LINK"
                    headingSize="small"
                />
                <Link
                    className={styles.url}
                    href={'www.gooogle.com'}
                    target="_blank"
                    variant="specialEmail"
                >
                    communications@ifrc.org
                </Link>
            </div>
        </>
    );
}

export default GoUI;

import React from 'react';
import Link from './Links';
import Header from '#components/Header';
import styles from './styles.module.scss';

function LinkElement() {
    return (
        <div className={styles.linkCollection}>
            <Header
                heading="LINK COLLECTION"
                headingSize="medium"
            />
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
                    heading="TITLE LINK"
                    headingSize="small"
                />
                <Link
                    className={styles.url}
                    href={'www.gooogle.com'}
                    target="_blank"
                    variant="titleLink"
                >
                    POPUP LINK (COUNTRY)
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
                    heading="EMAIL LINK"
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
            <div className={styles.linksContainer}>
                <Header
                    heading="EXTERNAL LINK"
                    headingSize="small"
                />
                <Link
                    className={styles.url}
                    href={'www.gooogle.com'}
                    target="_blank"
                    variant="externalLink"
                >
                    External Links
                </Link>
            </div>
        </div>
    );
}

export default LinkElement;

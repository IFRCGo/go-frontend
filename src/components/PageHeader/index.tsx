import React from 'react';
import { _cs } from '@togglecorp/fujs';

import PageContainer from '#components/PageContainer';
import Container from '#components/Container';
import Heading from '#components/Heading';

import styles from './styles.module.css';

interface Props {
    className?: string;
    heading?: React.ReactNode;
    description?: React.ReactNode;
    descriptionContainerClassName?: string;
    actions?: React.ReactNode;
    breadCrumbs?: React.ReactNode;
    info?: React.ReactNode;
    infoContainerClassName?: string;
    wikiLink?: React.ReactNode;
    headerClassName?: string;
}

function PageHeader(props: Props) {
    const {
        className,
        heading,
        description,
        descriptionContainerClassName,
        actions,
        breadCrumbs,
        info,
        infoContainerClassName,
        wikiLink,
        headerClassName,
    } = props;

    if (!(actions || breadCrumbs || info || description || heading)) {
        return null;
    }

    return (
        <PageContainer
            containerAs="header"
            className={_cs(
                styles.pageHeader,
                className,
            )}
        >
            <Container
                className={styles.container}
                icons={breadCrumbs}
                actions={(
                    <>
                        {actions}
                        {wikiLink}
                    </>
                )}
                footerContent={info}
                footerContentClassName={infoContainerClassName}
                childrenContainerClassName={_cs(styles.mainContent, headerClassName)}
            >
                <Heading
                    level={1}
                    className={styles.heading}
                >
                    { heading }
                </Heading>
                {description && (
                    <div className={_cs(styles.description, descriptionContainerClassName)}>
                        { description }
                    </div>
                )}
            </Container>
        </PageContainer>
    );
}

export default PageHeader;

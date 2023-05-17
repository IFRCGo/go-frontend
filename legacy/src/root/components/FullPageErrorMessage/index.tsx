import React from 'react';
import { _cs } from '@togglecorp/fujs';

import ButtonLikeLink from '#components/ButtonLikeLink';

import styles from './styles.module.scss';

interface Props {
    errorTitle?: string;
    errorMessage?: React.ReactNode;
    buttons?: React.ReactNode;
    hideGotoHomepageButton?: boolean;
    className?: string;
}

function FullPageErrorMessage(props: Props) {
    const {
        errorTitle,
        errorMessage,
        hideGotoHomepageButton = false,
        buttons,
        className,
    } = props;

    return (
        <div className={_cs(styles.errorPage, className)}>
            <div className={styles.container}>
                <div className={styles.content}>
                    <div className={styles.message}>
                        <h2 className={styles.errorMessageTitle}>
                            {errorTitle}
                        </h2>
                        <div className={styles.errorMessage}>
                            {errorMessage}
                        </div>
                    </div>
                    <div className={styles.buttons}>
                        {!hideGotoHomepageButton && (
                            <ButtonLikeLink
                                variant="primary"
                                to="/"
                            >
                                Go to homepage
                            </ButtonLikeLink>
                        )}
                        {buttons}
                    </div>
                </div>
            </div>
            <div className={styles.footer}>
                Copyright @IFRC 2023
            </div>
        </div>
    );
}
export default FullPageErrorMessage;

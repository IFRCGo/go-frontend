import { useCallback } from 'react';
import { _cs } from '@togglecorp/fujs';
import {
    InformationLineIcon,
    ErrorWarningLineIcon,
    CheckboxCircleLineIcon,
    QuestionLineIcon,
    CloseLineIcon
} from '@ifrc-go/icons';

import ElementFragments from '#components/ElementFragments';
import Button from '#components/Button';
import { AlertVariant } from '#contexts/alert';
import useTranslation from '#hooks/useTranslation';
// import useBasicLayout from '#hooks/useBasicLayout';

import commonStrings from '#strings/common';

import styles from './styles.module.css';

export interface Props<N> {
    name: N;
    className?: string;
    variant?: AlertVariant;
    children: React.ReactNode;
    nonDismissable?: boolean;
    onCloseButtonClick?: (name: N) => void;
    debugMessage?: string;
}

const alertVariantToClassNameMap: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    [key in AlertVariant]: string;
} = {
    success: styles.success,
    warning: styles.warning,
    danger: styles.danger,
    info: styles.info,
};

function Alert<N extends string>(props: Props<N>) {
    const {
        name,
        className,
        variant = 'info',
        children,
        onCloseButtonClick,
        nonDismissable,
        debugMessage,
    } = props;

    const strings = useTranslation('common', commonStrings);

    const icon: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        [key in AlertVariant]: React.ReactNode;
    } = {
        success: <CheckboxCircleLineIcon className={styles.icon} />,
        danger: <ErrorWarningLineIcon className={styles.icon} />,
        info: <InformationLineIcon className={styles.icon} />,
        warning: <QuestionLineIcon className={styles.icon} />,
    };

    const handleCloseButtonClick = useCallback(() => {
        if (onCloseButtonClick) {
            onCloseButtonClick(name);
        }
    }, [onCloseButtonClick, name]);

    const handleCopyDebugMessageButtonClick = useCallback(() => {
        if (debugMessage) {
            navigator.clipboard.writeText(debugMessage);
        }
    }, [debugMessage]);

    return (
        <div
            className={_cs(
                styles.alert,
                className,
                alertVariantToClassNameMap[variant],
            )}
        >
            <div className={styles.content}>
                <ElementFragments
                    icons={icon[variant]}
                    childrenContainerClassName={styles.content}
                    actions={!nonDismissable && (
                        <Button
                            className={styles.closeButton}
                            name={undefined}
                            onClick={handleCloseButtonClick}
                            variant="tertiary"
                        >
                            <CloseLineIcon />
                        </Button>
                    )}
                >
                    {children}
                </ElementFragments>
            </div>
            {debugMessage && (
                <div className={styles.actions}>
                    <Button
                        className={styles.copyDebugMessageButton}
                        name={undefined}
                        onClick={handleCopyDebugMessageButtonClick}
                        variant="tertiary"
                    >
                        {strings.alertCopyErrorDetails}
                    </Button>
                </div>
            )}
        </div>
    );
}

export default Alert;

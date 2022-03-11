import React from 'react';
import _cs from 'classnames';

import styles from './styles.module.scss';

function EnvironmentBanner({
    className,
}) {
    //const { NODE_ENV: currentEnv } = process.env;

    const currentEnv = window.environment;

    if (window.showEnvBanner === 'false') {
        return null;
    }

    const bannerDescription = window.environmentDisplayName;

    return (
        <div
            className={_cs(
                'sticky-banner staging-footer',
                styles.environmentBanner,
                className,
            )}
        >
            {bannerDescription}
        </div>
    );
}

export default EnvironmentBanner;

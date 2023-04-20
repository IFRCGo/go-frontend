import React from 'react';
import { _cs } from '@togglecorp/fujs';

import Link from '../Links';
import styles from './styles.module.scss';

type LinkVariant = 'regular' | 'secondary' | 'titleLink' | 'textLink' | 'externalLink' | 'specialEmail';

interface Props {
    className?: string;
    href: string;
    hash?: string;
    state?: unknown;
    children?: React.ReactNode;
    icons?: React.ReactNode;
    variant?: LinkVariant;
}

function ButtonLikeLink(props: Props) {
    const {
        className: classNameFromProps,
        href,
        hash,
        state,
        children: childrenFromProps,
        variant = 'regular',
    } = props;

    return (
        <div className={_cs(classNameFromProps, styles.buttonLikeLink)}>
            <Link
                href={href}
                target="_blank"
                variant={variant}
            >
                im@ifrc.org
            </Link>
        </div>
    );
}
export default ButtonLikeLink;
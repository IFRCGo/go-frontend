import React from 'react';
import { _cs } from '@togglecorp/fujs';
import {
  IoChevronForward,
  IoClose,
} from 'react-icons/io5';

import Header from '#components/Header';
import Button, {
  useButtonFeatures,
  Props as ButtonProps,
} from '#components/Button';

import styles from './styles.module.scss';

interface Props {
  className?: string;
  children?: React.ReactNode;
  title?: React.ReactNode;
  href?: string;
  onCloseButtonClick?: ButtonProps<undefined>['onClick'];
  contentClassName?: string;
}

function MapTooltipContent(props: Props) {
  const {
    className,
    children,
    href,
    title,
    onCloseButtonClick,
    contentClassName,
  } = props;

  const linkProps = useButtonFeatures({
    className: styles.title,
    actions: <IoChevronForward />,
    children: title,
    variant: 'tertiary',
  });

  return (
    <div
      className={_cs(styles.mapTooltipContent, className)}
    >
      <Header
        className={styles.header}
        heading={(
          <a
            {...linkProps}
            href={href}
          >
          </a>
        )}
        actions={(
          <Button
            onClick={onCloseButtonClick}
            variant="action"
          >
            <IoClose />
          </Button>
        )}
      />
      <div className={_cs(styles.content, contentClassName)}>
        { children }
      </div>
    </div>
  );
}

export default MapTooltipContent;

import React from 'react';
import { _cs } from '@togglecorp/fujs';

import styles from './styles.module.scss';

export interface BaseProps {
  className?: string;
  title?: React.ReactNode;
  children?: React.ReactNode;
  description?: React.ReactNode;
  contentSectionClassName?: string;
  tooltip?: string;
  multiRow?: boolean;
}

type Props = BaseProps & ({
  oneColumn: true;
  twoColumn?: never;
  threeColumn?: never;
} | {
  oneColumn?: never;
  twoColumn: true;
  threeColumn?: never;
} | {
  oneColumn?: never;
  twoColumn?: never;
  threeColumn: true;
} | {
  oneColumn?: never;
  twoColumn?: never;
  threeColumn?: never;
});

function InputSection(props: Props) {
  const {
    className,
    title,
    children,
    description,
    tooltip,
    multiRow,
    contentSectionClassName,
  } = props;

  return (
    <div
      className={_cs(
        'go-input-section',
        className,
        styles.inputSection,
        multiRow && styles.multiRow,
        props.oneColumn && styles.oneColumn,
        props.twoColumn && styles.twoColumn,
        props.threeColumn && styles.threeColumn,
      )}
    >
      <div
        className={styles.sectionTitle}
        title={tooltip}
      >
        <div className={styles.title}>
          { title }
        </div>
        <div className={styles.description}>
          { description }
        </div>
      </div>
      <div className={_cs(styles.sectionContent, contentSectionClassName)}>
        { children }
      </div>
    </div>
  );
}

export default InputSection;

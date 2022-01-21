import React from 'react';
import { _cs } from '@togglecorp/fujs';

import styles from './styles.module.scss';

interface Data {
  actions?: string[] | undefined;
  description?: string | undefined;
}

export interface BaseProps {
  className?: string;
  title?: React.ReactNode;
  children?: React.ReactNode;
  contentSectionClassName?: string;
  tooltip?: string;
  multiRow?: boolean;
  normalDescription?: boolean;
  data?: Data[];
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

function ViewSection(props: Props) {
  const {
    className,
    title,
    children,
    tooltip,
    contentSectionClassName,
    normalDescription,
    data,
  } = props;

  return (
    <div
      className={_cs(
        'go-input-section',
        className,
        styles.inputSection,
        !normalDescription && styles.specialDescription,
      )}
    >
      {title && (
        <div
          className={styles.sectionTitle}
          title={tooltip}
        >
          <div className={styles.title}>
            {title}
          </div>
        </div>
      )}
      <div className={styles.sectionContent}>
        {data && data.map((el) => (
          <>
            <div className={styles.sectionContentDescription}>
              <div className={styles.label}>
                Description
              </div>
              <div className={styles.value}>
                {el.description}
              </div>
            </div>

            <div className={styles.sectionContentActions}>
              <div className={styles.label}>
                Actions
              </div>
              <div className={styles.value}>
                {el.actions}
              </div>
            </div>
          </>
        ))}
      </div>
      {children && (
        <div className={_cs(styles.sectionContent, contentSectionClassName)}>
          {children}
        </div>
      )}

    </div>
  );
}

export default ViewSection;

import React, { useContext } from 'react';
import { _cs } from '@togglecorp/fujs';

import { ActionsTaken } from '#views/InformalUpdateApplicationForm/common';
import languageContext from '#root/languageContext';

import styles from './styles.module.scss';

export interface BaseProps {
  className?: string;
  title?: React.ReactNode;
  children?: React.ReactNode;
  contentSectionClassName?: string;
  tooltip?: string;
  multiRow?: boolean;
  normalDescription?: boolean;
  data?: ActionsTaken;
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
  const { strings } = useContext(languageContext);

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
            {title} {data?.organization_display}
          </div>
        </div>
      )}
      <div className={styles.sectionContent}>

        <>
          <div className={styles.sectionContentDescription}>
            <div className={styles.label}>
              {strings.informalUpdateDescriptionTitle}
            </div>
            <div className={styles.value}>
              {data?.summary}
            </div>
          </div>

          <div className={styles.sectionContentActions}>
            <div className={styles.label}>
              {strings.informalUpdateActionsTitle}
            </div>
            <div className={styles.value}>
              {data?.action_details?.map((item) =>
                <div key={item?.id}>
                  {item.name}
                </div>
              )}
            </div>
          </div>
        </>

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

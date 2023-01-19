import React from 'react';

import styles from './styles.module.scss';

export interface LanguageString {
  key: string;
  value: string;
  language: string;
  page_name: string;
  hash: string;
}

export interface StringData {
  key: string;
  dev: LanguageString;
  translations: LanguageString[];
}

interface Props {
  data: StringData;
  onClick: (data: StringData) => void;
}

function StringRow(props: Props) {
  const {
    data,
    onClick,
  } = props;

  const handleClick = React.useCallback(() => {
    onClick(data);
  }, [data, onClick]);

  const isNew = !data.translations || data.translations.length === 0;
  const isRemoved = !data.dev;
  const hasAnyObsolete = data.translations?.some((translation) => (
    translation.hash !== data.dev?.hash
  ));

  return (
    <div
      className={styles.stringRow}
      role="presentation"
      onClick={handleClick}
    >
      <div className={styles.pageName}>
        {data.dev?.page_name}
      </div>
      <div className={styles.key}>
        {data.key}
      </div>
      <div className={styles.value}>
        {data.dev?.value}
      </div>
      <div className={styles.translations}>
        {data.translations?.map((t) => t.language).join(', ')}
      </div>
      <div className={styles.status}>
        {isNew && (
            <div className={styles.tag}>New</div>
        )}
        {isRemoved && (
            <div className={styles.tag}>Removed</div>
        )}
        {hasAnyObsolete && (
            <div className={styles.tag}>Obsolete</div>
        )}
      </div>
    </div>
  );
}

export default StringRow;

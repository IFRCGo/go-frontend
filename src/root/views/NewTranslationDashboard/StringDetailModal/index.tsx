import React from 'react';

import BasicModal from '#components/BasicModal';
import TextOutput from '#components/TextOutput';
import Chip from '#components/Chip';

import { StringData } from '../StringRow';

import styles from './styles.module.scss';

interface Props {
  data: StringData;
  onClose: (_?: undefined) => void;
}

function StringDetailModal(props: Props) {
  const {
    data,
    onClose,
  } = props;

  const isNew = !data.translations || data.translations.length === 0;
  const isRemoved = !data.dev;

  return (
    <BasicModal
      onCloseButtonClick={onClose}
      className={styles.stringDetailModal}
      bodyClassName={styles.content}
      heading="Translation String"
    >
      {isNew && (
          <div className={styles.tag}>New</div>
      )}
      {isRemoved && (
          <div className={styles.tag}>Removed</div>
      )}
      <TextOutput
        label="Key"
        value={data.key}
      />
      <TextOutput
        label="Page"
        value={data.dev?.page_name}
      />
      <TextOutput
        label="Dev Value"
        value={data.dev?.value}
        displayType="block"
      />
      <div className={styles.translationsList}>
        <h5>
          Translations
        </h5>
        <div className={styles.translationsListContent}>
          {data.translations?.map((translation) => {
            const isObsolete = translation.hash !== data.dev?.hash;

            return (
              <TextOutput
                displayType="block"
                label={translation.language}
                value={translation.value}
                description={isObsolete && (
                    <div className={styles.tag}>Obsolete</div>
                )}
              />
            );
          })}
        </div>
      </div>
    </BasicModal>
  );
}

export default StringDetailModal;

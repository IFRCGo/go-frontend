import React from 'react';

import { _cs } from '@togglecorp/fujs';

import LanguageSelect from '#components/LanguageSelect';
import languageContext from '#root/languageContext';

import styles from './styles.module.scss';

function TranslationDashboard(p) {
  const { className } = p;
  const { strings } = React.useContext(languageContext);

  const languageKeys = Object.keys(strings);

  const handleSaveButtonClick = React.useCallback(() => {
    console.warn('...save');
  });

  return (
    <div className={_cs(className, styles.translationDashboard)}>
      <header className={styles.header}>
        <h2 className={styles.heading}>
          Translation
        </h2>
        <div className={styles.actions}>
          <LanguageSelect />
          <button className="button">
            Export current
          </button>
          <button className="button">
            Export all 
          </button>
          <button
            className="button"
            onClick={handleSaveButtonClick}
          >
            Save
          </button>
        </div>
      </header>
      <div className={styles.content}>
        { languageKeys.map((k) => (
          <div
            key={k}
            className={styles.row}
          >
            <div className={styles.key}>
              { k }
            </div>
            <div className={styles.value}>
              { strings[k] }
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TranslationDashboard;

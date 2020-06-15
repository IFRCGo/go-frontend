import React from 'react';
import { connect } from 'react-redux';
import _cs from 'classnames';
import spark from 'spark-md5';
import { listToMap } from '@togglecorp/fujs';

import { postLanguageBulkAction } from '#actions';
import lang from '#lang';

import {
  currentLanguageSelector,
  languageDataSelector,
  languageBulkResponseSelector,
} from '#selectors';

import LanguageSelect from '#components/LanguageSelect';
import languageContext from '#root/languageContext';

import styles from './styles.module.scss';

const views = {
  all: 'All',
  added: 'Added',
  removed: 'Removed',
  updated: 'Updated',
};

function StringRow(p) {
  const {
    stringKey,
    value,
  } = p;

  return (
    <div className={styles.row}>
      <div className={styles.key}>
        { stringKey }
      </div>
      <div className={styles.value}>
        { value }
      </div>
    </div>
  );
}


function TranslationDashboard(p) {
  const {
    className,
    postLanguageBulk,
    currentLanguage,
    languageData,
    // languageBulkResponse,
  } = p;
  const { strings } = React.useContext(languageContext);
  const viewKeys = React.useMemo(() => Object.keys(views), []);
  const [currentView, setCurrentView] = React.useState(viewKeys[0]);

  const devStringKeys = React.useMemo(() => {
    const keys = Object.keys(lang);
    return keys.sort((a, b) => (a || '').localeCompare(b));
  }, []);

  const [devStringList, devStrings] = React.useMemo(() => {
    const map = {};
    const list = devStringKeys.map((key) => {
      const hash = spark.hash(lang[key]);
      const languageUnit = {
        key,
        value: lang[key],
        hash,
      };

      map[key] = languageUnit;
      return languageUnit;
    });

    return [list, map];
  }, [devStringKeys]);

  const appStringKeys = React.useMemo(() => {
    const keys = Object.keys(strings);
    return keys.sort((a, b) => (a || '').localeCompare(b));
  }, [strings]);

  const [appStringList, appStrings] = React.useMemo(() => {
    const { strings } = languageData;
    const stringHash = listToMap(strings, d => d.key, d => d.hash);

    const map = {};
    const list = appStringKeys.map((key) => {
      const languageUnit = {
        key,
        value: lang[key],
        hash: stringHash[key],
      };

      map[key] = languageUnit;
      return languageUnit;
    });

    return [list, map];
  }, [appStringKeys, languageData]);

  const [addedKeys, removedKeys, updatedKeys] = React.useMemo(() => {
    const keys = devStringKeys.length < appStringKeys ? appStringKeys : devStringKeys;
    const removedKeys = [];
    const addedKeys = [];
    const updatedKeys = [];

    keys.forEach((key) => {
      const added = !appStrings[key];
      const removed = !devStrings[key];
      const updated = !added && !removed && appStrings[key].hash !== devStrings[key].hash;
      
      if (removed) {
        removedKeys.push(key);
      }

      if (added) {
        addedKeys.push(key);
      }

      if (updated) {
        updatedKeys.push(key);
      }
    });

    return [
      addedKeys,
      removedKeys,
      updatedKeys,
    ];
  }, [devStringKeys, appStringKeys, devStrings, appStrings]);

  const languageKeys = React.useMemo(() => {
    const keys = Object.keys(strings);
    return keys.sort((a, b) => (a || '').localeCompare(b));
  }, [strings]);

  const handleSaveButtonClick = React.useCallback(() => {
    const actions = languageKeys.map((key) => ({
      action: 'set',
      key,
      value: strings[key],
    }));

    const data = { actions };
    postLanguageBulk(currentLanguage, data);
  }, [languageKeys, strings, postLanguageBulk, currentLanguage]);

  const handleOverwriteButtonClick = React.useCallback(() => {
    const actions = devStringKeys.map((key) => ({
      action: 'set',
      key,
      value: devStrings[key].value,
      hash: devStrings[key].hash,
    }));

    const data = { actions };
    postLanguageBulk(currentLanguage, data);
  }, [postLanguageBulk, devStrings, devStringKeys, currentLanguage]);

  const handleTabClick = React.useCallback((e) => {
    setCurrentView(e.target.name);
  }, [setCurrentView]);

  return (
    <div className={_cs(className, styles.translationDashboard)}>
      <header className={styles.header}>
        <div className={styles.topSection}>
          <h2 className={styles.heading}>
            Translation
          </h2>
          <div className={styles.actions}>
            <LanguageSelect />
            <button className="button">
              Export current
            </button>
            <button
              className="button"
              onClick={handleSaveButtonClick}
            >
              Save
            </button>
            <button
              className="button"
              onClick={handleOverwriteButtonClick}
            >
              Overwrite server with local dev copy
            </button>
          </div>
        </div>
        <div className={styles.tabs}>
          { viewKeys.map(viewKey => (
            <button
              key={viewKey}
              name={viewKey}
              onClick={handleTabClick}
              type="button"
            >
              { views[viewKey] }
            </button>
          ))}
        </div>
      </header>
      <div className={styles.content}>
        { currentView === 'all' && languageKeys.map((k) => (
          <StringRow
            key={k}
            stringKey={k}
            value={strings[k]}
          />
        ))}
        { currentView === 'added' && addedKeys.map((k) => (
          <StringRow
            key={k}
            stringKey={k}
            value={devStrings[k]}
          />
        ))}
      </div>
    </div>
  );
}

const mapStateToProps = (state, props) => ({
  languageBulkResponse: languageBulkResponseSelector(state),
  currentLanguage: currentLanguageSelector(state),
  languageData: languageDataSelector(state),
});

const mapDispatchToProps = (dispatch) => ({
  postLanguageBulk: (...args) => dispatch(postLanguageBulkAction(...args)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(React.memo(TranslationDashboard));

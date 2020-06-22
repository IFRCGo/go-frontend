import React from 'react';
import ContentEditable from 'react-contenteditable';
import { connect } from 'react-redux';
import _cs from 'classnames';
import spark from 'spark-md5';
import {
  listToMap,
  isDefined,
} from '@togglecorp/fujs';

import { postLanguageBulkAction } from '#actions';
import lang from '#lang';

import {
  currentLanguageSelector,
  languageDataSelector,
  languageBulkResponseSelector,
} from '#selectors';

import LanguageSelect from '#components/LanguageSelect';

import styles from './styles.module.scss';

const views = {
  all: 'All in server',
  added: 'New by dev',
  removed: 'Removed by dev',
  updated: 'Updated by dev',
};

function StringRow(p) {
  const {
    stringKey,
    devValue,
    value = '',
    editable,
    obsolete,
    onChange,
  } = p;

  // const [html, setHtml] = React.useState(value);
  const handleHtmlChange = React.useCallback((e) => {
    // setHtml(e.target.value);
    if (onChange) {
      onChange(stringKey, e.target.value);
    }
  }, [onChange, stringKey]);

  return (
    <div className={_cs(styles.row, obsolete && styles.obsolete)}>
      <div className={styles.key}>
        { stringKey }
      </div>
      <div className={styles.devValue}>
        { devValue }
      </div>
      <ContentEditable
        className={styles.value}
        html={value}
        onChange={handleHtmlChange}
        disabled={!editable || obsolete}
      />
    </div>
  );
}

function TranslationDashboard(p) {
  const {
    className,
    postLanguageBulk,
    currentLanguage,
    languageData,
  } = p;

  const viewKeys = React.useMemo(() => Object.keys(views), []);
  const [currentView, setCurrentView] = React.useState(viewKeys[0]);

  const appStrings = React.useMemo(() => (
    listToMap(
      languageData.strings || [],
      d => d.key,
      d => ({
        hash: d.hash,
        value: d.value
      }),
    )
  ), [languageData]);

  const appStringKeyList = React.useMemo(() => {
    const keys = Object.keys(appStrings);
    return keys.sort((a, b) => (a || '').localeCompare(b));
  },  [appStrings]);

  const devStringKeyList = React.useMemo(() => {
    const keys = Object.keys(lang);
    return keys.sort((a, b) => (a || '').localeCompare(b));
  }, []);

  const devStrings = React.useMemo(() => {
    const map = devStringKeyList.reduce((acc, key) => {
      acc[key] = {
        value: lang[key],
        hash: spark.hash(lang[key]),
      };

      return acc;
    }, {});

    return map;
  }, [devStringKeyList]);

  const [strings, setStrings] = React.useState(devStrings);
  const handleStringChange = React.useCallback((key, value) => {
    setStrings((oldStrings) => ({
      ...oldStrings,
      [key]: {
        value,
      }
    }));
  }, [setStrings]);

  const [addedKeyList, removedKeyList, updatedKeyList] = React.useMemo(() => {
    const allKeyList = [...new Set([...devStringKeyList, ...appStringKeyList])];
    const removedKeyList = [];
    const addedKeyList = [];
    const updatedKeyList = [];

    allKeyList.forEach((key) => {
      const added = !isDefined(appStrings[key]);
      const removed = !isDefined(devStrings[key]);
      const updated = !added && !removed && appStrings[key].hash !== devStrings[key].hash;

      if (removed) {
        removedKeyList.push(key);
      }

      if (added) {
        addedKeyList.push(key);
      }

      if (updated) {
        updatedKeyList.push(key);
      }
    });

    return [
      addedKeyList,
      removedKeyList,
      updatedKeyList,
    ];
  }, [devStringKeyList, appStringKeyList, devStrings, appStrings]);

  const removedKeys = React.useMemo(() => listToMap(removedKeyList, d => d, d => true), [removedKeyList]);

  const handleSaveButtonClick = React.useCallback(() => {
    const actions = appStringKeyList.map((key) => ({
      action: 'set',
      key,
      value: appStrings[key],
    }));

    const data = { actions };
    postLanguageBulk(currentLanguage, data);
  }, [appStringKeyList, appStrings, postLanguageBulk, currentLanguage]);

  const handleOverwriteButtonClick = React.useCallback(() => {
    const actions = devStringKeyList.map((key) => ({
      action: 'set',
      key,
      value: devStrings[key].value,
      hash: devStrings[key].hash,
    }));

    const data = { actions };
    postLanguageBulk(currentLanguage, data);
  }, [postLanguageBulk, devStrings, devStringKeyList, currentLanguage]);

  const handleTabClick = React.useCallback((e) => {
    setCurrentView(e.target.name);
  }, [setCurrentView]);

  React.useEffect(() => {
    setStrings((oldStrings) => ({
      ...oldStrings,
      ...updatedKeyList.reduce((acc, key) => {
        acc[key] = appStrings[key];
        return acc;
      }, {}),
    }));
  }, [setStrings, updatedKeyList, appStrings]);

  const viewCounts = React.useMemo(() => ({
    all: appStringKeyList.length,
    added: addedKeyList.length,
    removed: removedKeyList.length,
    updated: updatedKeyList.length,
  }), [appStringKeyList, addedKeyList, removedKeyList, updatedKeyList]);

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
              onClick={handleOverwriteButtonClick}
            >
              Overwrite server with local dev copy
            </button>
          </div>
        </div>
        <div className={styles.bottomSection}>
          <div className={styles.tabs}>
            { viewKeys.map(viewKey => (
              <button
                key={viewKey}
                name={viewKey}
                onClick={handleTabClick}
                type="button"
                className={_cs(styles.tab, currentView === viewKey && styles.active)}
              >
                { views[viewKey] }
                &nbsp;
                ({ viewCounts[viewKey] })
              </button>
            ))}
          </div>
          <div className={styles.tabActions}>
            <button
              className="button button--primary-outline"
              onClick={handleSaveButtonClick}
            >
              Save
            </button>
            { currentView === 'removed' && (
              <button>
                Remove outdated keys
              </button>
            )}
          </div>
        </div>
      </header>
      <div className={styles.content}>
        <div className={styles.stringsTable}>
          <div className={styles.headerRow}>
            <div className={styles.key}>
              Key
            </div>
            <div className={styles.devValue}>
              Dev value
            </div>
            <div className={styles.value}>
              Value
            </div>
          </div>
          { currentView === 'all' && appStringKeyList.map((k) => (
            <StringRow
              key={k}
              stringKey={k}
              devValue={devStrings[k]?.value}
              value={strings[k]?.value || appStrings[k]?.value}
              editable={!removedKeys[k]}
              obsolete={removedKeys[k]}
              onChange={handleStringChange}
            />
          ))}
          { currentView === 'added' && addedKeyList.map((k) => (
            <StringRow
              key={k}
              stringKey={k}
              devValue={devStrings[k]?.value}
              value={strings[k]?.value || appStrings[k]?.value}
              editable={!removedKeys[k]}
              obsolete={removedKeys[k]}
              onChange={handleStringChange}
            />
          ))}
          { currentView === 'removed' && removedKeyList.map((k) => (
            <StringRow
              key={k}
              stringKey={k}
              devValue={devStrings[k]?.value}
              value={appStrings[k]?.value}
            />
          ))}
          { currentView === 'updated' && updatedKeyList.map((k) => (
            <StringRow
              key={k}
              stringKey={k}
              devValue={devStrings[k]?.value}
              value={strings[k]?.value || appStrings[k]?.value}
              editable={!removedKeys[k]}
              obsolete={removedKeys[k]}
              onChange={handleStringChange}
            />
          ))}
        </div>
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

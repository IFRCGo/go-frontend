import React from 'react';
import ContentEditable from 'react-contenteditable';
import { connect } from 'react-redux';
import _cs from 'classnames';
import spark from 'spark-md5';
import {
  listToMap,
  isDefined,
} from '@togglecorp/fujs';

import {
  postLanguageBulkAction,
  getLanguageAction,
} from '#actions';
import lang from '#lang';

import {
  currentLanguageSelector,
  languageDataSelector,
  languageBulkResponseSelector,
  languageResponseSelector,
} from '#selectors';


import BlockLoading from '#components/block-loading';
import LanguageSelect from '#components/LanguageSelect';

import AllInServer from './AllInServer';

import styles from './styles.module.scss';

// TODO: use translation
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
    languageResponse,
    languageBulkResponse,
    getLanguage,
  } = p;

  const viewKeys = React.useMemo(() => Object.keys(views), []);
  const [currentView, setCurrentView] = React.useState(viewKeys[0]);
  const prevBulkResponse = React.useRef(languageBulkResponse);

  React.useEffect(() => {
    const { current } = prevBulkResponse;
    if (current.fetching && !languageBulkResponse.fetching && languageBulkResponse.error === null) {
      getLanguage(currentLanguage);
    }

    prevBulkResponse.current = languageBulkResponse;
  }, [prevBulkResponse, languageBulkResponse, currentLanguage, getLanguage]);

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
    const actions = Object.keys(strings).map((key) => ({
      action: 'set',
      key,
      value: strings[key].value,
      hash: strings[key].hash,
    }));

    const data = { actions };
    postLanguageBulk(currentLanguage, data);
  }, [strings, postLanguageBulk, currentLanguage]);

  const handleRemoveOutdatedButtonClick = React.useCallback(() => {
    const actions = removedKeyList.map((key) => ({
      action: 'delete',
      key,
    }));

    const data = { actions };
    postLanguageBulk(currentLanguage, data);
  }, [removedKeyList, postLanguageBulk, currentLanguage]);

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

  const pending = languageResponse.fetching || languageBulkResponse.fetching;

  return (
    <div className={_cs(className, styles.translationDashboard)}>
      <header className={styles.header}>
        <div className={styles.topSection}>
          <h2 className={styles.heading}>
            Translation
          </h2>
          <div className={styles.actions}>
            <LanguageSelect />
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
                disabled={pending}
              >
                {`${views[viewKey]} (${viewCounts[viewKey]})`}
              </button>
            ))}
          </div>
          <div className={styles.tabActions}>
            { currentView === 'removed' ? (
              <button
                className="button button--secondary-bounded"
                onClick={handleRemoveOutdatedButtonClick}
                disabled={pending}
              >
                Remove outdated keys
              </button>
            ) : (
              <button
                className="button button--primary-bounded"
                onClick={handleSaveButtonClick}
                disabled={pending}
              >
                {/* TODO: use translations */}
                Save
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
          { pending ? (
            <BlockLoading />
          ) : (
            <>
              { currentView === 'all' && (
                <AllInServer
                  strings={strings}
                />
              )}
              {/* currentView === 'all' && appStringKeyList.map((k) => (
                <StringRow
                  key={k}
                  stringKey={k}
                  devValue={devStrings[k]?.value}
                  value={strings[k]?.value || appStrings[k]?.value}
                  editable={!removedKeys[k]}
                  obsolete={removedKeys[k]}
                  onChange={handleStringChange}
                />
              )) */}
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state, props) => ({
  languageBulkResponse: languageBulkResponseSelector(state),
  currentLanguage: currentLanguageSelector(state),
  languageData: languageDataSelector(state),
  languageResponse: languageResponseSelector(state),
});

const mapDispatchToProps = (dispatch) => ({
  postLanguageBulk: (...args) => dispatch(postLanguageBulkAction(...args)),
  getLanguage: (...args) => dispatch(getLanguageAction(...args)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(React.memo(TranslationDashboard));

import React from 'react';
import ContentEditable from 'react-contenteditable';
import { connect } from 'react-redux';
import _cs from 'classnames';
import spark from 'spark-md5';
import Helmet from 'react-helmet';
import sheet from 'xlsx';

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

import styles from './styles.module.scss';

// TODO: use translation
const conflictedViews = {
  added: 'New by dev',
  removed: 'Removed by dev',
  updated: 'Updated by dev',
};

const modifiableViews = {
  all: 'All in server',
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

  const handleExportButtonClick = React.useCallback(() => {
    const langEntries = Object.entries(lang);
    const ws = sheet.utils.aoa_to_sheet([
      ['ID', 'dev', 'en', 'fr', 'es', 'ar'],
      ...langEntries,
    ]);
    const wb = sheet.utils.book_new();
    sheet.utils.book_append_sheet(wb, ws);

    sheet.writeFile(wb, 'go-strings.xlsx');
  }, []);

  const conflictedViewKeys = React.useMemo(() => Object.keys(conflictedViews), []);
  const [currentView, setCurrentView] = React.useState(conflictedViewKeys[0]);
  const prevBulkResponse = React.useRef(languageBulkResponse);

  React.useEffect(() => {
    const { current } = prevBulkResponse;
    if (current.fetching && !languageBulkResponse.fetching && languageBulkResponse.error === null) {
      getLanguage(currentLanguage);
    }

    prevBulkResponse.current = languageBulkResponse;
  }, [prevBulkResponse, languageBulkResponse, currentLanguage, getLanguage]);

  const [appStrings, setAppStrings] = React.useState({});

  React.useEffect(() => {
    setAppStrings(
      listToMap(
        languageData.strings || [],
        d => d.key,
        d => ({
          hash: d.hash,
          value: d.value
        }),
      )
    );
  }, [setAppStrings, languageData]);

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
        hash: oldStrings[key].hash,
      }
    }));
  }, [setStrings]);

  const handleAppStringChange = React.useCallback((key, value) => {
    setAppStrings((oldStrings) => ({
      ...oldStrings,
      [key]: {
        value,
        hash: oldStrings[key].hash,
      }
    }));
  }, [setAppStrings]);

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
    const actions = Object.keys(appStrings).map((key) => ({
      action: 'set',
      key,
      value: appStrings[key].value,
      hash: appStrings[key].hash,
    }));

    const data = { actions };
    postLanguageBulk(currentLanguage, data);
  }, [appStrings, postLanguageBulk, currentLanguage]);

  const handleRemoveOutdatedButtonClick = React.useCallback(() => {
    const actions = removedKeyList.map((key) => ({
      action: 'delete',
      key,
    }));

    const data = { actions };
    postLanguageBulk(currentLanguage, data);
  }, [removedKeyList, postLanguageBulk, currentLanguage]);

  const handleResolveButtonClick = React.useCallback(() => {
    const actions = updatedKeyList.map((key) => {
      const value = strings[key].value;
      const devValue = devStrings[key].value;

      return {
        action: 'set',
        key,
        value,
        hash: spark.hash(devValue),
      };
    });

    const data = { actions };
    postLanguageBulk(currentLanguage, data);
  }, [strings, updatedKeyList, devStrings, postLanguageBulk, currentLanguage]);

  const handleAddNewKeysButtonClick = React.useCallback(() => {
    const actions = addedKeyList.map((key) => ({
      action: 'set',
      key,
      value: devStrings[key].value,
      hash: devStrings[key].hash,
    }));

    const data = { actions };
    postLanguageBulk(currentLanguage, data);
  }, [devStrings, addedKeyList, postLanguageBulk, currentLanguage]);

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
  const conflicted = React.useMemo(() => (
    viewCounts.added > 0 || viewCounts.removed > 0 || viewCounts.updated > 0
  ), [viewCounts]);
  const views = conflicted ? conflictedViews : modifiableViews;

  const handleFileInputChange = React.useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const workbook = sheet.read(e.target.result, { type: 'binary' });
        const firstSheet = workbook.SheetNames[0];
        const rowList = sheet.utils.sheet_to_row_object_array(workbook.Sheets[firstSheet]);
        const rows = listToMap(rowList, d => d['ID'], d => d[currentLanguage]);
        const newAppStrings = devStringKeyList.reduce((acc, key) => {
          acc[key] = {
            value: rows[key],
            hash: devStrings[key].hash,
          };
          return acc;
        }, {});

        setAppStrings(newAppStrings);
      };
      reader.readAsBinaryString(file);
    }
  }, [devStringKeyList, devStrings, setAppStrings, currentLanguage]);

  return (
    <div className={_cs(className, styles.translationDashboard)}>
      <Helmet>
        <title>
          IFRC GO - Translation Dashboard
        </title>
      </Helmet>
      <header className={styles.header}>
        <div className={styles.topSection}>
          <h2 className={styles.heading}>
            Translation Dashboard
          </h2>
          <div className={styles.actions}>
            <label htmlFor="import" className={_cs(pending && 'disabled', 'button button--secondary-bounded')}>
              Import from xlsx
            </label>
            <input
              disabled={pending}
              id="import"
              type="file"
              accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              onChange={handleFileInputChange}
              hidden
            />
            <button
              onClick={handleExportButtonClick}
              className='button button--secondary-bounded'
            >
              Export dev strings
            </button>
            <LanguageSelect />
          </div>
        </div>
        <div className={styles.bottomSection}>
          <div className={styles.tabs}>
            { Object.keys(views).map(viewKey => (
              <button
                key={viewKey}
                name={viewKey}
                onClick={handleTabClick}
                type="button"
                className={_cs(styles.tab, (!conflicted || currentView === viewKey) && styles.active)}
                disabled={pending}
              >
                {`${views[viewKey]} (${viewCounts[viewKey]})`}
              </button>
            ))}
          </div>
          <div className={styles.tabActions}>
            { conflicted ? (
              <>
                { currentView === 'removed' && (
                  <button
                    className={_cs(pending && 'disabled', 'button button--secondary-bounded')}
                    onClick={handleRemoveOutdatedButtonClick}
                    disabled={pending}
                  >
                    Remove outdated keys
                  </button>
                )}
                { currentView === 'added' && (
                  <button
                    className={_cs(pending && 'disabled', 'button button--secondary-bounded')}
                    onClick={handleAddNewKeysButtonClick}
                    disabled={pending}
                  >
                    Add new keys
                  </button>
                )}
                { currentView === 'updated' && (
                  <button
                    className={_cs(pending && 'disabled', 'button button--secondary-bounded')}
                    onClick={handleResolveButtonClick}
                    disabled={pending}
                  >
                    Resolve
                  </button>
                )}
              </>
            ) : (
              <button
                className={_cs(pending && 'disabled', 'button button--primary-bounded')}
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
            conflicted ? (
              <>
                { currentView === 'added' && addedKeyList.map((k) => (
                  <StringRow
                    key={k}
                    stringKey={k}
                    devValue={devStrings[k]?.value}
                    value={devStrings[k]?.value}
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
                    value={strings[k]?.value}
                    editable={!removedKeys[k]}
                    obsolete={removedKeys[k]}
                    onChange={handleStringChange}
                  />
                ))}
              </>
            ) : (
              appStringKeyList.map((k) => (
                <StringRow
                  key={k}
                  stringKey={k}
                  devValue={devStrings[k]?.value}
                  value={appStrings[k]?.value}
                  editable={!removedKeys[k]}
                  obsolete={removedKeys[k]}
                  onChange={handleAppStringChange}
                />
              ))
            )
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

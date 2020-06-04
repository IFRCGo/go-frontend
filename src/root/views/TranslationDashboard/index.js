import React from 'react';
import { connect } from 'react-redux';
import _cs from 'classnames';

import { postLanguageBulkAction } from '#actions';
import lang from '#lang';

import {
  currentLanguageSelector,
  languageBulkResponseSelector,
} from '#selectors';

import LanguageSelect from '#components/LanguageSelect';
import languageContext from '#root/languageContext';

import styles from './styles.module.scss';

function TranslationDashboard(p) {
  const {
    className,
    postLanguageBulk,
    currentLanguage,
    // languageBulkResponse,
  } = p;
  const { strings } = React.useContext(languageContext);

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
    const keys = Object.keys(lang);
    const actions = keys.map((key) => ({
      action: 'set',
      key,
      value: lang[key],
    }));

    const data = { actions };
    postLanguageBulk(currentLanguage, data);
  }, [ postLanguageBulk, currentLanguage]);

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

const mapStateToProps = (state, props) => ({
  languageBulkResponse: languageBulkResponseSelector(state),
  currentLanguage: currentLanguageSelector(state),
});

const mapDispatchToProps = (dispatch) => ({
  postLanguageBulk: (...args) => dispatch(postLanguageBulkAction(...args)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(React.memo(TranslationDashboard));

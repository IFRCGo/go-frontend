import React from 'react';
import _cs from 'classnames';
import { connect } from 'react-redux';
import { IoMdArrowDropdown } from 'react-icons/io';

import {
  currentLanguageSelector,
  languageStringsSelector,
  languageResponseSelector,
} from '#selectors';

import {
  setCurrentLanguageAction,
} from '#actions';

import languageContext from '#root/languageContext';
import DropdownMenu from '#components/dropdown-menu';
import NewGlobalLoading from '#components/NewGlobalLoading';

import styles from './styles.module.scss';

const languageOptions = {
  en: 'English',
  fr: 'French',
  es: 'Spanish',
  ar: 'Arabic',
};

function LanguageButton(p) {
  const {
    languageId,
    label,
    onClick,
    className,
    isActive,
  } = p;

  const handleClick = React.useCallback(() => {
    if (onClick) {
      onClick(languageId);
    }
  }, [onClick, languageId]);

  return (
    <button
      className={_cs(className, styles.languageButton, isActive && styles.active )}
      onClick={handleClick}
      type="button"
    >
      { label }
    </button>
  );
}

function LanguageSelect(p) {
  const { setStrings } = React.useContext(languageContext);

  const {
    currentLanguage,
    setCurrentLanguage,
    languageStrings,
    languageResponse,
    className,
  } = p;

  React.useEffect(() => {
    setStrings(languageStrings);
  }, [languageStrings, setStrings]);

  const handleLanguageButtonClick = React.useCallback((languageId) => {
    setCurrentLanguage(languageId);

    // just to make sure the selected language is written in the preference
    setTimeout(() => {
      window.location.reload();
    }, 0);
  }, [setCurrentLanguage]);

  return (
    <>
      { languageResponse.fetching && <NewGlobalLoading /> }
      <DropdownMenu
        label={
          <div
            className={_cs(styles.dropdownMenuLabel, className)}
            title={languageOptions[currentLanguage]}
          >
            {languageOptions[currentLanguage]}
            <IoMdArrowDropdown />
          </div>
        }
        dropdownContainerClassName={styles.dropdown}
      >
        { Object.keys(languageOptions).map(l => (
          <LanguageButton
            isActive={currentLanguage === l}
            key={l}
            languageId={l}
            label={languageOptions[l]}
            onClick={handleLanguageButtonClick}
          />
        ))}
      </DropdownMenu>
    </>
  );
}

const mapStateToProps = (state) => ({
  languageResponse: languageResponseSelector(state),
  currentLanguage: currentLanguageSelector(state),
  languageStrings: languageStringsSelector(state),
});

const mapDispatchToProps = (dispatch) => ({
  setCurrentLanguage: (...args) => dispatch(setCurrentLanguageAction(...args)),
});


export default connect(mapStateToProps, mapDispatchToProps)(LanguageSelect);

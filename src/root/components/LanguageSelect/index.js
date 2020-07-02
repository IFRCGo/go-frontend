import React from 'react';
import _cs from 'classnames';
import { connect } from 'react-redux';
import { IoMdArrowDropdown } from 'react-icons/io';

import {
  currentLanguageSelector,
  languageStringsSelector,
} from '#selectors';

import {
  setCurrentLanguageAction,
  getLanguageAction,
} from '#actions';

import languageContext from '#root/languageContext';
import DropdownMenu from '#components/dropdown-menu';
import Translate from '#components/Translate';

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
    getLanguage,
    currentLanguage,
    setCurrentLanguage,
    languageStrings,
  } = p;

  React.useEffect(() => {
    getLanguage(currentLanguage);

    if (currentLanguage === 'ar') {
      document.body.style.direction = 'rtl';
    } else {
      document.body.style.direction = 'ltr';
    }
  }, [currentLanguage, getLanguage]);

  React.useEffect(() => {
    setStrings(languageStrings);
  }, [languageStrings, setStrings]);

  const handleLanguageButtonClick = React.useCallback((languageId) => {
    setCurrentLanguage(languageId);
  }, [setCurrentLanguage]);

  return (
    <DropdownMenu
      label={
        <div
          className={styles.dropdownMenuLabel}
          title={languageOptions[currentLanguage]}
        >
          <Translate
            stringId="langSelectLabel"
            params={{ currentLanguage }}
          />
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
  );
}

const mapStateToProps = (state) => ({
  currentLanguage: currentLanguageSelector(state),
  languageStrings: languageStringsSelector(state),
});

const mapDispatchToProps = (dispatch) => ({
  setCurrentLanguage: (...args) => dispatch(setCurrentLanguageAction(...args)),
  getLanguage: (...args) => dispatch(getLanguageAction(...args)),
});


export default connect(mapStateToProps, mapDispatchToProps)(LanguageSelect);

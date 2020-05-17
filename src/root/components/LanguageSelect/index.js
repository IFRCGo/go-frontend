import React from 'react';
import _cs from 'classnames';
import { connect } from 'react-redux';
import { IoMdArrowDropdown } from 'react-icons/io';

import {
  currentLangugageSelector,
  currentLanguageStringsSelector,
} from '#selectors';

import {
  setCurrentLanguageAction,
} from '#actions';

import languageContext from '#root/languageContext';
import DropdownMenu from '#components/dropdown-menu';

import styles from './styles.module.scss';

const languageOptions = {
  en: 'English',
  fr: 'French',
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
    currentLanguageStrings,
  } = p;

  React.useEffect(() => {
    setStrings(currentLanguageStrings);
  }, [currentLanguageStrings, setStrings]);

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
          lang: {currentLanguage} <IoMdArrowDropdown />
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
  currentLanguage: currentLangugageSelector(state),
  currentLanguageStrings: currentLanguageStringsSelector(state),
});

const mapDispatchToProps = (dispatch) => ({
  setCurrentLanguage: (...args) => dispatch(setCurrentLanguageAction(...args)),
});


export default connect(mapStateToProps, mapDispatchToProps)(LanguageSelect);

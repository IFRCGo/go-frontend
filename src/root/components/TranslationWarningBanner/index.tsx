import React from 'react';
import { _cs } from '@togglecorp/fujs';
import { languageOptions } from '#utils/lang';
import useReduxState from '#hooks/useReduxState';
import Translate from '#components/Translate';

import styles from './styles.module.scss';

interface Props {
  className?: string;
  originalContentLanguage: keyof typeof languageOptions;
}

function TranslationWarningBanner(props: Props) {
  const {
    className,
    originalContentLanguage,
  } = props;

  const { current: currentLanguage } = useReduxState('lang');

  if (originalContentLanguage === currentLanguage) {
    return null;
  }

  return (
    <div className={_cs(styles.translationWarningBanner, className)}>
      <Translate
        stringId="translationWarning"
        params={{ originalLanguage: languageOptions[originalContentLanguage] }}
      />
    </div>
  );
}

export default TranslationWarningBanner;

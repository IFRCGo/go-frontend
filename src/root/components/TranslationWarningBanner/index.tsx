import React from 'react';
import { _cs } from '@togglecorp/fujs';

import { languageOptions } from '#utils/lang';
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

  return (
    <div className={_cs(styles.translationWarningBanner, className)}>
      The content in this page was machine translated!
    </div>
  );
}

export default TranslationWarningBanner;

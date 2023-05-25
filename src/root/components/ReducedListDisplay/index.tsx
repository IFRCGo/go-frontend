import React from 'react';

import InfoPopup from '#components/InfoPopup';
import { resolveToString } from '#utils/lang';
import LanguageContext from '#root/languageContext';

import styles from './styles.module.scss';

interface Props {
  value?: string[];
  title?: React.ReactNode;
  maxItems?: number;
  minItems?: number;
}

export function ReducedListDisplay(props: Props) {
  const {
    value,
    title,
    maxItems = 4,
    minItems = 2,
  } = props;

  const { strings } = React.useContext(LanguageContext);

  if (!value) {
    return null;
  }

  if (value.length < maxItems) {
    return (
      <>
        {value.join(', ')}
      </>
    );
  }

  const newList = value.slice(0, minItems);
  const infoLabel = resolveToString(
    strings.reducedListDisplayMoreLabel,
    { n: value.length - minItems },
  );

  return (
    <>
      {newList.join(', ')}
      <InfoPopup
        className={styles.reducedListLabel}
        infoLabel={infoLabel}
        hideIcon
        title={title}
        description={value.join(', ')}
      />
    </>
  );
}

export default ReducedListDisplay;

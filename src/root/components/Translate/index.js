import React from 'react';
import _cs from 'classnames';

import languageContext from '#root/languageContext';
import { resolveToString } from '#utils/lang';
import styles from './styles.module.scss';

function Translate(p) {
  const { strings } = React.useContext(languageContext);
  const {
    stringId,
    className,
    params,
  } = p;

  const displayString = React.useMemo(() => {
    const string = strings[stringId];
    const displayString = params ? resolveToString(string, params) : string;
    return displayString;
  }, [stringId, params, strings]);

  return (
    <span className={_cs(styles.translate, className)}>
      { displayString || `undefined ${stringId}` }
    </span>
  );
}


export default Translate;

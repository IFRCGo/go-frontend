import React from 'react';
import _cs from 'classnames';

import languageContext from '#root/languageContext';
import styles from './styles.module.scss';

function Translate(p) {
  const { strings } = React.useContext(languageContext);
  const {
    stringId,
    className,
  } = p;

  return (
    <span className={_cs(styles.translate, className)}>
      { strings[stringId] || `undefined ${stringId}` }
    </span>
  );
}


export default Translate;

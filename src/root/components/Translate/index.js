import React from 'react';
import _cs from 'classnames';
import { isDefined } from '@togglecorp/fujs';

import languageContext from '#root/languageContext';
import lang from '#root/lang';
import { resolveToComponent } from '#utils/lang';
import styles from './styles.module.scss';

function Translate(p) {
  const { strings } = React.useContext(languageContext);
  const {
    stringId,
    className,
    params,
  } = p;

  const displayComponent = React.useMemo(() => {
    const string = strings[stringId] || lang[stringId];
    const display = params ? resolveToComponent(string, params) : string;
    return display;
  }, [stringId, params, strings]);

  return (
    <span className={_cs(styles.translate, className)}>
      { displayComponent }
      { !isDefined(displayComponent) && (
        <React.Fragment>
          undefined <b>{stringId}</b>
        </React.Fragment>
      )}
    </span>
  );
}


export default Translate;

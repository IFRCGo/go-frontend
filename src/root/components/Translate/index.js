import React from 'react';
import { isDefined } from '@togglecorp/fujs';
import _cs from 'classnames';

import languageContext from '#root/languageContext';
import styles from './styles.module.scss';

export function resolveToString(template, params) {
  if (!isDefined(template)) {
    return '';
  }

  const parts = template.split('{');
  const resolvedParts = parts.map(part => {
    const endIndex = part.indexOf('}');

    if (endIndex === -1) {
      return part;
    }

    const key = part.substring(0, endIndex);
    if (!isDefined(params[key])) {
      console.error(`value for key "${key}" not provided`);
      return '';
    }

    return part.replace(`${key}}`, params[key]);
  });

  return resolvedParts.join('');
}

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

import React from 'react';
import _cs from 'classnames';
import { isDefined } from '@togglecorp/fujs';

import LanguageContext from '#goui/utils/languageContext';
import lang from '#goui/utils/lang';
import { resolveToComponent } from '#goui/utils/lang-operations';
import styles from './styles.module.scss';

interface Props {
  className?: string;
  stringId: keyof typeof lang;
  params?: object;
}

function Translate(props: Props) {
  const { strings } = React.useContext(LanguageContext);
  const {
    stringId,
    className,
    params,
  } = props;

  const displayComponent = React.useMemo(() => {
    const string = strings[stringId] || lang[stringId];
    const display = params ? resolveToComponent(string, params) : string;
    return display;
  }, [stringId, params, strings]);

  return (
    <span className={_cs(styles.translate, className)}>
      {displayComponent}
      {!isDefined(displayComponent) && (
        <React.Fragment>
          undefined <b>{stringId}</b>
        </React.Fragment>
      )}
    </span>
  );
}


export default Translate;

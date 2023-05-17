import React from 'react';
import _cs from 'classnames';

import Translate from '#components/Translate';

import ExportOnlyContent from './ExportOnlyContent';
import styles from './styles.module.scss';

function ExportHeader (p) {
  const {
    className,
    mode,
    children,
  } = p;

  return (
    <ExportOnlyContent
      className={_cs(styles.exportHeader, className)}
      mode={mode}
    >
      { children ? (
        { children }
      ) : (
        <Translate stringId='mapFooterDisclaimer'/>
      )}
    </ExportOnlyContent>
  );
}

export default ExportHeader;

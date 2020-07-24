import React from 'react';
import ContentEditable from 'react-contenteditable';
import _cs from 'classnames';

import styles from './styles.module.scss';

function StringRow(p) {
  const {
    stringKey,
    devValue,
    value = '',
    editable,
    obsolete,
    onChange,
  } = p;

  // const [html, setHtml] = React.useState(value);
  const handleHtmlChange = React.useCallback((e) => {
    // setHtml(e.target.value);
    if (onChange) {
      onChange(stringKey, e.target.value);
    }
  }, [onChange, stringKey]);

  return (
    <div className={_cs(styles.row, obsolete && styles.obsolete)}>
      <div className={styles.key}>
        { stringKey }
      </div>
      <div className={styles.devValue}>
        { devValue }
      </div>
      <ContentEditable
        className={styles.value}
        html={value}
        onChange={handleHtmlChange}
        disabled={!editable || obsolete}
      />
    </div>
  );
}

function AllInServer(p) {
  const {
    strings,
    className,
  } = p;

  return (
    <div className={styles.allInServer, className}>
      Okay
    </div>
  );
}

export default AllInServer;


import React from 'react';
import c from 'classnames';
import { environment } from '#config';
import { PropTypes as T } from 'prop-types';
import Translate from '#components/Translate';


export default function ExportButtonComponent (props) {
  return (
    <div className='fold__actions'>
      <button onClick={props.exportAsCsv} className={c('button button--primary-bounded button--small', {
        disabled: props.csv.fetching
      })}>
        <Translate stringId='exportButtonExportTable'/>
      </button>
    </div>
  );
}

if (environment !== 'production') {
  ExportButtonComponent.propTypes = {
    exportAsCsv: T.func,
    csv: T.object
  };
}

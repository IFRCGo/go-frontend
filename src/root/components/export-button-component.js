
import React from 'react';
import c from 'classnames';
import { environment } from '#config';
import { PropTypes as T } from 'prop-types';
import Translate from '#components/Translate';
import { renderToStaticMarkup } from "react-dom/server";


export default function ExportButtonComponent (props) {
  const exportButtonTooltip = renderToStaticMarkup(<Translate stringId='exportButtonTooltip'/>).replace(/<.+?>/g, '');
  return (
    <div className='fold__actions'>
      <button onClick={props.exportAsCsv}
        title={exportButtonTooltip}
        className={c('button button--primary-bounded button--small', {
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

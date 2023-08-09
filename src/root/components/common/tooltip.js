import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { environment } from '#config';
import { PropTypes as T } from 'prop-types';
import InfoIcon from '#components/common/info-icon';
import { Tooltip } from 'react-tooltip';

const TooltipComponent = ({title, description}) => {
  return (
    <React.Fragment>
      <a
        data-tooltip-id="tooltip"
        data-tooltip-html= {ReactDOMServer.renderToStaticMarkup(
          <>
            {title
              ? (
                <header className='tooltip__header' >
                  {title}
                </header>
              ) : null }

            {description
              ? (<span className='tooltip__text' dangerouslySetInnerHTML={{ __html: description }} ></span>)
              : null }
          </>
        )}
      >
        <InfoIcon className='tooltip' />
      </a>
      <Tooltip
        className='tooltip'
        id="tooltip"
      />
    </React.Fragment>
  );
};

export const HoverTooltip = ({title, description, id}) => {
  return (
    <Tooltip
      className='tooltip'
      id={id}
    >
      {title && (
        <header className='tooltip__header' >
          {title}
        </header>
      )}
      {description && (
        <span
          className='tooltip__text'
          dangerouslySetInnerHTML={{ __html: description }}
        >
        </span>
      )}
    </Tooltip>
  );
};

export default TooltipComponent;

if (environment !== 'production') {
  Tooltip.propTypes = {
    title: T.string,
    description: T.string
  };
}

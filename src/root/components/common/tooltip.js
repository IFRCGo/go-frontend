import React from 'react';
import { environment } from '#config';
import { PropTypes as T } from 'prop-types';
import InfoIcon from '#components/common/info-icon';
import {Tooltip} from 'react-tooltip';

const TooltipComponent = ({title, description}) => {
  return (
    <React.Fragment>
      <a data-tip data-for={title ? title : description} data-event='click focus'>
        <InfoIcon className='tooltip' />
      </a>
      <Tooltip
        className='tooltip'
        globalEventOff='click'
        id={title ? title : description}
        aria-haspopup='true'
      >
        { title
          ? (
            <header className='tooltip__header' >
              {title}
            </header>
          ) : null }
        { description
          ? (<span className='tooltip__text' dangerouslySetInnerHTML={{ __html: description }} ></span>)
          : null }
      </Tooltip>
    </React.Fragment>
  );
};

export const HoverTooltip = ({title, description, id}) => {
  return (
    <Tooltip
      className='tooltip'
      id={id}
    >
      { title
        ? (
          <header className='tooltip__header' >
            {title}
          </header>
        )
        : null }
      { description
        ? (<span className='tooltip__text' dangerouslySetInnerHTML={{ __html: description }} ></span>)
        : null }
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

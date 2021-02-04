import React from 'react';
import { environment } from '#config';
import { PropTypes as T } from 'prop-types';
import InfoIcon from '#components/common/info-icon';
import ReactTooltip from 'react-tooltip';

const Tooltip = ({title, description}) => {
  return (
    <React.Fragment>
      <a data-tip data-for={title} data-event='click focus'>
        <InfoIcon className='tooltip' />
      </a>
      <ReactTooltip
        className='tooltip'
        globalEventOff='click'
        id={title}
        aria-haspopup='true'
      >
        <header className='tooltip__header' >
          {title}
        </header>
        <span className='tooltip__text' dangerouslySetInnerHTML={{ __html: description }} ></span>
      </ReactTooltip>
    </React.Fragment>
  );
};

export const HoverTooltip = ({title, description, id}) => {
  return (
    <ReactTooltip
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
    </ReactTooltip>
  );
};

export default Tooltip;

if (environment !== 'production') {
  Tooltip.propTypes = {
    title: T.string,
    description: T.string
  };
}

import React from 'react';
import InfoIcon from '../../../icons/collecticons/circle-information';
import ReactTooltip from 'react-tooltip';

const toolTipContent = {
  APPEAL: {
    title: 'Emergency Appeal',
    description: 'These are medium to large scale emergency operations funded through a public appeal for funds.'
  },
  DREF: {
    title: 'DREF',
    description: 'These are small to medium scale emergency operations funded through the Disaster Relief Emergency Fund (DREF).The DREF provides immediate financial support to National Red Cross and Red Crescent Societies, enabling them to carry out their unique role as first responders after a disaster.'
  }
};

const Tooltip = props => {
  return (
    <React.Fragment>
      <a data-tip data-for='global' data-event='click focus'>
        <InfoIcon className='tooltip' />
      </a>
      <ReactTooltip
        className='tooltip'
        globalEventOff='click'
        id='global'
        aria-haspopup='true'
      >
        <header className='tooltip__header' >
            {toolTipContent.APPEAL.title}
        </header>
        <span className='tooltip__text' >
            {toolTipContent.APPEAL.description}
        </span>

      </ReactTooltip>
    </React.Fragment>
  );
};

export default Tooltip;



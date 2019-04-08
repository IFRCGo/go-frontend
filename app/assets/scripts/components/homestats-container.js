'user strict';

import React from 'react';
import { PropTypes as T } from 'prop-types';
import { environment } from '../config';
import HomestatsComponent from './homestats-component';

export default class Homestats extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      showBudgetTooltip: false,
      tooltipType: 'none',
      positionTop: 0,
      positionLeft: 0
    };

    this.openTooltip = this.openTooltip.bind(this);
    this.closeTooltip = this.closeTooltip.bind(this);
    this.chooseContent = this.chooseContent.bind(this);
  }

  openTooltip (event) {
    const boxWidth = document.getElementById('budget-tooltip-box').offsetWidth;
    const boxHeight = document.getElementById('budget-tooltip-box').offsetHeight;
    const marginTop = this.props.fullscreen
      ? document.getElementById(event.target.id).offsetTop + document.getElementsByClassName('tooltip-button')[0].offsetHeight
      : document.getElementById(event.target.id).offsetTop - boxHeight;
    const marginLeft = document.getElementById(event.target.id).offsetLeft - (boxWidth / 2) + 7;

    this.setState({
      showBudgetTooltip: true,
      tooltipType: event.target.id,
      positionTop: marginTop,
      positionLeft: marginLeft
    });
  }

  chooseContent (props) {
    let title = 'No content';
    let description = 'No content';

    if (props.data.tooltipType === 'tooltip-button-appeal') {
      title = 'Emergency Appeal';
      description = 'These are medium to large scale emergency operations funded through a public appeal for funds.';
    } else if (props.data.tooltipType === 'tooltip-button-dref') {
      title = 'DREF';
      description = 'These are small to medium scale emergency operations funded through the Disaster Relief Emergency Fund (DREF).The DREF provides immediate financial support to National Red Cross and Red Crescent Societies, enabling them to carry out their unique role as first responders after a disaster.';
    }

    return { 'title': title, 'description': description };
  }

  closeTooltip () {
    this.setState({
      showBudgetTooltip: false
    });
  }

  render () {
    return (
      <HomestatsComponent
        openTooltip={this.openTooltip}
        closeTooltip={this.closeTooltip}
        data={this.state}
        appealsList={this.props.appealsList}
        toggleFullscreen={this.props.toggleFullscreen}
        fullscreen={this.props.fullscreen}
        chooseContent={this.chooseContent}/>
    );
  }
}

if (environment !== 'production') {
  Homestats.propTypes = {
    appealsList: T.object,
    toggleFullscreen: T.func
  };
}

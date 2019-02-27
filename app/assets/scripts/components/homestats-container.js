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
      positionTop: 0,
      positionLeft: 0
    };

    this.openTooltip = this.openTooltip.bind(this);
    this.closeTooltip = this.closeTooltip.bind(this);
  }

  openTooltip (event) {
    const boxWidth = document.getElementById('budget-tooltip-box').offsetWidth;
    const boxHeight = document.getElementById('budget-tooltip-box').offsetHeight;
    const marginTop = document.getElementById(event.target.id)
      .getBoundingClientRect().top + window.scrollY - boxHeight;
    const marginLeft = document.getElementById(event.target.id)
      .getBoundingClientRect().left - (boxWidth / 2) + 7;

    this.setState({
      showBudgetTooltip: true,
      positionTop: marginTop,
      positionLeft: marginLeft
    });
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
        appealsList={this.props.appealsList} />
    );
  }
}

if (environment !== 'production') {
  Homestats.propTypes = {
    appealsList: T.object
  };
}

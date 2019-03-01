'use strict';

import React from 'react';
import c from 'classnames';
import { get } from '../../../utils/utils';
import Progress from '../../progress';

export default class EmergenciesLeftMenu extends React.Component {
  constructor (props) {
    super(props);
    this.onListClick = this.onListClick.bind(this);
    this.onListMouseOver = this.onListMouseOver.bind(this);
    this.onListMouseOut = this.onListMouseOut.bind(this);
  }

  onListClick (e) {
    this.props.onDtypeClick(e.currentTarget.dataset.id);
  }

  onListMouseOver (e) {
    this.props.onDtypeHover('mouseover', e.currentTarget.dataset.id);
  }

  onListMouseOut (e) {
    this.props.onDtypeHover('mouseout', e.currentTarget.dataset.id);
  }

  render () {
    const emerg = get(this.props.data, 'operations.data.emergenciesByType', []);
    const max = Math.max.apply(Math, emerg.map(o => o.items.length));

    return (
      <div className='emergencies chart'>
        {this.props.data.noRenderEmergencyTitle ? <h1>Operations by Type</h1> : (
          <React.Fragment>
            <h1>IFRC Emergency Operations</h1>
            <h2 className='heading--xsmall'>Operations by Type</h2>
          </React.Fragment>
        )}
        <ul className='emergencies__list'>
          {emerg.map(o => (
            <li
              key={o.id}
              data-id={o.id}
              className={c('emergencies__item', {'emergencies__item--selected': this.props.selectedDtype === o.id})}
              onClick={this.onListClick}
              onMouseOver={this.onListMouseOver}
              onMouseOut={this.onListMouseOut}>

              <span className='key'>{o.name} ({o.items.length})</span>
              <span className='value'><Progress value={o.items.length} max={max}><span>{o.items.length}</span></Progress></span>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

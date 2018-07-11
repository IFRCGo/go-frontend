'use strict';
import React from 'react';
import { PropTypes as T } from 'prop-types';
import { environment } from '../config';

class BulletTable extends React.Component {
  constructor (props) {
    super(props);
    this.onMouseOver = this.onMouseOver.bind(this);
    this.onMouseOut = this.onMouseOut.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  handleMouseInteraction (e, callback) {
    e.preventDefault();
    const value = e.currentTarget.getAttribute('data-value');
    callback(value);
  }

  onMouseOver (e) {
    if (!this.props.onMouseOver) return;
    this.handleMouseInteraction(e, this.props.onMouseOver);
  }

  onMouseOut (e) {
    if (!this.props.onMouseOut) return;
    this.handleMouseInteraction(e, this.props.onMouseOut);
  }

  onClick (e) {
    if (!this.props.onClick) return;
    this.handleMouseInteraction(e, this.props.onClick);
  }

  render () {
    const { title, rows } = this.props;
    return (
      <div key={title}>
        <h3 className='list-label'>{title}</h3>
        <ul className='pns-list'>
          {rows.map(r => (
            <li key={r.label}
              data-value={r.label}
              onMouseOver={this.onMouseOver}
              onMouseOut={this.onMouseOut}
              onClick={this.onClick}
              className='pns-list__item pns-list__item__canhover'>
              <ul className='list-circle'>
                {[...Array(r.count).keys()].map(i => (
                  <li key={i}></li>
                ))}
              </ul>
              {r.label}
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

if (environment !== 'production') {
  BulletTable.propTypes = {
    title: T.string,
    rows: T.array,
    onMouseOver: T.func,
    onMouseOut: T.func,
    onClick: T.func
  };
}

export default BulletTable;

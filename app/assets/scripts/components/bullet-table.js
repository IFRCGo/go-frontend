'use strict';
import React from 'react';
import { PropTypes as T } from 'prop-types';
import { environment } from '../config';

class BulletTable extends React.Component {
  render () {
    const { title, rows } = this.props;
    return (
      <div key={title}>
        <h3 className='list-label'>{title}</h3>
        <ul className='pns-list'>
          {rows.map(r => (
            <li key={r.label} className='pns-list__item pns-list__item__canhover'>
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
    rows: T.array
  };
}

export default BulletTable;

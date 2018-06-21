'use strict';
import React from 'react';
import { PropTypes as T } from 'prop-types';
import { environment } from '../config';

class BulletTable extends React.Component {
  render () {
    const { title, tables } = this.props;
    return (
      <div className='country__operations'>
        <h2>{title}</h2>
        {tables.map(d => (
          <div key={d.title}>
            <h3 className='list-label'>{d.title}</h3>
            <ul className='pns-list'>
              {d.rows.map(r => (
                <li key={r.label} className='pns-list__item'>
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
        ))}
      </div>
    );
  }
}

if (environment !== 'production') {
  BulletTable.propTypes = {
    title: T.string,
    tables: T.array
  };
}

export default BulletTable;

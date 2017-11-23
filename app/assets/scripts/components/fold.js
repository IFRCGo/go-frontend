'use strict';
import React from 'react';
import { PropTypes as T } from 'prop-types';

import { environment } from '../config';

export default class Fold extends React.Component {
  render () {
    return (
      <div className='fold'>
        <div className='inner'>
          <div className='fold__header'>
            <h2 className='fold__title'>{this.props.title}</h2>
          </div>
          <div className='fold__body'>
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}

if (environment !== 'production') {
  Fold.propTypes = {
    title: T.string,
    children: T.node
  };
}

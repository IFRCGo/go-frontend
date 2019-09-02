'use strict';
import React from 'react';
import { PropTypes as T } from 'prop-types';
import { Link } from 'react-router-dom';
import { environment } from '../config';

class Pills extends React.Component {
  render() {
    console.log('links', this.props.links);
    return (
      <div className='clearfix flex country__pill__wrap'>
        {
          this.props.links.map(link => {
            return (
              <div className='pills__brand__col' key={link.text}>
                <a className='pill__brand' href={link.url} target='_blank'>
                  <div>{link.text}</div>
                </a>
              </div>
            );
          })
        }
      </div>
    );
  }
}

if (environment !== 'production') {
  Pills.propTypes = {
      links: T.array
  };
}

export default Pills;
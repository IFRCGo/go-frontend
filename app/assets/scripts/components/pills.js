'use strict';
import React from 'react';
import { PropTypes as T } from 'prop-types';
import { Link } from 'react-router-dom';
import Fold from './fold';

class Pills extends React.Component {
  render() {
    return (
      <div className='clearfix flex country__pill__wrap'>
        <div className='pills__brand__col'>
          <Link className='pill__brand' to='#'>
            <div>Phillipines on ifrc.org</div>
          </Link>
        </div>
        <div className='pills__brand__col'>
          <Link className='pill__brand' to='#'>
            <div>Phillipines on reliefweb.int</div>
          </Link>
        </div>
        <div className='pills__brand__col'>
        <Link className='pill__brand' to='#'>
          <div>Phillipines on DEEP</div>
        </Link>
        </div>
        <div className='pills__brand__col'>
          <Link className='pill__brand' to='#'>
            <div>Evaluations IFRC DB</div>
          </Link>
        </div>
        <div className='pills__brand__col'>
          <Link className='pill__brand' to='#'>
            <div>Phillipines Homepage</div>
          </Link>
        </div>
      </div>
    );
  }
}

export default Pills;
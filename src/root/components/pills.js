import React from 'react';
import { PropTypes as T } from 'prop-types';
import { environment } from '#config';

class Pills extends React.Component {
  render () {
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

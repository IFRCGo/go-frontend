'use strict';

import React from 'react';
import { connect } from 'react-redux';
import { environment } from '../../config';
import { PropTypes as T } from 'prop-types';
import Fold from '../fold';

class PreparednessPhaseOutcomes extends React.Component {
  render () {
    const header = {float: 'left', borderBottom: '1px solid #000000', padding: '10px', width: '100%'};
    const body = {float: 'left', padding: '5px', width: '100%'};
    const boxContainer = {float: 'left', padding: '10px', width: '33%'};
    const boxContainerCenter = {float: 'left', padding: '10px', width: '34%'};
    const boxInner = {float: 'left', width: '100%', height: '100%', border: '1px solid #000', padding: '5px'};
    const title = {fontWeight: 'bold'};
    return (
      <Fold id='per' title='PER Phase Outcomes' wrapper_class='preparedness'>
        <div style={header}>
          <button className='button button--small button--primary-bounded'>Upload</button>&nbsp;
          <select>
            <option>NS Documents</option>
            <option>PER Process Documents</option>
            <option>NS Document Type</option>
          </select>&nbsp;
          <input type='file' name='uploadfile' id='uploadfile' />
        </div>
        <div style={body}>
          <div style={boxContainer}>
            <div style={boxInner}>
              <p>
                <span style={title}>NS Documents</span>
              </p>
              <p>
                <a className='link--primary export--link' href='/test.pdf'>Test PDF</a>
              </p>
              <p>
                <a className='link--primary export--link' href='/test.pdf'>Serious information PDF</a>
              </p>
              <p>
                <a className='link--primary export--link' href='/test.pdf'>Status report PDF</a>
              </p>
            </div>
          </div>
          <div style={boxContainerCenter}>
            <div style={boxInner}>
              <p>
                <span style={title}>PER Process Documents</span>
              </p>
              <p>
                <a className='link--primary export--link' href='/test.pdf'>Test PDF</a>
              </p>
              <p>
                <a className='link--primary export--link' href='/test.pdf'>Serious information PDF</a>
              </p>
              <p>
                <a className='link--primary export--link' href='/test.pdf'>Status report PDF</a>
              </p>
            </div>
          </div>
          <div style={boxContainer}>
            <div style={boxInner}>
              <p>
                <span style={title}>NS Document Type</span>
              </p>
              <p>
                <a className='link--primary export--link' href='/test.pdf'>Test PDF</a>
              </p>
              <p>
                <a className='link--primary export--link' href='/test.pdf'>Serious information PDF</a>
              </p>
              <p>
                <a className='link--primary export--link' href='/test.pdf'>Status report PDF</a>
              </p>
            </div>
          </div>
        </div>
      </Fold>
    );
  }
}

if (environment !== 'production') {
  PreparednessPhaseOutcomes.propTypes = {};
}

const selector = (state) => ({});

const dispatcher = (dispatch) => ({});

export default connect(selector, dispatcher)(PreparednessPhaseOutcomes);

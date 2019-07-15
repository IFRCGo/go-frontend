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
    const boxContainer = {float: 'left', padding: '10px', width: '100%'};
    const boxInner = {float: 'left', width: '100%', height: '100%', border: '1px solid #000', padding: '5px'};
    const title = {fontWeight: 'bold'};
    const links = [];
    this.props.getPerUploadedDocuments.data.results.forEach((link) => {
      if (link.visibility === 1) {
        links.push(<p>
          <a className='link--primary export--link' target='_blank' href={'http://dsgofilestorage.blob.core.windows.net/api/perdocs/' + this.props.countryId + '/23472915_1855956657767025_835097203667582284_n.jpg'}>{link.name}</a>
        </p>);
      }
    });
    return (
      <Fold id='per' title='PER Phase Outcomes' wrapper_class='preparedness'>
        <div style={header}>
          <a href='https://dsgocdnapi.azureedge.net/admin/per/nicedocument/' target='_blank' className='button button--small button--primary-bounded'>Upload</a>&nbsp;
        </div>
        <div style={body}>
          <div style={boxContainer}>
            <div style={boxInner}>
              <p>
                <span style={title}>PER related uploaded documents</span>
              </p>
              {links}
            </div>
          </div>
        </div>
      </Fold>
    );
  }
}

if (environment !== 'production') {
  PreparednessPhaseOutcomes.propTypes = {
    _getPerNsPhase: T.func,
    getPerUploadedDocuments: T.object,
    countryId: T.string
  };
}

const selector = (state) => ({
  getPerNsPhase: state.perForm.getPerNsPhase
});

const dispatcher = (dispatch) => ({
  _getPerNsPhase: () => dispatch('getPerNsPhase()')
});

export default connect(selector, dispatcher)(PreparednessPhaseOutcomes);

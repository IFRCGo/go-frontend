
import React from 'react';
import { connect } from 'react-redux';
import { environment } from '#config';
import { PropTypes as T } from 'prop-types';
import Fold from '../fold';
import Translate from '#components/Translate';

class PreparednessPhaseOutcomes extends React.Component {
  render () {
    if (typeof this.props.getPerUploadedDocuments.data.results === 'undefined') return null;
    const header = {float: 'left', padding: '10px', width: '100%'};
    const body = {float: 'left', padding: '5px', width: '100%'};
    const boxContainer = {float: 'left', padding: '10px', width: '100%'};
    const boxInner = {float: 'left', width: '100%', height: '100%', borderBottom: '1px solid rgba(0,0,0,0.1)', padding: '5px'};
    const title = {fontWeight: 'bold'};
    const links = [];
    this.props.getPerUploadedDocuments.data.results.forEach((link, index) => {
      if (link.visibility === 1) {
        links.push(<p key={'perUploadedDoc' + index}>
          <a className='link--primary export--link' target='_blank' href={link.document}>{link.name}</a>
        </p>);
      }
    });
    return (
      <Fold id='per-outcomes' title='PER Phase Outcomes' wrapper_class='preparedness' foldClass='margin-reset'>
        <div style={header}>
          <a href='https://dsgocdnapi.azureedge.net/admin/per/nicedocument/' target='_blank' className='button button--small button--primary-bounded'>Upload</a>&nbsp;
        </div>
        <div style={body}>
          <div style={boxContainer}>
            <div style={boxInner}>
              <p>
                <span style={title}>
                  <Translate stringId='preparednessPhaseOutcomes'/>
                </span>
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
  getPerNsPhase: state.perForm.getPerNsPhase,
  user: state.user.data
});

const dispatcher = (dispatch) => ({
  _getPerNsPhase: () => dispatch('getPerNsPhase()')
});

export default connect(selector, dispatcher)(PreparednessPhaseOutcomes);

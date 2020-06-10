import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { get } from '#utils/utils';
import Fold from '../fold';
import TabContent from '../tab-content';
import { NO_DATA } from '#utils/constants';

import { getEventSnippets } from '#actions/';

class Snippets extends Component {
  componentDidMount () {
    this.props._getEventSnippets(this.props.eventId);
  }
  render () {
    const { fetching, error, data } = this.props.snippets;
    if (fetching || error) return null;

    return (
      <TabContent showError={true} isError={!get(data, 'results.length')} errorMessage={ NO_DATA } title="Additional Graphics">
        <Fold id='graphics' showHeader={false} title='Additional Graphics' wrapper_class='additional-graphics'>
          <div className='iframe__container'>
            {data.results.map(o => o.snippet ? <div className='snippet__item' key={o.id} dangerouslySetInnerHTML={{__html: o.snippet}} />
              : o.image ? <div key={o.id} className='snippet__item snippet__image'><img src={o.image}/></div> : null
            )}
          </div>
        </Fold>
      </TabContent>
    );
  }
}

Snippets.propTypes = {
  _getEventSnippets: PropTypes.func,
  eventId: PropTypes.number,
  snippets: PropTypes.object
};

// /////////////////////////////////////////////////////////////////// //
// Connect functions

const selector = (state, ownProps) => {
  const snippets = {
    snippets: get(state.event.snippets, ownProps.eventId, {
      data: {
        results: []
      },
      fetching: false,
      fetched: false
    })
  };

  // filter for snippets of the current tab
  if (snippets.snippets.data && snippets.snippets.data.results.length) {
    snippets.snippets.data.results = snippets.snippets.data.results.filter(s => {
      return s.tab === ownProps.tab;
    });
  }

  return snippets;
};

const dispatcher = (dispatch) => ({
  _getEventSnippets: (...args) => dispatch(getEventSnippets(...args))
});

export default withRouter(connect(selector, dispatcher)(Snippets));

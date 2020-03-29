import React, { Component } from 'React';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { get } from '../../utils/utils';
import Fold from '../fold';
import TabContent from '../tab-content';
import { NO_DATA } from '../../utils/constants';

import { getEventSnippets } from '../../actions/';

class Snippets extends Component {
  componentDidMount () {
    this.props._getEventSnippets(this.props.eventId);
  }
  render () {
    const { fetching, fetched, error, data } = this.props.snippets;
    if (fetching || error || (fetched && !data.results.length)) return null;
    return (
      <TabContent showError={true} isError={!get(data, 'results.length')} errorMessage={ NO_DATA } title="Additional Graphics">
        <Fold id='graphics' title='Additional Graphics' wrapper_class='additional-graphics'>
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
  eventId: PropTypes.string,
  snippets: PropTypes.object
};

// /////////////////////////////////////////////////////////////////// //
// Connect functions

const selector = (state, ownProps) => ({
  snippets: get(state.event.snippets, ownProps.eventId, {
    data: {
      results: []
    },
    fetching: false,
    fetched: false
  })
});

const dispatcher = (dispatch) => ({
  _getEventSnippets: (...args) => dispatch(getEventSnippets(...args))
});

export default withRouter(connect(selector, dispatcher)(Snippets));

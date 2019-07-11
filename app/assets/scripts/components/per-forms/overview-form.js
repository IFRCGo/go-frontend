'use strict';

import {
  sendPerForm,
  getPerDocument,
  getPerDraftDocument,
  sendPerDraft,
  editPerDocument
} from '../../actions';
import { connect } from 'react-redux';
import { environment } from '../../config';
import { PropTypes as T } from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';

class OverviewForm extends React.Component{
  constructor (props) {
    super(props);
  }

  render () {
    return (
    <React.Fragment>
      <Link to='/account#per-forms' className='button button--medium button--primary-filled' style={{float: 'right', marginBottom: '1rem'}}>Exit form</Link>
      <div className='fold'>
        <div className='inner'>

          <div className="fold__header">
            <h2 className="fold__title">WELCOME TO THE PREPAREDNESS FOR EFFECTIVE RESPONSE - OVERVIEW FORM</h2>
          </div>
          <div style={{clear: 'both'}}></div>

          <div>
            <div className='per_form_ns'>General Information</div>
            National Society:<br />
            <input type='text' name='national_society' /><br /><br />

            Date of current capacity assessment<br />
            <input type='text' name='date_of_current_assessment' /><br /><br />

            Type of capacity assessment<br />
            <select>
              <option>Self assessment</option>
              <option>Simulation</option>
              <option>Operation</option>
              <option>Post operational</option>
            </select><br /><br />

            Branch involved:<br />
            <input type='text' name='date_of_current_assessment' /><br /><br />

            Focal point name in the National Society:<br />
            <input type='text' name='date_of_current_assessment' /><br /><br />

            Focal point email in the National Society:<br />
            <input type='text' name='date_of_current_assessment' /><br /><br />

            Have you had a previous capacity assessment?<br />
            <select>
              <option>Yes</option>
              <option>No</option>
            </select><br /><br />

            <div className='per_form_ns'>General Information</div>
            Facilitated by<br />
            <input type='text' name='date_of_current_assessment' /><br /><br />

            E-mail<br />
            <input type='text' name='date_of_current_assessment' /><br /><br />

            Phone number<br />
            <input type='text' name='date_of_current_assessment' /><br /><br />

            Please include the code of the country<br />
            <input type='text' name='date_of_current_assessment' /><br /><br />

            Skype address<br />
            <input type='text' name='date_of_current_assessment' /><br /><br />

            Date of mid-term review (approximate date)<br />
            <input type='text' name='date_of_current_assessment' /><br /><br />

            it is a predicted future date<br />
            <input type='text' name='date_of_current_assessment' /><br /><br />

            Approximate date of next capacity assessment<br />
            <input type='text' name='date_of_current_assessment' /><br /><br />

            <button className='button button--medium button--primary-filled'>Submit form</button>
          </div>
        </div>
      </div>
    </React.Fragment>);
  }
}

// /////////////////////////////////////////////////////////////////// //
// Connect functions

if (environment !== 'production') {
  OverviewForm.propTypes = {
    _sendPerForm: T.func,
    sendPerFormResponse: T.object
  };
}

const selector = (state) => ({
  sendPerForm: state.perForm.sendPerForm,
  perDocument: state.perForm.getPerDocument,
  sendPerDraft: state.perForm.sendPerDraft,
  getPerDraftDocument: state.perForm.getPerDraftDocument,
  user: state.user
});

const dispatcher = (dispatch) => ({
  _sendPerForm: (payload) => dispatch(sendPerForm(payload)),
  _getPerDocument: (...args) => dispatch(getPerDocument(...args)),
  _getPerDraftDocument: (...args) => dispatch(getPerDraftDocument(...args)),
  _sendPerDraft: (payload) => dispatch(sendPerDraft(payload)),
  _editPerDocument: (payload) => dispatch(editPerDocument(payload))
});

export default connect(selector, dispatcher)(OverviewForm);

'use strict';

import {
  sendPerForm,
  getPerDocument,
  getPerDraftDocument,
  sendPerDraft,
  editPerDocument,
  getPerOverviewForm
} from '../../actions';
import { connect } from 'react-redux';
import { environment } from '../../config';
import { PropTypes as T } from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';

class OverviewForm extends React.Component {
  componentDidMount () {
    this.props._getPerOverviewForm(null ,this.props.formId);
  }

  render () {
    if (this.props.view) {
      if (!this.props.perOverviewForm.fetched) return null;
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
                <input type='text' disabled='disabled' value={this.props.perOverviewForm.data.results[0].country.society_name === null ? '' : this.props.perOverviewForm.data.results[0].country.society_name} /><br /><br />

                Date of current capacity assessment<br />
                <input type='text' disabled='disabled' value={this.props.perOverviewForm.data.results[0].date_of_current_capacity_assessment === null ? '' : this.props.perOverviewForm.data.results[0].date_of_current_capacity_assessment} /><br /><br />

                Type of capacity assessment<br />
                <input type='text' disabled='disabled' value={this.props.perOverviewForm.data.results[0].type_of_capacity_assessment === null ? '' : this.props.perOverviewForm.data.results[0].type_of_capacity_assessment} /><br /><br />

                Branch involved:<br />
                <input type='text' disabled='disabled' value={this.props.perOverviewForm.data.results[0].branch_involved === null ? '' : this.props.perOverviewForm.data.results[0].branch_involved} /><br /><br />

                Focal point name in the National Society:<br />
                <input type='text' disabled='disabled' value={this.props.perOverviewForm.data.results[0].focal_point_name === null ? '' : this.props.perOverviewForm.data.results[0].focal_point_name} /><br /><br />

                Focal point email in the National Society:<br />
                <input type='text' disabled='disabled' value={this.props.perOverviewForm.data.results[0].focal_point_email === null ? '' : this.props.perOverviewForm.data.results[0].focal_point_email === null} /><br /><br />

                Have you had a previous capacity assessment?<br />
                <input type='text' disabled='disabled' value={this.props.perOverviewForm.data.results[0].had_previous_assessment === null ? '' : this.props.perOverviewForm.data.results[0].had_previous_assessment} /><br /><br />

                <div className='per_form_ns'>Facilitator information</div>
                Facilitated by<br />
                <input type='text' disabled='disabled' value={this.props.perOverviewForm.data.results[0].facilitated_by === null ? '' : this.props.perOverviewForm.data.results[0].facilitated_by} /><br /><br />

                E-mail<br />
                <input type='text' disabled='disabled' value={this.props.perOverviewForm.data.results[0].facilitator_email === null ? '' : this.props.perOverviewForm.data.results[0].facilitator_email} /><br /><br />

                Phone number<br />
                <input type='text' disabled='disabled' value={this.props.perOverviewForm.data.results[0].phone_number === null ? '' : this.props.perOverviewForm.data.results[0].phone_number} /><br /><br />

                Skype address<br />
                <input type='text' disabled='disabled' value={this.props.perOverviewForm.data.results[0].skype_address === null ? '' : this.props.perOverviewForm.data.results[0].skype_address} /><br /><br />

                Date of mid-term review (approximate date)<br />
                <input type='text' disabled='disabled' value={this.props.perOverviewForm.data.results[0].date_of_mid_term_review === null ? '' : this.props.perOverviewForm.data.results[0].date_of_mid_term_review} /><br /><br />

                Approximate date of next capacity assessment<br />
                <input type='text' disabled='disabled' value={this.props.perOverviewForm.data.results[0].approximate_date_next_capacity_assmt === null ? '' : this.props.perOverviewForm.data.results[0].approximate_date_next_capacity_assmt} /><br /><br />
              </div>
            </div>
          </div>
        </React.Fragment>);
    } else {
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

                <div className='per_form_ns'>Facilitator information</div>
                Facilitated by<br />
                <input type='text' name='date_of_current_assessment' /><br /><br />

                E-mail<br />
                <input type='text' name='date_of_current_assessment' /><br /><br />

                Phone number<br />
                <input type='text' name='date_of_current_assessment' /><br /><br />

                Skype address<br />
                <input type='text' name='date_of_current_assessment' /><br /><br />

                Date of mid-term review (approximate date)<br />
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
}

// /////////////////////////////////////////////////////////////////// //
// Connect functions

if (environment !== 'production') {
  OverviewForm.propTypes = {
    _sendPerForm: T.func,
    _getPerOverviewForm: T.func,
    sendPerFormResponse: T.object,
    view: T.bool
  };
}

const selector = (state) => ({
  sendPerForm: state.perForm.sendPerForm,
  perDocument: state.perForm.getPerDocument,
  sendPerDraft: state.perForm.sendPerDraft,
  getPerDraftDocument: state.perForm.getPerDraftDocument,
  perOverviewForm: state.perForm.getPerOverviewForm,
  user: state.user
});

const dispatcher = (dispatch) => ({
  _sendPerForm: (payload) => dispatch(sendPerForm(payload)),
  _getPerDocument: (...args) => dispatch(getPerDocument(...args)),
  _getPerDraftDocument: (...args) => dispatch(getPerDraftDocument(...args)),
  _sendPerDraft: (payload) => dispatch(sendPerDraft(payload)),
  _editPerDocument: (payload) => dispatch(editPerDocument(payload)),
  _getPerOverviewForm: (...args) => dispatch(getPerOverviewForm(...args))
});

export default connect(selector, dispatcher)(OverviewForm);

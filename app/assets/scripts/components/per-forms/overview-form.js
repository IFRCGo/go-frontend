'use strict';

import {
  sendPerForm,
  getPerDocument,
  getPerDraftDocument,
  sendPerDraft,
  editPerDocument,
  getPerOverviewForm,
  sendPerOverview
} from '../../actions';
import { connect } from 'react-redux';
import { environment } from '../../config';
import { PropTypes as T } from 'prop-types';
import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { showAlert } from '../system-alerts';

const assessmentTypes = [
  'Self assessment',
  'Simulation',
  'Operation',
  'Post operational'
];

class OverviewForm extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      redirect: false
    };
    this.submitForm = this.submitForm.bind(this);
    this.saveDraft = this.saveDraft.bind(this);
    this.loadedDraft = null;
    this.sendInProgress = false;
  }

  componentDidMount () {
    this.sendInProgress = false;
    if (this.props.view) {
      this.props._getPerOverviewForm(null, this.props.formId);
    } else {
      const filters = {};
      filters.user = this.props.user.data.id;
      filters.code = 'overview';
      filters.country = this.props.nationalSociety;
      this.props._getPerDraftDocument(filters);
    }
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.getPerDraftDocument.fetched !== nextProps.getPerDraftDocument.fetched && nextProps.getPerDraftDocument.data.count === 1) {
      this.loadedDraft = JSON.parse(nextProps.getPerDraftDocument.data.results[0].data.replace(/'/g, '"'));
    }
  }

  componentDidUpdate () {
    if (this.loadedDraft !== null && !this.sendInProgress) {
      this.loadDraft();
    }
  }

  submitForm () {
    this.sendInProgress = true;
    const builtFormData = {
      country_id: parseInt(this.props.nationalSociety),
      user_id: this.props.user.data.id,
      type_of_capacity_assessment: parseInt(document.getElementsByName('capacity_assessment_type')[0].value),
      branch_involved: document.getElementsByName('branch_involved')[0].value,
      focal_point_name: document.getElementsByName('focal_point_name')[0].value,
      focal_point_email: document.getElementsByName('focal_point_email')[0].value,
      had_previous_assessment: document.getElementsByName('prev_capacity_assessment')[0].value,
      focus: document.getElementsByName('focus')[0].value,
      facilitated_by: document.getElementsByName('facilitated_by')[0].value,
      facilitator_email: document.getElementsByName('facilitator_email')[0].value,
      phone_number: document.getElementsByName('facilitator_phone')[0].value,
      skype_address: document.getElementsByName('facilitator_skype')[0].value,
      date_of_current_capacity_assessment: document.getElementsByName('date_of_current_assessment_year')[0].value + '-' + document.getElementsByName('date_of_current_assessment_month')[0].value + '-' + document.getElementsByName('date_of_current_assessment_day')[0].value + ' 00:00:00.00+00',
      date_of_mid_term_review: document.getElementsByName('date_of_mid_review_year')[0].value + '-' + document.getElementsByName('date_of_mid_review_month')[0].value + '-' + document.getElementsByName('date_of_mid_review_day')[0].value + ' 00:00:00.00+00',
      approximate_date_next_capacity_assmt: document.getElementsByName('date_of_next_assessment_year')[0].value + '-' + document.getElementsByName('date_of_next_assessment_month')[0].value + '-' + document.getElementsByName('date_of_next_assessment_day')[0].value + ' 00:00:00.00+00',
      date_of_last_capacity_assessment: document.getElementsByName('date_of_last_assessment_year')[0].value + '-' + document.getElementsByName('date_of_last_assessment_month')[0].value + '-' + document.getElementsByName('date_of_last_assessment_day')[0].value + ' 00:00:00.00+00',
      type_of_last_capacity_assessment: parseInt(document.getElementsByName('type_of_last_assessment')[0].value)
    };

    this.props._sendPerOverview(builtFormData);
    showAlert('success', <p>Overview form has been saved successfully!</p>, true, 2000);
    this.setState({redirect: true});
  }

  buildDraftData () {
    return {
      country_id: parseInt(this.props.nationalSociety),
      user_id: this.props.user.data.id,
      name: 'overview',
      submitted_at: '',
      type_of_capacity_assessment: parseInt(document.getElementsByName('capacity_assessment_type')[0].selectedIndex),
      branch_involved: document.getElementsByName('branch_involved')[0].value,
      focal_point_name: document.getElementsByName('focal_point_name')[0].value,
      focal_point_email: document.getElementsByName('focal_point_email')[0].value,
      had_previous_assessment: document.getElementsByName('prev_capacity_assessment')[0].selectedIndex,
      focus: document.getElementsByName('focus')[0].value,
      facilitated_by: document.getElementsByName('facilitated_by')[0].value,
      facilitator_email: document.getElementsByName('facilitator_email')[0].value,
      phone_number: document.getElementsByName('facilitator_phone')[0].value,
      skype_address: document.getElementsByName('facilitator_skype')[0].value,

      date_of_current_assessment_year: document.getElementsByName('date_of_current_assessment_year')[0].selectedIndex,
      date_of_current_assessment_month: document.getElementsByName('date_of_current_assessment_month')[0].selectedIndex,
      date_of_current_assessment_day: document.getElementsByName('date_of_current_assessment_day')[0].selectedIndex,

      date_of_last_assessment_year: document.getElementsByName('date_of_last_assessment_year')[0].selectedIndex,
      date_of_last_assessment_month: document.getElementsByName('date_of_last_assessment_month')[0].selectedIndex,
      date_of_last_assessment_day: document.getElementsByName('date_of_last_assessment_day')[0].selectedIndex,

      date_of_mid_review_year: document.getElementsByName('date_of_mid_review_year')[0].selectedIndex,
      date_of_mid_review_month: document.getElementsByName('date_of_mid_review_month')[0].selectedIndex,
      date_of_mid_review_day: document.getElementsByName('date_of_mid_review_day')[0].selectedIndex,

      date_of_next_assessment_year: document.getElementsByName('date_of_next_assessment_year')[0].selectedIndex,
      date_of_next_assessment_month: document.getElementsByName('date_of_next_assessment_month')[0].selectedIndex,
      date_of_next_assessment_day: document.getElementsByName('date_of_next_assessment_day')[0].selectedIndex,
      type_of_last_assessment: document.getElementsByName('type_of_last_assessment')[0].selectedIndex
    };
  }

  saveDraft () {
    const builtFormData = this.buildDraftData();
    this.loadedDraft = builtFormData;
    const finalRequest = {code: 'overview', user_id: this.props.user.data.id + '', data: builtFormData, country_id: this.props.nationalSociety};
    showAlert('success', <p>Overview form has been saved successfully!</p>, true, 2000);
    this.props._sendPerDraft(finalRequest);
  }

  loadDraft () {
    const data = this.loadedDraft;
    document.getElementsByName('capacity_assessment_type')[0].selectedIndex = data.type_of_capacity_assessment;
    document.getElementsByName('branch_involved')[0].value = data.branch_involved;
    document.getElementsByName('focal_point_name')[0].value = data.focal_point_name;
    document.getElementsByName('focal_point_email')[0].value = data.focal_point_email;
    document.getElementsByName('prev_capacity_assessment')[0].selectedIndex = data.had_previous_assessment;
    document.getElementsByName('focus')[0].value = data.focus;
    document.getElementsByName('facilitated_by')[0].value = data.facilitated_by;
    document.getElementsByName('facilitator_email')[0].value = data.facilitator_email;
    document.getElementsByName('facilitator_phone')[0].value = data.phone_number;
    document.getElementsByName('facilitator_skype')[0].value = data.skype_address;

    document.getElementsByName('date_of_current_assessment_year')[0].selectedIndex = data.date_of_current_assessment_year;
    document.getElementsByName('date_of_current_assessment_month')[0].selectedIndex = data.date_of_current_assessment_month;
    document.getElementsByName('date_of_current_assessment_day')[0].selectedIndex = data.date_of_current_assessment_day;

    document.getElementsByName('date_of_last_assessment_year')[0].selectedIndex = data.date_of_last_assessment_year;
    document.getElementsByName('date_of_last_assessment_month')[0].selectedIndex = data.date_of_last_assessment_month;
    document.getElementsByName('date_of_last_assessment_day')[0].selectedIndex = data.date_of_last_assessment_day;

    document.getElementsByName('date_of_mid_review_year')[0].selectedIndex = data.date_of_mid_review_year;
    document.getElementsByName('date_of_mid_review_month')[0].selectedIndex = data.date_of_mid_review_month;
    document.getElementsByName('date_of_mid_review_day')[0].selectedIndex = data.date_of_mid_review_day;

    document.getElementsByName('date_of_next_assessment_year')[0].selectedIndex = data.date_of_next_assessment_year;
    document.getElementsByName('date_of_next_assessment_month')[0].selectedIndex = data.date_of_next_assessment_month;
    document.getElementsByName('date_of_next_assessment_day')[0].selectedIndex = data.date_of_next_assessment_day;

    document.getElementsByName('type_of_last_assessment')[0].selectedIndex = data.type_of_last_assessment;
  }

  render () {
    if (this.state.redirect) {
      return <Redirect to='/account' />;
    }
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
                <input type='text' disabled='disabled' value={this.props.perOverviewForm.data.results[0].type_of_capacity_assessment === null ? '' : assessmentTypes[this.props.perOverviewForm.data.results[0].type_of_capacity_assessment]} /><br /><br />

                Branch involved:<br />
                <input type='text' disabled='disabled' value={this.props.perOverviewForm.data.results[0].branch_involved === null ? '' : this.props.perOverviewForm.data.results[0].branch_involved} /><br /><br />

                Focal point name in the National Society:<br />
                <input type='text' disabled='disabled' value={this.props.perOverviewForm.data.results[0].focal_point_name === null ? '' : this.props.perOverviewForm.data.results[0].focal_point_name} /><br /><br />

                Focal point email in the National Society:<br />
                <input type='text' disabled='disabled' value={this.props.perOverviewForm.data.results[0].focal_point_email === null ? '' : this.props.perOverviewForm.data.results[0].focal_point_email === null} /><br /><br />

                Have you had a previous capacity assessment?<br />
                <input type='text' disabled='disabled' value={this.props.perOverviewForm.data.results[0].had_previous_assessment === null ? '' : this.props.perOverviewForm.data.results[0].had_previous_assessment} /><br /><br />

                Date of last capacity assessment<br />
                <input type='text' disabled='disabled' value={this.props.perOverviewForm.data.results[0].date_of_last_capacity_assessment === null ? '' : this.props.perOverviewForm.data.results[0].date_of_last_capacity_assessment} /><br /><br />

                Type of last capacity assessment:<br />
                <input type='text' disabled='disabled' value={this.props.perOverviewForm.data.results[0].type_of_last_capacity_assessment === null ? '' : assessmentTypes[this.props.perOverviewForm.data.results[0].type_of_last_capacity_assessment]} /><br /><br />

                Focus:<br />
                <input type='text' disabled='disabled' value={this.props.perOverviewForm.data.results[0].focus === null ? '' : this.props.perOverviewForm.data.results[0].focus} /><br /><br />

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
                Date of current capacity assessment<br />
                <select name='date_of_current_assessment_year'>
                  <option value='2020'>2020</option>
                  <option value='2019'>2019</option>
                  <option value='2018'>2018</option>
                </select>&nbsp;-&nbsp;
                <select name='date_of_current_assessment_month'>
                  <option value='01'>01</option>
                  <option value='02'>02</option>
                  <option value='03'>03</option>
                  <option value='04'>04</option>
                  <option value='05'>05</option>
                  <option value='06'>06</option>
                  <option value='07'>07</option>
                  <option value='08'>08</option>
                  <option value='09'>09</option>
                  <option value='10'>10</option>
                  <option value='11'>11</option>
                  <option value='12'>12</option>
                </select>&nbsp;-&nbsp;
                <select name='date_of_current_assessment_day'>
                  <option value='01'>01</option>
                  <option value='02'>02</option>
                  <option value='03'>03</option>
                  <option value='04'>04</option>
                  <option value='05'>05</option>
                  <option value='06'>06</option>
                  <option value='07'>07</option>
                  <option value='08'>08</option>
                  <option value='09'>09</option>
                  <option value='10'>10</option>
                  <option value='11'>11</option>
                  <option value='12'>12</option>
                  <option value='13'>13</option>
                  <option value='14'>14</option>
                  <option value='15'>15</option>
                  <option value='16'>16</option>
                  <option value='17'>17</option>
                  <option value='18'>18</option>
                  <option value='19'>19</option>
                  <option value='20'>20</option>
                  <option value='21'>21</option>
                  <option value='22'>22</option>
                  <option value='23'>23</option>
                  <option value='24'>24</option>
                  <option value='25'>25</option>
                  <option value='26'>26</option>
                  <option value='27'>27</option>
                  <option value='28'>28</option>
                  <option value='29'>29</option>
                  <option value='30'>30</option>
                  <option value='31'>31</option>
                </select><br /><br />

                Type of capacity assessment<br />
                <select name='capacity_assessment_type'>
                  <option value='0'>Self assessment</option>
                  <option value='1'>Simulation</option>
                  <option value='2'>Operation</option>
                  <option value='3'>Post operational</option>
                </select><br /><br />

                Branch involved:<br />
                <input type='text' name='branch_involved' /><br /><br />

                Focal point name in the National Society:<br />
                <input type='text' name='focal_point_name' /><br /><br />

                Focal point email in the National Society:<br />
                <input type='text' name='focal_point_email' /><br /><br />

                Focus:<br />
                <input type='text' name='focus' /><br /><br />

                Have you had a previous capacity assessment?<br />
                <select name='prev_capacity_assessment'>
                  <option value='1'>Yes</option>
                  <option value='0'>No</option>
                </select><br /><br />

                Date of last capacity assessment<br />
                <select name='date_of_last_assessment_year'>
                  <option value='2020'>2020</option>
                  <option value='2019'>2019</option>
                  <option value='2018'>2018</option>
                </select>&nbsp;-&nbsp;
                <select name='date_of_last_assessment_month'>
                  <option value='01'>01</option>
                  <option value='02'>02</option>
                  <option value='03'>03</option>
                  <option value='04'>04</option>
                  <option value='05'>05</option>
                  <option value='06'>06</option>
                  <option value='07'>07</option>
                  <option value='08'>08</option>
                  <option value='09'>09</option>
                  <option value='10'>10</option>
                  <option value='11'>11</option>
                  <option value='12'>12</option>
                </select>&nbsp;-&nbsp;
                <select name='date_of_last_assessment_day'>
                  <option value='01'>01</option>
                  <option value='02'>02</option>
                  <option value='03'>03</option>
                  <option value='04'>04</option>
                  <option value='05'>05</option>
                  <option value='06'>06</option>
                  <option value='07'>07</option>
                  <option value='08'>08</option>
                  <option value='09'>09</option>
                  <option value='10'>10</option>
                  <option value='11'>11</option>
                  <option value='12'>12</option>
                  <option value='13'>13</option>
                  <option value='14'>14</option>
                  <option value='15'>15</option>
                  <option value='16'>16</option>
                  <option value='17'>17</option>
                  <option value='18'>18</option>
                  <option value='19'>19</option>
                  <option value='20'>20</option>
                  <option value='21'>21</option>
                  <option value='22'>22</option>
                  <option value='23'>23</option>
                  <option value='24'>24</option>
                  <option value='25'>25</option>
                  <option value='26'>26</option>
                  <option value='27'>27</option>
                  <option value='28'>28</option>
                  <option value='29'>29</option>
                  <option value='30'>30</option>
                  <option value='31'>31</option>
                </select><br /><br />

                Type of last capacity assessment:<br />
                <select name='type_of_last_assessment'>
                  <option value='0'>Self assessment</option>
                  <option value='1'>Simulation</option>
                  <option value='2'>Operation</option>
                  <option value='3'>Post operational</option>
                </select><br /><br />

                <div className='per_form_ns'>Facilitator information</div>
                Facilitated by<br />
                <input type='text' name='facilitated_by' /><br /><br />

                E-mail<br />
                <input type='text' name='facilitator_email' /><br /><br />

                Phone number<br />
                <input type='text' name='facilitator_phone' /><br /><br />

                Skype address<br />
                <input type='text' name='facilitator_skype' /><br /><br />

                Date of mid-term review (approximate date)<br />
                <select name='date_of_mid_review_year'>
                  <option value='2020'>2020</option>
                  <option value='2019'>2019</option>
                  <option value='2018'>2018</option>
                </select>&nbsp;-&nbsp;
                <select name='date_of_mid_review_month'>
                  <option value='01'>01</option>
                  <option value='02'>02</option>
                  <option value='03'>03</option>
                  <option value='04'>04</option>
                  <option value='05'>05</option>
                  <option value='06'>06</option>
                  <option value='07'>07</option>
                  <option value='08'>08</option>
                  <option value='09'>09</option>
                  <option value='10'>10</option>
                  <option value='11'>11</option>
                  <option value='12'>12</option>
                </select>&nbsp;-&nbsp;
                <select name='date_of_mid_review_day'>
                  <option value='01'>01</option>
                  <option value='02'>02</option>
                  <option value='03'>03</option>
                  <option value='04'>04</option>
                  <option value='05'>05</option>
                  <option value='06'>06</option>
                  <option value='07'>07</option>
                  <option value='08'>08</option>
                  <option value='09'>09</option>
                  <option value='10'>10</option>
                  <option value='11'>11</option>
                  <option value='12'>12</option>
                  <option value='13'>13</option>
                  <option value='14'>14</option>
                  <option value='15'>15</option>
                  <option value='16'>16</option>
                  <option value='17'>17</option>
                  <option value='18'>18</option>
                  <option value='19'>19</option>
                  <option value='20'>20</option>
                  <option value='21'>21</option>
                  <option value='22'>22</option>
                  <option value='23'>23</option>
                  <option value='24'>24</option>
                  <option value='25'>25</option>
                  <option value='26'>26</option>
                  <option value='27'>27</option>
                  <option value='28'>28</option>
                  <option value='29'>29</option>
                  <option value='30'>30</option>
                  <option value='31'>31</option>
                </select><br /><br />

                Approximate date of next capacity assessment<br />
                <select name='date_of_next_assessment_year'>
                  <option value='2020'>2020</option>
                  <option value='2019'>2019</option>
                  <option value='2018'>2018</option>
                </select>&nbsp;-&nbsp;
                <select name='date_of_next_assessment_month'>
                  <option value='01'>01</option>
                  <option value='02'>02</option>
                  <option value='03'>03</option>
                  <option value='04'>04</option>
                  <option value='05'>05</option>
                  <option value='06'>06</option>
                  <option value='07'>07</option>
                  <option value='08'>08</option>
                  <option value='09'>09</option>
                  <option value='10'>10</option>
                  <option value='11'>11</option>
                  <option value='12'>12</option>
                </select>&nbsp;-&nbsp;
                <select name='date_of_next_assessment_day'>
                  <option value='01'>01</option>
                  <option value='02'>02</option>
                  <option value='03'>03</option>
                  <option value='04'>04</option>
                  <option value='05'>05</option>
                  <option value='06'>06</option>
                  <option value='07'>07</option>
                  <option value='08'>08</option>
                  <option value='09'>09</option>
                  <option value='10'>10</option>
                  <option value='11'>11</option>
                  <option value='12'>12</option>
                  <option value='13'>13</option>
                  <option value='14'>14</option>
                  <option value='15'>15</option>
                  <option value='16'>16</option>
                  <option value='17'>17</option>
                  <option value='18'>18</option>
                  <option value='19'>19</option>
                  <option value='20'>20</option>
                  <option value='21'>21</option>
                  <option value='22'>22</option>
                  <option value='23'>23</option>
                  <option value='24'>24</option>
                  <option value='25'>25</option>
                  <option value='26'>26</option>
                  <option value='27'>27</option>
                  <option value='28'>28</option>
                  <option value='29'>29</option>
                  <option value='30'>30</option>
                  <option value='31'>31</option>
                </select><br /><br />

                <button className='button button--medium button--primary-filled' onClick={this.submitForm}>Submit form</button>&nbsp;
                <button className='button button--medium button--secondary-filled' onClick={this.saveDraft}>Save as draft</button>
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
    _sendPerOverview: T.func,
    _getPerDraftDocument: T.func,
    sendPerFormResponse: T.object,
    view: T.bool,
    formId: T.string,
    perOverviewForm: T.object,
    sendPerWorkPlan: T.func,
    nationalSociety: T.string,
    user: T.object,
    getPerDraftDocument: T.object,
    _sendPerDraft: T.func
  };
}

const selector = (state) => ({
  sendPerForm: state.perForm.sendPerForm,
  perDocument: state.perForm.getPerDocument,
  sendPerDraft: state.perForm.sendPerDraft,
  getPerDraftDocument: state.perForm.getPerDraftDocument,
  perOverviewForm: state.perForm.getPerOverviewForm,
  sendPerWorkPlan: state.perForm.sendPerWorkPlan,
  user: state.user
});

const dispatcher = (dispatch) => ({
  _sendPerForm: (payload) => dispatch(sendPerForm(payload)),
  _getPerDocument: (...args) => dispatch(getPerDocument(...args)),
  _getPerDraftDocument: (...args) => dispatch(getPerDraftDocument(...args)),
  _sendPerDraft: (payload) => dispatch(sendPerDraft(payload)),
  _editPerDocument: (payload) => dispatch(editPerDocument(payload)),
  _getPerOverviewForm: (...args) => dispatch(getPerOverviewForm(...args)),
  _sendPerOverview: (...args) => dispatch(sendPerOverview(...args))
});

export default connect(selector, dispatcher)(OverviewForm);

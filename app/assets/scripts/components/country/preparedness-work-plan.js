'use strict';

import React from 'react';
import c from 'classnames';
import { connect } from 'react-redux';
import { environment } from '../../config';
import { PropTypes as T } from 'prop-types';
import Fold from './../fold';
import { getAllComponents, getBenchmarksByComponent } from './../../utils/get-per-components';
import { withRouter } from 'react-router-dom';
import { sendPerWorkplan, deletePerWorkplanApi } from './../../actions';

const PRIORITIZATION = ['Low', 'Mid', 'High'];
const STATUS = [
  'Standby',
  'Ongoing',
  'Cancelled',
  'Delayed',
  'Pending',
  'Need impr.',
  'Finished',
  'Approved',
  'Closed'
];

class PreparednessWorkPlan extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      chosenForm: 'a1',
      chosenComponent: 'c0',
      showAddModul: false
    };
    this.showAddModul = this.showAddModul.bind(this);
    this.addNewPlan = this.addNewPlan.bind(this);
    this.deleteWorkPlan = this.deleteWorkPlan.bind(this);
    this.onComponentChange = this.onComponentChange.bind(this);
    this.lastPayload = {};
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.sendPerWorkplan.receivedAt !== nextProps.sendPerWorkplan.receivedAt) {
      if (typeof nextProps.sendPerWorkplan.data.status !== 'undefined' && nextProps.sendPerWorkplan.data.status !== null) {
        this.props._addNewWorkPlan({type: 'ADD_NES_PER_WORK_PLAN', workplan: this.lastPayload});
      }
    }
    if (this.props.deletePerWorkplanApi.receivedAt !== nextProps.deletePerWorkplanApi.receivedAt) {
      if (typeof nextProps.deletePerWorkplanApi.data.status !== 'undefined' && nextProps.deletePerWorkplanApi.data.status !== null) {
        this.props._deletePerWorkPlanState({type: 'DELETE_PER_WORK_PLAN_STATE', wid: this.lastPayload.id});
      }
    }
  }

  showAddModul () {
    this.setState({showAddModul: true});
  }

  addNewPlan () {
    const prioritization = document.getElementsByName('prioritization')[0];
    const component = document.getElementsByName('components')[0];
    const benchmark = document.getElementsByName('benchmark')[0];
    const actions = document.getElementsByName('actions')[0];
    const comments = document.getElementsByName('comments')[0];
    const timeline = document.getElementsByName('timeline_year')[0].value + '-' + document.getElementsByName('timeline_month')[0].value + '-' + document.getElementsByName('timeline_day')[0].value + ' 00:00:00.00+00';
    const focal = document.getElementsByName('focal')[0];
    const status = document.getElementsByName('status')[0];
    const required = document.getElementsByName('required')[0];
    const payload = {
      prioritization: prioritization.value,
      components: component.selectedOptions[0].innerHTML,
      benchmark: benchmark.selectedOptions[0].innerHTML,
      actions: actions.value,
      comments: comments.value,
      timeline: timeline,
      focal_point: focal.value,
      status: status.value,
      support_required: required.checked,
      country_id: this.props.match.params.id,
      code: component.value.substring(0, 2),
      question_id: component.value.substring(2, component.value.length) + benchmark.value,
      user_id: this.props.user.id
    };
    this.lastPayload = payload;
    this.props._sendPerWorkplan(payload);
    this.setState({showAddModul: false});
  }

  deleteWorkPlan (event) {
    const payload = {id: parseInt(event.target.id.substring(8, event.target.id.length))};
    this.lastPayload = payload;
    this.props._deletePerWorkplanApi(payload);
  }

  onComponentChange (event) {
    const id = event.target.options[event.target.selectedIndex].value;
    const splittedId = id.split('c');
    this.setState({
      chosenForm: splittedId[0],
      chosenComponent: 'c' + splittedId[1]
    });
  }

  render () {
    if (!this.props.user.username) return null;
    const workPlans = [];
    const prioritizationDropdown = [];
    const components = [];
    const statusDropdown = [];
    const benchmarks = [];
    const tableRowStyle = {width: '100%', float: 'left'};
    const tableCellStyle = {width: '10%', float: 'left', padding: '5px', overflowWrap: 'break-word'};
    const tableTitleCellStyle = {width: '10%', float: 'left', fontWeight: 'bold', padding: '5px'};
    const tableTitleDoubleCellStyle = {width: '20%', float: 'left', fontWeight: 'bold', padding: '5px'};
    const lightBackground = {backgroundColor: '#fff'};
    const darkBackground = {backgroundColor: '#fff'};
    const textToCenter = {textAlign: 'center'};
    const inputWidthFitDiv = {width: '100%'};
    this.props.getPerWorkPlan.data.results.forEach((workPlan, index) => {
      const timeline = new Date(workPlan.timeline);
      workPlans.push((
        <div key={'workplanList' + index} style={Object.assign({}, tableRowStyle, index % 2 === 0 ? lightBackground : darkBackground, inputWidthFitDiv)}>
          <div style={tableCellStyle}>
            {PRIORITIZATION[workPlan.prioritization]}
          </div>
          <div style={tableCellStyle}>
            {workPlan.components}
          </div>
          <div style={tableCellStyle}>
            {workPlan.benchmark}
          </div>
          <div style={tableCellStyle}>
            {workPlan.actions}
          </div>
          <div style={tableCellStyle}>
            {workPlan.comments}
          </div>
          <div style={tableCellStyle}>
            {timeline.getMonth() + 1}/{timeline.getDate()}/{timeline.getFullYear()}
          </div>
          <div style={tableCellStyle}>
            {workPlan.focal_point}
          </div>
          <div style={tableCellStyle}>
            {STATUS[workPlan.status]}
          </div>
          <div style={Object.assign({}, tableCellStyle, textToCenter)}>

            <label className={c(`form__option--custom-checkbox`, {'form__option--inline': 'inline'})}>
              <input type='checkbox' name='test' value={true} checked={workPlan.support_required} />
              <span className='form__option__ui'></span>
            </label>

          </div>
          <div style={Object.assign({}, tableCellStyle, textToCenter)}>
            {
              typeof workPlan.id !== 'undefined'
                ? (<button className='button button--small button--primary-bounded' id={'workplan' + workPlan.id} onClick={this.deleteWorkPlan}>Delete</button>)
                : null
            }
          </div>
        </div>
      ));
    });
    PRIORITIZATION.forEach((prioritization, index) => {
      prioritizationDropdown.push(<option key={'prioritizationOption' + index} value={index}>{prioritization}</option>);
    });
    STATUS.forEach((status, index) => {
      statusDropdown.push(<option key={'statusOption' + index} value={index}>{status}</option>);
    });
    getAllComponents().forEach((component, index) => {
      components.push((<option key={'componentsList' + index} value={component.formCode + component.id}>{component.name}</option>));
    });
    getBenchmarksByComponent(this.state.chosenForm + this.state.chosenComponent).forEach((component, index) => {
      benchmarks.push((<option key={'benchmarkList' + index} value={'q' + component.index}>{component.title.length > 135 ? component.title.substring(0, 135) + '...' : component.title}</option>));
    });
    return (
      <Fold id='per-work-plan' title='Preparedness work plan' wrapper_class='preparedness' foldClass='margin-reset'>
        <div style={{borderBottom: '1px solid #000', paddingBottom: '20px', float: 'left', width: '100%'}}>
          {!this.state.showAddModul ? <button className='button button--small button--primary-bounded' onClick={this.showAddModul}>Add</button> : null}

          {this.state.showAddModul
            ? (
              <div style={{paddingTop: '20px'}}>
                <div style={Object.assign({}, lightBackground)}>
                  <div>
                    <span style={{fontWeight: 'bold'}}>Prioritization:&nbsp;</span>
                    <select name='prioritization'>
                      {prioritizationDropdown}
                    </select>
                  </div>
                  <div>
                    <span style={{fontWeight: 'bold'}}>Component:&nbsp;</span>
                    <select name='components' onChange={this.onComponentChange}>
                      {components}
                    </select>
                  </div>
                  <div>
                    <span style={{fontWeight: 'bold'}}>Benchmark:&nbsp;</span>
                    <select name='benchmark'>
                      {benchmarks}
                    </select>
                  </div>
                  <div>
                    <span style={{fontWeight: 'bold'}}>Actions:&nbsp;</span>
                    <input type='text' name='actions' />
                  </div>
                  <div>
                    <span style={{fontWeight: 'bold'}}>Comments:&nbsp;</span>
                    <input type='text' name='comments' />
                  </div>
                  <div>
                    <span style={{fontWeight: 'bold'}}>Timeline:&nbsp;</span>
                    <select name='timeline_year'>
                      <option value='2020'>2020</option>
                      <option value='2019'>2019</option>
                      <option value='2018'>2018</option>
                    </select>&nbsp;-&nbsp;
                    <select name='timeline_month'>
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
                    <select name='timeline_day'>
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
                    </select>
                  </div>
                  <div>
                    <span style={{fontWeight: 'bold'}}>Focal Point:&nbsp;</span>
                    <input type='text' name='focal' />
                  </div>
                  <div>
                    <span style={{fontWeight: 'bold'}}>Status:&nbsp;</span>
                    <select name='status'>
                      {statusDropdown}
                    </select>
                  </div>
                  <div>

                    <span style={{fontWeight: 'bold'}}>Required:&nbsp;</span>
                    <label className={c(`form__option--custom-checkbox`, {'form__option--inline': 'inline'})}>
                      <input type='checkbox' name='required' value={'true'} />
                      <span className='form__option__ui'></span>
                    </label>

                  </div>
                  <div>
                    <button className='button button--small button--primary-bounded' onClick={this.addNewPlan}>Add</button>
                  </div>
                </div>
              </div>
            ) : null}

          <div className='global-margin-2-t'>
            <div style={tableTitleCellStyle}>
              Prioritization
            </div>
            <div style={tableTitleCellStyle}>
              Component
            </div>
            <div style={tableTitleCellStyle}>
              Benchmark
            </div>
            <div style={tableTitleCellStyle}>
              Actions
            </div>
            <div style={tableTitleCellStyle}>
              Comments
            </div>
            <div style={tableTitleCellStyle}>
              Timeline
            </div>
            <div style={tableTitleCellStyle}>
              Focal Point
            </div>
            <div style={tableTitleCellStyle}>
              Status
            </div>
            <div style={tableTitleDoubleCellStyle}>
              Support required
            </div>

            {workPlans}

          </div>
        </div>
      </Fold>
    );
  }
}

if (environment !== 'production') {
  PreparednessWorkPlan.propTypes = {
    _getPerNsPhase: T.func,
    _sendPerWorkplan: T.func,
    _deletePerWorkplanApi: T.func,
    _addNewWorkPlan: T.func,
    _deletePerWorkPlanState: T.func,
    sendPerWorkplan: T.object,
    deletePerWorkplanApi: T.object,
    match: T.object,
    getPerWorkPlan: T.object,
    user: T.object
  };
}

const selector = (state) => ({
  getPerNsPhase: state.perForm.getPerNsPhase,
  sendPerWorkplan: state.perForm.sendPerWorkplan,
  deletePerWorkplanApi: state.perForm.deletePerWorkplanApi,
  user: state.user.data
});

const dispatcher = (dispatch) => ({
  _deletePerWorkplanApi: (...args) => dispatch(deletePerWorkplanApi(...args)),
  _sendPerWorkplan: (...args) => dispatch(sendPerWorkplan(...args)),
  _addNewWorkPlan: (actionObject) => dispatch(actionObject),
  _deletePerWorkPlanState: (...args) => dispatch(...args)
});

export default withRouter(connect(selector, dispatcher)(PreparednessWorkPlan));

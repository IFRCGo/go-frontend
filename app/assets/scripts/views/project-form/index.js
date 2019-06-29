'use strict';
import React from 'react';
import { connect } from 'react-redux';
import _get from 'lodash.get';
import { PropTypes as T } from 'prop-types';
import { createProject, updateProject, getProjectById } from '../../actions';
import { showGlobalLoading, hideGlobalLoading } from '../../components/global-loading';
import { environment } from '../../config';
import {
  getInitialDataState
} from './data-utils';

import {
  FormInput,
  FormTextarea,
  FormRadioGroup,
  FormSelect,
  FormError
} from '../../components/form-elements/';
import App from '../app';


class ProjectForm extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      data: getInitialDataState(),
      errors: null
    };
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.projectForm.fetching && !nextProps.projectForm.fetching) {
      hideGlobalLoading();
      // TODO: process error and success from the API
    }
    if (this.props.project.fetching && !nextProps.report.fetching) {
      hideGlobalLoading();
      if (nextProps.project.error) {
        // TODO: render Uh-Oh screen or so if there is an error fetching project
        console.log('ERROR fetching project');
      }
    }
  }

  componentDidMount () {
    if (this.props.match.params.id) {
      // Editing the field report.
      this.getProject(this.props.match.params.id);
    }
  }

  getProject (id) {
    showGlobalLoading();
    this.props._getProjectById(id);
  }

  validate () {
    // FIXME: add validations
  }

  onSubmit (e) {

  }

  onFieldChange (field, e) {

  }

  render () {
    return (
      <App className='page--frep-form'>
        <section className='inpage'>
          <header className='inpage__header'>
            <div className='inner'>
              <div className='inpage__headline'>
                <h1 className='inpage__title'>Create Project</h1>
              </div>
            </div>
          </header>
          <div className='inpage__body'>
            <div className='inner'>
              <form className='form form--field-report' onSubmit={this.onSubmit}>


                <div className='form__actions'>
                  <button type='submit' className='button button--secondary-filled' title='Save'>Save</button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </App>
    );
  }
}

if (environment !== 'production') {
  ProjectForm.propTypes = {
    _createProject: T.func,
    _updateProject: T.func,
    _getProjectById: T.func,
    projectForm: T.object,
    user: T.object,
    report: T.object,
    match: T.object,
    history: T.object
  };
}

// /////////////////////////////////////////////////////////////////// //
// Connect functions

const selector = (state, ownProps) => ({
  projectForm: state.projectForm,
  user: state.user,
  report: _get(state.project, ownProps.match.params.id, {
    data: {},
    fetching: false,
    fetched: false
  })
});

const dispatcher = (dispatch) => ({
  _createProject: (...args) => dispatch(createProject(...args)),
  _updateProject: (...args) => dispatch(updateProject(...args)),
  _getProjectById: (...args) => dispatch(getProjectById(...args))
});

export default connect(selector, dispatcher)(ProjectForm);

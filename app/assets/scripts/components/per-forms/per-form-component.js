import React from 'react';
import { Link } from 'react-router-dom';
import c from 'classnames';
import { environment } from '../../config';
import { PropTypes as T } from 'prop-types';
import RequestFactory from './factory/request-factory';

const requestFactory = new RequestFactory();

const renderLanguageSelectDropdown = (props) => {
  return (<div>
    <span style={{fontWeight: 'bold'}}>Form language:</span>&nbsp;
    <select onChange={props.chooseLanguage}>
      <option value='english'>English</option>
      <option value='spanish'>Spanish</option>
      <option value='french'>French</option>
    </select><br /><br />
  </div>);
};

if (environment !== 'production') {
  renderLanguageSelectDropdown.propTypes = {
    chooseLanguage: T.func,
    state: T.object,
    changeEpiComponentState: T.func,
    sendForm: T.func,
    view: T.bool,
    _getProfile: T.func,
    _updateSubscriptions: T.func,
    _getFieldReportsByUser: T.func,
    _updateProfile: T.func
  };
}

const renderFormTitle = (props) => {
  return (
    <div className="fold__header">
      <h2 className="fold__title">{props.state.title}</h2>
    </div>
  );
};

if (environment !== 'production') {
  renderFormTitle.propTypes = {
    chooseLanguage: T.func,
    state: T.object,
    changeEpiComponentState: T.func,
    sendForm: T.func,
    view: T.bool,
    _getProfile: T.func,
    _updateSubscriptions: T.func,
    _getFieldReportsByUser: T.func,
    _updateProfile: T.func
  };
}

const renderEpidemicsRadioButton = (props) => {
  return (
    <React.Fragment>
      <div className='per_form_area'>{props.state.areaTitle}</div>
      <div className='per_form_question'>{props.state.areaQuestion}</div>
      <label className={c(`form__option form__option--custom-radio`, {'form__option--inline': 'inline'})}>
        <input type='radio' name='a1' disabled={props.view} value={requestFactory.stringAnswerToNum(props.state.areaOptions[0])} onClick={props.changeEpiComponentState} />
        <span className='form__option__ui'></span>
        <span className='form__option__text'>{props.state.areaOptions[0]}</span>
      </label>
      <label className={c(`form__option form__option--custom-radio`, {'form__option--inline': 'inline'})}>
        <input type='radio' name='a1' disabled={props.view} value={requestFactory.stringAnswerToNum(props.state.areaOptions[1])} onClick={props.changeEpiComponentState} />
        <span className='form__option__ui'></span>
        <span className='form__option__text'>{props.state.areaOptions[1]}</span>
      </label>
    </React.Fragment>
  );
};

if (environment !== 'production') {
  renderEpidemicsRadioButton.propTypes = {
    chooseLanguage: T.func,
    state: T.object,
    changeEpiComponentState: T.func,
    sendForm: T.func,
    view: T.bool,
    _getProfile: T.func,
    _updateSubscriptions: T.func,
    _getFieldReportsByUser: T.func,
    _updateProfile: T.func
  };
}

const renderComponents = (props) => {
  const components = [];
  let componentIndex = 0;

  props.state.components.forEach(component => {
    components.push(<React.Fragment key={newFormElementKey()}>
      <div className='per_form_area' id={'c' + componentIndex + 'title'}>{component.componentTitle}</div>
      {component.componentDescription}<br /><br />

      {renderQuestions(component, componentIndex, props)}
      {renderEpiComponent(component, props, componentIndex)}
    </React.Fragment>);
    componentIndex++;
  });

  return components;
};

if (environment !== 'production') {
  renderComponents.propTypes = {
    chooseLanguage: T.func,
    state: T.object,
    changeEpiComponentState: T.func,
    sendForm: T.func,
    view: T.bool,
    _getProfile: T.func,
    _updateSubscriptions: T.func,
    _getFieldReportsByUser: T.func,
    _updateProfile: T.func
  };
}

const renderQuestions = (component, componentIndex, props) => {
  const questions = [];
  let questionIndex = 0;

  if (typeof component.namespaces !== 'undefined' && component.namespaces !== null) {
    component.namespaces.forEach(namespace => {
      questions.push(<div key={'container' + componentIndex + 'q' + questionIndex} id={'container' + componentIndex + 'q' + questionIndex}>
        <div className='per_form_ns'>{namespace.nsTitle}</div>
        <div className='per_form_question'>{namespace.nsQuestion}</div>

        {renderAnswers(namespace, componentIndex, questionIndex, props)}
        {renderFeedbackBox(namespace, componentIndex, questionIndex, props)}

      </div>);
      questionIndex++;
    });
  }

  return questions;
};

if (environment !== 'production') {
  renderQuestions.propTypes = {
    chooseLanguage: T.func,
    state: T.object,
    changeEpiComponentState: T.func,
    sendForm: T.func,
    view: T.bool,
    _getProfile: T.func,
    _updateSubscriptions: T.func,
    _getFieldReportsByUser: T.func,
    _updateProfile: T.func
  };
}

const renderAnswers = (namespace, componentIndex, questionIndex, props) => {
  const answers = [];
  namespace.nsAnswers.forEach(answer => {
    answers.push(<React.Fragment key={newFormElementKey()}>
      <label className={c(`form__option form__option--custom-radio`, {'form__option--inline': 'inline'})}>
        <input type='radio' disabled={props.view} name={'c' + componentIndex + 'q' + questionIndex} value={requestFactory.stringAnswerToNum(answer)} />
        <span className='form__option__ui'></span>
        <span className='form__option__text'>{answer}</span>
      </label>
    </React.Fragment>);
  });
  return answers;
};

if (environment !== 'production') {
  renderAnswers.propTypes = {
    chooseLanguage: T.func,
    state: T.object,
    changeEpiComponentState: T.func,
    sendForm: T.func,
    view: T.bool,
    _getProfile: T.func,
    _updateSubscriptions: T.func,
    _getFieldReportsByUser: T.func,
    _updateProfile: T.func
  };
}

const renderFeedbackBox = (namespace, componentIndex, questionIndex, props) => {
  return (
    <React.Fragment>
      <div className='per_form_question'>{namespace.feedbackTitle}</div>
      {typeof namespace.feedbackDescription !== 'undefined' && namespace.feedbackDescription !== null && namespace.feedbackDescription.trim() !== '' ? (<React.Fragment>{namespace.feedbackDescription}<br /></React.Fragment>) : null}
      <input type='text' disabled={props.view} name={'c' + componentIndex + 'q' + questionIndex + 'f'} className='form__control form__control--medium' /><br /><br />
    </React.Fragment>
  );
};

if (environment !== 'production') {
  renderFeedbackBox.propTypes = {
    chooseLanguage: T.func,
    state: T.object,
    changeEpiComponentState: T.func,
    sendForm: T.func,
    view: T.bool,
    _getProfile: T.func,
    _updateSubscriptions: T.func,
    _getFieldReportsByUser: T.func,
    _updateProfile: T.func
  };
}

const renderEpiComponent = (component, props, componentIndex) => {
  if (props.state.epiComponent === 'yes' && typeof component.namespaces !== 'undefined' && component.namespaces !== null) {
    return (<div key={'container' + componentIndex + 'epi'} id={'container' + componentIndex + 'epi'}>
      <div className='per_form_ns'>Epidemic preparedness</div>
      <div>
        Please take into consideration the following aspects:<br />
        - The national public health emergency response strategy/plan outlines NS role in epidemics prevention, detection and response.<br />
        - NS Mandate in epidemics is understood by staff.<br />
        - The National Epidemic Strategy/Plan adheres to International Health Regulations.<br /><br />
      </div>
      <label className={c(`form__option form__option--custom-radio`, {'form__option--inline': 'inline'})}>
        <input type='radio' disabled={props.view} name={'c' + componentIndex + 'epi'} value='2' />
        <span className='form__option__ui'></span>
        <span className='form__option__text'>Not Reviewed</span>
      </label>
      <label className={c(`form__option form__option--custom-radio`, {'form__option--inline': 'inline'})}>
        <input type='radio' disabled={props.view} name={'c' + componentIndex + 'epi'} value='3' />
        <span className='form__option__ui'></span>
        <span className='form__option__text'>Does not exist</span>
      </label>
      <label className={c(`form__option form__option--custom-radio`, {'form__option--inline': 'inline'})}>
        <input type='radio' disabled={props.view} name={'c' + componentIndex + 'epi'} value='4' />
        <span className='form__option__ui'></span>
        <span className='form__option__text'>Partially exists</span>
      </label>
      <label className={c(`form__option form__option--custom-radio`, {'form__option--inline': 'inline'})}>
        <input type='radio' disabled={props.view} name={'c' + componentIndex + 'epi'} value='5' />
        <span className='form__option__ui'></span>
        <span className='form__option__text'>Need improvements</span>
      </label>
      <label className={c(`form__option form__option--custom-radio`, {'form__option--inline': 'inline'})}>
        <input type='radio' disabled={props.view} name={'c' + componentIndex + 'epi'} value='6' />
        <span className='form__option__ui'></span>
        <span className='form__option__text'>Exists, could be strengthened</span>
      </label>
      <label className={c(`form__option form__option--custom-radio`, {'form__option--inline': 'inline'})}>
        <input type='radio' disabled={props.view} name={'c' + componentIndex + 'epi'} value='7' />
        <span className='form__option__ui'></span>
        <span className='form__option__text'>High performance</span>
      </label><br /><br />
    </div>);
  }
};

if (environment !== 'production') {
  renderEpiComponent.propTypes = {
    chooseLanguage: T.func,
    state: T.object,
    changeEpiComponentState: T.func,
    sendForm: T.func,
    view: T.bool,
    _getProfile: T.func,
    _updateSubscriptions: T.func,
    _getFieldReportsByUser: T.func,
    _updateProfile: T.func
  };
}

const newFormElementKey = () => 'form' + Math.floor(Math.random() * 99999) + Date.now();

export const PerFormComponent = (props) => {
  let button = null;
  if (props.mode === 'new') {
    button = (<React.Fragment>
      <button className='button button--medium button--primary-filled' onClick={props.sendForm}>Submit form</button>&nbsp;
      <button className='button button--medium button--secondary-filled' onClick={props.saveDraft}>Save as draft</button>
    </React.Fragment>);
  } else if (props.mode === 'edit') {
    button = (<React.Fragment>
      <button className='button button--medium button--primary-filled' onClick={props.editDraft}>Save draft</button>
    </React.Fragment>);
  }
  return (
    <React.Fragment>
      <Link to='/account#per-forms' className='button button--medium button--primary-filled' style={{float: 'right', marginBottom: '1rem'}}>Exit form</Link>
      <div className='fold'>
        <div className='inner'>
          {renderLanguageSelectDropdown(props)}
          {renderFormTitle(props)}
          {renderEpidemicsRadioButton(props)}
          {renderComponents(props)}

          {button}
        </div>
      </div>
    </React.Fragment>
  );
};

if (environment !== 'production') {
  PerFormComponent.propTypes = {
    chooseLanguage: T.func,
    state: T.object,
    changeEpiComponentState: T.func,
    sendForm: T.func,
    editDraft: T.func,
    view: T.bool,
    mode: T.string,
    saveDraft: T.func,
    _getProfile: T.func,
    _updateSubscriptions: T.func,
    _getFieldReportsByUser: T.func,
    _updateProfile: T.func
  };
}

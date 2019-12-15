import React from 'react';
import { Link } from 'react-router-dom';
import c from 'classnames';
import { environment } from '../../config';
import { PropTypes as T } from 'prop-types';
import RequestFactory from './factory/request-factory';
import EpiSelector from '../per/forms/epi-selector';

const requestFactory = new RequestFactory();

const renderLanguageSelectDropdown = (props) => {
  /*
  The language selection code is commented out as per
  https://github.com/IFRCGo/go-frontend/issues/808

  Intentionally leaving this commented out because we will want to
  bring this functionality back.

  return (<div>
    <span style={{fontWeight: 'bold'}}>Form language:</span>&nbsp;

    <select onChange={props.chooseLanguage}>
      <option value='english'>English</option>
      <option value='spanish'>Spanish</option>
      <option value='french'>French</option>
    </select><br /><br />
  </div>);
  */

  // Render null for now, see above.
  return null;
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
    <React.Fragment>
      <div className="fold__header">
        <h2 className="fold__title">{props.state.title}</h2>
      </div>
      <div style={{clear: 'both'}}></div>
    </React.Fragment>
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
      questions.push(<div key={'container' + componentIndex + 'q' + questionIndex} id={'container' + componentIndex + 'q' + questionIndex} className='form__group'>
        <div className='per_form_ns'>{namespace.nsTitle}</div>
        <br />
        <div className='label-secondary'>{namespace.nsQuestion}</div>

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
      <br /><br />
      <div className='label-secondary'>{namespace.feedbackTitle}</div>
      {typeof namespace.feedbackDescription !== 'undefined' && namespace.feedbackDescription !== null && namespace.feedbackDescription.trim() !== '' ? (<React.Fragment>{namespace.feedbackDescription}<br /></React.Fragment>) : null}
      <br />
      <input type='text' disabled={props.view} name={'c' + componentIndex + 'q' + questionIndex + 'f'} className='form__control form__control--medium' />
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
  const {nsAnswers, nsConsiderationHeader, nsConsiderationList, nsTitle} = component.epiComponent;
  if (props.state.epiComponent === 'yes' && typeof component.namespaces !== 'undefined' && component.namespaces !== null) {
    return (
      <div key={'container' + componentIndex + 'epi'} id={'container' + componentIndex + +'epi'} className='form__group'>
        <div className='per_form_ns'>{nsTitle}</div>
        <br />
        <div className='label-secondary'>{nsConsiderationHeader}</div>
        <ul>
          {nsConsiderationList.map(consideration => (
            <li key={consideration} >{consideration}</li>
          ))}
        </ul>
        {nsAnswers.map(answer =>
          <label key={newFormElementKey()} className={c(`form__option form__option--custom-radio`, {'form__option--inline': 'inline'})}>
            <input type='radio' disabled={props.view} name={'c' + componentIndex + 'epi'} value={requestFactory.stringAnswerToNum(answer)} />
            <span className='form__option__ui'></span>
            <span className='form__option__text'>{answer}</span>
          </label>
        )}
      </div>);
  }
};

const newFormElementKey = () => 'form' + Math.floor(Math.random() * 99999) + Date.now();
// const dropAutosaveAndReload = (event) => {
//   localStorage.removeItem(event.target.id);
//   window.location.reload();
// };

export const PerFormComponent = (props) => {
  let button = null;
  if (props.mode === 'new') {
    button = (<React.Fragment>
      <div className='text-center'>
        <button className='button button--medium button--primary-filled' onClick={props.sendForm}>Submit form</button>&nbsp;
        <button className='button button--medium button--secondary-filled' onClick={props.saveDraft}>Save as draft</button>
      </div>
    </React.Fragment>);
  } else if (props.mode === 'edit') {
    button = (<React.Fragment>
      <div className='text-center'>
        <button className='button button--medium button--primary-filled' onClick={props.sendForm}>Submit form</button>&nbsp;
        <button className='button button--medium button--secondary-filled' onClick={props.editDraft}>Save draft</button>
      </div>
    </React.Fragment>);
  }
  return (
    <React.Fragment>
      <Link to='/account#per-forms' className='button button--medium button--primary-filled' style={{float: 'right', marginBottom: '1rem'}}>Exit form</Link>
      {/* Commenting out Drop Autosave button because we want to hide it for now, we may move it to somewhere more hidden. */}
      {/* {props.view ? null : <button className='button button--medium button--secondary-filled' id={'autosave' + props.mode + props.formCode + props.ns} onClick={dropAutosaveAndReload} style={{float: 'right', marginBottom: '1rem', marginRight: '1rem'}}>Drop autosave &amp; reload draft</button>} */}
      <div className='fold'>
        <div className='inner'>
          {renderLanguageSelectDropdown(props)}
          {renderFormTitle(props)}
          <EpiSelector
            areaTitle={props.state.areaTitle}
            areaQuestion={props.state.areaQuestion}
            view={props.view}
            areaOptions={props.state.areaOptions}
            changeEpiComponentState={props.changeEpiComponentState}
          />
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
    _updateProfile: T.func,
    ns: T.number,
    formCode: T.string
  };
}

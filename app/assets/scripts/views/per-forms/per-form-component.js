import React from 'react';
import { environment } from '../../config';
import { PropTypes as T } from 'prop-types';
import RequestFactory from './factory/request-factory';

const requestFactory = new RequestFactory();

const renderLanguageSelectDropdown = (props) => {
  return (<select onChange={props.chooseLanguage}>
    <option value='english'>English</option>
    <option value='spanish'>Spanish</option>
    <option value='french'>French</option>
  </select>);
};

if (environment !== 'production') {
  renderLanguageSelectDropdown.propTypes = {
    chooseLanguage: T.func,
    state: T.object,
    changeEpiComponentState: T.func,
    sendForm: T.func,
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
      <input type='radio' name='a1' value={requestFactory.stringAnswerToNum(props.state.areaOptions[0])} onClick={props.changeEpiComponentState} /> {props.state.areaOptions[0]} <br />
      <input type='radio' name='a1' value={requestFactory.stringAnswerToNum(props.state.areaOptions[1])} onClick={props.changeEpiComponentState} /> {props.state.areaOptions[1]}
    </React.Fragment>
  );
};

if (environment !== 'production') {
  renderEpidemicsRadioButton.propTypes = {
    chooseLanguage: T.func,
    state: T.object,
    changeEpiComponentState: T.func,
    sendForm: T.func,
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

      {renderQuestions(component, componentIndex)}
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
    _getProfile: T.func,
    _updateSubscriptions: T.func,
    _getFieldReportsByUser: T.func,
    _updateProfile: T.func
  };
}

const renderQuestions = (component, componentIndex) => {
  const questions = [];
  let questionIndex = 0;

  if (typeof component.namespaces !== 'undefined' && component.namespaces !== null) {
    component.namespaces.forEach(namespace => {
      questions.push(<div key={'container' + componentIndex + 'q' + questionIndex} id={'container' + componentIndex + 'q' + questionIndex}>
        <div className='per_form_ns'>{namespace.nsTitle}</div>
        <div className='per_form_question'>{namespace.nsQuestion}</div>

        {renderAnswers(namespace, componentIndex, questionIndex)}
        {renderFeedbackBox(namespace, componentIndex, questionIndex)}

      </div>);
      questionIndex++;
    });
  }

  return questions;
};

const renderAnswers = (namespace, componentIndex, questionIndex) => {
  const answers = [];
  namespace.nsAnswers.forEach(answer => {
    answers.push(<React.Fragment key={newFormElementKey()}>
      <input type='radio' name={'c' + componentIndex + 'q' + questionIndex} value={requestFactory.stringAnswerToNum(answer)} /> {answer}<br />
    </React.Fragment>);
  });
  return answers;
};

const renderFeedbackBox = (namespace, componentIndex, questionIndex) => {
  return (
    <React.Fragment>
      <div className='per_form_question'>{namespace.feedbackTitle}</div>
      {typeof namespace.feedbackDescription !== 'undefined' && namespace.feedbackDescription !== null && namespace.feedbackDescription.trim() !== '' ? (<React.Fragment>{namespace.feedbackDescription}<br /></React.Fragment>) : null}
      <input type='text' name={'c' + componentIndex + 'q' + questionIndex + 'f'} /><br /><br />
    </React.Fragment>
  );
};

const renderEpiComponent = (component, props, componentIndex) => {
  if (props.state.epiComponent === 'yes' && typeof component.namespaces !== 'undefined' && component.namespaces !== null) {
    return (<div key={'container' + componentIndex + 'epi'} id={'container' + componentIndex + 'epi'}>
      <div className='per_form_ns'>Epidemic preparedess</div>
      <div>
        Please take into consideration the following aspects:<br />
        - The national public health emergency response strategy/plan outlines NS role in epidemics prevention, detection and response.<br />
        - NS Mandate in epidemics is understood by staff.<br />
        - The National Epidemic Strategy/Plan adheres to International Health Regulations.<br /><br />
      </div>
      <input type='radio' name={'c' + componentIndex + 'epi'} value='2' /> Not Reviewed<br />
      <input type='radio' name={'c' + componentIndex + 'epi'} value='3' /> Does not exist<br />
      <input type='radio' name={'c' + componentIndex + 'epi'} value='4' /> Partially exists<br />
      <input type='radio' name={'c' + componentIndex + 'epi'} value='5' /> Need improvements<br />
      <input type='radio' name={'c' + componentIndex + 'epi'} value='6' /> Exists, could be strengthened<br />
      <input type='radio' name={'c' + componentIndex + 'epi'} value='7' /> High performance<br /><br />
    </div>);
  }
};

if (environment !== 'production') {
  renderEpiComponent.propTypes = {
    chooseLanguage: T.func,
    state: T.object,
    changeEpiComponentState: T.func,
    sendForm: T.func,
    _getProfile: T.func,
    _updateSubscriptions: T.func,
    _getFieldReportsByUser: T.func,
    _updateProfile: T.func
  };
}

const newFormElementKey = () => 'form' + Math.floor(Math.random() * 99999) + Date.now();

export const PerFormComponent = (props) => {
  return (
    <div className='fold'>
      <div className='inner'>
        {renderLanguageSelectDropdown(props)}
        {renderFormTitle(props)}
        {renderEpidemicsRadioButton(props)}
        {renderComponents(props)}

        <input type='checkbox' name='draft' value='yes' /> Save as Draft<br />
        <button onClick={props.sendForm}>Submit</button>
      </div>
    </div>
  );
};

if (environment !== 'production') {
  PerFormComponent.propTypes = {
    chooseLanguage: T.func,
    state: T.object,
    changeEpiComponentState: T.func,
    sendForm: T.func,
    _getProfile: T.func,
    _updateSubscriptions: T.func,
    _getFieldReportsByUser: T.func,
    _updateProfile: T.func
  };
}

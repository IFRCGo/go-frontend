import React from 'react';
import { Link } from 'react-router-dom';
import c from 'classnames';
import { environment } from '../../config';
import { PropTypes as T } from 'prop-types';
import RequestFactory from './factory/request-factory';
import Status from '../per/forms/status';

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

const renderEpidemicsRadioButton = (props) => {
  return (
    <div className='containera1'>
      <div className='per_form_area'>{props.state.areaTitle}</div><br />
      <div className='form__group'>
        <div className='label-secondary'>{props.state.areaQuestion}</div>
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
      </div>
    </div>
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
  if (props.state.epiComponent === 'yes' && typeof component.namespaces !== 'undefined' && component.namespaces !== null) {
    if (props.formCode === 'a1' && componentIndex === 0) { // ============================================= a1
      return (
        <Status view={props.view} componentIndex={componentIndex} />
      );
    } else if (props.formCode === 'a1' && componentIndex === 1) {
      return (
        <Status view={props.view} componentIndex={componentIndex} />
      );
    } else if (props.formCode === 'a1' && componentIndex === 2) {
      return (<div key={'container' + componentIndex + 'epi'} id={'container' + componentIndex + 'epi'}>
        <div className='per_form_ns'>Epidemic preparedness</div>
        <div>
          Please take into consideration the following aspects:<br />
          - The NS DRM policy clarifies the roles and responsibilities of DM and health staff in epidemics to ensure technical leadership.<br /><br />
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
    } else if (props.formCode === 'a1' && componentIndex === 3) {
      return (<div key={'container' + componentIndex + 'epi'} id={'container' + componentIndex + 'epi'}>
        <div className='per_form_ns'>Epidemic preparedness</div>
        <div>
          Please take into consideration the following aspects:<br />
          - NS is aware of Joint External Evaluation (WHO) and contributes to national adherence to International Health Regulations.<br />
          - NS management understands International and local Health Regulations including rules on data sharing and quarantine.<br /><br />
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
    } else if (props.formCode === 'a1' && componentIndex === 4) {
      return (<div key={'container' + componentIndex + 'epi'} id={'container' + componentIndex + 'epi'}>
        <div className='per_form_ns'>Epidemic preparedness</div>
        <div>
          Please take into consideration the following aspects:<br />
          - Sex/age/disabilities dissaggregated data is used to identify vulnerabilities in populations potentially exposed to epidemics.<br />
          - NS uses protection, gender and inclusion (PGI) analysis to adapt protection policies in a highly infectious disease environment, and potential harmful health impacts of assistance are minimized.<br /><br />
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
    if (props.formCode === 'a2' && componentIndex === 0) { // ============================================= a2
      return (<div key={'container' + componentIndex + 'epi'} id={'container' + componentIndex + 'epi'}>
        <div className='per_form_ns'>Epidemic preparedness</div>
        <div>
          Please take into consideration the following aspects:<br />
          - NS Community Based Surveillance (CBS) is established with indicators and thresholds for epidemics and zoonoses.<br />
          - CBS is coordinated with MoH Epidemics detection system and Emergency Operations Centre (including for zoonoses indicators).<br />
          - NS has the capacity to collect and analyze data derived from VCAs and epidemic risk assessments on health hazards (including zoonoses) and health system access.<br />
          - NS epidemic risk analysis, risk assessment, scenario and response strategy use Sex Age Disabilities Disaggreated Data to understand gender and diversity specific needs and issues of acceptance and security during epidemics. <br />
          - The NS has updated maps of health facilities, which are shared with branches every year.<br />
          - For cross-border high risk areas, NSs coordinate risk monitoring, are familiar with each other&apos;s capacities and procedures, and have a mechanism in place to share information.<br /><br />
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
    } else if (props.formCode === 'a2' && componentIndex === 1) {
      return (<div key={'container' + componentIndex + 'epi'} id={'container' + componentIndex + 'epi'}>
        <div className='per_form_ns'>Epidemic preparedness</div>
        <div>
          Please take into consideration the following aspects:<br />
          - Scenarios and Response options take into account key practices (e.g. hygiene, open defecation, slaughtering, respiratory etiquette), access to clean water, availability of soap, oral rehydration supplements, access to health care, vaccination level and adequate nutrition, as well as migration patterns.<br />
          - NS has developed specific scenarios that are aligned with Government&apos;s scenarios for epidemics including zoonoses and risk of infectious diseases and safety of first responders.<br />
          - Alert thresholds are in alignment with the MoH, and are specific to different types of epidemic-prone diseases.<br />
          - A response strategy for epidemic outbreaks is available and  details NS&apos;s contribution to the national response plan and the MoH EOC.<br />
          - Epidemic-specific scenarios, response strategies and SOPs are agreed with bordering NSs.<br /><br />
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
    } else if (props.formCode === 'a2' && componentIndex === 2) {
      return (<div key={'container' + componentIndex + 'epi'} id={'container' + componentIndex + 'epi'}>
        <div className='per_form_ns'>Epidemic preparedness</div>
        <div>
          Please take into consideration the following aspects:<br />
          - NS ensures protection of first responders including contractors (capacities, inputs), taking into account the impact of fear, stigma and diseases-specific precautions.<br />
          - NS has identified trusted sources of communication to ensure community engagement and public health messaging.<br />
          - NS has policies and procedures to manage infected staff and volunteers.<br />
          - Systems and procedures are in place to prevent fraud and corruption and reinforce acceptance, security and access.<br /><br />
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
    } else if (props.formCode === 'a2' && componentIndex === 3) {
      return (<div key={'container' + componentIndex + 'epi'} id={'container' + componentIndex + 'epi'}>
        <div className='per_form_ns'>Epidemic preparedness</div>
        <div>
          Please take into consideration the following aspects:<br />
          - Disaster Preparedness for Epidemics is well coordinated between DM and Health teams.<br />
          - Epidemic preparedness gaps are identified based on risk analysis, response strategy and take into account the strengthening of support units.<br />
          - Financial gaps for epidemic preparedness or early actions are identified. The NS actively seeks resources and support.<br /><br />
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
    } else if (props.formCode === 'a2' && componentIndex === 4) {
      return (<div key={'container' + componentIndex + 'epi'} id={'container' + componentIndex + 'epi'}>
        <div className='per_form_ns'>Epidemic preparedness</div>
        <div>
          Please take into consideration the following aspects:<br />
          - NS Business Continuity plan includes epidemics among major risks<br />
          - Agreements with donors are in place to repurpose funds for epidemic control and management including early action<br /><br />
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
    } else if (props.formCode === 'a2' && componentIndex === 5) {
      return (<div key={'container' + componentIndex + 'epi'} id={'container' + componentIndex + 'epi'}>
        <div className='per_form_ns'>Epidemic preparedness</div>
        <div>
          Please take into consideration the following aspects:<br />
          - Roles and responsibilities for epidemic response strategy take into consideration NS support to the MoH including active participation in the MoH EOC, in addition to alternates and backups for emergency operations.<br />
          - Specific SOPs for epidemic response are available, include all response phases (early warning, early action, emergency assessment, response planning, etc.) and standardized templates.<br />
          - Branches have epidemic response SOPs agreed with local authorities and partners.<br />
          - An up to date response organigram with contact details exists, is shared and aligns with SOPs. It includes links between disaster management personnel and health personnel.<br /><br />
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
    } else if (props.formCode === 'a2' && componentIndex === 6) {
      return (<div key={'container' + componentIndex + 'epi'} id={'container' + componentIndex + 'epi'}>
        <div className='per_form_ns'>Epidemic preparedness</div>
        <div>
          Please take into consideration the following aspects:<br />
          - Community response plans for epidemics are available.<br />
          - The NS adapts its epidemic response plan to changing contexts and emerging needs.<br />
          - NS has a policy for donation of medical items.<br /><br />
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
    } else if (props.formCode === 'a2' && componentIndex === 7) {
      return (<div key={'container' + componentIndex + 'epi'} id={'container' + componentIndex + 'epi'}>
        <div className='per_form_ns'>Epidemic preparedness</div>
        <div>
          Please take into consideration the following aspects:<br />
          - Coordination and management arrangements with MOH at national, district and local levels are formalised.<br />
          - A mapping of capacities of Movement partners is available, it includes the capacity to respond to different epidemic-prone diseases.<br />
          - Agreements with contractors include insurance and protection for contactors (infection prevention and control).<br />
          - NS has agreements with public authorities for the facilitation of imports of medication such as vaccines and medical equipment and supplies including consumables and non- consumables such as PPEs and laboratory supplies.<br />
          - Agreements with key suppliers of medical consumable and nonconsumable such as PPEs and lab supplies and medication/vaccines are formalized with an agreed mechanism for activation.<br />
          - Regular community discussions on epidemics include health officials and other public sector officials in charge of the community.<br /><br />
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
    } else if (props.formCode === 'a3-2' && componentIndex === 0) { // ============================================= a3-2
      return (<div key={'container' + componentIndex + 'epi'} id={'container' + componentIndex + 'epi'}>
        <div className='per_form_ns'>Epidemic preparedness</div>
        <div>
          Please take into consideration the following aspects:<br />
          - CBS, detection and control is in place in vulnerable communities and NS has the capacity and materials to inform at-risk communities about the causes and consequences of major epidemic threats and to help them identify key practices for epidemic control.<br />
          - NS ensures assessment, planning and response include measures to avoid fear and stigma.<br />
          - CDRT are familiar with the NS epidemic response strategy and its complementarity with the national strategy, are trained and equipped to respond to epidemics and can mobilize local resources.<br /><br />
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
    } else if (props.formCode === 'a3-2' && componentIndex === 1) {
      return (<div key={'container' + componentIndex + 'epi'} id={'container' + componentIndex + 'epi'}>
        <div className='per_form_ns'>Epidemic preparedness</div>
        <div>
          Please take into consideration the following aspects:<br />
          - If quarantine communities in high-risk areas is declared,  NS has mechanisms to liaise with MoH to provide support.<br /><br />
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
    } else if (props.formCode === 'a3-2' && componentIndex === 2) {
      return (<div key={'container' + componentIndex + 'epi'} id={'container' + componentIndex + 'epi'}>
        <div className='per_form_ns'>Epidemic preparedness</div>
        <div>
          Please take into consideration the following aspects:<br />
          - NS has SoPs and pre-positioned supplies for the management of dead bodies.<br />
          - Staff and volunteers are regularly trained on the use and disposal of PPE<br /><br />
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
    } else if (props.formCode === 'a3-2' && componentIndex === 3) {
      return (<div key={'container' + componentIndex + 'epi'} id={'container' + componentIndex + 'epi'}>
        <div className='per_form_ns'>Epidemic preparedness</div>
        <div>
          Please take into consideration the following aspects:<br />
          - NS has Infection Prevention and Control policies and procedures to accompany first aid responders in an infectious disease outbreaks. E.g. no-touch policy.<br /><br />
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
    } else if (props.formCode === 'a3-2' && componentIndex === 4) {
      return (<div key={'container' + componentIndex + 'epi'} id={'container' + componentIndex + 'epi'}>
        <div className='per_form_ns'>Epidemic preparedness</div>
        <div>
          Please take into consideration the following aspects:<br />
          - NS response strategy includes water, sanitation and hygiene measures in case of epidemics, and response teams are familiar with WASH in infectious settings including environmental sanitation.<br />
          - Epidemic specific WASH support is available.<br /><br />
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
    } else if (props.formCode === 'a3-2' && componentIndex === 5) {
      return (<div key={'container' + componentIndex + 'epi'} id={'container' + componentIndex + 'epi'}>
        <div className='per_form_ns'>Epidemic preparedness</div>
        <div>
          Please take into consideration the following aspects:<br />
          - NS has early warning system for food contamination in epidemics and has SOPs for food distribution in quarantine.<br />
          - The identified technical staff for food assistance is trained to identify needs and analyse market situation in epidemics in order to make recommendations.<br /><br />
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
    } else if (props.formCode === 'a3-2' && componentIndex === 6) {
      return (<div key={'container' + componentIndex + 'epi'} id={'container' + componentIndex + 'epi'}>
        <div className='per_form_ns'>Epidemic preparedness</div>
        <div>
          Please take into consideration the following aspects:<br />
          - Markets as potential sources of transmission are mapped.<br />
          - In epidemic-prone areas, risks to community and household productive assets are identified and a plan for protecting assets is in place.<br />
          - NS can support business continuity planning for private sector actors (especially Small and Medium Enterprises).<br /><br />
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
    } else if (props.formCode === 'a3-2' && componentIndex === 7) {
      return (<div key={'container' + componentIndex + 'epi'} id={'container' + componentIndex + 'epi'}>
        <div className='per_form_ns'>Epidemic preparedness</div>
        <div>
          Please take into consideration the following aspects:<br />
          - Scenarios consider epidemic risk and absence of key personnel.<br /><br />
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
    } else if (props.formCode === 'a3-2' && componentIndex === 8) {
      return (<div key={'container' + componentIndex + 'epi'} id={'container' + componentIndex + 'epi'}>
        <div className='per_form_ns'>Epidemic preparedness</div>
        <div>
          Please take into consideration the following aspects:<br />
          - Replacement of destroyed or contaminated NFI during epidemic is planned for.<br /><br />
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
    } else if (props.formCode === 'a3-2' && componentIndex === 9) {
      return (<div key={'container' + componentIndex + 'epi'} id={'container' + componentIndex + 'epi'}>
        <div className='per_form_ns'>Epidemic preparedness</div>
        <div>
          Please take into consideration the following aspects:<br />
          - NS in countries with epidemic risk for viral hemorrhagic fevers can carry out safe and dignified burials.<br /><br />
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
    } else if (props.formCode === 'a3-2' && componentIndex === 10) {
      return (<div key={'container' + componentIndex + 'epi'} id={'container' + componentIndex + 'epi'}>
        <div className='per_form_ns'>Epidemic preparedness</div>
        <div>
          Please take into consideration the following aspects:<br />
          - NS can carry out RFL in epidemics due to separation in isolation.<br /><br />
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
    } else if (props.formCode === 'a3-2' && componentIndex === 11) {
      return (<div key={'container' + componentIndex + 'epi'} id={'container' + componentIndex + 'epi'}>
        <div className='per_form_ns'>Epidemic preparedness</div>
        <div>
          Please take into consideration the following aspects:<br />
          - Stigma to reintegrate survivors into communities and other aspects that might be specific to epidemics.<br /><br />
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
    } else if (props.formCode === 'a3-2' && componentIndex === 12) {
      return (<div key={'container' + componentIndex + 'epi'} id={'container' + componentIndex + 'epi'}>
        <div className='per_form_ns'>Epidemic preparedness</div>
        <div>
          Please take into consideration the following aspects:<br />
          - Chemical events are included in CBS as a specific indicator or as an unusual event. NS includes contacts to chemical authorities in CBS SOP.<br /><br />
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
    } else if (props.formCode === 'a3-2' && componentIndex === 13) {
      return (<div key={'container' + componentIndex + 'epi'} id={'container' + componentIndex + 'epi'}>
        <div className='per_form_ns'>Epidemic preparedness</div>
        <div>
          Please take into consideration the following aspects:<br />
          - NS trains CBHFA volunteers on epidemics simulations, preparedness and response planning and monitoring utilizing the Communicable Disease Prevention module and Epidemic Control for Volunteer toolkit<br /><br />
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
    } else if (props.formCode === 'a3-2' && componentIndex === 14) {
      return (<div key={'container' + componentIndex + 'epi'} id={'container' + componentIndex + 'epi'}>
        <div className='per_form_ns'>Epidemic preparedness</div>
        <div>
          Please take into consideration the following aspects:<br />
          - Capacities are mapped in line with types of epidemic prone diseases and epidemic risks.<br /><br />
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
    } else if (props.formCode === 'a3-2' && componentIndex === 15) {
      return (<div key={'container' + componentIndex + 'epi'} id={'container' + componentIndex + 'epi'}>
        <div className='per_form_ns'>Epidemic preparedness</div>
        <div>
          Please take into consideration the following aspects:<br />
          - Early Action mechanism in case of epidemics is formalized with MoH, including triggers<br />
          - The branches have functioning local networks to inform communities of potential epidemics (respecting mandates of public authorities).<br /><br />
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
    } else if (props.formCode === 'a3-2' && componentIndex === 16) {
      return (<div key={'container' + componentIndex + 'epi'} id={'container' + componentIndex + 'epi'}>
        <div className='per_form_ns'>Epidemic preparedness</div>
        <div>
          Please take into consideration the following aspects:<br />
          - Cash transfer programme is tailored to face the challenges of infectious disease outbreaks.<br /><br />
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
    } else if (props.formCode === 'a3-2' && componentIndex === 17) {
      return (<div key={'container' + componentIndex + 'epi'} id={'container' + componentIndex + 'epi'}>
        <div className='per_form_ns'>Epidemic preparedness</div>
        <div>
          Please take into consideration the following aspects:<br />
          - Data collection templates for epidemic needs assessment are available to include CBS, health services etc.<br />
          - Emergency multi-sectoral assessment team is trained on Infection prevention and control.<br /><br />
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
    } else if (props.formCode === 'a3-2' && componentIndex === 18) {
      return (<div key={'container' + componentIndex + 'epi'} id={'container' + componentIndex + 'epi'}>
        <div className='per_form_ns'>Epidemic preparedness</div>
        <div>
          Please take into consideration the following aspects:<br />
          - NS has a policy to share personal data with operational actors (i.e. contact tracing).<br /><br />
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
    } else if (props.formCode === 'a3-2' && componentIndex === 19) {
      return (<div key={'container' + componentIndex + 'epi'} id={'container' + componentIndex + 'epi'}>
        <div className='per_form_ns'>Epidemic preparedness</div>
        <div>
          Please take into consideration the following aspects:<br />
          - EOC structure includes decision-making responsibilities for health staff, and how NS EOC supports the national EOC.<br />
          - EOC SOPs are adapted to epidemics and involve health staff.<br />
          - NS EOC is linked to the MOE's EOC.<br />
          - The roles of health managers within the EOC are clear.<br /><br />
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
    } else if (props.formCode === 'a3-2' && componentIndex === 20) {
      return (<div key={'container' + componentIndex + 'epi'} id={'container' + componentIndex + 'epi'}>
        <div className='per_form_ns'>Epidemic preparedness</div>
        <div>
          Please take into consideration the following aspects:<br />
          - Key staff at headquarters and branch level are familiar with IM templates (these may be the NS or IFRC), methodology and procedures specific to epidemics.<br />
          - Specific SOPs for data sharing in epidemics are available.<br />
          - Ongoing scenario plans and response options are documented and filed.<br /><br />
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
    } else if (props.formCode === 'a3-2' && componentIndex === 21) {
      return (<div key={'container' + componentIndex + 'epi'} id={'container' + componentIndex + 'epi'}>
        <div className='per_form_ns'>Epidemic preparedness</div>
        <div>
          Please take into consideration the following aspects:<br />
          - NS conducts epidemic-specific simulations and drills that cover cross-border dimensions at least once a year and more often in areas at high risk of epidemics.<br />
          - Testing includes infection prevention and control for staff and volunteers.<br /><br />
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
    } else if (props.formCode === 'a3-2' && componentIndex === 22) {
      return (<div key={'container' + componentIndex + 'epi'} id={'container' + componentIndex + 'epi'}>
        <div className='per_form_ns'>Epidemic preparedness</div>
        <div>
          Please take into consideration the following aspects:<br />
          - SOPs for the acceptance of medical personnel, medical equipment and supplies including medication and laboratory supplies<br /><br />
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
    } else if (props.formCode === 'a3' && componentIndex === 0) { // ============================================= a3
      return (<div key={'container' + componentIndex + 'epi'} id={'container' + componentIndex + 'epi'}>
        <div className='per_form_ns'>Epidemic preparedness</div>
        <div>
          Please take into consideration the following aspects:<br />
          - Capacities are mapped in line with types of epidemic prone diseases and epidemic risks.<br /><br />
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
    } else if (props.formCode === 'a3' && componentIndex === 1) {
      return (<div key={'container' + componentIndex + 'epi'} id={'container' + componentIndex + 'epi'}>
        <div className='per_form_ns'>Epidemic preparedness</div>
        <div>
          Please take into consideration the following aspects:<br />
          - Early Action mechanism in case of epidemics is formalized with MoH, including triggers<br />
          - The branches have functioning local networks to inform communities of potential epidemics (respecting mandates of public authorities).<br /><br />
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
    } else if (props.formCode === 'a3' && componentIndex === 2) {
      return (<div key={'container' + componentIndex + 'epi'} id={'container' + componentIndex + 'epi'}>
        <div className='per_form_ns'>Epidemic preparedness</div>
        <div>
          Please take into consideration the following aspects:<br />
          - Cash transfer programme is tailored to face the challenges of infectious disease outbreaks.<br /><br />
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
    } else if (props.formCode === 'a3' && componentIndex === 3) {
      return (<div key={'container' + componentIndex + 'epi'} id={'container' + componentIndex + 'epi'}>
        <div className='per_form_ns'>Epidemic preparedness</div>
        <div>
          Please take into consideration the following aspects:<br />
          - Data collection templates for epidemic needs assessment are available to include CBS, health services etc.<br />
          - Emergency multi-sectoral assessment team is trained on Infection prevention and control.<br /><br />
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
    } else if (props.formCode === 'a3' && componentIndex === 4) {
      return (<div key={'container' + componentIndex + 'epi'} id={'container' + componentIndex + 'epi'}>
        <div className='per_form_ns'>Epidemic preparedness</div>
        <div>
          Please take into consideration the following aspects:<br />
          - NS has a policy to share personal data with operational actors (i.e. contact tracing).<br /><br />
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
    } else if (props.formCode === 'a3' && componentIndex === 5) {
      return (<div key={'container' + componentIndex + 'epi'} id={'container' + componentIndex + 'epi'}>
        <div className='per_form_ns'>Epidemic preparedness</div>
        <div>
          Please take into consideration the following aspects:<br />
          - EOC structure includes decision-making responsibilities for health staff, and how NS EOC supports the national EOC.<br />
          - EOC SOPs are adapted to epidemics and involve health staff.<br />
          - NS EOC is linked to the MOE's EOC.<br />
          - The roles of health managers within the EOC are clear.<br /><br />
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
    } else if (props.formCode === 'a3' && componentIndex === 6) {
      return (<div key={'container' + componentIndex + 'epi'} id={'container' + componentIndex + 'epi'}>
        <div className='per_form_ns'>Epidemic preparedness</div>
        <div>
          Please take into consideration the following aspects:<br />
          - Key staff at headquarters and branch level are familiar with IM templates (these may be the NS or IFRC), methodology and procedures specific to epidemics.<br />
          - Specific SOPs for data sharing in epidemics are available.<br />
          - Ongoing scenario plans and response options are documented and filed.<br /><br />
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
    } else if (props.formCode === 'a3' && componentIndex === 7) {
      return (<div key={'container' + componentIndex + 'epi'} id={'container' + componentIndex + 'epi'}>
        <div className='per_form_ns'>Epidemic preparedness</div>
        <div>
          Please take into consideration the following aspects:<br />
          - NS conducts epidemic-specific simulations and drills that cover cross-border dimensions at least once a year and more often in areas at high risk of epidemics.<br />
          - Testing includes infection prevention and control for staff and volunteers.<br /><br />
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
    } else if (props.formCode === 'a3' && componentIndex === 8) {
      return (<div key={'container' + componentIndex + 'epi'} id={'container' + componentIndex + 'epi'}>
        <div className='per_form_ns'>Epidemic preparedness</div>
        <div>
          Please take into consideration the following aspects:<br />
          - SOPs for the acceptance of medical personnel, medical equipment and supplies including medication and laboratory supplies.<br /><br />
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
    } else if (props.formCode === 'a4' && componentIndex === 0) { // ============================================= a4
      return (<div key={'container' + componentIndex + 'epi'} id={'container' + componentIndex + 'epi'}>
        <div className='per_form_ns'>Epidemic preparedness</div>
        <div>
          Please take into consideration the following aspects:<br />
          - Framework for the use and coordination of international assistance includes management of medical teams.<br /><br />
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
    } else if (props.formCode === 'a4' && componentIndex === 1) {
      return (<div key={'container' + componentIndex + 'epi'} id={'container' + componentIndex + 'epi'}>
        <div className='per_form_ns'>Epidemic preparedness</div>
        <div>
          Please take into consideration the following aspects:<br />
          - NS knows the national authorities' capacities for epidemic prevention and control and identifies areas within a response to fulfil their auxiliary role.<br />
          - The use of emblem by medical teams is clearly defined.<br />
          - NS is part of the National risk communication sub working groups.<br /><br />
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
    } else if (props.formCode === 'a4' && componentIndex === 2) {
      return (<div key={'container' + componentIndex + 'epi'} id={'container' + componentIndex + 'epi'}>
        <div className='per_form_ns'>Epidemic preparedness</div>
        <div>
          Please take into consideration the following aspects:<br />
          - Coordination mechanisms specific to epidemic risk management.<br /><br />
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
    } else if (props.formCode === 'a4' && componentIndex === 3) {
      return (<div key={'container' + componentIndex + 'epi'} id={'container' + componentIndex + 'epi'}>
        <div className='per_form_ns'>Epidemic preparedness</div>
        <div>
          Please take into consideration the following aspects:<br />
          - Coordination mechanisms specific to epidemic risk management.<br /><br />
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
    } else if (props.formCode === 'a4' && componentIndex === 4) {
      return (<div key={'container' + componentIndex + 'epi'} id={'container' + componentIndex + 'epi'}>
        <div className='per_form_ns'>Epidemic preparedness</div>
        <div>
          Please take into consideration the following aspects:<br />
          - Coordination mechanisms specific to epidemic risk management (e.g. with limited number of key available staff and volunteers, security/access limitations).<br /><br />
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
    } else if (props.formCode === 'a4' && componentIndex === 5) {
      return (<div key={'container' + componentIndex + 'epi'} id={'container' + componentIndex + 'epi'}>
        <div className='per_form_ns'>Epidemic preparedness</div>
        <div>
          Please take into consideration the following aspects:<br />
          - Coordination mechanisms specific to epidemic risk management (e.g. partnership with communication or PPE providers, protection of corporate partner volunteers).<br /><br />
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
    } else if (props.formCode === 'a5' && componentIndex === 0) { // ============================================= a5
      return (<div key={'container' + componentIndex + 'epi'} id={'container' + componentIndex + 'epi'}>
        <div className='per_form_ns'>Epidemic preparedness</div>
        <div>
          Please take into consideration the following aspects:<br />
          - NS has conducted a protection, gender and inclusion (PGI) analysis to put a gender and culturally appropriate security system in place to protect all staff and volunteers from the risk of epidemics.<br />
          - All  responders are trained in protection, gender and inclusion (PGI) and are aware of gender specific safety and security requirements during epidemics.<br /><br />
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
    } else if (props.formCode === 'a5' && componentIndex === 1) {
      return (<div key={'container' + componentIndex + 'epi'} id={'container' + componentIndex + 'epi'}>
        <div className='per_form_ns'>Epidemic preparedness</div>
        <div>
          Please take into consideration the following aspects:<br />
          - PMER aspects that might be particularly affected during an outbreak (e.g. with limited number of key staff and volunteers available).<br /><br />
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
    } else if (props.formCode === 'a5' && componentIndex === 2) {
      return (<div key={'container' + componentIndex + 'epi'} id={'container' + componentIndex + 'epi'}>
        <div className='per_form_ns'>Epidemic preparedness</div>
        <div>
          Please take into consideration the following aspects:<br />
          - Finance and administration processes that might be particularly affected during epidemics (e.g. with limited number of key staff and volunteers available).<br /><br />
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
    } else if (props.formCode === 'a5' && componentIndex === 3) {
      return (<div key={'container' + componentIndex + 'epi'} id={'container' + componentIndex + 'epi'}>
        <div className='per_form_ns'>Epidemic preparedness</div>
        <div>
          Please take into consideration the following aspects:<br />
          - Information and Communication Technology processes that might be particularly affected during epidemics (e.g. with limited number of key staff and volunteers available, management of rumours), or necessary to carry out Community Based Surveillance (CBS) activities.<br /><br />
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
    } else if (props.formCode === 'a5' && componentIndex === 5) { // !!! increased from 4 to 5, and so later on
      return (<div key={'container' + componentIndex + 'epi'} id={'container' + componentIndex + 'epi'}>
        <div className='per_form_ns'>Epidemic preparedness</div>
        <div>
          Please take into consideration the following aspects:<br />
          - WHO and MOH have been consulted on specifications of pre-positioned relief items related to epidemics and NS has analysed optimal supply chain options (e.g. prepositioned relief items, pre-existing agreements with suppliers, environmental impact) in terms of cost, speed and reliability.<br />
          - NS has SOPs for accepting, rejecting, storing, disposing and reporting on in-kind medical donations.<br />
          - NS has a procedure on the import of vaccines and drugs related to potential epidemics.<br />
          - There are infection prevention and control measures set for the use of vehicles during epidemics.<br />
          - Drivers are included in infection prevention and control and psychosocial support training in epidemics.<br /><br />
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
    } else if (props.formCode === 'a5' && componentIndex === 6) {
      return (<div key={'container' + componentIndex + 'epi'} id={'container' + componentIndex + 'epi'}>
        <div className='per_form_ns'>Epidemic preparedness</div>
        <div>
          Please take into consideration the following aspects:<br />
          - Supply chain management processes that might be specific to epidemics (e.g. PPE, vaccines).<br /><br />
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
    } else if (props.formCode === 'a5' && componentIndex === 7) {
      return (<div key={'container' + componentIndex + 'epi'} id={'container' + componentIndex + 'epi'}>
        <div className='per_form_ns'>Epidemic preparedness</div>
        <div>
          Please take into consideration the following aspects:<br />
          - Procurement processes that might be specific to epidemics (e.g. PPE).<br /><br />
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
    } else if (props.formCode === 'a5' && componentIndex === 8) {
      return (<div key={'container' + componentIndex + 'epi'} id={'container' + componentIndex + 'epi'}>
        <div className='per_form_ns'>Epidemic preparedness</div>
        <div>
          Please take into consideration the following aspects:<br />
          - Processes that might be specific to epidemics.<br /><br />
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
    } else if (props.formCode === 'a5' && componentIndex === 9) {
      return (<div key={'container' + componentIndex + 'epi'} id={'container' + componentIndex + 'epi'}>
        <div className='per_form_ns'>Epidemic preparedness</div>
        <div>
          Please take into consideration the following aspects:<br />
          - Processes that might be specific to epidemics.<br /><br />
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
    } else if (props.formCode === 'a5' && componentIndex === 10) {
      return (<div key={'container' + componentIndex + 'epi'} id={'container' + componentIndex + 'epi'}>
        <div className='per_form_ns'>Epidemic preparedness</div>
        <div>
          Please take into consideration the following aspects:<br />
          - NS conducts regular training of key staff on epidemic prevention, surveillance (including zoonoses) and control at all levels (HQ, high-risk branches, volunteers).<br />
          - NS has appropriate volunteer insurance for epidemics.<br /><br />
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
    } else if (props.formCode === 'a5' && componentIndex === 11) {
      return (<div key={'container' + componentIndex + 'epi'} id={'container' + componentIndex + 'epi'}>
        <div className='per_form_ns'>Epidemic preparedness</div>
        <div>
          Please take into consideration the following aspects:<br />
          - Key messages and public awareness messages for specific epidemics are available and shared with staff regularly.<br />
          - NS has as a rumor management system for epidemics.<br /><br />
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
    } else if (props.formCode === 'a5' && componentIndex === 12) {
      return (<div key={'container' + componentIndex + 'epi'} id={'container' + componentIndex + 'epi'}>
        <div className='per_form_ns'>Epidemic preparedness</div>
        <div>
          Please take into consideration the following aspects:<br />
          - Partners and donations that might be specific to epidemics.<br /><br />
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
    } else {
      return (<div key={'container' + componentIndex + 'epi'} id={'container' + componentIndex + 'epi'}>
        <div className='per_form_ns'>Epidemic preparedness</div>
        <div>
          Please take into consideration the following aspects:<br />
          - TO BE ELABORATED<br /><br />
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
    _updateProfile: T.func,
    ns: T.number,
    formCode: T.string
  };
}

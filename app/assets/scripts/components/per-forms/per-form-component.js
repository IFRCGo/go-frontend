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

//var leading_text = 'Please take into consideration the following aspects:<br />- NS has epidemics preparedness and response mandate reflected in its policy, strategy, plans and procedures.<br />- NS mandate in epidemics is recognized by national public health authorities.<br /><br />';

const renderEpiComponent = (component, props, componentIndex) => {
  if (props.state.epiComponent === 'yes' && typeof component.namespaces !== 'undefined' && component.namespaces !== null) {
    if (props.formCode == 'a1' && componentIndex == 0) { /////////////////////////// a1
      return (<div key={'container' + componentIndex + 'epi'} id={'container' + componentIndex + 'epi'}>
        <div className='per_form_ns'>Epidemic preparedness</div>
        <div>
          Please take into consideration the following aspects:<br />
          - NS has epidemics preparedness and response mandate reflected in its policy, strategy, plans and procedures.<br />
          - NS mandate in epidemics is recognized by national public health authorities.<br /><br />
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
    else if (props.formCode == 'a1' && componentIndex == 1) {
      return (<div key={'container' + componentIndex + 'epi'} id={'container' + componentIndex + 'epi'}>
        <div className='per_form_ns'>Epidemic preparedness</div>
        <div>
          Please take into consideration the following aspects:<br />
          - NS Disaster Risk Management strategy reflects specific risk analysis for public health and includes public health emergency strategies.<br /><br />
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
    else if (props.formCode == 'a1' && componentIndex == 2) {
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
    }
    else if (props.formCode == 'a1' && componentIndex == 3) {
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
    }
    else if (props.formCode == 'a1' && componentIndex == 4) {
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
    if (props.formCode == 'a2' && componentIndex == 0) { /////////////////////////// a2
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
    }
    else if (props.formCode == 'a2' && componentIndex == 1) {
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
    }
    else if (props.formCode == 'a2' && componentIndex == 2) {
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
    }
    else if (props.formCode == 'a2' && componentIndex == 3) {
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
    }
    else if (props.formCode == 'a2' && componentIndex == 4) {
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
    }
    else if (props.formCode == 'a2' && componentIndex == 5) {
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
    }
    else if (props.formCode == 'a2' && componentIndex == 6) {
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
    }
    else if (props.formCode == 'a2' && componentIndex == 7) {
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
    }
    else {
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
        <button className='button button--medium button--primary-filled' onClick={props.editDraft}>Save draft</button>
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

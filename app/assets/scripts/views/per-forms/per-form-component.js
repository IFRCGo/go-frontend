import React from 'react';

const renderLanguageSelectDropdown = (props) => {
  return (<select onChange={props.chooseLanguage}>
    <option value='english'>English</option>
    <option value='spanish'>Spanish</option>
    <option value='french'>French</option>
  </select>);
};

const renderFormTitle = (props) => {
  return (
    <div className="fold__header">
      <h2 className="fold__title">{props.state.title}</h2>
    </div>
  );
};

const renderEpidemicsRadioButton = (props) => {
  return (
    <React.Fragment>
      <div className='per_form_area'>{props.state.areaTitle}</div>
      <div className='per_form_question'>{props.state.areaQuestion}</div>
      <input type='radio' name='a1' value={props.state.areaOptions[0]} onClick={props.changeEpiComponentState} /> {props.state.areaOptions[0]} <br />
      <input type='radio' name='a1' value={props.state.areaOptions[1]} onClick={props.changeEpiComponentState} /> {props.state.areaOptions[1]}
    </React.Fragment>
  );
};

const renderComponents = (props) => {
  const components = [];
  let componentIndex = 0;

  props.state.components.forEach(component => {
    components.push(<React.Fragment>
      <div className='per_form_area'>{component.componentTitle}</div>
      {component.componentDescription}<br /><br />

      {renderQuestions(component, componentIndex)}
      {renderEpiComponent(props, componentIndex)}
    </React.Fragment>);
    componentIndex++;
  });

  return components;
};

const renderQuestions = (component, componentIndex) => {
  const questions = [];
  let questionIndex = 0;

  if (typeof component.namespaces !== 'undefined' && component.namespaces !== null) {
    component.namespaces.forEach(namespace => {
      questions.push(<React.Fragment>
        <div className='per_form_ns'>{namespace.nsTitle}</div>
        <div className='per_form_question'>{namespace.nsQuestion}</div>

        {renderAnswers(namespace, componentIndex, questionIndex)}
        {renderFeedbackBox(namespace, componentIndex, questionIndex)}

      </React.Fragment>);
      questionIndex++;
    });
  }

  return questions;
};

const renderAnswers = (namespace, componentIndex, questionIndex) => {
  const answers = [];
  namespace.nsAnswers.forEach(answer => {
    answers.push(<React.Fragment>
      <input type='radio' name={'q' + componentIndex + '' + questionIndex} value={answer} /> {answer}<br />
    </React.Fragment>);
  });
  return answers;
};

const renderFeedbackBox = (namespace, componentIndex, questionIndex) => {
  return (
    <React.Fragment>
      <div className='per_form_question'>{namespace.feedbackTitle}</div>
      {typeof namespace.feedbackDescription !== 'undefined' && namespace.feedbackDescription !== null && namespace.feedbackDescription.trim() !== '' ? (<React.Fragment>{namespace.feedbackDescription}<br /></React.Fragment>) : null}
      <input type='text' name={'q' + componentIndex + '' + questionIndex + 'f'} /><br /><br />
    </React.Fragment>
  );
};

const renderEpiComponent = (props, namespaceIndex) => {
  console.log(props);
  if (props.state.epiComponent === 'yes') {
    return (<React.Fragment>
      <div className='per_form_ns'>Epidemic preparedess</div>
      <div>
        Please take into consideration the following aspects:<br />
        - The national public health emergency response strategy/plan outlines NS role in epidemics prevention, detection and response.<br />
        - NS Mandate in epidemics is understood by staff.<br />
        - The National Epidemic Strategy/Plan adheres to International Health Regulations.<br /><br />
      </div>
      <input type='radio' name={'q' + namespaceIndex + 'epi'} value='Not Reviewed' /> Not Reviewed<br />
      <input type='radio' name={'q' + namespaceIndex + 'epi'} value='Does not exist' /> Does not exist<br />
      <input type='radio' name={'q' + namespaceIndex + 'epi'} value='Partially exists' /> Partially exists<br />
      <input type='radio' name={'q' + namespaceIndex + 'epi'} value='Need improvements' /> Need improvements<br />
      <input type='radio' name={'q' + namespaceIndex + 'epi'} value='Exists, could be strengthened' /> Exists, could be strengthened<br />
      <input type='radio' name={'q' + namespaceIndex + 'epi'} value='High performance' /> High performance<br /><br />
    </React.Fragment>);
  }
};

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

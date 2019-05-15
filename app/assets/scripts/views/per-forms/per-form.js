import React from 'react';
import RequestFactory from './factory/request-factory';

export default class PerForm extends React.Component {
  constructor (props) {
    super(props);
    this.composeForms = this.composeForms.bind(this);
    this.composeNamespaces = this.composeNamespaces.bind(this);
    this.composeAnswers = this.composeAnswers.bind(this);
    this.sendForm = this.sendForm.bind(this);
    this.saveDraft = this.saveDraft.bind(this);
    this.loadDraft = this.loadDraft.bind(this);
    this.requestFactory = new RequestFactory();
  }

  componentDidMount() {
    this.loadDraft();
  }

  composeForms () {
    const forms = [];

    this.state.components.forEach(component => {
      forms.push(<React.Fragment>
        <div className='per_form_area'>{component.componentTitle}</div>
        {component.componentDescription}<br /><br />
        {this.composeNamespaces(component)}
      </React.Fragment>);
    });

    return forms;
  }

  composeNamespaces (component) {
    const namespaces = [];
    let namespaceIndex = 0;

    if (typeof component.namespaces !== 'undefined' && component.namespaces !== null) {
      component.namespaces.forEach(namespace => {
        namespaces.push(<React.Fragment>
          <div className='per_form_ns'>{namespace.nsTitle}</div>
          <div className='per_form_question'>{namespace.nsQuestion}</div>
          {this.composeAnswers(namespace, namespaceIndex)}
          <div className='per_form_question'>{namespace.feedbackTitle}</div>
          {typeof namespace.feedbackDescription !== 'undefined' && namespace.feedbackDescription !== null && namespace.feedbackDescription.trim() !== '' ? (<React.Fragment>{namespace.feedbackDescription}<br /></React.Fragment>) : null}
          <input type='text' name={'q' + namespaceIndex + 'f'} /><br /><br />
        </React.Fragment>);
        namespaceIndex++;
      });
    }

    return namespaces;
  }

  composeAnswers (namespace, namespaceIndex) {
    const answers = [];
    namespace.nsAnswers.forEach(answer => {
      answers.push(<React.Fragment>
        <input type='radio' name={'q' + namespaceIndex} value={answer} /> {answer}<br />
      </React.Fragment>);
    });

    return answers;
  }

  saveDraft () {
    let request = this.requestFactory.newFormRequest(this.formCode, this.formName, this.state.languageCode);
    request = this.requestFactory.addAreaQuestionData(request);
    request = this.requestFactory.addComponentData(request);
    localStorage.setItem('draft' + this.formCode, JSON.stringify(request));
  }

  loadDraft () {
    let draft = JSON.parse(localStorage.getItem('draft' + this.formCode));
    if (draft !== null && typeof draft.data !== 'undefined' && draft.data !== null) {
      draft.data.forEach(question => {
        if (question.op !== null && question.id !== null) {
          let input = document.querySelector('[name=\'' + question.id + '\']');
          if (input.type === 'radio') {
            document.querySelector('[name=\'' + question.id + '\'][value=\'' + question.op + '\']').checked = true;
          } else if (input.type === 'text') {
            input.value = question.op;
          }
        }
      });
    }
  }

  sendForm () {
    this.saveDraft();
    let request = this.requestFactory.newFormRequest(this.formCode, this.formName, this.state.languageCode);
    request = this.requestFactory.addAreaQuestionData(request);
    request = this.requestFactory.addComponentData(request);
    console.log(request);
    // fetch('https://dsgocdnapi.azureedge.net/sendperform', {
    //   method: 'POST',
    //   headers: {
    //     'Accept': 'application/json',
    //     'Content-Type': 'application/json'
    //   },
    //   body: data
    // });
  }

  render () {
    return (
      <div className='fold'>
        <div className='inner'>
          <select onChange={this.chooseLanguage}>
            <option value='english'>English</option>
            <option value='spanish'>Spanish</option>
            <option value='french'>French</option>
          </select>

          <div className="fold__header">
            <h2 className="fold__title">{this.state.title}</h2>
          </div>

          <div className='per_form_area'>{this.state.areaTitle}</div>
          <div className='per_form_question'>{this.state.areaQuestion}</div>
          <input type='radio' name='a1' value={this.state.areaOptions[0]} /> {this.state.areaOptions[0]} <br />
          <input type='radio' name='a1' value={this.state.areaOptions[1]} /> {this.state.areaOptions[1]}

          {this.composeForms()}

          <input type='checkbox' name='draft' value='yes' /> Save as Draft<br />
          <button onClick={this.sendForm}>Submit</button>

        </div>
      </div>
    );
  }
}

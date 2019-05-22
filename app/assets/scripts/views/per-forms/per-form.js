import React from 'react';
import { PerFormComponent } from './per-form-component';
import RequestFactory from './factory/request-factory';

export default class PerForm extends React.Component {
  constructor (props) {
    super(props);
    this.state = {epiComponent: 'no'};
    this.sendForm = this.sendForm.bind(this);
    this.saveState = this.saveState.bind(this);
    this.loadState = this.loadState.bind(this);
    this.changeEpiComponentState = this.changeEpiComponentState.bind(this);
    this.changeEpiComponentStateTo = this.changeEpiComponentStateTo.bind(this);
    this.isEpiComponent = this.isEpiComponent.bind(this);
    this.chooseFormStateSource = this.chooseFormStateSource.bind(this);
    this.autosave = this.autosave.bind(this);
    this.checkFormFilled = this.checkFormFilled.bind(this);
    this.autosaveInterval = setInterval(this.autosave, 5000);
    this.requestFactory = new RequestFactory();
  }

  componentDidMount () {
    if (this.isEpiComponent()) {
      this.changeEpiComponentStateTo('yes');
    } else {
      this.chooseFormStateSource();
    }
  }

  componentDidUpdate () {
    this.chooseFormStateSource();
  }

  chooseFormStateSource () {
    if (localStorage.getItem('autosave' + this.formCode) !== null && localStorage.getItem('finished' + this.formCode) === null) {
      this.loadState('autosave');
    } else if (localStorage.getItem('draft' + this.formCode) !== null && localStorage.getItem('finished' + this.formCode) === null) {
      this.loadState('draft');
    }
  }

  saveState (type) {
    let request = this.requestFactory.newFormRequest(this.formCode, this.formName, this.state.languageCode);
    request = this.requestFactory.addAreaQuestionData(request);
    request = this.requestFactory.addComponentData(request);
    localStorage.setItem(type + '' + this.formCode, JSON.stringify(request));
  }

  isEpiComponent () {
    let draft = null;

    if (localStorage.getItem('autosave' + this.formCode) !== null && localStorage.getItem('finished' + this.formCode) === null) {
      draft = JSON.parse(localStorage.getItem('autosave' + this.formCode));
    } else if (localStorage.getItem('draft' + this.formCode) !== null && localStorage.getItem('finished' + this.formCode) === null) {
      draft = JSON.parse(localStorage.getItem('draft' + this.formCode));
    }

    if (draft !== null && draft.data !== null) {
      let epi = draft.data.filter(question => question.id === 'a1' && question.op === 'yes');

      if (epi.length > 0) {
        return true;
      }
    }

    return false;
  }

  loadState (type) {
    let draft = JSON.parse(localStorage.getItem(type + this.formCode));
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
    this.checkFormFilled();
    // this.saveState('draft');
    // let request = this.requestFactory.newFormRequest(this.formCode, this.formName, this.state.languageCode);
    // request = this.requestFactory.addAreaQuestionData(request);
    // request = this.requestFactory.addComponentData(request);
    // fetch('https://dsgocdnapi.azureedge.net/sendperform', {
    //   method: 'POST',
    //   headers: {
    //     'Accept': 'application/json',
    //     'Content-Type': 'application/json'
    //   },
    //   body: data
    // });
  }

  changeEpiComponentState (e) {
    this.setState({epiComponent: e.target.value});
  }

  changeEpiComponentStateTo (value) {
    this.setState({epiComponent: value});
  }

  autosave () {
    this.saveState('autosave');
  }

  checkFormFilled () {
    let componentIndex = 0;

    for (let component of this.state.components) {
      if (typeof component.namespaces !== 'undefined' && component.namespaces !== null) {
        for (let questionIndex in component.namespaces) {
          if (document.querySelectorAll('[name=\'c' + componentIndex + 'q' + questionIndex + '\']:checked').length < 1) {
            document.getElementById('container' + componentIndex + 'q' + questionIndex).style.backgroundColor = '#FEB8B8';
            let offsetTop = document.getElementById('container' + componentIndex + 'q' + questionIndex).offsetTop;
            window.scroll(0, offsetTop);
            return false;
          } else {
            document.getElementById('container' + componentIndex + 'q' + questionIndex).style.backgroundColor = '#FFFFFF';
          }
        }
      }

      if (this.state.epiComponent === 'yes') {
        if (document.querySelectorAll('[name=\'c' + componentIndex + 'epi\']:checked').length < 1) {
          document.getElementById('container' + componentIndex + 'epi').style.backgroundColor = '#FEB8B8';
          let offsetTop = document.getElementById('container' + componentIndex + 'epi').offsetTop;
          window.scroll(0, offsetTop);
          return false;
        } else {
          document.getElementById('container' + componentIndex + 'epi').style.backgroundColor = '#FFFFFF';
        }
      }

      componentIndex++;
    }
  }

  render () {
    return <PerFormComponent chooseLanguage={this.chooseLanguage}
      changeEpiComponentState={this.changeEpiComponentState}
      sendForm={this.sendForm}
      state={this.state} />;
  }
}

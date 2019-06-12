import React from 'react';
import { PerFormComponent } from './per-form-component';
import RequestFactory from './factory/request-factory';
import { Redirect } from 'react-router-dom';
import { showAlert } from '../system-alerts';
import { environment } from '../../config';
import { PropTypes as T } from 'prop-types';

export default class PerForm extends React.Component {
  constructor (props, defaultLanguage, formCode, formName) {
    super(props);
    this.formName = formName;
    this.formCode = formCode;
    this.nationalSociety = props.nationalSociety;
    this.sendForm = this.sendForm.bind(this);
    this.saveState = this.saveState.bind(this);
    this.loadState = this.loadState.bind(this);
    this.loadFromProps = this.loadFromProps.bind(this);
    this.isEpiComponent = this.isEpiComponent.bind(this);
    this.isEpiComponentFromProps = this.isEpiComponentFromProps.bind(this);
    this.chooseFormStateSource = this.chooseFormStateSource.bind(this);
    this.autosave = this.autosave.bind(this);
    this.checkFormFilled = this.checkFormFilled.bind(this);
    if (!props.view) {
      this.autosaveInterval = setInterval(this.autosave, 10000);
    }
    this.requestFactory = new RequestFactory();
    if (this.isEpiComponent()) {
      defaultLanguage.epiComponent = 'yes';
    } else {
      defaultLanguage.epiComponent = 'no';
    }
    defaultLanguage.redirect = false;
    this.state = defaultLanguage;
    this.changeEpiComponentState = this.changeEpiComponentState.bind(this);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    console.log(nextProps);
    console.log(prevState);
  }

  componentDidMount () {
    if (this.props.view) {
      this.props._getPerDocument(this.props.match.params.id);
    }
    this.chooseFormStateSource();
    const payloadSkeleton = `{'code':'a1', 'user_id': 2653, 'data':'haha'}`;
    console.log(this.props);
    this.props._sendPerDraft('{"code":"1","user_id":"2653","data":"haha"}');
  }

  componentDidUpdate () {
    console.log(this.props);
    this.chooseFormStateSource();
  }

  chooseFormStateSource () {
    if (this.props.view && this.props.perDocument.fetched) {
      if (this.state.epiComponent !== 'yes') {
        this.setState({epiComponent: 'yes'});
        return;
      }
      this.loadFromProps();
    } else if (localStorage.getItem('autosave' + this.formCode) !== null && localStorage.getItem('finished' + this.formCode) === null) {
      this.loadState('autosave');
    } else if (localStorage.getItem('draft' + this.formCode) !== null) {
      console.log('ittvok');
      localStorage.removeItem('finished' + this.formCode);
      //this.loadState('draft');
      this.props._getPerDraftDocument(this.props.user.username, this.formCode);
    }
  }

  saveState (type) {
    let request = this.requestFactory.newFormRequest(this.formCode, this.formName, this.state.languageCode);
    request = this.requestFactory.addAreaQuestionData(request);
    request = this.requestFactory.addComponentData(request);

    if (type === 'autosave') {
      localStorage.setItem(type + '' + this.formCode, JSON.stringify(request));
    } else if (type === 'draft') {
      this.props._getPerDocument();
    }
  }

  isEpiComponent () {
    let draft = null;

    if (this.props.view && this.props.perDocument.fetched) {
      return this.isEpiComponentFromProps();
    } else if (!!localStorage.getItem('autosave' + this.formCode) && !localStorage.getItem('finished' + this.formCode)) {
      draft = JSON.parse(localStorage.getItem('autosave' + this.formCode));
    } else if (localStorage.getItem('draft' + this.formCode) !== null && localStorage.getItem('finished' + this.formCode) === null) {
      draft = JSON.parse(localStorage.getItem('draft' + this.formCode));
    }

    if (draft !== null && draft.data !== null) {
      let epi = draft.data.filter(question => {
        return question.id === 'a1' && question.op === this.requestFactory.stringAnswerToNum('yes');
      });

      if (epi.length > 0) {
        return true;
      }
    }

    return false;
  }

  isEpiComponentFromProps () {
    const formData = this.props.perDocument.data.results;
    const filteredData = formData.filter(question => {
      return question.question_id === 'a1' && question.selected_option === this.requestFactory.stringAnswerToNum('yes');
    });
    if (filteredData.length > 0) {
      return true;
    }
    return false;
  }

  loadState (type) {
    let draft = JSON.parse(localStorage.getItem(type + this.formCode));
    if (draft !== null && typeof draft.data !== 'undefined' && draft.data !== null) {
      draft.data.forEach(question => {
        if (!isNaN(question.op) && !!question.id) {
          const formRadioInput = document.querySelector('[name=\'' + question.id + '\'][value=\'' + question.op + '\']');
          const feedbackInput = document.querySelector('[name=\'' + question.id + 'f\']');

          if (typeof formRadioInput !== 'undefined' && formRadioInput !== null) {
            formRadioInput.checked = true;
          }

          if (typeof feedbackInput !== 'undefined' && feedbackInput !== null) {
            feedbackInput.value = question.nt;
          }
        }
      });
    }
  }

  loadFromProps () {
    const formData = this.props.perDocument.data.results;
    formData.forEach(question => {
      if (!isNaN(question.selected_option) && !!question.question_id) {
        const formRadioInput = document.querySelector('[name=\'' + question.question_id + '\'][value=\'' + question.selected_option + '\']');
        const feedbackInput = document.querySelector('[name=\'' + question.question_id + 'f\']');

        if (typeof formRadioInput !== 'undefined' && formRadioInput !== null) {
          formRadioInput.checked = true;
        }

        if (typeof feedbackInput !== 'undefined' && feedbackInput !== null) {
          feedbackInput.value = question.notes;
        }
      }
    });
  }

  sendForm () {
    if (this.checkFormFilled()) {
      if (document.querySelectorAll('[name="draft"]:checked').length > 0) {
        this.saveState('draft');
      }
      let request = this.requestFactory.newFormRequest(this.formCode, this.formName, this.state.languageCode, this.nationalSociety);
      request = this.requestFactory.addAreaQuestionData(request);
      request = this.requestFactory.addComponentData(request);
      this.props._sendPerForm(request);
      showAlert('success', <p>PER form has been saved successfully!</p>, true, 2000);
      clearInterval(this.autosaveInterval);
      localStorage.setItem('finished' + this.formCode, 1);
      this.setState({redirect: true});
    }
  }

  componentWillUnmount () {
    if (!this.props.view) {
      clearInterval(this.autosaveInterval);
    }
  }

  changeEpiComponentState (e) {
    this.autosave();
    this.setState({epiComponent: this.requestFactory.numAnswerToString(parseInt(e.target.value))});
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

      if (this.state.epiComponent === 'yes' && typeof component.namespaces !== 'undefined' && component.namespaces !== null) {
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

    return true;
  }

  render () {
    if (this.state.redirect) {
      return <Redirect to='/account' />;
    }
    return <PerFormComponent chooseLanguage={this.chooseLanguage}
      changeEpiComponentState={this.changeEpiComponentState}
      sendForm={this.sendForm}
      state={this.state}
      view={this.props.view} />;
  }
}

if (environment !== 'production') {
  PerForm.propTypes = {
    _sendPerForm: T.func,
    _getPerDocument: T.func,
    _sendPerDraft: T.func,
    _getPerDraftDocument: T.func,
    nationalSociety: T.number,
    view: T.bool,
    match: T.object,
    perDocument: T.object,
    sendPerFormResponse: T.object
  };
}

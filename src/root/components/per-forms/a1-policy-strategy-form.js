import PerForm from './per-form';
import { englishForm } from './form-data/a1/english-data';
import { frenchForm } from './form-data/a1/french-data';
import { spanishForm } from './form-data/a1/spanish-data';
import {
  sendPerForm,
  getPerForm,
  getPerDraftDocument,
  sendPerDraft,
  editPerForm
} from '#actions';
import { connect } from 'react-redux';
import { environment } from '#config';
import { PropTypes as T } from 'prop-types';

class A1PolicyStrategyForm extends PerForm {
  constructor (props) {
    super(props, englishForm, 'a1', 'Policy strategy form');
    this.chooseLanguage = this.chooseLanguage.bind(this);
    this.setLanguageToSpanish = this.setLanguageToSpanish.bind(this);
    this.setLanguageToEnglish = this.setLanguageToEnglish.bind(this);
    this.setLanguageToFrench = this.setLanguageToFrench.bind(this);
  }

  chooseLanguage (e) {
    if (e.target.value === 'english') {
      this.setLanguageToEnglish();
    } else if (e.target.value === 'spanish') {
      this.setLanguageToSpanish();
    } else if (e.target.value === 'french') {
      this.setLanguageToFrench();
    }
  }

  setLanguageToEnglish () {
    this.autosave();
    this.setState(englishForm);
  }

  setLanguageToSpanish () {
    this.autosave();
    this.setState(spanishForm);
  }

  setLanguageToFrench () {
    this.autosave();
    this.setState(frenchForm);
  }
}

// /////////////////////////////////////////////////////////////////// //
// Connect functions

if (environment !== 'production') {
  PerForm.propTypes = {
    _sendPerForm: T.func,
    sendPerFormResponse: T.object
  };
}

const selector = (state) => ({
  sendPerForm: state.perForm.sendPerForm,
  perDocument: state.perForm.getPerForm,
  sendPerDraft: state.perForm.sendPerDraft,
  getPerDraftDocument: state.perForm.getPerDraftDocument,
  user: state.user
});

const dispatcher = (dispatch) => ({
  _sendPerForm: (payload) => dispatch(sendPerForm(payload)),
  _getPerForm: (...args) => dispatch(getPerForm(...args)),
  _getPerDraftDocument: (...args) => dispatch(getPerDraftDocument(...args)),
  _sendPerDraft: (payload) => dispatch(sendPerDraft(payload)),
  _editPerForm: (payload) => dispatch(editPerForm(payload))
});

export default connect(selector, dispatcher)(A1PolicyStrategyForm);

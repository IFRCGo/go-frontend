import PerForm from './per-form';
import { englishForm } from './form-data/a1/english-data';
import { frenchForm } from './form-data/a1/french-data';
import { spanishForm } from './form-data/a1/spanish-data';
import {
  sendPerForm,
  getPerDocument,
  getPerDraftDocument,
  sendPerDraft
} from '../../actions';
import { connect } from 'react-redux';
import { environment } from '../../config';
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
    this.setState(englishForm);
  }

  setLanguageToSpanish () {
    this.setState(spanishForm);
  }

  setLanguageToFrench () {
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
  perDocument: state.perForm.getPerDocument,
  per: state.per,
  user: state.user
});

const dispatcher = (dispatch) => ({
  _sendPerForm: (payload) => dispatch(sendPerForm(payload)),
  _getPerDocument: (...args) => dispatch(getPerDocument(...args)),
  _getPerDraftDocument: (...args) => dispatch(getPerDraftDocument(...args)),
  _sendPerDraft: (payload) => dispatch(sendPerDraft(payload))
});

export default connect(selector, dispatcher)(A1PolicyStrategyForm);

import PerForm from './per-form';
import { englishForm } from './form-data/a3/engish-data';
import { frenchForm } from './form-data/a3/french-data';
import { spanishForm } from './form-data/a3/spanish-data';
import { sendPerForm } from '../../actions';
import { connect } from 'react-redux';
import { environment } from '../../config';
import { PropTypes as T } from 'prop-types';

class A3OperationalCapacity extends PerForm {
  constructor (props) {
    super(props, englishForm, 'a3', 'Operation capacity');
    this.sendForm = this.sendForm.bind(this);
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
  sendPerForm: state.sendPerForm
});

const dispatcher = (dispatch) => ({
  _sendPerForm: (payload) => dispatch(sendPerForm(payload))
});

export default connect(selector, dispatcher)(A3OperationalCapacity);

import PerForm from './per-form';
import { englishForm } from './form-data/a3/engish-data';
import { frenchForm } from './form-data/a3/french-data';
import { spanishForm } from './form-data/a3/spanish-data';

class A3OperationalCapacity extends PerForm {
  constructor (props) {
    super(props);
    this.sendForm = this.sendForm.bind(this);
    this.chooseLanguage = this.chooseLanguage.bind(this);
    this.setLanguageToSpanish = this.setLanguageToSpanish.bind(this);
    this.setLanguageToEnglish = this.setLanguageToEnglish.bind(this);
    this.setLanguageToFrench = this.setLanguageToFrench.bind(this);
    this.state = englishForm;
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

export default A3OperationalCapacity;

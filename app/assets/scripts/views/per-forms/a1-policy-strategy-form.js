import React from 'react';

class A1PolicyStrategyForm extends React.Component {
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

          <div className='per_form_area'>{this.state.components[0].componentTitle}</div>
          {this.state.components[0].componentDescription}<br /><br />

          <div className='per_form_ns'>{this.state.components[0].namespaces[0].nsTitle}</div>
          <div className='per_form_question'>{this.state.components[0].namespaces[0].nsQuestion}</div>
          <input type='radio' name='q11' value={this.state.components[0].namespaces[0].nsAnswers[0]} /> {this.state.components[0].namespaces[0].nsAnswers[0]}<br />
          <input type='radio' name='q11' value={this.state.components[0].namespaces[0].nsAnswers[1]} /> {this.state.components[0].namespaces[0].nsAnswers[1]}
          <div className='per_form_question'>{this.state.components[0].namespaces[0].feedbackTitle}</div>
          {this.state.components[0].namespaces[0].feedbackDescription}
          <br /><input type='text' name='q11f' /><br /><br />

          <div className='per_form_ns'>{this.state.components[0].namespaces[1].nsTitle}</div>
          <div className='per_form_question'>{this.state.components[0].namespaces[1].nsQuestion}</div>
          <input type='radio' name='q12' value={this.state.components[0].namespaces[1].nsAnswers[0]} /> {this.state.components[0].namespaces[1].nsAnswers[0]}<br />
          <input type='radio' name='q12' value={this.state.components[0].namespaces[1].nsAnswers[1]} /> {this.state.components[0].namespaces[1].nsAnswers[1]}
          <div className='per_form_question'>{this.state.components[0].namespaces[1].feedbackTitle}</div>
          {this.state.components[0].namespaces[1].feedbackDescription}
          <br /><input type='text' name='' /><br /><br />

          <div className='per_form_ns'>{this.state.components[0].namespaces[2].nsTitle}</div>
          <div className='per_form_question'>{this.state.components[0].namespaces[2].nsQuestion}</div>
          <input type='radio' name='q13' value={this.state.components[0].namespaces[2].nsAnswers[0]} /> {this.state.components[0].namespaces[2].nsAnswers[0]}<br />
          <input type='radio' name='q13' value={this.state.components[0].namespaces[2].nsAnswers[1]} /> {this.state.components[0].namespaces[2].nsAnswers[1]}
          <div className='per_form_question'>{this.state.components[0].namespaces[2].feedbackTitle}</div>
          {this.state.components[0].namespaces[2].feedbackDescription}
          <br /><input type='text' name='' /><br /><br />

          <div className='per_form_ns'>{this.state.components[0].namespaces[3].nsTitle}</div>
          <div className='per_form_question'>{this.state.components[0].namespaces[3].nsQuestion}</div>
          <input type='radio' name='q13' value={this.state.components[0].namespaces[3].nsAnswers[0]} /> {this.state.components[0].namespaces[3].nsAnswers[0]}<br />
          <input type='radio' name='q13' value={this.state.components[0].namespaces[3].nsAnswers[1]} /> {this.state.components[0].namespaces[3].nsAnswers[1]}
          <div className='per_form_question'>{this.state.components[0].namespaces[3].feedbackTitle}</div>
          {this.state.components[0].namespaces[3].feedbackDescription}
          <br /><input type='text' name='' /><br /><br />

          <div className='per_form_ns'>{this.state.components[0].namespaces[4].nsTitle}</div>
          <div className='per_form_question'>{this.state.components[0].namespaces[4].nsQuestion}</div>
          <input type='radio' name='q1' value={this.state.components[0].namespaces[4].nsAnswers[0]} />{this.state.components[0].namespaces[4].nsAnswers[0]}<br />
          <input type='radio' name='q1' value={this.state.components[0].namespaces[4].nsAnswers[1]} />{this.state.components[0].namespaces[4].nsAnswers[1]}<br />
          <input type='radio' name='q1' value={this.state.components[0].namespaces[4].nsAnswers[2]} />{this.state.components[0].namespaces[4].nsAnswers[2]}<br />
          <input type='radio' name='q1' value={this.state.components[0].namespaces[4].nsAnswers[3]} />{this.state.components[0].namespaces[4].nsAnswers[3]}<br />
          <input type='radio' name='q1' value={this.state.components[0].namespaces[4].nsAnswers[4]} />{this.state.components[0].namespaces[4].nsAnswers[4]}<br />
          <input type='radio' name='q1' value={this.state.components[0].namespaces[4].nsAnswers[5]} />{this.state.components[0].namespaces[4].nsAnswers[5]}
          <div className='per_form_question'>{this.state.components[0].namespaces[4].feedbackTitle}</div>
          <br /><input type='text' name='' /><br /><br />

          <div className='per_form_area'>{this.state.components[1].componentTitle}</div>
          {this.state.components[1].componentDescription}

          <div className='per_form_ns'>{this.state.components[1].namespaces[0].nsTitle}</div>
          <div className='per_form_question'>{this.state.components[1].namespaces[0].nsQuestion}</div>
          <input type='radio' name='q21' value={this.state.components[1].namespaces[0].nsAnswers[0]} /> {this.state.components[1].namespaces[0].nsAnswers[0]}<br />
          <input type='radio' name='q21' value={this.state.components[1].namespaces[0].nsAnswers[1]} /> {this.state.components[1].namespaces[0].nsAnswers[1]}
          <div className='per_form_question'>{this.state.components[1].namespaces[0].feedbackTitle}</div>
          {this.state.components[1].namespaces[0].feedbackDescription}
          <br /><input type='text' name='' /><br /><br />

          <div className='per_form_ns'>{this.state.components[1].namespaces[1].nsTitle}</div>
          <div className='per_form_question'>{this.state.components[1].namespaces[1].nsQuestion}</div>
          <input type='radio' name='q22' value={this.state.components[1].namespaces[1].nsAnswers[0]} /> {this.state.components[1].namespaces[1].nsAnswers[0]}<br />
          <input type='radio' name='q22' value={this.state.components[1].namespaces[1].nsAnswers[1]} /> {this.state.components[1].namespaces[1].nsAnswers[1]}
          <div className='per_form_question'>{this.state.components[1].namespaces[1].feedbackTitle}</div>
          {this.state.components[1].namespaces[1].feedbackDescription}
          <br /><input type='text' name='' /><br /><br />

          <div className='per_form_ns'>{this.state.components[1].namespaces[2].nsTitle}</div>
          <div className='per_form_question'>{this.state.components[1].namespaces[2].nsQuestion}</div>
          <input type='radio' name='q23' value={this.state.components[1].namespaces[2].nsAnswers[0]} /> {this.state.components[1].namespaces[2].nsAnswers[0]}<br />
          <input type='radio' name='q23' value={this.state.components[1].namespaces[2].nsAnswers[1]} /> {this.state.components[1].namespaces[2].nsAnswers[1]}
          <div className='per_form_question'>{this.state.components[1].namespaces[2].feedbackTitle}</div>
          {this.state.components[1].namespaces[2].feedbackDescription}
          <br /><input type='text' name='' /><br /><br />

          <div className='per_form_ns'>{this.state.components[1].namespaces[3].nsTitle}</div>
          <div className='per_form_question'>{this.state.components[1].namespaces[3].nsQuestion}</div>
          <input type='radio' name='q2' value={this.state.components[1].namespaces[3].nsAnswers[0]} /> {this.state.components[1].namespaces[3].nsAnswers[0]}<br />
          <input type='radio' name='q2' value={this.state.components[1].namespaces[3].nsAnswers[1]} /> {this.state.components[1].namespaces[3].nsAnswers[1]}<br />
          <input type='radio' name='q2' value={this.state.components[1].namespaces[3].nsAnswers[2]} /> {this.state.components[1].namespaces[3].nsAnswers[2]}<br />
          <input type='radio' name='q2' value={this.state.components[1].namespaces[3].nsAnswers[3]} /> {this.state.components[1].namespaces[3].nsAnswers[3]}<br />
          <input type='radio' name='q2' value={this.state.components[1].namespaces[3].nsAnswers[4]} /> {this.state.components[1].namespaces[3].nsAnswers[4]}<br />
          <input type='radio' name='q2' value={this.state.components[1].namespaces[3].nsAnswers[5]} /> {this.state.components[1].namespaces[3].nsAnswers[5]}
          <div className='per_form_question'>{this.state.components[1].namespaces[3].feedbackTitle}</div>
          <br /><input type='text' name='' /><br /><br />

          <div className='per_form_area'>{this.state.components[2].componentTitle}</div>
          {this.state.components[2].componentDescription}

          <div className='per_form_ns'>{this.state.components[2].namespaces[0].nsTitle}</div>
          <div className='per_form_question'>{this.state.components[2].namespaces[0].nsQuestion}</div>
          <input type='radio' name='q31' value={this.state.components[2].namespaces[0].nsAnswers[0]} /> {this.state.components[2].namespaces[0].nsAnswers[0]}<br />
          <input type='radio' name='q31' value={this.state.components[2].namespaces[0].nsAnswers[1]} /> {this.state.components[2].namespaces[0].nsAnswers[1]}
          <div className='per_form_question'>{this.state.components[2].namespaces[0].feedbackTitle}</div>
          {this.state.components[2].namespaces[0].feedbackDescription}
          <br /><input type='text' name='' /><br /><br />

          <div className='per_form_ns'>{this.state.components[2].namespaces[1].nsTitle}</div>
          <div className='per_form_question'>{this.state.components[2].namespaces[1].nsQuestion}</div>
          <input type='radio' name='q32' value={this.state.components[2].namespaces[1].nsAnswers[0]} /> {this.state.components[2].namespaces[1].nsAnswers[0]}<br />
          <input type='radio' name='q32' value={this.state.components[2].namespaces[1].nsAnswers[1]} /> {this.state.components[2].namespaces[1].nsAnswers[1]}
          <div className='per_form_question'>{this.state.components[2].namespaces[1].feedbackTitle}</div>
          {this.state.components[2].namespaces[1].feedbackDescription}
          <br /><input type='text' name='' /><br /><br />

          <div className='per_form_ns'>{this.state.components[2].namespaces[2].nsTitle}</div>
          <div className='per_form_question'>{this.state.components[2].namespaces[2].nsQuestion}</div>
          <input type='radio' name='q33' value={this.state.components[2].namespaces[2].nsAnswers[0]} /> {this.state.components[2].namespaces[2].nsAnswers[0]}<br />
          <input type='radio' name='q33' value={this.state.components[2].namespaces[2].nsAnswers[1]} /> {this.state.components[2].namespaces[2].nsAnswers[1]}
          <div className='per_form_question'>{this.state.components[2].namespaces[2].feedbackTitle}</div>
          {this.state.components[2].namespaces[2].feedbackDescription}
          <br /><input type='text' name='' /><br /><br />

          <div className='per_form_ns'>{this.state.components[2].namespaces[3].nsTitle}</div>
          <div className='per_form_question'>{this.state.components[2].namespaces[3].nsQuestion}</div>
          <input type='radio' name='q33' value={this.state.components[2].namespaces[3].nsAnswers[0]} /> {this.state.components[2].namespaces[3].nsAnswers[0]}<br />
          <input type='radio' name='q33' value={this.state.components[2].namespaces[3].nsAnswers[1]} /> {this.state.components[2].namespaces[3].nsAnswers[1]}
          <div className='per_form_question'>{this.state.components[2].namespaces[3].feedbackTitle}</div>
          {this.state.components[2].namespaces[3].feedbackDescription}
          <br /><input type='text' name='' /><br /><br />

          <div className='per_form_ns'>{this.state.components[1].namespaces[3].nsTitle}</div>
          <div className='per_form_question'>{this.state.components[1].namespaces[3].nsQuestion}</div>
          <input type='radio' name='q3' value={this.state.components[1].namespaces[3].nsAnswers[0]} /> {this.state.components[1].namespaces[3].nsAnswers[0]}<br />
          <input type='radio' name='q3' value={this.state.components[1].namespaces[3].nsAnswers[1]} /> {this.state.components[1].namespaces[3].nsAnswers[1]}<br />
          <input type='radio' name='q3' value={this.state.components[1].namespaces[3].nsAnswers[2]} /> {this.state.components[1].namespaces[3].nsAnswers[2]}<br />
          <input type='radio' name='q3' value={this.state.components[1].namespaces[3].nsAnswers[3]} /> {this.state.components[1].namespaces[3].nsAnswers[3]}<br />
          <input type='radio' name='q3' value={this.state.components[1].namespaces[3].nsAnswers[4]} /> {this.state.components[1].namespaces[3].nsAnswers[4]}<br />
          <input type='radio' name='q3' value={this.state.components[1].namespaces[3].nsAnswers[5]} /> {this.state.components[1].namespaces[3].nsAnswers[5]}
          <div className='per_form_question'>{this.state.components[1].namespaces[3].feedbackTitle}</div>
          <br /><input type='text' name='' /><br /><br />

          <div className='per_form_area'>{this.state.components[3].componentTitle}</div>
          {this.state.components[3].componentDescription}

          <div className='per_form_ns'>{this.state.components[3].namespaces[0].nsTitle}</div>
          <div className='per_form_question'>{this.state.components[3].namespaces[0].nsQuestion}</div>
          <input type='radio' name='q41' value={this.state.components[3].namespaces[0].nsAnswers[0]} /> {this.state.components[3].namespaces[0].nsAnswers[0]}<br />
          <input type='radio' name='q41' value={this.state.components[3].namespaces[0].nsAnswers[1]} /> {this.state.components[3].namespaces[0].nsAnswers[1]}
          <div className='per_form_question'>{this.state.components[3].namespaces[0].feedbackTitle}</div>
          {this.state.components[3].namespaces[0].feedbackDescription}
          <br /><input type='text' name='' /><br /><br />

          <div className='per_form_ns'>{this.state.components[3].namespaces[1].nsTitle}</div>
          <div className='per_form_question'>{this.state.components[3].namespaces[1].nsQuestion}</div>
          <input type='radio' name='q42' value={this.state.components[3].namespaces[1].nsAnswers[0]} /> {this.state.components[3].namespaces[1].nsAnswers[0]}<br />
          <input type='radio' name='q42' value={this.state.components[3].namespaces[1].nsAnswers[1]} /> {this.state.components[3].namespaces[1].nsAnswers[1]}
          <div className='per_form_question'>{this.state.components[3].namespaces[1].feedbackTitle}</div>
          {this.state.components[3].namespaces[1].feedbackDescription}
          <br /><input type='text' name='' /><br /><br />

          <div className='per_form_ns'>{this.state.components[3].namespaces[2].nsTitle}</div>
          <div className='per_form_question'>{this.state.components[3].namespaces[2].nsQuestion}</div>
          <input type='radio' name='q43' value={this.state.components[3].namespaces[2].nsAnswers[0]} /> {this.state.components[3].namespaces[2].nsAnswers[0]}<br />
          <input type='radio' name='q43' value={this.state.components[3].namespaces[2].nsAnswers[1]} /> {this.state.components[3].namespaces[2].nsAnswers[1]}
          <div className='per_form_question'>{this.state.components[3].namespaces[2].feedbackTitle}</div>
          {this.state.components[3].namespaces[2].feedbackDescription}
          <br /><input type='text' name='' /><br /><br />

          <div className='per_form_ns'>{this.state.components[3].namespaces[3].nsTitle}</div>
          <div className='per_form_question'>{this.state.components[3].namespaces[3].nsQuestion}</div>
          <input type='radio' name='q44' value={this.state.components[3].namespaces[3].nsAnswers[0]} /> {this.state.components[3].namespaces[3].nsAnswers[0]}<br />
          <input type='radio' name='q44' value={this.state.components[3].namespaces[3].nsAnswers[1]} /> {this.state.components[3].namespaces[3].nsAnswers[1]}
          <div className='per_form_question'>{this.state.components[3].namespaces[3].feedbackTitle}</div>
          {this.state.components[3].namespaces[3].feedbackDescription}
          <br /><input type='text' name='' /><br /><br />

          <div className='per_form_ns'>{this.state.components[3].namespaces[4].nsTitle}</div>
          <div className='per_form_question'>{this.state.components[3].namespaces[4].nsQuestion}</div>
          <input type='radio' name='q45' value={this.state.components[3].namespaces[4].nsAnswers[0]} /> {this.state.components[3].namespaces[4].nsAnswers[0]}<br />
          <input type='radio' name='q45' value={this.state.components[3].namespaces[4].nsAnswers[1]} /> {this.state.components[3].namespaces[4].nsAnswers[1]}
          <div className='per_form_question'>{this.state.components[3].namespaces[4].feedbackTitle}</div>
          {this.state.components[3].namespaces[4].feedbackDescription}
          <br /><input type='text' name='' /><br /><br />

          <div className='per_form_ns'>{this.state.components[3].namespaces[5].nsTitle}</div>
          <div className='per_form_question'>{this.state.components[3].namespaces[5].nsQuestion}</div>
          <input type='radio' name='q4' value={this.state.components[3].namespaces[5].nsAnswers[0]} />{this.state.components[3].namespaces[5].nsAnswers[0]}<br />
          <input type='radio' name='q4' value={this.state.components[3].namespaces[5].nsAnswers[1]} />{this.state.components[3].namespaces[5].nsAnswers[1]}<br />
          <input type='radio' name='q4' value={this.state.components[3].namespaces[5].nsAnswers[2]} />{this.state.components[3].namespaces[5].nsAnswers[2]}<br />
          <input type='radio' name='q4' value={this.state.components[3].namespaces[5].nsAnswers[3]} />{this.state.components[3].namespaces[5].nsAnswers[3]}<br />
          <input type='radio' name='q4' value={this.state.components[3].namespaces[5].nsAnswers[4]} />{this.state.components[3].namespaces[5].nsAnswers[4]}<br />
          <input type='radio' name='q4' value={this.state.components[3].namespaces[5].nsAnswers[5]} />{this.state.components[3].namespaces[5].nsAnswers[5]}
          <div className='per_form_question'>{this.state.components[3].namespaces[5].feedbackTitle}</div>
          <br /><input type='text' name='' /><br /><br />

          <div className='per_form_area'>{this.state.components[4].componentTitle}</div>
          {this.state.components[4].componentDescription}

          <div className='per_form_ns'>{this.state.components[4].namespaces[0].nsTitle}</div>
          <div className='per_form_question'>{this.state.components[4].namespaces[0].nsQuestion}</div>
          <input type='radio' name='q51' value={this.state.components[4].namespaces[0].nsAnswers[0]} /> {this.state.components[4].namespaces[0].nsAnswers[0]}<br />
          <input type='radio' name='q51' value={this.state.components[4].namespaces[0].nsAnswers[1]} /> {this.state.components[4].namespaces[0].nsAnswers[1]}
          <div className='per_form_question'>{this.state.components[4].namespaces[0].feedbackTitle}</div>
          {this.state.components[4].namespaces[0].feedbackDescription}
          <br /><input type='text' name='' /><br /><br />

          <div className='per_form_ns'>{this.state.components[4].namespaces[1].nsTitle}</div>
          <div className='per_form_question'>{this.state.components[4].namespaces[1].nsQuestion}</div>
          <input type='radio' name='q52' value={this.state.components[4].namespaces[1].nsAnswers[0]} /> {this.state.components[4].namespaces[1].nsAnswers[0]}<br />
          <input type='radio' name='q52' value={this.state.components[4].namespaces[1].nsAnswers[1]} /> {this.state.components[4].namespaces[1].nsAnswers[1]}
          <div className='per_form_question'>{this.state.components[4].namespaces[1].feedbackTitle}</div>
          {this.state.components[4].namespaces[1].feedbackDescription}
          <br /><input type='text' name='' /><br /><br />

          <div className='per_form_ns'>{this.state.components[4].namespaces[2].nsTitle}</div>
          <div className='per_form_question'>{this.state.components[4].namespaces[2].nsQuestion}</div>
          <input type='radio' name='q53' value={this.state.components[4].namespaces[2].nsAnswers[0]} /> {this.state.components[4].namespaces[2].nsAnswers[0]}<br />
          <input type='radio' name='q53' value={this.state.components[4].namespaces[2].nsAnswers[1]} /> {this.state.components[4].namespaces[2].nsAnswers[1]}
          <div className='per_form_question'>{this.state.components[4].namespaces[2].feedbackTitle}</div>
          {this.state.components[4].namespaces[2].feedbackDescription}
          <br /><input type='text' name='' /><br /><br />

          <div className='per_form_ns'>{this.state.components[4].namespaces[3].nsTitle}</div>
          <div className='per_form_question'>{this.state.components[4].namespaces[3].nsQuestion}</div>
          <input type='radio' name='q54' value={this.state.components[4].namespaces[3].nsAnswers[0]} /> {this.state.components[4].namespaces[3].nsAnswers[0]}<br />
          <input type='radio' name='q54' value={this.state.components[4].namespaces[3].nsAnswers[1]} /> {this.state.components[4].namespaces[3].nsAnswers[1]}
          <div className='per_form_question'>{this.state.components[4].namespaces[3].feedbackTitle}</div>
          {this.state.components[4].namespaces[3].feedbackDescription}
          <br /><input type='text' name='' /><br /><br />

          <div className='per_form_ns'>{this.state.components[4].namespaces[4].nsTitle}</div>
          <div className='per_form_question'>{this.state.components[4].namespaces[4].nsQuestion}</div>
          <input type='radio' name='q55' value={this.state.components[4].namespaces[4].nsAnswers[0]} /> {this.state.components[4].namespaces[4].nsAnswers[0]}<br />
          <input type='radio' name='q55' value={this.state.components[4].namespaces[4].nsAnswers[1]} /> {this.state.components[4].namespaces[4].nsAnswers[1]}
          <div className='per_form_question'>{this.state.components[4].namespaces[4].feedbackTitle}</div>
          {this.state.components[4].namespaces[4].feedbackDescription}
          <br /><input type='text' name='' /><br /><br />

          <div className='per_form_ns'>{this.state.components[4].namespaces[5].nsTitle}</div>
          <div className='per_form_question'>{this.state.components[4].namespaces[5].nsQuestion}</div>
          <input type='radio' name='q56' value={this.state.components[4].namespaces[5].nsAnswers[0]} /> {this.state.components[4].namespaces[5].nsAnswers[0]}<br />
          <input type='radio' name='q56' value={this.state.components[4].namespaces[5].nsAnswers[1]} /> {this.state.components[4].namespaces[5].nsAnswers[1]}
          <div className='per_form_question'>{this.state.components[4].namespaces[5].feedbackTitle}</div>
          {this.state.components[4].namespaces[5].feedbackDescription}
          <br /><input type='text' name='' /><br /><br />

          <div className='per_form_ns'>{this.state.components[4].namespaces[6].nsTitle}</div>
          <div className='per_form_question'>{this.state.components[4].namespaces[6].nsQuestion}</div>
          <input type='radio' name='q57' value={this.state.components[4].namespaces[6].nsAnswers[0]} /> {this.state.components[4].namespaces[6].nsAnswers[0]}<br />
          <input type='radio' name='q57' value={this.state.components[4].namespaces[6].nsAnswers[1]} /> {this.state.components[4].namespaces[6].nsAnswers[1]}
          <div className='per_form_question'>{this.state.components[4].namespaces[6].feedbackTitle}</div>
          {this.state.components[4].namespaces[6].feedbackDescription}
          <br /><input type='text' name='' /><br /><br />

          <div className='per_form_ns'>{this.state.components[4].namespaces[7].nsTitle}</div>
          <div className='per_form_question'>{this.state.components[4].namespaces[7].nsQuestion}</div>
          <input type='radio' name='q58' value={this.state.components[4].namespaces[7].nsAnswers[0]} /> {this.state.components[4].namespaces[7].nsAnswers[0]}<br />
          <input type='radio' name='q58' value={this.state.components[4].namespaces[7].nsAnswers[1]} /> {this.state.components[4].namespaces[7].nsAnswers[1]}
          <div className='per_form_question'>{this.state.components[4].namespaces[7].feedbackTitle}</div>
          {this.state.components[4].namespaces[7].feedbackDescription}
          <br /><input type='text' name='' /><br /><br />

          <div className='per_form_ns'>{this.state.components[4].namespaces[8].nsTitle}</div>
          <div className='per_form_question'>{this.state.components[4].namespaces[8].nsQuestion}</div>
          <input type='radio' name='q59' value={this.state.components[4].namespaces[8].nsAnswers[0]} /> {this.state.components[4].namespaces[8].nsAnswers[0]}<br />
          <input type='radio' name='q59' value={this.state.components[4].namespaces[8].nsAnswers[1]} /> {this.state.components[4].namespaces[8].nsAnswers[1]}
          <div className='per_form_question'>{this.state.components[4].namespaces[8].feedbackTitle}</div>
          {this.state.components[4].namespaces[8].feedbackDescription}
          <br /><input type='text' name='' /><br /><br />

          <div className='per_form_ns'>{this.state.components[4].namespaces[9].nsTitle}</div>
          <div className='per_form_question'>{this.state.components[4].namespaces[9].nsQuestion}</div>
          <input type='radio' name='q1' value={this.state.components[4].namespaces[9].nsAnswers[0]} />{this.state.components[4].namespaces[9].nsAnswers[0]}<br />
          <input type='radio' name='q1' value={this.state.components[4].namespaces[9].nsAnswers[1]} />{this.state.components[4].namespaces[9].nsAnswers[1]}<br />
          <input type='radio' name='q1' value={this.state.components[4].namespaces[9].nsAnswers[2]} />{this.state.components[4].namespaces[9].nsAnswers[2]}<br />
          <input type='radio' name='q1' value={this.state.components[4].namespaces[9].nsAnswers[3]} />{this.state.components[4].namespaces[9].nsAnswers[3]}<br />
          <input type='radio' name='q1' value={this.state.components[4].namespaces[9].nsAnswers[4]} />{this.state.components[4].namespaces[9].nsAnswers[4]}<br />
          <input type='radio' name='q1' value={this.state.components[4].namespaces[9].nsAnswers[5]} />{this.state.components[4].namespaces[9].nsAnswers[5]}
          <div className='per_form_question'>{this.state.components[4].namespaces[9].feedbackTitle}</div>
          <br /><input type='text' name='' /><br /><br />

          <input type='checkbox' name='' value='' /> Save as Draft<br />
          <button onClick={this.sendForm}>Submit</button>

        </div>
      </div>
    );
  }

  sendForm () {
    const q11 = document.querySelector('input[name="q11"]:checked') !== null ? document.querySelector('input[name="q11"]:checked').value : 0;
    const q12 = document.querySelector('input[name="q12"]:checked') !== null ? document.querySelector('input[name="q12"]:checked').value : 0;
    const q13 = document.querySelector('input[name="q13"]:checked') !== null ? document.querySelector('input[name="q13"]:checked').value : 0;
    const q14 = document.querySelector('input[name="q14"]:checked') !== null ? document.querySelector('input[name="q14"]:checked').value : 0;
    const q1 = document.querySelector('input[name="q1"]:checked') !== null ? document.querySelector('input[name="q1"]:checked').value : 0;
    const q21 = document.querySelector('input[name="q21"]:checked') !== null ? document.querySelector('input[name="q21"]:checked').value : 0;
    const q22 = document.querySelector('input[name="q22"]:checked') !== null ? document.querySelector('input[name="q22"]:checked').value : 0;
    const q23 = document.querySelector('input[name="q23"]:checked') !== null ? document.querySelector('input[name="q23"]:checked').value : 0;
    const q2 = document.querySelector('input[name="q2"]:checked') !== null ? document.querySelector('input[name="q2"]:checked').value : 0;
    const q31 = document.querySelector('input[name="q31"]:checked') !== null ? document.querySelector('input[name="q31"]:checked').value : 0;
    const q32 = document.querySelector('input[name="q32"]:checked') !== null ? document.querySelector('input[name="q32"]:checked').value : 0;
    const q33 = document.querySelector('input[name="q33"]:checked') !== null ? document.querySelector('input[name="q33"]:checked').value : 0;
    const q34 = document.querySelector('input[name="q34"]:checked') !== null ? document.querySelector('input[name="q34"]:checked').value : 0;
    const q3 = document.querySelector('input[name="q3"]:checked') !== null ? document.querySelector('input[name="q3"]:checked').value : 0;
    const q41 = document.querySelector('input[name="q41"]:checked') !== null ? document.querySelector('input[name="q41"]:checked').value : 0;
    const q42 = document.querySelector('input[name="q42"]:checked') !== null ? document.querySelector('input[name="q42"]:checked').value : 0;
    const q43 = document.querySelector('input[name="q43"]:checked') !== null ? document.querySelector('input[name="q43"]:checked').value : 0;
    const q44 = document.querySelector('input[name="q44"]:checked') !== null ? document.querySelector('input[name="q44"]:checked').value : 0;
    const q45 = document.querySelector('input[name="q45"]:checked') !== null ? document.querySelector('input[name="q45"]:checked').value : 0;
    const q4 = document.querySelector('input[name="q4"]:checked') !== null ? document.querySelector('input[name="q4"]:checked').value : 0;
    const q51 = document.querySelector('input[name="q51"]:checked') !== null ? document.querySelector('input[name="q51"]:checked').value : 0;
    const q52 = document.querySelector('input[name="q52"]:checked') !== null ? document.querySelector('input[name="q52"]:checked').value : 0;
    const q53 = document.querySelector('input[name="q53"]:checked') !== null ? document.querySelector('input[name="q53"]:checked').value : 0;
    const q54 = document.querySelector('input[name="q54"]:checked') !== null ? document.querySelector('input[name="q54"]:checked').value : 0;
    const q55 = document.querySelector('input[name="q55"]:checked') !== null ? document.querySelector('input[name="q55"]:checked').value : 0;
    const q56 = document.querySelector('input[name="q56"]:checked') !== null ? document.querySelector('input[name="q56"]:checked').value : 0;
    const q57 = document.querySelector('input[name="q57"]:checked') !== null ? document.querySelector('input[name="q57"]:checked').value : 0;
    const q58 = document.querySelector('input[name="q58"]:checked') !== null ? document.querySelector('input[name="q58"]:checked').value : 0;
    const q59 = document.querySelector('input[name="q59"]:checked') !== null ? document.querySelector('input[name="q59"]:checked').value : 0;
    const q5 = document.querySelector('input[name="q5"]:checked') !== null ? document.querySelector('input[name="q5"]:checked').value : 0;

    const data = JSON.stringify({
      code: 'A1',
      name: 'Nemo',
      language: 1,
      data: [
        {id: '1.1', op: q11, nt: 'no ti'},
        {id: '1.2', op: q12, nt: 'no ti'},
        {id: '1.3', op: q13, nt: 'no ti'},
        {id: '1.4', op: q14, nt: 'no ti'},
        {id: '1', op: q1, nt: 'no ti'},
        {id: '2.1', op: q21, nt: 'no ti'},
        {id: '2.2', op: q22, nt: 'no ti'},
        {id: '2.3', op: q23, nt: 'no ti'},
        {id: '2', op: q2, nt: 'no ti'},
        {id: '3.1', op: q31, nt: 'no ti'},
        {id: '3.2', op: q32, nt: 'no ti'},
        {id: '3.3', op: q33, nt: 'no ti'},
        {id: '3.4', op: q34, nt: 'no ti'},
        {id: '3', op: q3, nt: 'no ti'},
        {id: '4.1', op: q41, nt: 'no ti'},
        {id: '4.2', op: q42, nt: 'no ti'},
        {id: '4.3', op: q43, nt: 'no ti'},
        {id: '4.4', op: q44, nt: 'no ti'},
        {id: '4.5', op: q45, nt: 'no ti'},
        {id: '4', op: q4, nt: 'no ti'},
        {id: '5.1', op: q51, nt: 'no ti'},
        {id: '5.2', op: q52, nt: 'no ti'},
        {id: '5.3', op: q53, nt: 'no ti'},
        {id: '5.4', op: q54, nt: 'no ti'},
        {id: '5.5', op: q55, nt: 'no ti'},
        {id: '5.6', op: q56, nt: 'no ti'},
        {id: '5.7', op: q57, nt: 'no ti'},
        {id: '5.8', op: q58, nt: 'no ti'},
        {id: '5.9', op: q59, nt: 'no ti'},
        {id: '5', op: q5, nt: 'no ti'}
      ]
    });

    fetch('https://dsgocdnapi.azureedge.net/sendperform', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: data
    });
  }
}

export default A1PolicyStrategyForm;

export const englishForm = {
  title: 'WELCOME TO THE PREPAREDNESS FOR EFFECTIVE RESPONSE TOOL',
  areaTitle: 'Area 1: Policy Strategy and Standards',
  areaQuestion: 'Do you want to assess the preparedness of your National Society for Epidemics and pandemics?',
  areaOptions: [
    'yes',
    'no'
  ],
  components: [
    {
      componentTitle: 'Component 1: RC auxiliary role, Mandate and Law',
      componentDescription: 'A constitutional reference to the role of the NS in responding to disasters and crises, which may be legislated or included/ recognized in the National Response System.',
      namespaces: [
        {
          nsTitle: '1.1 NS establishes its auxiliary role to the public authorities through a clear mandate and roles set out in applicable legislation, policies and plans.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '1.2 NS mandate is aligned with RCRC Fundamental Principles.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '1.3 NS mandate is reflected in policy, strategy, plans and procedures. The mandate is disseminated and understood by staff and volunteers.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '1.4 NS promotes IHL to the public authorities and uses humanitarian diplomacy to promote compliance.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: 'Component 1 performance',
          nsQuestion: 'Status:',
          nsAnswers: [
            'Not Reviewed',
            'Does not exist',
            'Partially exists',
            'Need improvements',
            'Exist, could be strengthened',
            'High performance'
          ],
          feedbackTitle: 'Notes related to the component:',
          feedbackDescription: ''
        }
      ]
    },
    {
      componentTitle: 'Component 2: DRM Strategy',
      componentDescription: 'An outline of the overall goal that the NS seeks to achieve in its disaster and crisis response operations. The goal considers: context analysis, ongoing/regular all-hazards risk assessments: it may define the target proportion of affected population that will be reached, and a definition of the areas/sectors where a NS will usually respond during an emergency.',
      namespaces: [
        {
          nsTitle: '2.1 NS DRM strategy reflects the NS mandate, analysis of country context, trends, operational objectives, success indicators.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '2.2 NS DRM strategy is regularly reviewed, reflected in response plan and known by staff and volunteers.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '2.3 NS DRM strategy includes clear engagement with technical sectors and support services to ensure comprehensive response.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: 'Component 2 performance',
          nsQuestion: 'Status:',
          nsAnswers: [
            'Not Reviewed',
            'Does not exist',
            'Partially exists',
            'Need improvements',
            'Exist, could be strengthened',
            'High performance'
          ],
          feedbackTitle: 'Notes related to the component:',
          feedbackDescription: ''
        }
      ]
    },
    {
      componentTitle: 'Component 3: DRM Policy',
      componentDescription: 'Reflects the NS mission, RCRC principles and mandate. It acknowledges other relevant NS policies, and aligns with the government policy (where applicable), incorporating the general rules that the NS will obey in order to achieve something (i.e mandate, strategy, etc.)',
      namespaces: [
        {
          nsTitle: '3.1 NS has its own DRM policy or has adopted the IFRC policy.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '3.2 DRM policy sets out guiding principles and values that guide decision-making on the response approach and actions.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '3.3 DRM policy is inclusive and involves other relevant sectors and services.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '3.4 DRM policy is reflected in response plans, procedures and it is adhered to by staff and volunteers.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: 'Component 3 performance',
          nsQuestion: 'Status:',
          nsAnswers: [
            'Not Reviewed',
            'Does not exist',
            'Partially exists',
            'Need improvements',
            'Exist, could be strengthened',
            'High performance'
          ],
          feedbackTitle: 'Notes related to the component:',
          feedbackDescription: ''
        }
      ]
    },
    {
      componentTitle: 'Component 4: DRM Laws, Advocacy and Dissemination',
      componentDescription: 'Designed to support the NS in improving legal preparedness for disasters and crisis and to promote the use of the IDRL Guidelines in order to reduce human vulnerability.',
      namespaces: [
        {
          nsTitle: '4.1 NS has an IDRL humanitarian diplomacy plan /actions in place based on IFRC\'s IDRL Checklist.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '4.2 NS has identified the relevant legal facilities (i.e. special entitlements and exemptions) in the national legislation.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '4.3 NS has staff trained in IDRL & IHL to act as a focal point in an emergency.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '4.4 NS is advocating the government to enact legislation in line with the Model Act for the Facilitation and Regulation of International Disaster Relief and Initial Recovery Assistance.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '4.5 NS tests and/or tracks IDRL lessons through response operations to guide its future humanitarian diplomacy work.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: 'Component 4 performance',
          nsQuestion: 'Status:',
          nsAnswers: [
            'Not Reviewed',
            'Does not exist',
            'Partially exists',
            'Need improvements',
            'Exist, could be strengthened',
            'High performance'
          ],
          feedbackTitle: 'Notes related to the component:',
          feedbackDescription: ''
        }
      ]
    },
    {
      componentTitle: 'Component 5: Quality and accountability',
      componentDescription: 'Describes the essential elements of principled, accountable, and high-quality humanitarian action. The RCRC Movement provides support to the most vulnerable people in line with the Sphere and CHS standards, Code of Conduct for the RCRC Movement and NGOS in Disaster Relief and the Code for Good Partnership of the RCRC Movement, Gender & Diversity, inclusion and protection, BPI/ Do no harm, context-sensitive analysis, violence prevention, accountability to affected population and disability considerations, Community engagement and accountability (CEA).',
      namespaces: [
        {
          nsTitle: '5.1 NS has mechanisms in place to ensure the affected populations are involved in all stages of the response (including decision making) to ensure assistance is appropriate and meets their needs and priorities.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '5.2 NS has trained CEA focal points at key branches and headquarters.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '5.3 A NS CEA plan is developed and implemented, standard templates are available, and procedures are included in SOPs..',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '5.4 Safe and accessible feedback and complaints mechanisms exists to record, refer or respond, and monitor communities\' concerns and requests regarding the assistance provided or protection issues (including for sexual exploitation and abuse).',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '5.5 NS has adopted the Protection for sexual exploitation and abuse policy in line with the International conference resolution on Sexual and Gender Based Violence.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '5.6 NS adheres to Sphere and the Core Humanitarian Standards (may consider IASC Guidelines for Integrating gender based violence interventions, IASC Guidelines on Including persons with disabilities in humanitarian action) and integrates them into sectorial activities during assessment, planning and response.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '5.7 NS adheres to protection policies to support their protection services (safe spaces for child protection, actions for unaccompanied and separated children, prevention of sexual and gender-based violence, violence prevention, psychosocial support, restoring family links, accessibility of facilities and information) to respond.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '5.8 NS plans and procedures actively minimise potential harmful social, economic and environmental impacts of assistance (do no harm principle).',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '5.9 NS follows the Minimum Standards for Protection, Gender and Inclusion in Emergencies.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: 'Component 5 performance',
          nsQuestion: 'Status:',
          nsAnswers: [
            'Not Reviewed',
            'Does not exist',
            'Partially exists',
            'Need improvements',
            'Exist, could be strengthened',
            'High performance'
          ],
          feedbackTitle: 'Notes related to the component:',
          feedbackDescription: ''
        }
      ]
    }
  ]
};

export const frenchForm = {
  title: 'BIENVENUE DANS L\'OUTIL "PREPARATION POUR UNE INTERVENTION EFFICACE"',
  areaTitle: 'Domaine 1: Stratégie politique et normes',
  areaQuestion: 'Voulez-vous évaluer l\'état de préparation de votre Société Nationale pour les épidémies et les pandémies?',
  areaOptions: [
    'Oui',
    'Non'
  ],
  components: [
    {
      componentTitle: 'Catégorie 1. Rôle auxiliaire, mandat et législation de la CR',
      componentDescription: 'Une référence constitutionnelle au rôle de la SN dans la réponse à des catastrophes et des crises, pouvant être juridique ou incluse/reconnue dans le Système d\'Intervention National.',
      namespaces: [
        {
          nsTitle: '1.1 La SN définit son rôle d\'auxiliaire auprès des autorités publiques à travers des fonctions et des mandats clairs, établis conformément à la législation, aux politiques et aux plans.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises'
        },
        {
          nsTitle: '1.2 Le mandat de la SN est en phase avec les principes fondamentaux de la CRCR.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises'
        },
        {
          nsTitle: '1.3 Le mandat de la SN se reflète dans la politique, la stratégie, les plans et les procédures. Il est compris et diffusé par le personnel et les bénévoles.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises'
        },
        {
          nsTitle: '1.4 La SN a fait la promotion du DHI auprès des autorités et utilise la diplomatie humanitaire pour en promouvoir le respect.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises'
        },
        {
          nsTitle: 'Résumé de la catégorie 1',
          nsQuestion: 'Résumé de la catégorie:',
          nsAnswers: [
            'Pas évalué',
            'N\'existe pas',
            'Existe partiellement',
            'Nécessite une amélioration',
            'Existe, peut être renforcé',
            'Performance élevée'
          ],
          feedbackTitle: 'Notes relatives à la catégorie:',
          feedbackDescription: ''
        }
      ]
    },
    {
      componentTitle: 'Catégorie 2: Stratégie de GRC',
      componentDescription: 'Une ébauche de l\'objectif général que la SN souhaite atteindre dans ses opérations d\'intervention en cas de crises et de catastrophes. L\'objectif prend en compte : une analyse du contexte, des évaluations multi-aléas régulières des risques: qui peuvent définir la proportion cible de population affectée qui sera atteinte, ainsi que la définition des zones/secteurs où la SN intervient habituellement en cas d\'urgence.',
      namespaces: [
        {
          nsTitle: '2.1 La SN fait la promotion du DHI auprès des autorités et utilise la diplomatie humanitaire pour en promouvoir le respect.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '2.2 La stratégie de GRC de la SN correspond au mandat de la SN, à l\'analyse du contexte du pays, aux tendances, aux objectifs opérationnels et aux indicateurs de réussite.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '2.3 La stratégie de GRC de la SN est régulièrement mise à jour, reflétée dans le plan d\'intervention et connue du personnel et des bénévoles.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: 'Résumé de la catégorie 2',
          nsQuestion: 'Résumé de la catégorie:',
          nsAnswers: [
            'Pas évalué',
            'N\'existe pas',
            'Existe partiellement',
            'Nécessite une amélioration',
            'Existe, peut être renforcé',
            'Performance élevée'
          ],
          feedbackTitle: 'Notes relatives à la catégorie:',
          feedbackDescription: ''
        }
      ]
    },
    {
      componentTitle: 'Catégorie 3: Politique de GRC',
      componentDescription: 'Reflète la mission de la SN, les principes et le mandat de la CRCR. Elle prend en considération d\'autres politiques pertinentes de la SN, et s\'aligne sur les politiques gouvernementales (le cas échéant), incluant les règles générales auxquelles la SN obéira afin de mener à bien son mandat, sa stratégie, etc.',
      namespaces: [
        {
          nsTitle: '3.1 La SN dispose de sa propre politique de GRC, ou a adopté la politique de la FICR.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '3.2 La politique de GRC suit des principes directeurs et des valeurs qui guident le processus de prise de décision concernant l\'approche de l\'intervention et les mesures à prendre.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '3.3 La politique de GRC inclut tous les services techniques et d\'appui.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '3.4 La politique de GRC se reflète dans les plans d\'intervention et les procédures. Elle est suivie par le personnel et les bénévoles.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: 'Résumé de la catégorie 3',
          nsQuestion: 'Résumé de la catégorie:',
          nsAnswers: [
            'Pas évalué',
            'N\'existe pas',
            'Existe partiellement',
            'Nécessite une amélioration',
            'Existe, peut être renforcé',
            'Performance élevée'
          ],
          feedbackTitle: 'Notes relatives à la catégorie:',
          feedbackDescription: ''
        }
      ]
    },
    {
      componentTitle: 'Catégorie 4: Réglementations, plaidoyer et dissémination du droit relatif à la gestion des risques des catastrophes',
      componentDescription: 'Conçus pour aider la SN à améliorer sa préparation juridique aux catastrophes et aux crises, et à promouvoir l\'usage des lignes directrices IDRL (droit international relatif aux catastrophes) afin de réduire la vulnérabilité humaine.',
      namespaces: [
        {
          nsTitle: '4.1 La SN a un plan ou des actions de diplomatie humanitaire axé sur le IDRL et basé sur la liste de vérification de la FICR.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '4.2 La SN a identifié les principaux moyens juridiques (droits et exemptions spéciales) dans la législation nationale.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '4.3 La SN compte du personnel formé sur les questions IDRL et DHI, à même d\'intervenir en tant que point focal en cas d\'urgence.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '4.4 La SN encourage le gouvernement à aligner la législation sur la Loi-type relative à la facilitation et à la réglementation des opérations internationales de secours et d\'assistance au relèvement initial en cas de catastrophe.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '4.5 La SN teste et/ou suit les enseignements tirés du IDRL via les opérations d\'urgence pour alimenter ses futures activités de plaidoyer humanitaire.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: 'Résumé de la catégorie 4',
          nsQuestion: 'Résumé de la catégorie:',
          nsAnswers: [
            'Pas évalué',
            'N\'existe pas',
            'Existe partiellement',
            'Nécessite une amélioration',
            'Existe, peut être renforcé',
            'Performance élevée'
          ],
          feedbackTitle: 'Notes relatives à la catégorie:',
          feedbackDescription: ''
        }
      ]
    },
    {
      componentTitle: 'Catégorie 5: Qualité et responsabilité',
      componentDescription: 'Décrit les éléments essentiels d\'une action humanitaire éthique, vérifiable et de haute qualité. Le Mouvement de la CRCR fournit un soutien aux individus les plus vulnérables, conformément aux normes CHS et Sphere, au Code de Conduite du Mouvement CRCR et des ONG pour l\'Intervention d\'Urgence, et au Code de Bon Partenariat du Mouvement de la CRCR, aux problématiques de genre et de diversité, d\'inclusion et de protection, de l\'initiative IMPC/Ne pas nuire, des analyses contextuelles, de la prévention de la violence, de la responsabilité envers les populations affectées, de considérations relatives au handicap, et de la Responsabilité et de l\'Engagement de la Communauté (REC).',
      namespaces: [
        {
          nsTitle: '5.1 Des mécanismes sont mis en place pour permettre l\'implication des populations affectées à toutes les étapes de l\'intervention, y compris lors de la prise de décision, afin de s\'assurer que l\'assistance est adéquate et répond à leurs besoins et priorités.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '5.2 La SN forme ses points focaux REC dans les branches clés ainsi qu\'au siège.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '5.3 Un plan de REC est développé et mis en place par la SN, des modèles standards sont disponibles, et des procédures sont incluses aux PON.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '5.4 Des mécanismes de retour sur expérience et de réclamation sûrs et accessibles permettent d\'enregistrer, de référencer, de répondre et de faire suivre les inquiétudes et demandes des communautés au sujet de l\'assistance fournie ou des problèmes de protection (notamment relatifs à l\'exploitation et aux abus sexuels).',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '5.5 La SN adopte la politique de protection relative à l\'exploitation et aux violences sexuelles, conformément à la résolution de la Conférence Internationale sur les violences sexuelles et envers les femmes.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '5.6 La SN adhère aux Normes Minimales Sphere, aux Directives du CPI (Comité permanent inter-organisations) pour intégrer les interventions relatives aux violences envers les femmes dans l\'action humanitaire, aux directives CPI sur l\'intégration des personnes handicapées dans l\'action humanitaire, et aux Normes Humanitaires Fondamentales dans les activités sectorielles pendant l\'évaluation, la planification, l\'intervention et la révision. Des références sont incluses dans les PON.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '5.7 La SN adhère aux procédures et aux services de protection (lieux sûrs pour la protection des enfants, actions pour les enfants non accompagnés et séparés, prévention des violences sexuelles et liées au genre, prévention des violences, soutien psychosocial, restauration des liens familiaux, accessibilité à des équipements et des informations) et dispose de procédures et de politiques pour soutenir leur application lors des interventions.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '5.8 Les impacts sociaux, économiques et environnementaux potentiellement dangereux découlant des interventions sont minimisés (principe « Do no harm »/ "Ne pas nuire") grâce aux plans et procédures de la NS',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '5.9 La SN possède des indicateurs pour les analyses liées au genre, au handicap et à la diversité et pour des actions d\'évaluation, de planification, d\'intervention et de révision.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: 'Résumé de la catégorie 5',
          nsQuestion: 'Résumé de la catégorie:',
          nsAnswers: [
            'Pas évalué',
            'N\'existe pas',
            'Existe partiellement',
            'Nécessite une amélioration',
            'Existe, peut être renforcé',
            'Performance élevée'
          ],
          feedbackTitle: 'Notes relatives à la catégorie:',
          feedbackDescription: ''
        }
      ]
    }
  ]
};

export const spanishForm = {
  title: 'BIENVENIDOS A LA PREPARACIÓN PARA UNA HERRAMIENTA DE RESPUESTA EFECTIVA',
  areaTitle: 'Area 1: Política, Estrategia y Estándares',
  areaQuestion: '¿Desea evaluar la preparación de su Sociedad Nacional de Epidemias y pandemias?',
  areaOptions: [
    'Si',
    'No'
  ],
  components: [
    {
      componentTitle: 'Componente 1. Rol auxiliar, Mandato y Leyes de la CR',
      componentDescription: 'Una referencia constitucional al papel de la SN en la respuesta a desastres y crisis, el cual podría legislarse o incluirse/reconocerse en el Sistema Nacional de Respuesta.',
      namespaces: [
        {
          nsTitle: '1.1 La SN establece su rol auxiliar a las autoridades públicas a través de funciones y mandatos claros reflejados en legislación, políticas y planes aplicables.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '1.2 El mandato de la SN está alineado con los Principios Fundamentales de la CRMLR.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '1.3 El mandato de la SN se refleja en las políticas, las estrategias, los planes y los procedimientos. El mandato es difundido y entendido por el personal y los voluntarios.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '1.4 La SN ha promovido el DIH con las autoridades, y utiliza la diplomacia humanitaria para promover su cumplimiento.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: 'Resumen del componente 1',
          nsQuestion: 'Resumen del componente:',
          nsAnswers: [
            'No revisado',
            'No existe',
            'Existe parcialmente',
            'Necesita mejoras',
            'Existir, se podría fortalecer.',
            'Alto rendimiento'
          ],
          feedbackTitle: 'Notas relacionadas con el componente.',
          feedbackDescription: ''
        }
      ]
    },
    {
      componentTitle: 'Componente 2. Estrategia de GRD',
      componentDescription: 'Un resumen del objetivo general que la SN busca lograr en sus operaciones de respuesta ante desastres y crisis. El objetivo considera: análisis de contexto, evaluaciones de riesgos en curso / regulares de todo tipo: este podría definir la meta de proporción de población afectada que se alcanzará y una definición de las zonas / sectores donde la SN normalmente responderá durante una emergencia.',
      namespaces: [
        {
          nsTitle: '2.1 La SN ha promovido el DIH ante las autoridades, y utiliza la diplomacia humanitaria para su cumplimiento.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '2.2 La estrategia de GRD de la SN refleja el mandato, el análisis del contexto del país, las tendencias, los objetivos operacionales y los indicadores de éxito de la SN.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '2.3 La estrategia de GRD de la SN es revisada regularmente, y se refleja en el plan de respuesta y es conocida por el personal y los voluntarios.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: 'Resumen del componente 2',
          nsQuestion: 'Resumen del componente:',
          nsAnswers: [
            'No revisado',
            'No existe',
            'Existe parcialmente',
            'Necesita mejoras',
            'Existir, se podría fortalecer.',
            'Alto rendimiento'
          ],
          feedbackTitle: 'Notas relacionadas con el componente.',
          feedbackDescription: ''
        }
      ]
    },
    {
      componentTitle: 'Componente 3. Política de GRD',
      componentDescription: 'Refleja la misión de la SN y los principios y el mandato de la CRMLR. Reconoce otras políticas pertinentes de la SN y se alinea con la política gubernamental (donde sea aplicable), incorporando las reglas generales que la SN obedecerá para lograr algo (es decir, mandato, estrategia, etc.)',
      namespaces: [
        {
          nsTitle: '3.1 La SN tiene su propia política de GRD o ha adoptado la política de la FICR.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '3.2 La política de GRD tiene principios rectores y valores que guían la toma de decisiones acerca del enfoque y las acciones de respuesta.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '3.3 La política de GRD incluye a todos los servicios técnicos y de apoyo.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '3.4 La política de GRD se refleja en los planes y procedimientos de respuesta, y es acatada por el personal y los voluntarios.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: 'Resumen del componente 3',
          nsQuestion: 'Resumen del componente:',
          nsAnswers: [
            'No revisado',
            'No existe',
            'Existe parcialmente',
            'Necesita mejoras',
            'Existir, se podría fortalecer.',
            'Alto rendimiento'
          ],
          feedbackTitle: 'Notas relacionadas con el componente.',
          feedbackDescription: ''
        }
      ]
    },
    {
      componentTitle: 'Componente 4. Leyes, Incidencia y Diseminación de GRD',
      componentDescription: 'Diseñada para ayudar a la SN a mejorar la preparación legal para desastres y crisis, y para promover el uso de las Directrices de las IDRL con el fin de reducir la vulnerabilidad humana.',
      namespaces: [
        {
          nsTitle: '4.1 La SN tiene establecido un plan / acciones de diplomacia humanitaria de IDRL basado en la Lista de Verificación en materia de IDRL de la FICR.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '4.2 La SN ha identificado las principales facilidades legales (es decir, derechos y exenciones especiales) en la legislación nacional.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '4.3 La SN tiene personal capacitado en IDRL y DIH para fungir como puntos focales en una emergencia.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '4.4 La SN aboga ante su gobierno para promulgar legislación acorde con la Ley Modelo para la Facilitación y la Reglamentación de las Operaciones Internacionales de Socorro en Casos de Desastre y Asistencia para la Recuperación Inicial.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '4.5 La SN prueba y o da seguimiento a las lecciones de IDRL a través de operaciones de respuesta, para guiar su esfuerzos futuros de diplomacia humanitaria.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: 'Resumen del componente 4',
          nsQuestion: 'Resumen del componente:',
          nsAnswers: [
            'No revisado',
            'No existe',
            'Existe parcialmente',
            'Necesita mejoras',
            'Existir, se podría fortalecer.',
            'Alto rendimiento'
          ],
          feedbackTitle: 'Notas relacionadas con el componente.',
          feedbackDescription: ''
        }
      ]
    },
    {
      componentTitle: 'Componente 5. Calidad y rendición de cuentas',
      componentDescription: 'Describe los elementos fundamentales de una acción humanitaria con principios, responsable y de alta calidad. El Movimiento de la CRMLR apoya a las personas más vulnerables en línea con los estándares ESFERA y de CHS, el Código de Conducta del Movimiento de la CRMLR y de las ONG para el Socorro en Casos de Desastre y el Código de Buena Cooperación del Movimiento de la CRMLR, Género y Diversidad, inclusión y protección, BPI / principio de No hacer daño, análisis del contexto sensible a los conflictos, prevención de la violencia, rendición de cuentas ante la población afectada y consideraciones sobre las discapacidades, Participación Comunitaria y Rendición de Cuentas (CEA).',
      namespaces: [
        {
          nsTitle: '5.1 La SN tiene establecidos mecanismos que garantizan la participación de las poblaciones afectadas en todas las etapas de la respuesta (incluyendo en la toma de decisiones), para garantizar que la asistencia sea adecuada y que satisfaga sus necesidades y prioridades.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '5.2 La SN tiene puntos focales CEA capacitados en la sede y en las filiales clave.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '5.3 Se desarrolla e implementa un plan CEA para la SN, se dispone de plantillas estándar y se incluyen los procedimientos en los POE.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '5.4 Existen mecanismos de retroalimentación y de quejas seguros y accesibles para registrar, remitir o responder, así como para monitorear, las inquietudes y las solicitudes de las comunidades respecto a la asistencia proporcionada o cuestiones de protección (incluyendo para la explotación y abuso sexual).',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '5.5 La SN ha adoptado la política de protección contra la explotación y el abuso sexual, de conformidad con la resolución de la conferencia internacional sobre Violencia Sexual y de Género.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '5.6 La SN se adhiere a las Normas Mínimas Esfera, a las Directrices del IASC para la integración de intervenciones contra la violencia de género en la acción humanitaria, a las directrices del IASC para la inclusión de personas con discapacidad en la acción humanitaria, y las Normas Humanitarias Fundamentales en las actividades sectoriales durante la evaluación, planificación, respuesta y revisión, y se incluyen referencias en los POE.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '5.7 La SN se adhiere a los procedimientos y servicios de protección (espacios seguros para la protección de niñez, acciones para niños no acompañados y separados, prevención de violencia sexual y de género, prevención de violencia, apoyo psicosocial, restablecimiento de contactos familiares, accesibilidad de instalaciones e información), y cuenta con políticas y procedimientos relacionados para apoyar la aplicación en la respuesta.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '5.8 Los planes y procedimientos de la SN activamente minimizan los posibles efectos sociales, económicos y ambientales perjudiciales que podrían resultar de la asistencia (el principio de no hacer daño).',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '5.9 La SN cuenta con indicadores para análisis y acciones de género, discapacidad y diversidad en la evaluación, la planificación, la respuesta y la revisión.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: 'Resumen del componente 5',
          nsQuestion: 'Resumen del componente:',
          nsAnswers: [
            'No revisado',
            'No existe',
            'Existe parcialmente',
            'Necesita mejoras',
            'Existir, se podría fortalecer.',
            'Alto rendimiento'
          ],
          feedbackTitle: 'Notas relacionadas con el componente.',
          feedbackDescription: ''
        }
      ]
    }
  ]
};

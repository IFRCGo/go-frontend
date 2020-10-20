import React, { useContext } from 'react';
import { connect } from 'react-redux';
import { environment } from '#config';
import { PropTypes as T } from 'prop-types';
import { Link } from 'react-router-dom';
import Translate from '#components/Translate';
import LanguageContext from '#root/languageContext';
import {
  FormInput,
  FormRadioGroup,
  FormError
} from '#components/form-elements/';

function PerFormQuestion ({question}) {
  const { strings } = useContext(LanguageContext);

  return (
    <React.Fragment>
      <h3>{question.question}</h3>
      <FormRadioGroup
        // TODO: translations...
        label=''
        name='status'
        classWrapper='per__form__radio-group'
        options={question.answers.map((answer) => ({ value: answer.id, label: answer.text }))}
        selectedOption='' // TODO: set state? damn...
        onChange=''
      >
        <FormError
          errors={[]}
          property='status'
        />
      </FormRadioGroup>
      <FormInput
        // TODO: translations...
        label='Notes'
        type='text'
        name='startDate'
        id='startDate'
        classWrapper=''
        value=''
        onChange=''
        description=''
      >
        <FormError
          errors={[]}
          property='startDate'
        />
      </FormInput>
    </React.Fragment>
  );
}

if (environment !== 'production') {
    PerFormQuestion.propTypes = {
    question: T.object,
  };
}

const selector = (state, ownProps) => ({});

const dispatcher = (dispatch) => ({});

export default connect(selector, dispatcher)(PerFormQuestion);

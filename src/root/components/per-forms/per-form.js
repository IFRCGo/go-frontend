import React, { useContext, useEffect, useState, useMemo } from 'react';
import { connect } from 'react-redux';
import { environment } from '#config';
import { PropTypes as T } from 'prop-types';
import {
  updatePerForm,
  resetPerState
} from '#actions';
import { formQuestionsSelector } from '#selectors';

import LanguageContext from '#root/languageContext';
import Translate from '#components/Translate';

import Fold from '#components/fold';
import {
  FormInput,
  FormTextarea,
  FormRadioGroup,
  FormError
} from '#components/form-elements/';
import { showAlert } from '#components/system-alerts';

function PerForm (props) {
  const { strings } = useContext(LanguageContext);

  const [title, setTitle] = useState(strings.perdocumentArea);
  const {
    formId,
    formsState,
    formDataState,
    setFormDataState,
    formCommentsState,
    setFormCommentsState,
    editable
  } = props;

  function handleChange (e, question, isRadio, isFormVal = false) {
    if (isFormVal) {
      setFormCommentsState({
        ...formCommentsState,
        [formId]: e.target.value
      });
    } else {
      let modifiedState = formDataState;

      if (isRadio) {
        modifiedState[formId][question.id].selected_answer = e.target.value;
      } else {
        modifiedState[formId][question.id].notes = e.target.value;
      }
      // need to ...spread, otherwise not updating
      setFormDataState({...modifiedState});
    }
  }

  useEffect(() => {
    if (formId && formsState) {
      setTitle(`Area ${formsState[formId].area.area_num} - ${formsState[formId].area.title}`);
    }
  }, [formId, formsState]);

  // Not useMemo because object !== object, it triggers a re-render (props.groupedPerQuestions)
  const groupedQuestionList = (props.groupedPerQuestions && formsState)
    ? props.groupedPerQuestions[formsState[formId].area.area_num]
    : null;

  return (
    <Fold title={title} foldWrapperClass='fold--main' foldTitleClass='margin-reset'>
      <FormTextarea
        label='Comment'
        type='text'
        name={`comment`}
        id={`comment`}
        value={formCommentsState ? formCommentsState[formId] : null}
        onChange={(e) => handleChange(e, null, false, true)}
        description=''
        disabled={!editable}
      >
        <FormError
          errors={[]}
          property={'comments'}
        />
      </FormTextarea>

      { groupedQuestionList
        ? Object.keys(groupedQuestionList).map((compId) => {
        const componentHeader = (
          <div className='per__component__header'>
            <h2>Component {compId}: {groupedQuestionList[compId][0].component.title}</h2>
            <span className='label-secondary'>{groupedQuestionList[compId][0].component.description}</span>
          </div>
        );
        const questions = groupedQuestionList[compId].map((question) => (
          <div key={question.id}>
            <h3>{compId}.{question.question_num} {question.question}</h3>
            <FormRadioGroup
              label=''
              name={`question${question.id}`}
              classWrapper='per__form__radio-group'
              options={question.answers.map((answer) => ({
                value: answer.id.toString(),
                label: answer.text,
                disabled: !editable
              }))}
              selectedOption={formDataState[formId][question.id]?.selected_answer}
              onChange={(e) => handleChange(e, question, true)}
            >
              <FormError
                errors={[]} // TODO: handle errors
                property={`question${question.id}`}
              />
            </FormRadioGroup>
            <FormInput
              label='Notes'
              type='text'
              name={`question${question.id}-note`}
              id={`question${question.id}-note`}
              classWrapper=''
              value={formDataState[formId][question.id]?.notes}
              onChange={(e) => handleChange(e, question, false)}
              description=''
              disabled={!editable}
            >
              <FormError
                errors={[]}
                property={`question${question.id}-note`}
              />
            </FormInput>
          </div>
        ));

        return (
          <React.Fragment key={compId}>
            {componentHeader}
            {questions}
          </React.Fragment>
        );
      }) : null }
    </Fold>
  );
}

if (environment !== 'production') {
  PerForm.propTypes = {
    user: T.object,
    perForm: T.object,
  };
}

const selector = (state, ownProps) => ({
  user: state.user.data,
  perForm: state.perForm,
  groupedPerQuestions: formQuestionsSelector(state)
});

const dispatcher = (dispatch) => ({
  _updatePerForm: (payload) => dispatch(updatePerForm(payload)),
  _resetPerState: () => dispatch(resetPerState()),
});

export default connect(selector, dispatcher)(PerForm);

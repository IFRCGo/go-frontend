import React, { useContext, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { environment } from '#config';
import { PropTypes as T } from 'prop-types';
import {
  updatePerForm,
  resetPerState
} from '#actions';
import { groupedPERQuestionsSelector } from '#selectors';

import LanguageContext from '#root/languageContext';

import Fold from '#components/fold';
import {
  FormInput,
  FormTextarea,
  FormRadioGroup
} from '#components/form-elements/';

function PerForm (props) {
  const { strings } = useContext(LanguageContext);

  const [title, setTitle] = useState(strings.perdocumentArea);

  const [groupedQuestionList, setGroupedQuestionList] = useState();
  const {
    formId,
    formsState,
    formDataState,
    formCommentsState,
    handleChange,
    clearRadio,
    isEpi,
    editable,
    groupedPerQuestions,
    perComponents
  } = props;

  useEffect(() => {
    if (formId && formsState) {
      setTitle(`Area ${formsState[formId].area.area_num} - ${formsState[formId].area.title}`);

    }
  }, [formId, formsState, groupedPerQuestions]);

  useEffect(() => {
    if (formsState && groupedPerQuestions) {
      let perQuestions = groupedPerQuestions['groupedQuestions'][formsState[formId].area.area_num];

      // If EPI benchmark is false remove the EPI questions
      if (isEpi === 'false') {
        for (const [compId, questions] of Object.entries(perQuestions)) {
          perQuestions[compId] = questions.filter(question => !question.is_epi);
        }
      }
      setGroupedQuestionList(perQuestions);
    }
  }, [formsState, groupedPerQuestions, formId, isEpi]);

  let filteredComponents = null;
  if (formsState && !perComponents.fetching && perComponents.fetched && perComponents.data) {
    filteredComponents = perComponents.data.results
      .filter(comp => comp.area.area_num === formsState[formId].area.area_num)
      .sort((a, b) => a.component_num < b.component_num);
  }

  return (
    <Fold title={title} foldWrapperClass='fold--main' foldTitleClass='margin-reset'>
      <FormTextarea
        label='Comment'
        type='text'
        name={`comment`}
        id={`comment`}
        value={formCommentsState ? formCommentsState[formId] : null}
        onChange={handleChange(formId, null, false, true)}
        // description=''
        disabled={!editable}
      />

      { filteredComponents && groupedQuestionList
        ? filteredComponents.map((comp) => {
          const componentHeader = (
            <div className='per__component__header'>
              <h2>Component {comp.component_num}{comp.component_letter}: {comp.title}</h2>
              <span className='label-secondary'>{comp.description}</span>
            </div>
          );

          const questions = groupedQuestionList[comp.id]
            ? groupedQuestionList[comp.id].map((question) => (
              <div key={question.id}>
                <h3>{comp.component_num}.{question.question_num} {question.question}</h3>
                { question.description
                  ? (
                    <span className='rich-text-section' dangerouslySetInnerHTML={{__html: question.description}} />
                  )
                  : null }
                <FormRadioGroup
                  // label=''
                  name={`question${question.id}`}
                  classWrapper='per__form__radio-group'
                  options={question.answers.map((answer) => ({
                    value: answer.id.toString(),
                    label: answer.text,
                    disabled: !editable
                  }))}
                  selectedOption={formDataState[formId][question.id]?.selected_answer}
                  onChange={handleChange(formId, question, true)}
                  children={editable
                    ? (
                      <button
                        type='button'
                        className='per--button--clear-source'
                        title='Clear Entry'
                        onClick={() => clearRadio(formId, question)}
                      >
                      </button>
                    ) : null
                  }
                />
                <FormInput
                  label='Notes'
                  type='text'
                  name={`question${question.id}-note`}
                  id={`question${question.id}-note`}
                  classWrapper=''
                  value={formDataState[formId][question.id]?.notes}
                  onChange={handleChange(formId, question, false)}
                  // description=''
                  disabled={!editable}
                >
                </FormInput>
              </div>
            )) : null;
  
          return (
            <React.Fragment key={comp.id}>
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
  perComponents: state.perComponents,
  groupedPerQuestions: groupedPERQuestionsSelector(state)
});

const dispatcher = (dispatch) => ({
  _updatePerForm: (payload) => dispatch(updatePerForm(payload)),
  _resetPerState: () => dispatch(resetPerState()),
});

export default connect(selector, dispatcher)(PerForm);

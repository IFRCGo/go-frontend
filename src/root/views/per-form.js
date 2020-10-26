import React, { useContext, useEffect, useState, useMemo } from 'react';
import { connect } from 'react-redux';
import { environment } from '#config';
import { PropTypes as T } from 'prop-types';
import { Link } from 'react-router-dom';
import { nsDropdownSelector, formQuestionsSelector } from '#selectors';
import {
  createPerForm,
  getPerAreas,
  getPerQuestions
} from '#actions';

import LanguageContext from '#root/languageContext';
import Translate from '#components/Translate';

import App from './app';
import Fold from '#components/fold';
import BreadCrumb from '#components/breadcrumb';
import { Helmet } from 'react-helmet';
import {
  FormInput,
  FormRadioGroup,
  FormError
} from '#components/form-elements/';
import Select from 'react-select';

function PerForm (props) {
  const [questionsState, setQuestionsState] = useState({});
  const [nsState, setNsState] = useState();
  const { strings } = useContext(LanguageContext);
  const { _createPerForm, _getPerAreas, _getPerQuestions } = props;
  const areaId = props.match.params.area_id;
  const formId = props.match.params.form_id;
  const areaNum = useMemo(() => {
    if (!props.perAreas.fetching && props.perAreas.fetched && props.perAreas.data) {
      return props.perAreas.data.results[0].area_num;
    }
    return null;
  }, [props.perAreas]);

  function changeQuestionsState (e, question, isRadio) {
    let modifiedState = questionsState;
    // Check if radio buttons changed or the note of a question
    if (isRadio) {
      modifiedState[question.id].selectedAnswer = e.target.value;
    } else {
      modifiedState[question.id].notes = e.target.value;
    }
    // need to ...spread, otherwise not updating
    setQuestionsState({...modifiedState});
  }

  function submitForm (e, isDraft) {
    _createPerForm({
      'user_id': props.user.id,
      'country_id': nsState,
      'is_draft': isDraft,
      'area_id': areaId,
      'area_num': areaNum,
      'questions': questionsState
    });
  }

  // TODO: why _getPerQuestions firing 2 times???
  useEffect(() => {
    if (areaId) {
      _getPerAreas(areaId);
    }
  }, [_getPerAreas, areaId]);

  useEffect(() => {
    if (areaNum) {
      // Create Form
      _getPerQuestions(areaNum);
    } else if (formId) {
      // Existing Form
      // TODO: getFormData
    }
  }, [_getPerQuestions, areaNum, formId]);

  const questionList = useMemo(() => {
    if (!props.perQuestions.fetching && props.perQuestions.fetched && props.perQuestions.data) {
      return props.perQuestions.data.results;
    }
    return [];
  }, [props.perQuestions]);
  const groupedQuestionList = useMemo(() => {
    return props.groupedPerQuestions || [];
  }, [props.groupedPerQuestions]);
  const title = useMemo(() => {
    if (!props.perAreas.fetching && props.perAreas.fetched && props.perAreas.data) {
      const res = props.perAreas.data.results[0];
      return `${strings.perdocumentArea} ${res.area_num}: ${res.title}`;
    }
    return strings.perdocumentArea;
  }, [props.perAreas, strings.perdocumentArea]);

  const crumbs = [
    {link: props.location.pathname, name: title},
    {link: '/account', name: strings.breadCrumbAccount},
    {link: '/', name: strings.breadCrumbHome}
  ];

  // Initialize the questionsState from the props
  useEffect(() => {
    if (questionList) {
      let questionDict = {};
      for (const question of questionList) {
        questionDict[question.id] = { selectedAnswer: null, notes: '' };
      }
      setQuestionsState(questionDict);
    }
  }, [questionList]);

  return (
    <App className='page--per-form'>
      <section className='inpage'>
        <Helmet>
          <title>{strings.perFormTitle}</title>
        </Helmet>
        <div className='container-lg'>
          <div className='row flex-sm'>
            <div className='col col-6-sm col-7-mid'>
              <BreadCrumb breadcrumbContainerClass='padding-reset' crumbs={ crumbs } />
            </div>
          </div>
        </div>
        <section className='inpage__body'>
          <div className='inner'>
            <Fold title={title} foldWrapperClass='fold--main' foldTitleClass='margin-reset'>
              <div className='form__group'>
                <label className='form__label'>
                  <Translate stringId='perAccountChooseCountry' />
                </label>
                <Select
                  name='country' // TODO: give name
                  value={nsState}
                  onChange={(e) => setNsState(e.value)}
                  options={props.nsDropdownItems} />
                <FormError
                  errors={[]}
                  property='country'
                />
              </div>
              { areaNum
                ? Object.keys(groupedQuestionList).map((compId) => {
                  const componentHeader = (
                    <div className='per__component__header'>
                      <h2>Component {compId}: {groupedQuestionList[compId][0].component.title}</h2>
                      <span className='label-secondary'>{groupedQuestionList[compId][0].component.description}</span>
                    </div>
                  );
                  // this could be abstracted probably, but maybe makes it harder to follow the logic (?)
                  const questions = groupedQuestionList[compId].map((question) => (
                    <div key={question.id}>
                      <h3>{compId}.{question.question_num} {question.question}</h3>
                      <FormRadioGroup
                        label=''
                        name={`question${question.id}`}
                        classWrapper='per__form__radio-group'
                        options={question.answers.map((answer) => ({ value: answer.id.toString(), label: answer.text }))}
                        selectedOption={questionsState[question.id]?.selectedAnswer}
                        onChange={(e) => changeQuestionsState(e, question, true)}
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
                        value={questionsState[question.id]?.notes}
                        onChange={(e) => changeQuestionsState(e, question, false)}
                        description=''
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
                }) // TODO: construct existing form
                : (<div></div>)
              }

              <button className='button button--medium button--primary-filled per__form__button' onClick={(e) => submitForm(e, false)}>
                <Translate stringId='perFormComponentSubmitForm'/>
              </button>
              <button className='button button--medium button--secondary-filled per__form__button' onClick={(e) => submitForm(e, true)}>
                <Translate stringId='perFormComponentSave'/>
              </button>
            </Fold>
          </div>
        </section>
      </section>
    </App>
  );
}

if (environment !== 'production') {
  PerForm.propTypes = {
    perAreas: T.object,
    perQuestions: T.object,
    groupedPerQuestions: T.object,
    getPerAreas: T.func,
    getPerQuestions: T.func
  };
}

const selector = (state, ownProps) => ({
  user: state.user.data,
  nsDropdownItems: nsDropdownSelector(state),
  perAreas: state.perAreas,
  perQuestions: state.perQuestions,
  groupedPerQuestions: formQuestionsSelector(state)
});

const dispatcher = (dispatch) => ({
  _createPerForm: (payload) => dispatch(createPerForm(payload)),
  _getPerAreas: (...args) => dispatch(getPerAreas(...args)),
  _getPerQuestions: (...args) => dispatch(getPerQuestions(...args))
});

export default connect(selector, dispatcher)(PerForm);

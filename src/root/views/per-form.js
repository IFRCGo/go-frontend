import React, { useContext, useEffect, useState, useMemo } from 'react';
import { connect } from 'react-redux';
import { environment } from '#config';
import { PropTypes as T } from 'prop-types';
import { Link } from 'react-router-dom';
import { nsDropdownSelector, formQuestionsSelector } from '#selectors';
import {
  getPerForm,
  getPerForms,
  createPerForm,
  editPerForm,
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
  const { strings } = useContext(LanguageContext);
  const [questionsState, setQuestionsState] = useState({});
  const [nsState, setNsState] = useState();
  const [areaId, setAreaId] = useState();
  const [areaNum, setAreaNum] = useState();
  const [title, setTitle] = useState(strings.perdocumentArea);
  const {
    _getPerForm,
    _getPerForms,
    _createPerForm,
    _editPerForm,
    _getPerAreas,
    _getPerQuestions
  } = props;
  const areaIdFromPath = props.match.params.area_id;
  const formIdFromPath = props.match.params.form_id;

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
    e.preventDefault();

    if (formIdFromPath) {
      _editPerForm({
        'id': formIdFromPath,
        'user_id': props.user.id,
        'country_id': nsState,
        'is_draft': isDraft,
        'area_id': areaIdFromPath || areaId,
        'area_num': areaNum,
        'questions': questionsState
      });
    } else {
      _createPerForm({
        'user_id': props.user.id,
        'country_id': nsState,
        'is_draft': isDraft,
        'area_id': areaIdFromPath || areaId,
        'area_num': areaNum,
        'questions': questionsState
      });
    }
  }

    // FIXME: _getPerAreas and _getPerQuestions firing 2 times
  useEffect(() => {
    if (areaIdFromPath || areaId) {
      _getPerAreas(areaIdFromPath || areaId);
    }
  }, [_getPerAreas, areaIdFromPath, areaId]);

  useEffect(() => {
    if (areaNum) {
      // Create Form
      _getPerQuestions(areaNum);
    } else if (formIdFromPath) {
      // Edit Form
      _getPerForm(formIdFromPath);
      _getPerForms(formIdFromPath);
    }
  }, [_getPerQuestions, areaNum, _getPerForm, _getPerForms, formIdFromPath]);

  useEffect(() => {
    if (!props.perAreas.fetching && props.perAreas.fetched && props.perAreas.data) {
      const res = props.perAreas.data.results[0];
      setTitle(`${strings.perdocumentArea} ${res.area_num}: ${res.title}`);
      setAreaNum(res.area_num);
    }
  }, [props.perAreas, strings.perdocumentArea]);

  // Use PER Form
  useEffect(() => {
    if (!props.perForm.getPerForms.fetching && props.perForm.getPerForms.fetched && props.perForm.getPerForms.data) {
      const res = props.perForm.getPerForms.data.results[0];
      if (res.area) {
        setAreaNum(res.area.area_num);
        setAreaId(res.area.id);
      }
      if (res.country) {
        setNsState(res.country.id);
      }
    }
  }, [props.perForm.getPerForms]);

  // Use PER FormData
  const formData = useMemo(() => {
    if (!props.perForm.getPerForm.fetching && props.perForm.getPerForm.fetched && props.perForm.getPerForm.data) {
      let questionsDict = {};
      props.perForm.getPerForm.data.results.map((fd) => {
        questionsDict[fd.question_id] = {
          selectedAnswer: fd.selected_answer?.id.toString(),
          notes: fd.notes,
          formDataId: fd.id // not used for anything atm
        };
      });
      setQuestionsState(questionsDict);

      return props.perForm.getPerForm.data.results;
    }
    return [];
  }, [props.perForm.getPerForm]);
  const questionList = useMemo(() => {
    if (!props.perQuestions.fetching && props.perQuestions.fetched && props.perQuestions.data) {
      return props.perQuestions.data.results;
    }

    return [];
  }, [props.perQuestions]);
  const groupedQuestionList = useMemo(() => {
    return props.groupedPerQuestions || [];
  }, [props.groupedPerQuestions]);

  // Initialize the questionsState from the props - for new Forms
  useEffect(() => {
    if (questionList && areaIdFromPath) {
      let questionDict = {};
      for (const question of questionList) {
        questionDict[question.id] = { selectedAnswer: null, notes: '' };
      }
      setQuestionsState(questionDict);
    }
  }, [questionList]);

  const crumbs = [
    {link: props.location.pathname, name: title},
    {link: '/account', name: strings.breadCrumbAccount},
    {link: '/', name: strings.breadCrumbHome}
  ];

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
                  name='country'
                  value={nsState}
                  onChange={(e) => setNsState(e?.value)}
                  options={props.nsDropdownItems} />
                <FormError
                  errors={[]}
                  property='country'
                />
              </div>
              { Object.keys(groupedQuestionList).map((compId) => {
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
              })}

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
    getPerForm: T.func,
    getPerForms: T.func,
    createPerForm: T.func,
    getPerAreas: T.func,
    getPerQuestions: T.func
  };
}

const selector = (state, ownProps) => ({
  user: state.user.data,
  nsDropdownItems: nsDropdownSelector(state),
  perForm: state.perForm,
  perAreas: state.perAreas,
  perQuestions: state.perQuestions,
  groupedPerQuestions: formQuestionsSelector(state)
});

const dispatcher = (dispatch) => ({
  _getPerForm: (...args) => dispatch(getPerForm(...args)),
  _getPerForms: (...args) => dispatch(getPerForms(...args)),
  _createPerForm: (payload) => dispatch(createPerForm(payload)),
  _editPerForm: (payload) => dispatch(editPerForm(payload)),
  _getPerAreas: (...args) => dispatch(getPerAreas(...args)),
  _getPerQuestions: (...args) => dispatch(getPerQuestions(...args))
});

export default connect(selector, dispatcher)(PerForm);

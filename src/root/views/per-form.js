import React, { useContext, useEffect, useState, useMemo } from 'react';
import { connect } from 'react-redux';
import { environment } from '#config';
import { PropTypes as T } from 'prop-types';
import { nsDropdownSelector, formQuestionsSelector } from '#selectors';
import {
  getPerForm,
  getPerForms,
  createPerForm,
  updatePerForm,
  deletePerForm,
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
import { showGlobalLoading, hideGlobalLoading } from '#components/global-loading';

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
    _updatePerForm,
    _deletePerForm,
    _getPerAreas,
    _getPerQuestions
  } = props;
  const areaIdFromPath = props.match.params.area_id; // only present for new forms
  const formIdFromPath = props.match.params.form_id; // only present for existing forms
  const isEdit = !!props.isEdit;
  const isCreate = !!props.isCreate;

  const editable = useMemo(() => {
    let isedi = false;
    if (isCreate) {
      isedi = true;
    } else {
      const pfs = props.perForm.getPerForms;
      if (!pfs.fetching && pfs.fetched && pfs.data) {
        isedi = pfs.data.results[0].is_draft && isEdit;
      }
    }
    return isedi;
  }, [isEdit, isCreate, props.perForm.getPerForms]);

  function changeQuestionsState (e, question, isRadio) {
    let modifiedState = questionsState;

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
      _updatePerForm({
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

  function deleteForm (e) {
    e.preventDefault();
    _deletePerForm(props.perForm.getPerForms.data.results[0].id);
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
    showGlobalLoading();
  }, [_getPerQuestions, areaNum, _getPerForm, _getPerForms, formIdFromPath]);

  useEffect(() => {
    const pa = props.perAreas;
    if (!pa.fetching && pa.fetched && pa.data) {
      const res = pa.data.results[0];
      setTitle(`${strings.perdocumentArea} ${res.area_num}: ${res.title}`);
      setAreaNum(res.area_num);
      hideGlobalLoading();
    }
  }, [props.perAreas, strings.perdocumentArea]);

  // Use PER Form
  useEffect(() => {
    const pfs = props.perForm.getPerForms;
    // FIXME: Needs !areaIdFromPath because revisiting a form has 'GET_PER_FORMS_SUCCESS' (?)
    if (!pfs.fetching && pfs.fetched && pfs.data && !areaIdFromPath) {
      const res = pfs.data.results[0];
      if (res.area) {
        setAreaNum(res.area.area_num);
        setAreaId(res.area.id);
      }
      if (res.country) {
        setNsState(res.country.id);
      }
      hideGlobalLoading();
    }
  }, [props.perForm.getPerForms, areaIdFromPath]);

  // Use PER FormData
  useEffect(() => {
    const pf = props.perForm.getPerForm;
    if (!pf.fetching && pf.fetched && pf.data) {
      let questionsDict = {};
      pf.data.results.forEach((fd) => {
        questionsDict[fd.question_id] = {
          selectedAnswer: fd.selected_answer?.id.toString(),
          notes: fd.notes
        };
      });
      setQuestionsState(questionsDict);
      hideGlobalLoading();
    }
  }, [props.perForm.getPerForm]);
  const questionList = useMemo(() => {
    const pq = props.perQuestions;
    if (!pq.fetching && pq.fetched && pq.data) {
      return pq.data.results;
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
  }, [questionList, areaIdFromPath]);

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
                    options={props.nsDropdownItems}
                    disabled={!editable}
                  />
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
                        options={question.answers.map((answer) => ({
                          value: answer.id.toString(),
                          label: answer.text,
                          disabled: !editable
                        }))}
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
                })}

                { editable
                  ? (
                    <React.Fragment>
                      <h4><Translate stringId='overviewFormDraftInfo' /></h4>
                      <button
                        className='button button--medium button--primary-filled per__form__button'
                        onClick={(e) => submitForm(e, false)}
                      >
                        <Translate stringId='perFormComponentSubmitForm'/>
                      </button>
                      <button
                        className='button button--medium button--secondary-filled per__form__button'
                        onClick={(e) => submitForm(e, true)}
                      >
                        <Translate stringId='perFormComponentSave'/>
                      </button>

                      { formIdFromPath
                        ? (
                          <a
                            className='link-underline per__delete_button'
                            onClick={(e) => deleteForm(e)}
                          >
                            <Translate stringId='perDraftDelete' />
                          </a>
                        )
                        : null}
                    </React.Fragment>
                  )
                  : null }
              </Fold>
            </div>
          </section>
        </div>
      </section>
    </App>
  );
}

if (environment !== 'production') {
  PerForm.propTypes = {
    user: T.object,
    nsDropdownItems: T.array,
    perForm: T.object,
    perAreas: T.object,
    perQuestions: T.object,
    groupedPerQuestions: T.object,
    _getPerForm: T.func,
    _getPerForms: T.func,
    _createPerForm: T.func,
    _updatePerForm: T.func,
    _deletePerForm: T.func,
    _getPerAreas: T.func,
    _getPerQuestions: T.func
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
  _updatePerForm: (payload) => dispatch(updatePerForm(payload)),
  _deletePerForm: (...args) => dispatch(deletePerForm(...args)),
  _getPerAreas: (...args) => dispatch(getPerAreas(...args)),
  _getPerQuestions: (...args) => dispatch(getPerQuestions(...args))
});

export default connect(selector, dispatcher)(PerForm);

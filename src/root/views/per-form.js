import React, { useContext, useEffect, useState, useMemo } from 'react';
import { connect } from 'react-redux';
import { environment } from '#config';
import { PropTypes as T } from 'prop-types';
import { formQuestionsSelector } from '#selectors';
import {
  getPerForm,
  getPerForms,
  updatePerForm,
  resetPerState,
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
  FormTextarea,
  FormRadioGroup,
  FormError
} from '#components/form-elements/';
import { showGlobalLoading, hideGlobalLoading } from '#components/global-loading';
import { showAlert } from '#components/system-alerts';

function PerForm (props) {
  const { strings } = useContext(LanguageContext);
  const [questionsState, setQuestionsState] = useState({});
  const [areaId, setAreaId] = useState();
  const [comment, setComment] = useState();
  const [title, setTitle] = useState(strings.perdocumentArea);
  const {
    _getPerForm,
    _getPerForms,
    _updatePerForm,
    _resetPerState,
    _getPerAreas,
    _getPerQuestions
  } = props;
  const formIdFromPath = props.match.params.form_id; // only present for existing forms
  const isEdit = !!props.isEdit;

  const editable = useMemo(() => {
    let isedi = false;

    const pfs = props.perForm.getPerForms;
    if (!pfs.fetching && pfs.fetched && pfs.data) {
      isedi = !pfs.data.results[0].overview?.is_finalized && isEdit;
    }

    return isedi;
  }, [isEdit, props.perForm.getPerForms]);

  function changeQuestionsState (e, question, isRadio) {
    let modifiedState = questionsState;

    if (isRadio) {
      modifiedState[question.id].selected_answer = e.target.value;
    } else {
      modifiedState[question.id].notes = e.target.value;
    }
    // need to ...spread, otherwise not updating
    setQuestionsState({...modifiedState});
  }

  function submitForm (e) {
    e.preventDefault();

    _updatePerForm({
      'id': formIdFromPath,
      'user_id': props.user.id,
      'questions': questionsState,
      'comment': comment
    });
  }

  // Alert and redirect triggered by update success/error
  useEffect(() => {
    const upf = props.perForm.updatePerForm;
    if (!upf.fetching && upf.fetched && upf.data) {
      if (upf.data.status === 'ok') {
        showAlert('success', <p><Translate stringId="perFormAlertUpdated" /></p>, true, 2000);
        setTimeout(() => props.history.push(`/per-overview/${upf.data.overview_id}/edit`), 2000);
        _resetPerState();
      } else if (upf.error) {
        showAlert('danger', <p><Translate stringId="perFormAlertUpdated" /></p>, true, 2000);
      }
    }
  }, [props.perForm.createPerForm, props.perForm.updatePerForm, _resetPerState, props.history]);

  useEffect(() => {
    if (areaId) {
      _getPerAreas(areaId);
    }
  }, [_getPerAreas, areaId]);

    // FIXME: _getPerForm and _getPerForms firing 2 times
  useEffect(() => {
    if (areaId) {
      _getPerQuestions(areaId);
      showGlobalLoading();
    }

    if (formIdFromPath) {
      // Edit Form
      _getPerForm(formIdFromPath);
      _getPerForms(formIdFromPath);
      showGlobalLoading();
    }
  }, [_getPerQuestions, areaId, _getPerForm, _getPerForms, formIdFromPath]);

  useEffect(() => {
    const pa = props.perAreas;
    if (!pa.fetching && pa.fetched && pa.data) {
      const res = pa.data.results[0];
      setTitle(`${strings.perdocumentArea} ${res.area_num}: ${res.title}`);
      hideGlobalLoading();
    }
  }, [props.perAreas, strings.perdocumentArea]);

  // Use PER Form
  useEffect(() => {
    const pfs = props.perForm.getPerForms;
    if (!pfs.fetching && pfs.fetched && pfs.data) {
      const res = pfs.data.results[0];
      if (res.area) {
        setAreaId(res.area.id);
      }
      setComment(res.comment);
      hideGlobalLoading();
    }
  }, [props.perForm.getPerForms]);

  // Use PER FormData
  useEffect(() => {
    const pf = props.perForm.getPerForm;
    if (!pf.fetching && pf.fetched && pf.data) {
      let questionsDict = {};
      pf.data.results.forEach((fd) => {
        questionsDict[fd.question_id] = {
          selected_answer: fd.selected_answer?.id.toString() || '',
          notes: fd.notes
        };
      });
      setQuestionsState(questionsDict);
      hideGlobalLoading();
    }
  }, [props.perForm.getPerForm]);
  const groupedQuestionList = useMemo(() => {
    return props.groupedPerQuestions || [];
  }, [props.groupedPerQuestions]);

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
                <FormTextarea
                  label='Comment'
                  type='text'
                  name={`comment`}
                  id={`comment`}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  description=''
                  disabled={!editable}
                >
                  <FormError
                    errors={[]}
                    property={'comments'}
                  />
                </FormTextarea>

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
                        selectedOption={questionsState[question.id]?.selected_answer}
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
                        onClick={(e) => submitForm(e)}
                      >
                        <Translate stringId='perFormComponentSave'/>
                      </button>
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
    perForm: T.object,
    perAreas: T.object,
    perQuestions: T.object,
    groupedPerQuestions: T.object,
    _getPerForm: T.func,
    _getPerForms: T.func,
    _updatePerForm: T.func,
    _resetPerState: T.func,
    _getPerAreas: T.func,
    _getPerQuestions: T.func
  };
}

const selector = (state, ownProps) => ({
  user: state.user.data,
  perForm: state.perForm,
  perAreas: state.perAreas,
  perQuestions: state.perQuestions,
  groupedPerQuestions: formQuestionsSelector(state)
});

const dispatcher = (dispatch) => ({
  _getPerForm: (...args) => dispatch(getPerForm(...args)),
  _getPerForms: (...args) => dispatch(getPerForms(...args)),
  _updatePerForm: (payload) => dispatch(updatePerForm(payload)),
  _resetPerState: () => dispatch(resetPerState()),
  _getPerAreas: (...args) => dispatch(getPerAreas(...args)),
  _getPerQuestions: (...args) => dispatch(getPerQuestions(...args))
});

export default connect(selector, dispatcher)(PerForm);

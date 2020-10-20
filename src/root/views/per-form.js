import React, { useContext, useEffect, useState, useMemo } from 'react';
import { connect, useActions } from 'react-redux';
import { environment } from '#config';
import { PropTypes as T } from 'prop-types';
import { Link } from 'react-router-dom';
import { regionsByIdSelector, formQuestionsSelector } from '../selectors';
import { getPerAreas, getPerQuestions, getPerForms } from '#actions';

import LanguageContext from '#root/languageContext';
import Translate from '#components/Translate';

import App from './app';
import Fold from '#components/fold';
import BreadCrumb from '#components/breadcrumb';
import PerFormQuestion from '#components/per-forms/per-form-question';
import { Helmet } from 'react-helmet';

function PerForm (props) {
  const [questionsState, setQuestionsState] = useState({});
  const { strings } = useContext(LanguageContext);
  const { _getPerAreas, _getPerQuestions } = props;
  const areaNum = props.match.params.area_num;
  const formId = props.match.params.form_id;

  useEffect(() => {
    if (areaNum) {
      // Create Form
      _getPerAreas(areaNum);
      _getPerQuestions(areaNum);
    } else if (formId) {
      // Existing Form
      // TODO: getFormData
    }
  }, [_getPerAreas, _getPerQuestions, areaNum, formId]);

  const questionList = useMemo(() => {
    return props.perQuestions || [];
  }, [props.perQuestions]);
  const title = useMemo(() => {
    if (!props.perAreas.fetching && props.perAreas.fetched && props.perAreas.data) {
      const res = props.perAreas.data.results[0];
      return `${strings.perdocumentArea} ${res.area_num}: ${res.title}`;
    }
    return strings.perdocumentArea;
  }, [props.perAreas]);
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
            {/* TODO: fix title */}
            <Fold title={title} foldWrapperClass='fold--main' foldTitleClass='margin-reset'>
              {
                Object.keys(questionList).map((qId) => {
                  return questionList[qId].map((question) => (
                    // TODO: check what to set really
                    <PerFormQuestion onChange={(value) => setQuestionsState({...questionsState, /* here */})} question={question} key={question.id} />
                  ));
                })
              }
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
    getPerAreas: T.func,
    getPerQuestions: T.func
  };
}

const selector = (state, ownProps) => ({
  perAreas: state.perAreas,
  perQuestions: formQuestionsSelector(state),
});

const dispatcher = (dispatch) => ({
  _getPerAreas: (...args) => dispatch(getPerAreas(...args)),
  _getPerQuestions: (...args) => dispatch(getPerQuestions(...args)),
  // _getPerCountries: (...args) => dispatch(getPerCountries(...args)),
  // _getPerForms: (...args) => dispatch(getPerForms(...args)),
  // _getPerOverviewForm: (...args) => dispatch(getPerOverviewForm(...args))
});

export default connect(selector, dispatcher)(PerForm);

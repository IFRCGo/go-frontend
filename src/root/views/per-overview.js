import React, { useContext, useMemo } from 'react';
import { connect } from 'react-redux';
import { environment } from '#config';
import { PropTypes as T } from 'prop-types';
import { Link } from 'react-router-dom';
import { regionsByIdSelector } from '../selectors';

import LanguageContext from '#root/languageContext';
import Translate from '#components/Translate';

import App from './app';
import Fold from '#components/fold';
import BreadCrumb from '#components/breadcrumb';
import { Helmet } from 'react-helmet';

function PerOverview (props) {
  const { strings } = useContext(LanguageContext);
  const { formId, isOverview } = props;
  const title = isOverview ? strings.perdocumentOverview : strings.perdocumentArea;

  const crumbs = [
    // TODO: fix name
    {link: props.location.pathname, name: 'asd'},
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
            <Fold title='Overview' foldWrapperClass='fold--main' foldTitleClass='margin-reset'>
              <div>asd</div>
            </Fold>
          </div>
        </section>
      </section>
    </App>
  );
}

if (environment !== 'production') {
  PerOverview.propTypes = {
    perForms: T.object,
    perAreas: T.object,
    perOverviewForm: T.object,
    regionsById: T.object
  };
}

const selector = (state, ownProps) => ({
  user: state.user,
  perForms: state.perForm.getPerForms,
  perAreas: state.perAreas,
  perOverviewForm: state.perForm.getPerOverviewForm,
  regionsById: regionsByIdSelector(state),
});

const dispatcher = (dispatch) => ({
  // _getPerCountries: (...args) => dispatch(getPerCountries(...args)),
  // _getPerForms: (...args) => dispatch(getPerForms(...args)),
  // _getPerOverviewForm: (...args) => dispatch(getPerOverviewForm(...args))
});

export default connect(selector, dispatcher)(PerOverview);

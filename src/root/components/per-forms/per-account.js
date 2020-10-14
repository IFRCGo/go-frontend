import React, { useState, useEffect, useContext, useMemo } from 'react';
import { connect } from 'react-redux';
// import { PropTypes as T } from 'prop-types';
import { Link } from 'react-router-dom';
// import { environment } from '#config';
import {
  getPerCountries,
  getPerDocuments,
  getPerOverviewFormStrict as getPerOverviewForm
} from '#actions';
// import PerDocuments from './per-documents';
import PerTable from './per-table';

import { regionsByIdSelector } from '../../selectors';

// const RESULT_TYPES = {
//   COUNTRY: 1,
//   CLUSTER: 2,
//   REGION: 3,
//   COUNTRY_OFFICE: 4,
//   REPRESENTATIVE_OFFICE: 5
// };

import LanguageContext from '#root/languageContext';

import Fold from '#components/fold';
import Translate from '#components/Translate';

function PerAccount (props) {
  const { strings } = useContext(LanguageContext);
  const formButtons = [
    {
      link: 'policy-strategy',
      title: strings.perAccountPoliceStrategy,
    },
    {
      link: 'analysis-and-planning',
      title: strings.perAccountAnalysis,
    },
    {
      link: 'operational-capacity',
      title: strings.perAccountOperationalCapacity,
    },
    {
      link: 'operational-capacity-2',
      title: strings.perAccountOperationalCapacity2,
    },
    {
      link: 'coordination',
      title: strings.perAccountCoordination,
    },
    {
      link: 'operations-support',
      title: strings.perAccountSupport,
    }
  ];

  useEffect(() => {
    getPerOverviewForm();
  }, []);

  const [fetching, fetched, formList] = useMemo(() => [
    props.perOverviewForm.fetching,
    props.perOverviewForm.fetched,
    props.perOverviewForm.data,
  ], [props.perOverviewForm]);
  // Convert regions to a more usable format
  const regions = useMemo(() => {
    let regionsDict = {};
    for (const [key, regionArr] of Object.entries(props.regionsById)) {
      regionsDict[regionArr[0].id] = regionArr[0].region_name;
    }
    return regionsDict;
  }, [props.regionsById]);

  // Categorize PER Forms by their Region and Country (regionId: { countries: [forms] })
  const groupedFormList = useMemo(() => {
    let fL = {};
    const formListCount = formList.count || 0;
    if (!fetching && fetched && formListCount > 0 && regions) {
      for (const form of formList.results) {
        if (form.country) {
          if (form.country.region in fL === false) {
            fL[form.country.region] = {};
          }
          if (form.country in fL[form.country.region] === false) {
            fL[form.country.region][form.country.name] = [];
          }
          fL[form.country.region][form.country.name].push(form); 
        }
      }
    }
    return fL;
  }, [fetching, fetched, formList, regions]);

  return (
    // FIXME: <Translate stringId='perAccountTitle'/>
    <Fold title='New PER Forms' foldWrapperClass='fold--main' foldTitleClass='margin-reset'>
      <p>
        <Translate stringId='perAccountDescription'/>
      </p>
      <div className='text-center'>
        <Link
          to={`/per-forms/overview/`}
          className='button button--medium button--secondary-bounded'
        >
          <Translate stringId='perAccountOverview'/>
        </Link>
      </div>
      <div className='row flex-xs'>
        {formButtons.map(button => (
          <div key={button.title} className='per__form__col col col-6-xs col-4-mid'>
            <Link
              to={`/per-forms/${button.link}/`}
              className='button button--medium button--secondary-bounded'
            >
              {button.title}
            </Link>
          </div>
        ))}
      </div>
      {}
      {Object.keys(groupedFormList).map((regionId, index) => (
        <Fold
          showHeader={true}
          title={regions[regionId]}
          id={regionId}
          // navLink={this.props.foldLink}
          foldTitleClass='fold__title--inline'
          foldWrapperClass='fold--main fold--per-table'
        >
          <PerTable regionId={regionId} countries={groupedFormList[regionId]} />
        </Fold>
      ))}
    </Fold>
  );
}

const selector = (state, ownProps) => ({
  user: state.user,
  // perForm: state.perForm,
  perOverviewForm: state.perForm.getPerOverviewForm,
  regionsById: regionsByIdSelector(state),
});

const dispatcher = (dispatch) => ({
  // _getPerCountries: (...args) => dispatch(getPerCountries(...args)),
  // _getPerDocuments: (...args) => dispatch(getPerDocuments(...args)),
  _getPerOverviewForm: (...args) => dispatch(getPerOverviewForm(...args))
});

export default connect(selector, dispatcher)(PerAccount);

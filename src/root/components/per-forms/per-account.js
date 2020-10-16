import React, { useContext, useMemo } from 'react';
import { connect } from 'react-redux';
import { environment } from '#config';
import { PropTypes as T } from 'prop-types';
import { Link } from 'react-router-dom';
import { regionsByIdSelector } from '../../selectors';

import LanguageContext from '#root/languageContext';
import Translate from '#components/Translate';

import PerTable from './per-table';
import Fold from '#components/fold';

function PerAccount (props) {
  const { strings } = useContext(LanguageContext);

  const formButtons = useMemo(() => {
    let sortedAreas = [];
    if (!props.perAreas.fetching && props.perAreas.fetched && props.perAreas.data) {
      sortedAreas = props.perAreas.data.results.sort(
        (a,b) => (a.area_num > b.area_num) ? 1 : ((b.area_num > a.area_num) ? -1 : 0)
      );
    }
    // TODO: make links like '/per-form/<area_num> (or ID)
    return sortedAreas.map(area => ({
      link: `/per-form/create/${area.area_num}`,
      title: `${strings.perdocumentArea} ${area.area_num}: ${area.title}`
    }));
  }, [props.perAreas, strings.perdocumentArea]);

  // PER Overviews vars
  const [ovFetching, ovFetched, overviewFormList] = useMemo(() => [
    props.perOverviewForm.fetching,
    props.perOverviewForm.fetched,
    props.perOverviewForm.data,
  ], [props.perOverviewForm]);
  // PER Forms vars
  const [formsFetching, formsFetched, formList] = useMemo(() => [
    props.perForms.fetching,
    props.perForms.fetched,
    props.perForms.data
  ], [props.perForms]);
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
    // Overviews
    const ovFLCount = overviewFormList.count || 0;
    if (!ovFetching && ovFetched && ovFLCount > 0 && regions) {
      for (const form of overviewFormList.results) {
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
    // Forms
    const fLCount = formList.count || 0;
    if (!formsFetching && formsFetched && fLCount > 0 && regions) {
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

    // Sort the Country names (properties, thus why the ugly code, re-construct the 'dictionary')
    let sortedFormList = fL;
    for (const [key, regionObj] of Object.entries(fL)) {
      let countriesDict = {};
      const countriesArray = Object.entries(regionObj).sort();
      for (const country of countriesArray) {
        // Ex. ["Hungary", [...forms]]
        countriesDict[country[0]] = country[1];
      }

      sortedFormList[key] = countriesDict;
    }

    return sortedFormList;
  }, [ovFetching, ovFetched, overviewFormList, formsFetching, formsFetched, formList, regions]);

  // TODO: show loading while Overviews and Forms are still loading

  return (
    // FIXME: <Translate stringId='perAccountTitle'/>
    <Fold title='New PER Forms' foldWrapperClass='fold--main' foldTitleClass='margin-reset'>
      <p>
        <Translate stringId='perAccountDescription'/>
      </p>
      <div className='text-center'>
        <Link
          to={`/per-form/overview/create`}
          className='button button--medium button--secondary-bounded'
        >
          <Translate stringId='perAccountOverview'/>
        </Link>
      </div>
      <div className='row flex-xs'>
        {formButtons.map(button => (
          <div key={button.title} className='per__form__col col col-6-xs col-4-mid'>
            <Link
              to={button.link}
              className='button button--medium button--secondary-bounded'
            >
              {button.title}
            </Link>
          </div>
        ))}
      </div>
      {Object.keys(groupedFormList).map((regionId, index) => (
        <Fold
          key={regionId}
          showHeader={true}
          title={regions[regionId]}
          id={regionId}
          foldTitleClass='fold__title--inline'
          foldWrapperClass='fold--main fold--per-table'
        >
          <PerTable key={regionId} regionId={regionId} countries={groupedFormList[regionId]} />
        </Fold>
      ))}
    </Fold>
  );
}

if (environment !== 'production') {
  PerAccount.propTypes = {
    perForms: T.object,
    perAreas: T.object,
    perOverviewForm: T.object,
    regionsById: T.object
  };
}

const selector = (state, ownProps) => ({
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

export default connect(selector, dispatcher)(PerAccount);

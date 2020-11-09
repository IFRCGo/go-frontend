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

  // PER Overviews variables
  const [ovFetching, ovFetched, overviewFormList] = useMemo(() => [
    props.perOverviewForm.fetching,
    props.perOverviewForm.fetched,
    props.perOverviewForm.data,
  ], [props.perOverviewForm]);
  // Convert regions to a more usable format
  const regions = useMemo(() => {
    let regionsDict = {};
    for (const [regionArr] of Object.entries(props.regionsById)) {
      regionsDict[regionArr[0].id] = regionArr[0].region_name;
    }
    return regionsDict;
  }, [props.regionsById]);

  // Categorize PER Forms by their Region and Country (regionId: { countries: [forms] })
  const groupedFormList = useMemo(() => {
    let fL = {};
    // PER Overviews array
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

    // TODO: since we don't need the Forms out here this might be easier to handle above
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
  }, [regions, ovFetching, ovFetched, overviewFormList]); //, formsFetching, formsFetched, formList]);

  return (
    // FIXME: <Translate stringId='perAccountTitle'/>
    <Fold title='Create new PER Forms' foldWrapperClass='fold--main' foldTitleClass='margin-reset'>
      <p>
        <Translate stringId='perAccountDescription'/>
      </p>
      <div className='text-center'>
        <Link
          to={`/per-overview/create`}
          className='button button--medium button--secondary-bounded'
        >
          <Translate stringId='perAccountOverview'/>
        </Link>
      </div>
      { Object.keys(groupedFormList).map((regionId, index) => (
        <Fold
          key={regionId}
          showHeader={true}
          title={regions[regionId]}
          id={regionId}
          foldTitleClass='fold__title--inline'
          foldWrapperClass='fold--main fold--per-table'
        >
          {/* FIXME: react still cries about a key here... */}
          <PerTable key={regionId} regionId={regionId} countries={groupedFormList[regionId]} />
        </Fold>
      ))}
    </Fold>
  );
}

if (environment !== 'production') {
  PerAccount.propTypes = {
    perAreas: T.object, // TODO: remove probably
    perOverviewForm: T.object,
    regionsById: T.object
  };
}

const selector = (state, ownProps) => ({
  perAreas: state.perAreas, // TODO: remove probably
  perOverviewForm: state.perForm.getPerOverviewForm,
  regionsById: regionsByIdSelector(state),
});

const dispatcher = (dispatch) => ({
  // TODO: not sure if this is needed, everything is dispatched by the main Account page
});

export default connect(selector, dispatcher)(PerAccount);

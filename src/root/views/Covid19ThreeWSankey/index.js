import React from 'react';
import { connect } from 'react-redux';
import _cs from 'classnames';

import BlockLoading from '../../components/block-loading';
import ThreeWSankey from '../../components/ThreeWSankey';
import {
  getNationalSocietyActivities as getNationalSocietyActivitiesAction,
  getNationalSocietyActivitiesWoFilters as getNationalSocietyActivitiesWoFiltersAction,
} from '../../actions';

import {
  nationalSocietyActivitiesSelector,
  nationalSocietyActivitiesWoFiltersSelector,
} from '../../selectors';

import { getDataFromResponse } from '../../utils/request';
import Filters from './Filters';
import styles from './styles.module.scss';

function Covid19ThreeWSankey (p) {
  const {
    nationalSocietyActivitiesResponse,
    nationalSocietyActivitiesWoFiltersResponse,
    getNationalSocietyActivities,
    getNationalSocietyActivitiesWoFilters,
    className,
  } = p;

  const [nsActivityFilters, setNSActivityFilters] = React.useState({
    reporting_ns: [],
    primary_sector: [],
    project_country: [],
  });

  React.useEffect(() => {
    const filters = {
      secondary_sectors: 13,  // covid-19
      exclude_within: true,
    };
    getNationalSocietyActivitiesWoFilters(undefined, filters);
  }, [getNationalSocietyActivitiesWoFilters]);

  React.useEffect(() => {
    const filters = {
      secondary_sectors: 13,  // covid-19
      exclude_within: true,
      ...nsActivityFilters,
    };
    getNationalSocietyActivities(undefined, filters);
  }, [nsActivityFilters, getNationalSocietyActivities]);

  const [
    nationalSocietyActivities,
    nationalSocietyActivitiesPending,
  ] = React.useMemo(() => ([
    getDataFromResponse(nationalSocietyActivitiesResponse),
    nationalSocietyActivitiesResponse.fetching,
  ]), [nationalSocietyActivitiesResponse]);

  const [
    nationalSocietyActivitiesWoFilters,
    // nationalSocietyActivitiesWoFiltersPending,
  ] = React.useMemo(() => ([
    getDataFromResponse(nationalSocietyActivitiesWoFiltersResponse),
    nationalSocietyActivitiesWoFiltersResponse.fetching,
  ]), [nationalSocietyActivitiesWoFiltersResponse]);

  return (
    <div className={_cs(className, styles.covid19ThreeWSankey)}>
      <div className={styles.header}>
        <h3 className={styles.heading}>
          Movement COVID-19 Response - National Society Who does What Where (3w)
        </h3>
        <div className={styles.description}>
          The Sankey chart below depicts the flow of National Society support. On the left are the National Societies providing the support, in the middle are the sectors and on the right are the countries where the projects are taking place. The thickness of the lines represents the number of projects.
        </div>
      </div>
      <Filters
        value={nsActivityFilters}
        data={nationalSocietyActivitiesWoFilters}
        onChange={setNSActivityFilters}
      />
      { nationalSocietyActivitiesPending ? (
        <BlockLoading />
      ) : (
        <ThreeWSankey className={styles.chart} data={nationalSocietyActivities} />
      )}
    </div>
  );
}

const mapStateToProps = (state) => ({
  nationalSocietyActivitiesResponse: nationalSocietyActivitiesSelector(state),
  nationalSocietyActivitiesWoFiltersResponse: nationalSocietyActivitiesWoFiltersSelector(state),
});

const mapDispatchToProps = (dispatch) => ({
  getNationalSocietyActivities: (...args) => dispatch(getNationalSocietyActivitiesAction(...args)),
  getNationalSocietyActivitiesWoFilters: (...args) => dispatch(getNationalSocietyActivitiesWoFiltersAction(...args)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(React.memo(Covid19ThreeWSankey));

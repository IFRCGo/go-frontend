import React from 'react';
import { connect } from 'react-redux';
import _cs from 'classnames';

import { getCountryOverview as getCountryOverviewAction } from '#actions';
import { countryOverviewSelector } from '#selectors';

import BlockLoading from '#components/block-loading';
import { countryIsoMapById } from '#utils/field-report-constants';

import KeyIndicators from './KeyIndicators';
import NSIndicators from './NSIndicators';

import PopulationMap from './PopulationMap';
import ClimateChart from './ClimateChart';
import SocialEvents from './SocialEvents';
import KeyClimateEvents from './KeyClimateEvents';
import SeasonalCalendar from './SeasonalCalendar';
import KeyDocuments from './KeyDocuments';
import ExternalSources from './ExternalSources';

import styles from './styles.module.scss';

class CountryOverview extends React.PureComponent {
  componentDidMount () {
    const {
      getCountryOverview,
      countryId,
    } = this.props;

    if (!countryId || !getCountryOverview) {
      return;
    }

    const currentCountryIso = countryIsoMapById[countryId];

    getCountryOverview(currentCountryIso);
  }

  render () {
    const {
      countryOverview,
      countryId,
      className,
    } = this.props;

    const {
      data,
      fetching,
    } = countryOverview;

    if (fetching) {
      return <BlockLoading />;
    }

    if (Object.keys(data).length === 0) {
      return (
        <div className={_cs(styles.countryOverview, className)}>
          Not enough data to show the overview
        </div>
      );
    }

    return (
      <div className={_cs(styles.countryOverview, className)}>
        <section className={styles.topSection}>
          <KeyIndicators
            className={styles.keyIndicators}
            population={data.population}
            urbanPopulation={data.urban_population}
            gdp={data.gdp}
            gnipc={data.gnipc}
            poverty={data.poverty}
            lifeExpectancy={data.life_expectancy}
            literacy={data.literacy}
          />
          <NSIndicators
            className={styles.nsIndicators}
            income={data.income}
            expenditures={data.expenditures}
            volunteers={data.volunteers}
            trainedInFirstAid={data.trained_in_first_aid}
          />
        </section>
        <div className={styles.populationAndClimateSection}>
          <PopulationMap
            countryId={countryId}
            className={styles.populationMap}
            data={data.wb_population}
          />
          <ClimateChart
            className={styles.climateChart}
            yearlyEvents={data.climate_events}
          />
        </div>
        <div className={styles.keyClimateEventsAndDatesSection}>
          <KeyClimateEvents
            className={styles.keyClimateEvents}
            averageTemperature={data.avg_temperature}
            averageRainfallPrecipitation={data.avg_rainfall_precipitation}
            rainySeasonStatus={data.rainy_season_display}
          />
          <SocialEvents
            className={styles.socialEvents}
            data={data.social_events}
          />
        </div>
        <SeasonalCalendar
          className='seasonal-calender'
          appeals={data.appeals}
          data={data.seasonal_calender}
        />
        <KeyDocuments
          className={styles.keyDocuments}
          data={data.key_documents}
        />
        <ExternalSources
          className={styles.externalSources}
          data={data.external_sources}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  countryOverview: countryOverviewSelector(state),
});

const mapDispatchToProps = (dispatch) => ({
  getCountryOverview: (...args) => dispatch(getCountryOverviewAction(...args)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CountryOverview);

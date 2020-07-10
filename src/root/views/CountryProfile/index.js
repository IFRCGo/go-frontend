import React from 'react';
import { connect } from 'react-redux';
import _cs from 'classnames';

import { getCountryOverview as getCountryOverviewAction } from '#actions';
import { countryOverviewSelector } from '#selectors';

import BlockLoading from '#components/block-loading';
import { countryIsoMapById } from '#utils/field-report-constants';

import KeyIndicators from './KeyIndicators';
import NSIndicators from './NSIndicators';

import PastOperation from './PastOperation';
import PopulationMap from './PopulationMap';
import ClimateChart from './ClimateChart';
import SocialEvents from './SocialEvents';
import KeyClimateEvents from './KeyClimateEvents';
import SeasonalCalendar from './SeasonalCalendar';
import InformIndicators from './InformIndicators';
import Translate from '#components/Translate';

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
        <div className='top-section'>
          <KeyIndicators
            className='key-indicators'
            population={data.population}
            urbanPopulation={data.urban_population}
            gdp={data.gdp}
            gnipc={data.gnipc}
            poverty={data.poverty}
            lifeExpectancy={data.life_expectancy}
            literacy={data.literacy}
          />
          <NSIndicators
            className='ns-indicators'
            income={data.income}
            expenditures={data.expenditures}
            volunteers={data.volunteers}
            trainedInFirstAid={data.trained_in_first_aid}
          />
          <div className='tc-data-source'>
            <div className='tc-label'>
              <Translate stringId='countryOverviewSource' />
            </div>
            <div className='tc-value'>
              <Translate stringId='countryOverviewFDRS' />
            </div>
          </div>
        </div>
        <div className='population-and-climate-section'>
          <PopulationMap
            countryId={countryId}
            className='population-map'
            data={data.wb_population}
          />
          <ClimateChart
            className='climate-chart'
            yearlyEvents={data.climate_events}
          />
        </div>
        <div className='middle-section'>
          <KeyClimateEvents
            averageTemperature={data.avg_temperature}
            averageRainfallPrecipitation={data.avg_rainfall_precipitation}
            rainySeasonStatus={data.rainy_season_display}
          />
          <SocialEvents
            className='social-events'
            data={data.social_events}
          />
        </div>
        <PastOperation
          countryId={data.country}
          appeals={data.appeals}
          ftsData={data.fts_data}
          startNetworkData={data.start_network_data}
          data={data.appeals}
          className='past-operations'
        />
        <SeasonalCalendar
          className='seasonal-calender'
          appeals={data.appeals}
          data={data.seasonal_calender}
        />
        <InformIndicators
          className='inform-indicators'
          data={data.inform_indicators}
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

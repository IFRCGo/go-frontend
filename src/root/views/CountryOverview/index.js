import React from 'react';
import { connect } from 'react-redux';

import { getCountryOverview as getCountryOverviewAction } from '../../actions';
import { countryOverviewSelector } from '../../selectors';

import { countryIsoMapById } from '../../utils/field-report-constants';

import KeyIndicators from './KeyIndicators';
import NSIndicators from './NSIndicators';

import PastOperation from './PastOperation';
import PopulationMap from './PopulationMap';
import ClimateChart from './ClimateChart';
import SocialEvents from './SocialEvents';
import PastCrisesEvents from './PastCrisesEvents';
import PastEpidemics from './PastEpidemics';
import SeasonalCalendar from './SeasonalCalendar';
import InformIndicators from './InformIndicators';

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
    } = this.props;

    const {
      data,
      fetched,
    } = countryOverview;

    if (!fetched || Object.keys(data).length === 0) {
      return null;
    }

    return (
      <div className='country-overview'>
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
              Source:
            </div>
            <div className='tc-value'>
              FDRS
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
            averageTemperature={data.avg_temperature}
            averageRainfallPrecipitation={data.avg_rainfall_precipitation}
            rainySeasonStatus={data.rainy_season_display}
          />
        </div>
        <div className='middle-section'>
          <SocialEvents
            className='social-events'
            data={data.social_events}
          />
          <PastCrisesEvents
            conflictEventCount={data.past_crises_events_count}
            events={data.past_crises_events}
            className='past-crises-events'
          />
          <PastEpidemics
            className='past-epidemics'
            events={data.past_epidemics}
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

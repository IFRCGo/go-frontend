import React, { useContext, useMemo, useState } from 'react';
import Container from '#components/Container';
import ImminnetEvent from './ImminentEvent';
import SeasonalRisk from './SeasonalRisk';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import languageContext from '#root/languageContext';
import TabContent from '#components/tab-content';
import { FilterValue } from './SeasonalRisk/Filter';

function RiskWatch() {

  const [filters, setFilters] = React.useState<FilterValue>({
    reporting_ns: [],
    programme_type: [],
    primary_sector: [],
    secondary_sectors: [],
  });
  const { strings } = useContext(languageContext);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const getTabDetails = useMemo(() => ([
    { title: strings.riskModuleSeasonalRiskByMonth, hash: '#seasonalbymonth' },
    { title: strings.riskModuleImminent, hash: '#imminent' }
  ]), [strings]);

  const tabHashArray = getTabDetails.map(({ hash }) => hash);

  const handleTabChange = (index: number) => {
    setSelectedIndex(index);
    // const tabHashArray = getTabDetails.map(({ hash }) => hash);
    // const url = props.location.pathname;
    // this.props.history.replace(`${url}${tabHashArray[index]}`);
  };

  return (
    <>
      <Container>
        <Tabs
          selectedIndex={selectedIndex}
          onSelect={(index: number) => handleTabChange(index)}
        >
          <TabList>
            {getTabDetails.map(tab => (
              <Tab name={tab.hash} key={tab.title}>{tab.title}</Tab>
            ))}
          </TabList>
          <TabPanel name="map">
            <TabContent title="Maps">
              <ImminnetEvent />
            </TabContent>
          </TabPanel>
          <TabPanel name="filters">
            <TabContent title="Filters">
              <SeasonalRisk />
            </TabContent>
          </TabPanel>
        </Tabs>
      </Container>
    </>
  );
}

export default RiskWatch;
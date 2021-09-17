import React, { useContext, useMemo } from 'react';
import Container from '#components/Container';
import Filters, { FilterValue } from './Filter';
import RiskMap from './Map';

function SeasonalRisk() {

  const [filters, setFilters] = React.useState<FilterValue>({
    reporting_ns: [],
    programme_type: [],
    primary_sector: [],
    secondary_sectors: [],
  });

  return (
    <Container>
        <Filters
          disabled={false}
          value={filters}
          onChange={setFilters} />
        <RiskMap />
    </Container>
  );
}

export default SeasonalRisk;
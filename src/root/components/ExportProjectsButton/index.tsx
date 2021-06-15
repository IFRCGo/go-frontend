import React, { useMemo } from 'react';

import {
  Project,
  Country,
} from '#types';
import useReduxState, { ReduxResponse, OldListResponse } from '#hooks/useReduxState';
import ExportTableButton, { Props as ExportTableButtonProps } from '#components/ExportTableButton';

interface Props<N> extends Omit<ExportTableButtonProps<Project, N>, 'apiUrl' | 'transformItem' | 'urlOptions'> {
  apiUrl?: string;
  className?: string;
  countryId?: number;
  isNationalSociety?: boolean;
}

const projectDataMap = (d: Project) => ({
  'Country': d.project_country_detail?.name,
  'Region': d.project_districts_detail?.map((dis) => dis.name)?.join(', '),
  'Reporting NS': d.reporting_ns_detail?.name,
  'Operation Type': d.operation_type_display,
  'Programme Type': d.programme_type_display,
  'Disaster Type': d.dtype_detail?.name,
  'Project Name': d.name,
  'Primary Sector': d.primary_sector_display,
  'Tags': d.secondary_sectors_display?.join(', '),
  'Start Date': d.start_date,
  'End Date': d.end_date,
  'Budget (CHF)': d.budget_amount,
  'Status': d.status_display,
  'Targeted Males': d.target_male,
  'Targeted Females': d.target_female,
  'Targeted Others': d.target_other,
  'Targeted Total': d.target_total,
  'Reached Males': d.reached_male,
  'Reached Females': d.reached_female,
  'Reached Others': d.reached_other,
  'Reached Total': d.reached_total,
});

function ExportProjectsButton<N>(props: Props<N>) {
  const {
    apiUrl = '/api/v2/project/',
    countryId,
    isNationalSociety,
    ...otherProps
  } = props;

  const allCountries = useReduxState('allCountries') as ReduxResponse<OldListResponse<Country>>;

  const urlOptions = useMemo(() => {
    if (isNationalSociety) {
      return ({
        reporting_ns: countryId,
      });
    }
    const country = allCountries?.data?.results?.find((d) => d.id === countryId);
    return ({ country: country?.iso });
  }, [countryId, isNationalSociety, allCountries]);

  return (
    <ExportTableButton
      apiUrl={apiUrl}
      transformItem={projectDataMap}
      urlOptions={urlOptions}
      {...otherProps}
    />
  );
}

export default ExportProjectsButton;

import {
  createStringColumn,
  createDateColumn,
} from '#components/Table/predefinedColumns';

import {
  EmergencyProjectResponse,
} from '#types';

type P = EmergencyProjectResponse;
type K = string | number;

export const getColumns = () => ([
  createStringColumn<P, K>(
    'title',
    'Title',
    (item) => item.title,
  ),
  createDateColumn<P, K>(
    'start_date',
    'Start date',
    (item) => item.start_date,
  ),
  createStringColumn<P, K>(
    'country',
    'Country',
    (item) => item.country_details?.name,
  ),
  createStringColumn<P, K>(
    'lead',
    'Activity Lead',
    (item) => item.activity_lead_display,
  ),
  createStringColumn<P, K>(
    'national_society',
    'National Society',
    (item) => (
      item.activity_lead === 'deployed_eru'
        ? item.deployed_eru_details
          ?.eru_owner_details
          ?.national_society_country_details
          ?.society_name
        : item.reporting_ns_details?.society_name
    ),
  ),
]);

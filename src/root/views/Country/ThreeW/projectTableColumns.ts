import {
    createStringColumn,
    createNumberColumn,
} from '#components/Table/predefinedColumns';

import {
  Project,
} from '#types';

const baseColumns = [
  createStringColumn<Project, string | number>(
    'name',
    'Project Name',
    (item) => item.name,
  ),
  createStringColumn<Project, string | number>(
    'sector',
    'Sector',
    (item) => item.primary_sector_display,
  ),
  createNumberColumn<Project, string | number>(
    'budget',
    'Total Budget',
    (item) => item.budget_amount,
    undefined,
    { normal: true }
  ),
  createStringColumn<Project, string | number>(
    'programmeType',
    'Programme Type',
    (item) => item.programme_type_display,
  ),
  createStringColumn<Project, string | number>(
    'disasterType',
    'Disaster Type',
    (item) => item.dtype_detail?.name,
  ),
  createNumberColumn<Project, string | number>(
    'peopleTargeted',
    'People Targeted',
    (item) => item.target_total,
    undefined,
    { normal: true }
  ),
  createNumberColumn<Project, string | number>(
    'peopleReached',
    'People Reached',
    (item) => item.reached_total,
    undefined,
    { normal: true }
  ),
];

export const inCountryProjectColumns = [
  createStringColumn<Project, string | number>(
    'ns',
    'National Society',
    (item) => item.reporting_ns_detail?.society_name,
  ),
  ...baseColumns,
];

export const nsProjectColumns = [
  createStringColumn<Project, string | number>(
    'country',
    'Receiving Country',
    (item) => item.project_country_detail?.name,
  ),
  ...baseColumns,
];

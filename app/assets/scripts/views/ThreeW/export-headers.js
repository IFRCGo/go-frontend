import {
  statuses,
  secondarySectors,
  sectors,
  programmeTypes,
  operationTypes,
} from '../../utils/constants';

const exportHeaders = [
  {
    title: 'Country',
    key: 'project_country',
    modifier: r => r.project_country_detail.name,
  },
  {
    title: 'Region',
    key: 'project_district',
    modifier: r => r.project_district_detail ? r.project_district_detail.name : 'Countrywide',
  },
  {
    title: 'Supporting NS',
    key: 'reporting_ns',
    modifier: r => r.reporting_ns_detail ? r.reporting_ns_detail.name : '',
  },
  {
    title: 'Operation type',
    key: 'operation_type',
    modifier: r => operationTypes[r.operation_type],
  },
  {
    title: 'Programme type',
    key: 'programme_type',
    modifier: r => programmeTypes[r.programme_type],
  },
  {
    title: 'Activity name',
    key: 'name',
  },
  {
    title: 'Primary Sector',
    key: 'primary_sector',
    modifier: r => sectors[r.primary_sector],
  },
  {
    title: 'Tags',
    key: 'secondary_sectors',
    modifier: r => r.secondary_sectors.map(d => secondarySectors[d]).join(', '),
  },
  {
    title: 'Start Date',
    key: 'start_date',
  },
  {
    title: 'End Date',
    key: 'end_date',
  },
  {
    title: 'Budget(CHF)',
    key: 'budget_amount',
  },
  {
    title: 'Status',
    key: 'status',
    modifier: r => statuses[r.status],
  },
  {
    title: 'Targeted Males',
    key: 'target_male',
  },
  {
    title: 'Targeted Females',
    key: 'target_female',
  },
  {
    title: 'Targeted Others',
    key: 'target_other',
  },
  {
    title: 'Targeted Total',
    key: 'target_total',
  },
  {
    title: 'Reached Males',
    key: 'reached_male',
  },
  {
    title: 'Reached Females',
    key: 'reached_female',
  },
  {
    title: 'Reached Others',
    key: 'reached_other',
  },
  {
    title: 'Reached Total',
    key: 'reached_total',
  },
];

export default exportHeaders;

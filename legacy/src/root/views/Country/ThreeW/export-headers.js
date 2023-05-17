const multiValueDelimiter = ', ';
const exportHeaders = [
  {
    title: 'Country',
    key: 'project_country',
    modifier: r => r.project_country_detail.name,
  },
  {
    title: 'Region',
    key: 'project_district',
    modifier: r => (r.project_districts_detail || []).map(d => d.name).join(multiValueDelimiter),
  },
  {
    title: 'Reporting NS',
    key: 'reporting_ns',
    modifier: r => r.reporting_ns_detail ? r.reporting_ns_detail.name : '',
  },
  {
    title: 'Operation Type',
    key: 'operation_type_display',
  },
  {
    title: 'Programme Type',
    key: 'programme_type_display',
  },
  {
    title: 'Disaster Type',
    key: 'dtype_detail',
    modifier: r => r.dtype_detail ? r.dtype_detail.name : '',
  },
  {
    title: 'Project Name',
    key: 'name',
  },
  {
    title: 'Primary Sector',
    key: 'primary_sector_display',
  },
  {
    title: 'Tags',
    key: 'secondary_sectors',
    modifier: r => r.secondary_sectors_display.join(multiValueDelimiter),
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
    key: 'status_display',
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

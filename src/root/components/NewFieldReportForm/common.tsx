export type ReportType = 'EVT' | 'EPI' | 'EW' | 'COVID';

export interface Option {
  value: string;
  label: string;
  description?: string;
}

export const emptyOptionList: Option[] = [];

export interface FormType {
  status: string;
  is_covid_report: string;
  disaster_type: string;
  event: string;
  title: string;
  country: string;
  start_date: string;
  assistance: string;
  ns_assistance: string;

  epi_cases: number;
  epi_suspected_cases: number;
  epi_probable_cases: number;
  epi_confirmed_cases: number;
  epi_num_dead: number;

  epi_cases_since_last_fr: number;
  epi_deaths_since_last_fr: number;

  epi_figures_source: string;
  epi_notes_since_last_fr: string;
  situation_fields_date: string;
  other_sources: string;
  description: string;

  num_injured: number;
  num_dead: number;
  num_missing: number;
  num_affected: number;
  num_displaced: number;
  num_injured_source: string;
  num_dead_source: string;
  num_missing_source: string;
  num_affected_source: string;
  num_displaced_source: string;

  num_potentially_affected: number;
  num_highest_risk: number;
  affected_pop_centres: number;
  num_potentially_affected_source: string;
  num_highest_risk_source: string;
  affected_pop_centres_source: string;

  num_assisted_gov: number;
  num_assisted_red_cross: number;
  num_local_staff: number;
  num_volunteers: number;
  num_expats: number;
  actions_ntls: string[];
  actions_ntls_desc: string;
  actions_fdrn: string[];
  actions_fdrn_desc: string;
  actions_pns: string[];
  actions_pns_desc: string;
  bulletin: string;
  actions_others: string;
}

export interface ListResponse {
  results?: any[];
}

export const optionKeySelector = (o: Option) => o.value;
export const optionLabelSelector = (o: Option) => o.label;
export const optionDescriptionSelector = (o: Option) => o.description;

export const EPI_SOURCE_MOH = '0';
export const EPI_SOURCE_WHO = '1';
export const EPI_SOURCE_OTHER = '2';
export const epiSourceOptions: Option[] = [
  { value: EPI_SOURCE_MOH, label: 'Ministry of Health' },
  { value: EPI_SOURCE_WHO, label: 'World Health Organization' },
  { value: EPI_SOURCE_OTHER, label: 'Other' },
];

// NTLS: National society of Red Cross
// FDRN: IFRC
// PNS: Other RCRC (Partner NS)
export type OrganizationType = 'NTLS' | 'PNS' | 'FDRN';


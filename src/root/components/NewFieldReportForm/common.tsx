import { isDefined } from '@togglecorp/fujs';

export const STATUS_EARLY_WARNING = 8;
export const STATUS_EVENT = 9;
export const DISASTER_TYPE_EPIDEMIC = 1;

export type ReportType = 'EVT' | 'EPI' | 'EW' | 'COVID';

export interface NumericValueOption {
  value: number;
  label: string;
  description?: string;
}

export interface BooleanValueOption {
  value: boolean;
  label: string;
  description?: string;
}

export interface StringValueOption {
  value: string;
  label: string;
  description?: string;
}

export type Option = NumericValueOption | BooleanValueOption | StringValueOption;

export const emptyOptionList: Option[] = [];
export const emptyStringOptionList: StringValueOption[] = [];
export const emptyNumericOptionList: NumericValueOption[] = [];
export const emptyBooleanOptionList: BooleanValueOption[] = [];

export interface FormType {
  status: number;
  is_covid_report: boolean;
  dtype: number;
  event: number;
  summary: string;
  country: number;
  districts: number[];
  start_date: string;
  request_assistance?: boolean;
  ns_request_assistance?: boolean;

  epi_cases: number;
  epi_suspected_cases: number;
  epi_probable_cases: number;
  epi_confirmed_cases: number;
  epi_num_dead: number;

  epi_cases_since_last_fr: number;
  epi_deaths_since_last_fr: number;

  epi_figures_source: string;
  epi_notes_since_last_fr: string;
  sit_fields_date: string;
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

  gov_num_assisted: number;
  num_assisted: number;
  num_localstaff: number;
  num_volunteers: number;
  num_expats_delegates: number;

  actions_ntls: number[];
  actions_ntls_desc: string;
  actions_fdrn: number[];
  actions_fdrn_desc: string;
  actions_pns: number[];
  actions_pns_desc: string;
  bulletin: number;
  actions_others: string;

  notes_health: string;
  notes_ns: string;
  notes_socioeco: string;
  external_partners: number[];
  supported_activities: number[];

  dref: number;
  dref_amount: number;
  appeal: number;
  appeal_amount: number;
  fact: number;
  num_fact: number;
  ifrc_staff: number;
  num_ifrc_staff: number;
  forecast_based_action: number;
  forecast_based_action_amount: number;

  contact_originator_name: string;
  contact_originator_title: string;
  contact_originator_email: string;
  contact_originator_phone: string;
  contact_nat_soc_name: string;
  contact_nat_soc_title: string;
  contact_nat_soc_email: string;
  contact_nat_soc_phone: string;
  contact_federation_name: string;
  contact_federation_title: string;
  contact_federation_email: string;
  contact_federation_phone: string;
  contact_media_name: string;
  contact_media_title: string;
  contact_media_email: string;
  contact_media_phone: string;

  visibility: number;
}

export type ListResponse<T = any> = [
  boolean,
  {
    count: number;
    results: T[];
    next?: string;
  } | undefined,
  (options: any) => void,
];

export const optionKeySelector = (o: Option) => o.value;
export const numericOptionKeySelector = (o: NumericValueOption) => o.value;
export const stringOptionKeySelector = (o: StringValueOption) => o.value;
export const booleanOptionKeySelector = (o: BooleanValueOption) => o.value;
export const optionLabelSelector = (o: Option) => o.label;
export const optionDescriptionSelector = (o: Option) => o.description;

export const BULLETIN_PUBLISHED_NO = 0;
export const BULLETIN_PUBLISHED_PLANNED = 2;
export const BULLETIN_PUBLISHED_YES = 3;

export const SOURCE_RC = 'red-cross';
export const SOURCE_GOV = 'government';
export const SOURCE_OTHER = 'other';

export const VISIBILITY_PUBLIC = 3;
export const VISIBILITY_RCRC_MOVEMENT = 1;
export const VISIBILITY_IFRC_SECRETARIAT = 2;

export const EPI_SOURCE_MOH = 0;
export const EPI_SOURCE_WHO = 1;
export const EPI_SOURCE_OTHER = 2;
export const epiSourceOptions: NumericValueOption[] = [
  { value: EPI_SOURCE_MOH, label: 'Ministry of Health' },
  { value: EPI_SOURCE_WHO, label: 'World Health Organization' },
  { value: EPI_SOURCE_OTHER, label: 'Other' },
];

// NTLS: National society of Red Cross
// FDRN: IFRC
// PNS: Other RCRC (Partner NS)
export type OrganizationType = 'NTLS' | 'PNS' | 'FDRN';
export type FieldReportType = 'EW' | 'EVT' | 'EPI' | 'COVID';
type ContactType = 'Originator' | 'NationalSociety' | 'Federation' | 'Media';

export interface ActionFields {
  category: string;
  field_report_types: FieldReportType[];
  id: number;
  name: string;
  organizations: OrganizationType[]
  tooltip_text: string | null;
}

export type ActionByReportType = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  [key in FieldReportType]: ActionFields[];
}

export type ActionsByOrganization = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  [key in OrganizationType]: Action[]
};

export const emptyActionList: ActionFields[] = [];

export type Action = {
  value: number;
  label: string;
  category: string;
  description: string | undefined;
  organization: OrganizationType;
}


export interface FieldReportAPIFields {
  // ------------------------------------------
  // Context
  // ------------------------------------------
  status: number;
  is_covid_report: boolean;
  event?: number;
  summary: string;
  countries: number[];
  districts: number[];
  dtype: number;
  start_date: string;
  request_assistance?: boolean;
  ns_request_assistance?: boolean;

  // ------------------------------------------
  // Risk Analysis, Situation
  // ------------------------------------------

  // Potentially affected with source = "Red Cross / Red Cresent"
  num_potentially_affected?: number;
  num_highest_risk?: number;
  affected_pop_centres?: number;
  num_injured?: number;
  num_dead?: number;
  num_missing?: number;
  num_affected?: number;
  num_displaced?: number;

  // Potentially affected with source = "Government"
  gov_num_potentially_affected?: number
  gov_num_highest_risk?: number;
  gov_affected_pop_centres?: number;
  gov_num_injured?: number;
  gov_num_dead?: number;
  gov_num_missing?: number;
  gov_num_affected?: number;
  gov_num_displaced?: number;

  // Potentially affected with source = "Other"
  other_num_potentially_affected?: number
  other_num_highest_risk?: number;
  other_affected_pop_centres?: number;
  other_num_injured?: number;
  other_num_dead?: number;
  other_num_missing?: number;
  other_num_affected?: number;
  other_num_displaced?: number;

  epi_cases?: number;
  epi_suspected_cases?: number;
  epi_probable_cases?: number;
  epi_confirmed_cases?: number;
  epi_num_dead?: number
  epi_figure_source?: string;
  epi_notes_since_last_fr?: string;

  // Date of Data for Epidemic
  sit_fields_date?: string;

  // Source details
  other_sources?: string;

  // Risk analysis or Situational Overview
  description?: string;


  // ------------------------------------------
  // Actions
  // ------------------------------------------

  // Assisted by Government
  gov_num_assisted?: number;

  // Assisted by RCRC Movements
  num_assisted?: number;

  // Number of NS Staff Involved
  num_localstaff?: number;

  // Number of NS Volunteers Involved
  num_volunteers?: number;

  // Number of RCRC Partner Personnel Involved
  num_expats_delegates?: number;

  actions_taken: {
    organization: OrganizationType;
    summary?: string;
    actions: number[];
  }[]

  notes_health?: string;
  notes_ns?: string;
  notes_socioeco?: string;

  bulletin?: string;
  action_others?: string;
  external_partners?: number[];
  supported_activities?: number[];


  // ------------------------------------------
  // Early Actions: Planned Interventions
  // ------------------------------------------
  dref?: number;
  dref_amount?: number;
  appeal?: number;
  appeal_amount?: number;

  // Rapid Response Personnel
  fact?: number;
  num_fact: number;

  // Emergency Response Units
  ifrc_staff?: number;
  num_ifrc_staff?: number;

  forecast_based_action: number;
  forecast_based_action_amount?: number;

  // ------------------------------------------
  // Early Actions: Contacts
  // ------------------------------------------
  contacts: {
    ctype: ContactType;
    name?: string;
    title?: string;
    email?: string;
    phone?: string;
  }[]
  visibility: number;
}


export function transformFormFieldsToAPIFields(formValues: FormType): FieldReportAPIFields {
  const {
    country,

    sit_fields_date,
    other_sources,
    description,

    num_injured,
    num_dead,
    num_missing,
    num_affected,
    num_displaced,

    num_injured_source,
    num_dead_source,
    num_missing_source,
    num_affected_source,
    num_displaced_source,

    num_potentially_affected,
    num_highest_risk,
    affected_pop_centres,
    num_potentially_affected_source,
    num_highest_risk_source,
    affected_pop_centres_source,

    gov_num_assisted,
    num_assisted,
    num_localstaff,
    num_volunteers,
    num_expats_delegates,

    actions_ntls = [],
    actions_ntls_desc,
    actions_fdrn = [],
    actions_fdrn_desc,
    actions_pns = [],
    actions_pns_desc,
    bulletin,
    actions_others,

    notes_health,
    notes_ns,
    notes_socioeco,

    contact_originator_name,
    contact_originator_title,
    contact_originator_email,
    contact_originator_phone,
    contact_nat_soc_name,
    contact_nat_soc_title,
    contact_nat_soc_email,
    contact_nat_soc_phone,
    contact_federation_name,
    contact_federation_title,
    contact_federation_email,
    contact_federation_phone,
    contact_media_name,
    contact_media_title,
    contact_media_email,
    contact_media_phone,

    ...otherFields
  } = formValues;

  const actions_taken: FieldReportAPIFields['actions_taken'] = [];

  if (isDefined(actions_ntls_desc) || actions_ntls?.length > 0) {
    actions_taken.push({
      organization: 'NTLS',
      summary: actions_ntls_desc,
      actions: actions_ntls,
    });
  }

  if (isDefined(actions_fdrn_desc) || actions_fdrn?.length > 0) {
    actions_taken.push({
      organization: 'FDRN',
      summary: actions_fdrn_desc,
      actions: actions_fdrn,
    });
  }

  if (isDefined(actions_pns_desc) || actions_pns?.length > 0) {
    actions_taken.push({
      organization: 'PNS',
      summary: actions_pns_desc,
      actions: actions_pns,
    });
  }

  const contacts: FieldReportAPIFields['contacts'] = [];
  if (isDefined(contact_originator_name)) {
    contacts.push({
      ctype: 'Originator',
      name: contact_originator_name,
      title: contact_originator_title,
      email: contact_originator_email,
      phone: contact_originator_phone,
    });
  }

  if (isDefined(contact_nat_soc_name)) {
    contacts.push({
      ctype: 'Originator',
      name: contact_nat_soc_name,
      title: contact_nat_soc_title,
      email: contact_nat_soc_email,
      phone: contact_nat_soc_phone,
    });
  }

  if (isDefined(contact_federation_name)) {
    contacts.push({
      ctype: 'Originator',
      name: contact_federation_name,
      title: contact_federation_title,
      email: contact_federation_email,
      phone: contact_federation_phone,
    });
  }

  if (isDefined(contact_media_name)) {
    contacts.push({
      ctype: 'Originator',
      name: contact_media_name,
      title: contact_media_title,
      email: contact_media_email,
      phone: contact_media_phone,
    });
  }

  const rc_num_potentially_affected = num_potentially_affected_source === SOURCE_RC ? num_potentially_affected : undefined;
  const rc_num_highest_risk = num_highest_risk_source === SOURCE_RC ? num_highest_risk : undefined;
  const rc_affected_pop_centres = affected_pop_centres_source === SOURCE_RC ? affected_pop_centres : undefined;
  const rc_num_injured = num_injured_source === SOURCE_RC ? num_injured : undefined;
  const rc_num_dead = num_dead_source === SOURCE_RC ? num_dead : undefined;
  const rc_num_missing = num_missing_source === SOURCE_RC ? num_missing : undefined;
  const rc_num_affected = num_affected_source === SOURCE_RC ? num_affected : undefined;
  const rc_num_displaced = num_displaced_source === SOURCE_RC ? num_displaced : undefined;

  const gov_num_potentially_affected = num_potentially_affected_source === SOURCE_GOV ? num_potentially_affected : undefined;
  const gov_num_highest_risk = num_highest_risk_source === SOURCE_GOV ? num_highest_risk : undefined;
  const gov_affected_pop_centres = affected_pop_centres_source === SOURCE_GOV ? affected_pop_centres : undefined;
  const gov_num_injured = num_injured_source === SOURCE_GOV ? num_injured : undefined;
  const gov_num_dead = num_dead_source === SOURCE_GOV ? num_dead : undefined;
  const gov_num_missing = num_missing_source === SOURCE_GOV ? num_missing : undefined;
  const gov_num_affected = num_affected_source === SOURCE_GOV ? num_affected : undefined;
  const gov_num_displaced = num_displaced_source === SOURCE_GOV ? num_displaced : undefined;

  const other_num_potentially_affected = num_potentially_affected_source === SOURCE_OTHER? num_potentially_affected : undefined;
  const other_num_highest_risk = num_highest_risk_source === SOURCE_OTHER? num_highest_risk : undefined;
  const other_affected_pop_centres = affected_pop_centres_source === SOURCE_OTHER? affected_pop_centres : undefined;
  const other_num_injured = num_injured_source === SOURCE_OTHER? num_injured : undefined;
  const other_num_dead = num_dead_source === SOURCE_OTHER? num_dead : undefined;
  const other_num_missing = num_missing_source === SOURCE_OTHER? num_missing : undefined;
  const other_num_affected = num_affected_source === SOURCE_OTHER? num_affected : undefined;
  const other_num_displaced = num_displaced_source === SOURCE_OTHER? num_displaced : undefined;

  return {
    ...otherFields,

    actions_taken,
    contacts,
    countries: [country],

    num_potentially_affected: rc_num_potentially_affected,
    num_highest_risk: rc_num_highest_risk,
    affected_pop_centres: rc_affected_pop_centres,
    num_injured: rc_num_injured,
    num_dead: rc_num_dead,
    num_missing: rc_num_missing,
    num_affected: rc_num_affected,
    num_displaced: rc_num_displaced,

    gov_num_potentially_affected,
    gov_num_highest_risk,
    gov_affected_pop_centres,
    gov_num_injured,
    gov_num_dead,
    gov_num_missing,
    gov_num_affected,
    gov_num_displaced,

    other_num_potentially_affected,
    other_num_highest_risk,
    other_affected_pop_centres,
    other_num_injured,
    other_num_dead,
    other_num_missing,
    other_num_affected,
    other_num_displaced,
  };
}

export const sample = {
    "id": 9705,
    "user": {
        "id": 2759,
        "username": "tovari-test",
        "first_name": "Daniel",
        "last_name": "Tovari",
        "email": "daniel.tovari@ifrc.org",
        "profile": {
            "country": {
                "iso": "HU",
                "iso3": "HUN",
                "id": 82,
                "record_type": 1,
                "record_type_display": "Country",
                "region": 3,
                "independent": true,
                "is_deprecated": false,
                "fdrs": "DHU001",
                "name": "Hungary",
                "society_name": "Hungarian Red Cross"
            },
            "org": "IFRC",
            "org_type": "SCRT",
            "city": "Budpest",
            "department": "DCPRR",
            "position": "IM",
            "phone_number": null
        },
        "subscription": [
            {
                "stype": 0,
                "rtype": 5,
                "country": null,
                "region": 3,
                "event": null,
                "dtype": null,
                "lookup_id": "r3"
            },
            {
                "stype": 0,
                "rtype": 6,
                "country": null,
                "region": null,
                "event": null,
                "dtype": 15,
                "lookup_id": "d15"
            },
            {
                "stype": 0,
                "rtype": 4,
                "country": 15,
                "region": null,
                "event": null,
                "dtype": null,
                "lookup_id": "c15"
            },
            {
                "stype": 0,
                "rtype": 4,
                "country": 82,
                "region": null,
                "event": null,
                "dtype": null,
                "lookup_id": "c82"
            },
            {
                "stype": 0,
                "rtype": 4,
                "country": 82,
                "region": null,
                "event": null,
                "dtype": null,
                "lookup_id": "c82"
            },
            {
                "stype": 0,
                "rtype": 4,
                "country": 82,
                "region": null,
                "event": null,
                "dtype": null,
                "lookup_id": "c82"
            },
            {
                "stype": 0,
                "rtype": 4,
                "country": 82,
                "region": null,
                "event": null,
                "dtype": null,
                "lookup_id": "c82"
            },
            {
                "stype": 0,
                "rtype": 11,
                "country": null,
                "region": null,
                "event": null,
                "dtype": null,
                "lookup_id": null
            }
        ],
        "is_superuser": true,
        "is_ifrc_admin": true
    },
    "dtype": {
        "id": 12,
        "name": "Flood",
        "summary": ""
    },
    "contacts": [],
    "actions_taken": [],
    "sources": [],
    "event": {
        "dtype": 27,
        "id": 4054,
        "parent_event": null,
        "name": "Flash flood in Hungary",
        "slug": null
    },
    "countries": [
        {
            "iso": "HU",
            "iso3": "HUN",
            "id": 82,
            "record_type": 1,
            "record_type_display": "Country",
            "region": 3,
            "independent": true,
            "is_deprecated": false,
            "fdrs": "DHU001",
            "name": "Hungary",
            "society_name": "Hungarian Red Cross"
        }
    ],
    "districts": [],
    "external_partners": [],
    "supported_activities": [],
    "is_covid_report": false,
    "rid": null,
    "status": 9,
    "request_assistance": null,
    "ns_request_assistance": null,
    "num_injured": null,
    "num_dead": null,
    "num_missing": null,
    "num_affected": null,
    "num_displaced": null,
    "num_assisted": null,
    "num_localstaff": null,
    "num_volunteers": null,
    "num_expats_delegates": null,
    "num_potentially_affected": null,
    "num_highest_risk": null,
    "affected_pop_centres": null,
    "gov_num_injured": null,
    "gov_num_dead": null,
    "gov_num_missing": null,
    "gov_num_affected": null,
    "gov_num_displaced": null,
    "gov_num_assisted": null,
    "epi_cases": null,
    "epi_suspected_cases": null,
    "epi_probable_cases": null,
    "epi_confirmed_cases": null,
    "epi_num_dead": null,
    "epi_figures_source": null,
    "epi_cases_since_last_fr": null,
    "epi_deaths_since_last_fr": null,
    "epi_notes_since_last_fr": null,
    "who_num_assisted": null,
    "health_min_num_assisted": null,
    "gov_num_potentially_affected": null,
    "gov_num_highest_risk": null,
    "gov_affected_pop_centres": null,
    "other_num_injured": null,
    "other_num_dead": null,
    "other_num_missing": null,
    "other_num_affected": null,
    "other_num_displaced": null,
    "other_num_assisted": null,
    "other_num_potentially_affected": null,
    "other_num_highest_risk": null,
    "other_affected_pop_centres": null,
    "sit_fields_date": null,
    "visibility": 3,
    "bulletin": 0,
    "dref": 0,
    "dref_amount": null,
    "appeal": 0,
    "appeal_amount": null,
    "imminent_dref": 0,
    "imminent_dref_amount": null,
    "forecast_based_action": 0,
    "forecast_based_action_amount": null,
    "rdrt": 0,
    "num_rdrt": null,
    "fact": 0,
    "num_fact": null,
    "ifrc_staff": 0,
    "num_ifrc_staff": null,
    "eru_base_camp": 0,
    "eru_base_camp_units": null,
    "eru_basic_health_care": 0,
    "eru_basic_health_care_units": null,
    "eru_it_telecom": 0,
    "eru_it_telecom_units": null,
    "eru_logistics": 0,
    "eru_logistics_units": null,
    "eru_deployment_hospital": 0,
    "eru_deployment_hospital_units": null,
    "eru_referral_hospital": 0,
    "eru_referral_hospital_units": null,
    "eru_relief": 0,
    "eru_relief_units": null,
    "eru_water_sanitation_15": 0,
    "eru_water_sanitation_15_units": null,
    "eru_water_sanitation_40": 0,
    "eru_water_sanitation_40_units": null,
    "eru_water_sanitation_20": 0,
    "eru_water_sanitation_20_units": null,
    "notes_health": "",
    "notes_ns": "",
    "notes_socioeco": "",
    "start_date": "2021-04-25T00:00:00Z",
    "report_date": "2021-04-26T20:51:25.487852Z",
    "created_at": "2021-04-26T20:51:25.488654Z",
    "updated_at": "2021-04-26T20:53:06.753161Z",
    "previous_update": "2021-04-26T20:51:25.488664Z",
    "regions": [
        3
    ],
    "summary": "new FR - flood",
    "other_sources": "",
    "actions_others": null,
    "description": ""
};

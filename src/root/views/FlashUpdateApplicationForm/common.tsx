import {
  Country,
  DistrictMini,
} from '#types/country';

import {
  BooleanValueOption,
  NumericValueOption,
  StringValueOption,
} from '#types/common';

export const ONSET_IMMINENT = 0;
export const ONSET_SLOW = 1;
export const ONSET_SUDDEN = 2;

export interface HazardDetails {
  id: number;
  name: string;
  summary: string;
}

export interface CountryDistrict {
  client_id: string;
  country: number;
  district: number;
}

export interface Reference {
  client_id: string;
  date: string;
  source_description: string;
  url: string;
  document: number;
}

export interface FileWithCaption {
  client_id: string;
  id: number;
  caption: string;
}

export type OrganizationType = 'NTLS' | 'PNS' | 'FDRN' | 'GOV';
export interface ActionOptionItem {
  id: number;
  category: string;
  name: string;
  organizations: OrganizationType[];
  tooltip_text: string;
}

export interface Action {
  client_id: string;
  actions: number[];
  organization: OrganizationType;
  summary: string;
}


export type Option = NumericValueOption | BooleanValueOption | StringValueOption;
export const emptyOptionList: Option[] = [];
export const emptyStringOptionList: StringValueOption[] = [];
export const emptyNumericOptionList: NumericValueOption[] = [];
export const emptyBooleanOptionList: BooleanValueOption[] = [];

export const optionKeySelector = (o: Option) => o.value;
export const numericOptionKeySelector = (o: NumericValueOption) => o.value;
export const stringOptionKeySelector = (o: StringValueOption) => o.value;
export const booleanOptionKeySelector = (o: BooleanValueOption) => o.value;
export const optionLabelSelector = (o: Option) => o.label;
export const tableKeySelector = (o: FlashUpdateTableFields) => o.id;

export interface FlashUpdateTableFields {
  id: number;
  modified_at: string;
  title: string;
  hazard_type: string;
  country_district: CountryDistrict[];
  hazard_type_details: HazardDetails;
  tableTitle?: string;
}

export interface FlashUpdateFields {
  country_district: CountryDistrict[];
  hazard_type: number;
  title: string;
  situational_overview: string;
  map_files: FileWithCaption[];
  graphics_files: FileWithCaption[];
  references: Reference[];

  actions_taken: Action[];


  originator_name: string;
  originator_title: string;
  originator_email: string;
  originator_phone: string;

  ifrc_name: string;
  ifrc_title: string;
  ifrc_email: string;
  ifrc_phone: string;

  share_with: string;
}

type TransformToApiFields<FIELDS extends {}, ADDITION extends {}> =  FIELDS & {
  id: number;
} & ADDITION;

export interface FlashUpdateAPIResponseFields extends Omit<FlashUpdateFields, 'country_district' | 'references' | 'graphics_files' | 'map_files' | 'actions_taken'> {
  id: number,
  country_district: TransformToApiFields<CountryDistrict, {
    country_details: Country;
    district_details: DistrictMini;
  }>[];
  references: TransformToApiFields<Reference, {
    document_details: {
      id: number;
      file: string;
    }
  }>[];
  graphics_files: {
    id: number,
    caption: string | null,
    client_id: string | null,
    file: string;
  }[];
  map_files: {
    id: number,
    caption: string | null,
    client_id: string | null,
    file: string;
  }[];
  hazard_type_details: HazardDetails;
  actions_taken: (Action & {
    id: number;
    action_details: (ActionOptionItem & {
      client_id: string | null;
    })[];
    organization_display: string;
  })[];
}

export type FlashUpdateAPIFields = FlashUpdateFields;

export const emptyActionOptionItemList: ActionOptionItem[] = [];

export const contextFields: (keyof FlashUpdateFields)[] = [
  'hazard_type',
  'title',
  'situational_overview',
  'graphics_files',
  'map_files',
  'references',
  'country_district',
  'title',
];

export const actionsFields: (keyof FlashUpdateFields)[] = [
  'actions_taken',
];

export const focalFields: (keyof FlashUpdateFields)[] = [
  'originator_name',
  'originator_title',
  'originator_email',
  'originator_phone',
  'ifrc_name',
  'ifrc_title',
  'ifrc_email',
  'ifrc_phone',
  'share_with'
];

export function transformFormFieldsToAPIFields(formValues: FlashUpdateFields): FlashUpdateAPIFields {
  const {
    country_district,
    hazard_type,
    title,
    situational_overview,
    references,
    actions_taken,

    originator_email,
    originator_name,
    originator_title,
    originator_phone,
    ifrc_email,
    ifrc_name,
    ifrc_phone,
    ifrc_title,
    share_with,

    map_files,
    graphics_files,
  } = formValues;

  return {
    country_district,
    hazard_type,
    title,
    situational_overview,

    // actions_taken: actions_taken.filter(a => a.actions?.length !== 0),
    actions_taken,
    originator_name,
    originator_title,
    originator_email,
    originator_phone,

    ifrc_email,
    ifrc_name,
    ifrc_title,
    ifrc_phone,
    share_with,

    references,
    map_files,
    graphics_files,
  };
}

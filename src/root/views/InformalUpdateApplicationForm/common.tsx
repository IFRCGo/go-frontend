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
  clientId: string;
  country: number;
  district: number;
}

export interface Reference {
  clientId: string;
  date: string;
  source_description: string;
  url: string;
  document: number;
}

export interface FileWithCaption {
  clientId: string;
  file: number;
  caption: string;
}

export interface Action {
  clientId: string;
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
export const tableKeySelector = (o: InformalUpdateTableFields) => o.id;

export interface InformalUpdateTableFields {
  id: number;
  modified_at: string;
  title: string;
  hazard_type: string;
  country_district: CountryDistrict[];
  hazard_type_details: HazardDetails;
  tableTitle?: string;
}

export interface InformalUpdateFields {
  country_district: CountryDistrict[];
  references: Reference[];
  actions_taken: Action[];
  map: FileWithCaption[];
  graphics: FileWithCaption[];

  title: string;
  situational_overview: string;

  originator_name: string;
  originator_title: string;
  originator_email: string;
  originator_phone: string;

  ifrc_name: string;
  ifrc_title: string;
  ifrc_email: string;
  ifrc_phone: string;

  share_with: string;
  hazard_type: number;
}

type TransformToApiFields<FIELDS extends { clientId: string }, ADDITION extends {}> = Omit<FIELDS, 'clientId'> & {
  id: number;
} & ADDITION;

export interface InformalUpdateAPIResponseFields extends Omit<InformalUpdateFields, 'country_district' | 'references' | 'graphics' | 'map'> {
  id: number,
  country_district: TransformToApiFields<CountryDistrict, {
    country_details: Country;
    district_details: DistrictMini;
  }>[];
  references: TransformToApiFields<Reference, {}>[];
  graphics: TransformToApiFields<FileWithCaption, {}>[];
  map: TransformToApiFields<FileWithCaption, {}>[];
  hazard_type_details: HazardDetails;
}

export type InformalUpdateAPIFields = InformalUpdateFields;
export type OrganizationType = 'NTLS' | 'IFRC' | 'RCRC' | 'GOV';
export interface ActionOptionItem {
  id: number;
  category: string;
  name: string;
  organizations: OrganizationType[];
  tooltip_text: string;
}

export const emptyActionOptionItemList: ActionOptionItem[] = [];

export const contextFields: (keyof InformalUpdateFields)[] = [
  'hazard_type',
  'title',
  'situational_overview',
  'graphics',
  'map',
  'references',
  'country_district',
  'title',
];

export const actionsFields: (keyof InformalUpdateFields)[] = [
  'actions_taken',
];

export const focalFields: (keyof InformalUpdateFields)[] = [
  'originator_name',
  'originator_title',
  'originator_email',
  'originator_phone',
  'ifrc_title',
  'ifrc_name',
  'ifrc_email',
  'ifrc_phone',
  'share_with'
];

export function transformFormFieldsToAPIFields(formValues: InformalUpdateFields): InformalUpdateAPIFields {
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

    map,
    graphics,
  } = formValues;

  return {
    country_district,
    hazard_type,
    title,
    situational_overview,

    actions_taken: actions_taken.filter(a => a.actions?.length !== 0),
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
    map,
    graphics,
  };
}

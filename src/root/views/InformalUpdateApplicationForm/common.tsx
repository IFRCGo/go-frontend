import { Country } from '#types/country';
import { isDefined } from '@togglecorp/fujs';

export const ONSET_IMMINENT = 0;
export const ONSET_SLOW = 1;
export const ONSET_SUDDEN = 2;
export interface NumericValueOption {
  value: number;
  label: string;
}
export interface BooleanValueOption {
  value: boolean;
  label: string;
}
export interface StringValueOption {
  value: string;
  label: string;
}
export interface NumericKeyValuePair {
  key: number;
  value: string;
}
export interface StringKeyValuePair {
  key: string;
  value: string;
}
export interface User {
  id: number;
}
export interface HazardDetails {
  id: number;
  name: string;
  summary: string;
}
export interface Entity {
  id: number;
  name: string;
}
export interface CountryDistrict {
  clientId: string;
  country: number | undefined;
  district: number | undefined;
  country_details?: Country | undefined;
}
export interface ReferenceData {
  clientId: string;
  date: string;
  source_description: string;
  url?: string;
  document?: string;
}
export interface ImageDetails {
  id: number;
  file: string;
  caption: string;
}
export interface ActionDetails {
  id: number;
  name: string;
  category: string;
  organization: OrganizationType
}

export interface ActionsTaken {
  organization: OrganizationType;
  summary?: string;
  actions: number[];
  action_details?: ActionDetails[];
  organization_display?: string;
}

export interface ShareWithOptionsEntity {
  share_with_options: [{
    label: string;
    value: string;
  }]
}
export interface ImageData {
  clientId: string;
  caption?: string;
  pk: number;
  file: string;
}
export interface ImageDataToSave {
  caption?: string;
  pk: number;
  file?: string;
  id?: number;
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
  imageData: ImageData[];
  id: number;
  reference: ReferenceData[] | [];
  country_district: CountryDistrict[];
  hazard_type: number;
  title: string;
  situational_overview: string;
  graphics_id: number[];
  map_id: number[];

  actions_ntls: number[];
  actions_ntls_desc: string;
  actions_ifrc: number[];
  actions_ifrc_desc: string;
  actions_rcrc: number[];
  actions_rcrc_desc: string;
  actions_government: number[];
  actions_government_desc: string;

  originator_title: string;
  originator_name: string;
  originator_email: string;
  originator_phone: string;
  ifrc_name: string;
  ifrc_title: string;
  ifrc_email: string;
  ifrc_phone: string;
  share_with: string;

  hazard_type_details: HazardDetails;
  graphics_details: ImageData[];
  map_details: ImageData[];
}
export interface InformalUpdateAPIFields {
  id: number,
  country_district: CountryDistrict[];
  hazard_type: number;
  title: string;
  situational_overview: string;
  hazard_type_details: HazardDetails;
  //graphics_details: ImageData[];
  //map_details: ImageData[];

  // Actions
  actions_taken: ActionsTaken[];

  originator_title: string;
  originator_name: string;
  originator_email: string;
  originator_phone: string;
  ifrc_name: string;
  ifrc_title: string;
  ifrc_email: string;
  ifrc_phone: string;
  share_with: string;
  graphics: ImageDataToSave[];
  map: ImageDataToSave[];
  references: ReferenceData[];
}

export type OrganizationType = 'NTLS' | 'PNS' | 'FDRN' | 'IFRC' | 'RCRC' | 'GOV';
export type ReportType = 'EW' | 'EVT';

export type Action = {
  value: number;
  label: string;
  category: string;
  description: string | undefined;
  organization: OrganizationType;
}
export interface ActionFields {
  category: string;
  field_report_types: ReportType[];
  id: number;
  name: string;
  organizations: OrganizationType[]
  tooltip_text: string | null;
}
export const emptyActionList: ActionFields[] = [];

export type ActionByReportType = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  [key in ReportType]: ActionFields[];
}

export type ActionsByOrganization = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  [key in OrganizationType]: Action[];
};
export type ActionsByOrganizationArrayLists = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  [key in OrganizationType]: ActionFields[];
};

export const contextFields: (keyof InformalUpdateFields)[] = [
  'hazard_type',
  'title',
  'situational_overview',
  'graphics_id',
  'map_id',
  'reference',
  'country_district',
  'title',
  'imageData'
];

export const actionsFields: (keyof InformalUpdateFields)[] = [
  'actions_ntls',
  'actions_ntls_desc',
  'actions_ifrc',
  'actions_ifrc_desc',
  'actions_rcrc',
  'actions_rcrc_desc',
  'actions_government',
  'actions_government_desc'
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
    id,
    country_district,
    hazard_type,
    title,
    situational_overview,
    reference,

    actions_ntls,
    actions_ntls_desc,
    actions_ifrc,
    actions_ifrc_desc,
    actions_rcrc,
    actions_rcrc_desc,
    actions_government,
    actions_government_desc,

    originator_email,
    originator_name,
    originator_title,
    originator_phone,
    ifrc_email,
    ifrc_name,
    ifrc_phone,
    ifrc_title,
    share_with,

    hazard_type_details,
    map_details,
    graphics_details,
  } = formValues;

  const actions_taken: InformalUpdateAPIFields['actions_taken'] = [];
  const references: InformalUpdateAPIFields['references'] = [];
  const map: InformalUpdateAPIFields['map'] = [];
  const graphics: InformalUpdateAPIFields['graphics'] = [];

  for (var i in reference) {
    if (reference[i].source_description === undefined && reference[i].date === undefined) references.push();
    else {
      reference.map((el) => references.push({
        clientId: el.clientId,
        date: el.date,
        source_description: el.source_description,
        url: el.url,
        document: el.document
      }));
    }
  }

  if (isDefined(map_details)) {
    map_details.map((el) => map.push({
      pk: el.pk,
      caption: el.caption
    }));
  }

  if (isDefined(graphics_details)) {
    graphics_details.map((el) => graphics.push({
      pk: el.pk,
      caption: el.caption
    }));
  }

  if (isDefined(actions_ntls_desc) || (actions_ntls ?? [].length > 0)) {
    actions_taken.push({
      organization: 'NTLS',
      summary: actions_ntls_desc,
      actions: actions_ntls,
    });
  }

  if (isDefined(actions_ifrc_desc) || (actions_ifrc ?? [].length > 0)) {
    actions_taken.push({
      organization: 'IFRC',
      summary: actions_ifrc_desc,
      actions: actions_ifrc,
    });
  }

  if (isDefined(actions_rcrc_desc) || (actions_rcrc ?? [].length > 0)) {
    actions_taken.push({
      organization: 'RCRC',
      summary: actions_rcrc_desc,
      actions: actions_rcrc,
    });
  }

  if (isDefined(actions_government_desc) || (actions_government ?? [].length > 0)) {
    actions_taken.push({
      organization: 'GOV',
      summary: actions_government_desc,
      actions: actions_government
    });
  }

  return {
    id,
    country_district,
    hazard_type,
    title,
    situational_overview,

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

    hazard_type_details,
    references,
    map,
    graphics,
  };
}

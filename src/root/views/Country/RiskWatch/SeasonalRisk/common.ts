import {
  addSeparator,
  formattedNormalize,
  Lang,
  listToMap,
} from '@togglecorp/fujs';
import { HazardTypes } from '#types';

export const hazardTypeOptions = [
  { label: 'Cyclone', value: 'CY' },
  { label: 'Flood', value: 'FL' },
  { label: 'Food Insecurity', value: 'FI' },
  { label: 'Drought', value: 'DG' },
] as const;

export type HazardValueType = (typeof hazardTypeOptions)[number]['value'];
export type Writable<T> = { -readonly [P in keyof T]: T[P] };

export interface RiskData {
  hazardType: HazardTypes;
  hazardTypeDisplay: string;
  displacement: {
    annualAverage: number | null;
    monthly: (number | null)[];
  }
  informRiskScore: {
    annualAverage: number | null;
    monthly: (number | null)[];
  }
  exposure: {
    annualAverage: number | null;
    monthly: (number | null)[];
  };
}

export const riskMetricOptions = [
  { label: 'Inform Risk Score', value: 'informRiskScore' },
  { label: 'People Exposed', value: 'exposure' },
  { label: 'People at Risk of Displacement', value: 'displacement' },
] as const;

export const riskMetricMap = listToMap(
  riskMetricOptions as Writable<typeof riskMetricOptions>,
  d => d.value,
  d => d.label,
);

export interface IDMCData {
  confidence_type: 'low' | 'medium' | 'high' | string;
  confidence_type_display: string;
  country: string;
  hazard_type: HazardTypes;
  hazard_type_display: string;
  id: number;
  iso3: string
  note: string | null;
  annual_average_displacement: number | null;
  january: number | null;
  february: number | null;
  march: number | null;
  april: number | null;
  may: number | null;
  june: number | null;
  july: number | null;
  august: number | null;
  september: number | null;
  october: number | null;
  november: number | null;
  december: number | null;
}

export interface IPCData {
  id: number;
  country: number;
  hazard_type: HazardTypes;
  hazard_type_display: string;
  month: number;
  total_displacement: number;
  year: number;
  analysis_date: string;
  estimation_type: 'current' | 'first_projection' | 'second_projection';
}

export interface INFORMData {
  id: number;
  country: number;
  hazard_type: HazardTypes;
  hazard_type_display: string;
  risk_score: number;
}

interface CountryDetail {
  id: number;
  iso: string;
  iso3: string;
  name: string;
}

export interface INFORMSeasonalData {
  april: number | null;
  august: number | null;
  country: number | null;
  country_details: {
    id: number;
    name: string;
    iso3: string;
    iso: string;
  };
  december: number | null;
  february: number | null;
  hazard_type: HazardTypes;
  hazard_type_display: string;
  id: number;
  january: number | null;
  july: number | null;
  june: number | null;
  march: number | null;
  may: number | null;
  november: number | null;
  october: number | null;
  september: number | null;
}

export type ReturnPeriodHazardType = 'SS' | 'WD' | 'FL' | 'CD';

interface ReturnPeriodAttributes {
  economic_loss: number;
  population_exposure: number;
  population_displacement: number;
}

export interface ReturnPeriodData {
  country: number;
  country_details: CountryDetail;
  hazard_type: ReturnPeriodHazardType;
  hazard_type_display: string;
  id: number;
  ten_years: ReturnPeriodAttributes;
  twenty_years: ReturnPeriodAttributes;
  twenty_five_years: ReturnPeriodAttributes;
  fifty_years: ReturnPeriodAttributes;
  hundred_years: ReturnPeriodAttributes;
  two_hundred_fifty_years: ReturnPeriodAttributes;
  five_hundred_years: ReturnPeriodAttributes;
  one_thousand_years: ReturnPeriodAttributes;
}

export interface ExposureData {
  id: number;
  hazard_type_display: string;
  country_details: CountryDetail;
  iso3: string;
  hazard_type: HazardTypes;
  note: string | null;
  annual_average_displacement: number | null;
  january: number | null;
  february: number | null;
  march: number | null;
  april: number | null;
  may: number | null;
  june: number | null;
  july: number | null;
  august: number | null;
  september: number | null;
  october: number | null;
  november: number | null;
  december: number | null;
}

interface THReport {
  id: number;
  country: number;
  country_details: CountryDetail;
  hazard_level: 'low' | 'medium' | 'high';
  hazard_level_display: string;
  hazard_type: HazardTypes;
  hazard_type_display: string;
  information: string;
}

export interface SeasonalResponse {
  return_period_data: ReturnPeriodData[];
  hazard_info: THReport[];
  idmc: IDMCData[];
  inform: INFORMData[];
  inform_seasonal: INFORMSeasonalData[];
  ipc_displacement_data: IPCData[];
  raster_displacement_data: ExposureData[];
}

interface Centroid {
  type: string;
  coordinates: number[];

}

export const tableKeySelector = (o: PossibleEarlyActionsResponse) => o.id;
interface Bbox {
  type: string;
  coordinates: number[];
  centroid: Centroid;
  region: number;
}
export interface PossibleEarlyActionsResponse {
  id: number;
  hazard_type_display: string;
  country_details: CountryDetail;
  name: string;
  iso: string;
  iso3: string;
  bbox: Bbox;
  hazard_type: string;
  early_actions: string;
  hazard_name: string;
  location: string;
  sector: string;
  intended_purpose: string;
  organization: string;
  budget: number;
  cost: number;
  implementation_date: string;
  implementation_date_raw: string;
  timeframe: string;
  timeframe_raw: string;
  effective_time: string;
  effective_time_raw: string;
  number_of_people_covered: number;
  number_of_people_at_risk: number;
  scalability: string;
  cross_cutting: string;
  resources_used: string;
  impact_actions: string;
  evidence_of_success: string;
  resource: string;
  link_to_resources: string;
  exist_in_hub: boolean;
  country: number;
}

export const monthKeys = [
  'january',
  'february',
  'march',
  'april',
  'may',
  'june',
  'july',
  'august',
  'september',
  'october',
  'november',
  'december',
] as const;

export const chartMargin = {
  top: 20,
  right: 10,
  left: 20,
  bottom: 0,
};

export function formatNumber(value: number) {
  const {
    number,
    normalizeSuffix,
  } = formattedNormalize(value, Lang.en);

  const integer = Math.floor(number);
  const fraction = number - integer;

  let precision = 2;
  const absoluteValue = Math.abs(number);
  if (absoluteValue < 1) {
    precision = Math.ceil(-Math.log10(absoluteValue)) + 1;
  }

  if (integer > 100) {
    // 140.1234M -> 140 M
    precision = 0;
  } else {
    // 96.0334M -> 96.03 M
    if (fraction > 0.01) {
      precision = 2;
    } else {
      precision = 0;
    }
  }

  if (normalizeSuffix) {
    return `${number.toFixed(precision)} ${normalizeSuffix}`;
  }

  if (fraction) {
    return String(number.toFixed(precision));
  }

  return addSeparator(number) ?? '';
}


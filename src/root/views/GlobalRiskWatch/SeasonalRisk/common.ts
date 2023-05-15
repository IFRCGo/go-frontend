import { listToMap } from '@togglecorp/fujs';
import { ImminentHazardTypes, SeasonalHazardTypes } from '#types';
import {
  COLOR_RED,
  COLOR_ORANGE,
  COLOR_YELLOW,
  COLOR_LIGHT_YELLOW,
  COLOR_DARK_RED,
} from '#utils/map';
import {
  COLOR_FLOOD,
  COLOR_CYCLONE,
  COLOR_DROUGHT,
  COLOR_FOOD_INSECURITY,
  COLOR_EARTHQUAKE,
} from '#utils/risk';

export type RiskType = 'absolute' | 'normalized';

export function labelSelector<D extends { label: React.ReactNode }>(d: D) {
  return d.label;
}

export function valueSelector<D extends { value: string }>(d: D) {
  return d.value;
}

export const informHazards: SeasonalHazardTypes[] = [
  'FL',
  'TC',
  'DR',
];

export const exposureHazards: SeasonalHazardTypes[] = [
  'FI',
  'TC',
  'FL',
];

export const displacementHazards: SeasonalHazardTypes[] = [
  'TC',
  'FL',
];

export const seasonalHazardTypeToNameMap: Record<SeasonalHazardTypes, string> = {
  FL: 'Flood',
  TC: 'Cyclone',
  DR: 'Drought',
  FI: 'Food Insecurity',
  EQ: 'Earthquake',
};

export const riskTypeOptions: {
  label: string;
  value: RiskType;
}[] = [
    { label: 'Absolute', value: 'absolute' },
    { label: 'Normalised', value: 'normalized' },
];


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

export type MonthKey = (typeof monthKeys)[number];

export const monthOptions: {
  value: MonthKey;
  label: string;
}[] = [
  { label: 'January', value: 'january' },
  { label: 'February', value: 'february' },
  { label: 'March', value: 'march' },
  { label: 'April', value: 'april' },
  { label: 'May', value: 'may' },
  { label: 'June', value: 'june' },
  { label: 'July', value: 'july' },
  { label: 'August', value: 'august' },
  { label: 'September', value: 'september' },
  { label: 'October', value: 'october' },
  { label: 'November', value: 'november' },
  { label: 'December', value: 'december' },
];

export const hazardTypeOptions: {
  value: 'TC' | 'FL' | 'FI' | 'DR';
  label: string;
}[] = [
  { label: 'Cyclone', value: 'TC' },
  { label: 'Flood', value: 'FL' },
  { label: 'Food Insecurity', value: 'FI' },
  { label: 'Drought', value: 'DR' },
];

export type HazardValueType = (typeof hazardTypeOptions)[number]['value'];
export type Writable<T> = { -readonly [P in keyof T]: T[P] };

export const hazardTypeToLabelMap = listToMap(
  hazardTypeOptions,
  h => h.value,
  h => h.label,
);

export interface RiskData {
  countryIso3: string;
  hazardType: ImminentHazardTypes;
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

export const riskMetricOptions: {
  value: 'informRiskScore' | 'exposure' | 'displacement';
  label: string;
}[] = [
  { label: 'INFORM Risk Score', value: 'informRiskScore' },
  { label: 'People Exposed', value: 'exposure' },
  { label: 'People at Risk of Displacement', value: 'displacement' },
];

export const riskMetricMap = listToMap(
  riskMetricOptions,
  d => d.value,
  d => d.label,
);

export interface CountryDetail {
  id: number;
  iso: string;
  iso3: string;
  name: string;
  region: number;
  region_details : {
    id: number;
    name: number;
    name_display: string;
  }
}

type DisplacmentHazardType = Extract<SeasonalHazardTypes, 'FL' | 'TC'>;

export interface MonthlyValues {
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

export interface IDMCData extends MonthlyValues {
  confidence_type: 'low' | 'medium' | 'high' | string;
  confidence_type_display: string;
  country: number;
  country_details: CountryDetail;
  hazard_type: DisplacmentHazardType;
  hazard_type_display: string;
  id: number;
  iso3: string
  note: string | null;
  annual_average_displacement: number | null;
}

export interface IPCData {
  id: number;
  country: number;
  country_details: CountryDetail;
  hazard_type: SeasonalHazardTypes;
  hazard_type_display: string;
  month: number;
  total_displacement: number;
  year: number;
  analysis_date: string;
  estimation_type: 'current' | 'first_projection' | 'second_projection';
}

type InformHazardType = Extract<SeasonalHazardTypes, 'DR' | 'FL' | 'TC'>;

export interface InformSeasonalData extends MonthlyValues {
  country: number;
  country_details: CountryDetail;
  hazard_type: InformHazardType;
  hazard_type_display: string;
  id: number;
}

export interface InformData {
  country: number;
  country_details: CountryDetail;
  hazard_type: InformHazardType;
  hazard_type_display: string;
  id: number;
  risk_score: number;
}

export interface RiskScoreData extends MonthlyValues {
  id: number;
  hazard_type_display: string;
  country_details: CountryDetail;
  hazard_type: InformHazardType;
  yearly_sum: number | null;
  lcc: number;
  population_in_thousands: number;
  country: number;
}

type ExposureHazardType = Extract<SeasonalHazardTypes, 'FL' | 'TC' | 'FI'>
export interface ExposureData extends MonthlyValues {
  id: number;
  hazard_type_display: string;
  country: number;
  country_details: CountryDetail;
  iso3: string;
  hazard_type: ExposureHazardType;
  note: string | null;
  annual_average_displacement: number | null;
}

// CD: Cyclonic Wind
// EQ: Earthquake
// SS: Storm Surge
// TS: Tsunami
// FL: Flood

/*
interface LossValue {
  economic_loss?: number;
  population_displacement?: number;
}
*/

// type ReturnPeriodHazard = 'CD' | 'EQ' | 'SS' | 'TS' | 'FL';

/*
interface ReturnPeriodData {
  country: number;
  country_details: CountryDetail;
  fifty_years: LossValue;
  five_hundred_years: LossValue;
  hazard_type: ReturnPeriodHazard;
  hazard_type_display: string;
  hundred_years: LossValue;
  id: number;
  one_thousand_five_hundred_years: LossValue;
  one_thousand_years: LossValue;
  ten_years: LossValue;
  twenty_five_years: LossValue;
  twenty_years: LossValue;
  two_hundred_fifty_years: LossValue;
}
*/

export interface SeasonalResponse {
  idmc: IDMCData[];
  ipc_displacement_data: IPCData[];
  raster_displacement_data: ExposureData[];

  // inform: InformData;
  // inform_seasonal: InformSeasonalData[];
  // return_period_data: ReturnPeriodData;
}

export type RiskMetricType = (typeof riskMetricOptions)[number]['value'];

export const RISK_LOW_COLOR = '#c7d3e0';
export const RISK_HIGH_COLOR = '#f5333f';

export const INFORM_RISK_VERY_LOW = 0;
export const INFORM_RISK_LOW = 2;
export const INFORM_RISK_MEDIUM = 3.5;
export const INFORM_RISK_HIGH = 5;
export const INFORM_RISK_VERY_HIGH = 6.5;
export const INFORM_RISK_MAXIMUM = 10;

export const COLOR_BLUE_GRADIENT_1 = '#e0e3e7';
export const COLOR_BLUE_GRADIENT_2 = '#ccd2d9';
export const COLOR_BLUE_GRADIENT_3 = '#aeb7c2';
export const COLOR_BLUE_GRADIENT_4 = '#99a5b3';
export const COLOR_BLUE_GRADIENT_5 = '#7d8b9d';
export const COLOR_BLUE_GRADIENT_6 = '#67788d';
export const COLOR_BLUE_GRADIENT_7 = '#4d617a';
export const COLOR_BLUE_GRADIENT_8 = '#344b67';
export const COLOR_BLUE_GRADIENT_9 = '#011e41';

export const displacementColors = [
  COLOR_BLUE_GRADIENT_1,
  COLOR_BLUE_GRADIENT_2,
  COLOR_BLUE_GRADIENT_3,
  COLOR_BLUE_GRADIENT_4,
  COLOR_BLUE_GRADIENT_5,
  COLOR_BLUE_GRADIENT_6,
  COLOR_BLUE_GRADIENT_7,
  COLOR_BLUE_GRADIENT_8,
  COLOR_BLUE_GRADIENT_9,
];

export const exposureColors = [
  COLOR_BLUE_GRADIENT_1,
  COLOR_BLUE_GRADIENT_2,
  COLOR_BLUE_GRADIENT_3,
  COLOR_BLUE_GRADIENT_4,
  COLOR_BLUE_GRADIENT_5,
  COLOR_BLUE_GRADIENT_6,
  COLOR_BLUE_GRADIENT_7,
  COLOR_BLUE_GRADIENT_8,
  COLOR_BLUE_GRADIENT_9,
];

export const informLegendData = [
  {
    color: COLOR_LIGHT_YELLOW,
    label: `Very low (${INFORM_RISK_VERY_LOW} - ${INFORM_RISK_LOW-0.1})`,
  },
  {
    color: COLOR_YELLOW,
    label: `Low (${INFORM_RISK_LOW} - ${INFORM_RISK_MEDIUM-0.1})`,
  },
  {
    color: COLOR_ORANGE,
    label: `Medium (${INFORM_RISK_MEDIUM} - ${INFORM_RISK_HIGH-0.1})`,
  },
  {
    color: COLOR_RED,
    label: `High (${INFORM_RISK_HIGH} - ${INFORM_RISK_VERY_HIGH})`,
  },
  {
    color: COLOR_DARK_RED,
    label: `Very high (${INFORM_RISK_VERY_HIGH} - ${INFORM_RISK_MAXIMUM})`,
  },
];

export const MAX_PRETTY_BREAKS = 5;

export const hazardTypeColorMap: Record<SeasonalHazardTypes, string> = {
  FL: COLOR_FLOOD,
  TC: COLOR_CYCLONE,
  DR: COLOR_DROUGHT,
  FI: COLOR_FOOD_INSECURITY,
  EQ: COLOR_EARTHQUAKE,
};


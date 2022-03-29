import { listToMap } from '@togglecorp/fujs';
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

export type ReturnPeriodHazardTypes = 'SS' | 'WD' | 'FL' | 'CD';

export interface ReturnPeriodData {
  country: number;
  country_details: CountryDetail ;
  hazard_type: ReturnPeriodHazardTypes;
  hazard_type_display: string;
  id: number;
}

export interface IDMCReturnPeriodData extends ReturnPeriodData {
  annual_average_displacement: number
  return_period_20_years: number | null;
  return_period_50_years: number | null;
  return_period_100_years: number | null;
  return_period_250_years: number | null;
  return_period_500_years: number | null;
}

export interface GARReturnPeriodData extends ReturnPeriodData {
  economic_loss_return_period_20_years: number | null;
  economic_loss_return_period_50_years: number | null;
  economic_loss_return_period_100_years: number | null;
  economic_loss_return_period_250_years: number | null;
  economic_loss_return_period_500_years: number | null;
  population_exposure_return_period_25_years: number | null;
  population_exposure_return_period_50_years: number | null;
  population_exposure_return_period_100_years: number | null;
  population_exposure_return_period_200_years: number | null;
  population_exposure_return_period_500_years: number | null;
  population_exposure_return_period_1000_years: number | null;
}

interface ReturnPeriodAttributes {
  economic_loss: number;
  population_exposure: number;
  population_displacement: number;
}

export interface NewReturnPeriodData {
  country: number;
  country_details: CountryDetail;
  hazard_type: HazardTypes;
  hazard_type_display: string;
  id: number;
  ten_years: ReturnPeriodAttributes;
  twenty_years: ReturnPeriodAttributes;
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
  gar_return_period_data: NewReturnPeriodData[];
  hazard_info: THReport[];
  idmc: IDMCData[];
  idmc_return_period: IDMCReturnPeriodData[];
  inform: INFORMData[];
  inform_seasonal: INFORMSeasonalData[];
  ipc_displacement_data: IPCData[];
  raster_displacement_data: ExposureData[];
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

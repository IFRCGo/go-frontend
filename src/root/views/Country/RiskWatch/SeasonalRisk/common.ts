import { HazardTypes } from '#types';

export const hazardTypeOptions = [
  { label: 'Cyclone', value: 'CY' },
  { label: 'Flood', value: 'FL' },
  { label: 'Food Insecurity', value: 'FI' },
  { label: 'Drought', value: 'DG' },
] as const;

export type HazardValueType = (typeof hazardTypeOptions)[number]['value'];
export type Writeable<T> = { -readonly [P in keyof T]: T[P] };

export interface RiskData {
  hazardType: HazardTypes;
  hazardTypeDisplay: string;
  displacement: {
    annualAverage: number | null;
    monthly: (number | null)[];
  }
  informRiskScore: number | null;
  exposure: number | null;
}

export const riskMetricOptions = [
  { label: 'Inform Risk Score', value: 'informRiskScore' },
  { label: 'People Exposed', value: 'exposure' },
  { label: 'People at Risk of Displacement', value: 'displacement' },
] as const;


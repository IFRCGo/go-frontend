export const hazardTypeOptions = [
  { label: 'Cyclone', value: 'CY' },
  { label: 'Flood', value: 'FL' },
  { label: 'Food Insecurity', value: 'FI' },
  { label: 'Drought', value: 'DG' },
] as const;

export type HazardValueType = (typeof hazardTypeOptions)[number]['value'];
export type Writeable<T> = { -readonly [P in keyof T]: T[P] };

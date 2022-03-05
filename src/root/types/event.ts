import { CountryMini } from './country';

export interface Event {
  // TODO
  appeals: number[]
  contacts: number[]

  countries: CountryMini[];
  auto_generated: boolean;
  created_at: string;
  disaster_start_date: string;

  // TODO: Complete this
}

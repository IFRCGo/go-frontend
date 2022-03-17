import {
  CountryMini,
  DistrictMini,
} from './country';

import {
  UserMini,
} from './user';

export interface Disaster {
  id: number;
  name: string;
  summary: string;
}

export interface EventDetailForProject {
  id: number;
  name: string;
}

export interface EventMini {
  id: number;
  name: string;
  dtype: Disaster;
  slug: string | null;
  auto_generated_source: string | null;
}

export interface ProjectFormFields {
  actual_expenditure: number;
  budget_amount: number;
  dtype: number;
  end_date: string;
  event: number | null;
  name: string;
  operation_type: number;
  primary_sector: number;
  programme_type: number;
  project_country: number;
  project_districts: number[];
  reached_female: number | null;
  reached_male: number | null;
  reached_other: number | null;
  reached_total: number | null;
  reporting_ns: number;
  secondary_sectors: number[];
  start_date: string;
  status: number;
  target_female: number | null;
  target_male: number | null;
  target_other: number | null;
  target_total: number | null;
  visibility: string;
}

export interface Project {
  actual_expenditure: number;
  budget_amount: number;
  dtype: number;
  dtype_detail: Disaster;
  end_date: string;
  event: number | null;
  event_detail: EventDetailForProject | null;
  id: number;
  modified_at: string;
  modified_by: number | null;
  modified_by_detail: UserMini | null;
  name: string;
  operation_type: number;
  operation_type_display: string;
  primary_sector: number;
  primary_sector_display: string;
  programme_type: number;
  programme_type_display: string;
  project_country: number;
  project_country_detail: CountryMini;
  project_districts: number[];
  project_districts_detail: DistrictMini[];
  reached_female: number | null;
  reached_male: number | null;
  reached_other: number | null;
  reached_total: number | null;
  regional_project: null;
  regional_project_detail: null;
  reporting_ns: number;
  reporting_ns_detail: CountryMini;
  secondary_sectors: number[];
  secondary_sectors_display: string[];
  start_date: string;
  status: number;
  status_display: string;
  target_female: number | null;
  target_male: number | null;
  target_other: number | null;
  target_total: number | null;
  user: number;
  visibility: string;
  visibility_display: string;
}

interface Point {
  description: string;
  latitude: number;
  longitude: number;
}

interface Activity {
  id: number;
  supplies: Record<number, number>;
  custom_supplies: Record<string, number>;
  points: Point[];
  sector_details: {
    id: number;
    title: string;
    order: number;
  },
  action_details: {
    id: number;
    title: string;
    order: number;
  } | null;
  is_simplified_report: boolean;
  people_households: 'people' | 'households';
  household_count: number | null;
  amount: number | null;
  item_count: number | null;
  people_count: number | null;
  male_count: number | null;
  female_count: number | null;
  male_0_5_count: number | null;
  male_6_12_count: number | null;
  male_13_17_count: number | null;
  male_18_29_count: number | null;
  male_30_39_count: number | null;
  male_40_49_count: number | null;
  male_50_59_count: number | null;
  male_60_69_count: number | null;
  male_70_plus_count: number | null;
  female_0_5_count: number | null;
  female_6_12_count: number | null;
  female_13_17_count: number | null;
  female_18_29_count: number | null;
  female_30_39_count: number | null;
  female_40_49_count: number | null;
  female_50_59_count: number | null;
  female_60_69_count: number | null;
  female_70_plus_count: number | null;
  other_0_5_count: number | null;
  other_6_12_count: number | null;
  other_13_17_count: number | null;
  other_18_29_count: number | null;
  other_30_39_count: number | null;
  other_40_49_count: number | null;
  other_50_59_count: number | null;
  other_60_69_count: number | null;
  other_70_plus_count: number | null;
  details: string;
  custom_action: string | null;
  point_count: number | null;
  sector: number;
  action: number | null;
}

export interface EmergencyProjectResponse {
  id: number;
  country: number;
  created_by_details: UserMini;
  modified_by_details: UserMini | null;
  event_details: {
    dtype: number;
    id: number;
    parent_event: number | null;
    name: string;
    slug: string | null;
  };
  reporting_ns_details: CountryMini;
  deployed_eru_details: {
    id: number;
    type: number;
    type_display: string;
    units: number | null;
    equipment_units: number | null;
    eru_owner_details: {
      id: number;
      national_society_country_details: CountryMini;
    }
  }
  districts_details: DistrictMini[];
  activities: Activity[];
  activity_lead_display: string;
  status_display: string;
  country_details: CountryMini;
  title: string;
  created_at: string;
  modified_at: string;
  activity_lead: 'deployed_eru' | 'national_society';
  reporting_ns_contact_name: string | null;
  reporting_ns_contact_role: string | null;
  reporting_ns_contact_email: string | null;
  start_date: string;
  end_date: string | null;
  status: string;
  created_by: number;
  modified_by: number | null;
  event: number;
  reporting_ns: number | null;
  deployed_eru: number | null;
  districts: number[];
}

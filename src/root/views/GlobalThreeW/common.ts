export interface NSOngoingProjectStat {
  id: number;
  iso3: string;
  ongoing_projects: number;
  target_total: number;
  society_name: string;
  name: string;
  operation_types: number[];
  operation_types_display: string[];
  budget_amount_total: number;
  projects_per_sector: {
    primary_sector: number;
    primary_sector_display: string;
    count: number;
  }[];
}


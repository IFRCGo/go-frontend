import { Project } from '#types';

export const emptyProjectList: Project[] = [];

export interface LabelValue {
  label: string;
  value: number;
}

export const PROJECT_STATUS_COMPLETED = 2;
export const PROJECT_STATUS_ONGOING = 1;
export const PROJECT_STATUS_PLANNED = 0;


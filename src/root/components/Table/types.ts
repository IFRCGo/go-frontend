export enum SortDirection {
  'asc' = 'Ascending',
  'dsc' = 'Descending',
}
export enum FilterType {
  'string' = 'string',
  'number' = 'number',
}

export interface BaseHeader {
  className?: string;
  titleClassName?: string;
  titleContainerClassName?: string;
  name: string;
  index: number;

  title?: string;
}

export interface BaseCell {
  className?: string;
  name: string;
}

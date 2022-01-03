import { createStringColumn } from "#components/Table/predefinedColumns";
import { InformalUpdateTableFields } from "#views/InformalUpdateApplicationForm/common";
import { Strings } from "#types";

export const getBaseColumns = (strings: Strings) => ([
  createStringColumn<InformalUpdateTableFields, string | number>(
    'last_update',
    'Last Update',
    (item) => item?.last_date,
  ),
  createStringColumn<InformalUpdateTableFields, string | number>(
    'report',
    'Report',
    (item) => item?.report,
  ),
  createStringColumn<InformalUpdateTableFields, string | number>(
    'hazard_type',
    'Disaster Type',
    (item) => item?.hazard_type,
  ),
  createStringColumn<InformalUpdateTableFields, string | number>(
    'country',
    'Country',
    (item) => item?.country,
  ),
]);

import { createDateColumn, createStringColumn } from "#components/Table/predefinedColumns";
import { InformalUpdateTableFields } from "#views/InformalUpdateApplicationForm/common";
import { Strings } from "#types";

export const getBaseColumns = (strings: Strings) => ([
  createDateColumn<InformalUpdateTableFields, string | number>(
    'last_update',
    'Last Update',
    (item) => {
      const date = new Date(item?.modified_at);
      return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    },
  ),
  createStringColumn<InformalUpdateTableFields, string | number>(
    'report',
    'Report',
    (item) => item?.title,
  ),
  createStringColumn<InformalUpdateTableFields, string | number>(
    'hazard_type',
    'Disaster Type',
    (item) => item?.hazard_type_details?.name
  ),
  createStringColumn<InformalUpdateTableFields, string | number>(
    'country_district',
    'Country',
    (item) => {
      const splitTitle = item?.title.split('-');
      return splitTitle.slice(0, splitTitle.length - 1).join("-");

    }
  ),
]);

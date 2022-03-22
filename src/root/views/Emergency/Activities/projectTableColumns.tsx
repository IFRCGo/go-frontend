import React from 'react';
import {
  createStringColumn,
  createDateColumn,
  createActionColumn,
  createNumberColumn,
} from '#components/Table/predefinedColumns';
import {
  IoPencil,
  IoCopy,
  IoOpenOutline,
} from 'react-icons/io5';
import DropdownMenuItem from '#components/DropdownMenuItem';
import { EmergencyProjectResponse } from '#types';
import { getPeopleReached } from './useProjectStats';

type P = EmergencyProjectResponse;
type K = string | number;

export const getColumns = (actionColumnHeaderClassName?: string) => ([
  createStringColumn<P, K>(
    'national_society_eru',
    'National Society / ERU',
    (item) => (
      item.activity_lead === 'deployed_eru'
        ? item.deployed_eru_details
          ?.eru_owner_details
          ?.national_society_country_details
          ?.society_name
        : item.reporting_ns_details?.society_name
    ),
  ),
  createStringColumn<P, K>(
    'title',
    'Title',
    (item) => item.title,
  ),
  createDateColumn<P, K>(
    'start_date',
    'Start date',
    (item) => item.start_date,
  ),
  createStringColumn<P, K>(
    'country',
    'Country',
    (item) => item.country_details?.name,
  ),
  createStringColumn<P, K>(
    'districts',
    'Province/Region',
    (item) => item.districts_details?.map(d => d.name).join(', '),
  ),
  createStringColumn<P, K>(
    'status',
    'Status',
    (item) => item.status_display,
  ),
  createNumberColumn<P, K>(
    'people_reached',
    'People Reached',
    (item) => getPeopleReached(item),
  ),
  createActionColumn(
    'project_actions',
    (rowKey: number | string, p: EmergencyProjectResponse) => ({
      extraActions: (
        <>
          <DropdownMenuItem
            href={`/emergency-three-w/${rowKey}/`}
            icon={<IoOpenOutline />}
            label="View Details"
          />
          <DropdownMenuItem
            href={`/emergency-three-w/${rowKey}/edit/`}
            icon={<IoPencil />}
            label="Edit"
          />
          <DropdownMenuItem
            href={`/three-w/new/`}
            icon={<IoCopy />}
            label="Duplicate"
            state={{
              initialValue: p,
              operationType: 'emergency_response',
            }}
          />
        </>
      ),
    }),
    { headerContainerClassName: actionColumnHeaderClassName },
  ),
]);

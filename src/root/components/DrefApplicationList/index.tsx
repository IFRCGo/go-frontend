import React from 'react';
import { History } from 'history';
import {
  EntriesAsList,
  Error,
  PartialForm,
} from '@togglecorp/toggle-form';
import { ArrowDropRightLineIcon } from '@ifrc-go/icons';

import LanguageContext from '#root/languageContext';
import Container from '#components/Container';
import BlockLoading from '#components/block-loading';
import SelectInput from '#components/SelectInput';
import Pager from '#components/Pager';
import EmptyMessage from '#components/EmptyMessage';
import useReduxState from '#hooks/useReduxState';
import useInputState from '#hooks/useInputState';
import { compareLabel } from '#utils/common';
import {
  ListResponse,
  useRequest,
} from '#utils/restRequest';

import DrefApplicationTable from './DrefApplicationTable';
import useDrefApplicationListOptions from './useDrefApplicationListOptions';
import styles from './styles.module.scss';
import ButtonLikeLink from '#components/ButtonLikeLink';

export interface BaseProps {
  id: number;
  title: string;
  appeal_code: string;
  created_at: string;
  submission_to_geneva: string;
  is_published: boolean;
  type_of_dref?: number;
  type_of_dref_display: string;
  type_of_onset_display: string;
  operational_update_number: number;
  application_type: string;
  application_type_display: string;
  status: string;
  has_ops_update: boolean;
  has_final_reprot: boolean;
  country_details: {
    id: number;
    country: number;
    district: number[];
    name: string;
  };
}

export interface DrefApplicationResponse extends BaseProps {
  is_final_report_created: boolean;
  operational_update_details: BaseProps[];
  final_report_details: BaseProps;
}

export interface TableDataDetail extends BaseProps {
  firstLevel: BaseProps[];
  secondLevel: BaseProps[];
}

const ITEM_PER_PAGE = 6;

interface DrefImportFields {
  file: number;
  dref: number;
  id: number;
}

type Value = PartialForm<DrefImportFields>;
interface Props {
  history: History;
  value: Value,
  error: Error<Value> | undefined;
  onValueChange: (...entries: EntriesAsList<Value>) => void;
}


function DrefApplicationList(props: Props) {
  const {history} = props;
  const { drefTypeOptions,fetchingDrefOptions } = useDrefApplicationListOptions();
  const { strings } = React.useContext(LanguageContext);
  const allCountries = useReduxState('allCountries');
  const [country, setCountry] = useInputState<number | undefined>(undefined);
  const [drefType, setDrefType] = React.useState<number>();
  const [dateRange, setDateRange] = React.useState({
    start_date:'',
    end_date:'',
  });
  const countryOptions = React.useMemo(
    () => allCountries?.data?.results.filter((c) => (
      c.independent && !c.is_deprecated && c.name
    )).map((c) => ({
        value: c.id,
        label: c.name,
      })).sort(compareLabel) ?? [],
    [allCountries],
  ); // a code duplication can be found in per-account.js

  const [inProgressDrefActivePage, setInProgressDrefActivePage] = React.useState(1);

  const {
    pending: drefPending,
    response: drefResponse,
    retrigger: refetchDrefList,
  } = useRequest<ListResponse<DrefApplicationResponse>>({
    url: 'api/v2/active-dref/',
    query: {
      country,
      type_of_dref: drefType,
      // created_at__lte: '',
      // created_at__gte: '',
      limit: ITEM_PER_PAGE,
      offset: ITEM_PER_PAGE * (inProgressDrefActivePage - 1),
    },
  });

  const data = React.useMemo(() => {

    let rowData = [];
    const hasOpsUpdateOnly = drefResponse?.results.filter(
      (d) => d.operational_update_details.length > 0 && !d.final_report_details);

    const opsUpdateData = hasOpsUpdateOnly?.map(
      (d) => {
        const opsLatest = d.operational_update_details?.sort(
          (a,b) => b.operational_update_number - a.operational_update_number)[0];

        const filterSubRowOpsUpdate = d.operational_update_details.filter(
          (ops) => ops.id !== opsLatest.id
        );
        let obj = {
          ...opsLatest,
          firstLevel: filterSubRowOpsUpdate,
          secondLevel: [{
            id: d.id,
            created_at: d.created_at,
            title: d.title,
            appeal_code: d.appeal_code,
            type_of_dref_display: d.type_of_dref_display,
            submission_to_geneva: d.submission_to_geneva,
            country_details: d.country_details,
            application_type: d.application_type,
            application_type_display: d.application_type_display,
            is_published: d.is_published,
            has_ops_update: d.has_ops_update,
            has_final_reprot: d.has_final_reprot,
          }],
        };
        return obj;
      });
    rowData.push(opsUpdateData);

    const hasfinalReportOnly = drefResponse?.results.filter(
      (d) => !d.operational_update_details && d.final_report_details);
    const finalReportData = hasfinalReportOnly?.map(
      (d) => {
        let obj = {
          ...d.final_report_details,
          firstLevel: [],
          secondLevel: [{
            id: d.id,
            created_at: d.created_at,
            title: d.title,
            appeal_code: d.appeal_code,
            type_of_dref_display: d.type_of_dref_display,
            submission_to_geneva: d.submission_to_geneva,
            country_details: d.country_details,
            application_type: d.application_type,
            application_type_display: d.application_type_display,
            is_published: d.is_published,
            has_ops_update: d.has_ops_update,
            has_final_reprot: d.has_final_reprot,
          }],
        };
        return obj;
      });
    rowData.push(finalReportData);

    const hasfinalReportAndOpsUpdate = drefResponse?.results.filter(
      (d) => d.operational_update_details && d.final_report_details);
    const finalReportAndOpsUpdateData = hasfinalReportAndOpsUpdate?.map(
      (d) => {
        let obj = {
          ...d.final_report_details,
          firstLevel: d.operational_update_details.map((ops) => ({
            ...ops,
          })),
          secondLevel:[{
            id: d.id,
            created_at: d.created_at,
            title: d.title,
            appeal_code: d.appeal_code,
            type_of_dref_display: d.type_of_dref_display,
            submission_to_geneva: d.submission_to_geneva,
            country_details: d.country_details,
            application_type: d.application_type,
            application_type_display: d.application_type_display,
            is_published: d.is_published,
            has_ops_update: d.has_ops_update,
            has_final_reprot: d.has_final_reprot,
          }],
        };
        return obj;
      });
    rowData.push(finalReportAndOpsUpdateData);

    const hasDrefOnly = drefResponse?.results.filter((d) => d.operational_update_details.length === 0 && !d.final_report_details);
    const drefData = hasDrefOnly?.map(
      (d) => {
        let obj = {
          ...d,
          firstLevel: [],
          secondLevel: [],
        };
        return obj;
      });
    rowData.push(drefData);

    return rowData.flat() as TableDataDetail[];

  },[drefResponse]);

  const pending = drefPending || fetchingDrefOptions;

  const filters = React.useMemo(
    () => (
      <>
        <SelectInput
          name={undefined}
          className={styles.countryFilter}
          placeholder="Select Country"
          options={countryOptions}
          value={country}
          onChange={setCountry}
          isClearable
          disabled={pending}
        />
        <SelectInput
          name={undefined}
          className={styles.countryFilter}
          placeholder="Type of DREF"
          options={drefTypeOptions}
          value={drefType}
          onChange={setDrefType}
          isClearable
          disabled={pending}
        />
      </>

    ),[
      drefType,
      setDrefType,
      drefTypeOptions,
      country,
      countryOptions,
      setCountry,
      pending,
    ]
  );

  return (
    <Container
      className={styles.drefApplicationList}
      contentClassName={styles.content}
      descriptionClassName={styles.newDrefButton}
      description={
        <ButtonLikeLink
          variant='secondary'
          to='/dref-application/new/'
        >
          Start a New DREF Application
        </ButtonLikeLink>
      }
    >

      <Container
        heading={strings.drefTableHeading}
        description={filters}
        descriptionClassName={styles.filters}
        actions={
          <ButtonLikeLink
            variant="transparent"
            to="#"
            disabled
          >
            View previous DREF operations
            <ArrowDropRightLineIcon fontSize='2rem' />
          </ButtonLikeLink>
        }
        footerActions={drefResponse && (
          <Pager
            activePage={inProgressDrefActivePage}
            onActivePageChange={setInProgressDrefActivePage}
            itemsCount={drefResponse.count}
            maxItemsPerPage={ITEM_PER_PAGE}
          />
        )}
        sub
      >
        {pending && <BlockLoading />}
        {!pending && data.length > 0 && (
          <DrefApplicationTable
            className={styles.drefTable}
            data={data}
            refetch={refetchDrefList}
            history={history}
          />
        )}
        {!drefPending && drefResponse?.results?.length === 0 && data.length === 0 && (
          <EmptyMessage />
        )}
        {!pending && !drefResponse && (
          <div className={styles.error}>
            {strings.drefFetchingErrorMessage}
          </div>
        )}
      </Container>
    </Container>
  );
}

export default DrefApplicationList;


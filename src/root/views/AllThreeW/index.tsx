import React from 'react';
import { _cs } from '@togglecorp/fujs';
import type { Location } from 'history';
import { Link } from 'react-router-dom';
import {
  MdSearch,
  MdEdit,
} from 'react-icons/md';

import BlockLoading from '#components/block-loading';
import Translate from '#components/Translate';
import Page from '#components/Page';
import Pager from '#components/Pager';
import BreadCrumb from '#components/breadcrumb';
import Container from '#components/Container';
import DropdownMenuItem from '#components/DropdownMenuItem';
import Table from '#components/Table';
import { createActionColumn } from '#components/Table/predefinedColumns';
import {
  getInCountryProjectColumns,
  getNSProjectColumns,
  getAllProjectColumns,
} from '#views/Country/ThreeW/projectTableColumns';
import { projectKeySelector } from '#views/Country/ThreeW/common';
import LanguageContext from '#root/languageContext';
import {
  ListResponse,
  useRequest,
} from '#utils/restRequest';
import {
  Project,
  Strings,
} from '#types';

import styles from './styles.module.scss';

const ITEM_PER_PAGE = 20;

interface Props {
  className?: string;
  location: Location;
}

function AllThreeW(props: Props) {
  const {
    className,
    location,
  } = props;

  const [query, queryType] = React.useMemo(() => {
    let baseQuery;
    let queryType: 'country' | 'ns' | undefined;

    if (location?.search) {
      const [q1, q2] = location.search.split('=');

      if (q1 === '?country') {
        baseQuery = { country: q2 };
        queryType = 'country';
      }

      if (q1 === '?reporting_ns') {
        baseQuery = { reporting_ns :+q2 };
        queryType = 'ns';
      }
    }

    return [baseQuery, queryType] as const;
  }, [location?.search]);

  const { strings } = React.useContext(LanguageContext);
  const crumbs = React.useMemo(() => [
    {link: location?.pathname, name: strings.breadCrumbAllThreeW},
    {link: '/', name: strings.breadCrumbHome},
  ], [strings.breadCrumbHome, strings.breadCrumbAllThreeW, location]);

  const [activePage, setActivePage] = React.useState(1);

  const {
    pending,
    response,
  } = useRequest<ListResponse<Project>>({
    url: 'api/v2/project/',
    query: {
      limit: ITEM_PER_PAGE,
      offset: ITEM_PER_PAGE * (activePage - 1),
      ...query,
    },
  });

  const columns = React.useMemo(() => {
    const actionsColumn = createActionColumn(
      'actions',
      (rowKey: number | string, prj: Project) => ({
        extraActions: (
          <>
            <DropdownMenuItem
              href={`/three-w/${prj.id}/`}
              label={strings.projectListTableViewDetails}
              icon={<MdSearch />}
            />
            <DropdownMenuItem
              href={`/three-w/${prj.id}/edit/`}
              icon={<MdEdit />}
              label={strings.projectListTableEdit}
            />
          </>
        ),
      }),
    );

    if (queryType === 'ns') {
      return [
        ...getNSProjectColumns(strings),
        actionsColumn,
      ];
    }

    if (queryType === 'country') {
      return [
        ...getInCountryProjectColumns(strings),
        actionsColumn,
      ];
    }

    return [
      ...getAllProjectColumns(strings),
      actionsColumn,
    ];
  }, [queryType, strings]);

  const headingStringId: keyof Strings = React.useMemo(() => {
    if (pending) {
      return 'allThreeWPageHeading';
    }

    if (queryType === 'country') {
      return 'allThreeWInCountryPageHeading';
    }

    if (queryType === 'ns') {
      return 'allThreeWNSPageHeading';
    }

    return 'allThreeWPageHeading';
  }, [queryType, pending]);

  const countryName = response && response.results
    ? (response.results[0]?.project_country_detail?.name ?? '--')
    : '--';

  const countryUrl = response && response.results
    ? `/countries/${response.results[0]?.project_country}#3w`
    : '';

  const nsName = response && response.results
    ? (response.results[0]?.reporting_ns_detail?.society_name ?? '--')
    : '--';

  const nsUrl = response && response.results
    ? `/countries/${response.results[0]?.reporting_ns}#3w`
    : '';

  return (
    <Page
      className={_cs(styles.allThreeW, className)}
      title={strings.allThreeWPageTitle}
      breadCrumbs={<BreadCrumb crumbs={crumbs} compact />}
    >
      <Container
        className={styles.mainContent}
        heading={(
          <Translate
            stringId={headingStringId}
            params={{
              count: (!pending && response) ? response.count : '--',
              country: (
                <Link to={countryUrl}>
                  {countryName}
                </Link>
              ),
              ns: (
                <Link to={nsUrl}>
                  {nsName}
                </Link>
              ),
            }}
          />
        )}
      >
        {pending ? (
          <BlockLoading />
        ) : (
          <>
            <Table
              className={styles.projectsTable}
              data={response?.results}
              columns={columns}
              keySelector={projectKeySelector}
              variant="large"
            />
            {response && (
              <div className={styles.footer}>
                <Pager
                  activePage={activePage}
                  onActivePageChange={setActivePage}
                  itemsCount={response.count}
                  maxItemsPerPage={ITEM_PER_PAGE}
                />
              </div>
            )}
          </>
        )}
      </Container>
    </Page>
  );
}

export default AllThreeW;

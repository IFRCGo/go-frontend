import React, { useContext, useMemo } from 'react';
import { _cs } from '@togglecorp/fujs';
import type { Location } from 'history';

import Page from '#components/Page';
import BreadCrumb from '#components/breadcrumb';
import languageContext from '#root/languageContext';
import TableLists from './TableLists';

import styles from './styles.module.scss';

interface Props {
  className?: string;
  location: Location;
  title: string;
  showExport: boolean;
  ITEM_PER_PAGE: number;
}

function AllInformalUpdates(props: Props) {
  const {
    className,
    location,
    title,
  } = props;

  const { strings } = useContext(languageContext);

  const crumbs = useMemo(() => [
    { link: location?.pathname, name: strings.informalUpdateReportsTableViewAllReportsBreadcrumbTitle },
    { link: '/', name: strings.breadCrumbHome },
  ], [strings, location]);

  return (
    <Page
      className={_cs(styles.allInformalUpdates, className)}
      title={strings.informalUpdateReportsTableViewAllReportsBreadcrumbTitle}
      breadCrumbs={<BreadCrumb crumbs={crumbs} compact />}
    >
      <TableLists
        title={title}
        showExport={true}
        ITEM_PER_PAGE={10}
      />
    </Page>
  );
}

export default AllInformalUpdates;

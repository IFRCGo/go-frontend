import React, { useContext, useMemo } from 'react';
import { _cs } from '@togglecorp/fujs';
import type { Location } from 'history';

import Page from '#components/Page';
import BreadCrumb from '#components/breadcrumb';
import languageContext from '#root/languageContext';
import useReduxState from '#hooks/useReduxState';
import { isIfrcUser } from '#utils/common';
import FourHundredFour from '#views/FourHundredFour';
import TableLists from './TableLists';

import styles from './styles.module.scss';

interface Props {
  className?: string;
  location: Location;
  title: string;
  showExport: boolean;
  ITEM_PER_PAGE: number;
}

function AllFlashUpdates(props: Props) {
  const user = useReduxState('me');
  const { strings } = useContext(languageContext);
  const {
    className,
    location,
    title,
  } = props;

  const crumbs = useMemo(() => [
    { link: location?.pathname, name: strings.flashUpdateReportsTableViewAllReportsBreadcrumbTitle },
    { link: '/', name: strings.breadCrumbHome },
  ], [strings, location]);

  const ifrcUser = React.useMemo(() => isIfrcUser(user?.data), [user]);
  if (!ifrcUser) {
    return (
      <FourHundredFour />
    );
  }

  return (
    <Page
      className={_cs(styles.allFlashUpdates, className)}
      title={strings.flashUpdateReportsTableViewAllReportsBreadcrumbTitle}
      breadCrumbs={<BreadCrumb crumbs={crumbs} compact />}
    >
      {ifrcUser && (
        <TableLists
          title={title}
          showExport={true}
          itemPerPage={10}
        />
      )}
    </Page>
  );
}

export default AllFlashUpdates;

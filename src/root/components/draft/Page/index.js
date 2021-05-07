import React from 'react';
import { Helmet } from 'react-helmet';
import { ThroughProvider } from 'react-through';
import { _cs } from '@togglecorp/fujs';

import Navbar from '#components/header';
import MobileNavbar from '#components/mobile-header';
import PageFooter from '#components/footer';
import PageHeader from '#components/draft/PageHeader';
import GlobalLoading from '#components/global-loading';
import SysAlerts from '#components/system-alerts';

import {
  GlobalLoadingContext,
  NewGlobalLoadingParent,
} from '#components/NewGlobalLoading';

import styles from './styles.module.scss';

function Page(props) {
  const {
    className,
    title,
    actions,
    heading,
    description,
    breadCrumbs,
    info,
    children,
    mainSectionClassName,
  } = props;

  const [loading, setLoading] = React.useState(false);

  const setGlobalLoading = React.useCallback((isLoading) => {
    setLoading((loading) => loading + (isLoading ? 1 : -1));
  }, [setLoading]);

  const loadingContextValue = React.useMemo(() => ({
    loading,
    setLoading: setGlobalLoading,
  }), [loading, setGlobalLoading]);

  return (
    <div
      className={_cs(
        'go-page',
        styles.page,
        className,
      )}
    >
      <ThroughProvider>
        <GlobalLoadingContext.Provider value={loadingContextValue}>
          {title && (
            <Helmet>
              <title>
                { title }
              </title>
            </Helmet>
          )}
          <Navbar />
          <MobileNavbar />
          <GlobalLoading />
          { loading > 0 && <NewGlobalLoadingParent /> }
          <PageHeader
            actions={actions}
            heading={heading}
            description={description}
            breadCrumbs={breadCrumbs}
            info={info}
          />
          <main
            className={_cs(
              'go-main-section',
              styles.mainSection,
              mainSectionClassName,
            )}
          >
            { children }
          </main>
          <PageFooter/>
          <SysAlerts />
        </GlobalLoadingContext.Provider>
      </ThroughProvider>
    </div>
  );
}

export default Page;

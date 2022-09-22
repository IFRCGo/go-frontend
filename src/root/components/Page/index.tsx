import React from 'react';
import { ThroughProvider } from 'react-through';
import {
  _cs,
  isDefined,
} from '@togglecorp/fujs';

import Navbar from '#components/navbar';
// import MobileNavbar from '#components/mobile-navbar';
import MobileNavbar from '#components/MobileNavbar';
import PageFooter from '#components/footer';
import PageHeader from '#components/PageHeader';
import GlobalLoading from '#components/global-loading';
import SysAlerts from '#components/system-alerts';
import AlertContainer from '#components/AlertContainer';

import {
  GlobalLoadingContext,
  NewGlobalLoadingParent,
} from '#components/NewGlobalLoading';

import styles from './styles.module.scss';

interface Props {
  className?: string;
  title?: string;
  actions?: React.ReactNode;
  heading?: React.ReactNode;
  description?: React.ReactNode;
  breadCrumbs?: React.ReactNode;
  info?: React.ReactNode;
  children?: React.ReactNode;
  mainSectionClassName?: string;
  infoContainerClassName?: string;
  withMainContentBackground?: boolean;
  wikiLink?: React.ReactNode;
}


function Page(props: Props) {
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
    infoContainerClassName,
    withMainContentBackground,
    wikiLink,
  } = props;

  const [loading, setLoading] = React.useState(0);

  const setGlobalLoading = React.useCallback((isLoading) => {
    setLoading((loading) => loading + (isLoading ? 1 : -1));
  }, [setLoading]);

  const loadingContextValue = React.useMemo(() => ({
    loading: loading > 0,
    setLoading: setGlobalLoading as () => void,
  }), [loading, setGlobalLoading]);

  React.useEffect(() => {
    if (isDefined(title)) {
      document.title = title;
    }
  }, [title]);

  return (
    <div
      className={_cs(
        'go-page',
        styles.page,
        className,
        withMainContentBackground && styles.withMainContentBackground,
      )}
    >
      <ThroughProvider>
        <GlobalLoadingContext.Provider value={loadingContextValue}>
          <Navbar />
          <MobileNavbar />
          <GlobalLoading />
          { loading > 0 && <NewGlobalLoadingParent /> }
          <AlertContainer>
            <SysAlerts />
          </AlertContainer>
          <PageHeader
            actions={actions}
            heading={heading}
            description={description}
            breadCrumbs={breadCrumbs}
            info={info}
            infoContainerClassName={infoContainerClassName}
            wikiLink={wikiLink}
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
        </GlobalLoadingContext.Provider>
      </ThroughProvider>
    </div>
  );
}

export default Page;

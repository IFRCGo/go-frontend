import React from 'react';
import { ThroughProvider } from 'react-through';
import c from 'classnames';

import Header from '#components/header';
import MobileHeader from '#components/mobile-header';
import Footer from '#components/footer';
import GlobalLoading from '#components/global-loading';
// import GlobalHeaderBanner from '#components/global-header-banner';
import SysAlerts from '#components/system-alerts';

import {
  GlobalLoadingContext,
  NewGlobalLoadingParent,
} from '#components/NewGlobalLoading';

function App(p) {
  const [loading, setLoading] = React.useState(false);

  const setGlobalLoading = React.useCallback((isLoading) => {
    setLoading((loading) => loading + (isLoading ? 1 : -1));
  }, [setLoading]);

  const contextValue = React.useMemo(() => ({
    loading,
    setLoading: setGlobalLoading,
  }), [loading, setGlobalLoading]);

  return (
    <ThroughProvider>
      <GlobalLoadingContext.Provider value={contextValue}>
        <div className={c('page', p.className)}>
          {/* <GlobalHeaderBanner /> */}
          <GlobalLoading />
          { loading > 0 && <NewGlobalLoadingParent /> }
          <Header />
          <MobileHeader />
          <main className='page__body' role='main'>
            {p.children}
          </main>
          <SysAlerts />
          <Footer/>
        </div>
      </GlobalLoadingContext.Provider>
    </ThroughProvider>
  );
}

export default App;

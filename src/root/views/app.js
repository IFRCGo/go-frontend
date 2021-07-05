import React from 'react';
import { ThroughProvider } from 'react-through';
import c from 'classnames';

import Navbar from '#components/navbar';
import MobileNavbar from '#components/mobile-navbar';
import Footer from '#components/footer';
import GlobalLoading from '#components/global-loading';
import SysAlerts from '#components/system-alerts';
import AlertContainer from '#components/AlertContainer';

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
          <GlobalLoading />
          { loading > 0 && <NewGlobalLoadingParent /> }
          <Navbar />
          <MobileNavbar />
          <main className='page__body' role='main'>
            {p.children}
          </main>
          <AlertContainer>
            <SysAlerts />
          </AlertContainer>
          <Footer/>
        </div>
      </GlobalLoadingContext.Provider>
    </ThroughProvider>
  );
}

export default App;

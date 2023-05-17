import React, { Suspense, lazy } from 'react';
import { unique } from '@togglecorp/fujs';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { BreadcrumbsProvider } from 'react-breadcrumbs-dynamic';

import AlertContext, { AlertParams } from '#components/AlertContext';
import Navbar from '#goui/components/Navbar';
import GlobalFooter from '#goui/components/GlobalFooter';

import InitialLoading from './InitialLoading';
import styles from './styles.module.scss';

const Home = lazy(() => import('#views/Home'));
const GoUI = lazy(() => import('#views/GoUI'));
const FourHundredFour = lazy(() => import('#views/FourHundredFour'));

interface Props {
}

function Multiplexer(props: Props) {
  const [alerts, setAlerts] = React.useState<AlertParams[]>([]);

  const addAlert = React.useCallback((alert: AlertParams) => {
    setAlerts((prevAlerts) => unique(
      [...prevAlerts, alert],
      a => a.name
    ) ?? prevAlerts);
  }, [setAlerts]);

  const removeAlert = React.useCallback((name) => {
    setAlerts((prevAlerts) => {
      const i = prevAlerts.findIndex(a => a.name === name);
      if (i === -1) {
        return prevAlerts;
      }

      const newAlerts = [...prevAlerts];
      newAlerts.splice(i, 1);

      return newAlerts;
    });
  }, [setAlerts]);

  const updateAlert = React.useCallback((name, children) => {
    setAlerts((prevAlerts) => {
      const i = prevAlerts.findIndex(a => a.name === name);
      if (i === -1) {
        return prevAlerts;
      }

      const updatedAlert = {
        ...prevAlerts[i],
        children,
      };

      const newAlerts = [...prevAlerts];
      newAlerts.splice(i, 1, updatedAlert);

      return newAlerts;
    });
  }, [setAlerts]);

  const alertContextValue = React.useMemo(() => ({
    alerts,
    addAlert,
    updateAlert,
    removeAlert,
  }), [alerts, addAlert, updateAlert, removeAlert]);

  return (
    <AlertContext.Provider value={alertContextValue}>
      <Router>
        <Suspense fallback={<InitialLoading />}>
          <BreadcrumbsProvider>
            <div className={styles.go}>
              <Navbar className={styles.navbar} />
              <div className={styles.pageContent}>
                <Switch>
                  <Route exact path='/' component={Home} />
                  <Route exact path='/go-ui/' component={GoUI} />
                  <Route component={FourHundredFour} />
                </Switch>
              </div>
              <GlobalFooter className={styles.globalFooter}/>
            </div>
          </BreadcrumbsProvider>
        </Suspense>
      </Router>
    </AlertContext.Provider>
  );
}

export default Multiplexer;

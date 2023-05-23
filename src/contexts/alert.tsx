import { createContext } from 'react';

export type AlertVariant = 'success' | 'warning' | 'danger' | 'info';

export const DEFAULT_ALERT_DISMISS_DURATION = 4500;

export interface AlertParams {
  name: string;
  variant: AlertVariant;
  children: React.ReactNode;
  duration: number;
  nonDismissable?: boolean;
  debugMessage?: string;
}

export interface AlertContextProps {
  alerts: AlertParams[];
  addAlert: (p: AlertParams) => void;
  removeAlert: (name: string) => void;
  updateAlert: (name: string, params: Omit<AlertParams, 'name'>) => void;
}

const AlertContext = createContext<AlertContextProps>({
    alerts: [],
    // eslint-disable-next-line no-console
    addAlert: () => { console.warn('AlertContext::addAlert called before it was initialized'); },
    // eslint-disable-next-line no-console
    removeAlert: () => { console.warn('AlertContext::removeAlert called before it was initialized'); },
    // eslint-disable-next-line no-console
    updateAlert: () => { console.warn('AlertContext::updateAlert called before it was initialized'); },
});

export default AlertContext;

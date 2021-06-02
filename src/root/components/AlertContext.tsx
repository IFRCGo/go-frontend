import React from 'react';

export type AlertVariant = 'success' | 'warning' | 'danger' | 'info';

export const DEFAULT_ALERT_DISMISS_DURATION = 3000;

export interface AlertParams {
  name: string;
  variant: AlertVariant;
  children: React.ReactNode;
  duration: number;
  nonDismissable?: boolean;
}

export interface AlertContextProps {
  alerts: AlertParams[];
  addAlert: (p: AlertParams) => void;
  removeAlert: (name: string) => void;
  updateAlert: (name: string, params: Omit<AlertParams, 'name'>) => void;
}

const AlertContext = React.createContext<AlertContextProps>({
  alerts: [],
  addAlert: () => { console.warn('addAlert called before it was initialized'); },
  removeAlert: () => { console.warn('removeAlert called before it was initialized'); },
  updateAlert: () => { console.warn('updateAlert called before it was initialized'); },
});

export default AlertContext;

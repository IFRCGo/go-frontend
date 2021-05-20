import React from 'react';

export type AlertVariant = 'success' | 'warning' | 'danger' | 'info';
export type AlertName = string;

export const DEFAULT_ALERT_DISMISS_DURATION = 130000;

export interface AlertParams {
  name: AlertName;
  variant: AlertVariant;
  children: React.ReactNode;
  duration: number;
  nonDismissable?: boolean;
}

export interface AlertContextProps {
  alerts: AlertParams[];
  addAlert: (p: AlertParams) => void;
  removeAlert: (name: AlertName) => void;
  updateAlert: (name: AlertName, params: Omit<AlertParams, 'name'>) => void;
}

const AlertContext = React.createContext<AlertContextProps>({
  alerts: [],
  addAlert: () => { console.warn('addAlert called before it was initialized'); },
  removeAlert: () => { console.warn('removeAlert called before it was initialized'); },
  updateAlert: () => { console.warn('updateAlert called before it was initialized'); },
});

export default AlertContext;

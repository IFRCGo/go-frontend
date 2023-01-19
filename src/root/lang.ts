import { createContext } from 'react';

/*
import about from  '#strings/about';
import common from  '#strings/common';
import dref from  '#strings/dref';
import emergency from  '#strings/emergency';
import fieldReport from  '#strings/fieldReport';
import flashUpdate from  '#strings/flashUpdate';
import login from  '#strings/login';
import register from  '#strings/register';
import surge from  '#strings/surge';
import threeW from  '#strings/threeW';
*/

import { AboutStrings } from  '#strings/about';
import { CommonStrings } from  '#strings/common';
import { DrefStrings } from  '#strings/dref';
import { EmergencyStrings } from  '#strings/emergency';
import { FieldReportStrings } from  '#strings/fieldReport';
import { FlashUpdateStrings } from  '#strings/flashUpdate';
import { LoginStrings } from  '#strings/login';
import { RegisterStrings } from  '#strings/register';
import { SurgeStrings } from  '#strings/surge';
import { ThreeWStrings } from  '#strings/threeW';

export type AllStrings = CommonStrings
  & AboutStrings
  & DrefStrings
  & EmergencyStrings
  & FieldReportStrings
  & FlashUpdateStrings
  & LoginStrings
  & RegisterStrings
  & SurgeStrings
  & ThreeWStrings;

const allStrings = {
/*
  ...common,
  ...about,
  ...dref,
  ...emergency,
  ...fieldReport,
  ...flashUpdate,
  ...login,
  ...register,
  ...surge,
  ...threeW,
*/
} as AllStrings;

export const strings = {
  // common,
  // about,
  // dref,
  // emergency,
  // fieldReport,
  // flashUpdate,
  // login,
  // register,
  // surge,
  // threeW,
};

export interface Strings {
  common: CommonStrings;
  about: AboutStrings;
  dref: DrefStrings;
  emergency: EmergencyStrings;
  fieldReport: FieldReportStrings;
  flashUpdate: FlashUpdateStrings;
  login: LoginStrings;
  register: RegisterStrings;
  surge: SurgeStrings;
  threeW: ThreeWStrings;
}

export const stringKeys: (keyof Strings)[] = [
  'common',
  'about',
  'dref',
  'emergency',
  'fieldReport',
  'flashUpdate',
  'login',
  'register',
  'surge',
  'threeW',
];

interface LanguageContextProps {
  queue: (keyof Strings)[];
  addToQueue: (key: keyof Strings) => void;
  strings: Partial<Strings>;
  setStrings: React.Dispatch<React.SetStateAction<Strings>>;
}

export const languageContext = createContext<LanguageContextProps>({
  queue: [],
  addToQueue: () => { console.error('languageContext::addToQueue used without provider'); },
  strings: {},
  setStrings: () => { console.error('languageContext::setStrings used without provider'); },
});

export default allStrings;

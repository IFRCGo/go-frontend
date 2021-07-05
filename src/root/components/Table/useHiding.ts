import { createContext } from 'react';

interface HideContextInterface {
    setHidden: (state: string) => void;
}
const initialValue: HideContextInterface = {
    setHidden: (state) => {
        console.warn('Trying to set to ', state);
    },
};
// eslint-disable-next-line import/prefer-default-export
export const HideContext = createContext<HideContextInterface>(initialValue);

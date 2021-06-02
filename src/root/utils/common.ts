import { memo } from 'react';

export const getHashFromBrowser = () => window.location.hash.substr(1);
export const setHashToBrowser = (hash: string | undefined) => {
    if (hash) {
        window.location.replace(`#${hash}`);
    } else {
        window.location.hash = '';
    }
};

export const genericMemo: (<T>(c: T) => T) = memo;

import React from 'react';
import {
  Strings,
  languageContext,
  stringKeys,
} from '#root/lang';

// import useReduxState from '#hooks/useReduxState';

async function getStrings(key: keyof Strings) {
  const strings = await import(`../strings/${key}.ts`);
  return strings.default;
}

function useTranslationQueue(queue: (keyof Strings)[]) {
  const requestTimeoutRef = React.useRef<number | undefined>();
  React.useEffect(() => {
    window.clearTimeout(requestTimeoutRef.current);

    requestTimeoutRef.current = window.setTimeout(() => {
    }, 200);

  }, [queue]);
}

const emptyMap = {};
function useTranslation<T extends keyof Strings>(source: T) {
  const {
    strings,
    addToQueue,
    setStrings,
  } = React.useContext(languageContext);

  const stringsRef = React.useRef(strings);
  React.useEffect(() => {
    stringsRef.current = strings;
  }, [strings]);

  React.useEffect(() => {
    async function setup() {
      let defaultStrings = stringsRef.current[source];
      if (!defaultStrings) {
        defaultStrings = await getStrings(source);
      }

      setStrings((prevStrings) => {
        if (prevStrings[source]) {
          return prevStrings;
        }


        return {
          ...prevStrings,
          [source]: defaultStrings,
        };
      });
    }

    setup();
  }, [source, setStrings, addToQueue]);

  return strings[source] ?? emptyMap; 
}

export default useTranslation;

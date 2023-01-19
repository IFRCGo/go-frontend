import React from 'react';
import spark from 'spark-md5';
import {
  listToGroupList,
  listToMap,
  unique,
} from '@togglecorp/fujs';

import { useRequest, useLazyRequest } from '#utils/restRequest';
import { stringKeys, Strings } from '#root/lang';
import RadioInput from '#components/RadioInput';
import useInputState from '#hooks/useInputState';

import StringRow, { StringData } from './StringRow';
import StringDetailModal from './StringDetailModal';

import styles from './styles.module.scss';

type ViewType = 'dev' | 'all' | 'removed' | 'new' | 'modified';
const viewOptions: {
  value: ViewType;
  label: string;
}[] = [
  { value: 'dev', label: 'Dev' },
  { value: 'all', label: 'All' },
  { value: 'removed', label: 'Removed' },
  { value: 'new', label: 'New' },
  { value: 'modified', label: 'Modified' },
];

interface String {
  key: string;
  value: string;
  language: string;
  page_name: string;
  hash: string;
}

async function getStrings(key: keyof Strings) {
  const strings = await import(`../../strings/${key}.ts`);
  return { [key]: strings };
}

function getAllStrings() {
  return Promise.all(stringKeys.map(getStrings));
}

function NewTranslationDashboard() {
  const [devStrings, setDevStrings] = React.useState<String[]>([]);
  const [currentView, setCurrentView] = useInputState<ViewType | undefined>('dev');
  const [currentString, setCurrentString] = React.useState<StringData| undefined>();

  const {
    response: allLanguageStrings,
  } = useRequest<String[]>({
    url: 'api/v2/language/all',
  });

  /*
  const {
    trigger: submitLanguageBulk,
  } = useLazyRequest({
    method: 'POST',
    url: 'api/v2/language/ar/bulk-action/',
    body: ctx => ({ actions: ctx }),
  });
  */

  React.useEffect(() => {
    async function setup() {
      const stringList = await getAllStrings();
      const allStringList = stringList.map((val: { [key: string]: { default: Record<string, string> }}) => {
        const pageKey = Object.keys(val)[0];
        const currentStrings = val[pageKey].default;
        const currentStringKeys = Object.keys(currentStrings);

        return currentStringKeys.map((key) => ({
          language: 'en',
          key,
          value: currentStrings[key],
          hash: spark.hash(currentStrings[key]) as string,
          page_name: pageKey,
        })).filter((s) => !!s.value);
      }).flat();

      setDevStrings(allStringList);
    }
    setup();
  }, []);

  const allStrings = React.useMemo(() => {
    if (!allLanguageStrings) {
      return [];
    }

    const keyGroupedTranslatedStrings = listToGroupList(
      (allLanguageStrings ?? []).filter((string) => string.language !== 'en'),
      d => d.key,
    );

    const devStringKeys = devStrings.map(d => d.key);
    const devStringMap = listToMap(
      devStrings,
      d => d.key,
    );

    const keysFromServer = Object.keys(keyGroupedTranslatedStrings);

    const allKeys = unique([
      ...keysFromServer,
      ...devStringKeys,
    ]);

    const allStrings = allKeys.map((stringKey) => {
      const devString = devStringMap[stringKey];
      const devHash = devString?.hash;
      const translations = keyGroupedTranslatedStrings[stringKey]?.map((translation) => ({
        ...translation,
        isObsolete: translation.hash !== devHash,
      }));

      return {
        key: stringKey,
        dev: devString,
        translations,
      };
    });

    return allStrings;
  }, [allLanguageStrings, devStrings]);

  const selectedStrings = React.useMemo(() => {
    if (currentView === 'all') {
      return allStrings;
    }

    if (currentView === 'dev') {
      return allStrings.filter((string) => !!string.dev);
    }

    if (currentView === 'removed') {
      return allStrings.filter((string) => !string.dev);
    }

    if (currentView === 'new') {
      return allStrings.filter((string) => !string.translations || string.translations.length === 0);
    }

    if (currentView === 'modified') {
      return allStrings.filter((string) => string.translations?.some(
        (translation) => translation.hash !== string.dev?.hash
      ));
    }

    return [];
  }, [allStrings, currentView]);

  return (
    <div className={styles.translationDashboard}>
      <div className={styles.actions}>
        <RadioInput
          name={undefined}
          keySelector={(o) => o.value}
          labelSelector={(o) => o.label}
          value={currentView}
          onChange={setCurrentView}
          options={viewOptions}
        />
      </div>
      <div className={styles.strings}>
        {selectedStrings.map((string) => (
          <StringRow
            key={string.key}
            data={string}
            onClick={setCurrentString}
          />
        ))}
      </div>
      {currentString && (
        <StringDetailModal
          onClose={setCurrentString}
          data={currentString}
        />
      )}
    </div>
  );
}

export default NewTranslationDashboard;

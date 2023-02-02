import React from 'react';

import Container from '#components/Container';
import Link from '#components/Link';
import LanguageContext from '#root/languageContext';

import styles from './styles.module.scss';

export interface CountryResult {
  id: number;
  name: string;
  society_name: string;
  score: number;
}

interface Props {
  data: CountryResult[] | undefined;
  actions: React.ReactNode;
}

function CountryList(props: Props) {
  const {
    data,
    actions,
  } = props;

  const { strings } = React.useContext(LanguageContext);
  if (!data) {
    return null;
  }

  return (
    <>
      {data && (
        <Container
          heading={strings.searchIfrcCountry}
          actions={actions}
          sub
          contentClassName={styles.countryList}
        >
          {data.map((country) => (
            <Link
              href={`/country/${country.id}`}
              key={country.id}
            >
              {country.name}
            </Link>
          ))}
        </Container>
      )}
    </>
  );
}

export default CountryList;

import React from 'react';
import {
  IoChevronForwardOutline,
} from 'react-icons/io5';

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
    <Container
      actions={actions}
      sub
      contentClassName={styles.countryList}
    >
      <div className={styles.searchTitle}>
        {strings.searchIfrcCountry}
      </div>
      {data.map((country) => (
        <Link
          href={`/countries/${country.id}`}
          className={styles.countryName}
          key={country.id}
        >
          {country.name}
          <IoChevronForwardOutline />
        </Link>
      ))}
    </Container>
  );
}

export default CountryList;

import React from 'react';
import {
  IoChevronForwardOutline,
} from 'react-icons/io5';

import Container from '#components/Container';
import Link from '#components/Link';
import LanguageContext from '#root/languageContext';

import styles from './styles.module.scss';

export interface RegionResult {
  id: number;
  name: string;
  score: number;
}

interface Props {
  data: RegionResult[] | undefined;
  actions: React.ReactNode;
}

function RegionList(props: Props) {
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
      contentClassName={styles.regionList}
    >
      <div className={styles.searchTitle}>
        {strings.searchIfrcRegion}
      </div>
      {data.map((region) => (
        <Link
          href={`/regions/${region.id}`}
          className={styles.regionName}
          key={region.id}
        >
          {region.name}
          <IoChevronForwardOutline />
        </Link>
      ))}
    </Container>
  );
}

export default RegionList;

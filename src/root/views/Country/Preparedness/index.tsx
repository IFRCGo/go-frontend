import React, {
  useContext,
} from 'react';
import { Link } from 'react-router-dom';

import Container from '#components/Container';
import LanguageContext from '#root/languageContext';
import PreparednessCard from './PreparednessCard';
import { useButtonFeatures } from '#components/Button';
import { IoAdd } from 'react-icons/io5';

import styles from './styles.module.scss';

interface Props {
  countryId: number;
  className?: string;
}

function Preparedness(props: Props) {
  const {
    className,
    countryId,
  } = props;

  const { strings } = useContext(LanguageContext);

  const addPreparedness = useButtonFeatures({
    variant: 'secondary',
    icons: <IoAdd />,
    children: 'Add',
  });

  return (
    <Container
      className={styles.preparedness}
      contentClassName={styles.content}
      heading={strings.countryPreparednessHeading}
      subHeading={strings.countryPreparednessSubHeading}
      actions={(
        <>
          <Link
            to="/country-preparedness/new"
            {...addPreparedness}
          />
        </>
      )}
    >
      <PreparednessCard />
    </Container>
  );
}

export default Preparedness;

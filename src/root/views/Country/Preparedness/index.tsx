import React, {
  useContext,
} from 'react';
import { Link } from 'react-router-dom';

import Container from '#components/Container';
import LanguageContext from '#root/languageContext';
import Card from '#components/Card';
import PreparednessCard from './PreparednessCard';
import { useButtonFeatures } from '#components/Button';

import Button from '#components/Button';

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
      <>
        <Card>
          <PreparednessCard />
        </Card>
      </>
    </Container>
  );
}

export default Preparedness;

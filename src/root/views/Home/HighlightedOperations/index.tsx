import React from 'react';
import { ChevronRightLineIcon } from '@ifrc-go/icons';
import { _cs } from '@togglecorp/fujs';
import {
  useRequest,
  ListResponse,
} from '#utils/restRequest';

import OperationCard from './OperationCard';
import Container from '#goui/components/Container';
import Button from '#goui/components/Button';
import { Emergency } from '#types';

import strings from '../strings';
import styles from './styles.module.scss';

interface Props {
  className?: string;
}

function HighlightedOperations(props: Props) {
  const {
    className,
  } = props;

  const {
    response: featuredEmergencyResponse,
  } = useRequest<ListResponse<Emergency>>({
    url: 'api/v2/event/',
    query: {
      is_featured: 1,
    },
  });

  console.info(featuredEmergencyResponse);

  return (
    <Container
      className={_cs(styles.highlightedOperations, className)}
      withHeaderBorder
      heading={strings.highlightedOperationsTitle}
      actions={(
        <Button
          name={undefined}
          variant="tertiary"
          actions={<ChevronRightLineIcon />}
        >
          {strings.viewAllEmergenciesLinkTitle}
        </Button>
      )}
      childrenContainerClassName={styles.emergencyList}
    >
      {featuredEmergencyResponse?.results.map(
        (emergency) => (
          <OperationCard
            key={emergency.id}
            data={emergency}
          />
        )
      )}
    </Container>
  );
}

export default HighlightedOperations;

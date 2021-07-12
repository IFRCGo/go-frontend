import React from 'react';
import { _cs } from '@togglecorp/fujs';

import Container from '#components/Container';
import LanguageContext from '#root/languageContext';
import styles from './styles.module.scss';

interface Props {
  className?: string;
}

function EmptyMessage(props: Props) {
  const { className } = props;
  const { strings } = React.useContext(LanguageContext);

  return (
    <Container
      className={_cs(styles.emptyMessage, className)}
    >
      <p>
        {strings.emptyMessage}
      </p>
      <p>
        {strings.emptyMessageHelpText}
      </p>
    </Container>
  );
}

export default EmptyMessage;

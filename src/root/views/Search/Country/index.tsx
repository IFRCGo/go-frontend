import React from 'react';

import Container from '#components/Container';
import LanguageContext from '#root/languageContext';

import { Country } from '../index';

interface Props {
  data: Country[] | undefined;
}

function CountryList(props: Props) {
  const {
    data,
  } = props;

  const { strings } = React.useContext(LanguageContext);

  return (
    <>
      {data && (
        <Container
          heading={strings.searchIfrcCountry}
          description={data}
        />
      )}
    </>
  );
}

export default CountryList;

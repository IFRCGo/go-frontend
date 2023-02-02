import React from 'react';
import LanguageContext from '#root/languageContext';

import AppealsTable from '../AppealsTable';

import { Appeal } from '../index';

interface Props {
  data: Appeal[] | undefined;
}

function ListAppealTable(props: Props) {
  const {
    data,
  } = props;

  const { strings } = React.useContext(LanguageContext);

  return (
    <AppealsTable data={data} />
  );
}
export default ListAppealTable;

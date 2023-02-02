import React from 'react';
import LanguageContext from '#root/languageContext';

import AppealsTable from '../AppealsTable';

import { Appeal } from '../index';

interface Props {
  data: Appeal[] | undefined;
  actions: React.ReactNode;
}

function ListAppealTable(props: Props) {
  const {
    data,
    actions,
  } = props;

  const { strings } = React.useContext(LanguageContext);

  return (
    <AppealsTable
      data={data}
      actions={actions}
    />
  );
}
export default ListAppealTable;

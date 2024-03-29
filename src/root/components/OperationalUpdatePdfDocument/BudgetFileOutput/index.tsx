import React from 'react';
import {
  Image,
  Text,
  View,
} from '@react-pdf/renderer';
import { isNotDefined } from '@togglecorp/fujs';

import { Strings } from '#types';
import { DrefOperationalUpdateApiFields } from '#views/DrefOperationalUpdateForm/common';
import pdfStyles from '#utils/pdf/pdfStyles';

interface Props {
  data: DrefOperationalUpdateApiFields;
  strings: Strings;
}

function BudgetFileOutput(props: Props) {
  const {
    data,
    strings,
  } = props;

  if (isNotDefined(data.budget_file_preview)) {
    return null;
  }
  return (
    <View break>
      <Text style={[
        pdfStyles.sectionHeading, {
          marginTop: 0,
          marginBottom: 0,
        }
      ]}
      >
        {strings.drefExportBudgetOverview}
      </Text>
      <Image
        style={pdfStyles.budgetImage}
        src={data.budget_file_preview}
      />
    </View>
  );
}

export default BudgetFileOutput;

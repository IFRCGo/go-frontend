import React from 'react';
import {
  Text,
  View,
} from '@react-pdf/renderer';

import { DrefOperationalUpdateApiFields } from '#views/DrefOperationalUpdateForm/common';
import pdfStyles from '#utils/pdf/pdfStyles';
import { Strings } from '#types';

interface BaseProps {
  data: DrefOperationalUpdateApiFields;
  strings: Strings;
}
interface NationalSocietyProps {
  data: DrefOperationalUpdateApiFields['national_society_actions'][number];
}

function NationalSociety(props: NationalSocietyProps) {
  const {
    data,
  } = props;

  return (
    <View>
      <View style={pdfStyles.row}>
        <View style={pdfStyles.niHeaderCell}>
          <Text>{data.title_display}</Text>
        </View>
        <View style={pdfStyles.niContentCell}>
          <Text>{data.description}</Text>
        </View>
      </View>
    </View>
  );
}

function NationalSocietyOutput(props: BaseProps) {
  const {
    data,
    strings,
  } = props;
  return (
    <>
      {data?.national_society_actions.length > 0 && (
        <View
          style={pdfStyles.section}
          wrap={false}
        >
          <Text style={pdfStyles.sectionHeading}>
            {strings.drefFormNationalSocietiesActions}
          </Text>
          {data?.national_society_actions.map((nsa) => (
            <NationalSociety
              key={nsa.id}
              data={nsa}
            />
          ))}
        </View>
      )}
    </>
  );
}

export default NationalSocietyOutput;
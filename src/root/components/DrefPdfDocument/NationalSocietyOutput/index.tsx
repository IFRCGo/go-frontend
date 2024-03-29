import React from 'react';
import {
  Text,
  View,
} from '@react-pdf/renderer';

import { DrefApiFields } from '#views/DrefApplicationForm/common';
import pdfStyles from '#utils/pdf/pdfStyles';
import { reTab } from '#utils/common';
import { Strings } from '#types';

interface BaseProps {
  data: DrefApiFields;
  strings: Strings;
}
interface NationalSocietyProps {
  data: DrefApiFields['national_society_actions'][number];
}

function NationalSociety(props: NationalSocietyProps) {
  const {
    data,
  } = props;

  return (
    <View style={pdfStyles.row}>
      <View style={pdfStyles.niHeaderCell}>
        <Text>
          {data.title_display}
        </Text>
      </View>
      <View style={pdfStyles.niContentCell}>
        <Text>
          {reTab(data.description)}
        </Text>
      </View>
    </View>
  );
}

function NationalSocietyOutput(props: BaseProps) {
  const {
    data,
    strings,
  } = props;

  if (data.national_society_actions.length < 1) {
    return null;
  }

  return (
    <View style={pdfStyles.section}>
      <Text
        style={pdfStyles.sectionHeading}
        minPresenceAhead={20}
      >
        {strings.drefFormNationalSocietiesActions}
      </Text>
      {data?.national_society_actions.map((nsa) => (
        <NationalSociety
          key={nsa.id}
          data={nsa}
        />
      ))}
    </View>
  );
}

export default NationalSocietyOutput;

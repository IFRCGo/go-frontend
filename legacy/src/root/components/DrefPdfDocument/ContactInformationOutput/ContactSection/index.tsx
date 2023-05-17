import React from 'react';
import {
  Text,
  View,
} from '@react-pdf/renderer';
import { isTruthyString } from '@togglecorp/fujs';

import pdfStyles from '#utils/pdf/pdfStyles';

interface Props {
  title: string;
  contacts: string[];
}

const bulletUnicode = '\u2022';

function ContactSection(props: Props) {
  const {
    title,
    contacts,
  } = props;

  const outputString = contacts.filter(isTruthyString).join(', ');

  return (
    <View
      style={pdfStyles.ciRow}
      wrap={false}
    >
      <Text style={pdfStyles.contactType}>
        {bulletUnicode} {title}
      </Text>
      <Text style={pdfStyles.contactDetails}>
        {outputString}
      </Text>
    </View>
  );
}

export default ContactSection;

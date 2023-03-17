import React from 'react';
import {
  Image,
  Text,
  View,
} from '@react-pdf/renderer';

import { DrefOperationalUpdateApiFields } from '#views/DrefOperationalUpdateForm/common';
import pdfStyles from '#utils/pdf/pdfStyles';
import { reTab } from '#utils/common';
import { Strings } from '#types';
import { PdfTextOutput } from '#components/PdfTextOutput';

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
          <Text>
            {reTab(data.description)}
          </Text>
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

  if (data.national_society_actions.length < 1) {
    return null;
  }

  return (
    <View
      style={pdfStyles.section}
    >
      <Text
        style={pdfStyles.sectionHeading}
        minPresenceAhead={20}
      >
        {strings.drefFormNationalSocietiesActions}
      </Text>
      <div style={pdfStyles.imagesSection}>
        {data.photos_file?.map((img) => (
          <View
            key={img?.id}
            style={pdfStyles.subSection}
          >
            <Image
              style={pdfStyles.coverImage}
              src={img.file}
              minPresenceAhead={20}
            />
            <PdfTextOutput
              label={img.caption}
              columns='4/4'
            />
          </View>
        ))}
      </div>
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

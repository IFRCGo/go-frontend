import React from 'react';
import {
  Image,
  View,
  Text,
} from '@react-pdf/renderer';
import { isDefined } from '@togglecorp/fujs';

import pdfStyles from '#utils/pdf/pdfStyles';
import { DrefApiFields, TYPE_IMMINENT } from '#views/DrefApplicationForm/common';
import { Strings } from '#types';
import { reTab } from '#utils/common';

interface NeedsProps {
  data: DrefApiFields['needs_identified'][number];
  niMap?: Record<string, string>;
  strings: Strings;
}

function NeedIdentified(props: NeedsProps) {
  const {
    data,
    niMap,
  } = props;

  return (
    <View
      style={pdfStyles.niContainer}
    >
      <View style={pdfStyles.niContentIconCell}>
        {isDefined(data.image_url) && (
          <Image
            style={pdfStyles.niIcon}
            src={data.image_url}
          />
        )}
        <Text style={pdfStyles.niSubSectionHeading}>
          {niMap?.[data.title]}
        </Text>
      </View>

      <View style={pdfStyles.niContentTextCell}>
        <Text>
          {reTab(data.description)}
        </Text>
      </View>
    </View >
  );
}

interface BaseProps {
  data: DrefApiFields;
  niMap?: Record<string, string>;
  drefType?: number;
  strings: Strings;
}

function NeedIdentifiedOutput(props: BaseProps) {
  const {
    data,
    niMap,
    drefType,
    strings,
  } = props;

  if (data.needs_identified.length < 1) {
    return null;
  }

  return (
    <View
      style={pdfStyles.niSection}
      break
    >
      <Text style={pdfStyles.sectionHeading}>
        {drefType === TYPE_IMMINENT ?
          strings.drefFormImminentNeedsIdentified
          : strings.drefFormNeedsIdentified}
      </Text>
      {data?.needs_identified.map((ni) => (
        <NeedIdentified
          key={ni.id}
          data={ni}
          niMap={niMap}
          strings={strings}
        />
      ))}
      {drefType !== TYPE_IMMINENT && (
        <View style={pdfStyles.qna}>
          <Text
            style={pdfStyles.strategySubSectionHeading}
          >
            {strings.drefFormGapsInAssessment}
          </Text>
          <Text style={pdfStyles.answer}>
            {reTab(data.identified_gaps)}
          </Text>
        </View>
      )}
    </View>
  );
}

export default NeedIdentifiedOutput;

import React from 'react';
import {
  Image,
  View,
  Text,
} from '@react-pdf/renderer';
import { isDefined } from '@togglecorp/fujs';

import { DrefOperationalUpdateApiFields } from '#views/DrefOperationalUpdateForm/common';
import { Strings } from '#types';
import pdfStyles from '#utils/pdf/pdfStyles';

interface NeedsProps {
  data: DrefOperationalUpdateApiFields['needs_identified'][number];
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
          {data.description}
        </Text>
      </View>
    </View >
  );
}

interface BaseProps {
  data: DrefOperationalUpdateApiFields;
  niMap?: Record<string, string>;
  isImminentOnset: boolean;
  strings: Strings;
}

function NeedIdentifiedOutput(props: BaseProps) {
  const {
    data,
    niMap,
    isImminentOnset,
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
      <Text
        style={pdfStyles.sectionHeading}
        minPresenceAhead={20}
      >
        {isImminentOnset ?
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
    </View>
  );
}

export default NeedIdentifiedOutput;

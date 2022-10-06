import React from 'react';
import {
  Text,
  View,
} from '@react-pdf/renderer';
import { isNotDefined } from '@togglecorp/fujs';

import { Strings } from '#types';
import { formatBoolean } from '#utils/common';
import { DrefApiFields } from '#views/DrefApplicationForm/common';
import pdfStyles from '#utils/pdf/pdfStyles';

interface Props {
  data: DrefApiFields;
  strings: Strings;
}

function PreviousOperationOutput(props: Props) {
  const {
    data,
    strings,
  } = props;

  if (isNotDefined(data.affect_same_area)
    && isNotDefined(data.affect_same_population)
    && isNotDefined(data.ns_respond)
    && isNotDefined(data.ns_request_fund)
    && isNotDefined(data.ns_request_text)
    && isNotDefined(data.dref_recurrent_text)
    && isNotDefined(data.lessons_learned)
  ) {
    return null;
  }

  return (
    <View style={pdfStyles.poSection}>
      <Text
        style={pdfStyles.sectionHeading}
        minPresenceAhead={20}
      >
        {strings.drefFormPreviousOperations}
      </Text>
      <View
        style={pdfStyles.row}
        wrap={false}
      >
        <Text style={pdfStyles.cellTitle}>
          {strings.drefFormAffectSameArea}
        </Text>
        <Text style={pdfStyles.strongCell}>
          {formatBoolean(data.affect_same_area)}
        </Text>
      </View>
      <View style={pdfStyles.row} wrap={false}>
        <Text style={pdfStyles.cellTitle}>
          {strings.drefFormAffectedthePopulationTitle}
        </Text>
        <Text style={pdfStyles.strongCell}>
          {formatBoolean(data.affect_same_population)}
        </Text>
      </View>
      <View style={pdfStyles.row} wrap={false}>
        <View style={pdfStyles.cellTitle}>
          <Text>{strings.drefFormNsRespond}</Text>
        </View>
        <View style={pdfStyles.strongCell}>
          <Text>{formatBoolean(data.ns_respond)}</Text>
        </View>
      </View>
      <View style={pdfStyles.row} wrap={false}>
        <View style={pdfStyles.cellTitle}>
          <Text>{strings.drefFormNsRequestFund}</Text>
        </View>
        <View style={pdfStyles.strongCell}>
          <Text>{formatBoolean(data.ns_request_fund)}</Text>
        </View>
      </View>
      <View style={pdfStyles.row} minPresenceAhead={10}>
        <View style={pdfStyles.cellTitle}>
          <Text>{strings.drefFormNsFundingDetail}</Text>
        </View>
        <View style={pdfStyles.strongCell}>
          <Text>{data?.ns_request_text ?? '-'}</Text>
        </View>
      </View>
      {data?.dref_recurrent_text && (
        <View style={pdfStyles.row}>
          <View style={[
            pdfStyles.cellTitle,
            pdfStyles.fullWidth
          ]}>
            <Text
              style={pdfStyles.fontWeightBold}
              minPresenceAhead={10}
            >
              {strings.drefFormRecurrentText}
            </Text>
            <Text>
              {data?.dref_recurrent_text}
            </Text>
          </View>
        </View>
      )}
      {data?.lessons_learned && (
        <View style={pdfStyles.row}>
          <View style={[
            pdfStyles.cellTitle,
            pdfStyles.fullWidth,
          ]}>
            <Text
              style={pdfStyles.fontWeightBold}
              minPresenceAhead={10}
            >
              {strings.drefFormLessonsLearnedDescription}
            </Text>
            <Text>
              {data?.lessons_learned}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

export default PreviousOperationOutput;

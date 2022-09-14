import React from 'react';
import {
  Text,
  View,
} from '@react-pdf/renderer';
import { isDefined } from '@togglecorp/fujs';

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

  return (
    <>
      {(isDefined(data.affect_same_area)
        || isDefined(data.affect_same_population)
        || isDefined(data.ns_respond)
        || isDefined(data.ns_request_fund)
        || isDefined(data.ns_request_text)
        || isDefined(data.dref_recurrent_text)
        || isDefined(data.lessons_learned)
      ) && (
          <View
            style={pdfStyles.poSection}
            wrap={false}
          >
            <Text style={pdfStyles.sectionHeading}>
              {strings.drefFormPreviousOperations}
            </Text>
            <View>
              <View style={pdfStyles.row}>
                <Text style={pdfStyles.cellTitle}>
                  {strings.drefFormAffectSameArea}
                </Text>
                <Text style={pdfStyles.strongCell}>
                  {formatBoolean(data.affect_same_area)}
                </Text>
              </View>
              <View style={pdfStyles.row}>
                <Text style={pdfStyles.cellTitle}>
                  {strings.drefFormAffectedthePopulationTitle}
                </Text>
                <Text style={pdfStyles.strongCell}>
                  {formatBoolean(data.affect_same_population)}
                </Text>
              </View>
              <View style={pdfStyles.row}>
                <View style={pdfStyles.cellTitle}>
                  <Text>{strings.drefFormNsRespond}</Text>
                </View>
                <View style={pdfStyles.strongCell}>
                  <Text>{formatBoolean(data.ns_respond)}</Text>
                </View>
              </View>
              <View style={pdfStyles.row}>
                <View style={pdfStyles.cellTitle}>
                  <Text>{strings.drefFormNsRequestFund}</Text>
                </View>
                <View style={pdfStyles.strongCell}>
                  <Text>{formatBoolean(data.ns_request_fund)}</Text>
                </View>
              </View>
              <View style={pdfStyles.row}>
                <View style={pdfStyles.cellTitle}>
                  <Text>{strings.drefFormNsFundingDetail}</Text>
                </View>
                <View style={pdfStyles.strongCell}>
                  <Text>{data?.ns_request_text ?? '-'}</Text>
                </View>
              </View>
              <View style={pdfStyles.row}>
                <View style={[
                  pdfStyles.cellTitle,
                  pdfStyles.fullWidth
                ]}>
                  <Text style={pdfStyles.fontWeightBold}>
                    {strings.drefFormRecurrentText}
                  </Text>
                </View>
              </View>
              <View style={pdfStyles.row}>
                <View style={[
                  pdfStyles.cellTitle,
                  pdfStyles.fullWidth
                ]}>
                  <Text>{data?.dref_recurrent_text}</Text>
                </View>
              </View>
              <View style={pdfStyles.row}>
                <View style={[
                  pdfStyles.cellTitle,
                  pdfStyles.fullWidth
                ]}>
                  <Text style={pdfStyles.fontWeightBold}>
                    {strings.drefFormLessonsLearnedDescription}
                  </Text>
                </View>
              </View>
              <View style={pdfStyles.row}>
                <View style={[
                  pdfStyles.cellTitle,
                  pdfStyles.fullWidth
                ]}>
                  <Text>
                    {data?.lessons_learned}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}
    </>
  );
}

export default PreviousOperationOutput;

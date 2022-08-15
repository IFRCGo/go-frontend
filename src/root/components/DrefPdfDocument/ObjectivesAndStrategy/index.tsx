import React from 'react';
import { DrefApiFields } from '#views/DrefApplicationForm/common';
import { Strings } from '#types';
import {
  Text,
  View,
} from '@react-pdf/renderer';
import pdfStyles from '#utils/pdf/pdfStyles';

interface Props {
  data: DrefApiFields;
  strings: Strings;
}

function ObjectiveAndStrategy(props: Props) {
  const {
    data,
    strings,
  } = props;

  return (
    <>
      {data?.operation_objective && (
        <View style={pdfStyles.section}>
          <Text style={pdfStyles.sectionHeading}>
            {strings.drefFormObjectiveOperation}
          </Text>
          <Text>{data.operation_objective}</Text>
        </View>
      )}
      {
        data?.response_strategy && (
          <View style={pdfStyles.section}>
            <Text style={pdfStyles.sectionHeading}>
              {strings.drefFormResponseRationale}
            </Text>
            <Text>{data.response_strategy}</Text>
          </View>
        )
      }

      {
        (
          data?.people_assisted ||
          data?.selection_criteria
        ) && (
          <View style={pdfStyles.section}>
            <Text style={pdfStyles.sectionHeading}>
              {strings.drefFormTargetingStrategy}
            </Text>
            {data?.people_assisted && (
              <View style={pdfStyles.qna}>
                <Text style={pdfStyles.textLabelSection}>
                  {strings.drefFormPeopleAssistedThroughOperation}
                </Text>
                <Text style={pdfStyles.answer}>
                  {data.people_assisted}
                </Text>
              </View>
            )}
            {data?.selection_criteria && (
              <View style={pdfStyles.qna}>
                <Text style={pdfStyles.textLabelSection}>
                  {strings.drefFormSelectionCriteria}
                </Text>
                <Text style={pdfStyles.answer}>
                  {data.selection_criteria}
                </Text>
              </View>
            )}
          </View>
        )
      }
    </>);
}

export default ObjectiveAndStrategy;
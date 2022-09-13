import React from 'react';
import {
  Text,
  View,
} from '@react-pdf/renderer';

import { Strings } from '#types';
import { DrefOperationalUpdateApiFields } from '#views/DrefOperationalUpdateForm/common';
import pdfStyles from '#utils/pdf/pdfStyles';

interface Props {
  data: DrefOperationalUpdateApiFields;
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
        <View
          style={pdfStyles.section}
        >
          <Text style={pdfStyles.sectionHeading}>
            {strings.drefExportOperationalStrategy}
          </Text>
          <View style={pdfStyles.qna}>
            <Text style={pdfStyles.strategySubSectionHeading}>
              {strings.drefFormObjectiveOperation}
            </Text>
            <Text style={pdfStyles.answer}>
              {data.operation_objective}
            </Text>
          </View>
        </View>
      )}
      {data?.response_strategy && (
        <View style={pdfStyles.qna}>
          <Text style={pdfStyles.strategySubSectionHeading}
          >
            {strings.drefFormResponseRationale}
          </Text>
          <Text style={pdfStyles.answer}>
            {data.response_strategy}
          </Text>
        </View>
      )}

      {(
        data?.people_assisted ||
        data?.selection_criteria
      ) && (
          <View style={pdfStyles.section}>
            <View wrap={false}>
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
            </View>
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
        )}
    </>);
}

export default ObjectiveAndStrategy;
import React from 'react';
import {
  Text,
  View,
} from '@react-pdf/renderer';
import { isDefined } from '@togglecorp/fujs';

import { Strings } from '#types';
import pdfStyles from '#utils/pdf/pdfStyles';
import { DrefFinalReportApiFields } from '#views/FinalReportForm/common';

interface Props {
  data: DrefFinalReportApiFields;
  strings: Strings;
}

function ObjectiveAndStrategy(props: Props) {
  const {
    data,
    strings,
  } = props;

  return (
    <>
      {isDefined(data.operation_objective) && (
        <View
          style={pdfStyles.section}
        >
          <Text
            style={pdfStyles.sectionHeading}
            minPresenceAhead={20}
          >
            {strings.finalReportObjectiveAndStrategy}
          </Text>
          <View style={pdfStyles.qna}>
            <Text
              style={pdfStyles.strategySubSectionHeading}
              minPresenceAhead={20}
            >
              {strings.drefFormObjectiveOperation}
            </Text>
            <Text style={pdfStyles.answer}>
              {data.operation_objective}
            </Text>
          </View>
        </View>
      )}
      {isDefined(data.response_strategy) && (
        <View style={pdfStyles.qna}>
          <Text
            style={pdfStyles.strategySubSectionHeading}
            minPresenceAhead={20}
          >
            {strings.finalReportResponseStrategyImplementation}
          </Text>
          <Text style={pdfStyles.answer}>
            {data.response_strategy}
          </Text>
        </View>
      )}
      {(
        isDefined(data.people_assisted) ||
        isDefined(data.selection_criteria)
      ) && (
          <View style={pdfStyles.section}>
            <View>
              <Text
                style={pdfStyles.sectionHeading}
                minPresenceAhead={20}
              >
                {strings.drefFormTargetingStrategy}
              </Text>
              {data?.people_assisted && (
                <View style={pdfStyles.qna}>
                  <Text
                    style={pdfStyles.textLabelSection}
                    minPresenceAhead={20}
                  >
                    {strings.drefFormPeopleAssistedThroughOperation}
                  </Text>
                  <Text style={pdfStyles.answer}>
                    {data.people_assisted}
                  </Text>
                </View>
              )}
            </View>
            {isDefined(data.selection_criteria) && (
              <View style={pdfStyles.qna}>
                <Text
                  style={pdfStyles.textLabelSection}
                  minPresenceAhead={20}
                >
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

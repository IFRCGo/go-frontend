import React from 'react';
import {
  Text,
  View,
} from '@react-pdf/renderer';
import { isDefined } from '@togglecorp/fujs';

import { Strings } from '#types';
import { DrefOperationalUpdateApiFields } from '#views/DrefOperationalUpdateForm/common';
import pdfStyles from '#utils/pdf/pdfStyles';
import { reTab } from '#utils/common';

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
      {isDefined(data.operation_objective) && (
        <View
          style={pdfStyles.section}
        >
          <Text
            style={pdfStyles.sectionHeading}
            minPresenceAhead={20}
          >
            {strings.drefExportOperationalStrategy}
          </Text>
          <View style={pdfStyles.qna}>
            <Text
              style={pdfStyles.strategySubSectionHeading}
              minPresenceAhead={20}
            >
              {strings.drefFormObjectiveOperation}
            </Text>
            <Text style={pdfStyles.answer}>
              {reTab(data.operation_objective)}
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
            {strings.drefFormResponseRationale}
          </Text>
          <Text style={pdfStyles.answer}>
            {reTab(data.response_strategy)}
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
                    {reTab(data.people_assisted)}
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
                  {reTab(data.selection_criteria)}
                </Text>
              </View>
            )}
          </View>
        )}
    </>);
}

export default ObjectiveAndStrategy;

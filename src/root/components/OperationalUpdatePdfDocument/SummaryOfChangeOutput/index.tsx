import React from 'react';
import {
  Text,
  View,
} from '@react-pdf/renderer';
import { isNotDefined } from '@togglecorp/fujs';

import { Strings } from '#types';
import { formatBoolean } from '#utils/common';
import { DrefOperationalUpdateApiFields } from '#views/DrefOperationalUpdateForm/common';
import pdfStyles from '#utils/pdf/pdfStyles';
import { reTab } from '#utils/common';

interface Props {
  data: DrefOperationalUpdateApiFields;
  strings: Strings;
  isImminentOnset: boolean;
}

function SummaryOfChangeOutput(props: Props) {
  const {
    data,
    strings,
    isImminentOnset,
  } = props;

  if (isNotDefined(data.changing_timeframe_operation)
    && isNotDefined(data.changing_geographic_location)
    && isNotDefined(data.changing_budget)
    && isNotDefined(data.changing_operation_strategy)
    && isNotDefined(data.changing_target_population_of_operation)
    && isNotDefined(data.request_for_second_allocation)
    && isNotDefined(data.has_forecasted_event_materialize)
    && isNotDefined(data.summary_of_change)
    && isNotDefined(data.specified_trigger_met)
  ) {
    return null;
  }

  return (
    <View style={pdfStyles.poSection}>
      <Text
        style={pdfStyles.sectionHeading}
        minPresenceAhead={20}
      >
        {strings.drefOperationalUpdateSummaryChangeHeading}
      </Text>
      <View>
        <View style={pdfStyles.row}>
          <Text style={pdfStyles.cellTitle}>
            {strings.drefOperationalUpdateSummaryAreYouChangingTimeFrame}
          </Text>
          <Text style={pdfStyles.strongCell}>
            {formatBoolean(data.changing_timeframe_operation)}
          </Text>
        </View>
        <View style={pdfStyles.row}>
          <Text style={pdfStyles.cellTitle}>
            {strings.drefOperationalUpdateSummaryAreYouChangingStrategy}
          </Text>
          <Text style={pdfStyles.strongCell}>
            {formatBoolean(data.changing_operation_strategy)}
          </Text>
        </View>
        <View style={pdfStyles.row}>
          <View style={pdfStyles.cellTitle}>
            <Text>{strings.drefOperationalUpdateSummaryAreYouChangingTargetPopulation}</Text>
          </View>
          <View style={pdfStyles.strongCell}>
            <Text>{formatBoolean(data.changing_target_population_of_operation)}</Text>
          </View>
        </View>
        <View style={pdfStyles.row}>
          <View style={pdfStyles.cellTitle}>
            <Text>{strings.drefOperationalUpdateSummaryAreYouChangingGeographicalLocation}</Text>
          </View>
          <View style={pdfStyles.strongCell}>
            <Text>{formatBoolean(data.changing_geographic_location)}</Text>
          </View>
        </View>
        <View style={pdfStyles.row}>
          <View style={pdfStyles.cellTitle}>
            <Text>{strings.drefOperationalUpdateSummaryAreYouChangingBudget}</Text>
          </View>
          <View style={pdfStyles.strongCell}>
            <Text>{formatBoolean(data.changing_budget)}</Text>
          </View>
        </View>
        <View style={pdfStyles.row}>
          <View style={pdfStyles.cellTitle}>
            <Text>{strings.drefOperationalUpdateSummaryRequestForSecondAllocation}</Text>
          </View>
          <View style={pdfStyles.strongCell}>
            <Text>{formatBoolean(data.request_for_second_allocation)}</Text>
          </View>
        </View>
        <View style={pdfStyles.row}>
          <View style={pdfStyles.cellTitle}>
            <Text>{strings.drefOperationalUpdateEventMaterialize}</Text>
          </View>
          <View style={pdfStyles.strongCell}>
            <Text>{formatBoolean(data.has_forecasted_event_materialize)}</Text>
          </View>
        </View>
        <View style={pdfStyles.row}>
          <View style={[
            pdfStyles.cellTitle,
            pdfStyles.fullWidth
          ]}>
            <Text style={pdfStyles.fontWeightBold}>
              {reTab(strings.drefOperationalUpdateSummaryExplain)}
            </Text>
          </View>
        </View>
        <View style={pdfStyles.row}>
          <View style={[
            pdfStyles.cellTitle,
            pdfStyles.fullWidth
          ]}>
            <Text>{reTab(data?.summary_of_change)}</Text>
          </View>
        </View>
        {isImminentOnset && (
          <>
            <View style={pdfStyles.row}>
              <View style={[
                pdfStyles.cellTitle,
                pdfStyles.fullWidth
              ]}>
                <Text style={pdfStyles.fontWeightBold}>
                  {strings.drefOperationalUpdateEventMaterializeExplain}
                </Text>
              </View>
            </View>
            <View style={pdfStyles.row}>
              <View style={[
                pdfStyles.cellTitle,
                pdfStyles.fullWidth
              ]}>
                <Text>{reTab(data?.specified_trigger_met)}</Text>
              </View>
            </View>
          </>
        )}
      </View>
    </View>
  );
}

export default SummaryOfChangeOutput;

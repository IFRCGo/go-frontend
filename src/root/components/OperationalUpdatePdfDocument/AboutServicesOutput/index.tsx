import React from 'react';
import {
  Text,
  View,
} from '@react-pdf/renderer';

import { Strings } from '#types';
import { DrefOperationalUpdateApiFields, TYPE_ASSESSMENT } from '#views/DrefOperationalUpdateForm/common';
import pdfStyles from '#utils/pdf/pdfStyles';
import { reTab } from '#utils/common';
import {
  isDefined,
  isNotDefined,
} from '@togglecorp/fujs';

interface Props {
  data: DrefOperationalUpdateApiFields;
  strings: Strings;
  drefType?: number;
}

function AboutServicesOutput(props: Props) {
  const {
    data,
    strings,
    drefType,
  } = props;

  if (isNotDefined(data.human_resource)
    && isNotDefined(data.surge_personnel_deployed)
    && isNotDefined(data.logistic_capacity_of_ns)
    && isNotDefined(data.pmer)
    && isNotDefined(data.communication)
  ) {
    return null;
  }

  return (
    <View
      style={pdfStyles.section}
      break
    >
      <Text
        style={pdfStyles.sectionHeading}
        minPresenceAhead={20}
      >
        {strings.drefFormSupportServices}
      </Text>
      {isDefined(data.human_resource) && (
        <View style={pdfStyles.qna}>
          <Text
            style={pdfStyles.textLabelSection}
            minPresenceAhead={20}
          >
            {strings.drefFormHumanResourceDescription}
          </Text>
          <Text style={pdfStyles.answer}>
            {reTab(data.human_resource)}
          </Text>
        </View>
      )}
      {isDefined(data.surge_personnel_deployed) && (
        <View style={pdfStyles.qna}>
          <Text
            style={pdfStyles.textLabelSection}
            minPresenceAhead={20}
          >
            {strings.drefFormSurgePersonnelDeployed}
            &nbsp;
            {strings.drefFormSurgePersonnelDeployedDescription}
          </Text>
          <Text style={pdfStyles.answer}>
            {reTab(data.surge_personnel_deployed)}
          </Text>
        </View>
      )}
      {drefType !== TYPE_ASSESSMENT && (
        <>
          {isDefined(data.logistic_capacity_of_ns) && (
            <View style={pdfStyles.qna}>
              <Text
                style={pdfStyles.textLabelSection}
                minPresenceAhead={20}
              >
                {strings.drefFormLogisticCapacityOfNs}
              </Text>
              <Text style={pdfStyles.answer}>
                {reTab(data.logistic_capacity_of_ns)}
              </Text>
            </View>
          )}
          {isDefined(data.pmer) && (
            <View style={pdfStyles.qna}>
              <Text
                style={pdfStyles.textLabelSection}
                minPresenceAhead={20}
              >
                {strings.drefFormPmer}
              </Text>
              <Text style={pdfStyles.answer}>
                {reTab(data.pmer)}
              </Text>
            </View>
          )}
          {isDefined(data.communication) && (
            <View style={pdfStyles.qna}>
              <Text
                style={pdfStyles.textLabelSection}
                minPresenceAhead={20}
              >
                {strings.drefFormCommunication}
              </Text>
              <Text style={pdfStyles.answer}>
                {reTab(data.communication)}
              </Text>
            </View>
          )}
        </>
      )}
    </View>
  );
}

export default AboutServicesOutput;

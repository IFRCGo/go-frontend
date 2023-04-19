import React from 'react';
import {
  Text,
  View,
} from '@react-pdf/renderer';

import { Strings } from '#types';
import { DrefApiFields, TYPE_ASSESSMENT } from '#views/DrefApplicationForm/common';
import pdfStyles from '#utils/pdf/pdfStyles';
import { isDefined, isNotDefined } from '@togglecorp/fujs';
import { reTab } from '#utils/common';

interface Props {
  data: DrefApiFields;
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
    <>
      {isDefined(data.human_resource) && (
        <View style={pdfStyles.section}>
          <Text
            style={pdfStyles.sectionHeading}
            minPresenceAhead={20}
          >
            {strings.drefFormSupportServices}
          </Text>
          <View style={pdfStyles.qna}>
            <Text
              style={pdfStyles.textLabelSection}
              minPresenceAhead={10}
            >
              {strings.drefFormHumanResourceDescription}
            </Text>
            <Text style={pdfStyles.answer}>
              {reTab(data.human_resource)}
            </Text>
          </View>
        </View>
      )}
      {isDefined(data.surge_personnel_deployed) && (
        <View style={pdfStyles.qna}>
          <Text
            style={pdfStyles.textLabelSection}
            minPresenceAhead={10}
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
                minPresenceAhead={10}
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
                minPresenceAhead={10}
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
                minPresenceAhead={10}
              >
                {strings.drefFormCommunication}
              </Text>
              <Text
                style={pdfStyles.answer}
              >
                {reTab(data.communication)}
              </Text>
            </View>
          )}
        </>
      )}
    </>
  );
}

export default AboutServicesOutput;

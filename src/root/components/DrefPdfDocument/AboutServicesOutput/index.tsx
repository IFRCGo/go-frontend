import React from 'react';
import {
  Text,
  View,
} from '@react-pdf/renderer';

import { Strings } from '#types';
import { DrefApiFields } from '#views/DrefApplicationForm/common';
import pdfStyles from '#utils/pdf/pdfStyles';
import { isDefined, isNotDefined } from '@togglecorp/fujs';

interface Props {
  data: DrefApiFields;
  strings: Strings;
  isAssessmentReport: boolean,
}

function AboutServicesOutput(props: Props) {
  const {
    data,
    strings,
    isAssessmentReport,
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
      break
      style={pdfStyles.section}
    >
      <Text style={pdfStyles.sectionHeading}>
        {strings.drefFormSupportServices}
      </Text>
      {isDefined(data.human_resource) && (
        <View style={pdfStyles.qna} minPresenceAhead={3}>
          <Text style={pdfStyles.textLabelSection}>
            {strings.drefFormHumanResourceDescription}
          </Text>
          <Text style={pdfStyles.answer}>
            {data.human_resource}
          </Text>
        </View>
      )}
      {isDefined(data.surge_personnel_deployed) && (
        <View style={pdfStyles.qna} minPresenceAhead={3}>
          <Text style={pdfStyles.textLabelSection}>
            {strings.drefFormSurgePersonnelDeployed}
            &nbsp;
            {strings.drefFormSurgePersonnelDeployedDescription}
          </Text>
          <Text style={pdfStyles.answer}>
            {data.surge_personnel_deployed}
          </Text>
        </View>
      )}
      {!isAssessmentReport && (
        <>
          {isDefined(data.logistic_capacity_of_ns) && (
            <View style={pdfStyles.qna} minPresenceAhead={3}>
              <Text style={pdfStyles.textLabelSection}>
                {strings.drefFormLogisticCapacityOfNs}
              </Text>
              <Text style={pdfStyles.answer}>
                {data.logistic_capacity_of_ns}
              </Text>
            </View>
          )}
          {isDefined(data.pmer) && (
            <View style={pdfStyles.qna} minPresenceAhead={3}>
              <Text style={pdfStyles.textLabelSection}>
                {strings.drefFormPmer}
              </Text>
              <Text style={pdfStyles.answer}>
                {data.pmer}
              </Text>
            </View>
          )}
          {isDefined(data.communication) && (
            <View style={pdfStyles.qna} minPresenceAhead={3}>
              <Text style={pdfStyles.textLabelSection}>
                {strings.drefFormCommunication}
              </Text>
              <Text style={pdfStyles.answer}>
                {data.communication}
              </Text>
            </View>
          )}
        </>
      )}
    </View>
  );
}

export default AboutServicesOutput;

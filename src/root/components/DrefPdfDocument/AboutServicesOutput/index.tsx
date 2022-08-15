import React from 'react';
import {
  Text,
  View,
} from '@react-pdf/renderer';

import { Strings } from '#types';
import { DrefApiFields } from '#views/DrefApplicationForm/common';
import pdfStyles from '#utils/pdf/pdfStyles';

interface Props {
  data: DrefApiFields;
  strings: Strings;
}

function AboutServicesOutput(props: Props) {
  const {
    data,
    strings,
  } = props;

  return (
    <>
      {(data?.human_resource ||
        data?.surge_personnel_deployed ||
        data?.logistic_capacity_of_ns ||
        data?.pmer ||
        data?.communication
      ) && (
          <View style={pdfStyles.section}>
            <Text style={pdfStyles.sectionHeading}>
              {strings.drefFormSupportServices}
            </Text>
            {data?.human_resource && (
              <View style={pdfStyles.qna}>
                <Text style={pdfStyles.textLabelSection}>
                  {strings.drefFormHumanResourceDescription}
                </Text>
                <Text style={pdfStyles.answer}>
                  {data.human_resource}
                </Text>
              </View>
            )}
            {data?.surge_personnel_deployed && (
              <View style={pdfStyles.qna}>
                <Text style={pdfStyles.textLabelSection}>
                  {strings.drefFormSurgePersonnelDeployed}
                  {strings.drefFormSurgePersonnelDeployedDescription}
                </Text>
                <Text style={pdfStyles.answer}>
                  {data.surge_personnel_deployed}
                </Text>
              </View>
            )}
            {data?.logistic_capacity_of_ns && (
              <View style={pdfStyles.qna}>
                <Text style={pdfStyles.textLabelSection}>
                  {strings.drefFormLogisticCapacityOfNs}
                </Text>
                <Text style={pdfStyles.answer}>
                  {data.logistic_capacity_of_ns}
                </Text>
              </View>
            )}
            {data?.pmer && (
              <View style={pdfStyles.qna}>
                <Text style={pdfStyles.textLabelSection}>
                  {strings.drefFormPmer}
                </Text>
                <Text style={pdfStyles.answer}>
                  {data.pmer}
                </Text>
              </View>
            )}
            {data?.communication && (
              <View style={pdfStyles.qna}>
                <Text style={pdfStyles.textLabelSection}>
                  {strings.drefFormCommunication}
                </Text>
                <Text style={pdfStyles.answer}>
                  {data.communication}
                </Text>
              </View>
            )}
          </View>
        )}
    </>
  );
}

export default AboutServicesOutput;

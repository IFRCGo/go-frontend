import React from 'react';
import {
  Text,
  View,
} from '@react-pdf/renderer';
import { isDefined, isNotDefined } from '@togglecorp/fujs';

import { Strings } from '#types';
import { formatNumber } from '#utils/common';
import { resolveToString } from '#utils/lang';
import { PdfTextOutput } from '#components/PdfTextOutput';
import pdfStyles from '#utils/pdf/pdfStyles';
import { DrefFinalReportApiFields, TYPE_ASSESSMENT } from '#views/FinalReportForm/common';

interface Props {
  data: DrefFinalReportApiFields;
  strings: Strings;
  drefType?: number;
}

function TargetedPopulationOutput(props: Props) {
  const {
    data,
    strings,
    drefType,
  } = props;

  if (isNotDefined(data.people_per_local)
    && isNotDefined(data.people_per_urban)
    && isNotDefined(data.disability_people_per)
    && isNotDefined(data.number_of_people_targeted)
    && isNotDefined(data.women)
    && isNotDefined(data.girls)
    && isNotDefined(data.men)
    && isNotDefined(data.boys)
  ) {
    return null;
  }

  return (
    <View style={pdfStyles.tpSection}>
      <Text
        style={pdfStyles.sectionHeading}
        minPresenceAhead={20}
      >
        {strings.drefFormAssistedPopulation}
      </Text>
      <View style={pdfStyles.section}>
        <View style={pdfStyles.basicInfoTable}>
          {drefType === TYPE_ASSESSMENT
            ? (<>
              <View style={pdfStyles.compactSection}>
                <PdfTextOutput
                  label={strings.drefExportEstimatedLocal}
                  columns="2/4"
                />
                <PdfTextOutput
                  label={strings.drefExportEstimatedUrban}
                  columns="2/4"
                />
              </View>
              <View style={pdfStyles.compactSection}>
                <PdfTextOutput
                  value={
                    isDefined(data.people_per_local)
                      ? resolveToString(
                        strings.drefExportPercentage,
                        { num: data.people_per_local })
                      : ''
                  }
                  columns="2/4"
                />
                <PdfTextOutput
                  value={
                    isDefined(data.people_per_urban)
                      ? resolveToString(
                        strings.drefExportPercentage,
                        { num: data.people_per_urban })
                      : ''
                  }
                  columns="2/4"
                />
              </View>
              <View style={pdfStyles.compactSection}>
                <PdfTextOutput
                  label={strings.drefExportEstimatePeopleDisability}
                  columns="4/4"
                />
              </View>
              <View style={pdfStyles.compactSection}>
                <PdfTextOutput
                  value={
                    isDefined(data.disability_people_per)
                      ? resolveToString(
                        strings.drefExportPercentage,
                        { num: data.disability_people_per })
                      : ''
                  }
                  columns="4/4"
                />
              </View>
              <View style={pdfStyles.compactSection}>
                <PdfTextOutput
                  label={strings.drefExportTotalTargetedPopulation}
                  columns="2/4"
                />
                <PdfTextOutput
                  value={formatNumber(data?.number_of_people_targeted)}
                  columns="2/4"
                  color='Red'
                />
              </View>
            </>)
            : (<>
              <View style={pdfStyles.compactSection}>
                <PdfTextOutput
                  label={strings.drefExportWomen}
                  columns="2/4"
                />
                <PdfTextOutput
                  value={formatNumber(data?.women)}
                />
                <PdfTextOutput
                  label={strings.drefExportEstimatedLocal}
                />
                <PdfTextOutput
                  label={strings.drefExportEstimatedUrban}
                />
              </View>
              <View style={pdfStyles.compactSection}>
                <PdfTextOutput
                  label={strings.drefExportGirls}
                  columns="2/4"
                />
                <PdfTextOutput
                  value={formatNumber(data?.girls)}
                />
                <PdfTextOutput
                  value={
                    isDefined(data.people_per_local)
                      ? resolveToString(
                        strings.drefExportPercentage,
                        { num: data.people_per_local })
                      : ''
                  }
                />
                <PdfTextOutput
                  value={
                    isDefined(data.people_per_urban)
                      ? resolveToString(
                        strings.drefExportPercentage,
                        { num: data.people_per_urban })
                      : ''
                  }
                />
              </View>
              <View style={pdfStyles.compactSection}>
                <PdfTextOutput
                  label={strings.drefExportMen}
                  columns="2/4"
                />
                <PdfTextOutput
                  value={formatNumber(data?.men)}
                />
                <PdfTextOutput
                  label={strings.drefExportEstimatePeopleDisability}
                  columns="2/4"
                />
              </View>
              <View style={pdfStyles.compactSection}>
                <PdfTextOutput
                  label={strings.drefExportBoys}
                  columns="2/4"
                />
                <PdfTextOutput
                  value={formatNumber(data?.boys)}
                />
                <PdfTextOutput
                  value={
                    isDefined(data.disability_people_per)
                      ? resolveToString(
                        strings.drefExportPercentage,
                        { num: data.disability_people_per })
                      : ''
                  }
                  columns="2/4"
                />
              </View>
              <View style={pdfStyles.compactSection}>
                <PdfTextOutput
                  label={strings.drefExportTotalTargetedPopulation}
                  columns="2/4"
                />
                <PdfTextOutput
                  value={formatNumber(data?.number_of_people_targeted)}
                  columns="3/4"
                  color='Red'
                />
              </View>
            </>
            )}
        </View>
      </View>
    </View>
  );
}
export default TargetedPopulationOutput;

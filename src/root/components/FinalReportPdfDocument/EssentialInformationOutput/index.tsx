import React from 'react';
import {
  Image,
  Text,
  View,
} from '@react-pdf/renderer';
import { isDefined } from '@togglecorp/fujs';

import { Strings } from '#types';
import { resolveToString } from '#utils/lang';
import { formatNumber } from '#utils/common';
import { PdfTextOutput } from '#components/PdfTextOutput';
import pdfStyles from '#utils/pdf/pdfStyles';
import { DrefFinalReportApiFields, TYPE_IMMINENT } from '#views/FinalReportForm/common';

interface Props {
  data: DrefFinalReportApiFields;
  strings: Strings;
  affectedAreas: string;
  drefType?: number;
}

function EssentialInformationOutput(props: Props) {
  const {
    data,
    strings,
    affectedAreas,
    drefType,
  } = props;

  return (
    <>
      {isDefined(data.cover_image_file?.file) && (
        <View style={[
          pdfStyles.section,
          pdfStyles.bannerImageContainer,
          pdfStyles.finalReportBannerImageContainer,
        ]}>
          <Image
            style={pdfStyles.bannerImage}
            src={data.cover_image_file.file}
          />
          <PdfTextOutput
            columns='4/4'
            value={data.cover_image_file.caption}
          />
        </View>
      )}
      <View style={pdfStyles.section}>
        <View style={pdfStyles.basicInfoTable}>
          <View style={pdfStyles.compactSection}>
            <PdfTextOutput
              label={strings.drefExportAppealNum}
              value={data?.appeal_code}
            />
            <PdfTextOutput
              label={strings.drefOperationalUpdateTotalAllocation}
              value={formatNumber(data.total_dref_allocation, 'CHF ')}
            />
            <PdfTextOutput
              label={strings.drefExportCrisisCategory}
              value={data.disaster_category_display}
              color={data.disaster_category_display}
            />
            <PdfTextOutput
              label={strings.drefExportHazard}
              value={data?.disaster_type_details?.name}
            />
          </View>
          <View style={pdfStyles.compactSection}>
            <PdfTextOutput
              label={strings.drefExportGlideNum}
              value={data?.glide_code}
            />
            <PdfTextOutput
              label={drefType === TYPE_IMMINENT
                ? strings.drefExportPeopleAtRisk
                : strings.drefExportPeopleAffected
              }
              value={isDefined(data.number_of_people_affected)
                ? resolveToString(
                  strings.drefExportNumPeople,
                  { num: formatNumber(data.number_of_people_affected) }
                )
                : ''
              }
            />
            <PdfTextOutput
              columns='2/4'
              label={strings.drefExportPeopleAssisted}
              value={isDefined(data.number_of_people_targeted)
                ? resolveToString(
                  strings.drefExportNumPeople,
                  { num: formatNumber(data.number_of_people_targeted) }
                )
                : ''
              }
            />
          </View>
          <View style={pdfStyles.compactSection}>
            <PdfTextOutput
              label={strings.drefExportEventOnset}
              value={data?.type_of_onset_display}
            />
            <PdfTextOutput
              label={strings.drefExportDrefOperationStartDate}
              value={data?.operation_start_date}
            />
            <PdfTextOutput
              label={strings.operationalUpdateExportNewOperationalEndDate}
              value={data?.operation_end_date}
            />
            <PdfTextOutput
              label={strings.drefOperationalUpdateExportTimeFrameTotalOperatingTimeFrame}
              value={
                isDefined(data.total_operation_timeframe)
                  ? resolveToString(
                    strings.drefExportNumMonth,
                    { num: data.total_operation_timeframe })
                  : ''
              }
            />
          </View>
          <View style={pdfStyles.compactSection}>
            <PdfTextOutput
              label={strings.drefExportTargetedAreas}
            />
            <PdfTextOutput
              value={affectedAreas}
              columns="3/4"
            />
          </View>
        </View>

        {isDefined(data.main_donors) && (
          <View style={pdfStyles.subSection}>
            <Text style={pdfStyles.subSectionHeading}>
              {/* hiding Main Donors title: strings.finalReportMainDonor */}
            </Text>
            <Text style={pdfStyles.mainDonorText}>
              {data.main_donors}
            </Text>
          </View>
        )}
      </View>
    </>
  );
}

export default EssentialInformationOutput;

import React from 'react';
import {
  Image,
  View,
} from '@react-pdf/renderer';
import { isDefined } from '@togglecorp/fujs';

import { Strings } from '#types';
import { resolveToString } from '#utils/lang';
import { formatNumber } from '#utils/common';
import { PdfTextOutput } from '#components/PdfTextOutput';
import { DrefApiFields, TYPE_IMMINENT } from '#views/DrefApplicationForm/common';
import pdfStyles from '#utils/pdf/pdfStyles';

interface Props {
  data: DrefApiFields;
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
              label={strings.drefExportCountry}
              value={data?.country_details.name}
            />
            <PdfTextOutput
              label={strings.drefExportHazard}
              value={data?.disaster_type_details?.name}
            />
            <PdfTextOutput 
              label={strings.drefFormTypeOfDref}
              value={data.type_of_dref_display}
            />
          </View>
          <View style={pdfStyles.compactSection}>
            <PdfTextOutput
              label={strings.drefExportCrisisCategory}
              value={data.disaster_category_display}
              color={data.disaster_category_display}
            />
            <PdfTextOutput
              label={strings.drefExportEventOnset}
              value={data?.type_of_onset_display}
            />
            <PdfTextOutput
              label={strings.drefExportDrefAllocated}
              value={formatNumber(data.amount_requested, 'CHF ')}
              columns="2/4"
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
              value={isDefined(data.num_affected)
                ? resolveToString(
                  strings.drefExportNumPeople,
                  { num: formatNumber(data.num_affected) }
                )
                : ''
              }
            />
            <PdfTextOutput
              label={strings.drefExportPeopleAssisted}
              value={isDefined(data.num_assisted)
                ? resolveToString(
                  strings.drefExportNumPeople,
                  { num: formatNumber(data.num_assisted) }
                )
                : ''
              }
              columns='2/4'
            />
          </View>
          <View style={pdfStyles.compactSection}>
            <PdfTextOutput
              label={strings.drefExportDrefOperationStartDate}
              value={data?.date_of_approval}
            />
            <PdfTextOutput
              label={strings.drefExportOperationTimeframe}
              value={
                isDefined(data.operation_timeframe)
                  ? resolveToString(
                    strings.drefExportNumMonth,
                    { num: data.operation_timeframe })
                  : ''
              }
            />
            <PdfTextOutput
              label={strings.drefExportDrefEndDateOfOperation}
              value={data?.end_date}
            />
            <PdfTextOutput
            label={strings.drefExportDrefPublished}
            value={data.publishing_date}
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
      </View>
    </>
  );
}

export default EssentialInformationOutput;

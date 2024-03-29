import React from 'react';
import {
  Image,
  Text,
  View,
} from '@react-pdf/renderer';
import {
  isDefined,
  isNotDefined,
} from '@togglecorp/fujs';
import sanitizeHtml from 'sanitize-html';

import { DrefFinalReportApiFields, TYPE_ASSESSMENT, TYPE_IMMINENT } from '#views/FinalReportForm/common';
import { PdfTextOutput } from '#components/PdfTextOutput';
import { Strings } from '#types';
import pdfStyles from '#utils/pdf/pdfStyles';

interface Props {
  data: DrefFinalReportApiFields;
  strings: Strings;
  drefType?: number;
}

function EventDescriptionOutput(props: Props) {
  const {
    data,
    strings,
    drefType,
  } = props;

  if (isNotDefined(data.event_scope)
    && isNotDefined(data.event_description)
    && isNotDefined(data.event_map_file)
    && (data.images_file.length < 1)
  ) {
    return null;
  }

  return (
    <View break>
      <Text
        style={pdfStyles.sectionHeading}
        minPresenceAhead={20}
      >
        {strings.drefFormDescriptionEvent}
      </Text>
      {data?.event_map_file && (
        <div style={pdfStyles.imagesSection}>
          <View style={pdfStyles.section}>
            <Image
              style={pdfStyles.mapImage}
              src={data.event_map_file.file}
            />
            <PdfTextOutput
              label={data.event_map_file.caption}
              columns='4/4'
            />
          </View>
        </div>
      )}
      {isDefined(data.event_description) && (
        <View style={pdfStyles.subSection}>
          <Text
            style={pdfStyles.subSectionHeading}
            minPresenceAhead={20}
          >
            {drefType === TYPE_IMMINENT
              ? strings.finalReportImminentDisaster
              : strings.finalReportWhatWhereWhen}
          </Text>
          <Text style={pdfStyles.text}>
            {sanitizeHtml(data.event_description ?? '', {
              allowedTags: [],
            })}
          </Text>
        </View>
      )}
      <div style={pdfStyles.imagesSection}>
        {data.images_file?.map((img) => (
          <View
            key={img?.id}
            style={pdfStyles.subSection}
          >
            <Image
              style={pdfStyles.coverImage}
              src={img.file}
              minPresenceAhead={20}
            />
            <PdfTextOutput
              label={img.caption}
              columns='4/4'
            />
          </View>
        ))}
      </div>
      {drefType !== TYPE_ASSESSMENT
        && isDefined(data.event_scope)
        && (
          <View style={pdfStyles.subSection}>
            <Text
              style={pdfStyles.subSectionHeading}
              minPresenceAhead={20}
            >
              {strings.drefExportScopeAndScaleEvent}
            </Text>
            <Text style={pdfStyles.text}>
              {data.event_scope}
            </Text>
          </View>
        )}
    </View>
  );
}

export default EventDescriptionOutput;

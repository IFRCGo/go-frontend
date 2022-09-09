import React from 'react';
import {
  Image,
  Text,
  View,
} from '@react-pdf/renderer';
import sanitizeHtml from 'sanitize-html';

import { Strings } from '#types';
import { formatBoolean } from '#utils/common';
import { PdfTextOutput } from '#components/PdfTextOutput';
import { DrefOperationalUpdateApiFields } from '#views/DrefOperationalUpdateForm/common';
import pdfStyles from '#utils/pdf/pdfStyles';

interface Props {
  data: DrefOperationalUpdateApiFields;
  strings: Strings;
  isImminentOnset: boolean;
  isAssessmentReport?: boolean;
}

function EventDescriptionOutput(props: Props) {
  const {
    data,
    strings,
    isImminentOnset,
    isAssessmentReport,
  } = props;

  return (
    <>
      {(
        data?.event_scope ||
        data?.event_description ||
        data?.anticipatory_actions ||
        data?.event_map_file ||
        data?.images_file.length > 0
      ) && (
          <View break>
            <Text style={pdfStyles.sectionHeading}>
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
            {data?.has_change_since_request && (
              <View style={pdfStyles.subSection}>
                <Text style={pdfStyles.subSectionHeading}>
                  {strings.drefOperationalUpdateDescriptionOfEventLabel}
                </Text>
                <Text style={pdfStyles.text}>
                  {formatBoolean(data.has_change_since_request)}
                </Text>
              </View>
            )}
            {data?.event_description && (
              <View style={pdfStyles.subSection}>
                <Text style={pdfStyles.subSectionHeading}>
                  {isImminentOnset
                    ? strings.drefExportWhatExpectedHappen
                    : strings.drefFormImminentDisaster}
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
                  />
                  <PdfTextOutput
                    label={img.caption}
                    columns='4/4'
                  />
                </View>
              ))}
            </div>
            {isImminentOnset && data?.anticipatory_actions && (
              <View style={pdfStyles.subSection}>
                <Text style={pdfStyles.subSectionHeading}>
                  {strings.drefExportTargetCommunities}
                </Text>
                <Text style={pdfStyles.text}>
                  {data.anticipatory_actions}
                </Text>
              </View>
            )}
            {!isAssessmentReport && data?.event_scope && (
              <View style={pdfStyles.subSection}>
                <Text style={pdfStyles.subSectionHeading}>
                  {strings.drefExportScopeAndScaleEvent}
                </Text>
                <Text style={pdfStyles.text}>
                  {data.event_scope}
                </Text>
              </View>
            )}
          </View>
        )}
    </>
  );
}

export default EventDescriptionOutput;

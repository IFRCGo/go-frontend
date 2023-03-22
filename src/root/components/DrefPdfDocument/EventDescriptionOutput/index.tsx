import React from 'react';
import {
  Image,
  Text,
  View,
} from '@react-pdf/renderer';
import { isDefined, isNotDefined } from '@togglecorp/fujs';
import sanitizeHtml from 'sanitize-html';

import { Strings } from '#types';
import { PdfTextOutput } from '#components/PdfTextOutput';
import {
  DrefApiFields,
  TYPE_ASSESSMENT,
  TYPE_IMMINENT,
} from '#views/DrefApplicationForm/common';
import pdfStyles from '#utils/pdf/pdfStyles';

interface Props {
  data: DrefApiFields;
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
    && isNotDefined(data.anticipatory_actions)
    && isNotDefined(data.event_map_file)
    && (data.images_file.length < 1)
  ) {
    return null;
  }

  return (
    <View break>
      <Text style={pdfStyles.sectionHeading}>
        {strings.drefFormDescriptionEvent}
      </Text>
      {drefType === TYPE_IMMINENT && (
        <>
          <Text style={pdfStyles.subSectionHeading}>
            {strings.drefFormApproximateDateOfImpact}
          </Text>
          <Text style={pdfStyles.text}>
            {data?.event_text}
          </Text>
        </>
      )}
      {isDefined(data.event_map_file) && (
        <View style={pdfStyles.imagesSection}>
          <View style={pdfStyles.section}>
            <Image
              style={pdfStyles.mapImage}
              src={data.event_map_file.file}
            />
            {data.event_map_file.caption && (
              <PdfTextOutput
                label={data.event_map_file.caption}
                columns='4/4'
              />
            )}
          </View>
        </View>
      )}
      {isDefined(data.event_description) && (
        <View style={pdfStyles.subSection}>
          <Text style={pdfStyles.subSectionHeading}>
            {drefType === TYPE_IMMINENT
              ? strings.drefExportWhatExpectedHappen
              : strings.drefFormWhatWhereWhen}
          </Text>
          <Text style={pdfStyles.text}>
            {sanitizeHtml(data.event_description ?? '', {
              allowedTags: [],
            })}
          </Text>
        </View>
      )}
      {(data.images_file?.length ?? 0) !== 0 && (
        <View style={pdfStyles.imagesSection} wrap={false}>
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
        </View>
      )}
      {drefType === TYPE_IMMINENT
        && isDefined(data.anticipatory_actions)
        && (
          <View style={pdfStyles.subSection}>
            <Text style={pdfStyles.subSectionHeading}>
              {strings.drefExportTargetCommunities}
            </Text>
            <Text style={pdfStyles.text}>
              {data.anticipatory_actions}
            </Text>
          </View>
        )}
      {drefType !== TYPE_ASSESSMENT
        && isDefined(data.event_scope)
        && (
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
  );
}

export default EventDescriptionOutput;

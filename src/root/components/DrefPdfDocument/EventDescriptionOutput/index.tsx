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
import { DrefApiFields } from '#views/DrefApplicationForm/common';
import pdfStyles from '#utils/pdf/pdfStyles';

interface Props {
  data: DrefApiFields;
  strings: Strings;
  isImminentDref: boolean;
  isAssessmentDref?: boolean;
}

function EventDescriptionOutput(props: Props) {
  const {
    data,
    strings,
    isImminentDref,
    isAssessmentDref,
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
      {isImminentDref && (
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
            {isImminentDref
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
      {isImminentDref
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
      {!isAssessmentDref
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

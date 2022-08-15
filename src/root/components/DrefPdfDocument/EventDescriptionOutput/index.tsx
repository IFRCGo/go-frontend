import React from 'react';
import {
  Image,
  Text,
  View,
} from '@react-pdf/renderer';
import sanitizeHtml from 'sanitize-html';

import { Strings } from '#types';
import { PdfTextOutput } from '#components/PdfTextOutput';
import { DrefApiFields } from '#views/DrefApplicationForm/common';
import pdfStyles from '#utils/pdf/pdfStyles';

interface Props {
  data: DrefApiFields;
  strings: Strings;
  isImminentOnset: boolean;
}

function EventDescriptionOutput(props: Props) {
  const {
    data,
    strings,
    isImminentOnset
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
          <View>
            <Text style={pdfStyles.sectionHeading}>
              {strings.drefFormDescriptionEvent}
            </Text>
            {data?.event_map_file && (
              <View style={pdfStyles.subSection}>
                <Image
                  style={pdfStyles.mapImage}
                  src={data.event_map_file.file}
                />
                <PdfTextOutput
                  value={data.event_map_file.caption}
                  columns='4/4'
                />
              </View>
            )}
            {data?.event_description && (
              <View style={pdfStyles.subSection}>
                <Text style={pdfStyles.subSectionHeading}>
                  {!isImminentOnset
                    ? strings.drefFormWhatWhereWhen
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
                    style={pdfStyles.mapImage}
                    src={img.file}
                  />
                  <Text>
                    {img.caption}
                  </Text>
                </View>
              ))}
            </div>

            {/*data shows in imminent only*/}
            {data.anticipatory_actions && (
              <View style={pdfStyles.subSection}>
                <Text style={pdfStyles.subSectionHeading}>
                  {strings.drefFormTargetCommunities}
                </Text>
                <Text style={pdfStyles.text}>
                  {data.anticipatory_actions}
                </Text>
              </View>
            )}
            {data?.event_scope && (
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

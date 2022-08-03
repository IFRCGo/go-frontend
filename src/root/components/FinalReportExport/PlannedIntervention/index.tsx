import React from 'react';
import {
  Image,
  Text,
  View,
} from '@react-pdf/renderer';

import { DrefFinalReportApiFields } from '#views/FinalReportForm/common';
import { Strings } from '#types';

import pdfStyles from 'src/styles/pdf/pdfStyles';

interface Props {
  data: DrefFinalReportApiFields['planned_interventions'][number];
  piMap?: Record<string, string>;
  strings: Strings;
}

function PlannedIntervention(props: Props) {
  const {
    data,
    piMap,
    strings,
  } = props;

  return (
    <View
      style={pdfStyles.piOutput}
      wrap={false}
    >
      <View style={pdfStyles.piRow}>
        <View style={pdfStyles.piIconCell}>
          {data?.image_url && (
            <Image
              style={pdfStyles.piIcon}
              src={data.image_url}
            />
          )}
        </View>
        <Text style={pdfStyles.piHeaderCell}>
          {piMap?.[data.title]}
        </Text>
        <View style={[
          pdfStyles.piContentCell,
          { flexDirection: 'column' }
        ]}
        >
          <View style={pdfStyles.piSubRow}>
            <Text style={pdfStyles.piSubHeadingCell}>
              {strings.finalReportExportPersonReachedLabel}
            </Text>
            <Text style={pdfStyles.piSubHeadingCell}>
              {strings.finalReportIndicatorMaleLabel}
            </Text>
            <Text style={pdfStyles.piSubContentCell}>
              {data?.male}
            </Text>
          </View>
          <View style={pdfStyles.piSubRow}>
            <Text style={pdfStyles.piSubHeadingCell} />
            <Text style={pdfStyles.piSubHeadingCell}>
              {strings.finalReportIndicatorFemaleLabel}
            </Text>
            <Text style={pdfStyles.piSubContentCell}>
              {data?.female}
            </Text>
          </View>
        </View>
      </View>

      <View style={pdfStyles.piRow}>
        <View style={pdfStyles.piContentCell}>
          <Text style={[
            pdfStyles.piBorderCell,
            pdfStyles.fontWeightBoldAndLarge
          ]}
          >
            {strings.finalReportExportIndicators}
          </Text>
        </View>
        <View style={pdfStyles.piHeaderCell}>
          <Text>
            {strings.finalReportIndicatorTargetLabel}
          </Text>
        </View>
        <View style={pdfStyles.piHeaderCell}>
          <Text>
            {strings.finalReportIndicatorActualLabel}
          </Text>
        </View>
      </View>

      {
        data?.indicators?.map((indicator) => (
          <View
            style={pdfStyles.piRow}
            key={indicator.id}
          >
            <View style={pdfStyles.piContentCell}>
              <Text style={pdfStyles.piBorderCell}>
                {indicator.title}
              </Text>
            </View>
            <View style={[pdfStyles.piHeaderCell, pdfStyles.fontWeightNormalAndSmall]}>
              <Text style={pdfStyles.fontWeightNormalAndSmall}>
                {indicator.target}
              </Text>
            </View>
            <View style={[pdfStyles.piHeaderCell, pdfStyles.fontWeightNormalAndSmall]}>
              <Text style={pdfStyles.fontWeightNormalAndSmall}>
                {indicator.actual}
              </Text>
            </View>
          </View>
        ))
      }
      <View style={pdfStyles.piRow}>
        <Text style={[
          pdfStyles.piBorderCell,
          pdfStyles.fontWeightBoldAndLarge
        ]}
        >
          {strings.finalReportPlannedInterventionNarrativeAchievement}
        </Text>
      </View>
      {data?.challenges && (
        <View style={pdfStyles.piRow}>
          <Text style={pdfStyles.piBorderCell}>
            {data.narrative_description_of_achievements}
          </Text>
        </View>
      )}
      <View style={pdfStyles.piRow}>
        <Text style={[
          pdfStyles.piBorderCell,
          pdfStyles.fontWeightBoldAndLarge
        ]}
        >
          {strings.finalReportPlannedInterventionChallenges}
        </Text>
      </View>
      {data?.challenges && (
        <View style={pdfStyles.piRow}>
          <Text style={pdfStyles.piBorderCell}>
            {data.challenges}
          </Text>
        </View>
      )}
      <View style={pdfStyles.piRow}>
        <Text style={[
          pdfStyles.piBorderCell,
          pdfStyles.fontWeightBoldAndLarge
        ]}
        >
          {strings.finalReportPlannedInterventionLessonsLearnt}
        </Text>
      </View>
      {data?.lessons_learnt && (
        <View style={pdfStyles.piRow}>
          <Text style={pdfStyles.piBorderCell}>
            {data.lessons_learnt}
          </Text>
        </View>
      )}
    </View>
  );
}

export default PlannedIntervention;

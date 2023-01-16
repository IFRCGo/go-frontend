import React from 'react';
import {
  Image,
  Text,
  View,
} from '@react-pdf/renderer';

import { Strings } from '#types';
import { formatNumber } from '#utils/common';
import pdfStyles from '#utils/pdf/pdfStyles';
import { DrefFinalReportApiFields } from '#views/FinalReportForm/common';

interface BaseProps {
  data: DrefFinalReportApiFields;
  piMap?: Record<string, string>;
  strings: Strings;
}
interface PlannedInterventionProps {
  data: DrefFinalReportApiFields['planned_interventions'][number];
  piMap?: Record<string, string>;
  strings: Strings;
}

function PlannedIntervention(props: PlannedInterventionProps) {
  const {
    data,
    piMap,
    strings,
  } = props;

  return (
    <View style={pdfStyles.piOutput}>
      <View style={pdfStyles.piRow}>
        <View style={pdfStyles.piSmallColumn}>
          <View style={pdfStyles.piIconCell}>
            {data.image_url && (
              <Image
                style={pdfStyles.piIcon}
                src={data.image_url}
              />
            )}
          </View>
          <Text style={pdfStyles.piHeaderCell}>
            {piMap?.[data.title]}
          </Text>
        </View>
        <View style={pdfStyles.piMultiRow}>
          <View style={pdfStyles.piSubRow}>
            <Text style={pdfStyles.piSubHeadingCell}>
              {strings.drefExportBudget}
            </Text>
            <Text style={pdfStyles.piSubContentCell}>
              {formatNumber(data.budget, 'CHF ')}
            </Text>
          </View>
          <View style={pdfStyles.piSubRow}>
            <Text style={pdfStyles.piSubHeadingCell}>
              {strings.drefExportTargetPersons}
            </Text>
            <Text style={pdfStyles.piSubContentCell}>
              {data.person_targeted}
            </Text>
          </View>
          <View style={pdfStyles.piSubRow}>
            <Text style={pdfStyles.piSubHeadingCell}>
              {strings.drefFormInterventionPersonAssistedLabel}
            </Text>
            <Text style={pdfStyles.piSubContentCell}>
              {data.person_assisted}
            </Text>
          </View>
        </View>
      </View>
      {data?.indicators?.length > 0 && (
        <>
          <View style={pdfStyles.piRow}>
            <View style={pdfStyles.piSmallColumn}>
              <Text style={pdfStyles.piContentHeadingCell}>
                {strings.drefExportIndicators}
              </Text>
            </View>
            <View style={pdfStyles.piLargeColumn}>
              <View style={pdfStyles.piMediumColumn}>
                <Text style={pdfStyles.piContentHeadingCell}>
                  {strings.drefFormIndicatorTargetLabel}
                </Text>
              </View>
              <View style={pdfStyles.piMediumColumn}>
                <Text style={pdfStyles.piContentHeadingCell}>
                  {strings.drefFormIndicatorActualLabel}
                </Text>
              </View>
            </View>
          </View>
        </>
      )}

      {data?.indicators?.map((indicator) => (
        <View
          key={indicator?.id}
          style={pdfStyles.piRow}
        >
          <View style={pdfStyles.piSmallColumn}>
            <Text style={pdfStyles.piBorderCell}>
              {indicator.title}
            </Text>
          </View>
          <View style={pdfStyles.piLargeColumn}>
            <View style={pdfStyles.piMediumColumn}>
              <Text style={pdfStyles.piBorderCell}>
                {indicator.target}
              </Text>
            </View>
            <View style={pdfStyles.piMediumColumn}>
              <Text style={pdfStyles.piBorderCell}>
                {indicator.actual}
              </Text>
            </View>
          </View>
        </View>
      ))}
      {data?.narrative_description_of_achievements && (
        <>
          <View style={pdfStyles.piRow}>
            <View style={pdfStyles.piContentHeadingCell}>
              <Text>
                {strings.finalReportPlannedInterventionNarrativeAchievement}
              </Text>
            </View>
          </View>
          <View style={pdfStyles.piRow}>
            <View style={pdfStyles.piBorderCell}>
              <Text>
                {data.narrative_description_of_achievements}
              </Text>
            </View>
          </View>
        </>
      )}
      {data?.lessons_learnt && (
        <>
          <View style={pdfStyles.piRow}>
            <View style={pdfStyles.piContentHeadingCell}>
              <Text>
                {strings.finalReportPlannedInterventionLessonsLearnt}
              </Text>
            </View>
          </View>
          <View style={pdfStyles.piRow}>
            <View style={pdfStyles.piBorderCell}>
              <Text>
                {data.lessons_learnt}
              </Text>
            </View>
          </View>
        </>
      )}
      {data?.challenges && (
        <>
          <View style={pdfStyles.piRow}>
            <View style={pdfStyles.piContentHeadingCell}>
              <Text>
                {strings.finalReportPlannedInterventionChallenges}
              </Text>
            </View>
          </View>
          <View style={pdfStyles.piRow}>
            <View style={pdfStyles.piBorderCell}>
              <Text>
                {data.challenges}
              </Text>
            </View>
          </View>
        </>
      )}
    </View >
  );
}

function PlannedInterventionOutput(props: BaseProps) {
  const {
    data,
    piMap,
    strings,
  } = props;

  if (data.planned_interventions.length < 1) {
    return null;
  }

  return (
    <View
      style={pdfStyles.piSection}
      break
    >
      <Text
        style={pdfStyles.sectionHeading}
        minPresenceAhead={20}
      >
        {strings.finalReportImplementation}
      </Text>
      {data?.planned_interventions.map((pi) => (
        <PlannedIntervention
          strings={strings}
          key={pi.id}
          data={pi}
          piMap={piMap}
        />
      ))}
    </View>
  );
}

export default PlannedInterventionOutput;

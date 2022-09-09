import React from 'react';
import {
  Image,
  Text,
  View,
} from '@react-pdf/renderer';

import { Strings } from '#types';
import { formatNumber } from '#utils/common';
import { DrefOperationalUpdateApiFields } from '#views/DrefOperationalUpdateForm/common';
import pdfStyles from '#utils/pdf/pdfStyles';

interface BaseProps {
  data: DrefOperationalUpdateApiFields;
  piMap?: Record<string, string>;
  strings: Strings;
}
interface PlannedInterventionProps {
  data: DrefOperationalUpdateApiFields['planned_interventions'][number];
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
    <View
      style={pdfStyles.piOutput}
    >
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
        </View>
      </View>
      <View style={pdfStyles.piRow}>
        <View style={pdfStyles.piSmallColumn}>
          <Text style={pdfStyles.piContentHeadingCell}>
            {strings.drefExportIndicators}
          </Text>
        </View>
        <View style={pdfStyles.piLargeColumn}>
          <Text style={pdfStyles.piContentHeadingCell}>
            {strings.drefFormIndicatorTargetLabel}
          </Text>
        </View>
      </View>
      {
        data?.indicators?.map((el) => (
          <View
            key={el?.id}
            style={pdfStyles.piRow}
          >
            <View style={pdfStyles.piSmallColumn}>
              <Text style={pdfStyles.piBorderCell}>
                {el.title}
              </Text>
            </View>
            <View style={pdfStyles.piLargeColumn}>
              <Text style={pdfStyles.piBorderCell}>
                {el.target}
              </Text>
            </View>
          </View>
        ))
      }
      <View style={pdfStyles.piRow}>
        <View style={pdfStyles.piSmallColumn}>
          <View style={pdfStyles.piPriorityCell}>
            <Text>
              {strings.drefExportPriorityActions}
            </Text>
          </View>
        </View>
        <View style={pdfStyles.piLargeColumn}>
          <Text style={pdfStyles.piBorderCell}>
            {data.description}
          </Text>
        </View>
      </View>
    </View >
  );
}

function PlannedInterventionOutput(props: BaseProps) {
  const {
    data,
    piMap,
    strings,
  } = props;

  return (
    <>
      {data.planned_interventions.length > 0 && (
        <View
          style={pdfStyles.piSection}
          break
        >
          <Text style={pdfStyles.sectionHeading}>
            {strings.drefFormPlannedIntervention}
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
      )}
    </>
  );
}

export default PlannedInterventionOutput;

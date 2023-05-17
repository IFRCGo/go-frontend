import React from 'react';
import {
  addSeparator,
  _cs,
} from '@togglecorp/fujs';

import { getPrettyBreakpoints } from '#utils/common';
import {
  riskMetricOptions,
  MAX_PRETTY_BREAKS,
  displacementColors,
  informLegendData,
} from '../../common';
import LegendItem from '../LegendItem';

import styles from './styles.module.scss';

interface Props {
  selectedRiskMetric: (typeof riskMetricOptions)[number]['value'];
  maxValue: number,
  className?: string;
}

function MapLegend(props: Props) {
  const {
    selectedRiskMetric,
    maxValue,
    className,
  } = props;

  const prettyValues = getPrettyBreakpoints(0, maxValue, MAX_PRETTY_BREAKS, MAX_PRETTY_BREAKS);

  const legendData = React.useMemo(() => {
    if (selectedRiskMetric === 'displacement') {
      const displacementLegendData = [];
      for (let i = 0; i < prettyValues.ndiv; i += 1) {
        displacementLegendData.push({
          color: displacementColors[i],
          label: `${addSeparator(i * prettyValues.unit)} - ${addSeparator((i + 1) * prettyValues.unit)}`,
        });
      }

      return displacementLegendData;
    }

    if (selectedRiskMetric === 'exposure') {
      const exposureLegendData = [];
      for (let i = 0; i < prettyValues.ndiv; i += 1) {
        exposureLegendData.push({
          color: displacementColors[i],
          label: `${addSeparator(i * prettyValues.unit)} - ${addSeparator((i + 1) * prettyValues.unit)}`,
        });
      }

      return exposureLegendData;
    }

    if (selectedRiskMetric === 'informRiskScore') {
      return informLegendData;
    }

    return [];
  }, [prettyValues, selectedRiskMetric]);

  if (maxValue === 0) {
    return null;
  }

  return (
    <div className={_cs(styles.mapLegend, className)}>
      {legendData.map((d) => (
        <LegendItem
          key={d.label}
          color={d.color}
          label={d.label}
        />
      ))}
    </div>
  );
}

export default MapLegend;

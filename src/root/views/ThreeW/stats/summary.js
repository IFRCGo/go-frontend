'use strict';
import React from 'react';
import {
  _cs,
  unique,
} from '@togglecorp/fujs';

import FormattedNumber from '../../../components/formatted-number';

const SummaryElement = (p) => {
  const {
    value,
    label,
  } = p;

  return (
    <div className='summary-element'>
      <FormattedNumber
        className='summary-element-value'
        value={value}
        normalize
        fixedTo={1}
      />
      <div className='summary-element-label'>
        { label }
      </div>
    </div>
  );
};

function ProjectSummary (p) {
  const {
    className,
    projectList,
  } = p;

  const [
    activeNationalSocietyCount,
    totalBudget,
  ] = React.useMemo(() => {
    const activeNationalSocietyCount = unique(projectList.map(d => d.reporting_ns)).length;
    const totalBudget = projectList.reduce((a, b) => a + b.budget_amount, 0);

    return [
      activeNationalSocietyCount,
      totalBudget,
    ];
  }, [projectList]);

  return (
    <div className={_cs(className, 'three-w-stats-summary')}>
      <SummaryElement
        label="Active National societies"
        value={activeNationalSocietyCount}
      />
      <SummaryElement
        label="Total budget"
        value={totalBudget}
      />
    </div>
  );
}

export default ProjectSummary;

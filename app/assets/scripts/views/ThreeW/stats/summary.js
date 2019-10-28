'use strict';
import React from 'react';
import {
  formattedNormalize,
  _cs,
  unique,
} from '@togglecorp/fujs';

const SummaryElement = ({
  value,
  label,
  fixed,
}) => {
  const {
    number,
    normalizeSuffix,
  } = formattedNormalize(value, 'en');

  return (
    <div className='summary-element'>
      <div className='summary-element-value'>
        <div className='summary-element-value-number'>
          { (number && fixed) ? number.toFixed(1) : number }
        </div>
        <div className='summary-element-value-suffix'>
          { normalizeSuffix }
        </div>
      </div>
      <div className='summary-element-label'>
        { label }
      </div>
    </div>
  );
};

export default class ProjectSummary extends React.PureComponent {
  getRenderData = (projectList) => {
    const activeNationalSocietyCount = unique(projectList.map(d => d.reporting_ns)).length;
    const totalBudget = projectList.reduce((a, b) => a + b.budget_amount, 0);

    return {
      activeNationalSocietyCount,
      totalBudget,
    };
  }

  render () {
    const {
      className,
      projectList,
    } = this.props;

    const {
      activeNationalSocietyCount,
      totalBudget,
    } = this.getRenderData(projectList);

    return (
      <div className={_cs(className, 'three-w-stats-summary')}>
        <SummaryElement
          label="Active national societies"
          value={activeNationalSocietyCount}
        />
        <SummaryElement
          label="Total budget"
          value={totalBudget}
          fixed
        />
      </div>
    );
  }
}

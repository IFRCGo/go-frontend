import React from 'react';
import _cs from 'classnames';
import FormattedNumber from '../../components/formatted-number';

function TextOutput (p) {
  const {
    label,
    value = 0,
  } = p;

  return (
    <div className='bo-text-output'>
      <FormattedNumber
        className='tc-value'
        value={value}
        normalize
        fixedTo={1}
      />
      <div className='tc-label'>
        { label }
      </div>
    </div>
  );
}

function BudgetOverview (p) {
  const {
    totalBudget,
    nsCountWithOngoingActivity,
    className,
  } = p;

  return (
    <div className={_cs(className, 'budget-overview')}>
      <TextOutput
        label="Total budget"
        value={totalBudget}
      />
      <TextOutput
        label="NS with ongoing activities"
        value={nsCountWithOngoingActivity}
      />
    </div>
  );
}

export default BudgetOverview;

import React from 'react';
import _cs from 'classnames';
import FormattedNumber from '../../components/formatted-number';

function TextOutput ({
  label,
  value = 0,
}) {
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

function BudgetOverview (props) {
  const {
    totalBudget,
    nsCountWithOngoingActivity,
    className,
  } = props;

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

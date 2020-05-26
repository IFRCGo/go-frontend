import React, { useContext } from 'react';
import _cs from 'classnames';
import FormattedNumber from '#components/formatted-number';
import LanguageContext from '#root/languageContext';

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

  const { strings } = useContext(LanguageContext);
  return (
    <div className={_cs(className, 'budget-overview')}>
      <TextOutput
        label={strings.budgetOverviewNSOngoingActivity}
        value={nsCountWithOngoingActivity}
      />
      <TextOutput
        label={strings.butgetOverviewTotalBudget}
        value={totalBudget}
      />
    </div>
  );
}

export default BudgetOverview;

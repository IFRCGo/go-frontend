'use strict';

export const AppealTypeComparator = (atype) => {
  return atype.target.value !== 'all'
    ? emergency => emergency.atype.toString() === atype.target.value.toString()
    : d => true;
};

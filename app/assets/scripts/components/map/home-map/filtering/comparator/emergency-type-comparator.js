'use strict';

export const EmergencyTypeComparator = (emergencyTypeId) => {
  return emergencyTypeId
    ? emergency => emergency.dtype.toString() === emergencyTypeId.toString()
    : emergency => true;
};

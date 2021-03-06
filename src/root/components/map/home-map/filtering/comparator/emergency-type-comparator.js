
export const EmergencyTypeComparator = (emergencyTypeId) => {
  return emergencyTypeId > 0
    ? emergency => emergency.dtype.toString() === emergencyTypeId.toString()
    : () => true;
};

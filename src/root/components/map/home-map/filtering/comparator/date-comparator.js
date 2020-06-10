/**
 * The date comparator for emergencies looks at a window of emergency start dates.
 * Emergency end dates do exist but are assigned to arbitrary dates in the future so
 * they are rarely useful to users seraching for emergencies by date.
 * @param {object} dates Contains a start_date and end_date specified by the user
*/
export const DateComparator = (dates) => {
  return dates.startDate && dates.endDate
    ? emergency => emergency.start_date >= dates.startDate && emergency.start_date <= dates.endDate : d => true;
};

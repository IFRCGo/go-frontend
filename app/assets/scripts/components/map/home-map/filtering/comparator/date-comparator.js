// end dates are often set far into the future making it difficult to predictably filter
export const DateComparator = (dates) => {
  return dates.startDate
    ? emergency => emergency.start_date >= dates.startDate : d => true;
};

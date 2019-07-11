const processType = {
  0: 'Self-assessment',
  1: 'Simulation',
  2: 'Operational',
  3: 'Post Operational'
};

export function getPerProcessType (id) {
  return processType[id];
}

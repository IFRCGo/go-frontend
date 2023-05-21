const eruTypes = {
  '0': 'Basecamp',
  '1': 'IT & Telecom',
  '2': 'Logistics',
  '3': 'RCRC Emergency Hospital',
  '4': 'RCRC Emergency Clinic',
  '5': 'Relief',
  '6': 'WASH M15',
  '7': 'WASH MSM20',
  '8': 'WASH M40',
  '9': 'Water Supply and rehabilitation',
  '10': 'Household Water Treatment and safe storage',
  '11': 'Cholera Case management at Community level',
  '12': 'Safe and Dignified Burials',
  '13': 'Community Based Surveillance',
  '14': 'Base Camp – S',
  '15': 'Base Camp – M',
  '16': 'Base Camp – L'
};

export default eruTypes;

export function getEruType (id) {
  return eruTypes[id.toString()];
}

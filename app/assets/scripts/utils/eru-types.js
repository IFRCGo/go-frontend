const eruTypes = {
  '0': 'Basecamp',
  '1': 'IT & Telecom',
  '2': 'Logistics',
  '3': 'RCRC Emergency Hospital',
  '4': 'RCRC Emergency Clinic',
  '5': 'Relief',
  '6': 'WASH M15',
  '7': 'WASH MSM20',
  '8': 'WASH M40'
};

export default eruTypes;

export function getEruType (id) {
  return eruTypes[id.toString()];
}

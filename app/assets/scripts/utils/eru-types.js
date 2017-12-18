const eruTypes = {
  '0': 'Basecamp',
  '1': 'Healthcare',
  '2': 'Telecom',
  '3': 'Logistics',
  '4': 'Deploy Hospital',
  '5': 'Refer Hospital',
  '6': 'Relief',
  '7': 'Sanitation & Water 10',
  '8': 'Sanitation & Water 20',
  '9': 'Sanitation & Water 40'
};

export default eruTypes;

export function getEruType (id) {
  return eruTypes[id.toString()];
}

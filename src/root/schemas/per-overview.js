export default {
  properties: {
    country_id: { },
    date_of_assessment: {
      type: 'string',
      format: 'date',
      formatMinimum: '1980-01-01',
      formatExclusiveMaximum: true
    },
    type_of_assessment: { }
  },
  required: [
    'country_id',
    'date_of_assessment',
    'type_of_assessment'
  ]
};

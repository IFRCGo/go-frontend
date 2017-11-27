'use strict';
import * as formData from '../utils/field-report-constants';

const getValidValues = (arr, key) => arr.map(o => o[key]).filter(o => o !== '');

export const step1 = {
  properties: {
    summary: {
      type: 'string'
    },
    countries: {
      type: 'array',
      minItems: 1,
      items: {
        enum: getValidValues(formData.countries, 'value')
      }
    },
    status: {
      type: 'string',
      enum: getValidValues(formData.status, 'value')
    },
    disasterType: {
      type: 'string',
      enum: getValidValues(formData.disasterType, 'value')
    },
    event: {
      type: 'string',
      enum: getValidValues(formData.event, 'value')
    },
    description: {
      type: 'string'
    },
    assistance: {
      type: 'boolean'
    }
  },
  required: ['summary', 'countries', 'status', 'disasterType']
};

// numDead: { redCross: undefined, government: undefined },
// numMissing: { redCross: undefined, government: undefined },
// numAffected: { redCross: undefined, government: undefined },
// numDisplaced: { redCross: undefined, government: undefined },
// numAssistedGov: undefined,
// numAssistedRedCross: undefined,
// numLocalStaff: undefined,
// numVolunteers: undefined,
// numExpats: undefined,
export const step2 = {
  properties: {
    numInjured: {
      properties: {
        redCross: { type: 'number', minimum: 0 },
        government: { type: 'number', minimum: 0 }
      }
    },
    numDead: {
      properties: {
        redCross: { type: 'number', minimum: 0 },
        government: { type: 'number', minimum: 0 }
      }
    },
    numMissing: {
      properties: {
        redCross: { type: 'number', minimum: 0 },
        government: { type: 'number', minimum: 0 }
      }
    },
    numAffected: {
      properties: {
        redCross: { type: 'number', minimum: 0 },
        government: { type: 'number', minimum: 0 }
      }
    },
    numDisplaced: {
      properties: {
        redCross: { type: 'number', minimum: 0 },
        government: { type: 'number', minimum: 0 }
      }
    },
    numAssistedGov: { type: 'number', minimum: 0 },
    numAssistedRedCross: { type: 'number', minimum: 0 },
    numLocalStaff: { type: 'number', minimum: 0 },
    numVolunteers: { type: 'number', minimum: 0 },
    numExpats: { type: 'number', minimum: 0 }
  }
};

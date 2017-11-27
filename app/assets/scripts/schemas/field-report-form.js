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

export const step3 = {
  definitions: {
    actionsCheckboxes: {
      properties: {
        options: {
          type: 'array',
          items: {
            properties: {
              checked: {
                type: 'boolean'
              }
            }
          }
        },
        description: {
          type: 'string'
        }
      }
    }
  },
  properties: {
    actionsNatSoc: {
      '$ref': '#/definitions/actionsCheckboxes'
    },
    actionsPns: {
      '$ref': '#/definitions/actionsCheckboxes'
    },
    actionsFederation: {
      '$ref': '#/definitions/actionsCheckboxes'
    },
    bulletin: {
      type: 'string'
    },
    actionsOthers: {
      type: 'string'
    }
  }
};

export const step4 = {
  properties: {
    dref: {
      type: 'string'
    },
    amountDref: {
      type: 'number'
    },
    emergencyAppeal: {
      type: 'string'
    },
    amountEmergencyAppeal: {
      type: 'number'
    },
    rdrtrits: {
      type: 'string'
    },
    numPplRdrits: {
      type: 'number'
    },
    fact: {
      type: 'string'
    },
    numPplFact: {
      type: 'number'
    },
    ifrcStaff: {
      type: 'string'
    },
    numPplIfrcStaff: {
      type: 'number'
    }
  }
};

export const step5 = {
  definitions: {
    contact: {
      properties: {
        name: { type: 'string' },
        func: { type: 'string' },
        email: { type: 'string', format: 'email' }
      }
    }
  },
  properties: {
    contactOriginator: {
      '$ref': '#/definitions/contact'
    },
    contactPrimary: {
      '$ref': '#/definitions/contact'
    },
    contactNatSoc: {
      '$ref': '#/definitions/contact'
    },
    contactFederation: {
      '$ref': '#/definitions/contact'
    },
    contactMediaNatSoc: {
      '$ref': '#/definitions/contact'
    },
    contactMedia: {
      '$ref': '#/definitions/contact'
    }
  }
};

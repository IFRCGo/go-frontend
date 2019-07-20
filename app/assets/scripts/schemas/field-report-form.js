'use strict';
import * as formData from '../utils/field-report-constants';

const getValidValues = (arr, key) => arr.map(o => o[key]).filter(o => o !== '');

export const step1 = {
  properties: {
    status: {
      type: 'string',
      enum: getValidValues(formData.status, 'value')
    },
    summary: {
      type: 'string'
    },
    event: {
      type: 'number',
      minimum: 0
    },
    // countries: {
    //   type: 'array',
    //   minItems: 1,
    //   items: {
    //     enum: getValidValues(formData.countries, 'value')
    //   }
    // },
    country: {
      type: 'string',
      enum: getValidValues(formData.countries, 'value')
    },
    districts: {
      type: 'array'
    },
    disasterType: {
      type: 'string',
      enum: getValidValues(formData.disasterType, 'value')
    },
    assistance: {
      type: 'boolean'
    }
  },
  required: ['summary', 'country', 'status', 'disasterType']
};

export const step2 = {
  definitions: {
    estimation: {
      type: 'array',
      items: {
        properties: {
          estimation: { type: 'number', minimum: 0 },
          source: {enum: ['red-cross', 'government']}
        }
      }
    }
  },
  properties: {
    numInjured: {
      '$ref': '#/definitions/estimation'
    },
    numDead: {
      '$ref': '#/definitions/estimation'
    },
    numMissing: {
      '$ref': '#/definitions/estimation'
    },
    numAffected: {
      '$ref': '#/definitions/estimation'
    },
    numDisplaced: {
      '$ref': '#/definitions/estimation'
    },
    description: {
      type: 'string'
    }
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
    numAssistedGov: { type: 'number', minimum: 0 },
    numAssistedRedCross: { type: 'number', minimum: 0 },
    numLocalStaff: { type: 'number', minimum: 0 },
    numVolunteers: { type: 'number', minimum: 0 },
    numExpats: { type: 'number', minimum: 0 },
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
  definitions: {
    plannedResponse: {
      properties: {
        status: { type: 'string' },
        value: { type: 'number', minimum: 0 }
      }
    },
    contact: {
      properties: {
        name: { type: 'string' },
        role: { type: 'string' },
        contact: { type: 'string' }
      }
    }
  },
  properties: {
    dref: {
      '$ref': '#/definitions/plannedResponse'
    },
    emergencyAppeal: {
      '$ref': '#/definitions/plannedResponse'
    },
    rdrtrits: {
      '$ref': '#/definitions/plannedResponse'
    },
    fact: {
      '$ref': '#/definitions/plannedResponse'
    },
    ifrcStaff: {
      '$ref': '#/definitions/plannedResponse'
    },
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

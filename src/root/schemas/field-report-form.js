import * as formData from '#utils/field-report-constants';

const getValidValues = (arr, key) => arr.map(o => o[key]).filter(o => o !== '');

export const step1 = {
  properties: {
    status: {
      type: 'string',
      enum: getValidValues(formData.statusValues, 'value')
    },
    isCovidReport: {
      type: 'boolean'
    },
    summary: {
      type: 'string'
    },
    event: {
      type: 'integer',
      minimum: 0
    },
    startDate: {
      type: 'string',
      format: 'date',
      formatMinimum: '1980-01-01',
      formatExclusiveMaximum: true
    },
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
    },
    nsAssistance: {
      type: 'boolean'
    }
  },
  required: ['country', 'summary', 'status', 'startDate', 'disasterType']
};

export const step2 = {
  definitions: {
    estimation: {
      type: 'array',
      items: {
        properties: {
          estimation: { type: 'integer', minimum: 0 },
          source: {enum: ['red-cross', 'government', 'other']}
        }
      }
    },
    estimationString: {
      type: 'array',
      items: {
        properties: {
          estimation: { type: 'string' },
          source: {enum: ['red-cross', 'government', 'other']}
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
    numPotentiallyAffected: {
      '$ref': '#/definitions/estimation'
    },
    numHighestRisk: {
      '$ref': '#/definitions/estimation'
    },
    affectedPopCentres: {
      '$ref': '#/definitions/estimationString'
    },
    epiCases: {
      type: 'integer'
    },
    epiNumDead: {
      type: 'integer'
    },
    epiSuspectedCases: {
      type: 'integer'
    },
    epiProbableCases: {
      type: 'integer'
    },
    epiConfirmedCases: {
      type: 'integer'
    },
    epiFiguresSource: {
      type: 'integer',
      enum: getValidValues(formData.epiSources, 'value')
    },
    sitFieldsDate: {
      type: 'string'
    },
    description: {
      type: 'string'
    },
    otherSources: {
      type: 'string'
    }
  },
  dependencies: {
    epiCases: ['sitFieldsDate'],
    epiNumDead: ['sitFieldsDate'],
    epiSuspectedCases: ['sitFieldsDate'],
    epiProbableCases: ['sitFieldsDate'],
    epiConfirmedCases: ['sitFieldsDate']
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
    numAssistedGov: { type: 'integer', minimum: 0 },
    numAssistedRedCross: { type: 'integer', minimum: 0 },
    numLocalStaff: { type: 'integer', minimum: 0 },
    numVolunteers: { type: 'integer', minimum: 0 },
    numExpats: { type: 'integer', minimum: 0 },
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
        value: { type: 'integer', minimum: 0 }
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
    imminentDref: {
      '$ref': '#/definitions/plannedResponse'
    },
    forecastBasedAction: {
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


'use strict';

export default {
  properties: {
    email: {
      type: 'string',
      format: 'email'
    },
    country: {
      type: 'string'
    },
    city: {
      type: 'string'
    },
    organizationType: {
      type: 'string'
    },
    organization: {
      type: 'string'
    },
    department: {
      type: 'string'
    },
    position: {
      type: 'string'
    },
    password: {
      type: 'string',
      minLength: 8
    },
    passwordConf: {
      const: { '$data': '1/password' }
    }
  },
  required: [
    'email',
    'organizationType',
    'organization',
    'department',
    'position',
    'country',
    'password',
    'passwordConf'
  ],
  if: {
    properties: {
      email: {
        not: {
          pattern: '@redcross.com'
        }
      }
    }
  },
  then: {
    properties: {
      contact: {
        type: 'array',
        items: {
          properties: {
            name: {
              type: 'string'
            },
            email: {
              type: 'string',
              format: 'email'
            }
          },
          required: ['name', 'email']
        }
      }
    }
  }
};

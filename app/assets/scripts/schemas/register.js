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
    organization: {
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
  required: ['email', 'organization', 'country', 'password', 'passwordConf'],

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

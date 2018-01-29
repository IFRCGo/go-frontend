'use strict';

export default {
  properties: {
    oldPassword: {
      type: 'string'
    },
    password: {
      type: 'string',
      minlength: 8
    },
    passwordConfirm: {
      type: 'string',
      minlength: 8
    }
  },
  required: ['password', 'passwordConfirm']
};

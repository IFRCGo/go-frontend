import React from 'react';

if (process.env.NODE_ENV === 'development' && false) {
  const whyDidYouRender = require('@welldone-software/why-did-you-render');
  whyDidYouRender(React, {
    trackAllPureComponents: true,
    logOwnerReasons: true
  });
}
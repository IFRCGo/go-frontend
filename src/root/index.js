import React from 'react';
import { Provider } from 'react-redux';
import mapboxgl from 'mapbox-gl';
import {
  init,
  ErrorBoundary,
  withProfiler,
} from '@sentry/react';

import sentryConfig from './sentry';
import store from '#utils/store';
import { detectIE } from '#utils/ie';

import { RequestContext } from '#utils/restRequest';
import {
  processGoUrls,
  processGoOptions,
  processGoError,
  processGoResponse,
} from '#utils/restRequest/go';

import LanguageContext from '#root/languageContext';
import lang from '#lang';
import FullPageErrorMessage from '#components/FullPageErrorMessage';

import { mbtoken } from './config';
import Multiplexer from './Multiplexer';

require('isomorphic-fetch');

mapboxgl.setRTLTextPlugin(
  'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js',
  null,
  true // Lazy load the plugin
);

mapboxgl.accessToken = mbtoken;

if (sentryConfig) {
  init(sentryConfig);
  console.log('SSSS', sentryConfig);
}

const requestContextValue = {
  transformUrl: processGoUrls,
  transformOptions: processGoOptions,
  transformResponse: processGoResponse,
  transformError: processGoError,
};

function Root() {
  const [strings, setStrings] = React.useState(lang);
  const langContextValue = React.useMemo(() => ({
    strings,
    setStrings,
  }), [strings, setStrings]);

  return (
    <ErrorBoundary
      showDialog
      fallback={(
        <FullPageErrorMessage
          errorTitle="Oh no!"
          errorMessage="Some error occured"
        />
      )}
    >
      <Provider store={store}>
        <LanguageContext.Provider value={langContextValue}>
          <RequestContext.Provider value={requestContextValue}>
            <Multiplexer />
          </RequestContext.Provider>
        </LanguageContext.Provider>
      </Provider>
    </ErrorBoundary>
  );
}

export default withProfiler(Root, { name: 'Root' });

// Get IE or Edge browser version
const version = detectIE();
const htmlEl = document.querySelector('html');
if (version === false) {
  htmlEl.classList.add('non-ie');
} else if (version >= 12) {
  htmlEl.classList.add('ie', 'edge');
} else {
  htmlEl.classList.add('ie');
}

// Polyfill for HTML Node remove();
// https://developer.mozilla.org/en-US/docs/Web/API/ChildNode/remove
(function (arr) {
  arr.forEach(function (item) {
    if (item.hasOwnProperty('remove')) {
      return;
    }
    Object.defineProperty(item, 'remove', {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function remove() {
        if (this.parentNode !== null) this.parentNode.removeChild(this);
      }
    });
  });
})([Element.prototype, CharacterData.prototype, DocumentType.prototype]);

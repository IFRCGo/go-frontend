import React from 'react';
import { Provider } from 'react-redux';
import { get as getFromLocalStorage } from 'local-storage';

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
import Multiplexer from './Multiplexer';

require('isomorphic-fetch');

function Root () {
  const [strings, setStrings] = React.useState(lang);
  const user = getFromLocalStorage('user');
  const contextValue = React.useMemo(() => {
    return {
      strings,
      setStrings,
    };
  }, [strings, setStrings]);

  const requestContextValue = {
    transformUrl: processGoUrls,
    transformOptions: processGoOptions(user.token),
    transformBody: processGoResponse,
    transformError: processGoError,
  };

  return (
    <Provider store={store}>
      <LanguageContext.Provider value={contextValue}>
        <RequestContext.Provider value={requestContextValue}>
          <Multiplexer />
        </RequestContext.Provider>
      </LanguageContext.Provider>
    </Provider>
  );
}

export default Root;

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
      value: function remove () {
        if (this.parentNode !== null) this.parentNode.removeChild(this);
      }
    });
  });
})([Element.prototype, CharacterData.prototype, DocumentType.prototype]);

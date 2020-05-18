### Absolute imports
#### In `.js` file
Absolute imports can be used to reduce the complexity caused by using relative paths. Following are currently supported absolute paths.
```
#actions:     /src/root/actions
#components:  /src/root/components
#config:      /src/config
#hooks:       /src/root/hooks
#lang:        /src/root/lang
#selectors:   /src/root/selectors
#utils:       /src/root/utils
#views:       /src/root/views
#root:        /src/root
```
Example usage
```js
import FormattedDate from '#components/formatted-date.js';
```

#### In `.scss` file
For stylesheets the absolute `~styles` can be used for the `/src/styles` directory
Example usage
```scss
@import '~styles/settings/variables'

.component {
  color: $primary-color;
}
```

### Strings and Translation
The GO platform supports multiple languages. It uses translation system based on React context API. So, developers should keep this in mind while introducing new strings. There are few ways to add new strings.
- Add the static string in `/src/root/lang.js` file with proper namespaced key
- Show the string
  - Using `Translate` component
  - Using the language context 

#### `lang.js` file
This file contains all the inital strings, in the English language, required for the app. This also serves as the fallback strings if there isn't any translation associated. This file basically contains strings with its associated key as follow.
```js
const lang = {
  appTitle: 'IFRC GO',
  homeMainTitle: 'IFRC Disaster Response and Preparedness',
  mainMenuHome: 'Home',
  mainMenuDisasters: 'Disasters',
  sampleDynamicString: 'Hi {name}, how are you on {today}?',
};
```
The templates can also be used with the format shown above in `sampleDynamicString`. Variables are surrounded by the curly braces `{<variable_name}`. This type of template is resolve using the `resolveToString` helper function available in `#utils/lang`.

**Note**: Proper namespacing should be maintained in the key to avoid conflicts. For example, as shown in the strings above, `homeMainTitle` has `home` to represent that this string belongs to the Home page.

#### `Translate` component
This is a helper component to simplify the use of language context.

Simple usage:
```js
<Translate stringId='homeMainTitle' />
```
Usage with template:
```js
<Translate
  stringId='sampleDynamicString'
  params={{
    name: 'John',
    today: new Date(),
  }}
/>
```
**Note**: The places where it is not possible to use the component directly (eg: tooltips, input placeholder, etc), we can use the language context to use the translated strings.

#### The language context
The language context basically contains:
- `strings` object, which contains all of the strings in currently selected language
- `setStrings`  function to set the `strings`, this shouldn't be used directly.

Using language context with React Hook:
```js
import LanguageContext from '#root/languageContext';

function MyComponent(props) {
  const { strings } = React.useContext(languageContext);

  return (
    <div>
      { strings.myComponentTitle }
    </div>
  );
}
```
Using language context with the class components
```js
import React from 'react';
import LanguageContext from '#root/languageContext';

class MyComponent extends React.PureComponent {
  render() {
    const { strings } = this.context;
    return (
      <div>
        { strings.myComponentTitle }
      </div>
    );
  }
}

MyComponent.contextType = LanguageContext;
```
Using with the string template:
```js
import LanguageContext from '#root/languageContext';
import { resolveToString } from '#utils/lang';

function MyComponent(props) {
  const { strings } = React.useContext(languageContext);
  const title = resolveToString(
    strings.myComponentTitle, // has template syntax
    {
      name: 'John',
      today: new Date(),
    },
  );

  return (
    <div>
      { title }
    </div>
}
```

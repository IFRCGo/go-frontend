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
The templates can also be used with the format shown above in `sampleDynamicString`. Variables are surrounded by the curly braces `{<variable_name>}`. This type of template is resolve using the `resolveToString` helper function available in `#utils/lang`.

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

### RTL aware styling 
RTL languages (eg: Arabic) are read and written from right-to-left, and the user interface for these languages should be mirrored to ensure the content is easy to understand.

When a UI is changed from LTR to RTL (or vice-versa), it’s often called mirroring. An RTL layout is the mirror image of an LTR layout, and it affects layout, text, and graphics.

In RTL, anything that relates to time should be depicted as moving from right to left. For example, forward points to the left, and backwards points to the right.

#### Mirroring layout
When a UI is mirrored, these changes occur:

- Text fields icons are displayed on the opposite side of a field
- Navigation buttons are displayed in reverse order
- Icons that communicate direction, like arrows, are mirrored
- Text is usually aligned to the right
- In CSS, while it's possible to apply a rule for LTR and a separate one specifically for RTL, it's usually better to use CSS Logical Properties which provide the ability to control layout through logical, rather than physical mappings.

| **Do**                                                                       | **Don't do**                                    |
|------------------------------------------------------------------------------|-------------------------------------------------|
| `margin-inline-start: 5px;`                                                  | `margin-left: 5px;`                             |
| `padding-inline-end: 5px;`                                                   | `padding-right: 5px;`                           |
| `float: inline-start;`                                                       | `float: left;`                                  |
| `inset-inline-start: 5px;`                                                   | `left: 5px;`                                    |
| `border-inline-end: 1px;`                                                    | `border-right: 1px;`                            |
| `border-{start/end}-{start/end}-radius: 2px;`                                | `border-{top/bottom}-{left/right}-radius: 2px;` |
| `padding: 1px 2px;`                                                          | `padding: 1px 2px 1px 2px;`                     |
| `margin-block: 1px 3px;` && `margin-inline: 4px 2px;`                        | `margin: 1px 2px 3px 4px;`                      |
| `text-align: start;` or `text-align: match-parent;` (depends on the context) | `text-align: left;`                             |

For more information, refer to [MDN](https://developer.mozilla.org/en-US/docs/Mozilla/Developer_guide/RTL_Guidelines).

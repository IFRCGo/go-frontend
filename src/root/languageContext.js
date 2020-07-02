import React from 'react';
import hoistNonReactStatic from 'hoist-non-react-statics';
import lang from '#lang';


const languageContext = React.createContext({
  strings: lang,
  setStrings: () => {},
});

export default languageContext;

export function withLanguage(Component) {
  class EnhancedComponent extends React.Component {
    render() {
      const { strings } = this.context;
      return (
        <Component
          strings={strings}
          { ...this.props }
        />
      );
    }
  }

  EnhancedComponent.contextType = languageContext;
  hoistNonReactStatic(EnhancedComponent, Component);

  return EnhancedComponent;
}

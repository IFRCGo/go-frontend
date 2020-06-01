import React from 'react';
import { PropTypes as T } from 'prop-types';
import c from 'classnames';

import { environment } from '#config';
import LanguageContext from '#root/languageContext';
import Translate from '#components/Translate';

export default class Alert extends React.Component {
  constructor (props) {
    super(props);
    this.timeout = null;
    this.onDismiss = this.onDismiss.bind(this);
  }

  onDismiss () {
    if (this.timeout) clearTimeout(this.timeout);
    this.props.onDismiss();
  }

  componentDidMount () {
    if (this.props.autoDismiss > 0) {
      this.timeout = setTimeout(() => this.onDismiss(), this.props.autoDismiss);
    }
  }

  componentWillUnmount () {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  render () {
    let cl = c('alert', `alert--${this.props.type}`, {
      'alert--popover': this.props.popover
    });
    const { strings } = this.context;
    return (
      <div className={cl} role='alert'>
        {this.props.dismissable ? (
          <button className='alert__button-dismiss' title={strings.alertDismissTitle} onClick={this.onDismiss}>
            <span>
              <Translate stringId='alertDismiss'/>
            </span>
          </button>
        ) : null}
        {this.props.children}
      </div>
    );
  }
}

Alert.contextType = LanguageContext;
if (environment !== 'production') {
  Alert.propTypes = {
    type: T.string,
    dismissable: T.bool,
    autoDismiss: T.number,
    popover: T.bool,
    onDismiss: T.func,
    children: T.node
  };
}

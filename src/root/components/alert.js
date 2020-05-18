import React from 'react';
import { PropTypes as T } from 'prop-types';
import c from 'classnames';

import { environment } from '#config';

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
    return (
      <div className={cl} role='alert'>
        {this.props.dismissable ? (
          <button className='alert__button-dismiss' title='Dismiss alert' onClick={this.onDismiss}><span>Dismiss</span></button>
        ) : null}
        {this.props.children}
      </div>
    );
  }
}

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

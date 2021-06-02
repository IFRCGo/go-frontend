import React from 'react';
import { PropTypes as T } from 'prop-types';
import { connect } from 'react-redux';

import { environment } from '#config';
import store from '#utils/store';

import Alert from '#components/alert';

// Once the component is mounted we store it to track initialization.
var theSysAlerts = null;

// Component
// To be mounted globally only once.
class SysAlerts extends React.Component {
  alertTimeouts = {};
  componentDidMount () {
    if (theSysAlerts !== null) {
      throw new Error('<SysAlerts /> component was already mounted. Only 1 is allowed.');
    }
    theSysAlerts = this;
  }

  componentWillUnmount () {
    theSysAlerts = null;
  }

  onDismiss = (id) => {
    this.props._hide(id);
    window.clearTimeout(this.alertTimeouts[id]);
  }

  render () {
    // Get the last elements.
    const items = this.props.items.slice(-this.props.max);

    items.forEach((a) => {
      if (a.autoDismiss) {
        if (!this.alertTimeouts[a.id]) {
          this.alertTimeouts[a.id] = window.setTimeout(() => {
            this.onDismiss(a.id);
          }, a.autoDismiss);
        }
      }
    });

    return (
      <div className='alert-container'>
        {items.map(o => (
          <Alert
            key={o.id}
            name={o.id}
            variant={o.type}
            onCloseButtonClick={this.onDismiss}
            nonDismissable={!o.dismissable}
          >
            {o.content}
          </Alert>
        ))}
      </div>
    );
  }
}

if (environment !== 'production') {
  SysAlerts.propTypes = {
    items: T.array,
    max: T.number,
    _hide: T.func
  };
}

SysAlerts.defaultProps = {
  max: 5
};

function selector (state) {
  return {
    items: state.systemAlertsReducer.items
  };
}

function dispatcher (dispatch) {
  return {
    _hide: (...args) => dispatch(hideAlertAction(...args))
  };
}

export default connect(selector, dispatcher)(SysAlerts);

//
//
//
// Actions.
export const SHOW_ALERT = 'SHOW_ALERT';
export const HIDE_ALERT = 'HIDE_ALERT';
export const HIDE_ALL_ALERT = 'HIDE_ALL_ALERT';

export function showAlertAction (alertType, content, dismissable, autoDismissTime = null) {
  return {
    type: SHOW_ALERT,
    id: (new Date()).getTime(),
    alertType,
    content,
    dismissable,
    autoDismissTime
  };
}

export function hideAlertAction (id) {
  return { type: HIDE_ALERT, id };
}

export function hideAllAlertAction () {
  return { type: HIDE_ALL_ALERT };
}

// Global action, already dispatched.
/**
 * Shows a system alert.
 * @param  {string} alertType         Type of the alert (success|info|warning|danger)
 * @param {node} content              The content to display
 * @param {bool} dismissable          Whether the popover can be dismissed
 * @param {number} autoDismissTime    Time to wait before dismissing.
 *
 * @return {function}                 Dispatch action.
 */
export const showAlert = (...args) => store.dispatch(showAlertAction(...args));

/**
 * Hide a system alert.
 * @param  {number} id      Id of the tooltip to hide
 *
 * @return {function}       Dispatch action.
 */
export const hideAlert = (...args) => store.dispatch(hideAlertAction(...args));

/**
 * Hide all system alerts.
 *
 * @return {function}       Dispatch action.
 */
export const hideAllAlert = (...args) => store.dispatch(hideAllAlertAction(...args));

//
//
//
// Reducer.
const initialState = {
  items: []
  // items: [
  //   {
  //     id: (new Date()).getTime(),
  //     type: 'success',
  //     content: 'Dismiss with X',
  //     dismissable: true,
  //     autoDismiss: null
  //   },
  //   {
  //     id: (new Date()).getTime() + 1,
  //     type: 'info',
  //     content: 'Auto dismiss in 10 seconds',
  //     dismissable: true,
  //     autoDismiss: 10000
  //   },
  //   {
  //     id: (new Date()).getTime() + 2,
  //     type: 'warning',
  //     content: 'This one is stuck forever',
  //     dismissable: false,
  //     autoDismiss: null
  //   },
  //   {
  //     id: (new Date()).getTime() + 3,
  //     type: 'danger',
  //     content: 'Auto dismiss in 30 seconds and dismissable',
  //     dismissable: true,
  //     autoDismiss: 30000
  //   }
  // ]
};

export function systemAlertsReducer (state = initialState, action) {
  switch (action.type) {
    case SHOW_ALERT:
      let newItem = {
        id: action.id,
        type: action.alertType,
        content: action.content,
        dismissable: action.dismissable,
        autoDismiss: action.autoDismissTime
      };
      return Object.assign({}, state, {items: state.items.concat([newItem])});
    case HIDE_ALERT:
      let items = state.items.filter(o => o.id !== action.id);
      return Object.assign({}, state, {items});
    case HIDE_ALL_ALERT:
      return Object.assign({}, state, {items: []});
  }
  return state;
}

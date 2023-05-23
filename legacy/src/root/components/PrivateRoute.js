import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

import { showAlert } from '#components/system-alerts';
import Translate from '#components/Translate';

// Route available only if the user is logged in.
// Redirects to login page and takes the user back afterwards.
class PrivateRoute extends React.Component {
  isAuthenticated () {
    const { user } = this.props;
    return !!user?.token;
  }

  componentDidMount () {
    if (!this.isAuthenticated()) {
      showAlert('danger', <p><Translate stringId="privateRouteNotAuthenticatedMessage" /></p>, true, 4500);
    }
  }

  render () {
    const {
      component: Component,
      render: renderComponent,
      ...otherProps
    } = this.props;

    const redirectTo = {
      pathname: '/login',
      state: { from: this.props.location },
    };

    let render;
    if (this.isAuthenticated()) {
      render = (props) => renderComponent ? renderComponent(props) : <Component {...props}/>;
    } else {
      render = () => (
        <Redirect to={redirectTo} />
      );
    }

    return <Route {...otherProps} render={render} />;
  }
}

const mapStateToProps = (state) => ({
  user: state.user.data,
});

export default connect(mapStateToProps)(PrivateRoute);

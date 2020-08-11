import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import { PropTypes as T } from 'prop-types';

import { showAlert } from '#components/system-alerts';

// Route available only if the user is logged in.
// Redirects to login page and takes the user back afterwards.
class PrivateRoute extends React.Component {
  isAuthenticated () {
    const { user } = this.props;
    return !!user?.token;
  }

  componentDidMount () {
    if (!this.isAuthenticated()) {
      showAlert('danger', <p>Please log in to view this page</p>, true, 4500);
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

if (process.env.NODE_ENV !== 'production') {
  PrivateRoute.propTypes = {
    component: T.func,
    render: T.func
  };
}

const mapStateToProps = (state) => ({
  user: state.user.data,
});

export default connect(mapStateToProps)(PrivateRoute);

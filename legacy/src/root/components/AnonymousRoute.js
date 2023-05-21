import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

// Route available only if the user is not logged in.
function AnonymousRoute({
  component: Component,
  user,
  ...otherProps
}) {
  const isAuthenticated = user.token;
  const render = props => isAuthenticated
    ? <Redirect to={props.location?.state?.from ? props.location.state.from : '/'} />
    : <Component {...props}/>;
  return <Route {...otherProps} render={render} />;
}

const mapStateToProps = (state) => ({
  user: state.user.data,
});

export default connect(mapStateToProps)(AnonymousRoute);


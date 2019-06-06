'use strict';
import React from 'react';
import { PropTypes as T } from 'prop-types';
import c from 'classnames';
import { connect } from 'react-redux';
import { getPerCountries } from '../actions';

import { environment } from '../config';

import Header from '../components/header';
import MobileHeader from '../components/mobile-header';
import Footer from '../components/footer';
import GlobalLoading from '../components/global-loading';
import SysAlerts from '../components/system-alerts';

class App extends React.Component {
  constructor (props) {
    super(props);
    this.state = { preparednessModule: false };
  }

  render () {
    return (
      <div className={c('page', this.props.className)}>
        <GlobalLoading />
        <Header preparednessModule={this.state.preparednessModule} />
        <MobileHeader />
        <main className='page__body' role='main'>
          {this.props.children}
        </main>
        <SysAlerts />
        <Footer/>
      </div>
    );
  }

  componentDidMount () {
    this.props._getPerCountries();
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.perForm.getPerCountries.fetched && nextProps.perForm.getPerCountries.data.count > 0 && !this.state.preparednessModule) {
      this.setState({preparednessModule: true});
    }
  }
}

if (environment !== 'production') {
  App.propTypes = {
    className: T.string,
    children: T.oneOfType([T.object, T.array])
  };
}

const selector = (state) => ({
  perForm: state.perForm
});

const dispatcher = (dispatch) => ({
  _getPerCountries: (...args) => dispatch(getPerCountries(...args))
});

export default connect(selector, dispatcher)(App);

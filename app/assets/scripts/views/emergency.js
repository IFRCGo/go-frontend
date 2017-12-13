'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { PropTypes as T } from 'prop-types';
import c from 'classnames';
import _toNumber from 'lodash.tonumber';
import { Sticky, StickyContainer } from 'react-sticky';

import { environment } from '../config';
import { showGlobalLoading, hideGlobalLoading } from '../components/global-loading';
import { getEventById } from '../actions';
import {
  separateUppercaseWords as separate,
  nope
} from '../utils/format';
import { get } from '../utils/utils/';

import App from './app';
import Fold from '../components/fold';

class Emergency extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      selectedAppeal: null
    };
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.location.hash !== nextProps.location.hash) {
      const top = window.pageYOffset !== undefined ? window.pageYOffset : window.scrollTop;
      window.scrollTo(0, top - 90);
    }

    if (this.props.match.params.id !== nextProps.match.params.id) {
      return this.getEvent(nextProps.match.params.id);
    }

    if (this.props.event.fetching && !nextProps.event.fetching) {
      hideGlobalLoading();
    }
  }

  componentDidMount () {
    this.getEvent(this.props.match.params.id);
  }

  getEvent (id) {
    showGlobalLoading();
    this.props._getEventById(id);
  }

  onAppealClick (id, e) {
    e.preventDefault();
    this.setState({selectedAppeal: id});
  }

  renderHeaderStats () {
    const { appeals } = this.props.event.data;
    const selected = this.state.selectedAppeal;

    let stats = {
      beneficiaries: 0,
      funded: 0,
      requested: 0
    };
    stats = appeals.filter(o => {
      return selected ? o.id === selected : true;
    }).reduce((acc, o) => {
      acc.beneficiaries += _toNumber(o.num_beneficiaries);
      acc.funded += _toNumber(o.amount_funded);
      acc.requested += _toNumber(o.amount_requested);
      return acc;
    }, stats);

    return (
      <div className="inpage__introduction">
        <ul className='introduction-nav'>
          <li className={c('introduction-nav-item', {'introduction-nav-item--active': selected === null})}>
            <a href='#' title='Show stats for all appeals' onClick={this.onAppealClick.bind(this, null)}>All Appeals</a>
          </li>
          {appeals.map(o => (
            <li key={o.id} className={c('introduction-nav-item', {'introduction-nav-item--active': o.id === selected})}>
              <a href='#' title={`Show stats for appeal ${o.name}`} onClick={this.onAppealClick.bind(this, o.id)}>{o.name}</a>
            </li>
          ))}
        </ul>
        <div className='header-stats'>
          <div className='stat-group'>
            <img src="/assets/graphics/layout/people.svg" alt="Targeted Benficiaries"/>
            <ul>
              <li>{stats.beneficiaries}<small>Targeted Benficiaries</small></li>
            </ul>
          </div>
          <div className='stat-group'>
            <img src="/assets/graphics/layout/funding.svg" alt="Funding"/>
            <ul>
              <li>{stats.requested}<small>Appeal Amount (CHF)</small></li>
              <li>{stats.funded}<small>Funding (CHF)</small></li>
            </ul>
          </div>
        </div>
        <div className='funding-chart'>
        </div>
      </div>
    );
  }

  renderContent () {
    const {
      fetched,
      error,
      data
    } = this.props.event;

    if (!fetched || error) return null;

    return (
      <section className='inpage'>
        <header className='inpage__header'>
          <div className='inner'>
            <div className='inpage__headline'>
              <div className='inpage__headline-content'>
                <div className='inpage__headline-actions'><button className='button button--primary-plain'>Edit Event</button></div>
                <h1 className='inpage__title'>{data.name}</h1>
                {this.renderHeaderStats()}
              </div>
            </div>
          </div>
        </header>

        <StickyContainer>
          <Sticky>
            {({ style, isSticky }) => (
              <div style={style} className={c('inpage__nav', {'inpage__nav--sticky': isSticky})}>
                <div className='inner'>
                  <ul>
                    <li><a href='#overview' title='Go to Overview section'>Overview</a></li>
                    <li><a href='#graphics' title='Go to Graphics section'>Graphics</a></li>
                    <li><a href='#file-reports' title='Go to Field Reports section'>Field Reports</a></li>
                    <li><a href='#situation-reports' title='Go to Situation Reports section'>Situation Reports</a></li>
                    <li><a href='#documents' title='Go to Documents section'>Documents</a></li>
                    <li><a href='#contacts' title='Go to Contacts section'>Contacts</a></li>
                  </ul>
                </div>
              </div>
            )}
          </Sticky>

          <div className='inpage__body'>
            <div className='inner'>
              <Fold
                id='overview'
                title='Situational Overview'
                wrapperClass='situational-overview' >
                {data.summary || nope}
              </Fold>

              <Fold
                id='graphics'
                title='Additional Graphics'
                wrapperClass='additional-graphics' >
              </Fold>

              <Fold
                title='Key Figures'
                wrapperClass='key-figures' >
                <ul className='key-figures-list'>
                  <li>
                    <h3>1,700,000</h3>
                    <p className='key-figure-label'>Food Insecure People</p>
                    <p className='key-figure-source'>Source: XXX</p>
                  </li>
                  <li>
                    <h3>1,700,000</h3>
                    <p className='key-figure-label'>Food Insecure People</p>
                    <p className='key-figure-source'>Source: XXX</p>
                  </li>
                  <li>
                    <h3>1,700,000</h3>
                    <p className='key-figure-label'>Food Insecure People</p>
                    <p className='key-figure-source'>Source: XXX</p>
                  </li>
                </ul>
              </Fold>

              <Fold
                id='file-reports'
                wrapperClass='situation-reports'
                header={() => (
                  <div className='fold__headline'>
                    <h2 className='fold__title'>Situation Reports</h2>
                    <div className='fold__actions'>
                      <button className='button button--primary-plain'>Add Situation Report</button>
                    </div>
                  </div>
                )} >
                <ul className='situation-reports-list'>
                  <li><a className='link--secondary' href=''>Situation Report, 6 November 2017</a></li>
                  <li><a className='link--secondary' href=''>Situation Report, 6 November 2017</a></li>
                  <li><a className='link--secondary' href=''>Situation Report, 6 November 2017</a></li>
                  <li><a className='link--secondary' href=''>Situation Report, 6 November 2017</a></li>
                  <li><a className='link--secondary' href=''>Situation Report, 6 November 2017</a></li>
                  <li><a className='link--secondary' href=''>Situation Report, 6 November 2017</a></li>
                  <li><a className='link--secondary' href=''>Situation Report, 6 November 2017</a></li>
                  <li><a className='link--secondary' href=''>Situation Report, 6 November 2017</a></li>
                  <li><a className='link--secondary' href=''>Situation Report, 6 November 2017</a></li>
                </ul>
              </Fold>

              <Fold
                id='situation-reports'
                title='Event Field Reports'
                wrapperClass='event-field-reports'
                footer={() => (
                  <a href='' className='link--primary'>View More</a>
                )} >
                {data.field_reports && data.field_reports.length ? (
                  <table className='table table--zebra'>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Name</th>
                        <th>Disaster Type</th>
                        <th>Region</th>
                        <th>Country</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.contacts.map(o => (
                        <tr key={o.id}>
                          <td>07/10/2017</td>
                          <td><a href=''className='link--primary'>Typhoon Damrery 2017</a></td>
                          <td>Topical Cyclone</td>
                          <td><a href=''className='link--primary'>Asia Pacific</a></td>
                          <td><a href=''className='link--primary'>Viet Nam</a></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>There are no field reports to show</p>
                )}

                <table className='table table--zebra'>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Name</th>
                      <th>Disaster Type</th>
                      <th>Region</th>
                      <th>Country</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>07/10/2017</td>
                      <td><a href=''className='link--primary'>Typhoon Damrery 2017</a></td>
                      <td>Topical Cyclone</td>
                      <td><a href=''className='link--primary'>Asia Pacific</a></td>
                      <td><a href=''className='link--primary'>Viet Nam</a></td>
                    </tr>
                    <tr>
                      <td>07/10/2017</td>
                      <td><a href=''className='link--primary'>Typhoon Damrery 2017</a></td>
                      <td>Topical Cyclone</td>
                      <td><a href=''className='link--primary'>Asia Pacific</a></td>
                      <td><a href=''className='link--primary'>Viet Nam</a></td>
                    </tr>
                    <tr>
                      <td>07/10/2017</td>
                      <td><a href=''className='link--primary'>Typhoon Damrery 2017</a></td>
                      <td>Topical Cyclone</td>
                      <td><a href=''className='link--primary'>Asia Pacific</a></td>
                      <td><a href=''className='link--primary'>Viet Nam</a></td>
                    </tr>
                  </tbody>
                </table>
              </Fold>

              <Fold
                id='documents'
                title='public-docs'
                wrapperClass='Public Appeals Documents'
                footer={() => (
                  <a href='' className='link--primary'>View More</a>
                )} >
                <ul className='public-docs-list'>
                  <li>09/23/17 <a className='link--secondary' href=''>Audited Financial Statement, 01.01.2016 - 31.12.2016</a></li>
                  <li>09/23/17 <a className='link--secondary' href=''>Audited Financial Statement, 01.01.2016 - 31.12.2016</a></li>
                  <li>09/23/17 <a className='link--secondary' href=''>Audited Financial Statement, 01.01.2016 - 31.12.2016</a></li>
                  <li>09/23/17 <a className='link--secondary' href=''>Audited Financial Statement, 01.01.2016 - 31.12.2016</a></li>
                  <li>09/23/17 <a className='link--secondary' href=''>Audited Financial Statement, 01.01.2016 - 31.12.2016</a></li>
                  <li>09/23/17 <a className='link--secondary' href=''>Audited Financial Statement, 01.01.2016 - 31.12.2016</a></li>
                  <li>09/23/17 <a className='link--secondary' href=''>Audited Financial Statement, 01.01.2016 - 31.12.2016</a></li>
                  <li>09/23/17 <a className='link--secondary' href=''>Audited Financial Statement, 01.01.2016 - 31.12.2016</a></li>
                  <li>09/23/17 <a className='link--secondary' href=''>Audited Financial Statement, 01.01.2016 - 31.12.2016</a></li>
                </ul>
              </Fold>

              <Fold
                id='contacts'
                title='Contacts'
                wrapperClass='contacts' >
                {data.contacts && data.contacts.length ? (
                  <table className='table'>
                    <thead className='visually-hidden'>
                      <tr>
                        <th>Name</th>
                        <th>Title</th>
                        <th>Type</th>
                        <th>Contact</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.contacts.map(o => (
                        <tr key={o.id}>
                          <td>{o.name}</td>
                          <td>{o.title}</td>
                          <td>{separate(o.ctype)}</td>
                          <td>
                            {o.email.indexOf('@') !== -1
                              ? <a className='link--primary' href={`mailto:${o.email}`} title='Contact'>{o.email}</a>
                              : <a className='link--primary' href={`tel:${o.email}`} title='Contact'>{o.email}</a>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>There are no contacts to show</p>
                )}
              </Fold>
            </div>
          </div>
        </StickyContainer>
      </section>
    );
  }

  render () {
    return (
      <App className='page--emergency'>
        {this.renderContent()}
      </App>
    );
  }
}

if (environment !== 'production') {
  Emergency.propTypes = {
    _getEventById: T.func,
    match: T.object,
    location: T.object,
    event: T.object
  };
}

// /////////////////////////////////////////////////////////////////// //
// Connect functions

const selector = (state, ownProps) => ({
  event: get(state.event, ownProps.match.params.id, {
    data: {},
    fetching: false,
    fetched: false
  })
});

const dispatcher = (dispatch) => ({
  _getEventById: (...args) => dispatch(getEventById(...args))
});

export default connect(selector, dispatcher)(Emergency);

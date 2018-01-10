'use strict';
import * as url from 'url';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { PropTypes as T } from 'prop-types';
import c from 'classnames';
import _toNumber from 'lodash.tonumber';
import { Sticky, StickyContainer } from 'react-sticky';
import { DateTime } from 'luxon';

import { api, environment } from '../config';
import { showGlobalLoading, hideGlobalLoading } from '../components/global-loading';
import { getEventById } from '../actions';
import {
  commaSeparatedNumber as n,
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
          <ul className='stats-list'>
            <li className='stats-list__item stats-emergencies'>
              {n(stats.beneficiaries)}<small>Targeted Benficiaries</small>
            </li>
            <li className='stats-list__item stats-funding stat-borderless stat-double'>
              {n(stats.requested)}<small>Requested Amount (CHF)</small>
            </li>
            <li className='stats-list__item stat-double'>
              {n(stats.funded)}<small>Funding (CHF)</small>
            </li>
          </ul>
        </div>
        <div className='funding-chart'>
        </div>
      </div>
    );
  }

  renderFieldReports () {
    const { data } = this.props.event;
    let content;

    if (!this.props.isLogged) {
      content = (
        <React.Fragment>
          <p>Login to view all the field reports</p>
          <Link key='login' to='/login' className='button button--primary-raised-dark' title='Login'><span>Login</span></Link>
        </React.Fragment>
      );
    } else {
      if (data.field_reports && data.field_reports.length) {
        content = (
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
              {data.field_reports.map(o => (
                <tr key={o.id}>
                  <td>{DateTime.fromISO(o.created_at).toISODate()}</td>
                  <td><Link to={`/reports/${o.id}`} className='link--primary' title='View Field Report'>{o.summary}</Link></td>
                  <td>--</td>
                  <td><a href=''className='link--primary'>--</a></td>
                  <td><a href=''className='link--primary'>--</a></td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      } else {
        content = (
          <p>There are no field reports to show</p>
        );
      }
    }

    return (
      <Fold
        id='field-reports'
        title='Event Field Reports'
        wrapperClass='event-field-reports' >
        {content}
      </Fold>
    );
  }

  renderAdditionalGraphics () {
    const { data } = this.props.event;
    const snippets = get(data, 'snippets');
    let content;
    if (!Array.isArray(snippets) || !snippets.length) {
      content = (
        <div className='empty-data__container'>
          <p className='empty-data__note'>There is currently no data available</p>
        </div>
      );
    } else {
      content = (
        <div className='iframe__container'>
          {snippets.map(o => <div key={o.id} dangerouslySetInnerHTML={{__html: o.snippet}} />)}
        </div>
      );
    }

    return (
      <Fold id='graphics' title='Additional Graphics' wrapperClass='additional-graphics' >
        {content}
      </Fold>
    );
  }

  renderKeyFigures () {
    const { data } = this.props.event;
    const kf = get(data, 'key_figures');
    if (!Array.isArray(kf) || !kf.length) return null;

    return (
      <Fold
        title='Key Figures'
        wrapperClass='key-figures' >
        <ul className='key-figures-list'>
          {kf.map(o => (
            <li key={o.deck}>
              <h3>{n(o.number)}</h3>
              <p className='key-figure-label'>{o.deck}</p>
              <p className='key-figure-source'>Source: {o.source}</p>
            </li>
          ))}
        </ul>
      </Fold>
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
                <div className='inpage__headline-actions'>
                  <a href={url.resolve(api, `admin/api/event/${data.id}/change/`)}
                    className='button button--primary-bounded'>Edit Event</a></div>
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
                    <li><a href='#field-reports' title='Go to Field Reports section'>Field Reports</a></li>
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

              {this.renderAdditionalGraphics()}
              {this.renderKeyFigures()}
              {this.renderFieldReports()}

              <Fold
                id='situation-reports'
                wrapperClass='situation-reports'
                header={() => (
                  <div className='fold__headline'>
                    <div className='fold__actions'>
                      <button className='button button--primary-bounded'>Add Situation Report</button>
                    </div>
                    <h2 className='fold__title'>Situation Reports</h2>
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
                id='documents'
                title='Public Appeals Documents'
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
    event: T.object,
    isLogged: T.bool
  };
}

// /////////////////////////////////////////////////////////////////// //
// Connect functions

const selector = (state, ownProps) => ({
  event: get(state.event, ownProps.match.params.id, {
    data: {},
    fetching: false,
    fetched: false
  }),
  isLogged: !!state.user.data.token
});

const dispatcher = (dispatch) => ({
  _getEventById: (...args) => dispatch(getEventById(...args))
});

export default connect(selector, dispatcher)(Emergency);

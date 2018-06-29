'use strict';
import * as url from 'url';
import React from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { PropTypes as T } from 'prop-types';
import c from 'classnames';
import _toNumber from 'lodash.tonumber';
import { Sticky, StickyContainer } from 'react-sticky';
import { Helmet } from 'react-helmet';

import { api, environment } from '../config';
import { showGlobalLoading, hideGlobalLoading } from '../components/global-loading';
import {
  getEventById,
  getSitrepsByEventId,
  getAppealDocsByAppealIds
} from '../actions';
import {
  commaSeparatedNumber as n,
  separateUppercaseWords as separate,
  nope,
  isoDate,
  timestamp,
  noSummary
} from '../utils/format';
import {
  get,
  mostRecentReport
} from '../utils/utils/';

import App from './app';
import Fold from '../components/fold';
import BlockLoading from '../components/block-loading';

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
      this.getAppealDocuments(nextProps.event);
    }
  }

  componentDidMount () {
    this.getEvent(this.props.match.params.id);
  }

  getEvent (id) {
    showGlobalLoading();
    this.props._getEventById(id);
    this.props._getSitrepsByEventId(id);
  }

  getAppealDocuments (event) {
    const appealIds = get(event, 'data.appeals', []).map(o => o.id);
    this.props._getAppealDocsByAppealIds(appealIds, event.data.id);
  }

  onAppealClick (id, e) {
    e.preventDefault();
    this.setState({selectedAppeal: id});
  }

  renderMustLogin () {
    return (
      <React.Fragment>
        <p>You must be logged in to view this. <Link key='login' to={{pathname: '/login', state: {from: this.props.location}}} className='link--primary' title='Login'>Login</Link></p>
      </React.Fragment>
    );
  }

  renderFieldReportStats () {
    const report = mostRecentReport(get(this.props, 'event.data.field_reports'));
    if (!report) return null;
    return (
      <div className='inpage__header-col'>
        <h3>Emergency Overview</h3>
        <p>Source: <Link to={`/reports/${report.id}`}>Field Report</Link> | Last Updated: {timestamp(report.updated_at)}</p>
        <div className='content-list-group'>
          <ul className='content-list'>
            <li>Affected<span className='content-highlight'>{n(get(report, 'num_affected'))}</span></li>
            <li>Injured<span className='content-highlight'>{n(get(report, 'num_injured'))}</span></li>
            <li>Dead<span className='content-highlight'>{n(get(report, 'num_dead'))}</span></li>
            <li>Missing<span className='content-highlight'>{n(get(report, 'num_missing'))}</span></li>
            <li>Displaced<span className='content-highlight'>{n(get(report, 'num_displaced'))}</span></li>
          </ul>
          <ul className='content-list'>
            <li>Assisted<span className='content-highlight'>{n(get(report, 'num_assisted'))}</span></li>
            <li>Local staff<span className='content-highlight'>{n(get(report, 'num_localstaff'))}</span></li>
            <li>Volunteers<span className='content-highlight'>{n(get(report, 'num_volunteers'))}</span></li>
            <li>Expat delegates<span className='content-highlight'>{n(get(report, 'num_expats_delegates'))}</span></li>
          </ul>
        </div>
      </div>
    );
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
        <div className='inpage__header-col'>
          <div className='inpage__headline-stats'>
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
        </div>
        {this.renderFieldReportStats()}
        <div className='funding-chart'>
        </div>
      </div>
    );
  }

  renderFieldReports () {
    const { data } = this.props.event;
    let content;

    if (!this.props.isLogged) {
      content = this.renderMustLogin();
    } else {
      if (data.field_reports && data.field_reports.length) {
        content = (
          <table className='table table--zebra'>
            <thead>
              <tr>
                <th>Date</th>
                <th>Name</th>
                <th>Countries</th>
                <th>Regions</th>
              </tr>
            </thead>
            <tbody>
              {data.field_reports.map(o => (
                <tr key={o.id}>
                  <td>{isoDate(o.created_at)}</td>
                  <td><Link to={`/reports/${o.id}`} className='link--primary' title='View Field Report'>{o.summary || noSummary}</Link></td>
                  <td>
                    {Array.isArray(o.countries) ? o.countries.map(c => (
                      <Link to={`/countries/${c.id}`} key={c.id} className='link--primary'>{c.name} </Link>
                    )) : nope}
                  </td>
                  <td>
                    {Array.isArray(o.regions) ? o.regions.map(r => (
                      <Link to={`/regions/${r.id}`} key={r.id} className='link--primary'>{r.name} </Link>
                    )) : nope}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      } else {
        content = (
          <div className='empty-data__container'>
            <p>No field reports to show</p>
          </div>
        );
      }
    }

    return (
      <Fold
        id='field-reports'
        title='Field Reports'
        wrapperClass='event-field-reports' >
        {content}
      </Fold>
    );
  }

  renderDocuments (documents, title, wrapperClass, includeAdminLink, isPublic) {
    const {
      fetched,
      fetching,
      error,
      data
    } = documents;

    let content;

    if (!isPublic && !this.props.isLogged) {
      content = this.renderMustLogin();
    } else if (fetching) {
      content = <BlockLoading/>;
    } else if (error) {
      content = <p>Documents not available.</p>;
    } else if (fetched) {
      if (!data.results.length) {
        content = (
          <div className='empty-data__container'>
            <p className='empty-data__note'>No documents available.</p>
          </div>
        );
      } else {
        content = (
          <ul className={wrapperClass}>
            {data.results.map(o => {
              let href = o['document'] || o['document_url'] || null;
              if (!href) { return null; }
              return <li key={o.id}>
                <a className='link--secondary' href={href} target='_blank'>{o.name}, {isoDate(o.created_at)}</a>
              </li>;
            })}
          </ul>
        );
      }
    }

    const { id } = this.props.match.params;
    const addReportLink = url.resolve(api, `admin/api/event/${id}/change`);

    return (
      <Fold
        id='situation-reports'
        wrapperClass='situation-reports'
        header={() => (
          <div className='fold__headline'>
            {includeAdminLink && (
              <div className='fold__actions'>
                <a className='button button--primary-bounded' href={addReportLink} target='_blank'>Add a Report</a>
              </div>
            )}
            <h2 className='fold__title'>{title}</h2>
          </div>
        )} >
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
          <p className='empty-data__note'>No additional graphics to show.</p>
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
              <h3>{isNaN(o.number) ? o.number : n(o.number)}</h3>
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
    const report = mostRecentReport(get(this.props, 'event.data.field_reports')) || {};
    const summary = data.summary || report.description || nope;
    const source = data.summary ? 'Emergency'
      : report.description ? <Link to={`/reports/${report.id}`}>Field Report</Link> : null;
    const contacts = Array.isArray(data.contacts) && data.contacts.length ? data.contacts
      : Array.isArray(report.contacts) && report.contacts.length ? report.contacts : null;
    return (
      <section className='inpage'>
        <Helmet>
          <title>IFRC Go - {get(data, 'name', 'Emergency')}</title>
        </Helmet>
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
                <p>{summary}</p>
                {source ? <p>Source: {source}</p> : null}
              </Fold>

              {this.renderAdditionalGraphics()}
              {this.renderKeyFigures()}
              {this.renderFieldReports()}
              {this.renderDocuments(this.props.situationReports, 'Situation Reports', 'situation-reports-list', true)}
              {this.renderDocuments(this.props.appealDocuments, 'Appeal Documents', 'public-docs-list', false, true)}

              <Fold
                id='contacts'
                title='Contacts'
                wrapperClass='contacts' >
                {contacts && contacts.length ? (
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
                      {contacts.map(o => (
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
                  <div className='empty-data__container'>
                    <p>No contacts to show</p>
                  </div>
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
        <Helmet>
          <title>IFRC Go - Emergency</title>
        </Helmet>
        {this.renderContent()}
      </App>
    );
  }
}

if (environment !== 'production') {
  Emergency.propTypes = {
    _getEventById: T.func,
    _getSitrepsByEventId: T.func,
    _getAppealDocsByAppealIds: T.func,
    match: T.object,
    location: T.object,
    event: T.object,
    situationReports: T.object,
    appealDocuments: T.object,
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
  situationReports: get(state.situationReports, ownProps.match.params.id, {
    data: {},
    fetching: false,
    fetched: false
  }),
  appealDocuments: get(state.appealDocuments, ownProps.match.params.id, {
    data: {},
    fetching: false,
    fetched: false
  }),
  isLogged: !!state.user.data.token
});

const dispatcher = (dispatch) => ({
  _getEventById: (...args) => dispatch(getEventById(...args)),
  _getSitrepsByEventId: (...args) => dispatch(getSitrepsByEventId(...args)),
  _getAppealDocsByAppealIds: (...args) => dispatch(getAppealDocsByAppealIds(...args))
});

export default withRouter(connect(selector, dispatcher)(Emergency));

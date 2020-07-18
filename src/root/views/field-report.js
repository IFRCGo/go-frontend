import React from 'react';
import { connect } from 'react-redux';
import { PropTypes as T } from 'prop-types';
import { Link } from 'react-router-dom';
import { DateTime } from 'luxon';
import { Helmet } from 'react-helmet';

import { environment } from '#config';
import { showGlobalLoading, hideGlobalLoading } from '#components/global-loading';
import { getFieldReportById } from '#actions';
import BreadCrumb from '#components/breadcrumb';

import {
  commaSeparatedNumber as n,
  separateUppercaseWords as separate,
  nope,
  getResponseStatus,
  intersperse,
  yesno
} from '#utils/format';
import { get } from '#utils/utils';
import { epiSources } from '#utils/field-report-constants';

import LanguageContext from '#root/languageContext';
import Translate from '#components/Translate';
import { resolveToString } from '#utils/lang';

import App from './app';

class FieldReport extends React.Component {
  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps (nextProps) {
    if (this.props.match.params.id !== nextProps.match.params.id) {
      return this.getReport(nextProps.match.params.id);
    }

    if (this.props.report.fetching && !nextProps.report.fetching) {
      hideGlobalLoading();
    }
  }

  componentDidMount () {
    this.getReport(this.props.match.params.id);
  }

  getReport (id) {
    showGlobalLoading();
    this.props._getFieldReportById(id);
  }

  renderCountries (data) {
    const els = get(data, 'countries', [])
      .map(c => <Link key={c.id} className='link--underline' to={'/countries/' + c.id}>{c.name}</Link>);
    return intersperse(els, ', ');
  }

  renderEmergencyLink (data) {
    const { event } = data;
    return event ? <Link className='link--underline' to={'/emergencies/' + event.id}>{event.name}</Link> : 'No emergency page';
  }

  renderPlannedResponse (data) {
    const response = [
      ['DREF', getResponseStatus(data, 'dref')],
      ['Emergency Appeal', getResponseStatus(data, 'appeal')],
      ['RDRT/RITS', getResponseStatus(data, 'rdrt')],
      ['Rapid Response Personnel', getResponseStatus(data, 'fact')],
      ['Emergency Response Units', getResponseStatus(data, 'ifrc_staff')],
      ['Forecast Based Response', getResponseStatus(data, 'forecast_based_response')],
      ['Forecast Based Action', getResponseStatus(data, 'forecast_based_action')]
    ].filter(d => Boolean(d[1]));

    // Every response is either 0 (not planned) or null.
    if (!response.length) {
      return null;
    }

    return (
      <DisplaySection title='Planned International Response'>
        <dl className='dl-horizontal numeric-list'>
          {response.map(d => d[1] ? [
            <dt key={`${d[0]}-dt`}>{d[0]}</dt>,
            <dl key={`${d[0]}-dl`}>{d[1]}</dl>
          ] : null)}
        </dl>
      </DisplaySection>
    );
  }

  renderActionsTaken (data, key, orgDisplayName) {
    const actions = get(data, 'actions_taken', []).find(d => d.organization === key);

    // If actions is undefined or not an array, return null
    // FIXME: Not entirely sure why this is needed
    if (!actions || !Array.isArray(actions.actions)) { return null; }

    // if there are neither actions nor a summary, return null.
    // FIXME: Ideally, this would never occur
    if (actions.actions.length === 0 && actions.summary === '') {
      return null;
    }

    // Split actions by category
    const groupedActions = actions.actions
      .reduce(
        (prev, {category}) =>
          prev.includes(category) ? prev : prev.concat(category)
        , [])
      .map(category => ({
        label: category,
        options: actions.actions.filter(filteredOption => filteredOption.category === category)
      }));

    const { strings } = this.context;
    const title = resolveToString(
      strings.fieldReportActionTakenBy,
      {
        orgDisplayName,
      }
    );

    return (
      <DisplaySection title={title}>
        {groupedActions.map(category => (
          <React.Fragment key={category.label}>
            {groupedActions.length > 1 ? <p className='form__label'>{category.label}</p> : null}
            <ul className='actions-list'>
              {category.options.map((d, i) => <li key={`action-${i}`}>{d.name}</li>)}
            </ul>
          </React.Fragment>
        ))}

        <div className='form__group'>
          <p className='form__label'>Summary</p>
          <p>{actions.summary}</p>
        </div>
      </DisplaySection>
    );
  }

  renderSources (data) {
    const sources = get(data, 'sources', []);
    if (!sources.length) {
      return null;
    }
    const { strings } = this.context;
    return (
      <DisplaySection title={strings.fieldReportSources}>
        {sources.map((d, i) => (
          <div className='form__group' key={`${d.id} + ${i}`}>
            <p className='form__label'>{d.stype}</p>
            <p>{d.spec}</p>
          </div>
        ))}
      </DisplaySection>
    );
  }

  renderContacts (data) {
    const contacts = get(data, 'contacts', []);
    if (!contacts.length) {
      return null;
    }
    const { strings } = this.context;
    return (
      <DisplaySection title={strings.fieldReportContacts}>
        {contacts.map((d, i) => (
          <div className='form__group' key={`${d.name} + ${i}`}>
            <p className='form__label'>{separate(d.ctype)}</p>
            <p><strong>{d.name}</strong>, {d.title}, <a className='link--primary' href={`mailto:${d.email}`}>{d.email}</a></p>
          </div>
        ))}
      </DisplaySection>
    );
  }

  /**
   * Gets the status of the FR - either `EVT` for Event or `EW` for Early Warning
   * Defaults to `EVT` if the status is some-how neither.
   */
  getStatus () {
    const { data } = this.props.report;
    const status = data.status;
    if (status === 8) {
      return 'EW';
    }
    if (status === 9) {
      return 'EVT';
    }
    return 'EVT';
  }

  getEpiStatus () {
    return this.props.report.data.dtype.id === 1 ? 'EPI' : '';
  }

  renderNumericDetails (data) {
    const status = this.getStatus();
    const epiStatus = this.getEpiStatus();
    const epiFiguresSource = epiSources.find(source => source.value === `${data.epi_figures_source}`);
    const { strings } = this.context;
    const evtHtml = (
      <React.Fragment>
        {epiStatus === 'EPI' ? (
          <React.Fragment>
            <dl className='dl-horizontal numeric-list'>
              <dt>
                <Translate stringId='fieldReportCases'/>
              </dt>
              <dd>{n(get(data, 'epi_cases'))}</dd>
              { !data.is_covid_report
                ? (
                  <React.Fragment>
                    <dt className='pl-small'>
                      <Translate stringId='fieldReportSuspectedCases'/>
                    </dt>
                    <dd className='pl-small'>{n(get(data, 'epi_suspected_cases'))}</dd>
                    <dt className='pl-small'>
                      <Translate stringId='fieldReportProbableCases'/>
                    </dt>
                    <dd className='pl-small'>{n(get(data, 'epi_probable_cases'))}</dd>
                    <dt className='pl-small'>
                      <Translate stringId='fieldReportConfirmedCases'/>
                    </dt>
                    <dd className='pl-small'>{n(get(data, 'epi_confirmed_cases'))}</dd>
                  </React.Fragment>
                )
                : null
              }
              <dt>
                <Translate stringId='fieldReportDeadCases'/>
              </dt>
              <dd>{n(get(data, 'epi_num_dead'))}</dd>
              { data.dtype.id === 1
                ? (
                  <p className='epi-figures-source'>
                    <span className='text-semi-bold'>
                      <Translate stringId='fieldReportSource'/>
                    </span>: { epiFiguresSource ? epiFiguresSource.label : '--' }
                  </p>
                )
                : null
              }
            </dl>
            <dl className='dl-horizontal numeric-list'>
              <dt>
                <Translate stringId='fieldReportAssistedByGovernment'/>
              </dt>
              <dd>{n(get(data, 'gov_num_assisted'))}</dd>
              <dt>
                <Translate stringId='fieldReportAssistedRCRC'/>
              </dt>
              <dd>{n(get(data, 'num_assisted'))}</dd>
              <dt>
                <Translate stringId='fieldReportLocalStaff'/>
              </dt>
              <dd>{n(get(data, 'num_localstaff'))}</dd>
              <dt>
                <Translate stringId='fieldReportVolunteers'/>
              </dt>
              <dd>{n(get(data, 'num_volunteers'))}</dd>
              { !data.is_covid_report
                ? (
                  <React.Fragment>
                    <dt>
                      <Translate stringId='fieldReportDelegates'/>
                    </dt>
                    <dd>{n(get(data, 'num_expats_delegates'))}</dd>
                  </React.Fragment>
                )
                : null
              }
            </dl>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <dl className='dl-horizontal numeric-list'>
              <dt>
                <Translate stringId='fieldReportInjured'/>
              </dt>
              <dd>{n(get(data, 'num_injured'))}</dd>
              <dt>
                <Translate stringId='fieldReportMissing'/>
              </dt>
              <dd>{n(get(data, 'num_missing'))}</dd>
              <dt>
                <Translate stringId='fieldReportDead'/>
              </dt>
              <dd>{n(get(data, 'num_dead'))}</dd>
              <dt>
                <Translate stringId='fieldReportDisplaced'/>
              </dt>
              <dd>{n(get(data, 'num_displaced'))}</dd>
              <dt>
                <Translate stringId='fieldReportAffected'/>
              </dt>
              <dd>{n(get(data, 'num_affected'))}</dd>
            </dl>
            <dl className='dl-horizontal numeric-list'>
              <dt>
                <Translate stringId='fieldReportInjuredGov'/>
              </dt>
              <dd>{n(get(data, 'gov_num_injured'))}</dd>
              <dt>
                <Translate stringId='fieldReportMissingGov'/>
              </dt>
              <dd>{n(get(data, 'gov_num_missing'))}</dd>
              <dt>
                <Translate stringId='fieldReportDeadGov'/>
              </dt>
              <dd>{n(get(data, 'gov_num_dead'))}</dd>
              <dt>
                <Translate stringId='fieldReportDisplacedGov'/>
              </dt>
              <dd>{n(get(data, 'gov_num_displaced'))}</dd>
              <dt>
                <Translate stringId='fieldReportAffectedGov'/>
              </dt>
              <dd>{n(get(data, 'gov_num_affected'))}</dd>
            </dl>
            <dl className='dl-horizontal numeric-list'>
              <dt>
                <Translate stringId='fieldReportInjuredOther'/>
              </dt>
              <dd>{n(get(data, 'other_num_injured'))}</dd>
              <dt>
                <Translate stringId='fieldReportMissingOther'/>
              </dt>
              <dd>{n(get(data, 'other_num_missing'))}</dd>
              <dt>
                <Translate stringId='fieldReportDeadOther'/>
              </dt>
              <dd>{n(get(data, 'other_num_dead'))}</dd>
              <dt>
                <Translate stringId='fieldReportDisplacedOther'/>
              </dt>
              <dd>{n(get(data, 'other_num_displaced'))}</dd>
              <dt>
                <Translate stringId='fieldReportAffectedOther'/>
              </dt>
              <dd>{n(get(data, 'other_num_affected'))}</dd>
            </dl>
            <dl className='dl-horizontal numeric-list'>
              <dt>
                <Translate stringId='fieldReportAssistedByGovernment'/>
              </dt>
              <dd>{n(get(data, 'gov_num_assisted'))}</dd>
              <dt>
                <Translate stringId='fieldReportAssistedRCRC'/>
              </dt>
              <dd>{n(get(data, 'num_assisted'))}</dd>
              <dt>
                <Translate stringId='fieldReportLocalStaff'/>
              </dt>
              <dd>{n(get(data, 'num_localstaff'))}</dd>
              <dt>
                <Translate stringId='fieldReportVolunteers'/>
              </dt>
              <dd>{n(get(data, 'num_volunteers'))}</dd>
              <dt>
                <Translate stringId='fieldReportDelegates'/>
              </dt>
              <dd>{n(get(data, 'num_expats_delegates'))}</dd>
            </dl>
          </React.Fragment>
        )}
      </React.Fragment>
    );

    const ewHtml = (
      <React.Fragment>
        <dl className='dl-horizontal numeric-list'>
          <dt>
            <Translate stringId='Potentially Affected (RC): '/>
          </dt>
          <dd>{n(get(data, 'num_potentially_affected'))}</dd>
          <dt>
            <Translate stringId='fieldReportHighestRisk'/>
          </dt>
          <dd>{n(get(data, 'num_highest_risk'))}</dd>
          <dt>
            <Translate stringId='fieldReportAffectedPop'/>
          </dt>
          <dd>{get(data, 'affected_pop_centres') || '--'}</dd>
        </dl>
        <dl className='dl-horizontal numeric-list'>
          <dt>
            <Translate stringId='fieldReportPotentiallyAffectedGov'/>
          </dt>
          <dd>{n(get(data, 'gov_num_potentially_affected'))}</dd>
          <dt>
            <Translate stringId='fieldReportHighestRiskGov'/>
          </dt>
          <dd>{n(get(data, 'gov_num_highest_risk'))}</dd>
          <dt>
            <Translate stringId='fieldReportAffectedGov'/>
          </dt>
          <dd>{get(data, 'gov_affected_pop_centres') || '--'}</dd>
        </dl>
        <dl className='dl-horizontal numeric-list'>
          <dt>
            <Translate stringId='fieldReportPotentiallyAffectedOther'/>
          </dt>
          <dd>{n(get(data, 'other_num_potentially_affected'))}</dd>
          <dt>
            <Translate stringId='fieldReportHighestRiskOther'/>
          </dt>
          <dd>{n(get(data, 'other_num_highest_risk'))}</dd>
          <dt>
            <Translate stringId='fieldReportAffectedPopOther'/>
          </dt>
          <dd>{get(data, 'other_affected_pop_centres') || '--'}</dd>
        </dl>
        <dl className='dl-horizontal numeric-list'>
          <dt>
            <Translate stringId='fieldReportAsstByGov'/>
          </dt>
          <dd>{n(get(data, 'gov_num_assisted'))}</dd>
          <dt>
            <Translate stringId='fieldReportAsstByRCRC'/>
          </dt>
          <dd>{n(get(data, 'num_assisted'))}</dd>
        </dl>
      </React.Fragment>
    );
    return (
      <React.Fragment>
        <DisplaySection title={strings.fieldReportNumericTitle}>
          <div className='row flex-xs'>        
            { status === 'EVT' ? evtHtml : ewHtml }
          </div>
        </DisplaySection>
        <DisplaySection
          title={strings.fieldReportSourcesOther}
          inner={get(data, 'other_sources', false)}
        />
      </React.Fragment>
    );
  }

  renderContent () {
    const { data } = this.props.report;
    const { strings } = this.context;
    if (!this.props.report.fetched || !data) {
      // If the error is a 404, then either the report doesn't exist
      // or the user is not authorized to see the resource
      if (this.props.report.error && this.props.report.error.detail === "Not found.") {
        return (
          <section className='inpage'>
            <header className='inpage__header'>
              <div className='inner'>
                <div className='inpage__headline-content'>
                  <h1 className='inpage__title'>
                    <Translate stringId='fieldReportResourceNotFound'/>
                  </h1>
              </div>
            </div>
            </header>
            <div className='inpage__body'>
              <div className='inner'>
                <div className='prose fold prose--responsive'>
                  <div className='inner'>
                    <p className='inpage_note'>
                      <Translate stringId='fieldReportResourceDescription'/>
                    </p>
                    {(!this.props.user) && (
                      <Link className='button button--medium button--primary-filled' to='/login' title={strings.fieldReportGoToLogin}>
                        <Translate stringId='fieldReportGoToLogin'/>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      } else {
        return null;
      }
    }
    console.log('report', this.props.location.state);
    console.log('props', this.props);
    const infoBulletinOptions = {
      '0': 'No',
      '2': 'Planned',
      '3': 'Yes'
    };
    const infoBulletin = infoBulletinOptions[data.bulletin];
    const lastTouchedAt = DateTime.fromISO(data.updated_at || data.created_at).toISODate();
    const status = this.getStatus();
    const epiStatus = this.getEpiStatus();
    const startDate = DateTime.fromISO(data.start_date).toISODate();
    const sitFieldsDate = DateTime.fromISO(data.sit_fields_date).toISODate();
    const isCOVID = data.is_covid_report;
    const title = resolveToString(
      strings.fieldReportSummaryTitle,
      {
        reportName: get(data, 'summary', strings.breadCrumbFieldReport),
      }
    );
    return (
      <section className='inpage'>
        <Helmet>
          <title>
            {title}
          </title>
        </Helmet>
        <BreadCrumb
          crumbs={[
            {link: `/reports/${data.id}`, name: get(data, 'summary', strings.breadCrumbFieldReport)},
            // {link: this.props.location.state, name: strings.breadCrumbEmergency},
            {link: '/emergencies', name: strings.breadCrumbEmergencies},
            {link: '/', name: strings.breadCrumbHome}
          ]}
        />
        <header className='inpage__header'>
          <div className='inner'>
            <div className='inpage__headline'>
              <div className='inpage__headline-content'>
                <h1 className='inpage__title'>{get(data, 'summary', nope)}</h1>
                <div className='text-center'>
                  <h2 className='font-size-lg'>{get(data, 'dtype.name', nope)} | {this.renderCountries(data)} | {this.renderEmergencyLink(data)}</h2>
                </div>
              </div>
              <div className='inpage__headline-actions text-center'>
                <Link className='link link--with-icon flex-justify-center' to={`/reports/${data.id}/edit`}>
                  <Translate stringId='fieldReportEdit'/>
                  <span className='collecticon-chevron-right link--with-icon-inner'></span>
                </Link>
              </div>
            </div>
          </div>
        </header>
        <div className='inpage__body'>
          <div className='inner container-lg'>
            <div className='prose fold prose--responsive'>
              <div className='inner'>
                <p className='inpage__note'>Last updated{data.user ? ` by ${data.user.username}` : null} on {lastTouchedAt}</p>
                {this.renderNumericDetails(data)}
                { epiStatus === 'EPI' ? <DisplaySection title={strings.fieldReportDateOfData} inner={sitFieldsDate} /> : null }
                <DisplaySection sectionClass='rich-text-section' title={ status === 'EW' ? strings.fieldReportRiskAnalyisis : strings.fieldReportDescription } inner={get(data, 'description', false)} />
                <DisplaySection title={ status === 'EW' ? strings.fieldReportForecastedDate : strings.fieldReportStartDate } inner={startDate} />
                { data.is_covid_report && (
                  <DisplaySection title={strings.fieldReportCovidReport} inner='Yes' />
                )}
                <DisplaySection title={strings.fieldReportRequest}>
                  <p>
                    <Translate stringId='fieldReportGovernmentRequest'/>
                    <span>{yesno(get(data, 'request_assistance'))}</span>
                  </p>
                  <p>
                    <Translate stringId='fieldReportInternationalRequest'/>
                    <span>{yesno(get(data, 'ns_request_assistance'))}</span>
                  </p>
                </DisplaySection>
                { !isCOVID
                  ? <DisplaySection title={strings.fieldReportInformationBulletin} inner={ infoBulletin } />
                  : null
                }
                {this.renderActionsTaken(data, 'NTLS', strings.fieldReportNationalSocietyLabel)}
                {this.renderActionsTaken(data, 'FDRN', strings.fieldReportIFRCLabel)}
                {this.renderActionsTaken(data, 'PNS', strings.fieldReportPNSLabel) /* instead of PNS Red Cross, go-frontend/issues/822 */ }
                <DisplaySection title={strings.fieldReportActionTaken} inner={get(data, 'actions_others', false)} />
                {data.is_covid_report && this.renderPlannedResponse(data)}
                {this.renderSources(data)}
                {this.renderContacts(data)}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  render () {
    const { strings } = this.context;
    return (
      <App className='page--field-report'>
        <Helmet>
          <title>{strings.fieldReportTitle}</title>
        </Helmet>
        {this.renderContent()}
      </App>
    );
  }
}

FieldReport.contextType = LanguageContext;
if (environment !== 'production') {
  FieldReport.propTypes = {
    _getFieldReportById: T.func,
    match: T.object,
    report: T.object
  };
}

class DisplaySection extends React.Component {
  render () {
    const { inner, children, title, sectionClass } = this.props;
    if (!children && !inner) { return null; }
    const content = children || <p dangerouslySetInnerHTML={{__html: inner}} />;
    return (
      <section className={`display-section${sectionClass ? ' ' + sectionClass : ''}`}>
        <h3 className='font-size-lg'>{title}</h3>
        {content}
      </section>
    );
  }
}

if (environment !== 'production') {
  DisplaySection.propTypes = {
    title: T.string,
    inner: T.string,
    children: T.node
  };
}

// /////////////////////////////////////////////////////////////////// //
// Connect functions

const selector = (state, ownProps) => ({
  report: get(state.fieldReport, ownProps.match.params.id, {
    data: {},
    fetching: false,
    fetched: false
  }),
  user: get(state.user)
});

const dispatcher = (dispatch) => ({
  _getFieldReportById: (...args) => dispatch(getFieldReportById(...args))
});

export default connect(selector, dispatcher)(FieldReport);

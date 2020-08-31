import React from 'react';
import { PropTypes as T } from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import _set from 'lodash.set';
import _cloneDeep from 'lodash.clonedeep';
import Ajv from 'ajv';
import ajvKeywords from 'ajv-keywords';
import Select from 'react-select';
import { Helmet } from 'react-helmet';

import { isValidEmail, isWhitelistedEmail, get } from '#utils/utils';
import { countries, orgTypes } from '#utils/field-report-constants';
import { registerUser, getDomainWhitelist } from '#actions';
import { environment } from '#config';

import { FormInput, FormError } from '#components/form-elements/';
import { showAlert } from '#components/system-alerts';
import { showGlobalLoading, hideGlobalLoading } from '#components/global-loading';
import BreadCrumb from '#components/breadcrumb';
import LanguageContext from '#root/languageContext';
import Translate from '#components/Translate';

import App from './app';
import registerSchemaDef from '../schemas/register';

const ajv = new Ajv({ $data: true, allErrors: true, errorDataPath: 'property' });
ajvKeywords(ajv);
let registerValidator = ajv.compile(registerSchemaDef);

const getClassIfError = (errors, prop) => {
  if (!errors) return '';
  let err = errors.find(o => o.dataPath === `.${prop}`);
  return err ? 'form__control--danger' : '';
};

class Register extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      data: {
        username: undefined,
        firstname: undefined,
        lastname: undefined,
        email: undefined,
        password: undefined,
        passwordConf: undefined,

        organization: undefined,
        organizationType: undefined,

        country: undefined,
        city: undefined,
        department: undefined,
        position: undefined,
        phoneNumber: undefined,

        contact: [0, 1].map(o => ({ name: undefined, email: undefined }))
      },
      whitelist: [],
      nationalSocieties: [],
      errors: null
    };

    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount () {
    this.props._getDomainWhitelist();
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps (nextProps) {
    if (this.props.registration.fetching && !nextProps.registration.fetching) {
      hideGlobalLoading();
      if (nextProps.registration.error) {
        const message = nextProps.registration.error.error_message || 'Could not create user';
        showAlert('danger', <p><strong>Error:</strong> {message}</p>, true, 4500);
      } else {
        showAlert('success', <p>Success! Verification email sent, redirecting...</p>, true, 2000);
        setTimeout(() => this.props.history.push('/'), 2000);
      }
    }

    if (nextProps.domainWhitelist.fetched) {
      let domList = [];
      if (nextProps.domainWhitelist.data.results) {
        domList = nextProps.domainWhitelist.data.results.map((dom) => dom.domain_name);
      }
      
      // Always include 'ifrc.org'
      if (!domList.includes('ifrc.org')) {
        domList.push('ifrc.org');
      }

      this.setState({ whitelist: domList });
      // Override the registerSchema validation
      registerSchemaDef.if.properties.email.not = { pattern: domList.map((dom) => `@${dom}`).join('|') };
      registerValidator = ajv.compile(registerSchemaDef);
    }

    if (nextProps.countries.fetched) {
      this.setState({
        nationalSocieties: nextProps.countries.data.results
          .reduce(function (results, country) {
            if (country.society_name && country.society_name !== 'ICRC') {
              results.push({
                value: country.society_name,
                label: country.society_name
              });
            }
            return results;
          }, [])
          .sort((a, b) => {
            if (a.value > b.value) return 1;
            if (a.value < b.value) return -1;
            return 0;
          })
      });
    }
  }

  prepStateForValidation (state) {
    let payload = _cloneDeep(state);
    payload.country = get(state, 'country.value') || undefined;
    payload.organizationType = get(state, 'organizationType.value') || undefined;
    return payload;
  }

  onSubmit () {
    const payload = this.prepStateForValidation(this.state.data);
    registerValidator(payload);
    this.setState({ errors: _cloneDeep(registerValidator.errors) });
    if (registerValidator.errors === null) {
      showGlobalLoading();
      this.props._registerUser(payload);
    }
  }

  onFieldChange (field, e) {
    let data = _cloneDeep(this.state.data);

    let val = e.target ? e.target.value : e;
    // If 'National Society' is selected as an Org.Type we still only want 'organization' as a string
    // but since it's a dropdown we need its 'value' only
    if (field === 'organization' && this.state.data.organizationType?.value === 'NTLS') {
      val = e.value;
    }
    // Empty out the 'organization' field as the Org.Type is changed to 'National Society'
    // in case someone doesn't select an Organization, since the Select is empty at first
    // but the previous value would be still kept in the state
    if (field === 'organizationType' && this.state.data.organizationType?.value !== 'NTLS' && e.value === 'NTLS') {
      data.organization = undefined;
    }
    _set(data, field, val === '' || val === null ? undefined : val);
    this.setState({data});
  }

  shouldRequestAccess () {
    const { email } = this.state.data;
    const whitelistedDomains = this.state.whitelist;

    return email && isValidEmail(email.toLowerCase()) && !isWhitelistedEmail(email.toLowerCase(), whitelistedDomains);
  }

  renderPasswordFields () {
    const { strings } = this.context;
    return (
      <div className='form__hascol form__hascol--2'>
        <FormInput
          label={strings.registerPassword}
          type='password'
          name='register-password'
          id='register-password'
          classInput={getClassIfError(this.state.errors, 'password')}
          value={this.state.data.password}
          onChange={this.onFieldChange.bind(this, 'password')}
        >
          <FormError
            errors={this.state.errors}
            property='password'
          />
        </FormInput>
        <FormInput
          label={strings.registerConfirmPassword}
          type='password'
          name='register-password-conf'
          id='register-password-conf'
          classInput={getClassIfError(this.state.errors, 'passwordConf')}
          value={this.state.data.passwordConf}
          onChange={this.onFieldChange.bind(this, 'passwordConf')}
        >
          <FormError
            errors={this.state.errors}
            property='passwordConf'
          />
        </FormInput>
      </div>
    );
  }

  renderAdditionalInfo () {
    const { strings } = this.context;
    const countriesList = (this.props.countries && this.props.countries.fetched)
      ? countries(this.props.countries.data.results)
      : [];
    return (
      <div className='form__hascol form__hascol--2'>
        <div className='form__group'>
          <label className='form__label'>
            <Translate stringId='registerCountry' />
          </label>
          <Select
            name='country'
            value={this.state.data.country}
            onChange={this.onFieldChange.bind(this, 'country')}
            options={countriesList} />
          <FormError
            errors={this.state.errors}
            property='country'
          />
        </div>
        <FormInput
          label={strings.registerCity}
          type='text'
          name='register-city'
          id='register-city'
          classInput={getClassIfError(this.state.errors, 'city')}
          value={this.state.data.city}
          onChange={this.onFieldChange.bind(this, 'city')} />
        <div className='form__group'>
          <label className='form__label'>
            <Translate stringId='registerOrganizationType' />
          </label>
          <Select
            name='organizationType'
            value={this.state.data.organizationType}
            onChange={this.onFieldChange.bind(this, 'organizationType')}
            options={orgTypes} />
          <FormError
            errors={this.state.errors}
            property='organizationType'
          />
        </div>
        { this.state.data.organizationType?.value === 'NTLS'
          ? (
            <div className='form__group'>
              <label className='form__label'>
                <Translate stringId='registerOrganizationName' />
              </label>
              <Select
                name='register-organization'
                value={this.state.data.organization}
                onChange={this.onFieldChange.bind(this, 'organization')}
                options={this.state.nationalSocieties} />
              <FormError
                errors={this.state.errors}
                property='organizationType'
              />
            </div>
          )
          : (
            <FormInput
              label={
                this.state.data.organizationType?.value === 'ICRC'
                  ? strings.registerOfficeName
                  : strings.registerOrganizationName
              }
              type='text'
              name='register-organization'
              id='register-organization'
              classInput={getClassIfError(this.state.errors, 'organization')}
              value={this.state.data.organization}
              onChange={this.onFieldChange.bind(this, 'organization')}
            >
              <FormError
                errors={this.state.errors}
                property='organization'
              />
            </FormInput>
          )
        }
        <FormInput
          label={strings.registerDepartment}
          type='text'
          name='register-department'
          id='register-department'
          classInput={getClassIfError(this.state.errors, 'department')}
          value={this.state.data.department}
          onChange={this.onFieldChange.bind(this, 'department')}
        >
          <FormError
            errors={this.state.errors}
            property='department'
          />
        </FormInput>
        <FormInput
          label={strings.registerPosition}
          type='text'
          name='register-position'
          id='register-position'
          classInput={getClassIfError(this.state.errors, 'position')}
          value={this.state.data.position}
          onChange={this.onFieldChange.bind(this, 'position')}
        >
          <FormError
            errors={this.state.errors}
            property='position'
          />
        </FormInput>
        <FormInput
          label={strings.registerPhoneNumber}
          type='text'
          name='register-phoneNumber'
          id='register-phoneNumber'
          classInput={getClassIfError(this.state.errors, 'phoneNumber')}
          value={this.state.data.phoneNumber}
          onChange={this.onFieldChange.bind(this, 'phoneNumber')}
        >
          <FormError
            errors={this.state.errors}
            property='phoneNumber'
          />
        </FormInput>
      </div>
    );
  }

  renderContactRequest () {
    if (!this.shouldRequestAccess()) {
      return null;
    }

    const { strings } = this.context;

    return (
      <div>
        <p className='form__note'>
          <Translate stringId='registerContactRequest'/>
        </p>
        {[0, 1].map(o => (
          <div key={o} className='form__hascol form__hascol--2'>
            <FormInput
              label={strings.registerContactName}
              type='text'
              name={`register-contact[${o}][name]`}
              id={`register-contact-name-${o}`}
              classInput={getClassIfError(this.state.errors, `contact[${o}].name`)}
              value={this.state.data.contact[o].name}
              onChange={this.onFieldChange.bind(this, `contact[${o}].name`)}
            >
              <FormError
                errors={this.state.errors}
                property={`contact[${o}].name`}
              />
            </FormInput>
            <FormInput
              label={strings.registerContactEmail}
              type='text'
              name={`register-contact[${o}][email]`}
              id={`register-contact-email-${o}`}
              classInput={getClassIfError(this.state.errors, `contact[${o}].email`)}
              value={this.state.data.contact[o].email}
              onChange={this.onFieldChange.bind(this, `contact[${o}].email`)}
            >
              <FormError
                errors={this.state.errors}
                property={`contact[${o}].email`}
              />
            </FormInput>
          </div>
        ))}
      </div>
    );
  }

  renderSubmitButton () {
    return this.shouldRequestAccess() ? (
      <button className='mfa-tick' type='button' onClick={this.onSubmit}>
        <span>
          <Translate stringId='registerRequestAccess' />
        </span>
      </button>
    ) : (
      <button className='mfa-tick' type='button' onClick={this.onSubmit}>
        <span>
          <Translate stringId='registerSubmit' />
        </span>
      </button>
    );
  }

  render () {
    const { strings } = this.context;
    return (
      <App className='page--register'>
        <Helmet>
          <title>{strings.registerTitle}</title>
        </Helmet>
        <BreadCrumb crumbs={[
          {link: '/register', name: strings.breadCrumbRegister},
          {link: '/', name: strings.breadCrumbHome}
        ]} />
        <section className='inpage container-lg'>
          <header className='inpage__header'>
            <div className='inner'>
              <div className='inpage__headline'>
                <div>
                  <h1 className='inpage__title'>
                    <Translate stringId='registerHeading' />
                  </h1>
                  <p className='inpage__introduction'>
                    <Translate stringId='registerSubHeader' />
                  </p>
                </div>
              </div>
            </div>
          </header>
          <div className='inpage__body'>
            <div className='inner'>
              <form className='form form--centered' onSubmit={this.onSubmit}>
                <div className='form__hascol form__hascol--2'>
                  <FormInput
                    label={strings.registerFirstName}
                    type='text'
                    name='register-firstname'
                    id='register-firstname'
                    classInput={getClassIfError(this.state.errors, 'firstname')}
                    value={this.state.data.firstname}
                    onChange={this.onFieldChange.bind(this, 'firstname')}
                    autoFocus
                  >
                    <FormError
                      errors={this.state.errors}
                      property='department'
                    />
                  </FormInput>
                  <FormInput
                    label={strings.registerLastName}
                    type='text'
                    name='register-lastname'
                    id='register-lastname'
                    classInput={getClassIfError(this.state.errors, 'lastname')}
                    value={this.state.data.lastname}
                    onChange={this.onFieldChange.bind(this, 'lastname')}
                  >
                    <FormError
                      errors={this.state.errors}
                      property='department'
                    />
                  </FormInput>
                </div>
                <FormInput
                  label={strings.registerEmail}
                  type='text'
                  name='register-email'
                  id='register-email'
                  classInput={getClassIfError(this.state.errors, 'email')}
                  value={this.state.data.email}
                  onChange={this.onFieldChange.bind(this, 'email')}
                >
                  <FormError
                    errors={this.state.errors}
                    property='email'
                  />
                </FormInput>

                <FormInput
                  label={strings.registerUsername}
                  type='text'
                  name='register-username'
                  id='register-username'
                  classInput={getClassIfError(this.state.errors, 'username')}
                  value={this.state.data.username}
                  onChange={this.onFieldChange.bind(this, 'username')}
                >
                  <p className='text-italic'>
                    <Translate stringId='registerUsernameInfo' />
                  </p>
                  <FormError
                    errors={this.state.errors}
                    property='username'
                  />
                </FormInput>
                {this.renderAdditionalInfo()}
                {this.renderPasswordFields()}
                {this.renderContactRequest()}
                <div className='form__footer'>
                  {this.renderSubmitButton()}
                  {this.state.errors ?
                   <p className='form__error'>
                     <Translate stringId='registerSubmitError' />
                   </p>
                   : null
                  }
                  <p>
                    <Translate stringId='registerAccountPresent' />
                    <Link to='/login' title={strings.registerGotoLogin}>
                      <span>
                        <Translate stringId='registerLogin' />
                      </span>
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </section>
      </App>
    );
  }
}

if (environment !== 'production') {
  Register.propTypes = {
    _registerUser: T.func,
    _getDomainWhitelist: T.func,
    registration: T.object,
    history: T.object
  };
}

const selector = (state) => ({
  registration: state.registration,
  domainWhitelist: state.domainWhitelist,
  countries: state.countries
});

const dispatcher = (dispatch) => ({
  _registerUser: (payload) => dispatch(registerUser(payload)),
  _getDomainWhitelist: () => dispatch(getDomainWhitelist()),
});

Register.contextType = LanguageContext;
export default connect(selector, dispatcher)(Register);

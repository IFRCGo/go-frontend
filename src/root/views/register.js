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

import {
  isValidEmail,
  isWhitelistedEmail,
  get,
  getSelectInputValue,
} from '#utils/utils';
import { countries, orgTypes } from '#utils/field-report-constants';
import { registerUser, getDomainWhitelist } from '#actions';
import { environment } from '#config';

import { FormInput, FormError } from '#components/form-elements/';
import { showAlert } from '#components/system-alerts';
import { showGlobalLoading, hideGlobalLoading } from '#components/global-loading';
import BreadCrumb from '#components/breadcrumb';
import LanguageContext from '#root/languageContext';
import Translate from '#components/Translate';

import { countriesSelector } from '#selectors';

import App from './app';
import registerSchemaDef from '../schemas/register';
import store from '#utils/store';

const currentLanguage = store.getState().lang.current;

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
        jusitification: undefined,
        contact: [0, 1].map(() => ({ name: undefined, email: undefined }))
      },
      whitelist: [],
      nationalSocieties: [],
      errors: null
    };

    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount () {
    this.props._getDomainWhitelist();
    if (this.props.countries) {
      this.setNSState(this.props);
    }
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps (nextProps) {
    const { strings } = this.context;

    if (this.props.registration.fetching && !nextProps.registration.fetching) {
      hideGlobalLoading();
      if (nextProps.registration.error) {
        const message = nextProps.registration.error.error_message || strings.registerCreateUserDefaultErrorMessage;
        showAlert('danger', <p><Translate stringId="registerErrorMessage" params={{ message }} /></p>, true, 4500);
      } else {
        showAlert('success', <p><Translate stringId="registerSuccessMessage" /></p>, true, 2000);
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
    
    if (nextProps.countries) {
      this.setNSState(nextProps);
    }
  }

  setNSState (props) {
    this.setState({
      nationalSocieties: props.countries
        .reduce(function (results, country) {
          if (country.society_name && country.society_name !== 'ICRC' && country.independent) {
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


  renderAdditionalInfo () {
    const { strings } = this.context;
    const countriesList = countries(this.props.countries, true);
    return (
      <div className='form__hascol form__hascol--2'>
        <div className='form__group'>
          <label className='form__label'>
            <Translate stringId='registerCountry' />
          </label>
          <Select
            name='country'
            value={this.state.data.country}
            onChange={(value) => this.onFieldChange('country', value)}
            options={countriesList}
          />
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
                value={getSelectInputValue(this.state.data.organization, this.state.nationalSocieties)}
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
            property='phoneNumber'
            errors={this.state.errors}
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
          <Translate stringId='registerJustify'/>
        </p>
        <FormInput
          label={strings.registerJustificationLabel}
          placeholder={strings.registerJustification}
          type='textarea'
          name='register-justification'
          id='register-justification'
          
          classInput={getClassIfError(this.state.errors, 'justification')}
          //className={c('form__control form__control--medium', classInput)}
          value={this.state.data.justification}
          onChange={this.onFieldChange.bind(this, 'justification')}
         
        >
          <FormError
            property='justification'
            errors={this.state.errors}
          />
        </FormInput>
        
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
        <div className='container-lg'>
          <div className='row flex-sm'>
            <div className='col col-6-sm col-7-mid'>
            <BreadCrumb crumbs={[
              {link: '/register', name: strings.breadCrumbRegister},
              {link: '/', name: strings.breadCrumbHome}
              ]} compact />
            </div>
            {
            strings.wikiJsLinkRegister !== undefined && strings.wikiJsLinkRegister.length>0 ?
            <>
            <div className='col col-6-sm col-5-mid spacing-half-t'>
              <div className='row-sm flex flex-justify-flex-end'>
                <div className='col-sm spacing-half-v'>
                <a href={strings.wikiJsLinkGOWiki+'/'+currentLanguage +'/'+ strings.wikiJsLinkRegister} title='GO Wiki' target='_blank' ><img className='' src='/assets/graphics/content/wiki-help-section.svg' alt='IFRC GO logo'/></a>
                </div>
              </div>
            </div>
            </>:null
            }
          </div>
        </div>

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
                      property='firstname'
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
                      property='lastname'
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
                <hr />
                {this.renderAdditionalInfo()}
                {this.renderContactRequest()}
                <hr />
                <div className='form__footer text-center'>
                  {this.renderSubmitButton()}
                  {this.state.errors ?
                   <p className='form__error'>
                     <Translate stringId='registerSubmitError' />
                   </p>
                   : null
                  }
                  <p>
                    <Translate stringId='registerAccountPresent' />
                    <Link className='login-link' to='/login' title={strings.registerGotoLogin}>
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
  countries: countriesSelector(state),
});

const dispatcher = (dispatch) => ({
  _registerUser: (payload) => dispatch(registerUser(payload)),
  _getDomainWhitelist: () => dispatch(getDomainWhitelist()),
});

Register.contextType = LanguageContext;
export default connect(selector, dispatcher)(Register);

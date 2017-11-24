'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { PropTypes as T } from 'prop-types';
import _set from 'lodash.set';
import _cloneDeep from 'lodash.clonedeep';
import c from 'classnames';

import { environment } from '../config';

import App from './app';
import Fold from '../components/fold';
import {
  FormInput,
  FormTextarea,
  FormRadioGroup,
  FormCheckbox,
  FormSelect
} from '../components/form-elements/';
import { FormDescription } from '../components/form-elements/misc';

// Form data for group fields like radio buttons, and selects.
const formData = {
  status: [
    {
      label: 'Early Warning',
      value: 'early-warning',
      description: 'Early warning message for an upcoming disaster.'
    },
    {
      label: 'Event',
      value: 'event',
      description: 'First report for this disaster.'
    }
  ],

  disasterType: [
    {
      value: '',
      label: '-- Select one --'
    },
    {
      value: 'hurricane',
      label: 'Hurricane'
    },
    {
      value: 'typhoon',
      label: 'Typhoon'
    }
  ],

  event: [
    {
      value: '',
      label: '-- Select one --'
    },
    {
      value: 'event1',
      label: 'Event One'
    },
    {
      value: 'event2',
      label: 'Event Two'
    }
  ],

  sources: [
    {
      label: 'National Society',
      name: 'national-society'
    },
    {
      label: 'Government',
      name: 'government'
    },
    {
      label: 'Delegation/Secretariat',
      name: 'delegation-secretariat'
    },
    {
      label: 'UN agency',
      name: 'un-agency'
    },
    {
      label: 'Academia/Research',
      name: 'academia-research'
    },
    {
      label: 'Press',
      name: 'press'
    },
    {
      label: 'NGOs',
      name: 'ngo'
    },
    {
      label: 'Other',
      name: 'other'
    }
  ],

  // Step 3
  actions: [
    {
      label: 'Damage/Needs Assessment',
      name: 'damage-needs'
    },
    {
      label: 'Health',
      name: 'health'
    },
    {
      label: 'Camp Mangement',
      name: 'camp-management'
    },
    {
      label: 'Search and Rescue',
      name: 'search-rescue'
    },
    {
      label: 'Tracing/RFP',
      name: 'tracing'
    },
    {
      label: 'Psychosocial support services',
      name: 'psychosocial'
    },
    {
      label: 'Water and Sanitation',
      name: 'water-sanitation'
    },
    {
      label: 'Shelter',
      name: 'shelter'
    },
    {
      label: 'Evacuation',
      name: 'evacuation'
    },
    {
      label: 'First Aid',
      name: 'first-aid'
    },
    {
      label: 'Relief/Supply Distribution',
      name: 'relief'
    },
    {
      label: 'Human remains management and identification',
      name: 'human remains'
    }
  ]
};

class FieldReportForm extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      step: 1,
      data: {
        // Step 1
        summary: undefined,
        status: undefined,
        disasterType: undefined,
        event: undefined,
        sources: formData.sources.map(o => ({
          name: o.name,
          checked: false,
          specification: undefined
        })),
        description: undefined,
        assistance: undefined,

        // Step 2
        numInjured: { redCross: undefined, government: undefined },
        numDead: { redCross: undefined, government: undefined },
        numMissing: { redCross: undefined, government: undefined },
        numAffected: { redCross: undefined, government: undefined },
        numDisplaced: { redCross: undefined, government: undefined },
        numAssistedGov: undefined,
        numAssistedRedCross: undefined,
        numLocalStaff: undefined,
        numVolunteers: undefined,
        numExpats: undefined,

        // Step 3
        bulletin: undefined,
        actionsOthers: undefined,
        actionsNatSoc: {
          options: formData.actions.map(o => ({
            name: o.name,
            checked: false
          })),
          description: undefined
        },
        actionsPns: {
          options: formData.actions.map(o => ({
            name: o.name,
            checked: false
          })),
          description: undefined
        },
        actionsFederation: {
          options: formData.actions.map(o => ({
            name: o.name,
            checked: false
          })),
          description: undefined
        },

        // Step 4
        drefRequested: undefined,
        amountChf: undefined,
        drefApproved: undefined,
        drefBulletin: undefined,
        emergencyAppeal: undefined,
        rdrtrits: undefined,
        fact: undefined,
        eru: undefined,
        rfl: undefined,

        // Step 5
        contactOriginator: { name: undefined, func: undefined, email: undefined },
        contactPrimary: { name: undefined, func: undefined, email: undefined },
        contactNatSoc: { name: undefined, func: undefined, email: undefined },
        contactFederation: { name: undefined, func: undefined, email: undefined },
        contactMediaNatSoc: { name: undefined, func: undefined, email: undefined },
        contactMedia: { name: undefined, func: undefined, email: undefined }
      },
      errors: []
    };

    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit () {
  }

  onFieldChange (field, e) {
    let data = _cloneDeep(this.state.data);
    let val = e.target ? e.target.value : e;
    _set(data, field, val === '' ? undefined : val);
    this.setState({data});
  }

  onStepperClick (step, e) {
    e.preventDefault();
    // Can't move forward. Only backwards.
    // if (step > this.state.step) {
    //   return;
    // }
    this.setState({ step });
  }

  renderStepper () {
    const step = this.state.step;
    const items = [
      'Basic Information',
      'Numeric Details',
      'Actions Taken',
      'Planned Response',
      'Contacts'
    ];
    return (
      <ol className='stepper'>
        {items.map((o, idx) => {
          idx += 1;
          const classes = c('stepper__item', {
            'stepper__item--complete': step > idx,
            'stepper__item--current': step === idx
          });
          return <li key={o} className={classes}><a href='#' onClick={this.onStepperClick.bind(this, idx)}><span>{o}</span></a></li>;
        })}
      </ol>
    );
  }

  renderStep1 () {
    return (
      <Fold title='Basic Information'>
        <form className='form' onSubmit={this.onSubmit}>
          <FormInput
            label='Summary'
            type='text'
            name='summary'
            id='summary'
            description={<div className='form__description'><p>Write a short summary of the report's topic. It will be used as the subject of the e-mail notification,
            later as the tittle of the RSS feed and possibly as the text message on mobile phones.</p><em>Example: 250 dead after an earthquake in Indonesia</em></div>}
            value={this.state.data.summary}
            onChange={this.onFieldChange.bind(this, 'summary')}
            autoFocus
          />

          <FormRadioGroup
            label='Status'
            name='status'
            options={formData.status}
            selectedOption={this.state.data.status}
            onChange={this.onFieldChange.bind(this, 'status')} />

          <div className='form__hascol form__hascol--2'>
            <FormSelect
              label='Disaster Type'
              name='disaster-type'
              id='disaster-type'
              options={formData.disasterType}
              value={this.state.data.disasterType}
              onChange={this.onFieldChange.bind(this, 'disasterType')} />

            <FormSelect
              label='Event'
              name='event'
              id='event'
              options={formData.event}
              value={this.state.data.event}
              onChange={this.onFieldChange.bind(this, 'event')} />
          </div>

          <div className='form__group'>
            <label className='form__label'>Sources</label>
            <div className='form__description'>
              <p>Check the box next to the source of information and specify:</p>
              <ul>
                <li>UN agency - OCHA</li>
                <li>Academia/Research - Tropical Storm Risk</li>
              </ul>
            </div>
            <div className='sources-list'>
              {formData.sources.map((source, idx) => (
                <ReportSource
                  key={source.name}
                  idx={idx}
                  label={source.label}
                  sourceName={source.name}
                  specificationValue={this.state.data.sources[idx].specification}
                  checked={this.state.data.sources[idx].checked}
                  onChange={this.onFieldChange.bind(this, `sources[${idx}]`)} />
              ))}
            </div>
          </div>

          <FormTextarea
            label='Brief Description of the Situation'
            name='description'
            id='description'
            description={'Briefly describe the situation.'}
            value={this.state.data.description}
            onChange={this.onFieldChange.bind(this, 'description')} />

          <FormRadioGroup
            label='Government requests international assistance?'
            description={'Indicate if the government requested international assistance.'}
            name='assistance'
            options={[
              {
                label: 'Yes',
                value: 'true'
              },
              {
                label: 'No',
                value: 'false'
              }
            ]}
            selectedOption={this.state.data.assistance}
            onChange={this.onFieldChange.bind(this, 'assistance')} />
        </form>
      </Fold>
    );
  }

  renderStep2 () {
    return (
      <Fold title='Numeric Details (People)'>
        <form className='form' onSubmit={this.onSubmit}>

          <SourceEstimation
            label='Injured'
            description='Number of people suffering from physical injuries, trauma or an illness requiring immediate medical treatment as a direct result of a disaster.'
            name='num-injured'
            values={this.state.data.numInjured}
            onChange={this.onFieldChange.bind(this, 'numInjured')} />
          <SourceEstimation
            label='Dead'
            description='Number of people confirmed dead and number missing and presumed dead.'
            name='num-dead'
            values={this.state.data.numDead}
            onChange={this.onFieldChange.bind(this, 'numDead')} />
          <SourceEstimation
            label='Missing'
            description='Number of people missing and presumed dead.'
            name='num-missing'
            values={this.state.data.numMissing}
            onChange={this.onFieldChange.bind(this, 'numMissing')} />
          <SourceEstimation
            label='Affected'
            description='Number of people requiring immediate assistance during a period of emergency; this may include displaced or evacuated people.'
            name='num-affected'
            values={this.state.data.numAffected}
            onChange={this.onFieldChange.bind(this, 'numAffected')} />
          <SourceEstimation
            label='Displaced'
            description='Number of people temporary displaced.'
            name='num-displaced'
            values={this.state.data.numDisplaced}
            onChange={this.onFieldChange.bind(this, 'numDisplaced')} />

          <FormInput
            label='Assisted by Government'
            type='text'
            name='num-assisted-gov'
            id='num-assisted-gov'
            classWrapper='form__group--kv'
            value={this.state.data.numAssistedGov}
            onChange={this.onFieldChange.bind(this, 'numAssistedGov')} />
          <FormInput
            label='Assisted By Red Cross'
            type='text'
            name='num-assisted-red-cross'
            id='num-assisted-red-cross'
            classWrapper='form__group--kv'
            value={this.state.data.numAssistedRedCross}
            onChange={this.onFieldChange.bind(this, 'numAssistedRedCross')} />
          <FormInput
            label='Number of local staff involved'
            type='text'
            name='num-local-staff'
            id='num-local-staff'
            classWrapper='form__group--kv'
            value={this.state.data.numLocalStaff}
            onChange={this.onFieldChange.bind(this, 'numLocalStaff')} />
          <FormInput
            label='Number of volunteers involved'
            type='text'
            name='num-volunteers'
            id='num-volunteers'
            classWrapper='form__group--kv'
            value={this.state.data.numVolunteers}
            onChange={this.onFieldChange.bind(this, 'numVolunteers')} />
          <FormInput
            label='Number of expats/delegates'
            type='text'
            name='num-expats'
            id='num-expats'
            classWrapper='form__group--kv'
            value={this.state.data.numExpats}
            onChange={this.onFieldChange.bind(this, 'numExpats')} />
        </form>
      </Fold>
    );
  }

  renderStep3 () {
    return (
      <Fold title='Actions taken'>
        <form className='form' onSubmit={this.onSubmit}>
          <ActionsCheckboxes
            label='Actions Taken by National Society Red Cross (if any)'
            description={'Select the activities taken by the National Society and briefly describe'}
            name='actions-nat-soc'
            options={formData.actions}
            values={this.state.data.actionsNatSoc}
            onChange={this.onFieldChange.bind(this, 'actionsNatSoc')} />

          <ActionsCheckboxes
            label='Actions Taken by PNS Red Cross (if any)'
            description={'Select the activities taken by the foreign National Society and briefly describe'}
            name='actions-pns'
            options={formData.actions}
            values={this.state.data.actionsPns}
            onChange={this.onFieldChange.bind(this, 'actionsPns')} />

          <ActionsCheckboxes
            label='Actions Taken by Federation Red Cross (if any)'
            description={'Select the activities taken by the Federation (could be the Zone office, DMUS, ...) and briefly describe'}
            name='actions-federation'
            options={formData.actions}
            values={this.state.data.actionsFederation}
            onChange={this.onFieldChange.bind(this, 'actionsFederation')} />

          <FormRadioGroup
            label='Information Bulletin'
            description={'About information management, indicate if an Information Bulletin was published, is planned or if no Information Bulletin will be issued for this operation/disaster.'}
            name='bulletin'
            options={[
              {
                label: 'No',
                value: 'no'
              },
              {
                label: 'Planned',
                value: 'planned'
              },
              {
                label: 'Yes/Published',
                value: 'published'
              }
            ]}
            selectedOption={this.state.data.bulletin}
            onChange={this.onFieldChange.bind(this, 'bulletin')} />

          <FormTextarea
            label='Actions Taken by Others (Governemnts, UN)'
            name='actions-others'
            id='actions-others'
            description={'Who else was involved? UN agencies? NGOs? Government? Describe what other actors did.'}
            value={this.state.data.actionsOthers}
            onChange={this.onFieldChange.bind(this, 'actionsOthers')} />
        </form>
      </Fold>
    );
  }

  renderStep4 () {
    const optsNoPlannedPub = [
      {
        label: 'No',
        value: 'no'
      },
      {
        label: 'Planned/Requested',
        value: 'planned'
      },
      {
        label: 'Published',
        value: 'published'
      }
    ];

    return (
      <Fold title='Planned Response'>
        <form className='form' onSubmit={this.onSubmit}>
          <div className='form__group'>
            <label className='form__label'>Planned International Response</label>
            <div className='form__description'>
              <p>Indicate the status of the differents international tools: Was DREF requested? How much ? Has it been approved ? How many beneficiaries ? Has the DREF operation been issued?</p>
              <p>Same for the emergency appeal</p>
              <p>For RDRT/FACT/ERU, only indicate if used, planned/requested or not used.</p>
            </div>

            <FormRadioGroup
              label='DREF Requested'
              name='dref-requested'
              options={[
                {
                  label: 'No',
                  value: 'no'
                },
                {
                  label: 'Planned',
                  value: 'planned'
                },
                {
                  label: 'Yes',
                  value: 'yes'
                }
              ]}
              selectedOption={this.state.data.drefRequested}
              onChange={this.onFieldChange.bind(this, 'drefRequested')} />

            <FormInput
              label='Amount CHF'
              type='text'
              name='amount-chf'
              id='amount-chf'
              value={this.state.data.amountChf}
              onChange={this.onFieldChange.bind(this, 'amountChf')} />

            <FormRadioGroup
              label='DREF Approved'
              name='dref-approved'
              options={[
                {
                  label: 'No',
                  value: 'no'
                },
                {
                  label: 'No reply now',
                  value: 'no-reply'
                },
                {
                  label: 'Yes',
                  value: 'yes'
                }
              ]}
              selectedOption={this.state.data.drefApproved}
              onChange={this.onFieldChange.bind(this, 'drefApproved')} />

            <FormRadioGroup
              label='DREF Bulletin'
              name='dref-bulletin'
              options={optsNoPlannedPub}
              selectedOption={this.state.data.drefBulletin}
              onChange={this.onFieldChange.bind(this, 'drefBulletin')} />

            <FormRadioGroup
              label='Emergency Appeal'
              name='emergency-appeal'
              options={[
                {
                  label: 'No',
                  value: 'no'
                },
                {
                  label: 'Planned',
                  value: 'planned'
                },
                {
                  label: 'Yes',
                  value: 'yes'
                }
              ]}
              selectedOption={this.state.data.emergencyAppeal}
              onChange={this.onFieldChange.bind(this, 'emergencyAppeal')} />

            <FormRadioGroup
              label='RDRT/RITS'
              name='rdrt-rits'
              options={optsNoPlannedPub}
              selectedOption={this.state.data.rdrtrits}
              onChange={this.onFieldChange.bind(this, 'rdrtrits')} />

            <FormRadioGroup
              label='FACT'
              name='fact'
              options={optsNoPlannedPub}
              selectedOption={this.state.data.fact}
              onChange={this.onFieldChange.bind(this, 'fact')} />

            <FormRadioGroup
              label='ERU'
              name='eru'
              options={optsNoPlannedPub}
              selectedOption={this.state.data.eru}
              onChange={this.onFieldChange.bind(this, 'eru')} />

            <FormRadioGroup
              label='RFL'
              name='rfl'
              options={optsNoPlannedPub}
              selectedOption={this.state.data.rfl}
              onChange={this.onFieldChange.bind(this, 'rfl')} />

          </div>
        </form>
      </Fold>
    );
  }

  renderStep5 () {
    return (
      <Fold title='Contacts'>
        <form className='form' onSubmit={this.onSubmit}>
          <ContactRow
            label='Originator'
            description='Your name, function and e-mail.'
            name='contact-originator'
            values={this.state.data.contactOriginator}
            onChange={this.onFieldChange.bind(this, 'contactOriginator')} />
          <ContactRow
            label='Primary Contact'
            description='The person to contact for more information'
            name='contact-primary'
            values={this.state.data.contactPrimary}
            onChange={this.onFieldChange.bind(this, 'contactPrimary')} />
          <ContactRow
            label='National Society Contact'
            description='A contact in the National Society for more information. Select someone who will be available for interview.'
            name='contact-nat-soc'
            values={this.state.data.contactNatSoc}
            onChange={this.onFieldChange.bind(this, 'contactNatSoc')} />
          <ContactRow
            label='Federation Contact'
            description='A contact of the Federation (Secretariat/Zone/DMUs) for more information. Select someone who will be available for interview.'
            name='contact-federation'
            values={this.state.data.contactFederation}
            onChange={this.onFieldChange.bind(this, 'contactFederation')} />
          <ContactRow
            label='Media Contact in the National Society'
            description='A media contact in the National Society. This person could be contacted by journalists.'
            name='contact-media-nat-soc'
            values={this.state.data.contactMediaNatSoc}
            onChange={this.onFieldChange.bind(this, 'contactMediaNatSoc')} />
          <ContactRow
            label='Media Contact'
            description='A media contact in the Secretariat/Zone/DMU. This person could be contacted by journalists.'
            name='contact-media'
            values={this.state.data.contactMedia}
            onChange={this.onFieldChange.bind(this, 'contactMedia')} />
        </form>
      </Fold>
    );
  }

  render () {
    return (
      <App className='page--frep-form'>
        <section className='inpage'>
          <header className='inpage__header'>
            <div className='inner'>
              <div className='inpage__headline'>
                <h1 className='inpage__title'>Create Field Report</h1>
              </div>
            </div>
          </header>
          <div className='inpage__body'>
            <div className='inner'>
              {this.renderStepper()}
              {this[`renderStep${this.state.step}`]()}
            </div>
          </div>
        </section>
      </App>
    );
  }
}

if (environment !== 'production') {
  FieldReportForm.propTypes = {
  };
}

// /////////////////////////////////////////////////////////////////// //
// Connect functions

const selector = (state) => ({
});

const dispatcher = (dispatch) => ({
});

export default connect(selector, dispatcher)(FieldReportForm);

//
//
// React elements specific for this form
//
//

class ReportSource extends React.Component {
  constructor (props) {
    super(props);
    this.onCheckChange = this.onCheckChange.bind(this);
    this.onSpecificationChange = this.onSpecificationChange.bind(this);
  }

  onCheckChange (e) {
    const { sourceName, checked, onChange, specificationValue } = this.props;

    onChange({
      name: sourceName,
      checked: !checked,
      specification: specificationValue
    });
  }

  onSpecificationChange (e) {
    const { sourceName, checked, onChange } = this.props;

    onChange({
      name: sourceName,
      checked: checked,
      specification: e.target.value
    });
  }

  render () {
    const {
      idx,
      label,
      sourceName,
      specificationValue,
      checked
    } = this.props;

    return (
      <div className='sources-list__item'>
        <FormCheckbox
          label={label}
          name={`source[${idx || 0}][name]`}
          id={`source-name-${sourceName}`}
          value={sourceName}
          checked={checked}
          onChange={this.onCheckChange} />

        <FormInput
          label='Specification'
          type='text'
          name={`source[${idx || 0}][spec]`}
          id='source-spec'
          classLabel='form__label--nested'
          value={specificationValue}
          disabled={!checked}
          onChange={this.onSpecificationChange} />
      </div>
    );
  }
}

if (environment !== 'production') {
  ReportSource.propTypes = {
    idx: T.number,
    label: T.string,
    sourceName: T.string,
    specificationValue: T.string,
    value: T.string,
    checked: T.bool,
    onChange: T.func
  };
}

class SourceEstimation extends React.Component {
  onFieldChange (field, e) {
    const { values, onChange } = this.props;
    const newVals = Object.assign({}, values, {[field]: e.target.value});
    onChange(newVals);
  }

  render () {
    const {
      label,
      name,
      description,
      values
    } = this.props;

    return (
      <div className='form__group estimation-row'>
        <div className='form__inner-header'>
          <div className='form__inner-headline'>
            <label className='form__label'>{label}</label>
            <p className='form__description'>{description}</p>
          </div>
        </div>
        <div className='form__inner-body'>
          <FormInput
            label='Estimation Red Cross'
            type='text'
            name={`${name}[red-cross]`}
            id={`${name}-red-cross`}
            classLabel='form__label--nested'
            value={values.redCross}
            onChange={this.onFieldChange.bind(this, 'redCross')} />
          <FormInput
            label='Estimation Government'
            type='text'
            name={`${name}[government]`}
            id={`${name}-government`}
            classLabel='form__label--nested'
            value={values.government}
            onChange={this.onFieldChange.bind(this, 'government')} />
        </div>
      </div>
    );
  }
}

if (environment !== 'production') {
  SourceEstimation.propTypes = {
    label: T.string,
    name: T.string,
    description: T.string,
    values: T.shape({
      redCross: T.string,
      government: T.string
    }),
    onChange: T.func
  };
}

class ActionsCheckboxes extends React.Component {
  constructor (props) {
    super(props);
    this.onDescriptionChange = this.onDescriptionChange.bind(this);
  }

  onCheckChange (idx) {
    const { values, onChange } = this.props;
    const prevState = values.options[idx].checked;
    let newVals = _cloneDeep(values);
    _set(newVals, `options[${idx}].checked`, !prevState);

    onChange(newVals);
  }

  onDescriptionChange (e) {
    const { values, onChange } = this.props;
    const newVals = Object.assign({}, values, {description: e.target.value});
    onChange(newVals);
  }

  render () {
    const {
      label,
      name,
      description,
      options,
      values
    } = this.props;

    return (
      <div className='form__group'>
        <label className='form__label'>{label}</label>
        <FormDescription value={description} />
        {options.map((o, idx) => (
          <FormCheckbox
            key={o.name}
            label={o.label}
            name={`${name}[options][]`}
            id={`${name}-${o.name}`}
            value={o.name}
            checked={values.options[idx].checked}
            onChange={this.onCheckChange.bind(this, idx)} />
        ))}

        <FormTextarea
          label='Description'
          name={`${name}[description]`}
          id={`${name}-description`}
          classLabel='form__label--nested'
          value={values.description}
          onChange={this.onDescriptionChange} />
      </div>
    );
  }
}

if (environment !== 'production') {
  ActionsCheckboxes.propTypes = {
    label: T.string,
    name: T.string,
    description: T.string,
    options: T.array,
    values: T.shape({
      options: T.array,
      description: T.string
    }),
    onChange: T.func
  };
}

class ContactRow extends React.Component {
  onFieldChange (field, e) {
    const { values, onChange } = this.props;
    const newVals = Object.assign({}, values, {[field]: e.target.value});
    onChange(newVals);
  }

  render () {
    const {
      label,
      name,
      description,
      values
    } = this.props;

    return (
      <div className='form__group contact-row'>
        <div className='form__inner-header'>
          <div className='form__inner-headline'>
            <label className='form__label'>{label}</label>
            <p className='form__description'>{description}</p>
          </div>
        </div>
        <div className='form__inner-body'>
          <FormInput
            label='Name'
            type='text'
            name={`${name}[name]`}
            id={`${name}-name`}
            classLabel='form__label--nested'
            value={values.name}
            onChange={this.onFieldChange.bind(this, 'name')} />
          <FormInput
            label='Function'
            type='text'
            name={`${name}[func]`}
            id={`${name}-func`}
            classLabel='form__label--nested'
            value={values.func}
            onChange={this.onFieldChange.bind(this, 'func')} />
          <FormInput
            label='Email'
            type='text'
            name={`${name}[email]`}
            id={`${name}-email`}
            classLabel='form__label--nested'
            value={values.email}
            onChange={this.onFieldChange.bind(this, 'email')} />
        </div>
      </div>
    );
  }
}

if (environment !== 'production') {
  ContactRow.propTypes = {
    label: T.string,
    name: T.string,
    description: T.string,
    values: T.shape({
      name: T.string,
      func: T.string,
      email: T.string
    }),
    onChange: T.func
  };
}

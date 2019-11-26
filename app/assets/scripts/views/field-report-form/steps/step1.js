import React from 'react';
import Select from 'react-select';
import Fold from '../../../components/fold';
import {
  FormInput,
  FormInputSelect,
  FormRadioGroup,
  FormError
} from '../../../components/form-elements/';
import { getEventsFromApi } from '../data-utils';

const Step1 = ({getDistrictChoices, formData, onFieldChange, onCountryChange, selection, errors}) => {
//   const districtChoices = getDistrictChoices() || [];
  return (
    <Fold title='Context' extraClass foldClass='margin-reset'>
      {/* Hide the status radio until we implement the Early Warning changes to the form */}
      <div style={{display: 'none'}}>
        <FormRadioGroup
          label='Status *'
          name='status'
          options={formData.status}
          selectedOption={selection.status}
          onChange={onFieldChange.bind(this, 'status')}>
          <FormError
            errors={errors}
            property='status'
          />
        </FormRadioGroup>
      </div>
      <FormInputSelect
        label='Title *'
        labelSecondary='Add Title'
        selectLabel='Link to Emergency'
        inputPlaceholder='Example: Malawi - Central Region: Floods 03/2019'
        selectPlaceholder='Click here to link to an existing hazard alert (if one exists)'
        type='text'
        name='summary'
        id='summary'
        maxLength={100}
        description={<div className='form__description'><p>Add a new title (Country - Region: Hazard mm/yyyy) or link to an existing emergency.</p><em>Example: 250 dead after an earthquake in Indonesia</em></div>}
        inputValue={selection.summary}
        inputOnChange={onFieldChange.bind(this, 'summary')}
        selectOnChange={onFieldChange.bind(this, 'event')}
        selectValue={selection.event}
        errors={errors}
        selectLoadOptions={getEventsFromApi}
        autoFocus >

        <FormError
          errors={errors}
          property='summary'
        />
      </FormInputSelect>
      <FormInput
        label='Start Date'
        type='date'
        name='startDate'
        id='startDate'
        value={selection.startDate}
        onChange={onFieldChange.bind(this, 'startDate')}
        description='Start date is when some significant effects are felt or when the first significant impact is felt.'
      >
        <FormError
          errors={errors}
          property='start_date'
        />
      </FormInput>

      <div className='form__group'>
        <div className='form__inner-header'>
          <label className='form__label'>Affected Country and Province / Region *</label>
          <p className='form__description'></p>
        </div>
        <div className="form__inner-body clearfix">
          <div className="form__group__col__6">
            <Select
              placeholder='Select a country'
              name='country'
              value={selection.country}
              onChange={onCountryChange.bind(this)}
              options={formData.countries}
            />

            <FormError
              errors={errors}
              property='country'
            />
          </div>
          {/* <div className="form__group__col__6">
            <Select
              placeholder='Select Provinces / Regions'
              name='districts'
              value={selection.districts}
              onChange={onFieldChange.bind(this, 'districts')}
              options={districtChoices}
              multi
            />

            <FormError
              errors={errors}
              property='districts'
            />
          </div> */}
        </div>
      </div>
      <div className='form__group'>
        <div className='form__inner-header'>
          <label className='form__label'>Disaster Type *</label>
        </div>
        <div className='form__inner-body'>
          <Select
            placeholder='Select a disaster type'
            name='disaster-type'
            id='disaster-type'
            options={formData.disasterType}
            value={selection.disasterType}
            onChange={onFieldChange.bind(this, 'disasterType')}
          />
          <FormError
            errors={errors}
            property='disasterType'
          />
        </div>
      </div>
      <FormRadioGroup
        label='Government requests international assistance?'
        description='Indicate if the government requested international assistance.'
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
        selectedOption={selection.assistance}
        onChange={onFieldChange.bind(this, 'assistance')} >
        <FormError
          errors={errors}
          property='assistance'
        />
      </FormRadioGroup>
    </Fold>
  );
};

export default Step1;

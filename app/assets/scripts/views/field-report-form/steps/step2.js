import React from 'react';
import Fold from '../../../components/fold';
import { FormTextarea, FormError } from '../../../components/form-elements';
import SourceEstimation from '../cmp-source-estimation.js';

const Step2 = ({onFieldChange, selection, errors}) => {
  return (
    <Fold title='Numeric Details (People)'>
      <SourceEstimation
        label='Injured'
        description='Number of people suffering from physical injuries, trauma or an illness requiring immediate medical treatment as a direct result of a disaster.'
        name='num-injured'
        values={selection.numInjured}
        fieldKey='numInjured'
        errors={errors}
        onChange={onFieldChange.bind(this, 'numInjured')} />
      <SourceEstimation
        label='Dead'
        description='Number of people confirmed dead.'
        name='num-dead'
        values={selection.numDead}
        fieldKey='numDead'
        errors={errors}
        onChange={onFieldChange.bind(this, 'numDead')} />
      <SourceEstimation
        label='Missing'
        description='Number of people missing.'
        name='num-missing'
        values={selection.numMissing}
        fieldKey='numMissing'
        errors={errors}
        onChange={onFieldChange.bind(this, 'numMissing')} />
      <SourceEstimation
        label='Affected'
        description='Number of people requiring immediate assistance during a period of emergency; this may include displaced or evacuated people.'
        name='num-affected'
        values={selection.numAffected}
        fieldKey='numAffected'
        errors={errors}
        onChange={onFieldChange.bind(this, 'numAffected')} />
      <SourceEstimation
        label='Displaced'
        description='Number of people displaced.'
        name='num-displaced'
        values={selection.numDisplaced}
        fieldKey='numDisplaced'
        errors={errors}
        onChange={onFieldChange.bind(this, 'numDisplaced')} />
      <FormTextarea
        label='Situational Overview'
        name='description'
        classInput='textarea--lg'
        placeholder='Example: According to the local government, the overflow of the Zimbizi river has caused extensive flood water damage to low income housing along the river bank. The majority of the affected households do not have sufficient insurance coverage for their assets. The local branch of the National Society is currently assessing how to best support the most vulnerable families affected by the disaster.'
        id='description'
        description='Describe the effects of the hazard, the current context, the affected population and how they have been affected.'
        value={selection.description}
        onChange={onFieldChange.bind(this, 'description')} >
        <FormError
          errors={errors}
          property='description'
        />
      </FormTextarea>
    </Fold>
  );
};

export default Step2;

import React from 'react';
import { PropTypes as T } from 'prop-types';
import c from 'classnames';
import _cloneDeep from 'lodash.clonedeep';
import _get from 'lodash.get';

import { FormTextarea } from '#components/form-elements/';
import { FormDescription } from './misc';
import FormCheckbox from './checkbox';
import LanguageContext from '#root/languageContext';

export default class FormCheckboxGroupActions extends React.Component {
  onCheckChange (opValue) {
    const { values, onChange } = this.props;
    const valueObject = values.find(obj => obj.value === opValue);
    const prevState = _get(values, [values.indexOf(valueObject), 'checked'], false);
    let newVals = _cloneDeep(values);

    newVals.map(val => ((val.value === opValue) ? (val.checked = !prevState) : null));
    onChange(newVals);
  }

  onNotesChange (e, label, noteValues, onNotesChange) {
    let newVals = noteValues;
    switch (label) {
      case 'Health':
        newVals.health = e.target.value;
        break;
      case 'NS Institutional Strengthening':
        newVals.ns = e.target.value;
        break;
      case 'Socioeconomic Interventions':
        newVals.socioeco = e.target.value;
        break;
      default:
        break;
    }
    onNotesChange(newVals);
  }

  render () {
    const {
      label,
      name,
      description,
      options,
      values,
      noteValues,
      onNotesChange,
      classWrapper,
      classLabel,
      children
    } = this.props;

    const { strings } = this.context;

    const notesMap = {
      'Health': noteValues.health,
      'NS Institutional Strengthening': noteValues.ns,
      'Socioeconomic Interventions': noteValues.socioeco
    };
    const notesLabels = {
      'Health': 'notes-health',
      'NS Institutional Strengthening': 'notes-ns',
      'Socioeconomic Interventions': 'notes-socioeco'
    };

    return (
      <div className={c('form__group', classWrapper)}>
        <div className='form__group__wrap'>
          <div className='form__inner-header'>
            <div className='form__inner-headline'>
              <label className={c('form__label', classLabel)}>{label}</label>
              <FormDescription value={description} />
            </div>
          </div>
          <div className='form__inner-body'>
            {options.map(optionGroup => (
              <React.Fragment key={optionGroup.label}>
                {options.length > 1 ? (
                  <label className={c('form__label', classLabel)}>{optionGroup.label}</label>
                ) : null}
                <div className='form__options-group'>
                  {(optionGroup.options || options).map(option => {
                    return (
                      <FormCheckbox
                        key={option.value}
                        label={option.label}
                        name={`${name}[]`}
                        id={`${name.replace(/(\[|\])/g, '-')}-${option.value}`}
                        value={option.value}
                        checked={(values.find(({value}) => value === option.value) || {}).checked}
                        onChange={this.onCheckChange.bind(this, option.value)}
                        description={option.description}
                        // tooltipTitle={option.label} // optionally we can turn this on
                        tooltipDescription={option.tooltip}
                      />
                    );
                  })}
                </div>
                { options.length > 1
                  ? (
                    <FormTextarea
                      label={strings.fieldsStep2NotesLabel}
                      classInput='textarea--lg textarea--notes'
                      placeholder={strings.fieldsStep3ActionsNotesPlaceholder}
                      name={notesLabels[optionGroup.label]}
                      id={notesLabels[optionGroup.label]}
                      classLabel='label-secondary'
                      value={notesMap[optionGroup.label]}
                      onChange={(e) => this.onNotesChange(e, optionGroup.label, noteValues, onNotesChange)} />
                  ) : null }
              </React.Fragment>
            ))}
            {children || null}
          </div>
        </div>
      </div>
    );
  }
}

FormCheckboxGroupActions.contextType = LanguageContext;
if (process.env.NODE_ENV !== 'production') {
  FormCheckboxGroupActions.propTypes = {
    label: T.string,
    name: T.string,
    description: T.oneOfType([
      T.node,
      T.object
    ]),
    options: T.array,
    values: T.array,
    classWrapper: T.string,
    classLabel: T.string,
    checked: T.bool,
    children: T.node,
    onChange: T.func
  };
}

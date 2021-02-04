import React from 'react';
import { PropTypes as T } from 'prop-types';
import c from 'classnames';

import { HoverTooltip } from '#components/common/tooltip';

export default function FormCheckable (props) {
  const {
    type,
    label,
    name,
    description,
    disabled,
    id,
    value,
    inline,
    onChange,
    onClick,
    checked,
    tooltipTitle,
    tooltipDescription
  } = props;

  return (
    <React.Fragment>
      <label
        className={c(
          `form__option form__option--custom-${type}`,
          {'form__option--inline': inline},
          {'disabled': disabled})}
          data-for={id + '-tooltip'}
          data-tip='' // required for the tooltip to work on hover
      >
        <input
          name={name}
          id={id}
          disabled={disabled}
          value={value}
          onClick={onClick}
          onChange={onChange}
          checked={checked}
          type={type}
        />
        <span className='form__option__ui'></span>
        <span className='form__option__text'>{label} {description && <em>{description}</em>}</span>
      </label>
      { tooltipTitle || tooltipDescription
        ? (<HoverTooltip title={tooltipTitle} description={tooltipDescription} id={id + '-tooltip'} />) : null }
    </React.Fragment>
  );
}

FormCheckable.defaultProps = {
  checked: false
};

if (process.env.NODE_ENV !== 'production') {
  FormCheckable.propTypes = {
    type: T.oneOf(['checkbox', 'radio']),
    label: T.string,
    name: T.string,
    description: T.oneOfType([
      T.node,
      T.object
    ]),
    id: T.string,
    value: T.string,
    checked: T.bool,
    inline: T.bool,
    onChange: T.func,
    onClick: T.func
  };
}

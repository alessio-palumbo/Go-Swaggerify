import React, { Fragment } from 'react'

export function Input({
  name,
  value,
  placeholder,
  onChangeField,
  onClearField
}) {
  return (
    <Fragment>
      <label htmlFor="input" className="input-labels">
        {name}
      </label>
      <input
        id="input"
        className="form-control form-control-sm mb-2"
        value={value}
        type="text"
        name={name}
        placeholder={placeholder}
        onChange={onChangeField}
        onClick={onClearField}
      />
    </Fragment>
  )
}

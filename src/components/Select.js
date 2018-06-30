import React, { Fragment } from 'react'

export function Select({ name, values, active, onChangeSelection }) {
  return (
    <Fragment>
      <label htmlFor="select" className="input-labels">
        {name}
      </label>
      <select
        className="form-control form-control-sm pl-2 pr-0 input-box"
        id="select"
        name={name}
        onChange={onChangeSelection}
      >
        {values &&
          values.map(method => (
            <option value={method} selected={method === active && 'selected'}>
              {method}
            </option>
          ))}
      </select>
    </Fragment>
  )
}

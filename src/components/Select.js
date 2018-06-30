import React, { Fragment } from 'react'

export function Select({ style, name, values, active, onChangeSelection }) {
  return (
    <Fragment>
      <label htmlFor="select" className="input-labels">
        {name}
      </label>
      <select
        className={`form-control form-control-sm pl-2 pr-0 mr-2 ${style}`}
        id="select"
        name={name}
        onChange={onChangeSelection}
      >
        {values &&
          values.map((method, idx) => (
            <option
              key={idx}
              value={method}
              defaultValue={method === active && method}
            >
              {method}
            </option>
          ))}
      </select>
    </Fragment>
  )
}

import React from 'react'

export function Textarea({ name, value, placeholder, onChangeField }) {
  return (
    <div className="form-group">
      <label htmlFor="textarea" className="input-labels">
        {name}
      </label>
      <textarea
        id="textarea"
        name={name}
        className="form-control form-control-sm"
        placeholder={placeholder}
        onChange={onChangeField}
        defaultValue={value}
      />
    </div>
  )
}

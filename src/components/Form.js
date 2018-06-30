import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { Select } from './Select'

export function Form({ onAddParam }) {
  return (
    <form
      onSubmit={event => {
        event.preventDefault()

        const form = event.target
        const elements = form.elements
        const name = elements.pName.value
        const description = elements.pDescription.value
        const pos = elements.pIn.value
        const type = elements.pType.value
        const required = elements.pRequired.value

        onAddParam({ name, description, pos, type, required })
      }}
    >
      <div className="d-flex justify-content-between input-box ">
        <div>
          <input
            className="form-control form-control-sm"
            type="text"
            name="pName"
            placeholder="Parameter name"
          />
        </div>
        <span className="empty-space" />
        <div>
          <input
            className="form-control form-control-sm"
            type="text"
            name="pDescription"
            placeholder="Description - optional"
          />
        </div>
      </div>
      <div className="d-flex justify-content-between">
        <div className="form-group w-25">
          <Select name="pIn" values={['path', 'query', 'body']} />
        </div>

        <div className="form-group w-25">
          <Select name="pType" values={['UUID', 'string', 'integer', 'date']} />
        </div>

        <div className="form-group w-25">
          <Select name="pRequired" values={['false', 'true']} />
        </div>

        <button type="submit" className="btn btn-form">
          <FontAwesomeIcon icon={faPlus} className="text-white" />
        </button>
      </div>
    </form>
  )
}

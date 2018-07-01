import React from 'react'

export function Responses({ onAddResponse }) {
  return (
    <div className="d-flex justify-content-around flex-wrap">
      <button className="btn btn-sm btn-success" onClick={onAddResponse}>
        200
      </button>
      <button className="btn btn-sm btn-success" onClick={onAddResponse}>
        201
      </button>
      <button className="btn btn-sm btn-success" onClick={onAddResponse}>
        204
      </button>
    </div>
  )
}

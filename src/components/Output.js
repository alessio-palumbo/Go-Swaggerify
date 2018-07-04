import React, { Fragment } from 'react'

export function Output({ notation, onCopyToClipboard }) {
  return (
    <Fragment>
      <button className="btn btn-sm btn-dark mb-2" onClick={onCopyToClipboard}>
        Copy Notation
      </button>
      <pre id="swagger">
        {notation && notation.map(line => line !== '' && line + '\r\n')}
      </pre>
    </Fragment>
  )
}

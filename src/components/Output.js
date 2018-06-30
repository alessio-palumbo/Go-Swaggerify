import React, { Fragment } from 'react'

export function Output({ notation }) {
  return (
    <Fragment className="bg-black text-green">
      <h1>Notation</h1>
      <pre>{notation}</pre>
    </Fragment>
  )
}

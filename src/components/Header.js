import React from 'react'
import '../App.css';
import logo from '../Swagger-logo.png'

export function Header() {
  return (
    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <h1 className="App-title my-2">Go-Swaggerify</h1>
    </header>
  )
}
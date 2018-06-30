import React, { Component } from 'react'
import './bootstrap-4.0.0-beta.2-dist/css/bootstrap.css'
import './App.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { Header } from './components/Header'
import { Input } from './components/Input'
import { Select } from './components/Select'
import { Form } from './components/Form'
import { Textarea } from './components/Textarea'
import { Output } from './components/Output'

class App extends Component {
  state = {
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    method: 'GET',
    route: '',
    description: '',
    params: {},
    notation: ['// swagger:operation GET ', '// ---', '', '']
  }

  // Define swagger method and route and generate tags and title
  onSetFirstLine = ({ method, route }) => {
    let line = '// swagger:operation '
    if (route && route.length > 2) {
      const routeNames = route.substring(1).split('/')
      let tag = routeNames[0]
      let title = method[0] + method.substring(1).toLowerCase()
      routeNames.map(name => {
        if (name !== '' && name.indexOf('{') === -1) {
          let first = name[0].toUpperCase()
          title += '-' + first + name.substring(1)
        }
      })
      line += `${method} ${route} ${tag} ${tag} ${title}`
    } else {
      line += `${method}`
    }
    this.setState(prevState => {
      let newNotation = [...prevState.notation]
      newNotation[0] = line
      return {
        notation: newNotation
      }
    })
  }

  // Change http method
  onChangeSelection = event => {
    const method = event.target.value
    const route = this.state.route
    this.setState({ method: method }, this.onSetFirstLine({ method, route }))
  }

  // Update route and description
  onChangeField = event => {
    const input = event.target.name
    const value = event.target.value
    const method = this.state.method
    switch (input) {
      case 'Route':
        this.setState({ route: value }, function() {
          const route = this.state.route
          return this.onSetFirstLine({ method, route })
        })
        break
      case 'Description':
        const newDescr = '// description: ' + value
        this.setState({ description: newDescr }, function() {
          let descr = this.state.description
          let lines = ''
          const baseWidth = 80
          let width = baseWidth
          do {
            // Make width flexible to avoid cutting through words
            while (descr.charAt(width) && descr.charAt(width) !== ' ') {
              width--
            }
            if (lines !== '') lines += '\n//   '
            lines += descr.substring(0, width).trim()
          } while ((descr = descr.substring(width, descr.length).trim()) != '')

          this.setState(prevState => {
            let newNotation = [...prevState.notation]
            newNotation[2] = lines
            return {
              notation: newNotation
            }
          })
        })
        break
      default:
        return
    }
  }

  onClearField = () => {}

  // Generate parameter
  onAddParam = ({ name, description, pos, type, required }) => {
    const attrs = [name, pos, type, required, description]
    const lines = [
      '// - name: ' + name,
      '\n//   in: ' + pos,
      '\n//   type: ' + type,
      '\n//   required: ' + required,
      '\n//   description: ' + description
    ]

    if (!name || !pos) return
    let param = ''
    attrs.map((attr, idx) => {
      if (attr !== '') {
        param += lines[idx]
      }
    })
    this.setState(prevState => {
      let params = { ...prevState.params }
      params[attrs[0]] = param
      let newNotation = [...prevState.notation]
      if (newNotation[3] !== '') {
        newNotation[3] += '\n'
      }
      newNotation[3] += param
      return { params: params, notation: newNotation }
    })
  }

  // Remove parameter
  onRemoveParam = event => {
    const param = event.target.innerText
    this.setState(prevState => {
      const params = { ...prevState.params }
      delete params[param]
      const updatedNotation = [...prevState.notation]
      updatedNotation[3] = ''
      Object.values(params).map(text => {
        updatedNotation[3] += text
      })
      return {
        notation: updatedNotation,
        params: params
      }
    })
  }

  render() {
    const { methods, method, route, description, notation, params } = this.state
    return (
      <div className="App">
        <Header />
        <div className="row p-2 m-0">
          <div className="col-5 px-5">
            <Select
              style="mb-2"
              name="Method"
              values={methods}
              active={method}
              onChangeSelection={this.onChangeSelection}
            />
            <Input
              name="Route"
              value={route}
              placeholder="/locations/{locations_id}/active"
              onChangeField={this.onChangeField}
              onClearField={this.onClearField}
            />
            <Textarea
              name="Description"
              value={description}
              placeholder="Endpoint description..."
              onChangeField={this.onChangeField}
            />
            <hr />
            <Form onAddParam={this.onAddParam} />
            <div className="d-flex justify-content-start align-items-center">
              {params &&
                Object.keys(params).map(param => {
                  return (
                    <button
                      className="btn btn-sm btn-danger mt-2"
                      onClick={this.onRemoveParam}
                    >
                      {param}
                      <FontAwesomeIcon icon={faTrashAlt} className="ml-1" />
                    </button>
                  )
                })}
            </div>
            <hr />
            <Input
              name="Responses"
              value="TODO"
              placeholder=""
              onChangeField={this.onChangeField}
              onClearField={this.onClearField}
            />
          </div>
          <div className="col-7 pr-4">
            <button className="btn btn-sm mb-2">Copy Notation</button>
            <pre>
              {notation &&
                notation.map(line => {
                  return line + '\n'
                })}
            </pre>
          </div>
        </div>
      </div>
    )
  }
}

export default App

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
import { Responses } from './components/Responses'
import { Output } from './components/Output'

class App extends Component {
  state = {
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    method: 'GET',
    title: '',
    route: '',
    description: '',
    params: {},
    responses: {},
    response: {},
    notation: ['', '// swagger:operation GET ', '// ---', '', '', '']
  }

  // Define swagger method and route and generate tags and title
  onSetFirstLine = ({ method, route }) => {
    let line = '// swagger:operation '
    let title
    if (route && route.length > 2) {
      const routeNames = route.substring(1).split('/')
      let tag = routeNames[0]
      title = method[0] + method.substring(1).toLowerCase()
      routeNames.map(name => {
        if (name !== '' && name.indexOf('{') === -1) {
          let first = name[0].toUpperCase()
          title += '-' + first + name.substring(1)
        }
        return false
      })
      line += `${method} ${route} ${tag} ${tag} ${title}`
    } else {
      line += `${method}`
    }
    this.setState(prevState => {
      let newNotation = [...prevState.notation]
      newNotation[1] = line
      return {
        notation: newNotation,
        title: title
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
          } while ((descr = descr.substring(width, descr.length).trim()) !== '')

          this.setState(prevState => {
            let newNotation = [...prevState.notation]
            newNotation[3] = lines
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
      if (attr !== '') return (param += lines[idx])
      return false
    })
    this.setState(prevState => {
      let params = { ...prevState.params }
      params[attrs[0]] = param
      let newNotation = [...prevState.notation]
      if (newNotation[4] !== '') {
        newNotation[4] += '\n'
      }
      newNotation[4] += param
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
      updatedNotation[4] = ''
      Object.values(params).map(text => (updatedNotation[4] += text))
      return {
        notation: updatedNotation,
        params: params
      }
    })
  }

  onAddResponse = event => {
    const btn = event.target
    btn.className = btn.className.replace('btn-success', 'btn-danger')
    const status = event.target.innerText
    if (this.state.responses[status]) return this.onRemoveResponse(btn, status)
    this.setState(prevState => {
      const notation = [...prevState.notation]
      let response = { ...prevState.response }
      if (notation[5] === '') notation[5] = '// responses:'
      const responses = { ...prevState.responses }
      if (status === '204') {
        responses[status] = `\n// "${status}": No Content`
        notation[5] += responses[status]
      } else {
        const respModel = this.state.title
          ? this.state.title.replace('-', '') + 'Response'
          : ''
        response[
          status
        ] = `// OK\n// swagger:response ${respModel}\ntype ${respModel} struct {\n  Body YourModel\n}\n`
        notation[0] = response[status]
        responses[
          status
        ] = `\n// "${status}": {$ref: "#/responses/${respModel}"}`
        notation[5] += responses[status]
      }
      return {
        notation: notation,
        responses: responses,
        response: response
      }
    })
  }

  onRemoveResponse = (btn, status) => {
    btn.className = btn.className.replace('btn-danger', 'btn-success')
    this.setState(prevState => {
      const responses = { ...prevState.responses }
      const response = { ...prevState.response }
      delete responses[status]
      delete response[status]
      const notation = [...prevState.notation]
      notation[5] = Object.keys(response).length === 0 ? '' : '// responses:'
      notation[0] =
        Object.keys(response).length === 0 ? '' : Object.values(response)[0]
      Object.values(responses).map(resp => (notation[5] += resp))
      return {
        responses: responses,
        response: response,
        notation: notation
      }
    })
  }

  // Copy notation to clipboard
  onCopyToClipboard = () => {
    const swagger = document.getElementById('swagger')
    const textField = document.createElement('textarea')
    textField.innerHTML = swagger.innerHTML
    document.body.appendChild(textField)
    textField.select()
    document.execCommand('copy')
    textField.remove()
  }

  render() {
    const { methods, method, route, description, notation, params } = this.state
    return (
      <div className="App">
        <Header />
        <div className="row p-2 m-0">
          <div className="col-5 px-5">
            <Select
              style={`mb-2`}
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
                      className="btn btn-sm btn-danger mt-2 mr-2"
                      onClick={this.onRemoveParam}
                    >
                      {param}
                      <FontAwesomeIcon icon={faTrashAlt} className="ml-1" />
                    </button>
                  )
                })}
            </div>
            <hr />
            <Responses onAddResponse={this.onAddResponse} />
          </div>
          <div className="col-7 pr-4">
            <Output
              notation={notation}
              onCopyToClipboard={this.onCopyToClipboard}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default App

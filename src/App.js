import React, { Component } from 'react'
import './bootstrap-4.0.0-beta.2-dist/css/bootstrap.css'
import './App.css'
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
    params: [],
    notation: ['// swagger:operation GET ', '// ---']
  }

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

  onChangeSelection = event => {
    const method = event.target.value
    const route = this.state.route
    this.setState({ method: method }, this.onSetFirstLine({ method, route }))
  }

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

  onAddParam = ({ name, description, pos, type, required }) => {
    const param = {
      name: name,
      description: description,
      in: pos,
      type: type,
      required: required
    }
    this.setState(prevState => {
      const params = [...prevState.params, param]
      return { params }
    })
  }

  render() {
    const { methods, method, route, description, notation } = this.state
    return (
      <div className="App">
        <Header />
        <div className="row p-2 m-0">
          <div className="col-6 px-5">
            <Select
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
            {this.state.params &&
              this.state.params.map(param => (
                <p>
                  {param.name} {param.in} {param.type} {param.require}{' '}
                  {param.description}
                </p>
              ))}
            <hr />
            <Input
              name="Responses"
              value="TODO"
              placeholder=""
              onChangeField
              onClearField
            />
          </div>
          <div className="col-6 pr-4">
            <button className="btn text-center mb-3">Copy Notation</button>
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

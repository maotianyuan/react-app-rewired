import 'react-app-polyfill/ie11'
import 'react-app-polyfill/stable'
import  'babel-polyfill'

import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { HashRouter as Router, Route } from 'react-router-dom'
import * as serviceWorker from './serviceWorker'

const Root: React.FC = () => {
  return (
    <Router >
      <Route  path={`/`} component={App}></Route>
    </Router>
  )
}

ReactDOM.render(<Root />, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()

import React from 'react'
import { BackTop } from 'antd'
import { HashRouter as Switch, Route } from "react-router-dom"
import styles from './default.scss'
import Bug from '../pages/bug'
import Login from '../pages/user/login'
const { NODE_ENV } = process.env

const path = NODE_ENV === 'development' ? '/' : '/api/bugList'

const BasicLayout: React.FC = () => {
  return (
      <div className={styles.globalContent} id="content">
        <Switch>
          <Route exact path={path} component={Bug}/>
          <Route path='/login' component={Login}/>
        </Switch>
        <BackTop 
          target={():any =>{
            return document.getElementById("content")
          }}
        />
      </div>
  )
}
export default BasicLayout

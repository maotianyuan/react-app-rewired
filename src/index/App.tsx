import React from 'react'
import GlobalLayout from './layout/BasicLayout'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/es/locale/zh_CN'

const App: React.FC = () => {
  return (
    <ConfigProvider locale={zhCN}>
      <GlobalLayout />
    </ConfigProvider>
  )
}

export default App

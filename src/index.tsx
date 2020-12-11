/*
 * @Descripttion:
 * @version:
 * @Author: chenArno
 * @Date: 2019-12-12 15:05:48
 * @LastEditors: chenArno
 * @LastEditTime: 2020-02-28 15:39:47
 */
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import Home from '@/pages/home'
import { AppContainer } from 'react-hot-loader'
import '@/assets/css/index.less'
import dayjs from 'dayjs'
import store from './store'
import { Provider } from 'react-redux'
import 'dayjs/locale/zh-cn'
dayjs.locale('zh-cn')
console.log(process.env)

const render = (Component: any) => {
  ReactDOM.render(
    <Provider store={store}>
      <AppContainer>
        <Component />
      </AppContainer>
    </Provider>,
    document.getElementById('root')
  )
}
render(Home)
if ((module as any).hot) {
  ; (module as any).hot.accept('./pages/home', () => {
    //因为在App里使用的是export default语法，这里使用的是require,默认不会加载default的，所以需要手动加上
    const NextApp = require('./pages/home').default
    // 重新渲染到 document 里面
    render(NextApp)
  })
}

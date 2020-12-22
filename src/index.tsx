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
import Routes from './routes'
import { AppContainer } from 'react-hot-loader'
import '@/assets/css/index.less'
import dayjs from 'dayjs'
import store from './store'
import { Provider } from 'react-redux'
import 'dayjs/locale/zh-cn'
dayjs.locale('zh-cn')

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
render(Routes)
if ((module as any).hot) {
  ; (module as any).hot.accept('./routes', () => {
    // 重新渲染到 document 里面
    render(Routes)
  })
}

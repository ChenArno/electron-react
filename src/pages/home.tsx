import React, { useState, useRef } from 'react'
import { Layout } from 'antd';
import styles from './index.module.less'
import CodeMirror from '@uiw/react-codemirror';
import 'codemirror/keymap/sublime';
import Header from './header'

const sideWidth = 400

interface HomeProps { }
const Home: React.FC<HomeProps> = (props) => {

  const codeRef: any = useRef()
  const [textArea] = useState<string>(``)
  // const [pause, setPause] = useState(false)
  const pauseRef: any = useRef(false)

  const onChange = (instance: any) => {
    // codeRef.current.editor
    // const { cm } = instance.doc
    const { top, height } = instance.getScrollInfo()
    instance.scrollTo(0, pauseRef.current ? top : height)
  }
  const onScroll = (instance: any) => {
    // console.log(instance)
    // const { cm } = instance.doc
    const { clientHeight, height, top } = instance.getScrollInfo()
    if ((clientHeight + top) === height) {
      pauseRef.current = false
    } else {
      pauseRef.current = true
    }
  }
  return (
    <Layout className={styles.lay}>
      <Header></Header>
      <Layout>
        <Layout.Content style={{ overflowY: 'auto' }}>

        </Layout.Content>
        <Layout.Sider width={sideWidth} className={styles.side}>
          <CodeMirror
            ref={codeRef}
            value={textArea}
            width={sideWidth}
            options={{
              readOnly: true,
              keyMap: 'sublime',
              tabSize: 0,
              mode: 'jsx',
              lineWrapping: true,
              cursorBlinkRate: -1,
              onKeyEvent: true, // 是否允许拖拽事件和键盘事件
            }}
            onChange={onChange}
            onScroll={onScroll}
          />
        </Layout.Sider>
      </Layout>
    </Layout>
  )
}

export default Home

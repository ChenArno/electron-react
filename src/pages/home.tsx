import React, { useEffect, useState, useRef } from 'react'
import { Layout, message } from 'antd';
import styles from './index.module.less'
import dayjs from 'dayjs'
// const iconv = window.require('iconv-lite');
import { buffer_to_hex } from '@/utils/base'
import CodeMirror from '@uiw/react-codemirror';
import 'codemirror/keymap/sublime';
import MainView from './mainView'
import { handMessage } from '@/commons/handData'

const net = window.require("net");

const sideWidth = 400
let server: any = null
let socket: any = null
const { REACT_APP_VERSION } = process.env
interface HomeProps { }
const Home: React.FC<HomeProps> = (props) => {

  // const childRef: any = useRef()
  const [textArea, setTextArea] = useState<string>('')
  const [status, setStatus] = useState(false)
  const [loading, setLoading] = useState(false)
  const child: any = useRef()

  useEffect(() => {
    return () => {

    }
  }, [])

  const onClick = (val = 2000) => {
    if (!val) return message.warning('请先输入端口号');
    if (status) {
      socket.destroy()
      return
    }
    setLoading(true)
    server = net.createServer((soc: any) => {
      socket = soc
      // 创建socket服务端
      console.log('connect: ' +
        socket.remoteAddress + ':' + socket.remotePort);
      setStatus(true)
      setLoading(false)
      //接收到数据
      socket.on('data', (buf: any) => {
        let res = buffer_to_hex(buf) + ""
        res = res.replace(/,/g, ' ')
        setTextArea((o: string) => {
          o = `[${dayjs().format('HH:mm:ss')}] ${res}\n` + o
          return o
        })
        handMessage(buf)
      });
      // socket.pipe(socket);
      //数据错误事件
      socket.on('error', (exception: any) => {
        setLoading(false)
        console.log('socket error:' + exception);
        socket.end();
        setStatus(false)
      });
      //客户端关闭事件
      socket.on('close', (data: any) => {
        setLoading(false)
        console.log('client closed!');
        setStatus(false)
        server.close()
        socket = null
        // socket.remoteAddress + ' ' + socket.remotePort);
      });
    }).listen(val)
    // console.log(server)
    //服务器监听事件
    server.on('listening', () => {
      console.log("server listening:" + server.address().port);
    });
    //服务器错误事件
    server.on("error", (exception: any) => {
      setLoading(false)
      console.log("server error:" + exception);
    });
  }

  return (
    <Layout className={styles.lay}>
      <Layout.Header className={styles.head}>
        <div>智能灯调式工具</div>
        <div>V{REACT_APP_VERSION}</div>
      </Layout.Header>
      <Layout>
        <Layout.Content>
          <MainView socket={socket} ref={child} loading={loading} onClick={onClick} status={status} clear={() => setTextArea('')} />
        </Layout.Content>
        <Layout.Sider width={sideWidth} className={styles.side}>
          <CodeMirror
            value={textArea}
            width={sideWidth}
            options={{
              readOnly: false,
              keyMap: 'sublime',
              tabSize: 0,
              mode: 'jsx',
              lineWrapping: true,
              cursorBlinkRate: -1
            }}
          />
        </Layout.Sider>
      </Layout>
    </Layout>
  )
}

export default Home

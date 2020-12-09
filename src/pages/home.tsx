import React, { useRef, useEffect } from 'react'
import Child from './child'
import { Button } from 'antd';
import styles from './index.less'

// const iconv = window.require('iconv-lite');
import { buffer_to_hex } from '@/utils/base'

const net = window.require("net");

let server: any = null
interface HomeProps { }
const Home: React.FC<HomeProps> = (props) => {
  const childRef: any = useRef()

  useEffect(() => {
    server = net.createServer((socket: any) => {
      // 创建socket服务端
      console.log('connect: ' +
        socket.remoteAddress + ':' + socket.remotePort);
      // socket.setEncoding('utf8');
      //接收到数据
      socket.on('data', (buf: any) => {
        // console.log('client send:' + buf);
        const res = (buffer_to_hex(buf))
        // var body = iconv.decode(buf, 'utf8');
        console.log(res)
      });
      socket.write('Hello client!\r\n');
      // socket.pipe(socket);
      //数据错误事件
      socket.on('error', (exception: any) => {
        console.log('socket error:' + exception);
        socket.end();
      });
      //客户端关闭事件
      socket.on('close', (data: any) => {
        console.log('client closed!');

        // socket.remoteAddress + ' ' + socket.remotePort);
      });
    }).listen(2000)
    console.log(server)
    //服务器监听事件
    server.on('listening', () => {
      console.log("server listening:" + server.address().port);
    });
    //服务器错误事件
    server.on("error", (exception: any) => {
      console.log("server error:" + exception);
    });
    return () => {

    }
  }, [])
  return (
    <div className={styles['wrt-index']}>
      weclome Home
      <Button type="primary">Primary Button</Button>
      <Child ref={childRef} />
      <span
        onClick={() => {
          childRef.current._onclick(1)
        }}
      >
        click
      </span>
    </div>
  )
}

export default Home

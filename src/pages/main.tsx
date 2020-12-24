import React, { useState } from 'react'
import BasicLayouts from '@/Layouts/BasicLayouts'
import { Row, Col, message } from 'antd'
import SendMsg from './modules/sendMsg'
import ReceiveRecord from './modules/receiveRecord'
import ActionView from './modules/actionView'
import store from '@/store'
import { CODE } from '@/store/reducers/info'
import { buffer_to_hex } from '@/utils/base'

const net = window.require("net");

interface MainProps { }
let socket: any = null
const Main: React.FC<MainProps> = props => {
	const [receiveMsg, setReceiveMsg] = useState('')
	const [sendmsg, setSendmsg] = useState('')

	const onFinish = ({ ip, port }: any) => {
		if (!port || !ip) return message.warning('请先选择ip或者输入端口号');
		socket = new net.Socket()
		socket.connect(port, ip, () => {
			message.success('连接成功');
		})
		//接收到数据
		socket.on('data', (buf: any) => {
			const str = buffer_to_hex(buf)
			let res = buffer_to_hex(buf) + ""
			res = res.replace(/,/g, '')
			setReceiveMsg((o: string) => {
				o += `${res}\n`
				return o
			})
			store.dispatch({ type: CODE, vlue: str })
		});
		//数据错误事件
		socket.on('error', (exception: any) => {
			message.warning('socket error:' + exception);
		});
		socket.on('close', function () {
			message.warning('断开连接成功');
			socket = null
		});
	}

	const onClose = () => {
		socket && socket.destroy()
	}

	const onClear = () => {
		setSendmsg('')
		setReceiveMsg('')
	}

	return <BasicLayouts socket={socket} onConnect={onFinish} onClose={onClose} onClear={onClear}>
		<SendMsg />
		<Row style={{ height: 'calc(100% - 168px)' }}>
			<ReceiveRecord textArea={sendmsg} title='发送记录' />
			<ReceiveRecord textArea={receiveMsg} title='接收记录' />
			<Col span={12}>
				<ActionView />
			</Col>
		</Row>
	</BasicLayouts>
}

export default Main
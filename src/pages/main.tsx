import React, { useState, useEffect } from 'react'
import BasicLayouts from '@/Layouts/BasicLayouts'
import { Row, Col, message } from 'antd'
import SendMsg from './modules/sendMsg'
import ReceiveRecord from './modules/receiveRecord'
import ActionView from './modules/actionView'
import store from '@/store'
import { CODE } from '@/store/reducers/info'
import { buffer_to_hex, arr2Int } from '@/utils/base'
import { connect } from 'react-redux'

const net = window.require("net");

interface MainProps {
	sendCode: { msg: string };
}
let socket: any = null
const Main: React.FC<MainProps> = props => {
	const { sendCode } = props
	const [receiveMsg, setReceiveMsg] = useState('')
	const [sendmsg, setSendmsg] = useState('')

	useEffect(() => {
		const { msg } = sendCode
		if (msg === '') return
		setSendmsg((o: string) => {
			o += `${msg}\n`
			return o
		})
	}, [sendCode])

	const dealData = (buf: any) => {
		const str = Array.prototype.slice.call(buf)
		const len = arr2Int(str.slice(10, 12))
		const dataL = len + 13
		if (str.length !== dataL) {
			if (str[dataL] !== 199 || str[dataL + 1] !== 249) return
			store.dispatch({ type: CODE, value: str.slice(0, dataL) })
			setTimeout(() => {
				store.dispatch({ type: CODE, value: str.slice(dataL, str.length) })
			}, 200)
			return
		}
		store.dispatch({ type: CODE, value: str })
	}

	const onFinish = ({ ip, port }: any) => {
		if (!port || !ip) return message.warning('请先选择ip或者输入端口号');
		socket = new net.Socket()
		socket.connect(port, ip, () => {
			message.success('连接成功');
		})
		//接收到数据
		socket.on('data', (buf: any) => {
			let res = buffer_to_hex(buf) + ""
			res = res.replace(/,/g, '')
			setReceiveMsg((o: string) => {
				o += `${res}\n`
				return o
			})
			dealData(buf)
		});
		//数据错误事件
		socket.on('error', (exception: any) => {
			message.warning('socket error:' + exception);
		});
		socket.on('close', function () {
			message.warning('断开连接');
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
				<ActionView socket={socket} />
			</Col>
		</Row>
	</BasicLayouts>
}

export default connect(({ info }: any) => ({ sendCode: info.sendCode }))(Main)
import React from 'react'
import { Form, Button, Input, Divider, Row, Col, message } from 'antd'
import styles from './index.module.less'
import { strToHexCharCode } from '@/commons/handData'
import { buffer_to_str } from '@/utils/base'
import { SENDCODE } from '@/store/reducers/info'
import store from '@/store'

interface SendMsgProps {
	socket?: any;
}

const SendMsg: React.FC<SendMsgProps> = props => {
	const { socket } = props

	const [form] = Form.useForm()

	const onFinish = ({ textArea }: any) => {
		if (!socket) return message.info('请先连接')
		if (!textArea) return message.info('请先填入数据')
		const send = buffer_to_str(strToHexCharCode(textArea.replace(/ /g, '')))
		store.dispatch({ type: SENDCODE, value: send })
		socket.write(Buffer.from(textArea))
		message.success('已下发')
	}
	return <div>
		<Divider orientation="left">发送自定义数据</Divider>
		<Form form={form} className={styles.send} onFinish={onFinish}>
			<Row>
				<Col span={20}>
					<Form.Item noStyle name="textArea">
						<Input.TextArea />
					</Form.Item>
				</Col>
				<Col span={1} />
				<Col span={3}>
					<Form.Item noStyle>
						<Button type="primary" htmlType="submit">发送</Button>
					</Form.Item>
				</Col>
			</Row>
		</Form>
	</div>
}

export default SendMsg
import React, { useState, useEffect } from 'react';
import { Button, Space, Col, Row, Form, Input, InputNumber } from 'antd'
import styles from './index.module.less'
import { connect } from 'react-redux'
import Constants from '@/commons/constants'
// const { ipcRenderer } = window.require(('electron'))

const { REACT_APP_VERSION } = process.env

interface HeaderProps {
	onConnect?: (val: any) => void;
	onClose?: () => void;
	onClear?: () => void;
	code: any;
}

const Header: React.FC<HeaderProps> = props => {
	const { onConnect, onClose, onClear, code } = props

	const [version, setVersion] = useState(0)
	const [form] = Form.useForm();
	const [initValue] = useState(
		{
			ip: '199.1.5.199',
			port: 1000
		}
	)
	useEffect(() => {
		const msgId = code.slice(8, 10)
		if (JSON.stringify(msgId) == JSON.stringify(Constants.AP_PowerUp_Ind)) {
			// 消息体12开始
			// console.log(code.slice(16, 17))
			const [ver] = code.slice(16, 17)
			setVersion(ver)
		}
	}, [code])

	// const onClick = () => {
	// 	ipcRenderer.send('openCale')
	// }

	return <Form initialValues={initValue} form={form} onFinish={onConnect} style={{ padding: '10px 10px 0' }}>
		<div className={styles.head}>
			<Space>
				<Form.Item noStyle>
					<Button htmlType="submit">连接</Button>
				</Form.Item>
				<Button onClick={onClose}>断开连接</Button>
				<Button onClick={onClear}>清空记录</Button>
			</Space>
			<div>V{REACT_APP_VERSION}</div>
		</div>

		<Row gutter={0}>
			<Col span={6}>
				<Form.Item className={styles['Item-bottom']} name="ip" label="服务器">
					<Input />
				</Form.Item>
			</Col>
			<Col span={1}></Col>
			<Col span={6}>
				<Form.Item className={styles['Item-bottom']} name="port" label="端口号">
					<InputNumber />
				</Form.Item>
			</Col>
			<Col span={1}></Col>
			<Col span={6}>
				<span>硬件版本:{version}</span>
			</Col>
		</Row>
	</Form>
}

export default connect(({ info }: any) => ({ code: info.code }), null, null, { forwardRef: true })(Header)
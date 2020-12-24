import React, { useState } from 'react';
import { Button, Space, Col, Row, Form, Input, InputNumber } from 'antd'
import styles from './index.module.less'
// const { ipcRenderer } = window.require(('electron'))

const { REACT_APP_VERSION } = process.env

interface HeaderProps {
	onConnect?: (val: any) => void;
	onClose?: () => void;
	onClear?: () => void;
}

const Header: React.FC<HeaderProps> = props => {
	const { onConnect, onClose, onClear } = props

	const [form] = Form.useForm();
	const [initValue] = useState(
		{
			ip: '199.1.5.199',
			port: 1000
		}
	)

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
			<Col span={6}>
				<Form.Item className={styles['Item-bottom']} name="port" label="端口号">
					<InputNumber />
				</Form.Item>
			</Col>
		</Row>
	</Form>
}

export default Header
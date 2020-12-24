import React, { useState } from 'react';
import { Button, Space, Col, Row, Form, Input, InputNumber } from 'antd'
import styles from './index.module.less'

const { ipcRenderer } = window.require(('electron'))

const { REACT_APP_VERSION } = process.env

interface HeaderProps {

}

const Header: React.FC<HeaderProps> = props => {

	const [form] = Form.useForm();
	const [initValue] = useState(
		{
			ip: '127.0.0.2',
			port: 12,
			terminal2: '1.1.1.1',
			terminal3: '1.1.1.1',
			terminal4: '1.1.1.1',
		}
	)

	const onClick = () => {
		ipcRenderer.send('openCale')
	}

	const onFinish = (val: any) => {
		console.log(val)
	}

	return <Form initialValues={initValue} form={form} onFinish={onFinish} style={{ padding: '10px 10px 0' }}>
		<div className={styles.head}>
			<Space>
				<Form.Item className={styles.Item}>
					<Button htmlType="submit" >连接</Button>
				</Form.Item>
				<Button onClick={onClick}>断开连接</Button>
				<Button onClick={onClick}>图形通知</Button>
				<Button onClick={onClick}>发送测试</Button>
				<Button onClick={onClick}>清空记录</Button>
			</Space>
			<div>V{REACT_APP_VERSION}</div>
		</div>

		<Row gutter={0}>
			<Col span={6}>
				<Form.Item className={styles['Item-bottom']} name="ip" label="服务器">
					<Input />
				</Form.Item>
			</Col>
			<Col span={9}>
				<Form.Item className={styles['Item-bottom']} label="终端地址1">
					<Row>
						<Col span={16}><Form.Item noStyle name="terminal1"><Input /></Form.Item></Col>
						<Col span={1}></Col>
						<Col span={2}><Button>通知1</Button></Col>
					</Row>
				</Form.Item>
			</Col>
			<Col span={9}>
				<Form.Item className={styles['Item-bottom']} label="终端地址3">
					<Row>
						<Col span={16}>
							<Form.Item noStyle name="terminal3"><Input /></Form.Item>
						</Col>
						<Col span={1}></Col>
						<Col span={2}><Button>通知3</Button></Col>
					</Row>
				</Form.Item>
			</Col>
			<Col span={6}>
				<Form.Item className={styles['Item-bottom']} name="port" label="端口号">
					<InputNumber />
				</Form.Item>
			</Col>
			<Col span={9}>
				<Form.Item className={styles['Item-bottom']} label="终端地址2">
					<Row>
						<Col span={16}>
							<Form.Item noStyle name="terminal2"><Input /></Form.Item>
						</Col>
						<Col span={1}></Col>
						<Col span={4}><Button>通知2</Button></Col>
					</Row>
				</Form.Item>
			</Col>
			<Col span={9}>
				<Form.Item className={styles['Item-bottom']} label="终端地址4">
					<Row>
						<Col span={16}>
							<Form.Item noStyle name="terminal4"><Input /></Form.Item>
						</Col>
						<Col span={1}></Col>
						<Col span={4}><Button>通知4</Button></Col>
					</Row>
				</Form.Item>
			</Col>
		</Row>
	</Form>
}

export default Header
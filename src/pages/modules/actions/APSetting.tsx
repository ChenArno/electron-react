import React, { useState, useEffect } from 'react'
import { Space, Button, Input, Form, Checkbox } from 'antd'
import styles from './index.module.less'

interface APSettingProps {
	socket?: any;
}
const initValue = {
	dhcp: false,
	port: 1000,
	testPort: 1001,
	servePort: 1000
}

const APSetting: React.FC<APSettingProps> = props => {
	const [form] = Form.useForm()
	const [checkDhcp, setCheckDhcp] = useState(false)

	useEffect(() => {
		if (checkDhcp) {
			form.setFieldsValue({
				hostName: '199.1.5.199',
				mask: '255.255.255.0',
				network: '199.1.5.1'
			})
		}
	}, [checkDhcp])

	return <div>
		<Space>
			<Button>读取配置</Button>
			<Button>写入配置</Button>
		</Space>
		<div style={{ marginTop: 10, padding: '0 40px 0 10px' }}>
			<Form form={form} initialValues={initValue} size="small" labelCol={{ span: 6 }} wrapperCol={{ span: 10 }}>
				<Form.Item name="dhcp" label="开启DHCP">
					<Checkbox checked={checkDhcp} onChange={(e: any) => { setCheckDhcp(e.target.checked) }} />
				</Form.Item>
				<Form.Item className={styles['form-item']} name="hostName" label="地址">
					<Input disabled={checkDhcp} />
				</Form.Item>
				<Form.Item className={styles['form-item']} name="mask" label="子网掩码">
					<Input disabled={checkDhcp} />
				</Form.Item>
				<Form.Item className={styles['form-item']} name="network" label="网关">
					<Input disabled={checkDhcp} />
				</Form.Item>
				<Form.Item className={styles['form-item']} name="port" label="通信端口">
					<Input />
				</Form.Item>
				<Form.Item className={styles['form-item']} name="testPort" label="测试端口">
					<Input />
				</Form.Item>
				<Form.Item className={styles['form-item']} name="serveIp" label="服务器IP">
					<Input />
				</Form.Item>
				<Form.Item className={styles['form-item']} name="servePort" label="服务器端口">
					<Input />
				</Form.Item>
				<Form.Item className={styles['form-item']} name="APAddr" label="APAddr">
					<Input />
				</Form.Item>
				<Form.Item className={styles['form-item']} name="DNS1" label="DNS1">
					<Input />
				</Form.Item>
				<Form.Item className={styles['form-item']} name="DNS2" label="DNS2">
					<Input />
				</Form.Item>
			</Form>
		</div>
	</div>
}

export default APSetting
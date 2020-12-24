import React from 'react'
import { Space, Button, Row, Col, Input, Form, Checkbox } from 'antd'
import styles from './index.module.less'

interface APSettingProps {

}
const initValue = {
	StartType: 1,
	HWType: 0,
	SWMode: 1,
	LCDType: 0,
	SWVersion: 0,
	EDAddr: '1.1.1.1',
	CRC16: 0,
	ID: 0
}
const APSetting: React.FC<APSettingProps> = props => {
	const [form] = Form.useForm()

	return <div>
		<Space>
			<Button>读取配置</Button>
			<Button>写入配置</Button>
		</Space>
		<Row style={{ marginTop: 10 }}>
			<Col span={12}>
				<Input.TextArea rows={19} />
			</Col>
			<Col span={1}></Col>
			<Col span={10}>
				<Form form={form} initialValues={initValue} size="small" labelCol={{ span: 10 }}>
					<Form.Item name="dhcp" label="开启DHCP">
						<Checkbox />
					</Form.Item>
					<Form.Item className={styles['form-item']} name="hostName" label="地址">
						<Input />
					</Form.Item>
					<Form.Item className={styles['form-item']} name="mask" label="子网掩码">
						<Input />
					</Form.Item>
					<Form.Item className={styles['form-item']} name="network" label="网关">
						<Input />
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
			</Col>
			<Col span={1} ></Col>
		</Row>
	</div>
}

export default APSetting
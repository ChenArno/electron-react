import React from 'react'
import { Space, Button, Row, Col, Input, Form, Select, InputNumber } from 'antd'

interface EDUpgradeProps {
	socket?: any;
}

const modeLists: Array<number> = [0, 1]
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

const EDUpgrade: React.FC<EDUpgradeProps> = props => {
	const [form] = Form.useForm()

	return <div>
		<Space>
			<Button>读取升级文件</Button>
			<Button>发送升级通知</Button>
		</Space>
		<Row style={{ marginTop: 10 }}>
			<Col span={12}>
				<Input.TextArea rows={19} />
			</Col>
			<Col span={1}></Col>
			<Col span={10}>
				<Form form={form} initialValues={initValue} size="small" labelCol={{ span: 10 }}>
					<Form.Item name="StartType" label="StartType">
						<Select style={{ width: 50 }}>
							{modeLists.map(o => (
								<Select.Option value={o} key={o}>{o}</Select.Option>
							))}
						</Select>
					</Form.Item>
					<Form.Item name="HWType" label="HWType">
						<InputNumber />
					</Form.Item>
					<Form.Item name="SWMode" label="SWMode">
						<Select style={{ width: 50 }}>
							{modeLists.map(o => (
								<Select.Option value={o} key={o}>{o}</Select.Option>
							))}
						</Select>
					</Form.Item>
					<Form.Item name="LCDType" label="LCDType">
						<InputNumber />
					</Form.Item>
					<Form.Item name="SWVersion" label="SWVersion">
						<Input />
					</Form.Item>
					<Form.Item name="EDAddr" label="EDAddr">
						<Input />
					</Form.Item>
					<Form.Item name="CRC16" label="CRC16">
						<Input />
					</Form.Item>
					<Form.Item name="ID" label="ID">
						<Input />
					</Form.Item>
				</Form>
			</Col>
			<Col span={1} ></Col>
		</Row>
	</div>
}

export default EDUpgrade
import React, { useState } from 'react'
import { Space, Button, Row, Col, Input, Form, InputNumber, Upload } from 'antd'
import { buffer_to_hex } from '@/utils/base'

const fs = window.require('fs')
const { crc16ccitt } = window.require('crc');

interface APUpgradeProps {
	socket?: any;
}
const initValue = {
	CRC32: 0,
	HWType: 0
}
const APUpgrade: React.FC<APUpgradeProps> = props => {
	const [form] = Form.useForm()
	const [textarea, setTextarea] = useState('')

	const importFile = (info: any) => {
		if (info.file.status === 'error') {
			const { originFileObj: { path } } = info.file
			if (!path) return
			const file = fs.readFileSync(path)
			let res = buffer_to_hex(file) + ""
			res = res.replace(/,/g, '').toUpperCase()
			console.log(file)
			console.log(crc16ccitt(file).toString(16))
			setTextarea(res)
		}
	}
	return <div>
		<Space>
			<Upload name="file" action=""
				accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
				onChange={importFile} showUploadList={false}>
				<Button>读取升级文件</Button>
			</Upload>
			<Button>发送升级通知</Button>
			<Button>计算CRC</Button>
		</Space>
		<Row style={{ marginTop: 10 }}>
			<Col span={12}>
				<Input.TextArea value={textarea} rows={19} />
			</Col>
			<Col span={1}></Col>
			<Col span={10}>
				<Form form={form} initialValues={initValue} size="small" labelCol={{ span: 10 }}>
					<Form.Item name="CRC16" label="CRC16">
						<InputNumber />
					</Form.Item>
					<Form.Item name="HWType" label="HWType">
						<InputNumber />
					</Form.Item>
					<Form.Item name="HWVersion" label="HWVersion">
						<Input />
					</Form.Item>
					<Form.Item name="SWVersion" label="SWVersion">
						<Input />
					</Form.Item>
				</Form>
			</Col>
			<Col span={1} ></Col>
		</Row>
	</div>
}

export default APUpgrade
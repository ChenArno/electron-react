import React, { useState, useEffect, useRef } from 'react'
import { Space, Button, Row, Col, Input, Form, InputNumber, Upload, message } from 'antd'
import { buffer_to_hex, buffer_to_str, arr2Int } from '@/utils/base'
import Constants from '@/commons/constants'
import { strTo32HexCharCode, strToHexCharCode, getCodeBody } from '@/commons/handData'
import { connect } from 'react-redux'
import { SENDCODE } from '@/store/reducers/info'
import store from '@/store'

const fs = window.require('fs')
const { crc16xmodem } = window.require('crc');

interface APUpgradeProps {
	socket?: any;
	code: any;
}
const initValue = {
	CRC32: 0,
	HWType: 0,
	HWVersion: 0,
	SWVersion: '0'
}
// const byte = 1406
const APUpgrade: React.FC<APUpgradeProps> = props => {
	const { socket, code } = props
	const [form] = Form.useForm()
	const [textarea, setTextarea] = useState('')
	const FileRef: any = useRef(null)

	useEffect(() => {
		const msgId = code.slice(8, 10)
		if (JSON.stringify(msgId) == JSON.stringify(Constants.AP_SwUpdate_Init_Req)) {
			// 消息体12开始
		} else if (JSON.stringify(msgId) == JSON.stringify(Constants.AP_SwUpdate_CodeData_Req)) {
			if (!FileRef.current) return
			// 升级命令 拆分 最大长度996
			// 来一条发一条
			const begin = arr2Int(code.slice(12, 16))
			const leng = arr2Int(code.slice(16, 20))
			const codeData: any = FileRef.current.slice(begin, begin + leng)
			const arr = [0x00, 0x00, 0x00, 0x00, ...code.slice(12, 16), ...code.slice(16, 20), ...codeData]
			const sendMsg = getCodeBody(arr, Constants.AP_SwUpdate_CodeData_Req)
			const send = buffer_to_str(sendMsg)
			store.dispatch({ type: SENDCODE, value: send })
			socket.write(Buffer.from(sendMsg))
			leng < 996 && message.success('升级成功')
		}
	}, [code])

	const importFile = (info: any) => {
		if (info.file.status === 'error') {
			const { originFileObj: { path } } = info.file
			if (!path) return
			FileRef.current = fs.readFileSync(path)
			let res = buffer_to_hex(FileRef.current) + ""
			res = res.replace(/,/g, '').toUpperCase()
			const c = crc16xmodem(FileRef.current).toString(16)
			// 0e54
			const crc = new Array(4 - c.length + 1).join('0') + c
			form.setFieldsValue({ CRC16: crc })
			setTextarea(res)
		}
	}
	const onUpgrade = () => {
		if (!socket) return message.info('请先连接')
		const len = strTo32HexCharCode(textarea.length / 2)
		const crc16 = strTo32HexCharCode(form.getFieldValue('CRC16'))
		const HWType = parseInt(form.getFieldValue('HWType'))
		const HWVersion = parseInt(form.getFieldValue('HWVersion'))
		let SWVersion: any = strToHexCharCode(new Array(4 - form.getFieldValue('SWVersion').length + 1).join('0') + form.getFieldValue('SWVersion'))
		const arr = [...len, ...crc16, HWType, HWVersion, ...SWVersion.reverse(), 0x00, 0x00, 0x00, 0x00]
		const sendMsg = getCodeBody(arr, Constants.AP_SwUpdate_Init_Req)
		const send = buffer_to_str(sendMsg)
		store.dispatch({ type: SENDCODE, value: send })
		socket.write(Buffer.from(sendMsg))
		message.success('已下发')
	}
	return <div>
		<Space>
			<Upload name="file" action=""
				onChange={importFile} showUploadList={false}>
				<Button>读取升级文件</Button>
			</Upload>
			<Button onClick={onUpgrade}>点击升级</Button>
		</Space>
		<Row style={{ marginTop: 10 }}>
			<Col span={12}>
				<Input.TextArea value={textarea} rows={19} />
			</Col>
			<Col span={1}></Col>
			<Col span={10}>
				<Form form={form} initialValues={initValue} size="small" labelCol={{ span: 10 }}>
					<Form.Item name="CRC16" label="CRC16">
						<Input />
					</Form.Item>
					<Form.Item name="HWType" label="HWType">
						<InputNumber />
					</Form.Item>
					<Form.Item name="HWVersion" label="HWVersion">
						<InputNumber />
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

export default connect(({ info }: any) => ({ code: info.code }), null, null, { forwardRef: true })(APUpgrade)
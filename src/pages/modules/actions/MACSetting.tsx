import React, { useEffect } from 'react'
import { Button, Space, Form, Input, message } from 'antd'
import { getCodeBody, strToHexCharCode } from '@/commons/handData'
import Constants from '@/commons/constants'
import { buffer_to_str, buffer_to_hex } from '@/utils/base'
import store from '@/store'
import { SENDCODE } from '@/store/reducers/info'
import { connect } from 'react-redux'

interface MACSettingProps {
	socket?: any;
	code: any;
}

const MACSetting: React.FC<MACSettingProps> = props => {
	const { socket, code } = props
	const [form] = Form.useForm()

	useEffect(() => {
		const msgId = code.slice(8, 10)
		if (JSON.stringify(msgId) == JSON.stringify(Constants.AP_Factory_Config_MAC)) {
			// 消息体12开始
			if (code.slice(14, 15)[0] === 0) {
				const mac = buffer_to_hex(code.slice(15, 21)).toString().replace(/,/g, "-").toUpperCase()
				form.setFieldsValue({ mac })
			}
		}
	}, [code])

	const onWriteRead = (type: number) => {
		if (!socket) return message.info('请先连接')
		let arr = []
		for (let i = 0; i < 40; i++) {
			arr.push(0)
		}
		if (type === 1) {
			const mac = strToHexCharCode(form.getFieldValue('mac').split('-').toString().replace(/,/g, ""))
			for (let i = 0; i < 6; i++) {
				arr[i + 2] = mac[i]
			}
			arr[0] = 1
		}
		const sendMsg = getCodeBody(arr, Constants.AP_Factory_Config_MAC)
		const send = buffer_to_str(sendMsg)
		store.dispatch({ type: SENDCODE, value: send })
		socket.write(Buffer.from(sendMsg))
		message.success('已下发')
	}
	// c7f9b7000e0000000380290000000070b3d590a1850000000000000000000000000000000000000000000000000000000000000000df
	return <div>
		<Space>
			<Button onClick={() => onWriteRead(0)}>读取MAC</Button>
			<Button onClick={() => onWriteRead(1)}>写入MAC</Button>
		</Space>
		<Form style={{ marginTop: 10 }} form={form} wrapperCol={{ span: 10 }}>
			<Form.Item name="mac" label="mac">
				<Input />
			</Form.Item>
		</Form>
	</div>
}

export default connect(({ info }: any) => ({ code: info.code }), null, null, { forwardRef: true })(MACSetting)
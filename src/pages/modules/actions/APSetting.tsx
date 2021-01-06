import React, { useState, useEffect } from 'react'
import { Space, Button, Input, Form, Checkbox, message, notification } from 'antd'
import styles from './index.module.less'
import { SENDCODE } from '@/store/reducers/info'
import { getCodeBody, strToHexCharCode } from '@/commons/handData'
import { buffer_to_str, arrToSum, arr2Int, int2Arr } from '@/utils/base'
import Constants from '@/commons/constants'
import store from '@/store'
import { connect } from 'react-redux'

interface APSettingProps {
	socket?: any;
	code: any;
}
const initValue = {
	dhcp: false,
	port: 1000,
	testPort: 1001,
	servePort: 1000
}

const APSetting: React.FC<APSettingProps> = props => {
	const { socket, code } = props
	const [form] = Form.useForm()
	const [checkDhcp, setCheckDhcp] = useState(false)
	useEffect(() => {
		const msgId = code.slice(8, 10)
		if (JSON.stringify(msgId) == JSON.stringify(Constants.AP_Factory_Config_IP_Req)) {
			// 消息体12开始
			if (code.slice(13, 14)[0] === 0) return // 除了写入读配置或者擦除
			if (JSON.stringify(code.slice(19, 23)) === JSON.stringify([255, 255, 255, 255])) {
				notification['warning']({
					message: '提示',
					description:
						'配置或者读取失败，请重新写入配置，或者手动还原设备',
				});
				return
			}
			const apAddr = arr2Int(code.slice(14, 18))
			let serveIp = ''
			code.slice(35, 135).map((o: any) => {
				serveIp += String.fromCharCode(o)
			})
			form.setFieldsValue({
				dhcp: code.slice(18, 19)[0] === 1,
				APAddr: apAddr,
				hostName: (code.slice(19, 23).reverse() + '').replace(/,/g, '.'),
				mask: (code.slice(23, 27).reverse() + '').replace(/,/g, '.'),
				network: (code.slice(27, 31).reverse() + '').replace(/,/g, '.'),
				port: arr2Int(code.slice(31, 33)),
				testPort: arr2Int(code.slice(33, 35)),
				serveIp,
				servePort: arr2Int(code.slice(135, 137)),
				DNS1: (code.slice(139, 143).reverse() + '').replace(/,/g, '.'),
				DNS2: (code.slice(143, 147).reverse() + '').replace(/,/g, '.')
			})
		}
	}, [code])

	useEffect(() => {
		if (checkDhcp) {
			form.setFieldsValue({
				hostName: '199.1.5.199',
				mask: '255.255.255.0',
				network: '199.1.5.1'
			})
		}
	}, [checkDhcp])

	const sendMsg2Base = (arr: Array<number>) => {
		if (!socket) return message.info('请先连接')
		const sendMsg = getCodeBody(arr, Constants.AP_Factory_Config_IP_Req)
		const send = buffer_to_str(sendMsg)
		store.dispatch({ type: SENDCODE, value: send })
		socket.write(Buffer.from(sendMsg))
	}

	const readConfig = (type: number) => {
		form.resetFields()
		const apAddr = [0x00, 0x00, 0x00, 0x00]
		const dhcp = [0x00]
		const ipAddr = [0x00, 0x00, 0x00, 0x00]
		const ipMask = [0x00, 0x00, 0x00, 0x00]
		const Gateway = [0x00, 0x00, 0x00, 0x00]
		const portCommon = [0x00, 0x00]
		const portDia = [0x00, 0x00]
		let serveAddr = []
		for (let i = 0; i < 100; i++) {
			serveAddr.push(0x00)
		}
		const dns1 = [0x00, 0x00, 0x00, 0x00]
		const dns2 = [0x00, 0x00, 0x00, 0x00]
		let arr = [type, ...apAddr, ...dhcp, ...ipAddr, ...ipMask, ...Gateway, ...portCommon, ...portDia, ...serveAddr, 0x00, 0x00, 0x00, 0x00, ...dns1, ...dns2]
		arr = [...arr, ...strToHexCharCode(arrToSum(arr))]
		sendMsg2Base(arr)
	}

	const writeConfig = () => {
		const { dhcp, hostName, mask, network, port, testPort, serveIp, servePort, APAddr, DNS1, DNS2 } = form.getFieldsValue()
		const ipAddr = hostName.split('.').reverse().map((r: string) => parseInt(r))
		const ipMask = mask.split('.').reverse().map((r: string) => parseInt(r))
		const Gateway = network.split('.').reverse().map((r: string) => parseInt(r))
		const portCommon = int2Arr(port)
		const portDia = int2Arr(testPort)
		const serverPort = int2Arr(servePort)
		let serveAddr = []
		for (let str of serveIp) {
			serveAddr.push(str.charCodeAt())
		}
		for (let i = 0; i < 100 - serveIp.length; i++) {
			serveAddr.push(0x00)
		}
		const dns1 = DNS1.split('.').reverse().map((r: string) => parseInt(r))
		const dns2 = DNS2.split('.').reverse().map((r: string) => parseInt(r))
		let arr = [0x00, ...int2Arr(APAddr, 8), dhcp ? 0x01 : 0x00,
			...ipAddr, ...ipMask, ...Gateway, ...portCommon, ...portDia,
			...serveAddr, ...serverPort, 0x00, 0x00, ...dns1, ...dns2]
		arr = [...arr, ...strToHexCharCode(arrToSum(arr))]
		sendMsg2Base(arr)
		message.info('开始重启')
		setTimeout(() => {
			const sendMsg = getCodeBody([], Constants.AP_Reset_Req)
			const send = buffer_to_str(sendMsg)
			store.dispatch({ type: SENDCODE, value: send })
			socket.write(Buffer.from(sendMsg))
			socket && socket.destroy()
			message.success('重启成功')
		}, 3000)
	}

	return <div>
		<Space>
			<Button onClick={() => { readConfig(0x01) }}>读取配置</Button>
			<Button onClick={writeConfig}>写入配置</Button>
			<Button onClick={() => { readConfig(0x02) }}>擦除配置</Button>
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

export default connect(({ info }: any) => ({ code: info.code }), null, null, { forwardRef: true })(APSetting)
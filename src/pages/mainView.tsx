import React from 'react'
import { InputNumber, Button, Form, message, Spin, Select, Space } from 'antd'
import { connect } from 'react-redux'
import { strToHexCharCode } from '@/commons/handData'
import styles from './index.module.less'
import { arrToSum, getLocalIP } from '@/utils/base'
import Constants from '@/commons/constants'
import TemTable from './table'
import FerTable from './table/ferTable'

interface MainViewProps {
	socket?: any;
	loading?: boolean;
	status: boolean;
	onClick: (value: any) => void;
	clear?: () => void;
	baseMsg: any;
	menuItem: string;
}
const MainView: React.FC<MainViewProps> = (props, ref: any) => {
	const { socket, onClick, loading, status, clear, baseMsg, menuItem } = props

	// 切换灯模式
	const changeModel = (model: number) => {
		const { baseCode } = baseMsg
		const bodyMsg = [model, 0x00, 0x00, 0x00, 0x00]
		let sendMsg = [
			...Constants.cont_head,
			...Constants.cont_reserved,
			...baseCode, // FF FF FF FF无差别下发
			// ...[0xFF, 0xFF, 0xFF, 0xFF],
			...Constants.AP_Config_BeaconMode,
			...[bodyMsg.length, 0x00],
			...bodyMsg,
		]
		sendMsg = [...sendMsg, ...strToHexCharCode(arrToSum(sendMsg))]
		socket.write(Buffer.from(sendMsg)) // Array to ArrayBuffer
		message.success('已下发')
	}

	return <Spin spinning={loading}>
		<div className={styles.main}>
			<Form initialValues={{ port: 2000 }} layout="inline"
				onFinish={(val: any) => onClick(val)}>
				<Form.Item style={{ width: '140px' }} name="ip">
					<Select>
						{getLocalIP().map(o => <Select.Option key={o} value={o}>{o}</Select.Option>)}
					</Select>
				</Form.Item>
				<Form.Item name="port">
					<InputNumber
						placeholder="请输入服务器端口"
					/>
				</Form.Item>
				<Form.Item>
					<Button
						type="primary"
						htmlType="submit"
					>
						{status ? '关闭' : '打开'}
					</Button>
					<Button style={{ marginLeft: 10 }} onClick={clear}>清除日志</Button>
				</Form.Item>
			</Form>
			<Space className={styles.exp}>
				<Button type="default" onClick={() => changeModel(0x00)}>塔灯</Button>
				<Button type="primary" onClick={() => changeModel(0x01)}>智能灯</Button>
				<Button>导入标签</Button>
			</Space>
			<div style={{ marginTop: '20px' }}>
				{menuItem === 'contal' ? <TemTable socket={socket} /> : <FerTable socket={socket} />}
			</div>
		</div>
	</Spin>
}

export default connect(({ info }: any) => ({ baseMsg: info.baseMsg, menuItem: info.menuItem }), null, null, { forwardRef: true })(MainView)


import React, { useEffect, useState, useImperativeHandle, forwardRef } from 'react'
import { InputNumber, Button, Form, Input, Table, message, Spin, Divider, Select } from 'antd'
import { AlertOutlined, BellOutlined, PoweroffOutlined } from '@ant-design/icons'
import { connect } from 'react-redux'
import { strToHexCharCode, valueAtBit, light2Bit } from '@/commons/handData'
import styles from './index.module.less'
import { arrToSum, getLocalIP } from '@/utils/base'
import Constants from '@/commons/constants'


interface MainViewProps {
	socket?: any;
	loading?: boolean;
	status: boolean;
	onClick: (value: any) => void;
	clear?: () => void;
	baseMsg: any;
}
const MainView: React.FC<MainViewProps> = (props, ref: any) => {
	const { socket, onClick, loading, status, clear, baseMsg } = props
	const [dataSource, setDataSource] = useState([])
	const [tableLoading] = useState(false)

	useImperativeHandle(ref, () => {
		return {
			getData: dataSource
		}
	})
	// 切换灯模式
	const changeModel = () => {
		const { baseCode, model } = baseMsg
		const bodyMsg = [model === 1 ? 0x00 : 0x01, 0x00, 0x00, 0x00, 0x00]
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
	//控制红黄绿灯，蜂鸣
	const onSubmit = (val: any, detail?: any) => {
		const { id: tagId, red, yellow, green, } = detail
		const lightVal = light2Bit(val, { yellow, green, red })
		const { baseCode, model, BellState } = baseMsg
		const bodyMsg = [...strToHexCharCode(tagId), ...lightVal, val.BellState !== undefined ? val.BellState : BellState, ...Constants.cont_respReserved]
		const msgType = model === 1 ? Constants.cont_msgId_smart : Constants.cont_msgId_Tower
		let sendMsg = [
			...Constants.cont_head,
			...Constants.cont_reserved,
			...baseCode,
			...msgType,
			...[bodyMsg.length, 0x00],
			...bodyMsg
		]
		sendMsg = [...sendMsg, ...strToHexCharCode(arrToSum(sendMsg))]
		socket.write(Buffer.from(sendMsg))
		message.success('已下发')
	}

	const columns = [{
		title: '控制盒ID',
		dataIndex: 'id',
		key: 'id',
	},
	{
		title: '硬件',
		dataIndex: 'HWType',
		key: 'HWType',
	},
	{
		title: '软件',
		dataIndex: 'SWVersion',
		key: 'SWVersion',
	},
	{
		title: '红',
		dataIndex: 'red',
		key: 'red',
		render: (text: number, recod: any) => (
			<span className={styles.btn} onClick={() => { onSubmit({ red: text === 1 ? 0 : 1 }, recod) }} >
				{text === 1 ? <AlertOutlined style={{ color: 'red' }} /> : <PoweroffOutlined />}
			</span>)
	}, {
		title: '黄',
		dataIndex: 'yellow',
		key: 'yellow',
		render: (text: number, recod: any) => (
			<span className={styles.btn} onClick={() => { onSubmit({ yellow: text === 1 ? 0 : 1 }, recod) }} >
				{text === 1 ? <AlertOutlined style={{ color: 'rgb(181, 181, 6)' }} /> : <PoweroffOutlined />}
			</span>
		)
	}, {
		title: '绿',
		dataIndex: 'green',
		key: 'green',
		render: (text: number, recod: any) => (
			<span className={styles.btn} onClick={() => { onSubmit({ green: text === 1 ? 0 : 1 }, recod) }} >
				{text === 1 ? <AlertOutlined style={{ color: 'green' }} /> : <PoweroffOutlined />}
			</span>
		)
	},
	{
		title: '蜂鸣',
		dataIndex: 'BellState',
		key: 'BellState',
		render: (text: number, recod: any) => (<span className={styles.btn} onClick={() => { onSubmit({ BellState: text === 1 ? 0 : 1 }, recod) }}>
			{text === 1 ? <BellOutlined /> : <PoweroffOutlined />}
		</span>)
	},
	{
		title: '操作',
		dataIndex: 'action',
		render: (text: any, record: any) => (
			<>
				<a onClick={() => { onSubmit({ yellow: 1, green: 1, red: 1 }, record) }}>全亮</a>
				<Divider type="vertical" />
				<a onClick={() => { onSubmit({ yellow: 0, green: 0, red: 0 }, record) }}>全灭</a>
				<Divider type="vertical" />
				<a onClick={() => onDelete(record.id)}>删除</a>
			</>
		)
	}]

	useEffect(() => {
		const { tagId, LedState, BellState, HWType, SWVersion } = baseMsg
		if (dataSource.findIndex(o => o.id === tagId) === -1) return
		// console.log(baseMsg)
		setDataSource((o: Array<any>) => o.map(e => {
			if (e.id === tagId) {
				const colorState = parseInt(LedState, 16).toString(2)
				e.red = valueAtBit(colorState, 8)
				e.green = valueAtBit(colorState, 7)
				e.yellow = valueAtBit(colorState, 6)
				e.SWVersion = SWVersion
				e.BellState = BellState
				e.HWType = HWType
			}
			return e
		}))
		// setTableLoading(false)
	}, [baseMsg])

	const onFinish = ({ id }: any) => {
		if (!id) return message.warning('不能为空')
		if (id.length !== 8) return message.warning('标签编号格式不正确')
		id = id.toUpperCase()
		if (dataSource.findIndex(o => o.id === id) > -1) return message.warning('标签已存在')
		setDataSource(o => o = [...o, { id, red: 0, yellow: 0, green: 0, SWVersion: '-', HWType: '-', BellState: 0 }])
	}

	const onDelete = (val: string) => {
		setDataSource(o => o.filter(item => item.id !== val))
	}
	return <Spin spinning={loading}>
		<div className={styles.main}>
			<Form initialValues={{ port: 2000 }} layout="inline"
				onFinish={(val: any) => onClick(val)}
				style={{ marginBottom: '20px', marginTop: '10px' }}>
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
				<Form.Item >
					<Button
						type="primary"
						htmlType="submit"
					>
						{status ? '关闭' : '打开'}
					</Button>
					<Button style={{ marginLeft: 10 }} onClick={clear}>清除日志</Button>
				</Form.Item>
			</Form>
			<div className={styles.exp}>
				<span>当期模式:{Constants.model[baseMsg.model]}</span>
				<Button type="default" style={{ marginLeft: 10, marginRight: 10 }} onClick={changeModel}>切换</Button>
				<Button>导入标签</Button>
			</div>
			<div style={{ marginTop: '20px' }}>
				<Form initialValues={{ id: '06000034' }} layout="inline" style={{ marginBottom: '20px', marginTop: '10px' }} onFinish={onFinish}>
					<Form.Item label="控制盒ID" name="id">
						<Input />
					</Form.Item>
					<Form.Item >
						<Button
							type="primary"
							htmlType="submit"
						>
							提交
          </Button>
					</Form.Item>
				</Form>
				<Table loading={tableLoading} rowKey={columns => columns.id} size="small" dataSource={dataSource} columns={columns} pagination={false} />
			</div>
		</div>
	</Spin>
}

export default connect(({ info }: any) => ({ baseMsg: info.baseMsg }), null, null, { forwardRef: true })(forwardRef(MainView))


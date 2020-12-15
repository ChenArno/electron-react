import React, { useEffect, useState } from 'react'
import { Table, Divider, message, Form, Input, Button, Select } from 'antd'
import { strToHexCharCode, strTo32HexCharCode } from '@/commons/handData'
import Constants from '@/commons/constants'
import { arrToSum } from '@/utils/base'
import { connect } from 'react-redux'
const { ipcRenderer } = window.require('electron')

interface TemTableProps {
	socket?: any;
	baseMsg?: any;
}

const TemTable: React.FC<TemTableProps> = props => {
	const { socket, baseMsg } = props
	const [tableLoading] = useState(false)
	const [dataSource, setDataSource] = useState([])
	const [frequency, setFrequency] = useState([])

	const columns = [{
		title: '控制盒ID',
		dataIndex: 'id',
		key: 'id',
	},
	{
		title: '频率',
		dataIndex: 'frequency',
		key: 'frequency',
		render: (text: any, record: any) => (
			<Select value={text} style={{ width: '100px' }} onChange={(val: any) => {
				setDataSource((o) => o.map((e: any) => {
					if (e.id === record.id) {
						e.frequency = val
					}
					return e
				}))
			}}>
				{frequency.map((o: any) => (
					<Select.Option key={o.label} value={o.value}>{o.label}</Select.Option>
				))}
			</Select>
		)
	},
	{
		title: '操作',
		dataIndex: 'action',
		render: (text: any, record: any) => (
			<>
				<a onClick={() => onSet(record)}>下发频率</a>
				<Divider type="vertical" />
				<a onClick={() => onDelete(record.id)}>删除</a>
			</>
		)
	}]

	useEffect(() => {
		ipcRenderer.send('preload', 'begin')
		ipcRenderer.on('preload-success', (e: any, config: any) => {
			// 监听主进程发来的事件...
			const { frequency } = config
			setFrequency(frequency)
		})
	}, [])

	const onSet = (val: any) => {
		console.log(val)
		// setDataSource((o: Array<any>) => o.map(e => {
		// 	if (e.id === val.id) {
		// 		e.SWVersion = SWVersion
		// 		e.BellState = BellState
		// 		e.HWType = HWType
		// 	}
		// 	return e
		// }))
	}
	const onDelete = (val: string) => {
		setDataSource(o => o.filter(item => item.id !== val))
	}

	const onFinish = ({ id }: any) => {
		if (!id) return message.warning('不能为空')
		if (id.length !== 8) return message.warning('标签编号格式不正确')
		id = id.toUpperCase()
		if (dataSource.findIndex(o => o.id === id) > -1) return message.warning('标签已存在')
		setDataSource(o => o = [...o, { id, frequency: 600000 }])
	}

	const onUpdateIfy = (val: any) => {
		const { fig1, fig2 } = val
		console.log(fig1, strTo32HexCharCode(fig1), strTo32HexCharCode(fig2))
		const { baseCode } = baseMsg
		if (!baseCode) return
		const bodyMsg = [0x01, 0x00, 0x00, 0x00, 0x00]
		let sendMsg = [
			...Constants.cont_head,
			...Constants.cont_reserved,
			...baseCode, // FF FF FF FF无差别下发
			// ...[0xFF, 0xFF, 0xFF, 0xFF],
			...Constants.AP_Config_RfBase,
			...[bodyMsg.length, 0x00],
			...bodyMsg,
			...[0x47, 0xA5]
		]
		console.log(sendMsg)
		console.log(socket)
		sendMsg = [...sendMsg, ...strToHexCharCode(arrToSum(sendMsg))]
		// socket.write(Buffer.from(sendMsg)) // Array to ArrayBuffer
		message.success('已下发')
	}

	return <div>
		<Form initialValues={{ fig1: 500000, fig2: 500000 }} layout="inline" onFinish={onUpdateIfy}>
			<Form.Item name="fig1">
				<Select style={{ width: '100px' }}>
					{frequency.map((o: any) => (
						<Select.Option key={o.label} value={o.value}>{o.label}</Select.Option>
					))}
				</Select>
			</Form.Item>
			<Form.Item name="fig2">
				<Select style={{ width: '100px' }}>
					{frequency.map((o: any) => (
						<Select.Option key={o.label} value={o.value}>{o.label}</Select.Option>
					))}
				</Select>
			</Form.Item>
			<Form.Item>
				<Button type="primary"
					htmlType="submit"
				>修改基站频率</Button>
			</Form.Item>
		</Form>
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
}

export default connect(({ info }: any) => ({ baseMsg: info.baseMsg }), null, null, { forwardRef: true })(TemTable)
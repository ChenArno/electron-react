import React, { useEffect, useState, useRef, useImperativeHandle, forwardRef } from 'react'
import { InputNumber, Row, Col, Button, Form, Input, Table, message } from 'antd'
import { AlertOutlined, BellOutlined, PoweroffOutlined } from '@ant-design/icons'
import { connect } from 'react-redux'
import { strToHexCharCode } from '@/commons/handData'
import styles from './index.module.less'

interface MainViewProps {
	socket?: any;
	loading?: boolean;
	status: boolean;
	onClick: (value: number) => void;
	clear?: () => void;
	baseMsg: any;
}
const buttnList: any = [{
	id: 4,
	type: 'primary',
	label: '全亮'
}, {
	id: 5,
	type: 'default',
	label: '全灭'
}]
const MainView: React.FC<MainViewProps> = (props, ref: any) => {
	const { socket, onClick, loading, status, clear, baseMsg } = props
	const inputRef: any = useRef(null)
	const [dataSource, setDataSource] = useState([])
	const [tableLoading] = useState(false)

	useImperativeHandle(ref, () => {
		return {
			getData: dataSource
		}
	})

	const onSubmit = (val: any, tagId?: string) => {
		// setTableLoading(true)
		console.log(socket)
		console.log(tagId)
		console.log(strToHexCharCode(tagId))
		// socket.write([0x89, 0x00])
	}

	const columns = [{
		title: '控制盒ID',
		dataIndex: 'id',
		key: 'id',
	},
	{
		title: '硬件信息',
		dataIndex: 'HWType',
		key: 'HWType',
	},
	{
		title: '软件版本',
		dataIndex: 'SWVersion',
		key: 'SWVersion',
	},
	{
		title: '红',
		dataIndex: 'red',
		key: 'red',
		render: (text: number, recod: any) => (
			<span onClick={() => { onSubmit('red', recod.id) }} >
				{text === 1 ? <AlertOutlined style={{ color: 'red' }} /> : <PoweroffOutlined />}
			</span>)
	}, {
		title: '黄',
		dataIndex: 'yellow',
		key: 'yellow',
		render: (text: number, recod: any) => (
			<span onClick={() => { onSubmit('yellow', recod.id) }} >
				{text === 1 ? <AlertOutlined style={{ color: 'rgb(181, 181, 6)' }} /> : <PoweroffOutlined />}
			</span>
		)
	}, {
		title: '绿',
		dataIndex: 'green',
		key: 'green',
		render: (text: number, recod: any) => (
			<span onClick={() => { onSubmit('green', recod.id) }} >
				{text === 1 ? <AlertOutlined style={{ color: 'green' }} /> : <PoweroffOutlined />}
			</span>
		)
	},
	{
		title: '蜂鸣',
		dataIndex: 'BellState',
		key: 'BellState',
		render: (text: number) => (<span>
			{text === 1 ? <BellOutlined /> : <></>}
		</span>)
	},
	{
		title: '操作',
		dataIndex: 'action',
		render: (text: any, record: any) => (<a onClick={() => onDelete(record.id)}>删除</a>)
	}]

	useEffect(() => {
		const { tagId, LedState, BellState, HWType, SWVersion } = baseMsg
		if (dataSource.findIndex(o => o.id === tagId) === -1) return
		setDataSource((o: Array<any>) => o.map(e => {
			if (e.id === tagId) {
				Object.keys(LedState).forEach(l => {
					e[l] = LedState[l]
				})
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
		if (dataSource.findIndex(o => o.id === id) > -1) return message.warning('标签已存在')
		setDataSource(o => o = [...o, { id, red: 0, yellow: 0, green: 0, SWVersion: '-', HWType: '-', BellState: 0 }])
	}

	const onDelete = (val: string) => {
		setDataSource(o => o.filter(item => item.id === val))
	}
	return <div className={styles.main}>
		<Row gutter={16} className={styles['main-cell']}>
			<Col span={6}><span>服务器端口</span></Col>
			<Col span={12}>
				<InputNumber
					ref={inputRef}
					placeholder="请输入服务器端口"
					defaultValue={2000}
				/>
				<Button type="primary" loading={loading} onClick={() => {
					onClick(inputRef.current.getInputDisplayValue())
				}}>{status ? '关闭' : '打开'}</Button>
			</Col>
			<Col span={6}>
				<Button onClick={clear}>清除日志</Button>
			</Col>
		</Row>
		<div className={styles.exp}><Button>导入标签</Button></div>
		<div style={{ marginTop: '20px' }}>
			<Form initialValues={{ id: '' }} layout="inline" style={{ marginBottom: '20px', marginTop: '10px' }} onFinish={onFinish}>
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
			{buttnList.map((o: any) => (<Button key={o.id} type={o.type} style={{ marginBottom: '10px', marginRight: '10px' }} onClick={() => { onSubmit(o.id) }}>
				{o.label}
			</Button>))}
			<Table loading={tableLoading} rowKey={columns => columns.id} size="small" dataSource={dataSource} columns={columns} pagination={false} />
		</div>
	</div>
}

export default connect(({ info }: any) => ({ baseMsg: info.baseMsg }), null, null, { forwardRef: true })(forwardRef(MainView))

